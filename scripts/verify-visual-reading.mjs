import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import { CUSTOMER_JOURNEYS } from "../shared/customerJourneys.ts";
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
      if (path === "/services" || path === "/guide") {
        const expectedImages = path === "/services" ? 11 : 3;
        assert.equal(await page.locator("main img").count(), expectedImages);
        assert.deepEqual(
          await page
            .locator("main img")
            .evaluateAll(images => [
              ...new Set(images.map(image => image.getAttribute("src"))),
            ]),
          ["/images/drainbear-services-ai.webp"],
          "all guide and service browsing images use AI art"
        );
        const frames = await page
          .locator("main .service-illustration")
          .evaluateAll(elements =>
            elements.map(element => {
              const outer = element.getBoundingClientRect();
              const scene = element
                .querySelector(".service-illustration__scene")
                .getBoundingClientRect();
              return {
                fits:
                  scene.width <= outer.width + 1 &&
                  scene.height <= outer.height + 1,
                square: Math.abs(scene.width - scene.height) < 1,
              };
            })
          );
        assert(
          frames.every(frame => frame.fits && frame.square),
          "AI scene stays complete within its card"
        );
        const customers = page.locator(".customer-path");
        for (const [index, customer] of CUSTOMER_JOURNEYS.entries()) {
          assert.equal(
            await customers
              .nth(index)
              .locator(`a[href="/customers/${customer.slug}"]`)
              .count(),
            1
          );
          assert.equal(
            await customers
              .nth(index)
              .locator("[data-service-illustration]")
              .count(),
            1
          );
        }
        if (path === "/services") {
          const slugs = [
            ...new Set(
              CUSTOMER_JOURNEYS.flatMap(customer => customer.serviceSlugs)
            ),
          ];
          assert.equal(slugs.length, 8);
          for (const slug of slugs) {
            assert.equal(
              await page
                .locator(
                  `.service-directory a[href="/services/${slug}"] [data-service-illustration="${slug}"]`
                )
                .count(),
              1
            );
          }
          await page
            .locator(".service-directory")
            .screenshot({ path: output + "/service-grid-" + width + ".png" });
        }
        await page.locator(".customer-paths").screenshot({
          path: output + "/customers-" + path.slice(1) + "-" + width + ".png",
        });
        await page.screenshot({
          path: output + "/illustrated-" + path.slice(1) + "-" + width + ".png",
          fullPage: true,
        });
      }
      if (path === "/") {
        assert.equal(
          await page
            .locator(".home-page > section")
            .nth(1)
            .getAttribute("data-home-section"),
          "quick-inquiry",
          "quick inquiry is the second homepage section"
        );
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
        for (const customer of CUSTOMER_JOURNEYS) {
          await page
            .getByRole("button", { name: customer.name, exact: true })
            .click();
          const panel = page.locator(`#home-finder-${customer.slug}`);
          await panel.waitFor({ state: "visible" });
          const serviceSelect = page.locator("#home-service");
          assert.deepEqual(
            await serviceSelect
              .locator("option")
              .evaluateAll(options => options.map(option => option.value)),
            [...customer.serviceSlugs, "unsure"]
          );
          await page.locator("#home-district").selectOption("kwun-tong");
          for (const slug of [...customer.serviceSlugs, "unsure"]) {
            await serviceSelect.selectOption(slug);
            const expectedService = await serviceSelect
              .locator("option:checked")
              .textContent();
            const destination = new URL(
              await page
                .locator(".home-service-finder__send")
                .getAttribute("href")
            );
            const message = destination.searchParams.get("text");
            assert(message.includes("觀塘"));
            assert(
              message.includes(slug === "unsure" ? "未確定" : expectedService)
            );
            assert.equal(
              await page
                .locator(
                  `.home-finder-query__preview [data-service-illustration="${slug}"]`
                )
                .count(),
              slug === "unsure" ? 0 : 1
            );
          }
          await serviceSelect.selectOption(customer.serviceSlugs[0]);
          await page.locator("#home-district").selectOption("");
          const optionalDistrictMessage = new URL(
            await page
              .locator(".home-service-finder__send")
              .getAttribute("href")
          ).searchParams.get("text");
          assert(!optionalDistrictMessage.includes("觀塘"));
          const disclosure = panel.locator("details");
          assert.equal(await disclosure.getAttribute("open"), null);
          await page.locator(".home-problems").screenshot({
            path: output + "/query-" + customer.slug + "-" + width + ".png",
          });
          await disclosure.locator("summary").click();
          assert.equal(
            await panel.locator("img").count(),
            customer.serviceSlugs.length
          );
          for (const slug of customer.serviceSlugs) {
            const link = panel.locator(`a[href="/services/${slug}"]`);
            assert.equal(
              await link
                .locator(`[data-service-illustration="${slug}"]`)
                .count(),
              1
            );
            assert.equal(
              await link.locator("img").getAttribute("src"),
              `/images/services/${slug}-224.webp`
            );
            assert(
              await link
                .locator("img")
                .evaluate(img => img.complete && img.naturalWidth > 0)
            );
          }
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1
            )
          );
          await page.locator(".home-problems").screenshot({
            path: output + "/finder-" + customer.slug + "-" + width + ".png",
          });
          await disclosure.locator("summary").click();
          await disclosure.locator("summary").focus();
          await page.keyboard.press("Tab");
          assert.notEqual(
            await page.evaluate(
              () => document.activeElement.closest("details")?.id
            ),
            `home-finder-options-${customer.slug}`,
            "closed service links leave the keyboard order"
          );
          await serviceSelect.selectOption(customer.serviceSlugs.at(-1));
        }
        await page
          .getByRole("button", { name: CUSTOMER_JOURNEYS[0].name, exact: true })
          .click();
        assert.equal(
          await page.locator("#home-service").inputValue(),
          CUSTOMER_JOURNEYS[0].serviceSlugs.at(-1),
          "service selection survives category switches"
        );
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
  await page.goto(origin + "/");
  await ready(page);
  await page
    .getByRole("button", { name: CUSTOMER_JOURNEYS[1].name, exact: true })
    .click();
  await page.locator("#home-service").selectOption("grease-trap-cleaning");
  await page.locator("#home-district").selectOption("kwun-tong");
  const inquiryPopupPromise = page.waitForEvent("popup");
  await page.locator(".home-service-finder__send").click();
  const inquiryPopup = await inquiryPopupPromise;
  await inquiryPopup.waitForLoadState();
  const inquiryText = new URL(inquiryPopup.url()).searchParams.get("text");
  assert(
    inquiryText.includes("隔油池") &&
      inquiryText.includes("觀塘") &&
      inquiryText.includes("食肆")
  );
  await page.waitForURL("**/thanks?from=home_service_finder*");
  await page.locator(".handoff-card").waitFor();
  const retry = page.getByRole("link", { name: "再次開啟 WhatsApp" });
  assert.equal(
    new URL(await retry.getAttribute("href")).searchParams.get("text"),
    inquiryText
  );
  const handoffs = () =>
    page.evaluate(
      () =>
        (window.dataLayer || []).filter(
          entry =>
            entry?.event === "whatsapp_handoff" ||
            (entry?.[0] === "event" && entry?.[1] === "whatsapp_handoff")
        ).length
    );
  const firstHandoffs = await handoffs();
  assert.equal(firstHandoffs, 1, "initial click produces one handoff");
  const retryPopupPromise = page.waitForEvent("popup");
  await retry.click();
  const retryPopup = await retryPopupPromise;
  await retryPopup.waitForLoadState();
  assert.equal(new URL(retryPopup.url()).searchParams.get("text"), inquiryText);
  assert.equal(
    await handoffs(),
    firstHandoffs,
    "retry does not repeat the handoff"
  );
  await page.reload();
  await page.locator(".handoff-card").waitFor();
  assert.equal(
    new URL(await retry.getAttribute("href")).searchParams.get("text"),
    inquiryText
  );
  assert.equal(await handoffs(), 0, "refresh consumes no new handoff");
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
  const fresh = await browser.newContext({
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  await relay(fresh);
  const freshPage = await fresh.newPage();
  await freshPage.goto(origin + "/thanks");
  await ready(freshPage);
  const fallbackText = new URL(
    await freshPage
      .getByRole("link", { name: "再次開啟 WhatsApp" })
      .getAttribute("href")
  ).searchParams.get("text");
  assert(
    !fallbackText.includes("觀塘") && !fallbackText.includes("隔油池"),
    "unrelated tabs use the ordinary contact"
  );
  await fresh.close();
  const native = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  await relay(native);
  const n = await native.newPage();
  await n.goto(origin + "/");
  await n.locator("#home-finder-options-residential summary").focus();
  await n.keyboard.press("Enter");
  await n
    .locator(
      "#home-finder-options-residential a[href='/services/toilet-unblocking']"
    )
    .waitFor({ state: "visible" });
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
        quickInquiry: {
          section: 2,
          categoryWidths: 15,
          optionalDistrict: true,
          unsureService: true,
          preservesChoices: true,
          selectedMessageHandoff: true,
        },
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
