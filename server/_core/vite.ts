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
      const isKnownRoute = isKnownPublicRoute(req.path);
      const statusCode = isKnownRoute ? 200 : 404;

      if (normalizePath(req.path) === "/thanks") {
        res.set("X-Robots-Tag", "noindex, nofollow");
      } else if (!isKnownRoute) {
        res.set("X-Robots-Tag", "noindex, follow");
      }

      res
        .status(statusCode)
        .set({ "Content-Type": "text/html" })
        .end(page);
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

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
// React SPA fallback：只讓真正存在的公開頁面回傳200
app.use("*", (req, res) => {
  const pathname = normalizePath(req.path);
  const isKnownRoute = isKnownPublicRoute(pathname);

  if (pathname === "/thanks") {
    res.set("X-Robots-Tag", "noindex, nofollow");
  } else if (!isKnownRoute) {
    res.set("X-Robots-Tag", "noindex, follow");
  }

  res
    .status(isKnownRoute ? 200 : 404)
    .sendFile(path.resolve(distPath, "index.html"));
});
}
