import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.STAGE6A_TEST_PORT || 4214);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 45_000) {
    try {
      if ((await fetch(`${BASE_URL}/`)).ok) return;
    } catch {
      // Production server is still starting.
    }
    await sleep(250);
  }

  throw new Error(`Production server 未能啟動：${BASE_URL}`);
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));

  assert(
    dimensions.scrollWidth <= dimensions.innerWidth + 1,
    `${label}：水平 overflow ${JSON.stringify(dimensions)}`
  );
}

async function assertGuideHeroFits(page, label) {
  const dimensions = await page
    .locator(".phase4-guide__hero .site-page-hero__title")
    .evaluate(title => ({
      clientWidth: title.clientWidth,
      scrollWidth: title.scrollWidth,
    }));

  assert(
    dimensions.scrollWidth <= dimensions.clientWidth + 1,
    `${label}：收費指南標題超出欄位 ${JSON.stringify(dimensions)}`
  );
}

async function assertTabPanelIntegrity(page) {
  const result = await page.locator('[role="tab"]').evaluateAll(tabs =>
    tabs.map(tab => {
      const panelId = tab.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      return {
        id: tab.id,
        selected: tab.getAttribute("aria-selected"),
        tabIndex: tab.getAttribute("tabindex"),
        panelId,
        panelRole: panel?.getAttribute("role"),
        panelLabel: panel?.getAttribute("aria-labelledby"),
        panelHidden: panel?.hasAttribute("hidden"),
      };
    })
  );

  assert(result.length === 3, "應有三個服務地區 tabs");
  assert(
    result.filter(tab => tab.selected === "true").length === 1,
    "應只有一個 selected tab"
  );

  for (const tab of result) {
    assert(tab.id && tab.panelId, "tab 必須有 id 及 aria-controls");
    assert(tab.panelRole === "tabpanel", `tab ${tab.id} 未指向有效 tabpanel`);
    assert(
      tab.panelLabel === tab.id,
      `tabpanel ${tab.panelId} 的 aria-labelledby 錯誤`
    );
    assert(
      tab.tabIndex === (tab.selected === "true" ? "0" : "-1"),
      `tab ${tab.id} roving tabindex 錯誤`
    );
    assert(
      tab.panelHidden === (tab.selected !== "true"),
      `tab ${tab.id} 與 panel 可見狀態不一致`
    );
  }
}

