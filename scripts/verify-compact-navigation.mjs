import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import { enableCmsRelay } from "./browser-cms-relay.ts";

const output =
  process.env.COMPACT_REVIEW_OUTPUT || "/tmp/drainbear-compact-review";
const port = "4590";
const origin = `http://localhost:${port}`;
await fs.mkdir(output, { recursive: true });
const server = spawn(process.execPath, ["dist/index.js"], {
  env: { ...process.env, NODE_ENV: "production", PORT: port },
  stdio: ["ignore", "pipe", "pipe"],
});
const ready = new Promise((resolve, reject) => {
  const timer = setTimeout(
    () => reject(new Error("Preview startup timeout")),
    30000
  );
  server.stdout.on("data", data => {
    if (String(data).includes("Server running")) {
      clearTimeout(timer);
      resolve();
    }
  });
  server.once("error", error => {
    clearTimeout(timer);
    reject(error);
  });
});
const measurements = [],
  interactions = {};
let browser;
try {
  await ready;
  browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 667 : 900 },
      reducedMotion: "reduce",
    });
    await enableCmsRelay(context, origin);
    const page = await context.newPage();
    await page.goto(origin + "/areas");
    await page.locator("#area-search").waitFor();
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({
      pageHeight: document.documentElement.scrollHeight,
      mainHeight: document.querySelector("main").getBoundingClientRect().height,
      footerHeight: document.querySelector("footer").getBoundingClientRect()
        .height,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      closedRegions: document.querySelectorAll("main .area-region:not([open])")
        .length,
      closedFooterGroups: document.querySelectorAll(
        "footer details:not([open])"
      ).length,
    }));
    assert(!dimensions.overflow, `no overflow at ${width}`);
    assert.equal(dimensions.closedRegions, 3);
    assert.equal(dimensions.closedFooterGroups, 3);
    assert(dimensions.footerHeight < 650, `compact footer at ${width}`);
    assert.equal(await page.locator(".area-region-pages a").count(), 18);
    measurements.push({ width, ...dimensions });
    await page.screenshot({
      path: `${output}/areas-${width}.png`,
      fullPage: true,
    });
    const region = page.locator("#coverage-1");
    await region.locator("summary").focus();
    await page.keyboard.press("Enter");
    await region
      .locator('a[href="/areas/kwun-tong"]')
      .waitFor({ state: "visible" });
    assert(await region.evaluate(el => el.open));
    if (process.env.AXE_CORE_PATH && [320, 1440].includes(width)) {
      await page.addScriptTag({ path: process.env.AXE_CORE_PATH });
      await page.locator("#footer-information summary").click();
      await page.locator("#footer-services summary").click();
      await page.locator("#footer-areas summary").click();
      const result = await page.evaluate(() =>
        window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
          },
        })
      );
      assert.deepEqual(
        result.violations.map(v => ({
          id: v.id,
          nodes: v.nodes.map(n => n.target),
        })),
        []
      );
      interactions[`expandedAxe${width}`] = "passed";
    }
    await region.locator("summary").focus();
    await page.keyboard.press("Space");
    await region
      .locator('a[href="/areas/kwun-tong"]')
      .waitFor({ state: "hidden" });
    const search = page.getByLabel("輸入地區或屋苑附近地點");
    await search.fill("觀塘");
    assert.equal(
      await page
        .locator('#area-search-results a[href="/areas/kwun-tong"]')
        .count(),
      1
    );
    await search.fill("中西區");
    assert(
      await page
        .locator('#area-search-results a[href="/areas/central-western"]')
        .count()
    );
    await search.fill("九龍");
    assert.equal(await page.locator(".area-results li").count(), 12);
    await page.getByRole("button", { name: /顯示更多地點/ }).click();
    assert.equal(await page.locator(".area-results li").count(), 24);
    await search.fill("東涌");
    const href = await page
      .locator("#area-search-results a")
      .getAttribute("href");
    assert(href.startsWith("https://wa.me/"));
    assert(decodeURIComponent(href).includes("所在地點：東涌"));
    await search.fill("未記錄大廈XYZ");
    assert(
      decodeURIComponent(
        await page.locator(".area-search__empty a").getAttribute("href")
      ).includes("未記錄大廈XYZ")
    );
    await page.getByRole("button", { name: "清除地區搜尋" }).click();
    assert.equal(await search.inputValue(), "");
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "area-search"
    );
    assert.equal(
      await page.locator("main .area-region:not([open])").count(),
      3
    );
    await page.goto(origin + "/areas#coverage-2");
    await page.locator("#area-search").waitFor();
    await page.waitForFunction(
      () => document.getElementById("coverage-2").open
    );
    assert(
      (await page.locator("#coverage-2").boundingBox()).y < 180,
      "hash region scrolls into view below header"
    );
    await page.locator("#footer-information summary").focus();
    if (await page.locator("#footer-information").evaluate(el => el.open))
      await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.closest("details")?.id),
      "footer-services"
    );
    await page.locator("#footer-information summary").click();
    await page.locator('#footer-information a[href="/about"]').click();
    await page.waitForURL("**/about");
    await page.getByRole("heading", { name: "認識通渠熊" }).waitFor();
    assert.equal(await page.locator("footer details[open]").count(), 0);
    await page.goto(origin + "/thanks");
    await page.locator(".handoff-card").waitFor();
    assert.equal(await page.locator("footer .contact-actions").count(), 0);
    await context.close();
    console.log(
      `PASS compact areas/footer, search, pagination, keyboard, hash and navigation reset at ${width}`
    );
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 667 },
    reducedMotion: "no-preference",
  });
  await enableCmsRelay(context, origin);
  await context.route("https://wa.me/**", route =>
    route.fulfill({
      status: 200,
      body: "Navigation intercepted; no message sent",
    })
  );
  await context.route(
    /https:\/\/(?:www\.googletagmanager\.com|.*google-analytics\.com)\//,
    route => route.abort()
  );
  const page = await context.newPage();
  await page.goto(origin + "/areas");
  await page.locator("#area-search").waitFor();
  const closedHeight = await page
    .locator("#coverage-0")
    .evaluate(el => el.getBoundingClientRect().height);
  await page.locator("#coverage-0 summary").click();
  const animation = await page.locator("#coverage-0").evaluate(el => ({
    supports:
      CSS.supports("interpolate-size", "allow-keywords") &&
      CSS.supports("transition-behavior", "allow-discrete"),
    running: el.getAnimations({ subtree: true }).length,
    properties: el
      .getAnimations({ subtree: true })
      .map(a => a.transitionProperty),
    duration: getComputedStyle(el, "::details-content").transitionDuration,
  }));
  if (animation.supports)
    assert(animation.running > 0, "real opening transition runs");
  interactions.animation = animation;
  const openingHeight = await page.locator("#coverage-0").evaluate(async el => {
    await new Promise(resolve => setTimeout(resolve, 70));
    return el.getBoundingClientRect().height;
  });
  await page.waitForFunction(
    () =>
      document.getElementById("coverage-0").getAnimations({ subtree: true })
        .length === 0
  );
  const expandedHeight = await page
    .locator("#coverage-0")
    .evaluate(el => el.getBoundingClientRect().height);
  if (animation.supports)
    assert(
      openingHeight > closedHeight + 5 && openingHeight < expandedHeight - 5,
      "opening height interpolates"
    );
  await page.locator("#coverage-0 summary").focus();
  await page.keyboard.press("Enter");
  const closing = await page
    .locator("#coverage-0")
    .evaluate(el => el.getAnimations({ subtree: true }).length);
  if (animation.supports) assert(closing > 0, "real closing transition runs");
  interactions.animation.closing = closing;
  interactions.animation.closingProperties = await page
    .locator("#coverage-0")
    .evaluate(el =>
      el.getAnimations({ subtree: true }).map(a => a.transitionProperty)
    );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.closest("details")?.id),
    "coverage-1",
    "closed region links stay out of keyboard navigation during closing"
  );
  const closingHeight = await page.locator("#coverage-0").evaluate(async el => {
    await new Promise(resolve => setTimeout(resolve, 70));
    return el.getBoundingClientRect().height;
  });
  if (animation.supports)
    assert(
      closingHeight > closedHeight + 5 && closingHeight < expandedHeight - 5,
      "closing height interpolates"
    );
  interactions.animation.heights = {
    closedHeight,
    openingHeight,
    expandedHeight,
    closingHeight,
  };
  await page.locator("#coverage-0 a").first().waitFor({ state: "hidden" });
  await page.getByLabel("輸入地區或屋苑附近地點").fill("東涌");
  const popupPromise = page.waitForEvent("popup");
  await page.locator("#area-search-results a").click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  assert(popup.url().startsWith("https://wa.me/"));
  await page.waitForURL("**/thanks?from=**");
  await page.waitForFunction(() =>
    (window.dataLayer || []).some(item => item.event === "whatsapp_handoff")
  );
  const events = await page.evaluate(() =>
    (window.dataLayer || []).filter(item => item.event).map(item => item.event)
  );
  assert.equal(events.filter(e => e === "whatsapp_click").length, 1);
  assert.equal(events.filter(e => e === "whatsapp_handoff").length, 1);
  assert(
    !events.some(e =>
      ["whatsapp_open", "inquiry_received", "job_completed"].includes(e)
    )
  );
  interactions.whatsapp = { click: 1, handoff: 1, noFalseReceiptEvents: true };
  await context.close();
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 667 },
    reducedMotion: "reduce",
  });
  const native = await noJs.newPage();
  await native.goto(origin + "/areas");
  assert.equal(await native.locator("main .area-region").count(), 3);
  await native.locator("#coverage-1 summary").click();
  await native
    .locator('#coverage-1 a[href="/areas/kwun-tong"]')
    .waitFor({ state: "visible" });
  await native.locator("#footer-services summary").click();
  await native
    .locator('#footer-services a[href="/services/toilet-unblocking"]')
    .waitFor({ state: "visible" });
  interactions.nativeWithoutJavaScript = "passed";
  await noJs.close();
  await fs.writeFile(
    `${output}/checks.json`,
    JSON.stringify({ measurements, interactions }, null, 2)
  );
  console.log(
    "PASS motion and native no-JavaScript disclosure; WhatsApp popup intercepted, no messages sent"
  );
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
