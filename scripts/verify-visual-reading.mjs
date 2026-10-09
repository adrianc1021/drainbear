import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
const origin =
  process.argv[2] || process.env.SITE_QA_ORIGIN || "http://localhost:4580";
const output = process.env.READING_QA_OUTPUT || "/tmp/drainbear-reading-qa";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  cache = new Map(),
  observations = [];
async function relay(context) {
  await context.route("**/*", async route => {
    const request = route.request(),
      url = new URL(request.url());
    if (url.hostname === "wa.me")
      return route.fulfill({
        status: 200,
        body: "Test popup; no message sent",
      });
    if (
      request.method() !== "GET" ||
      !(
        url.origin === origin ||
        url.hostname.endsWith(".sanity.io") ||
        url.hostname === "res.cloudinary.com"
      )
    )
      return route.abort();
    try {
      if (!cache.has(url.href))
        cache.set(
          url.href,
          (async () => {
            const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
            return {
              status: r.status,
              contentType: r.headers.get("content-type") || undefined,
              body: Buffer.from(await r.arrayBuffer()),
            };
          })()
        );
      return route.fulfill({
        ...(await cache.get(url.href)),
        headers: { "access-control-allow-origin": origin },
      });
    } catch {
      return route.abort();
    }
  });
}
async function ready(page) {
  await page.waitForFunction(
    () =>
      document.querySelector("main h1") &&
      document.documentElement.dataset.seoReady === "true" &&
      !document.querySelector('[data-cms-loading="true"]')
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.querySelectorAll("main img")].map(img => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      })
    );
  });
}
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await relay(context);
    const page = await context.newPage();
    for (const path of [
      "/",
      "/services",
      "/services/toilet-unblocking",
      "/services/high-pressure-jetting",
      "/customers/restaurants",
      "/areas/kwun-tong",
      "/guide",
      "/cases",
    ]) {
      const r = await page.goto(origin + path, {
        waitUntil: "domcontentloaded",
      });
      assert.equal(r.status(), 200);
      await ready(page);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        brokenImages: [...document.querySelectorAll("main img")]
          .filter(img => !img.naturalWidth)
          .map(img => img.src),
        missingIcons: [
          ...document.querySelectorAll('a[href^="https://wa.me/"]'),
        ]
          .filter(a => !a.querySelector("[data-whatsapp-icon]"))
          .map(a => a.textContent.trim()),
        closedReading: document.querySelectorAll(
          "main .brand-disclosure:not([open])"
        ).length,
      }));
      assert(!state.overflow, path + " " + width);
      assert.deepEqual(state.brokenImages, [], path + " real images decode");
      assert.deepEqual(state.missingIcons, [], path + " WhatsApp icons");
      if (path === "/") {
        const caseTop = await page
          .locator(".home-recorded-cases")
          .evaluate(el => el.getBoundingClientRect().top + scrollY);
        const finderTop = await page
          .locator(".home-problems")
          .evaluate(el => el.getBoundingClientRect().top + scrollY);
        assert(
          finderTop < caseTop,
          "service selection guides visitors before real cases"
        );
        const arrangementTop = await page
          .locator(".home-arrangement")
          .evaluate(el => el.getBoundingClientRect().top + scrollY);
        assert(caseTop < arrangementTop);
        assert.equal(
          await page.locator(".home-arrangement__illustration img").count(),
          4
        );
        await page
          .locator(".home-arrangement")
          .screenshot({ path: output + "/arrangement-" + width + ".png" });
        assert.equal(await page.locator(".home-recorded-cases img").count(), 3);
        await page.screenshot({
          path: output + "/home-" + width + ".png",
          fullPage: true,
        });
        await page
          .locator(".home-recorded-cases")
          .screenshot({ path: output + "/cases-" + width + ".png" });
      }
      if (path === "/services/toilet-unblocking") {
        assert.equal(
          await page.locator(".reading-faq details[open]").count(),
          0
        );
        const first = page.locator("#service-answer-1");
        await first.locator("summary").focus();
        await page.keyboard.press("Enter");
        await first.locator("p").waitFor({ state: "visible" });
        assert.equal(await first.getAttribute("open"), "");
        await page.keyboard.press("Enter");
        assert.equal(await first.getAttribute("open"), null);
        await page.keyboard.press("Tab");
        assert.equal(
          await page.evaluate(
            () => document.activeElement.closest("details")?.id
          ),
          "service-answer-2"
        );
        await page.locator("#service-symptoms summary").click();
        await page
          .locator("#service-symptoms-content")
          .waitFor({ state: "visible" });
        await page.locator("#service-symptoms summary").click();
        await page.screenshot({
          path: output + "/service-" + width + ".png",
          fullPage: true,
        });
      }
      if (path === "/customers/restaurants") {
        assert(
          (await page.locator("#customer-cases img").count()) > 0,
          "published CMS case has a photograph"
        );
        await page.locator("[data-contact-panel] summary").click();
        await page.locator(".inquiry-checklist").waitFor({ state: "visible" });
        await page.locator("[data-contact-panel] summary").click();
      }
      observations.push({ path, width, ...state });
      console.log("PASS visual reading", path, width, JSON.stringify(state));
    }
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    reducedMotion: "no-preference",
  });
  await relay(context);
  const page = await context.newPage();
  await page.goto(origin + "/services/toilet-unblocking#service-answer-1");
  await ready(page);
  await page.waitForFunction(
    () => document.getElementById("service-answer-1").open
  );
  assert((await page.locator("#service-answer-1").boundingBox()).y < 200);
  await page.evaluate(() => {
    location.hash = "service-answer-2";
  });
  await page.waitForFunction(
    () => document.getElementById("service-answer-2").open
  );
  await page.locator("#service-answer-2 summary").click();
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.closest("details")?.id),
    "service-answer-3"
  );
  const popupPromise = page.waitForEvent("popup");
  await page.locator("#service-contact .contact-action--whatsapp").click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  assert(popup.url().startsWith("https://wa.me/"));
  await page.waitForURL("**/thanks?from=**");
  await page.locator(".handoff-card").waitFor();
  await context.close();
  const native = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  await relay(native);
  const n = await native.newPage();
  await n.goto(origin + "/services/toilet-unblocking");
  await n.locator("#service-answer-1 summary").focus();
  await n.keyboard.press("Enter");
  await n.locator("#service-answer-1 p").waitFor({ state: "visible" });
  await native.close();
  await fs.writeFile(
    output + "/verification.json",
    JSON.stringify(
      {
        observedAt: new Date().toISOString(),
        origin,
        transport:
          "Actual site and CMS responses via Node; analytics blocked, WhatsApp popup intercepted without messages.",
        observations,
        answerAnchors: true,
        closingFocus: true,
        nativeWithoutJavaScript: true,
        whatsappHandoff: true,
      },
      null,
      2
    )
  );
  console.log(
    "PASS answer anchors, closing focus, native reading without JavaScript and WhatsApp handoff"
  );
} finally {
  await browser.close();
}
