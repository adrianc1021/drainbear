import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_ROOT = path.resolve("dist/prerender");

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

const BLOG_SLUGS = [
  "prevent-kitchen-sink-clog",
  "why-not-drain-cleaner",
  "toilet-clog-emergency-guide",
  "bathroom-hair-clog-prevention",
  "restaurant-grease-trap-guide",
  "village-house-manhole-rainy-season",
  "old-building-backflow-signs",
  "hong-kong-drain-cleaning-price-guide",
  "drain-cleaning-scam-prevention-hong-kong",
];

const ROUTES = [
  "/",
  "/services",
  "/guide",
  "/areas",
  ...DISTRICT_SLUGS.map(slug => `/areas/${slug}`),
  "/faq",
  "/blog",
  ...BLOG_SLUGS.map(slug => `/blog/${slug}`),
];

function getOutputPath(route: string) {
  if (route === "/") {
    return path.join(OUTPUT_ROOT, "index.html");
  }

  return path.join(OUTPUT_ROOT, `${route.slice(1)}.html`);
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

async function prerender() {
  await fs.rm(OUTPUT_ROOT, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

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

    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    for (const route of ROUTES) {
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

      await page.waitForFunction(() => {
        const canonical = document.querySelector<HTMLLinkElement>(
          'link[rel="canonical"]'
        );

        return Boolean(
          document.title &&
            canonical?.href &&
            document.querySelector("#root")?.textContent?.trim() &&
            document.documentElement.dataset.seoReady === "true"
        );
      });

      // SEO effect 已明確標記完成；短暫等待瀏覽器完成 DOM serialization。
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

    console.log(`Successfully prerendered ${ROUTES.length} routes.`);
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
  }
}

prerender().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
