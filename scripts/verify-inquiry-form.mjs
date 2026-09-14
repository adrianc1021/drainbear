import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.INQUIRY_FORM_TEST_PORT || 4223);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 30_000) {
    try {
      if ((await fetch(`${BASE_URL}/`)).ok) return;
    } catch {
      // 等待 production server。
    }
    await sleep(250);
  }

  throw new Error(`Production server 未能啟動：${BASE_URL}`);
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
  page.on("pageerror", error => pageErrors.push(error));

  await page.goto(`${BASE_URL}/`, {
    waitUntil: "networkidle",
    timeout: 30_000,
  });

  const form = page.locator('[data-quote-request-form="true"]').first();
  await form.waitFor({ state: "visible", timeout: 15_000 });

  assert(
    (await page.locator('script[src*="googletagmanager.com/gtag/js"]').count()) === 0,
    "初始頁面不應直接下載 gtag.js"
  );

  await form.getByRole("button", { name: "提交報價查詢" }).click();
  await form.locator('[data-form-status="validation"]').waitFor({
    state: "visible",
    timeout: 5_000,
  });
  console.log("PASS：空白必填欄位會顯示驗證錯誤");

  await page.route("**/api/trpc/inquiry.submit*", route =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ result: { data: { json: { id: 1 } } } }]),
    })
  );

  await form.locator('input[name="name"]').fill("測試客戶");
  await form.locator('input[name="phone"]').fill("9558 8260");
  await form.locator('select[name="serviceType"]').selectOption("residential");
  await form.locator('select[name="district"]').selectOption({ label: "觀塘" });
  await form.locator('textarea[name="message"]').fill("測試用查詢內容");
  await form.locator('input[type="checkbox"]').check();
  await form.getByRole("button", { name: "提交報價查詢" }).click();
  await form.locator('[data-form-status="success"]').waitFor({
    state: "visible",
    timeout: 10_000,
  });

  const tracking = await page.evaluate(() => {
    const dataLayer = window.dataLayer || [];
    return {
      names: dataLayer
        .filter(entry => entry && typeof entry === "object" && !Array.isArray(entry))
        .map(entry => entry.event)
        .filter(Boolean),
      serialized: JSON.stringify(dataLayer),
    };
  });

  assert(tracking.names.includes("contact_form_start"), "缺少 contact_form_start");
  assert(tracking.names.includes("contact_form_submit"), "缺少 contact_form_submit");
  assert(!tracking.serialized.includes("測試客戶"), "Analytics 不應包含姓名");
  assert(!tracking.serialized.includes("9558 8260"), "Analytics 不應包含電話");
  assert(!tracking.serialized.includes("測試用查詢內容"), "Analytics 不應包含完整描述");
  console.log("PASS：表單成功狀態及 contact_form 事件正確，且未帶 PII");

  assert(pageErrors.length === 0, `表單測試出現 ${pageErrors.length} 個 page error`);
  await context.close();
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}

console.log("PASS：報價表單瀏覽器回歸測試完成");
