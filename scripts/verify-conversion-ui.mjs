import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.CONVERSION_TEST_PORT || 4201);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 30_000) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) return;
    } catch {
      // 等待 server。
    }

    await sleep(250);
  }

  throw new Error(`Server 未能啟動：${BASE_URL}`);
}

const server = spawn("node", ["dist/index.js"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(PORT),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", data => process.stdout.write(`[server] ${data}`));
server.stderr.on("data", data => process.stderr.write(`[server] ${data}`));

let browser;

try {
  await waitForServer();

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];

  page.on("pageerror", error => {
    pageErrors.push(error);
    console.error("Browser page error:", error);
  });

  await page.goto(`${BASE_URL}/`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  const heading = page.getByRole("heading", {
    name: "邊度塞咗？",
  });

  await heading.waitFor({
    state: "visible",
    timeout: 15_000,
  });

  const serviceLabels = ["塞廁所", "廚房鋅盤", "企缸去水", "主渠／沙井"];

  for (const label of serviceLabels) {
    const link = page
      .getByRole("link", {
        name: new RegExp(label),
      })
      .first();

    await link.waitFor({
      state: "visible",
      timeout: 10_000,
    });

    const href = await link.getAttribute("href");

    if (!href || !href.startsWith("https://wa.me/")) {
      throw new Error(`${label} WhatsApp URL 不正確：${href}`);
    }

    const parsed = new URL(href);
    const message = parsed.searchParams.get("text") || "";

    if (!message.includes("初步估價")) {
      throw new Error(`${label} 預填訊息缺少「初步估價」`);
    }
  }

  console.log("PASS：四個服務快捷選擇可見且 WhatsApp 訊息正確");

  const calculatorLink = page.getByRole("link", {
    name: /使用即時估價計算機/,
  });

  const calculatorHref = await calculatorLink.getAttribute("href");

  if (calculatorHref !== "/guide#calculator") {
    throw new Error(`計算機連結錯誤：${calculatorHref}`);
  }

  console.log("PASS：估價計算機捷徑正確");

  await calculatorLink.click();
  await page.waitForURL(`${BASE_URL}/guide#calculator`, {
    timeout: 10_000,
  });
  await page.getByRole("heading", { name: "即時估價計算機" }).waitFor({
    state: "visible",
    timeout: 15_000,
  });
  await page.waitForTimeout(100);

  const calculatorTop = await page
    .locator("#calculator")
    .evaluate(element => element.getBoundingClientRect().top);

  if (calculatorTop < 0 || calculatorTop > 180) {
    throw new Error(`估價計算機捷徑未正確定位：top=${calculatorTop}`);
  }

  console.log("PASS：估價計算機捷徑會捲動到正確位置");

  await page.goto(`${BASE_URL}/`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page.getByText("接納工程免檢查費", { exact: true }).first().waitFor({
    state: "visible",
    timeout: 10_000,
  });

  const misleadingClaimCount = await page
    .getByText("上門檢查費全免", { exact: true })
    .count();

  if (misleadingClaimCount !== 0) {
    throw new Error("首頁仍存在「上門檢查費全免」矛盾文案");
  }

  console.log("PASS：檢查費文案已統一");

  const footerAreas = page.getByRole("navigation", {
    name: "熱門通渠服務地區",
  });

  const footerAreaCount = await footerAreas.getByRole("link").count();

  if (footerAreaCount !== 18) {
    throw new Error(`Footer 熱門地區連結預期 18 個，實際 ${footerAreaCount}`);
  }

  console.log("PASS：Footer 18 個熱門地區連結正確");

  await page.goto(`${BASE_URL}/guide`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page
    .getByText(/出發前先提供初步估價及預計到達時間/)
    .first()
    .waitFor({
      state: "attached",
      timeout: 15_000,
    });

  await page
    .getByText(/師傅現場檢查後、動工前確認最終總收費/)
    .first()
    .waitFor({
      state: "attached",
      timeout: 10_000,
    });

  console.log("PASS：收費指南初步估價／最終報價文案一致");

  if (pageErrors.length > 0) {
    throw new Error(`測試期間出現 ${pageErrors.length} 個 browser page error`);
  }

  await context.close();

  console.log("\n所有 conversion UI 回歸測試通過。");
} finally {
  if (browser) {
    await browser.close();
  }

  server.kill("SIGTERM");

  await Promise.race([
    new Promise(resolve => server.once("exit", resolve)),
    sleep(3_000),
  ]);

  if (server.exitCode === null) {
    server.kill("SIGKILL");
  }
}
