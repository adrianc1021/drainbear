import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.argv[2] || "http://localhost:4580";
const output =
  process.env.AUDIT_QA_OUTPUT || "/tmp/drainbear-audit-improvements";
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
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await relay(context);
    const page = await context.newPage();
    page.on("pageerror", error =>
      errors.push({ width, url: page.url(), message: error.message })
    );
    for (const path of [
      "/services",
      "/guide",
      "/blog",
      "/service-process",
      "/about",
      "/customers/residential",
      "/customers/restaurants",
      "/customers/property-management",
    ]) {
      const response = await page.goto(origin + path, {
        waitUntil: "domcontentloaded",
      });
      assert.equal(response.status(), 200);
      await ready(page);
      const state = await page.evaluate(() => {
        const visible = element => {
          if (
            element.closest("[hidden],[inert],.sr-only") ||
            !element.checkVisibility({
              visibilityProperty: true,
              opacityProperty: true,
            })
          )
            return false;
          for (
            let details = element.closest("details");
            details;
            details = details.parentElement.closest("details")
          )
            if (
              !details.open &&
              !details.querySelector(":scope > summary")?.contains(element)
            )
              return false;
          return true;
        };
        const main = document.querySelector("main"),
          walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
        let node,
          chars = 0;
        while ((node = walker.nextNode()))
          if (visible(node.parentElement))
            chars += node.textContent.replace(/\s/g, "").length;
        return {
          height: document.documentElement.scrollHeight,
          defaultTextChars: chars,
          visibleImages: Array.from(main.querySelectorAll("img")).filter(
            visible
          ).length,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          brokenImages: Array.from(main.querySelectorAll("img"))
            .filter(image => !image.naturalWidth)
            .map(image => image.src),
          serviceColumns: main.querySelector(".service-directory")
            ? getComputedStyle(main.querySelector(".service-directory"))
                .gridTemplateColumns
            : null,
        };
      });
      assert(!state.overflow, `${path} ${width} overflow`);
      assert.deepEqual(state.brokenImages, [], `${path} ${width} images`);
      if (path === "/services" && width < 640)
        assert.equal(
          state.serviceColumns.split(" ").length,
          2,
          "two mobile service columns"
        );
      if (path === "/blog") {
        assert.equal(await page.locator(".blog-reading-card").count(), 6);
        assert.equal(
          await page.locator("#blog-article-directory[open]").count(),
          0
        );
        assert(
          (await page.locator("#blog-article-directory a").count()) > 6,
          "all CMS and static articles remain linked"
        );
      }
      if (path === "/service-process") {
        assert.equal(
          await page.locator("[data-process-illustration]").count(),
          4
        );
        assert.equal(
          await page.locator("main .brand-disclosure[open]").count(),
          0
        );
        assert(
          !(await page.locator("main").innerText()).includes("不成功不收費")
        );
      }
      if (path === "/about")
        assert.deepEqual(
          await page
            .locator("main img")
            .evaluateAll(images =>
              Array.from(
                new Set(images.map(image => image.getAttribute("src")))
              )
            ),
          ["/images/drainbear-services-ai.webp"]
        );
      if (path.startsWith("/customers/"))
        assert.deepEqual(
          await page
            .locator(".customer-services-grid img")
            .evaluateAll(images =>
              Array.from(
                new Set(images.map(image => image.getAttribute("src")))
              )
            ),
          ["/images/drainbear-services-ai.webp"]
        );
      const frames = await page
        .locator(".service-illustration")
        .evaluateAll(elements =>
          elements.map(element => {
            const outer = element.getBoundingClientRect(),
              scene = element
                .querySelector(".service-illustration__scene")
                .getBoundingClientRect();
            return {
              fits:
                scene.left >= outer.left - 1 &&
                scene.right <= outer.right + 1 &&
                scene.top >= outer.top - 1 &&
                scene.bottom <= outer.bottom + 1,
              square: Math.abs(scene.width - scene.height) < 1,
            };
          })
        );
      assert(
        frames.every(frame => frame.fits && frame.square),
        `${path} ${width} complete artwork`
      );
      assert.equal(
        await page.locator('meta[property="og:image"]').getAttribute("content"),
        "https://drainbearhk.com/images/drainbear-paper-hero.webp"
      );
      if (axe && [390, 1440].includes(width)) {
        await page.addScriptTag({ content: axe });
        const violations = await page.evaluate(async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
              },
            })
          ).violations.map(v => ({
            id: v.id,
            nodes: v.nodes.map(n => n.target),
          }))
        );
        state.axe = violations;
        assert.deepEqual(violations, [], `${path} ${width} axe`);
      }
      observations.push({ path, width, ...state });
      console.log("PASS", path, width, JSON.stringify(state));
      if ([390, 1440].includes(width))
        await page.screenshot({
          path: `${output}/${path.slice(1).replaceAll("/", "-")}-${width}.png`,
          fullPage: true,
        });
    }
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  await relay(context);
  const page = await context.newPage();
  await page.goto(origin + "/blog");
  await ready(page);
  const first = await page
      .locator(".blog-reading-card")
      .first()
      .getAttribute("href"),
    total = await page.locator("#blog-article-directory a").count();
  await page.getByRole("link", { name: "第 2 頁", exact: true }).click();
  await page.waitForURL("**/blog?page=2");
  await page.waitForFunction(() => {
    const y = document
      .getElementById("blog-results-heading")
      .getBoundingClientRect().top;
    return y >= 70 && y < 140;
  });
  assert.notEqual(
    await page.locator(".blog-reading-card").first().getAttribute("href"),
    first
  );
  assert.equal(
    await page
      .getByRole("link", { name: "第 2 頁", exact: true })
      .getAttribute("aria-current"),
    "page"
  );
  await page.reload();
  await ready(page);
  assert.equal(await page.locator(".blog-reading-card").count(), 6);
  await page.goBack();
  await ready(page);
  assert.equal(
    await page.locator(".blog-reading-card").first().getAttribute("href"),
    first
  );
  await page.getByRole("button", { name: "商業渠務", exact: true }).click();
  await page.waitForURL("**/blog?category=*");
  assert(
    (
      await page.locator(".blog-reading-card .brand-eyebrow").allTextContents()
    ).every(text => text === "商業渠務")
  );
  await page.getByRole("button", { name: "全部文章", exact: true }).click();
  await page.waitForURL(origin + "/blog");
  await page.getByLabel("搜尋渠務問題").fill("隔油池");
  await page.getByRole("button", { name: "搜尋", exact: true }).click();
  await page.waitForURL("**/blog?q=*");
  assert((await page.locator(".blog-reading-card").count()) > 0);
  assert(
    (await page.locator("#blog-results-heading").textContent()).includes("找到")
  );
  await page.getByLabel("搜尋渠務問題").fill("zz-no-match-789");
  await page.getByRole("button", { name: "搜尋", exact: true }).click();
  await page.locator(".blog-empty").waitFor();
  assert.equal(await page.locator(".blog-reading-card").count(), 0);
  assert.equal(await page.locator("#blog-article-directory a").count(), total);
  await page.getByRole("link", { name: "查看全部文章", exact: true }).click();
  await page.waitForURL(origin + "/blog");
  for (const pageNumber of ["999", "-1", "NaN"]) {
    await page.goto(origin + "/blog?page=" + pageNumber);
    await ready(page);
    assert((await page.locator(".blog-reading-card").count()) > 0);
  }
  await page.goto(origin + "/blog");
  await ready(page);
  await page.locator("#blog-article-directory summary").focus();
  await page.keyboard.press("Enter");
  await page
    .locator("#blog-article-directory nav")
    .waitFor({ state: "visible" });
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.closest("#blog-article-directory")
    ),
    null
  );
  for (const path of ["/guide", "/service-process"]) {
    await page.goto(origin + path);
    await ready(page);
    const panel = page.locator("[data-contact-panel]");
    await panel.locator("summary").click();
    for (const customer of [
      "residential",
      "restaurants",
      "property-management",
    ]) {
      await panel.locator("select").selectOption(customer);
      const message = new URL(
        await panel.locator(".contact-action--whatsapp").getAttribute("href")
      ).searchParams.get("text");
      assert(
        message.includes(
          customer === "restaurants"
            ? "食肆"
            : customer === "property-management"
              ? "物業"
              : "住宅"
        )
      );
      assert((await panel.locator(".inquiry-checklist li").count()) >= 3);
    }
  }
  await context.close();
  const native = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  await relay(native);
  const n = await native.newPage();
  await n.goto(origin + "/blog");
  assert.equal(await n.locator("#blog-article-directory a").count(), total);
  await n.locator("#blog-article-directory summary").click();
  await n.locator("#blog-article-directory nav").waitFor({ state: "visible" });
  await native.close();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    output + "/verification.json",
    JSON.stringify(
      {
        origin,
        observedAt: new Date().toISOString(),
        transport:
          "Real site/CMS responses relayed. Analytics blocked. WhatsApp intercepted without sending messages.",
        observations,
        errors,
        flows: [
          "Blog pagination/direct URLs/back/search/category/empty/reset/invalid page/keyboard/native links",
          "Customer preparation and WhatsApp message selection",
        ],
      },
      null,
      2
    )
  );
  console.log("PASS interactive and native flows");
} finally {
  await browser.close();
}
