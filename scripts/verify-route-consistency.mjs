import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.ROUTE_CONSISTENCY_PORT || 4281);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const routes = [
  ["/", "香港24小時通渠服務", "香港 24 小時緊急通渠服務", "首頁"],
  ["/services", "通渠服務｜住宅通渠", "通渠服務", "通渠服務"],
  [
    "/services/toilet-unblocking",
    "坐廁通渠",
    "坐廁淤塞、去水慢或倒灌",
    "通渠服務",
  ],
  [
    "/drain-diagnosis",
    "渠務問題快速判斷",
    "先看症狀，再決定下一步",
    "問題判斷",
  ],
  ["/guide", "香港通渠價錢", "香港通渠價錢及收費，動工前確認報價", "收費指南"],
  ["/areas", "服務地區覆蓋", "港九新界及離島通渠服務", "服務地區"],
  ["/areas/kwun-tong", "觀塘通渠", "觀塘通渠｜24 小時特快上門", "服務地區"],
  ["/faq", "常見問題", "常見問題", "常見問題"],
];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`${BASE_URL}/`)).ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Server did not start at ${BASE_URL}`);
}
const server = spawn(process.execPath, ["dist/index.js"], {
  env: { ...process.env, NODE_ENV: "production", PORT: String(PORT) },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", data => process.stdout.write(`[server] ${data}`));
server.stderr.on("data", data => process.stderr.write(`[server] ${data}`));
let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  for (const [path, title, h1, nav] of routes) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    const response = await page.goto(`${BASE_URL}${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    if (!response?.ok())
      throw new Error(`${path} returned ${response?.status()}`);
    await page.getByRole("main").waitFor({ state: "visible" });
    await page.waitForTimeout(1_000);
    const metadata = await page.evaluate(() => ({
      url: location.pathname,
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      canonical:
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
        "",
      active: [
        ...document.querySelectorAll('header nav a[aria-current="page"]'),
      ].map(a => a.textContent?.trim() ?? ""),
    }));
    if (metadata.url !== path)
      throw new Error(`${path} navigated to ${metadata.url}`);
    if (!metadata.title.includes(title))
      throw new Error(`${path} title mismatch: ${metadata.title}`);
    if (!metadata.h1.includes(h1))
      throw new Error(`${path} H1 mismatch: ${metadata.h1}`);
    if (metadata.canonical !== `https://drainbearhk.com${path}`)
      throw new Error(`${path} canonical mismatch: ${metadata.canonical}`);
    if (metadata.active.length !== 1 || metadata.active[0] !== nav)
      throw new Error(
        `${path} active nav mismatch: ${metadata.active.join(", ")}`
      );
    await context.close();
    console.log(`PASS: ${path} metadata and navigation consistency`);
  }
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
