import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const STATIC_PUBLIC_ROUTES = new Set([
  "/",
  "/services",
  "/guide",
  "/areas",
  "/faq",
  "/blog",
  "/thanks",
]);

const DISTRICT_SLUGS = new Set([
  "kwun-tong",
  "sha-tin",
  "mong-kok",
  "sham-shui-po",
  "causeway-bay",
  "north-point",
  "tsuen-wan",
  "yuen-long",
  "tuen-mun",
  "tseung-kwan-o",
]);

interface RouteManifest {
  routes?: string[];
}

function normalizePath(urlPath: string) {
  if (urlPath === "/") return "/";
  return urlPath.replace(/\/+$/, "");
}

function isStaticPublicRoute(urlPath: string) {
  const pathname = normalizePath(urlPath);

  if (STATIC_PUBLIC_ROUTES.has(pathname)) {
    return true;
  }

  const districtMatch = pathname.match(/^\/areas\/([a-z0-9-]+)$/);

  return districtMatch ? DISTRICT_SLUGS.has(districtMatch[1]) : false;
}

function isPotentialBlogRoute(urlPath: string) {
  return /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizePath(urlPath));
}

function getPrerenderFilePath(distPath: string, urlPath: string) {
  const pathname = normalizePath(urlPath);
  const relativePath =
    pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`;

  return path.resolve(distPath, "..", "prerender", relativePath);
}

function loadPrerenderRoutes(distPath: string) {
  const manifestPath = path.resolve(distPath, "..", "prerender", "routes.json");

  try {
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8")
    ) as RouteManifest;

    return new Set((manifest.routes ?? []).map(route => normalizePath(route)));
  } catch (error) {
    console.warn(
      `Unable to load prerender route manifest: ${manifestPath}`,
      error
    );

    return new Set<string>();
  }
}

function applyRobotsHeaders(
  pathname: string,
  isKnownRoute: boolean,
  res: express.Response
) {
  if (pathname === "/thanks") {
    res.set("X-Robots-Tag", "noindex, nofollow");
  } else if (!isKnownRoute) {
    res.set("X-Robots-Tag", "noindex, follow");
  }
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pathname = normalizePath(url.split("?")[0] || "/");

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf8");

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);

      // 開發環境允許合法格式 Blog Slug，實際文章由 Sanity 查詢。
      const isKnownRoute =
        isStaticPublicRoute(pathname) || isPotentialBlogRoute(pathname);

      applyRobotsHeaders(pathname, isKnownRoute, res);

      res
        .status(isKnownRoute ? 200 : 404)
        .set({ "Content-Type": "text/html" })
        .end(page);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(`Could not find build directory: ${distPath}`);
  }

  const prerenderRoutes = loadPrerenderRoutes(distPath);

  app.use(
    express.static(distPath, {
      index: false,
    })
  );

  app.use("*", (req, res) => {
    const pathname = normalizePath(req.originalUrl.split("?")[0] || "/");

    const isKnownRoute =
      isStaticPublicRoute(pathname) || prerenderRoutes.has(pathname);

    applyRobotsHeaders(pathname, isKnownRoute, res);

    if (isKnownRoute && pathname !== "/thanks") {
      const prerenderFile = getPrerenderFilePath(distPath, pathname);

      if (fs.existsSync(prerenderFile)) {
        return res.status(200).sendFile(prerenderFile);
      }

      console.warn(`Prerendered HTML not found for ${pathname}`);
    }

    return res
      .status(isKnownRoute ? 200 : 404)
      .sendFile(path.resolve(distPath, "index.html"));
  });
}
