import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 4900 + (process.pid % 500);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ATTRIBUTION_KEY = "drainbear_session_attribution_v1";
const HANDOFF_KEY = "drainbear_whatsapp_handoff_v1";

// 直接啟動 Node server，避免 pnpm shell 留下無法終止的子程序。
const server = spawn(process.execPath, ["dist/index.js"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: "production",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", chunk => process.stdout.write(chunk));
server.stderr.on("data", chunk => process.stderr.write(chunk));

async function waitForServer() {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const response = await fetch(BASE_URL);

      if (response.ok) return;
    } catch {
      // Server may still be starting.
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`Production server 未能啟動：${BASE_URL}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

let browser;

try {
  await waitForServer();

  browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext();

  // 阻擋 Google tag library，保留 inline dataLayer，亦避免測試流量外送。
  await context.route(/googletagmanager\.com/i, route => route.abort());

  const page = await context.newPage();
  const collectionRequests = [];

  page.on("request", request => {
    const url = request.url();

    if (
      /google-analytics\.com\/g\/collect/i.test(url) ||
      /googleadservices\.com\/pagead\/conversion/i.test(url) ||
      /doubleclick\.net\/pagead/i.test(url)
    ) {
      collectionRequests.push(url);
    }
  });

  const landingUrl =
    `${BASE_URL}/?` +
    new URLSearchParams({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "pr19_browser_acceptance",
      gclid: "TEST-CLICK-ID-DO-NOT-STORE",
    });

  await page.goto(landingUrl, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page.locator("#root > *").first().waitFor({
    state: "attached",
    timeout: 30_000,
  });

  await page.waitForFunction(
    key => sessionStorage.getItem(key) !== null,
    ATTRIBUTION_KEY,
    { timeout: 10_000 }
  );

  const attribution = await page.evaluate(key => {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, ATTRIBUTION_KEY);

  assert(attribution, "Attribution 未寫入 sessionStorage");
  assert(
    attribution.traffic_source === "google",
    `traffic_source 錯誤：${attribution.traffic_source}`
  );
  assert(
    attribution.traffic_medium === "cpc",
    `traffic_medium 錯誤：${attribution.traffic_medium}`
  );
  assert(
    attribution.campaign_name === "pr19_browser_acceptance",
    `campaign_name 錯誤：${attribution.campaign_name}`
  );
  assert(
    attribution.click_id_type === "gclid",
    `click_id_type 錯誤：${attribution.click_id_type}`
  );
  assert(
    attribution.landing_page === "/",
    `landing_page 錯誤：${attribution.landing_page}`
  );

  const serializedAttribution = JSON.stringify(attribution);

  assert(
    !serializedAttribution.includes("TEST-CLICK-ID-DO-NOT-STORE"),
    "完整 GCLID 被寫入 sessionStorage"
  );

  console.log("PASS：UTM attribution 已保存");
  console.log("PASS：只保存 click_id_type，未保存完整 GCLID");

  await page.evaluate(
    ({ key, attribution: storedAttribution }) => {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          nonce: "pr19-browser-test-nonce",
          cta_location: "browser_acceptance",
          created_at: Date.now(),
          attribution: storedAttribution,
        })
      );
    },
    {
      key: HANDOFF_KEY,
      attribution,
    }
  );

  await page.goto(`${BASE_URL}/thanks`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page
    .getByRole("heading", {
      name: "WhatsApp 對話已開啟",
    })
    .waitFor({
      state: "visible",
      timeout: 30_000,
    });

  await page.waitForTimeout(500);

  const firstHandoffResult = await page.evaluate(key => {
    const events = (window.dataLayer || []).filter(
      entry =>
        entry &&
        typeof entry === "object" &&
        !Array.isArray(entry) &&
        entry.event === "whatsapp_handoff"
    );

    return {
      count: events.length,
      event: events[0] || null,
      token: sessionStorage.getItem(key),
    };
  }, HANDOFF_KEY);

  assert(
    firstHandoffResult.count === 1,
    `首次 /thanks 應有 1 個 whatsapp_handoff，實際：${firstHandoffResult.count}`
  );
  assert(
    firstHandoffResult.event?.cta_location === "browser_acceptance",
    "whatsapp_handoff cta_location 不正確"
  );
  assert(firstHandoffResult.token === null, "WhatsApp handoff token 未被消耗");

  console.log("PASS：首次 /thanks 只觸發一次 whatsapp_handoff");
  console.log("PASS：Handoff token 已消耗");

  await page.reload({
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page
    .getByRole("heading", {
      name: "WhatsApp 對話已開啟",
    })
    .waitFor({
      state: "visible",
      timeout: 30_000,
    });

  await page.waitForTimeout(500);

  const refreshHandoffCount = await page.evaluate(
    () =>
      (window.dataLayer || []).filter(
        entry =>
          entry &&
          typeof entry === "object" &&
          !Array.isArray(entry) &&
          entry.event === "whatsapp_handoff"
      ).length
  );

  assert(
    refreshHandoffCount === 0,
    `Refresh 不應重複 whatsapp_handoff，實際：${refreshHandoffCount}`
  );

  console.log("PASS：Refresh 不會重複計算 whatsapp_handoff");

  assert(
    collectionRequests.length === 0,
    `localhost 測試期間出現外送 tracking request：\n${collectionRequests.join(
      "\n"
    )}`
  );

  console.log("PASS：localhost／Playwright 沒有 GA4 或 Ads conversion 外送");
  console.log("PASS：PR #19 Browser Tracking Acceptance 全部通過");

  await context.close();
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
