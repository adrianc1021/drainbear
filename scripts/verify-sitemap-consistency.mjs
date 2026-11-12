import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://drainbearhk.com";
const DIST_SITEMAP_PATH = path.resolve("dist/public/sitemap.xml");
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

function extractHtmlTitle(html) {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
}

function extractVisibleText(fragment) {
  return fragment
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMainText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return main ? extractVisibleText(main[1]) : "";
}

function extractH1(html) {
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return heading ? extractVisibleText(heading[1]) : "";
}

function toSet(values) {
  return new Set(values.map(normalizePath));
}

function difference(left, right) {
  return [...left].filter(value => !right.has(value));
}

const [distSitemap, manifestText] = await Promise.all([
  fs.readFile(DIST_SITEMAP_PATH, "utf8"),
  fs.readFile(ROUTE_MANIFEST_PATH, "utf8"),
]);

if (!distSitemap.includes("</urlset>")) {
  throw new Error("sitemap.xml 缺少 </urlset>");
}

const rawUrls = extractSitemapUrls(distSitemap);
const sitemapRoutes = toSet(rawUrls);
const manifest = JSON.parse(manifestText);
const manifestRoutes = toSet(manifest.routes ?? []);
const indexableRoutes = new Set(
  [...manifestRoutes].filter(route => !["/thanks", "/404"].includes(route))
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
      missingFromSitemap.length ? `缺少: ${missingFromSitemap.join(", ")}` : "",
      extraInSitemap.length ? `多出: ${extraInSitemap.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );
}

const pageTitles = new Map();

for (const route of sitemapRoutes) {
  const expectedUrl = `${SITE_URL}${route === "/" ? "/" : route}`;
  const matchedUrl = rawUrls.find(url => normalizePath(url) === route);

  if (matchedUrl !== expectedUrl) {
    throw new Error(`${route} sitemap URL 不一致: ${matchedUrl}`);
  }

  const htmlPath =
    route === "/"
      ? path.join(OUTPUT_ROOT, "index.html")
      : path.join(OUTPUT_ROOT, `${route.slice(1)}.html`);
  const html = await fs.readFile(htmlPath, "utf8");
  // Mobile hero requests must be discovered in the homepage HTML head only.
  // Never pay this image cost on service, article or district landings.
  const heroPreloads = Array.from(
    html.matchAll(/<link\\b[^>]*data-mobile-hero-preload="true"[^>]*>/g),
    match => match[0]
  );
  if (route === "/") {
    if (
      heroPreloads.length !== 2 ||
      !heroPreloads.every(link => link.includes('fetchpriority="high"')) ||
      !heroPreloads.some(link => link.includes('media="(max-width: 479px)"')) ||
      !heroPreloads.some(link => link.includes('(min-width: 480px) and (max-width: 767px)'))
    ) {
      throw new Error("Homepage responsive mobile hero preloads are missing or malformed");
    }
  } else if (heroPreloads.length) {
    throw new Error(`${route}: homepage hero must not be preloaded on non-home routes`);
  }
  const robots = extractMetaContent(html, "robots")?.toLowerCase() ?? "";
  const googlebot = extractMetaContent(html, "googlebot")?.toLowerCase() ?? "";
  const canonical = extractCanonical(html);
  const title = extractHtmlTitle(html);
  const description = extractMetaContent(html, "description");
  const h1 = extractH1(html);
  const mainText = extractMainText(html);

  if (robots.includes("noindex") || googlebot.includes("noindex")) {
    throw new Error(`${route} sitemap URL 對應 HTML 設定了 noindex`);
  }

  // Catch soft-404-style or incomplete pre-rendered documents before
  // publishing them as discoverable URLs in sitemap.xml.
  if (!title || !h1 || !description || mainText.length < 200) {
    throw new Error(
      `${route} 頁面內容不完整：title=${Boolean(title)}, h1=${Boolean(h1)}, description=${Boolean(description)}, mainText=${mainText.length}`
    );
  }
  if (!html.includes('data-seo-ready="true"')) {
    throw new Error(`${route} 預先渲染 SEO 未準備好`);
  }
  const duplicateRoute = pageTitles.get(title);
  if (duplicateRoute) {
    throw new Error(`${route} 與 ${duplicateRoute} 使用相同 title：${title}`);
  }
  pageTitles.set(title, route);

  if (canonical !== expectedUrl) {
    throw new Error(
      `${route} canonical 不一致: 預期 ${expectedUrl}，實際 ${canonical ?? "缺少"}`
    );
  }
}

console.log(
  `PASS：sitemap、prerender manifest、HTML title/H1/內文/description/canonical/robots 一致（${sitemapRoutes.size} 個可索引 URL）`
);
