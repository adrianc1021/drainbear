import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SITE_URL = "https://drainbearhk.com";
const OUTPUT_ROOT = path.resolve("dist/public");
const PRERENDER_META_ROOT = path.resolve("dist/prerender");
const ROUTE_MANIFEST = path.join(PRERENDER_META_ROOT, "routes.json");
const SITEMAP_PATH = path.resolve("dist/public/sitemap.xml");

const SANITY_PROJECT_ID = "oyph9zy1";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-02-19";

const STATIC_ROUTES = [
  "/",
  "/services",
  "/guide",
  "/areas",
  "/faq",
  "/blog",
  "/thanks",
];

const SERVICE_SLUGS = [
  "toilet-unblocking",
  "kitchen-sink-unblocking",
  "high-pressure-jetting",
  "cctv-drain-inspection",
  "main-drain-manhole",
];

const DISTRICT_SLUGS = [
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
];

const STATIC_BLOG_SLUGS = [
  "prevent-kitchen-sink-clog",
  "why-not-drain-cleaner",
  "toilet-clog-emergency-guide",
  "bathroom-hair-clog-prevention",
  "restaurant-grease-trap-guide",
  "village-house-manhole-rainy-season",
  "old-building-backflow-signs",
];

interface PublishedBlogEntry {
  slug: string;
  lastmod?: string;
  source: "static" | "sanity" | "sitemap";
}

interface SanityBlogEntry {
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function normalizeDate(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().slice(0, 10);
}

async function loadPublishedSanityBlogs(): Promise<PublishedBlogEntry[]> {
  const query = `
    *[
      _type == "blogPost" &&
      defined(slug.current) &&
      defined(publishedAt) &&
      publishedAt <= now() &&
      coalesce(seo.noIndex, false) == false
    ] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt,
      "updatedAt": coalesce(updatedAt, _updatedAt, publishedAt)
    }
  `;

  const endpoint = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  );

  endpoint.searchParams.set("query", query);

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Sanity query failed: HTTP ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as {
    result?: SanityBlogEntry[];
  };

  const entries: PublishedBlogEntry[] = [];

  for (const item of payload.result ?? []) {
    const slug = item.slug?.trim().toLowerCase();

    if (!slug) continue;

    if (!isValidSlug(slug)) {
      throw new Error(`Invalid Sanity blog slug: ${slug}`);
    }

    entries.push({
      slug,
      lastmod: normalizeDate(item.updatedAt ?? item.publishedAt),
      source: "sanity",
    });
  }

  return entries;
}

async function loadSitemapBlogFallback(): Promise<PublishedBlogEntry[]> {
  const sitemap = await fs.readFile(
    path.resolve("client/public/sitemap.xml"),
    "utf8"
  );
  const entries: PublishedBlogEntry[] = [];
  const urlPattern = /<url>([\s\S]*?)<\/url>/g;

  for (const match of Array.from(sitemap.matchAll(urlPattern))) {
    const block = match[1];
    const slug = block
      .match(/<loc>https:\/\/drainbearhk\.com\/blog\/([^<]+)<\/loc>/)?.[1]
      ?.trim()
      .toLowerCase();

    if (!slug || !isValidSlug(slug)) continue;

    entries.push({
      slug,
      lastmod: normalizeDate(block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]),
      source: "sitemap",
    });
  }

  return entries;
}

function mergeBlogEntries(
  sanityEntries: PublishedBlogEntry[]
): PublishedBlogEntry[] {
  const entries = new Map<string, PublishedBlogEntry>();

  for (const slug of STATIC_BLOG_SLUGS) {
    entries.set(slug, {
      slug,
      source: "static",
    });
  }

  for (const entry of sanityEntries) {
    entries.set(entry.slug, entry);
  }

  return Array.from(entries.values()).sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );
}

function getOutputPath(route: string) {
  if (route === "/") {
    return path.join(OUTPUT_ROOT, "index.html");
  }

  return path.join(OUTPUT_ROOT, route.slice(1), "index.html");
}

