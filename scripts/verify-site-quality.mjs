// Run with Node 24. Use AXE_CORE_PATH for an externally installed axe-core 4.x.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { SERVICE_SLUGS, DISTRICT_SLUGS } from "../shared/publicRoutes.ts";
import { enableCmsRelay } from "./browser-cms-relay.ts";

const output = process.env.SITE_QUALITY_OUTPUT || "/tmp/drainbear-site-quality";
const axePath = process.env.AXE_CORE_PATH;
const layoutOnly = process.argv.includes("--layout-only");
if (!layoutOnly && (!axePath || !existsSync(axePath)))
  throw new Error(
    "Set AXE_CORE_PATH to a trusted installation of axe-core/axe.min.js, or explicitly use --layout-only."
  );
await fs.mkdir(output, { recursive: true });
const routes = [
  "/",
  "/services",
  "/guide",
  "/areas",
  "/faq",
  "/service-process",
  "/drain-diagnosis",
  "/blog",
  "/cases",
  ...SERVICE_SLUGS.map(slug => `/services/${slug}`),
  ...DISTRICT_SLUGS.map(slug => `/areas/${slug}`),
];
const visualRoutes = [
  "/",
  "/services",
  "/guide",
  "/areas",
  "/faq",
  "/service-process",
  "/drain-diagnosis",
  "/blog",
  "/cases",
  "/services/toilet-unblocking",
  "/services/cctv-drain-inspection",
  "/areas/kwun-tong",
  "/areas/tai-po",
];
// Read current public records; exercise article and case templates without fixtures.
const endpoint = new URL(
  "https://oyph9zy1.api.sanity.io/v2025-02-19/data/query/production"
);
endpoint.searchParams.set(
  "query",
  `{
  "blogs": *[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && coalesce(seo.noIndex, false) == false] | order(publishedAt desc) {"slug": slug.current},
  "cases": *[_type == "caseStudy" && defined(slug.current) && defined(projectDate) && coalesce(seo.noIndex, false) == false] | order(projectDate desc) {"slug": slug.current}
}`
);
const cmsResponse = await fetch(endpoint, {
  signal: AbortSignal.timeout(30_000),
});
assert(cmsResponse.ok, `CMS route discovery: HTTP ${cmsResponse.status}`);
const published = (await cmsResponse.json()).result;
assert(
  Array.isArray(published?.blogs) && Array.isArray(published?.cases),
  "valid CMS route lists"
);
for (const [prefix, records] of [
  ["/blog", published.blogs],
  ["/cases", published.cases],
]) {
  for (const record of records) {
    assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    routes.push(`${prefix}/${record.slug}`);
  }
  if (records.length) visualRoutes.push(`${prefix}/${records[0].slug}`);
}
const widths = [320, 390, 768, 1024, 1440];
const server = spawn(
  process.execPath,
  ["--import", "tsx", "server/_core/index.ts"],
  {
    env: { ...process.env, NODE_ENV: "development", PORT: "4400" },
    stdio: ["ignore", "pipe", "pipe"],
  }
);
let logs = "";
let serverUrl;
const ready = new Promise((resolve, reject) => {
  const timer = setTimeout(
    () => reject(new Error(`Startup timeout: ${logs}`)),
    30000
  );
  server.stdout.on("data", data => {
    logs += data.toString();
    const match = logs.match(/Server running on (http:\/\/localhost:\d+)/);
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
  server.stderr.on("data", data => {
    logs += data.toString();
  });
  server.once("error", error => {
    clearTimeout(timer);
    reject(error);
  });
  server.once("exit", code => {
    clearTimeout(timer);
    if (!serverUrl) reject(new Error(`Server exited ${code}: ${logs}`));
  });
});
const failures = [];
const results = [];
let browser;
try {
  serverUrl = await ready;
  for (const route of routes) {
    const response = await fetch(`${serverUrl}${route}`);
    assert.equal(response.status, 200, `${route} must return HTTP 200`);
  }
  for (const route of [
    "/services/not-a-service",
    "/areas/not-a-district",
    "/missing-page",
  ]) {
    const response = await fetch(`${serverUrl}${route}`);
    assert.equal(response.status, 404, `${route} must return a real 404`);
    assert.match(response.headers.get("x-robots-tag"), /noindex/);
  }
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : existsSync("/usr/bin/chromium")
        ? { executablePath: "/usr/bin/chromium" }
        : {}),
  });
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: width <= 390 ? 667 : 900 },
      reducedMotion: "reduce",
    });
    await enableCmsRelay(page.context(), serverUrl);
    // Block outbound analytics, not CMS. Failed CMS reads stay visible as failures.
    await page.route(
      /https:\/\/(?:www\.googletagmanager\.com|.*google-analytics\.com)\//,
      route => route.abort()
    );
    for (const route of visualRoutes) {
      const errors = [];
      const onError = error => errors.push(error.message);
      page.on("pageerror", onError);
      await page.goto(`${serverUrl}${route}`, {
        waitUntil: "domcontentloaded",
      });
      await page.locator("main h1").waitFor({ state: "visible" });
      await page.waitForFunction(
        () => document.documentElement.dataset.seoReady === "true"
      );
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      const state = await page.evaluate(() => {
        const problems = [];
        if (document.documentElement.scrollWidth > innerWidth + 2)
          problems.push("document has horizontal overflow");
        for (const element of document.querySelectorAll(
          "main h1, main h2, main h3, .contact-action"
        )) {
          const style = getComputedStyle(element);
          if (style.display === "none" || style.visibility === "hidden")
            continue;
          const box = element.getBoundingClientRect();
          if (box.left < -2 || box.right > innerWidth + 2)
            problems.push(`outside viewport: ${element.textContent.trim()}`);
        }
        const contact = document.querySelector("main .contact-actions");
        const rect = contact?.getBoundingClientRect();
        if (
          rect &&
          (rect.top < 72 ||
            rect.bottom > innerHeight - (innerWidth < 768 ? 80 : 0))
        )
          problems.push(
            "hero contact actions are not fully within the first fold"
          );
        const schemas = [];
        const collect = value => {
          if (Array.isArray(value)) value.forEach(collect);
          else if (value && typeof value === "object") {
            schemas.push(value);
            if (value["@graph"]) collect(value["@graph"]);
          }
        };
        for (const script of document.querySelectorAll(
          'script[type="application/ld+json"]'
        )) {
          try {
            collect(JSON.parse(script.textContent));
          } catch {
            problems.push("invalid JSON-LD");
          }
        }
        const business = schemas.find(item => item["@type"] === "Plumber");
        const website = schemas.find(item => item["@type"] === "WebSite");
        const webpage = schemas.find(item => item["@type"] === "WebPage");
        if (
          !business ||
          !website ||
          !webpage ||
          webpage.about?.["@id"] !== business["@id"] ||
          webpage.isPartOf?.["@id"] !== website["@id"] ||
          website.publisher?.["@id"] !== business["@id"]
        )
          problems.push("missing or disconnected business/website/page schema");
        const normalize = text => (text || "").replace(/\s+/g, "");
        const content = normalize(document.querySelector("main")?.textContent);
        for (const faq of schemas.filter(item => item["@type"] === "FAQPage")) {
          for (const question of faq.mainEntity || []) {
            if (
              !content.includes(normalize(question.name)) ||
              !content.includes(normalize(question.acceptedAnswer?.text))
            )
              problems.push(
                `FAQ schema differs from page content: ${question.name}`
              );
          }
        }
        for (const service of schemas.filter(
          item => item["@type"] === "Service"
        )) {
          const phone = service.availableChannel?.servicePhone;
          if (
            phone &&
            (phone["@type"] !== "ContactPoint" ||
              phone.telephone !== business?.telephone)
          )
            problems.push(
              "service telephone schema does not match the business"
            );
        }
        return {
          problems,
          h1: document.querySelectorAll("main h1").length,
          title: document.title,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          cmsFailed:
            document.documentElement.dataset.seoCmsError === "true" ||
            Boolean(document.querySelector('[data-cms-error="true"]')),
        };
      });
      if (state.h1 !== 1)
        state.problems.push(`expected one H1, got ${state.h1}`);
      if (state.canonical !== `https://drainbearhk.com${route}`)
        state.problems.push(`wrong canonical: ${state.canonical}`);
      if (errors.length)
        state.problems.push(...errors.map(error => `JS error: ${error}`));
      let violations = [];
      if (!layoutOnly && [390, 1440].includes(width)) {
        await page.addScriptTag({ path: axePath });
        const audit = await page.evaluate(async () =>
          window.axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
            },
          })
        );
        violations = audit.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map(n => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        }));
        if (violations.length)
          state.problems.push(...violations.map(v => `axe: ${v.id}`));
      }
      if (state.problems.length)
        failures.push({ route, width, problems: state.problems, violations });
      results.push({ route, width, ...state, violations });
      if (
        ["/", "/services", "/guide", "/areas"].includes(route) &&
        [390, 1440].includes(width)
      ) {
        await page.screenshot({
          path: `${output}/${route === "/" ? "home" : route.slice(1)}-${width}.png`,
          fullPage: true,
        });
      }
      page.off("pageerror", onError);
      console.log(
        `${state.problems.length ? "FAIL" : "PASS"} ${width}px ${route}${state.cmsFailed ? " (live CMS unavailable)" : ""}`
      );
    }
    await page.close();
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.goto(`${serverUrl}/`);
  await page.locator("main h1").waitFor({ state: "visible" });
  await page.keyboard.press("Tab");
  assert.match(
    await page.evaluate(() => document.activeElement.textContent),
    /跳到主要內容/
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "main-content"
  );
  await page.getByRole("button", { name: "開啟選單" }).click();
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("data-mobile-nav-link")
    ),
    "true"
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "開啟選單" })
      .getAttribute("aria-expanded"),
    "false"
  );
  await page.goto(`${serverUrl}/areas`);
  await page.getByLabel("輸入地區或屋苑附近地點").fill("觀塘");
  assert(
    await page
      .locator("#area-search-results")
      .getByRole("link", { name: /觀塘通渠/ })
      .count()
  );
  await page.goto(`${serverUrl}/drain-diagnosis`);
  for (const name of [
    "企缸／浴室去水",
    "污水或積水倒灌",
    "同一單位多個位置",
    "有污水外溢或倒灌",
  ])
    await page.getByRole("button", { name }).click();
  await page
    .getByRole("heading", { name: "先控制外溢風險，再確認堵塞範圍" })
    .waitFor();
  const whatsapp = await page
    .getByRole("link", { name: "將判斷結果傳給師傅" })
    .getAttribute("href");
  assert(decodeURIComponent(whatsapp).includes("污水或積水倒灌"));
  await page.close();
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await enableCmsRelay(desktop.context(), serverUrl);
  await desktop.goto(`${serverUrl}/`);
  await desktop.getByRole("button", { name: "開啟 WhatsApp 對話框" }).click();
  await desktop
    .getByRole("button", { name: "關閉對話框", exact: true })
    .waitFor();
  assert.equal(
    await desktop.evaluate(() =>
      document.activeElement.getAttribute("aria-label")
    ),
    "關閉對話框"
  );
  if (!layoutOnly) {
    await desktop.addScriptTag({ path: axePath });
    const audit = await desktop.evaluate(async () =>
      window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      })
    );
    assert.deepEqual(
      audit.violations.map(item => item.id),
      [],
      "open WhatsApp panel accessibility"
    );
  }
  await desktop.keyboard.press("Escape");
  assert.equal(
    await desktop.evaluate(() =>
      document.activeElement.getAttribute("aria-label")
    ),
    "開啟 WhatsApp 對話框"
  );
  await desktop.close();
  console.log(
    "PASS keyboard skip link, mobile navigation, district search and diagnosis handoff"
  );
} finally {
  await fs.writeFile(
    `${output}/results.json`,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        mode: layoutOnly ? "layout only" : "layout and axe",
        results,
        failures,
      },
      null,
      2
    )
  );
  await browser?.close();
  server.kill("SIGTERM");
}
if (failures.length)
  throw new Error(
    `${failures.length} checks failed; inspect ${output}/results.json`
  );
console.log(
  `PASS ${routes.length} routes, ${results.length} responsive checks${layoutOnly ? "" : `, ${visualRoutes.length * 2 + 1} axe audits`}; authenticated CMS editing and search indexing are not covered by these checks.`
);
