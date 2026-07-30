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

const BLOG_SLUGS = new Set([
  "prevent-kitchen-sink-clog",
  "why-not-drain-cleaner",
  "toilet-clog-emergency-guide",
  "bathroom-hair-clog-prevention",
  "restaurant-grease-trap-guide",
  "village-house-manhole-rainy-season",
  "old-building-backflow-signs",
]);

function normalizePath(urlPath: string) {
  if (urlPath === "/") return "/";
  return urlPath.replace(/\/+$/, "");
}

function isKnownPublicRoute(urlPath: string) {
  const pathname = normalizePath(urlPath);

  if (STATIC_PUBLIC_ROUTES.has(pathname)) {
    return true;
  }

  const districtMatch = pathname.match(/^\/areas\/([^/]+)$/);
  if (districtMatch) {
    return DISTRICT_SLUGS.has(districtMatch[1]);
  }

  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return BLOG_SLUGS.has(blogMatch[1]);
  }

  return false;
}

function getPrerenderFilePath(distPath: string, urlPath: string) {
  const pathname = normalizePath(urlPath);

  const relativePath =
    pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`;

  return path.resolve(distPath, "..", "prerender", relativePath);
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

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      const isKnownRoute = isKnownPublicRoute(pathname);
      const statusCode = isKnownRoute ? 200 : 404;

      if (pathname === "/thanks") {
        res.set("X-Robots-Tag", "noindex, nofollow");
      } else if (!isKnownRoute) {
        res.set("X-Robots-Tag", "noindex, follow");
      }

      res.status(statusCode).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // index:false 防止 Express 對首頁自動回傳原本的 SPA index.html。
  // 首頁需要交由下面的 handler 回傳預渲染版本。
  app.use(
    express.static(distPath, {
      index: false,
    })
  );

  app.use("*", (req, res) => {
    const pathname = normalizePath(req.originalUrl.split("?")[0] || "/");

    const isKnownRoute = isKnownPublicRoute(pathname);

    if (pathname === "/thanks") {
      res.set("X-Robots-Tag", "noindex, nofollow");
    } else if (!isKnownRoute) {
      res.set("X-Robots-Tag", "noindex, follow");
    }

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
