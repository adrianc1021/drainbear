import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const PORT = Number(process.env.TEXT_LAYOUT_TEST_PORT || 4218);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SCREENSHOT_DIR = "/tmp/drainbear-text-layout";
const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 720, isMobile: true },
  { name: "mobile-390", width: 390, height: 844, isMobile: true },
  { name: "desktop-1280", width: 1280, height: 900, isMobile: false },
  { name: "wide-1800", width: 1800, height: 1100, isMobile: false },
];

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 45_000) {
    try {
      if ((await fetch(`${BASE_URL}/`)).ok) return;
    } catch {
      // Wait for the production server.
    }

    await sleep(250);
  }

  throw new Error(`Production server did not start at ${BASE_URL}`);
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const isVisible = element => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const clippedControls = [];
    const textOverflows = [];

    for (const element of document.querySelectorAll("a, button")) {
      if (
        !isVisible(element) ||
        !element.textContent?.trim() ||
        element.className?.toString().includes("truncate") ||
        element.className?.toString().includes("line-clamp")
      ) {
        continue;
      }

      const style = window.getComputedStyle(element);
      const clipsContent = ["hidden", "clip"].includes(style.overflowX) ||
        ["hidden", "clip"].includes(style.overflowY);

      if (
        clipsContent &&
        (element.scrollWidth > element.clientWidth + 2 ||
          element.scrollHeight > element.clientHeight + 2)
      ) {
        clippedControls.push(
          element.textContent.trim().replace(/\s+/g, " ").slice(0, 100)
        );
      }
    }

    for (const element of document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, li, dt, dd"
    )) {
      if (
        !isVisible(element) ||
        !element.textContent?.trim() ||
        element.className?.toString().includes("truncate") ||
        element.className?.toString().includes("line-clamp")
      ) {
        continue;
      }

      if (element.scrollWidth > element.clientWidth + 2) {
        textOverflows.push(
          element.textContent.trim().replace(/\s+/g, " ").slice(0, 100)
        );
      }
    }

    const h1 = document.querySelector("h1");
    const h1Rect = h1?.getBoundingClientRect();
    const h1ParentRect = h1?.parentElement?.getBoundingClientRect();
    const heroMedia = document.querySelector(
      '[data-pr20-section="hero"] .db-media'
    );
    const mediaRect = heroMedia?.getBoundingClientRect();
    const h1OverlapsHeroMedia = Boolean(
      h1Rect &&
        mediaRect &&
        h1Rect.left < mediaRect.right &&
        h1Rect.right > mediaRect.left &&
        h1Rect.top < mediaRect.bottom &&
        h1Rect.bottom > mediaRect.top
    );

    return {
      horizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      h1BeyondParent: Boolean(
        h1Rect &&
          h1ParentRect &&
          (h1Rect.left < h1ParentRect.left - 2 ||
            h1Rect.right > h1ParentRect.right + 2)
      ),
      h1OverlapsHeroMedia,
      clippedControls,
      textOverflows,
    };
  });
}

const manifest = JSON.parse(
  await fs.readFile(path.resolve("dist/prerender/routes.json"), "utf8")
);
const routes = manifest.routes;

if (!Array.isArray(routes) || routes.length === 0) {
  throw new Error("Prerender route manifest is empty");
}

await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

const server = spawn(process.execPath, ["dist/index.js"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(PORT),
    OAUTH_SERVER_URL: process.env.OAUTH_SERVER_URL || "http://127.0.0.1:9",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", data => process.stdout.write(`[server] ${data}`));
server.stderr.on("data", data => process.stderr.write(`[server] ${data}`));

let browser;

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });

  const failures = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    for (const route of routes) {
      const response = await page.goto(`${BASE_URL}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });

      if (!response?.ok()) {
        failures.push(
          `${viewport.name} ${route}: HTTP ${response?.status() ?? "unknown"}`
        );
        continue;
      }

      await page.locator("#root > *").first().waitFor({
        state: "attached",
        timeout: 15_000,
      });
      await page.evaluate(() => document.fonts.ready);

      const result = await inspectPage(page);
      const problems = [];

      if (result.horizontalOverflow) {
        problems.push(
          `horizontal overflow ${result.scrollWidth}/${result.viewportWidth}`
        );
      }
      if (result.h1BeyondParent) problems.push("H1 exceeds its content column");
      if (result.h1OverlapsHeroMedia) problems.push("H1 overlaps hero media");
      if (result.clippedControls.length > 0) {
        problems.push(
          `clipped controls: ${result.clippedControls.join(" | ")}`
        );
      }
      if (result.textOverflows.length > 0) {
        problems.push(
          `text overflow: ${result.textOverflows.join(" | ")}`
        );
      }

      if (problems.length > 0) {
        failures.push(`${viewport.name} ${route}: ${problems.join("; ")}`);
      }

      if (route === "/" && ["mobile-390", "wide-1800"].includes(viewport.name)) {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `home-${viewport.name}.png`),
          fullPage: false,
        });
      }
    }

    await context.close();
    console.log(`PASS: ${viewport.name} checked ${routes.length} routes`);
  }

  if (failures.length > 0) {
    throw new Error(`Text layout failures:\n${failures.join("\n")}`);
  }

  console.log(
    `PASS: ${routes.length} routes have no detected text clipping across ${VIEWPORTS.length} viewports`
  );
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
} finally {
  await browser?.close().catch(() => {});

  if (server.exitCode === null) {
    server.kill("SIGTERM");

    await Promise.race([
      new Promise(resolve => server.once("exit", resolve)),
      sleep(3000),
    ]);

    if (server.exitCode === null) server.kill("SIGKILL");
  }
}