const server = spawn("node", ["dist/index.js"], {
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

  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error));

    await page.goto(`${BASE_URL}/areas`, { waitUntil: "networkidle" });
    const combobox = page.getByRole("combobox", { name: "搜尋服務地區" });
    await combobox.fill("旺角");
    assert(
      (await combobox.getAttribute("aria-expanded")) === "true",
      "combobox 應展開"
    );
    const listboxId = await combobox.getAttribute("aria-controls");
    assert(
      listboxId && (await page.locator(`#${listboxId}`).count()) === 1,
      "aria-controls 未指向 listbox"
    );
    const options = page.locator(`#${listboxId} [role="option"]`);
    const optionData = await options.evaluateAll(items =>
      items.map(item => ({
        id: item.id,
        tabIndex: item.getAttribute("tabindex"),
      }))
    );
    assert(optionData.length > 0, "旺角搜尋應有結果");
    assert(
      new Set(optionData.map(option => option.id)).size === optionData.length,
      "option id 必須唯一"
    );
    assert(
      optionData.every(option => option.id && option.tabIndex === "-1"),
      "options 不可加入正常 Tab sequence"
    );

    await combobox.press("ArrowDown");
    const activeId = await combobox.getAttribute("aria-activedescendant");
    assert(
      activeId && (await page.locator(`#${activeId}`).count()) === 1,
      "aria-activedescendant 未指向有效 option"
    );
    await combobox.press("ArrowUp");
    assert(
      await combobox.getAttribute("aria-activedescendant"),
      "ArrowUp 不應清除 active option"
    );
    await combobox.press("Enter");
    await page.waitForURL(`${BASE_URL}/areas/mong-kok`);

    await page.goto(`${BASE_URL}/areas`, { waitUntil: "networkidle" });
    const escapedCombo = page.getByRole("combobox", { name: "搜尋服務地區" });
    await escapedCombo.fill("旺角");
    await escapedCombo.press("ArrowDown");
    await escapedCombo.press("Escape");
    assert(
      (await escapedCombo.getAttribute("aria-expanded")) === "false",
      "Escape 應關閉 results"
    );
    assert(
      (await escapedCombo.getAttribute("aria-activedescendant")) === null,
      "Escape 應清除 active option"
    );
    await escapedCombo.fill("不存在測試地區");
    assert(
      await page.getByRole("status").count(),
      "無結果狀態應提供 screen-reader status"
    );

    const tabs = page.locator('[role="tab"]');
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    assert(
      (await tabs.nth(1).getAttribute("aria-selected")) === "true",
      "ArrowRight 應選擇下一個 tab"
    );
    await page.keyboard.press("End");
    assert(
      (await tabs.nth(2).getAttribute("aria-selected")) === "true",
      "End 應選擇最後 tab"
    );
    await page.keyboard.press("Home");
    assert(
      (await tabs.nth(0).getAttribute("aria-selected")) === "true",
      "Home 應選擇首個 tab"
    );
    await page.keyboard.press("ArrowLeft");
    assert(
      (await tabs.nth(2).getAttribute("aria-selected")) === "true",
      "ArrowLeft 應循環至最後 tab"
    );
    await assertTabPanelIntegrity(page);

    const mapDistrict = page.locator('[data-map-district="wan-chai"]');

    // Use real keyboard navigation so Chromium applies :focus-visible.
    // Programmatic locator.focus() does not reliably represent keyboard modality.
    let reachedMapDistrict = false;
    for (let tabPresses = 0; tabPresses < 80; tabPresses += 1) {
      await page.keyboard.press("Tab");
      reachedMapDistrict = await mapDistrict.evaluate(
        element => document.activeElement === element
      );
      if (reachedMapDistrict) break;
    }

    assert(reachedMapDistrict, "灣仔地圖區域必須可透過 Tab 鍵聚焦");

    const focusStyle = await mapDistrict.evaluate(element => {
      const style = window.getComputedStyle(element);
      return {
        stroke: style.stroke,
        strokeWidth: Number.parseFloat(style.strokeWidth),
      };
    });
    assert(
      focusStyle.strokeWidth >= 4,
      "地圖 focus indicator stroke 必須可量度"
    );
    assert(
      focusStyle.stroke !== "none",
      "地圖 focus indicator 不可只依賴 fill"
    );
    await page.keyboard.press("Space");
    await page.getByRole("heading", { name: "灣仔通渠服務" }).waitFor();
    await assertNoOverflow(page, "390px /areas");
    assert(
      pageErrors.length === 0,
      `390px /areas 出現 ${pageErrors.length} 個 page errors`
    );

    await page.goto(`${BASE_URL}/thanks`, { waitUntil: "networkidle" });
    assert(
      (await page.locator('[data-mobile-cta="true"]').count()) === 0,
      "/thanks 不應有 Mobile CTA"
    );
    assert(
      (await page.locator('[data-whatsapp-widget="true"]').count()) === 0,
      "/thanks 不應有 WhatsApp widget"
    );
    assert(
      (await page.locator('[data-header-whatsapp="true"]').count()) === 0,
      "/thanks 不應有 Header WhatsApp CTA"
    );

    const notFoundResponse = await page.goto(
      `${BASE_URL}/stage6a-missing-route`,
      { waitUntil: "networkidle" }
    );
    assert(notFoundResponse?.status() === 404, "unknown route 應回傳 HTTP 404");
    assert((await page.locator("h1").count()) === 1, "/404 必須只有一個 h1");
    assert(await page.locator('a[href="/"]').count(), "/404 必須有首頁 link");
    assert(
      await page.locator('a[href="/services"]').count(),
      "/404 必須有服務 link"
    );
    assert(
      (await page.locator('link[rel="canonical"]').getAttribute("href")) ===
        "https://drainbearhk.com/stage6a-missing-route",
      "unknown route canonical 錯誤"
    );
    assert(
      (await page.locator('meta[name="robots"]').getAttribute("content")) ===
        "noindex, follow",
      "unknown route 必須 noindex"
    );
    await assertNoOverflow(page, "390px unknown route");
    assert(
      pageErrors.length === 0,
      `390px 出現 ${pageErrors.length} 個 page errors`
    );
    await context.close();
  }

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
    { width: 1707, height: 900 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error));

    await page.goto(`${BASE_URL}/areas`, { waitUntil: "networkidle" });
    await assertNoOverflow(page, `${viewport.width}px /areas`);
    await page.goto(`${BASE_URL}/404`, { waitUntil: "networkidle" });
    await assertNoOverflow(page, `${viewport.width}px /404`);
    await page.goto(`${BASE_URL}/guide`, { waitUntil: "networkidle" });
    await assertNoOverflow(page, `${viewport.width}px /guide`);
    await assertGuideHeroFits(page, `${viewport.width}px /guide`);
    assert(
      pageErrors.length === 0,
      `${viewport.width}px 出現 ${pageErrors.length} 個 page errors`
    );
    await context.close();
  }

  console.log("PASS: Stage 6A secondary page verification completed");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
