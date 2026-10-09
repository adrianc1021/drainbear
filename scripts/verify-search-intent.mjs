import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.argv[2] || "http://localhost:4580";
const output =
  process.env.SEARCH_INTENT_QA_OUTPUT || "/tmp/drainbear-search-intent";
const axePath = process.env.AXE_SOURCE_PATH;
await fs.mkdir(output, { recursive: true });
const axe = axePath ? await fs.readFile(axePath, "utf8") : null;
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const cache = new Map(),
  observations = [],
  errors = [];
async function relay(context) {
  await context.route("**/*", async route => {
    const request = route.request(),
      url = new URL(request.url());
    if (url.hostname === "wa.me")
      return route.fulfill({
        status: 200,
        body: "QA interception; no message sent",
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
            const response = await fetch(url, {
              signal: AbortSignal.timeout(30000),
            });
            return {
              status: response.status,
              contentType: response.headers.get("content-type") || undefined,
              body: Buffer.from(await response.arrayBuffer()),
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
      Array.from(document.querySelectorAll("main img"), image => {
        image.loading = "eager";
        return image.decode().catch(() => {});
      })
    );
  });
}
const paths = [
  "/services/bathroom-drain-unblocking",
  "/services/kitchen-sink-unblocking",
  "/services/toilet-unblocking",
  "/services/main-drain-manhole",
  "/guide",
  "/blog/hong-kong-drain-cleaning-price-guide",
  "/blog/bathroom-hair-clog-prevention",
  "/blog/bathroom-drain-smell-causes-solutions",
  "/blog/prevent-kitchen-sink-clog",
  "/blog/toilet-clog-emergency-guide",
  "/areas/tseung-kwan-o",
  "/areas/causeway-bay",
  "/areas/north-point",
  "/areas/kwun-tong",
  "/areas/sha-tin",
  "/areas/yuen-long",
  "/",
];
const internalLinks = new Set();
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await relay(context);
    const page = await context.newPage();
    page.on("pageerror", error =>
      errors.push({ width, url: page.url(), message: error.message })
    );
    for (const path of paths) {
      assert.equal(
        (
          await page.goto(origin + path, { waitUntil: "domcontentloaded" })
        ).status(),
        200
      );
      await ready(page);
      const state = await page.evaluate(() => {
        const nodes = value =>
          Array.isArray(value)
            ? value.flatMap(nodes)
            : value?.["@graph"]
              ? nodes(value["@graph"])
              : [value];
        const schemas = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        ).flatMap(script => nodes(JSON.parse(script.textContent)));
        return {
          title: document.title,
          h1s: document.querySelectorAll("main h1").length,
          canonical: document.querySelector('link[rel="canonical"]').href,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          brokenImages: Array.from(
            document.querySelectorAll("main img")
          ).filter(img => !img.complete || !img.naturalWidth).length,
          height: document.documentElement.scrollHeight,
          faq: schemas.find(item => item?.["@type"] === "FAQPage"),
          article: schemas.find(item => item?.["@type"] === "Article"),
          text: document.querySelector("main").textContent,
          links: Array.from(document.querySelectorAll("main a[href]"))
            .map(a => a.getAttribute("href"))
            .filter(href => href.startsWith("/")),
          badWhatsApp: Array.from(
            document.querySelectorAll('a[href^="https://wa.me/"]')
          ).filter(a => !a.querySelector("[data-whatsapp-icon]")).length,
        };
      });
      assert.equal(state.h1s, 1);
      assert.equal(state.overflow, false);
      assert.equal(state.brokenImages, 0);
      assert.equal(state.badWhatsApp, 0);
      assert.equal(state.canonical, "https://drainbearhk.com" + path);
      if (state.faq)
        for (const question of state.faq.mainEntity) {
          assert(
            state.text.includes(question.name) &&
              state.text.includes(question.acceptedAnswer.text)
          );
          if (question.url)
            assert(
              await page
                .locator('[id="' + new URL(question.url).hash.slice(1) + '"]')
                .count()
            );
        }
      if (path.startsWith("/services/")) {
        const slug = path.split("/").at(-1);
        assert(
          await page
            .locator(
              '.service-intent-overview [data-service-illustration="' +
                slug +
                '"]'
            )
            .count()
        );
        assert.equal(state.faq.mainEntity.length, 5);
        assert(
          (await page.locator("#service-answer-summary").boundingBox()).y <
            (await page.locator("#service-cases").boundingBox()).y
        );
        assert(
          await page
            .locator('[id^="service-reading-"] a[href^="/blog/"]')
            .count()
        );
        const summary = page.locator("#service-symptoms > summary");
        await summary.focus();
        await page.keyboard.press("Enter");
        assert(
          await page.locator("#service-symptoms").evaluate(node => node.open)
        );
        await page.keyboard.press("Enter");
      }
      if (path.startsWith("/areas/")) {
        const name = await page.locator("main h1").innerText();
        assert.equal(
          await page.locator(".district-service-links a").count(),
          4
        );
        assert.equal(
          await page
            .locator(".district-service-links [data-service-illustration]")
            .count(),
          4
        );
        assert.equal(
          await page.locator(".district-reading-aside__photo").count(),
          0
        );
        const panel = page.locator("[data-contact-panel]");
        for (const [value, label] of [
          ["residential", "住宅住戶"],
          ["restaurants", "食肆及商舖"],
          ["property-management", "業主及物業管理"],
        ]) {
          await panel.locator("select").selectOption(value);
          const href = await panel
            .locator('a[href^="https://wa.me/"]')
            .getAttribute("href");
          const message = new URL(href).searchParams.get("text");
          assert(
            message.includes(name.replace("通渠服務", "")) &&
              message.includes("場所：" + label)
          );
          assert(message.includes("請提供："));
        }
      }
      if (path === "/blog/hong-kong-drain-cleaning-price-guide") {
        assert(!/數百元|一千多元|不成功不收費|超低起步價/.test(state.text));
        assert.equal(state.article.dateModified, "2026-10-09");
        assert(!state.article.reviewedBy);
        assert.equal(state.faq.mainEntity.length, 3);
        assert(
          await page.locator('.article-resources a[href="/guide"]').count()
        );
      }
      if (
        path.startsWith("/blog/") &&
        path !== "/blog/hong-kong-drain-cleaning-price-guide"
      ) {
        assert(
          await page.locator('.article-resources a[href^="/services/"]').count()
        );
      }
      if (path === "/guide") {
        assert(state.title.includes("資料清單"));
        assert(
          await page
            .locator('a[href="/blog/hong-kong-drain-cleaning-price-guide"]')
            .count()
        );
      }
      for (const link of state.links) internalLinks.add(link);
      if (axe && width !== 320) {
        await page.addScriptTag({ content: axe });
        const result = await page.evaluate(() =>
          axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
            },
          })
        );
        assert.equal(
          result.violations.length,
          0,
          JSON.stringify(
            result.violations.map(v => ({
              id: v.id,
              targets: v.nodes.map(n => n.target),
            }))
          )
        );
      }
      if (
        width !== 320 &&
        [
          "/services/bathroom-drain-unblocking",
          "/areas/causeway-bay",
          "/blog/hong-kong-drain-cleaning-price-guide",
        ].includes(path)
      ) {
        await page.screenshot({
          path:
            output +
            "/" +
            path.slice(1).replaceAll("/", "-") +
            "-" +
            width +
            ".png",
          fullPage: true,
        });
      }
      observations.push({
        path,
        width,
        title: state.title,
        height: state.height,
        faqAnswers: state.faq?.mainEntity.length || 0,
      });
      console.log("PASS", path, width);
    }
    await context.close();
  }
  for (const href of internalLinks) {
    const url = new URL(href, origin),
      r = await fetch(url.origin + url.pathname, {
        signal: AbortSignal.timeout(30000),
      });
    assert.equal(r.status, 200, href);
    if (url.hash)
      assert((await r.text()).includes('id="' + url.hash.slice(1) + '"'), href);
  }
  assert.equal(errors.length, 0, JSON.stringify(errors));
  await fs.writeFile(
    output + "/results.json",
    JSON.stringify(
      {
        origin,
        layouts: observations.length,
        axeChecks: axe ? paths.length * 2 : 0,
        internalLinks: internalLinks.size,
        observations,
        errors,
      },
      null,
      2
    )
  );
  console.log(
    "PASS: " +
      observations.length +
      " layouts, " +
      (axe ? paths.length * 2 : 0) +
      " axe checks, " +
      internalLinks.size +
      " internal links, localized customer WhatsApp messages and SEO/FAQ metadata."
  );
} finally {
  await browser.close();
}
