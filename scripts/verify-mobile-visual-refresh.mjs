import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "playwright";

const port = 4700 + (process.pid % 200);
const baseUrl = `http://127.0.0.1:${port}`;
const screenshots = "/tmp/drainbear-pr18-final";
const logs = [];

let server;
let browser;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 30_000) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
    } catch {
      // 等候 production server。
    }

    await sleep(250);
  }

  throw new Error(`Server timeout\n${logs.join("")}`);
}

async function verifyNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  if (metrics.scrollWidth > metrics.clientWidth + 1) {
    throw new Error(`${label} 出現水平 overflow：${JSON.stringify(metrics)}`);
  }
}

try {
  fs.mkdirSync(screenshots, { recursive: true });

  server = spawn(process.execPath, ["dist/index.js"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.stdout.on("data", chunk => logs.push(chunk.toString()));
  server.stderr.on("data", chunk => logs.push(chunk.toString()));

  await waitForServer();

  browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "320", width: 320, height: 568 },
    { name: "360", width: 360, height: 800 },
    { name: "390", width: 390, height: 844 },
    { name: "430", width: 430, height: 932 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      reducedMotion: "no-preference",
    });

    const page = await context.newPage();
    const pageErrors = [];

    page.on("pageerror", error => pageErrors.push(error.message));

    await page.goto(`${baseUrl}/`, {
      waitUntil: "networkidle",
    });

    await page
      .getByRole("heading", {
        name: /香港 24 小時.*通渠服務.*專業評估/,
      })
      .waitFor();

    // PR18_HERO_MARKER_VISIBILITY_CHECK
    const leakedHeroMarker = page.getByText("/* PR18_MOBILE_HERO */", {
      exact: true,
    });

    if ((await leakedHeroMarker.count()) !== 0) {
      throw new Error("PR18 Hero 開發標記意外顯示於頁面");
    }

    await verifyNoHorizontalOverflow(page, `首頁 ${viewport.name}px`);

    const menuButton = page.locator(
      'button[aria-controls="mobile-navigation"]'
    );

    await menuButton.click();

    if ((await menuButton.getAttribute("aria-expanded")) !== "true") {
      throw new Error("Mobile Menu aria-expanded 未更新");
    }

    await page.keyboard.press("Escape");

    const footerButtons = page.locator(
      'footer button[aria-controls^="footer-area-panel-"]'
    );

    if ((await footerButtons.count()) !== 3) {
      throw new Error("手機 Footer 預期 3 個地區 Accordion");
    }

    const firstFooterButton = footerButtons.first();

    await firstFooterButton.scrollIntoViewIfNeeded();
    await firstFooterButton.click();

    if ((await firstFooterButton.getAttribute("aria-expanded")) !== "true") {
      throw new Error("Footer Accordion 未能展開");
    }

    await page.screenshot({
      path: `${screenshots}/home-${viewport.name}.png`,
      fullPage: true,
    });

    await page.goto(`${baseUrl}/areas`, {
      waitUntil: "networkidle",
    });

    await verifyNoHorizontalOverflow(page, `/areas ${viewport.name}px`);

    await page.screenshot({
      path: `${screenshots}/areas-${viewport.name}.png`,
      fullPage: true,
    });

    if (pageErrors.length > 0) {
      throw new Error(
        `${viewport.name}px page errors：${pageErrors.join(" | ")}`
      );
    }

    await context.close();
  }

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const desktopPage = await desktopContext.newPage();

  await desktopPage.goto(`${baseUrl}/`, {
    waitUntil: "networkidle",
  });

  await verifyNoHorizontalOverflow(desktopPage, "首頁 Desktop");

  await desktopPage.screenshot({
    path: `${screenshots}/home-desktop-1440.png`,
    fullPage: true,
  });

  await desktopContext.close();

  console.log("PASS：320/360/390/430px 無水平 overflow");
  console.log("PASS：Mobile Menu keyboard/ARIA 正常");
  console.log("PASS：Footer Mobile Accordion 正常");
  console.log("PASS：Desktop 版面無水平 overflow");
  console.log(`PASS：最終截圖位於 ${screenshots}`);
} finally {
  if (browser) await browser.close().catch(() => {});

  if (server && server.exitCode === null) {
    server.kill("SIGTERM");

    await Promise.race([
      new Promise(resolve => server.once("exit", resolve)),
      sleep(3000),
    ]);

    if (server.exitCode === null) server.kill("SIGKILL");
  }
}