async function waitForServer() {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const response = await fetch(BASE_URL);

      if (response.ok) {
        return;
      }
    } catch {
      // Server may still be starting.
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`Server did not start at ${BASE_URL}`);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function updateSitemap(blogEntries: PublishedBlogEntry[]) {
  let sitemap = await fs.readFile(SITEMAP_PATH, "utf8");

  // Build 每次重新生成全部文章 URL，避免舊 CMS 文章或 noIndex 文章殘留。
  sitemap = sitemap.replace(
    /\s*<url>\s*<loc>https:\/\/drainbearhk\.com\/blog\/[^<]+<\/loc>[\s\S]*?<\/url>/g,
    ""
  );

  const blogXml = blogEntries
    .map(entry => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : "";

      return [
        "  <url>",
        `    <loc>${SITE_URL}/blog/${escapeXml(entry.slug)}</loc>${lastmod}`,
        "    <changefreq>monthly</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  if (!sitemap.includes("</urlset>")) {
    throw new Error("Invalid sitemap.xml: missing </urlset>");
  }

  sitemap = sitemap.replace(
    "</urlset>",
    `${blogXml ? `\n${blogXml}\n` : "\n"}</urlset>`
  );

  await fs.writeFile(SITEMAP_PATH, sitemap, "utf8");

  console.log(
    `Updated sitemap with ${blogEntries.length} published blog routes.`
  );
}

function normalizeRoutePath(value: string) {
  let result = value || "/";

  while (result.length > 1 && result.endsWith("/")) {
    result = result.slice(0, -1);
  }

  return result;
}

async function waitForRouteSeo(page: Page, route: string) {
  const expectedPath = normalizeRoutePath(route);
  const deadline = Date.now() + 30_000;
  let lastState: Record<string, unknown> = {};

  while (Date.now() < deadline) {
    const title = await page.title();
    const canonicalHref = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    const rootText = await page.locator("#root").textContent();
    const seoReady = await page.locator("html").getAttribute("data-seo-ready");
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    const googlebot = await page
      .locator('meta[name="googlebot"]')
      .getAttribute("content");

    let canonicalPath = "";

    if (canonicalHref) {
      canonicalPath = normalizeRoutePath(new URL(canonicalHref).pathname);
    }

    const noindexReady =
      expectedPath !== "/thanks" ||
      Boolean(robots?.includes("noindex") && googlebot?.includes("noindex"));

    lastState = {
      title,
      canonicalPath,
      expectedPath,
      robots,
      googlebot,
      seoReady,
      hasRootContent: Boolean(rootText?.trim()),
    };

    if (
      title &&
      canonicalPath === expectedPath &&
      rootText?.trim() &&
      seoReady === "true" &&
      noindexReady
    ) {
      return;
    }

    await page.waitForTimeout(100);
  }

  throw new Error(
    `Timed out waiting for route SEO: ${route}\n` +
      JSON.stringify(lastState, null, 2)
  );
}

async function getChromiumLaunchOptions() {
  if (process.env.VERCEL !== "1") {
    return {
      headless: true as const,
    };
  }

  const { default: serverlessChromium } = await import("@sparticuz/chromium");

  const executablePath = await serverlessChromium.executablePath();

  console.log("Using @sparticuz/chromium for Vercel prerender.");

  return {
    args: serverlessChromium.args,
    executablePath,
    headless: true as const,
  };
}

async function prerender() {
  // Vite has just created dist/public. Do not remove it here,
  // otherwise compiled assets would be deleted before prerendering.
  await fs.rm(PRERENDER_META_ROOT, {
    recursive: true,
    force: true,
  });

  await fs.mkdir(PRERENDER_META_ROOT, {
    recursive: true,
  });

  await fs.mkdir(OUTPUT_ROOT, {
    recursive: true,
  });

  console.log("Loading published Sanity blog routes...");

  let publishedBlogEntries: PublishedBlogEntry[];
  let blogRouteSource = "Sanity";

  try {
    publishedBlogEntries = await loadPublishedSanityBlogs();
  } catch (error) {
    console.warn(
      "Sanity unavailable; preserving published blog routes from sitemap.",
      error
    );
    publishedBlogEntries = await loadSitemapBlogFallback();
    blogRouteSource = "sitemap fallback";
  }

  const blogEntries = mergeBlogEntries(publishedBlogEntries);

  const routes = [
    ...STATIC_ROUTES,
    ...SERVICE_SLUGS.map(slug => `/services/${slug}`),
    ...DISTRICT_SLUGS.map(slug => `/areas/${slug}`),
    ...blogEntries.map(entry => `/blog/${entry.slug}`),
  ];

  if (new Set(routes).size !== routes.length) {
    throw new Error("Duplicate prerender routes detected.");
  }

  // Server 透過 manifest 判斷 CMS URL 是否為有效路由。
  await fs.writeFile(
    ROUTE_MANIFEST,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        routes,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `Found ${publishedBlogEntries.length} published blog article(s) via ${blogRouteSource}.`
  );

  const server = spawn(process.execPath, ["dist/index.js"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(PORT),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.stdout.on("data", data => {
    process.stdout.write(`[server] ${data}`);
  });

  server.stderr.on("data", data => {
    process.stderr.write(`[server] ${data}`);
  });

  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

  try {
    await waitForServer();

    browser = await chromium.launch(await getChromiumLaunchOptions());

    const page = await browser.newPage();

    for (const route of routes) {
      const response = await page.goto(`${BASE_URL}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });

      if (!response?.ok()) {
        throw new Error(
          `Failed to prerender ${route}: HTTP ${response?.status()}`
        );
      }

      await page.locator("#root > *").first().waitFor({
        state: "attached",
        timeout: 30_000,
      });

      await waitForRouteSeo(page, route);

      await page.waitForTimeout(50);

      const html = await page.content();
      const outputPath = getOutputPath(route);

      await fs.mkdir(path.dirname(outputPath), {
        recursive: true,
      });

      await fs.writeFile(outputPath, html, "utf8");

      console.log(`Prerendered ${route} → ${outputPath}`);
      console.log(`  Title: ${await page.title()}`);
    }

    await page.close();
    await updateSitemap(blogEntries);

    console.log(`Successfully prerendered ${routes.length} routes.`);
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
  }
}

prerender().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
