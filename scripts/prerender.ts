import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
import { DISTRICT_SLUGS, SERVICE_SLUGS } from "../shared/publicRoutes";
import { RECORDED_VIDEO_CASES } from "../shared/recordedVideoCases";
import { writeVideoSitemap } from "./video-artifacts";
import { enableCmsRelay, isLocalOrigin } from "./browser-cms-relay";
import { assessPrerenderSnapshot } from "./prerender-readiness";
import { writeAeoArtifacts, type AeoSnapshot } from "./aeo-artifacts";

// Preferred port only. server/_core/index.ts falls back to the next free port
// when this one is taken, so the real URL is read back from the child's stdout
// rather than assumed — see waitForServer().
const PREFERRED_PORT = 4173;
const SERVER_READY_PATTERN = /Server running on (http:\/\/localhost:\d+\/?)/;

/**
 * 本機專用逃生門。Sanity 專案只把 https://drainbearhk.com 列入 CORS 允許清單，
 * 任何 localhost origin 都會 403，令 CMS 區塊載入失敗；正常情況下
 * assessPrerenderSnapshot() 會（正確地）拒絕發佈 fallback HTML。
 *
 * 注意：enableCmsRelay() 已經處理咗上述 CORS 問題（見該函式註釋），
 * 正常 build 唔再需要呢道門。保留只為極端情況下嘅本機視覺驗收。
 * 這類輸出會帶 <meta name="x-prerender-stale"> 標記，且嚴禁在 CI 使用。
 */
const ALLOW_STALE_CMS = process.argv.includes("--allow-stale");

if (ALLOW_STALE_CMS && process.env.CI) {
  throw new Error(
    "拒絕在 CI 環境使用 --allow-stale：會產生不完整的 CMS 內容。"
  );
}

/** 由 child 自己報出嘅 URL，spawn 之後才會有值。 */
let baseUrl = "";
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
  "/drain-diagnosis",
  "/service-process",
  "/guide",
  "/areas",
  "/faq",
  "/blog",
  "/cases",
  "/thanks",
  "/404",
];

const STATIC_BLOG_SLUGS = [
  "whatsapp-drain-quote-checklist",
  "drain-tool-selection-guide",
  "read-cctv-drain-inspection-report",
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
  source: "static" | "sanity";
}

interface SitemapEntry {
  route: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
  lastmod?: string;
}

interface SanityBlogEntry {
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
}

interface PublishedCaseEntry {
  slug: string;
  lastmod?: string;
  source: "sanity" | "recorded-video";
}

interface SanityCaseEntry {
  slug?: string;
  projectDate?: string;
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
  if (!Array.isArray(payload?.result)) {
    throw new Error(
      "Sanity blog route query returned no valid result array; refusing to publish."
    );
  }

  const entries: PublishedBlogEntry[] = [];

  for (const item of payload.result) {
    const slug = item.slug?.trim().toLowerCase();

    if (!slug || !isValidSlug(slug)) {
      throw new Error(`Invalid Sanity blog slug: ${slug || "(empty)"}`);
    }

    entries.push({
      slug,
      lastmod: normalizeDate(item.updatedAt ?? item.publishedAt),
      source: "sanity",
    });
  }

  return entries;
}

