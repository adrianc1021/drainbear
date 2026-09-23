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

  const heading = page.locator("h1").first();

  await heading.waitFor({
    state: "visible",
    timeout: 15_000,
  });
  if (!(await heading.textContent()).includes("香港通渠")) {
    throw new Error(`首頁 H1 文案不正確：${await heading.textContent()}`);
  }

  const serviceDestinations = [
    ["toilet", "/services/toilet-unblocking"],
    ["bathroom", "/services/bathroom-drain-unblocking"],
    ["kitchen", "/services/kitchen-sink-unblocking"],
    ["backflow", "/services/sewage-backflow"],
  ];
  for (const [id, destination] of serviceDestinations) {
    const link = page.locator(
      `[data-pr20-section="common-problems"] a[href="${destination}"]`
    );
    await link.waitFor({ state: "visible" });
    if ((await link.getAttribute("href")) !== destination)
      throw new Error(`${id} 服務入口錯誤`);
  }
  const contact = page.locator(
    '.home-compact-hero__actions a[href*="wa.me"]'
  );
  const contactUrl = new URL(await contact.getAttribute("href"));
  if (
    contactUrl.hostname !== "wa.me" ||
    !contactUrl.searchParams.get("text")?.includes("報價")
  )
    throw new Error("首頁 WhatsApp 查詢訊息錯誤");
  console.log("PASS：四個服務快捷入口及 WhatsApp 查詢訊息正確");

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

  // 首頁為保持首屏簡潔使用 compact footer；在完整內容頁驗證熱門地區導覽。
  await page.goto(`${BASE_URL}/services`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

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
    .getByText(/團隊會先提供初步估價及可安排時段/)
    .first()
    .waitFor({
      state: "attached",
      timeout: 15_000,
    });

  await page
    .getByText(/師傅到場檢查後，於動工前確認最終總收費/)
    .first()
    .waitFor({
      state: "attached",
      timeout: 10_000,
    });

  console.log("PASS：收費指南初步估價／最終報價文案一致");

  if (
    (await page.getByText("即時估價計算機", { exact: true }).count()) !== 0 ||
    (await page.locator("#calculator").count()) !== 0
  ) {
    throw new Error("網站仍包含已移除的估價計算機 UI");
  }

  console.log("PASS：估價計算機 UI 已移除，聯絡流程仍可用");

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
