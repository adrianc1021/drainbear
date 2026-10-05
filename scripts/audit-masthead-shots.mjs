/**
 * 內頁 masthead 截圖 —— fix/inner-page-heroes-v2 驗收用。
 *
 * 逐條內頁路由，於 375 / 1440 兩個寬度，另加 prefers-reduced-motion:reduce 一輪，
 * 只截 hero（masthead）區，輸出到 audits/masthead/<label>/。
 *
 * 用法：
 *   node scripts/audit-masthead-shots.mjs before
 *   node scripts/audit-masthead-shots.mjs after
 *
 * 預設會自己 spawn `node dist/index.js`（production build）再截圖。
 * 若要對住一個已經起好嘅 server（例如 Vite dev，用嚟影改動前嘅 HEAD 版本），
 * 設 AUDIT_BASE_URL 就會跳過 spawn：
 *   AUDIT_BASE_URL=http://127.0.0.1:4173 node scripts/audit-masthead-shots.mjs before
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const phase = process.argv[2] === "before" ? "before" : "after";
const externalBaseUrl = process.env.AUDIT_BASE_URL?.trim() || "";
const port = 4900 + (process.pid % 100);
const baseUrl = externalBaseUrl || `http://127.0.0.1:${port}`;
const outDir = path.resolve("audits/masthead", phase);
const logs = [];

const ROUTES = [
  ["home", "/"],
  ["services", "/services"],
  ["areas", "/areas"],
  ["district", "/areas/kwun-tong"],
  ["service-detail", "/services/high-pressure-jetting"],
  ["drain-diagnosis", "/drain-diagnosis"],
  ["service-process", "/service-process"],
  ["blog", "/blog"],
  ["faq", "/faq"],
  ["guide", "/guide"],
  ["cases", "/cases"],
  ["case-detail", "/cases/home-basin-grease-buildup-cleaning"],
];

// hero 容器的候選 selector，逐個試，第一個有高度的就當係 masthead。
const HERO_SELECTORS = [
  ".site-hero-shell",
  ".site-page-hero",
  ".case-studies-hero",
  ".phase4-services__hero-shell",
  ".phase4-guide__hero",
  ".district-editorial > section",
  "header",
  "#main-content > div > section",
  "#main-content > div > div > section",
];

let server;
let browser;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitForServer() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45_000) {
    try {
      const res = await fetch(`${baseUrl}/`);
      if (res.ok) return;
    } catch {
      /* 等 server 起身 */
    }
    await sleep(250);
  }
  throw new Error(`Server timeout\n${logs.join("")}`);
}

async function shot(page, label, suffix) {
  const file = path.join(outDir, `${label}-${suffix}.png`);

  for (const selector of HERO_SELECTORS) {
    const el = page.locator(selector).first();
    const count = await el.count().catch(() => 0);
    if (!count) continue;

    const box = await el.boundingBox().catch(() => null);
    if (!box || box.height < 80) continue;

    await el.screenshot({ path: file });
    return selector;
  }

  // 全部 selector 都唔中，退化成 viewport 頂截圖（用實際 viewport 尺寸，
  // 唔可以硬編 1440，否則 375 一輪會截錯寬度）。
  const vp = page.viewportSize() || { width: 1440, height: 900 };
  await page.screenshot({
    path: file,
    clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) },
  });
  return "(viewport fallback)";
}

try {
  fs.mkdirSync(outDir, { recursive: true });

  if (externalBaseUrl) {
    console.log(`用外部 server：${externalBaseUrl}（唔會 spawn dist/index.js）`);
  } else {
    server = spawn(process.execPath, ["dist/index.js"], {
      env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    server.stdout.on("data", c => logs.push(c.toString()));
    server.stderr.on("data", c => logs.push(c.toString()));
  }

  await waitForServer();

  browser = await chromium.launch();

  const rows = [];

  for (const [label, route] of ROUTES) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    const res = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
    await page.waitForTimeout(700);

    const desktopSel = await shot(page, label, "1440");

    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    const mobileSel = await shot(page, label, "375");

    await context.close();

    rows.push({
      label,
      route,
      status: res ? res.status() : "?",
      desktop: desktopSel,
      mobile: mobileSel,
    });

    console.log(`✓ ${label.padEnd(16)} ${route}`);
  }

  // reduced-motion 一輪：只截 1440，確認無線性動畫殘留造成版面位移。
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  for (const [label, route] of ROUTES) {
    await rmPage.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await rmPage.waitForTimeout(400);
    await shot(rmPage, label, "1440-reduced-motion");
  }
  await rmContext.close();

  fs.writeFileSync(
    path.join(outDir, "_manifest.json"),
    JSON.stringify(
      {
        phase,
        generatedBy: "scripts/audit-masthead-shots.mjs",
        capturedAt: new Date().toISOString(),
        baseUrl,
        source: externalBaseUrl
          ? "external server (AUDIT_BASE_URL)"
          : "spawned dist/index.js (production build)",
        rows,
      },
      null,
      2
    )
  );

  console.log(`\n完成：${ROUTES.length} 頁 × 3 輪 → ${outDir}`);
} catch (err) {
  console.error("截圖失敗：", err.message);
  console.error(logs.slice(-40).join(""));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill("SIGTERM");
}