async function loadPublishedSanityCases(): Promise<PublishedCaseEntry[]> {
  const query = `
    *[
      _type == "caseStudy" &&
      defined(slug.current) &&
      defined(projectDate) &&
      coalesce(seo.noIndex, false) == false
    ] | order(projectDate desc) {
      "slug": slug.current,
      projectDate,
      "updatedAt": _updatedAt
    }
  `;
  const endpoint = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  );
  endpoint.searchParams.set("query", query);

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `Sanity case query failed: HTTP ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as { result?: SanityCaseEntry[] };
  if (!Array.isArray(payload?.result)) {
    throw new Error(
      "Sanity case route query returned no valid result array; refusing to publish."
    );
  }
  return payload.result.map(item => {
    const slug = item.slug?.trim().toLowerCase();
    if (!slug || !isValidSlug(slug)) {
      throw new Error(`Invalid Sanity case slug: ${slug || "(empty)"}`);
    }

    return {
      slug,
      lastmod: normalizeDate(item.updatedAt ?? item.projectDate),
      source: "sanity" as const,
    };
  });
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

  // Vercel cleanUrls maps /faq to /faq.html without a redirect cycle.
  return path.join(OUTPUT_ROOT, `${route.slice(1)}.html`);
}

/**
 * 等到「我哋自己 spawn 嘅」server 報出佢真正 listening 嘅 URL。
 *
 * 唔可以盲 fetch 4173：舊 dev server（甚至另一個 checkout 嘅 vite）可能霸住
 * 該埠，令我哋爬錯站、產出錯誤 HTML。所以只認 child stdout 嘅
 * "Server running on http://localhost:PORT/" 一行，並同時監察 child 有否提早死亡。
 */
async function waitForServer(
  readyUrl: Promise<string>,
  exited: Promise<never>
): Promise<string> {
  return Promise.race([readyUrl, exited]);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getSitemapEntries(
  blogEntries: PublishedBlogEntry[],
  caseEntries: PublishedCaseEntry[]
): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { route: "/", changefreq: "weekly", priority: "1.0" },
    { route: "/services", changefreq: "monthly", priority: "0.9" },
    { route: "/drain-diagnosis", changefreq: "monthly", priority: "0.9" },
    { route: "/service-process", changefreq: "monthly", priority: "0.8" },
    ...SERVICE_SLUGS.map(slug => ({
      route: `/services/${slug}`,
      changefreq: "monthly" as const,
      priority: "0.8",
    })),
    { route: "/guide", changefreq: "monthly", priority: "0.9" },
    { route: "/areas", changefreq: "monthly", priority: "0.8" },
    ...DISTRICT_SLUGS.map(slug => ({
      route: `/areas/${slug}`,
      changefreq: "monthly" as const,
      priority: "0.8",
    })),
    { route: "/faq", changefreq: "monthly", priority: "0.7" },
    { route: "/blog", changefreq: "weekly", priority: "0.8" },
    ...blogEntries.map(entry => ({
      route: `/blog/${entry.slug}`,
      lastmod: entry.lastmod,
      changefreq: "monthly" as const,
      priority: "0.7",
    })),
    { route: "/cases", changefreq: "monthly", priority: "0.8" },
    ...caseEntries.map(entry => ({
      route: `/cases/${entry.slug}`,
      lastmod: entry.lastmod,
      changefreq: "monthly" as const,
      priority: "0.7",
    })),
  ];

  return entries;
}

function renderSitemap(entries: SitemapEntry[]) {
  const urls = entries
    .map(entry => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : "";

      return [
        "  <url>",
        `    <loc>${SITE_URL}${escapeXml(entry.route)}</loc>${lastmod}`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

async function updateSitemap(
  blogEntries: PublishedBlogEntry[],
  caseEntries: PublishedCaseEntry[]
) {
  const entries = getSitemapEntries(blogEntries, caseEntries);
  const sitemap = renderSitemap(entries);

  // Build from current published CMS data without mutating the source snapshot.
  await fs.writeFile(SITEMAP_PATH, sitemap, "utf8");

  console.log(
    `Rebuilt sitemap with ${entries.length} indexable URLs (${blogEntries.length} blog routes, ${caseEntries.length} case routes).`
  );
}

async function waitForRouteSeo(page: Page, route: string) {
  const deadline = Date.now() + 30_000;
  let lastState: Record<string, unknown> = {};

  while (Date.now() < deadline) {
    const state = await page.evaluate(() => ({
      title: document.title,
      canonicalHref:
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
        null,
      rootText: document.querySelector("#root")?.textContent ?? null,
      heading: document.querySelector("h1")?.textContent ?? null,
      seoReady: document.documentElement.dataset.seoReady ?? null,
      seoCmsError: document.documentElement.dataset.seoCmsError ?? null,
      cmsLoadingCount: document.querySelectorAll('[data-cms-loading="true"]')
        .length,
      cmsErrorCount: document.querySelectorAll('[data-cms-error="true"]')
        .length,
      robots:
        document
          .querySelector('meta[name="robots"]')
          ?.getAttribute("content") ?? null,
      googlebot:
        document
          .querySelector('meta[name="googlebot"]')
          ?.getAttribute("content") ?? null,
    }));
    const result = assessPrerenderSnapshot(state, route, SITE_URL);
    lastState = { ...state, rootText: state.rootText?.slice(0, 300), result };
    if (result.error)
      throw new Error(`Unsafe prerender for ${route}: ${result.error}`);
    if (result.ready) return;

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
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
        : {}),
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
  console.log("Loading current published Sanity blog and case routes...");

  // A stale sitemap cannot prove that newly published URLs are accounted for.
  // Both CMS queries must succeed before modifying artifacts or rendering.
  const [publishedBlogEntries, sanityCaseEntries] = await Promise.all([
    loadPublishedSanityBlogs(),
    loadPublishedSanityCases(),
  ]);
  const caseEntries: PublishedCaseEntry[] = [
    ...RECORDED_VIDEO_CASES.map(study => ({
      slug: study.slug,
      lastmod: normalizeDate(study.publishedAt),
      source: "recorded-video" as const,
    })),
    ...sanityCaseEntries,
  ];
  const blogEntries = mergeBlogEntries(publishedBlogEntries);

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

  const routes = [
    ...STATIC_ROUTES,
    ...SERVICE_SLUGS.map(slug => `/services/${slug}`),
    ...DISTRICT_SLUGS.map(slug => `/areas/${slug}`),
    ...blogEntries.map(entry => `/blog/${entry.slug}`),
    ...caseEntries.map(entry => `/cases/${entry.slug}`),
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
    `Found ${publishedBlogEntries.length} published blog article(s) via Sanity.`
  );
  console.log(
    `Found ${sanityCaseEntries.length} CMS cases and ${RECORDED_VIDEO_CASES.length} reviewed video records.`
  );

  const server = spawn(process.execPath, ["dist/index.js"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(PREFERRED_PORT),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  // child 一旦報出 listening URL 就 resolve；提早死亡則 reject，
  // 唔會再由 60 次 fetch 輪詢（嗰個輪詢正正係爬錯站嘅成因）。
  let settleReady: (url: string) => void = () => {};
  let settleExit: (err: Error) => void = () => {};
  const serverReady = new Promise<string>(resolve => {
    settleReady = resolve;
  });
  const serverExited = new Promise<never>((_, reject) => {
    settleExit = reject;
  });
  let sawReadyLine = false;

  server.stdout.on("data", data => {
    const text = data.toString();
    process.stdout.write(`[server] ${text}`);

    const match = text.match(SERVER_READY_PATTERN);
    if (match && !sawReadyLine) {
      sawReadyLine = true;
      // 只認 child 自己報嘅埠；若佢因埠被佔而另揀埠，我哋照跟。
      settleReady(match[1].replace(/\/$/, ""));
    }
  });

  server.stderr.on("data", data => {
    process.stderr.write(`[server] ${data}`);
  });

  server.on("error", err => {
    settleExit(new Error(`無法啟動 prerender server：${err.message}`));
  });

  server.on("exit", code => {
    if (!sawReadyLine) {
      settleExit(
        new Error(
          `prerender server 未及 listening 就結束（exit ${code}）。` +
            `最常見成因：埠 ${PREFERRED_PORT} 被佔用。`
        )
      );
    }
  });

  if (ALLOW_STALE_CMS) {
    console.warn(
      "\n⚠️  --allow-stale：已略過 CMS 完整性關卡。\n" +
        "    產出的 HTML 含 fallback CMS 區塊，只可用作本機視覺驗收，\n" +
        '    絕不可部署。（已加 <meta name="x-prerender-stale"> 標記）\n'
    );
  }

  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

  try {
    baseUrl = await waitForServer(serverReady, serverExited);

    browser = await chromium.launch(await getChromiumLaunchOptions());

    const context = await browser.newContext();

    if (isLocalOrigin(baseUrl)) {
      await enableCmsRelay(context, new URL(baseUrl).origin);
    }

    const page = await context.newPage();
    const aeoSnapshots: AeoSnapshot[] = [];

    for (const route of routes) {
      const response = await page.goto(`${baseUrl}${route}`, {
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

      if (ALLOW_STALE_CMS) {
        // 只作本機視覺驗收：略過 CMS 關卡時唔會等 seo-ready，
        // 所以固定等一段時間讓頁面渲染完。呢類輸出一律當成
        // fallback 內容，唔可以出街。
        await page.waitForTimeout(3000);
      } else {
        await waitForRouteSeo(page, route);
      }

      await page.waitForTimeout(50);

      // Build AI indexes from the same resolved, public HTML as search engines.
      aeoSnapshots.push(
        await page.evaluate(
          ({ route, siteUrl }) => {
            const main = document.querySelector("main")?.cloneNode(true) as
              | HTMLElement
              | undefined;
            main
              ?.querySelectorAll(
                "script, style, [aria-hidden='true'], .contact-actions"
              )
              .forEach(node => node.remove());
            return {
              route,
              url:
                document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
                  ?.href || "",
              title: document.title,
              description:
                document.querySelector<HTMLMetaElement>(
                  'meta[name="description"]'
                )?.content || "",
              language: document.documentElement.lang,
              robots:
                document.querySelector<HTMLMetaElement>('meta[name="robots"]')
                  ?.content || "",
              text: main?.textContent?.replace(/\s+/g, " ").trim() || "",
              ids: Array.from(document.querySelectorAll("main [id]")).map(
                node => node.id
              ),
              links: Array.from(
                document.querySelectorAll<HTMLAnchorElement>("main a[href]")
              ).map(
                link =>
                  new URL(link.getAttribute("href")!, siteUrl + route).href
              ),
              structuredData: Array.from(
                document.querySelectorAll('script[type="application/ld+json"]')
              ).map(node => JSON.parse(node.textContent || "null")),
              phoneDisplay:
                document.querySelector("main .contact-action--phone strong")
                  ?.textContent || undefined,
            };
          },
          { route, siteUrl: SITE_URL }
        )
      );

      let html = await page.content();
      const outputPath = getOutputPath(route);

      // 護欄：產品建置的 HTML 只會有 hashed bundle，絕不會出現 dev server 痕跡。
      // 若出現，代表我哋爬錯站（例如埠被另一個 dev server 佔用），必須即刻中止，
      // 否則會靜靜地寫入錯誤 HTML。
      const devServerArtifacts = [
        "/@vite/client",
        "/src/main.tsx",
        "/__manus__/debug-collector.js",
      ].filter(marker => html.includes(marker));

      if (devServerArtifacts.length) {
        throw new Error(
          `Prerender 產出含 dev server 痕跡（${devServerArtifacts.join(", ")}）於 ${route}。` +
            `表示 ${baseUrl} 並非本次建置的 production server。`
        );
      }

      if (ALLOW_STALE_CMS) {
        // 明確標記，令 stale 輸出永遠呃唔到人。
        // server 係由 dist/public 讀返上一次嘅 HTML 出嚟，所以呢個標記必須
        // 先清後加：否則每重跑一次 prerender 就會多疊一個，永遠清唔走。
        html = html
          .replace(
            /^[ \t]*<meta name="x-prerender-stale"[^>]*>[ \t]*\r?\n?/gm,
            ""
          )
          .replace(
            "<head>",
            '<head>\n    <meta name="x-prerender-stale" content="cms-unavailable-local-verification-only">'
          );
      }

      await fs.mkdir(path.dirname(outputPath), {
        recursive: true,
      });

      await fs.writeFile(outputPath, html, "utf8");

      console.log(`Prerendered ${route} → ${outputPath}`);
      console.log(`  Title: ${await page.title()}`);
    }

    await context.close();
    await updateSitemap(blogEntries, caseEntries);
    await writeVideoSitemap(OUTPUT_ROOT);
    if (!ALLOW_STALE_CMS)
      await writeAeoArtifacts(aeoSnapshots, SITE_URL, OUTPUT_ROOT);

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
