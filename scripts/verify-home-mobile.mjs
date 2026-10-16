import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import { enableCmsRelay } from "./browser-cms-relay.ts";

const origin = process.env.QA_ORIGIN || "http://localhost:4570";
const output = process.env.MOBILE_REVIEW_OUTPUT || "/tmp/drainbear-home-mobile";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
});
const checks = {};
async function ready(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(
    () =>
      document.querySelector("main h1") &&
      document.documentElement.dataset.seoReady === "true" &&
      !document.querySelector('[data-cms-loading="true"]')
  );
}
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  if (origin.includes("localhost")) await enableCmsRelay(context, origin);
  const page = await context.newPage();
  await page.goto(origin);
  await ready(page);
  assert(
    !(await page
      .locator('[data-mobile-cta="true"]')
      .innerText()
      .then(text => text.includes("加快初步判斷"))),
    "default sticky CTA must not repeat helper copy"
  );
  const sticky = page.locator('[data-mobile-cta="true"]');
  await sticky.waitFor({ state: "hidden" });
  assert.equal(
    await page
      .locator(".home-hero .contact-action__mobile-value")
      .allTextContents()
      .then(items => items.join(" / ")),
    "WhatsApp / 致電查詢"
  );
  for (const label of await page
    .locator(".home-hero .contact-action__mobile-value")
    .all())
    assert(await label.isVisible());
  const actions = await page
    .locator(".home-hero .contact-action")
    .evaluateAll(items =>
      items.map(item => {
        const r = item.getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, height: r.height };
      })
    );
  assert(
    actions.every(a => a.height >= 44 && a.height <= 56 && a.right <= 390),
    "hero controls remain compact touch targets"
  );
  assert(
    Math.abs(actions[0].y - actions[1].y) < 1,
    "hero contacts sit on the same row"
  );
  await page.locator(".home-service-rows").scrollIntoViewIfNeeded();
  await sticky.waitFor({ state: "visible" });
  await page.evaluate(() => scrollTo(0, 0));
  await sticky.waitFor({ state: "hidden" });
  checks.mobileHero =
    "compact labelled contacts share a row; sticky contacts appear after hero actions and disappear on return";
  const methods = page.locator("#home-method-details");
  assert(
    !(await methods.evaluate(el => el.open)),
    "technical details start collapsed"
  );
  await methods.locator("summary").focus();
  await page.keyboard.press("Enter");
  await methods.locator("dl").waitFor({ state: "visible" });
  assert.equal(await methods.locator("dt").count(), 3);
  await methods.locator("summary").focus();
  await page.keyboard.press("Space");
  assert(!(await methods.evaluate(el => el.open)));
  await page.evaluate(() => {
    location.hash = "home-method-details-content";
  });
  await page.waitForFunction(
    () => document.querySelector("#home-method-details").open
  );
  assert(await methods.evaluate(el => el.open));
  await methods.locator("summary").click();
  await page.evaluate(() => history.replaceState(null, "", "/"));
  checks.methodDetails =
    "three method limitations remain available by native keyboard disclosure and anchor";
  const rail = page.locator(".home-service-rail");
  const track = rail.locator(".home-mobile-rail__track");
  await track.scrollIntoViewIfNeeded();
  const cdp = await context.newCDPSession(page);
  let box = await track.boundingBox();
  async function swipe(x, y, dx, dy) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y, id: 0 }],
    });
    for (let step = 1; step <= 12; step++) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          { x: x + (dx * step) / 12, y: y + (dy * step) / 12, id: 0 },
        ],
      });
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  console.log(JSON.stringify({ touchStart: box }));
  await swipe(
    Math.round(box.x + box.width * 0.8),
    Math.round(box.y + 100),
    -240,
    0
  );
  await page.waitForFunction(
    () =>
      document.querySelector(".home-service-rail .home-mobile-rail__track")
        .scrollLeft > 100
  );
  assert(
    !page.url().includes("/services/"),
    "swipe must not activate a service link"
  );
  checks.touchSwipe = "Chromium CDP touch scroll moves the service rail";
  box = await track.boundingBox();
  const before = await page.evaluate(() => scrollY);
  await swipe(
    Math.round(box.x + box.width / 2),
    Math.round(box.y + 100),
    0,
    -180
  );
  await page.waitForFunction(y => scrollY > y + 60, before);
  checks.verticalScroll = "vertical touch over the rail still scrolls the page";
  await track.focus();
  await page.keyboard.press("End");
  await rail
    .locator(".home-mobile-rail__count")
    .filter({ hasText: "4 / 4" })
    .waitFor();
  await page.keyboard.press("Home");
  await rail
    .locator(".home-mobile-rail__count")
    .filter({ hasText: "1 / 4" })
    .waitFor();
  checks.keyboard = "Home/End and native scrolling update the counter";
  const films = page.locator(".home-work-films");
  const first = films.locator("video").first();
  await first.scrollIntoViewIfNeeded();
  await first.click();
  await first.evaluate(video => video.play());
  await page.waitForFunction(
    video => video.currentTime > 0.1,
    await first.elementHandle()
  );
  await films
    .getByRole("button", { name: "下一項施工短片", exact: true })
    .click();
  await films
    .locator(".home-mobile-rail__count")
    .filter({ hasText: "2 / 2" })
    .waitFor();
  await page.waitForFunction(
    () => document.querySelector(".home-work-films video").paused
  );
  assert(
    await films
      .locator("video")
      .nth(1)
      .evaluate(video => video.paused),
    "next film must not autoplay"
  );
  checks.video =
    "real video plays, pauses when swiped away, and the next film does not autoplay";
  const disclosure = page.locator(".home-evidence-details").first();
  await disclosure.locator("summary").click();
  await disclosure.locator("dl").waitFor({ state: "visible" });
  // Fully settle the native opening before exercising the immediate close/Tab path.
  for (
    let i = 0;
    i < 40 &&
    (await disclosure.evaluate(
      el => el.getAnimations({ subtree: true }).length
    ));
    i++
  )
    await new Promise(resolve => setTimeout(resolve, 50));
  await disclosure.locator("summary").click();
  await page.keyboard.press("Tab");
  assert(
    await disclosure
      .locator(".brand-disclosure__body")
      .evaluate(el => el.inert && !el.contains(document.activeElement))
  );
  checks.closingFocus = "closed case content immediately becomes inert";
  await context.close();
  const native = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const p = await native.newPage();
  await p.goto(origin);
  assert.equal(await p.locator(".home-service-row").count(), 4);
  assert.equal(await p.locator(".home-work-films video").count(), 2);
  assert(
    !(await p
      .locator(".home-service-rail .home-mobile-rail__buttons")
      .isVisible())
  );
  const nativeMethods = p.locator("#home-method-details");
  await nativeMethods.locator("summary").click();
  await nativeMethods.locator("dl").waitFor({ state: "visible" });
  assert.equal(await nativeMethods.locator("dt").count(), 3);
  assert(
    await nativeMethods
      .getByRole("link", { name: "查看工具選擇指南" })
      .isVisible()
  );
  const details = p.locator(".home-evidence-details").first();
  await details.locator("summary").click();
  await details.locator("dl").waitFor({ state: "visible" });
  assert.equal(await details.locator("dt").count(), 4);
  checks.noJavaScript =
    "all service links and videos remain; native details reveal all four case facts; inactive controls hidden";
  await native.close();
  const report = {
    origin,
    verifiedAt: new Date().toISOString(),
    engine: "Chromium",
    physicalDeviceTested: false,
    checks,
  };
  await fs.writeFile(`${output}/checks.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
