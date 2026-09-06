import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://drainbearhk.com";
const DIST_SITEMAP_PATH = path.resolve("dist/public/sitemap.xml");
const SOURCE_SITEMAP_PATH = path.resolve("client/public/sitemap.xml");
const ROUTE_MANIFEST_PATH = path.resolve("dist/prerender/routes.json");
const OUTPUT_ROOT = path.resolve("dist/public");

function normalizePath(value) {
  const pathname = new URL(value, SITE_URL).pathname;

  if (pathname === "/") return "/";

  return pathname.replace(/\/+$/, "");
}

function extractSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), match => match[1]);
}

function extractMetaContent(html, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(
    new RegExp(
      `<meta[^>]+name=["']${escapedName}["'][^>]+content=["']([^"']+)["']`,
      "i"
    )
  )?.[1];
}

function extractCanonical(html) {
  return html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
  )?.[1];
}

function toSet(values) {
  return new Set(values.map(normalizePath));
}

function difference(left, right) {
  return [...left].filter(value => !right.has(value));
}

const [distSitemap, sourceSitemap, manifestText] = await Promise.all([
  fs.readFile(DIST_SITEMAP_PATH, "utf8"),
  fs.readFile(SOURCE_SITEMAP_PATH, "utf8"),
  fs.readFile(ROUTE_MANIFEST_PATH, "utf8"),
]);

if (distSitemap !== sourceSitemap) {
  throw new Error("dist/public/sitemap.xml 與 client/public/sitemap.xml 不一致");
}

if (!distSitemap.includes("</urlset>")) {
  throw new Error("sitemap.xml 缺少 </urlset>");
}

const rawUrls = extractSitemapUrls(distSitemap);
const sitemapRoutes = toSet(rawUrls);
const manifest = JSON.parse(manifestText);
const manifestRoutes = toSet(manifest.routes ?? []);
const indexableRoutes = new Set(
  [...manifestRoutes].filter(route => route !== "/thanks")
);

if (rawUrls.length !== sitemapRoutes.size) {
  throw new Error("sitemap.xml 含有重複 URL");
}

const missingFromSitemap = difference(indexableRoutes, sitemapRoutes);
const extraInSitemap = difference(sitemapRoutes, indexableRoutes);

if (missingFromSitemap.length || extraInSitemap.length) {
  throw new Error(
    [
      "sitemap 與 prerender routes 不一致。",
      missingFromSitemap.length
        ? `缺少: ${missingFromSitemap.join(", ")}`
        : "",
      extraInSitemap.length
        ? `多出: ${extraInSitemap.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n")
  );
}

for (const route of sitemapRoutes) {
  const expectedUrl = `${SITE_URL}${route === "/" ? "/" : route}`;
  const matchedUrl = rawUrls.find(url => normalizePath(url) === route);

  if (matchedUrl !== expectedUrl) {
    throw new Error(`${route} sitemap URL 不一致: ${matchedUrl}`);
  }

  const htmlPath = route === "/"
    ? path.join(OUTPUT_ROOT, "index.html")
    : path.join(OUTPUT_ROOT, `${route.slice(1)}.html`);
  const html = await fs.readFile(htmlPath, "utf8");
  const robots = extractMetaContent(html, "robots")?.toLowerCase() ?? "";
  const googlebot = extractMetaContent(html, "googlebot")?.toLowerCase() ?? "";
  const canonical = extractCanonical(html);

  if (robots.includes("noindex") || googlebot.includes("noindex")) {
    throw new Error(`${route} sitemap URL 對應 HTML 設定了 noindex`);
  }

  if (canonical !== expectedUrl) {
    throw new Error(
      `${route} canonical 不一致: 預期 ${expectedUrl}，實際 ${canonical ?? "缺少"}`
    );
  }
}

console.log(
  `PASS：sitemap、prerender manifest、HTML canonical/robots 一致（${sitemapRoutes.size} 個可索引 URL）`
);
