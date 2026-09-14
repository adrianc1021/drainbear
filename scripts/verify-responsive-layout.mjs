// Regression: detect text outside the viewport even when an ancestor clips it.
// The former scrollWidth-only check missed wide flex children and CJK headings.
import { chromium, webkit } from "playwright";
import fs from "node:fs/promises";

const base = process.env.LAYOUT_BASE_URL || "http://127.0.0.1:4335";
const engines = (process.env.LAYOUT_ENGINES || "chromium,webkit").split(",");
const widths = (process.env.LAYOUT_WIDTHS || "320,360,390,430,768,1024,1440")
  .split(",")
  .map(Number);
const textScale = Number(process.env.LAYOUT_TEXT_SCALE || 1);
const interactions = process.env.LAYOUT_INTERACTIONS === "1";
const manifest = JSON.parse(
  await fs.readFile("dist/prerender/routes.json", "utf8")
);
const routes = process.env.LAYOUT_ROUTES?.split(",") || manifest.routes;
const directory =
  process.env.LAYOUT_SCREENSHOTS || "/tmp/drainbear-responsive-review";
await fs.mkdir(directory, { recursive: true });
const failures = [];
const isLocalPreview = ["127.0.0.1", "localhost"].includes(
  new URL(base).hostname
);
const publishedCmsResponses = new Map();

async function settleTextLayout(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
  });
}

async function inspect(page) {
  return page.evaluate(() => {
    const problems = new Set();
    if (document.documentElement.scrollWidth > innerWidth + 2) {
      problems.add("document has horizontal overflow");
    }
    for (const media of document.querySelectorAll(
      ".brand-hero__media, .home-capability-layout .db-media"
    )) {
      const box = media.getBoundingClientRect();
      const parent = media.parentElement.getBoundingClientRect();
      if (
        box.width < 1 ||
        box.height < 1 ||
        box.left < parent.left - 2 ||
        box.right > parent.right + 2
      ) {
        problems.add(`media outside its content column: ${media.className}`);
      }
    }
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    let node;
    while ((node = walker.nextNode())) {
      const element = node.parentElement;
      if (
        !node.textContent.trim() ||
        element.closest('script,style,svg,.sr-only,[aria-hidden="true"]')
      )
        continue;
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.fontSize === "0px") continue;
      let hidden = false;
      for (let parent = element; parent; parent = parent.parentElement) {
        const s = getComputedStyle(parent);
        if (s.display === "none" || Number(s.opacity) === 0) hidden = true;
      }
      if (hidden) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const label = node.textContent.trim().replace(/\s+/g, " ").slice(0, 75);
      // Only exempt table cells when they are genuinely accessible by scrolling.
      const tableScroller = element.closest(
        '[class*="overflow-x-auto"], [class*="overflow-x-scroll"]'
      );
      if (element.closest("table") && tableScroller) {
        const scrolling = getComputedStyle(tableScroller).overflowX;
        const box = tableScroller.getBoundingClientRect();
        if (
          ["auto", "scroll"].includes(scrolling) &&
          box.left >= -2 &&
          box.right <= innerWidth + 2
        )
          continue;
      }
      for (const rect of range.getClientRects()) {
        if (!rect.width || !rect.height) continue;
        if (rect.left < -2 || rect.right > innerWidth + 2)
          problems.add(`viewport: ${label}`);
        // Explicit preview truncation is allowed, never for headings or controls.
        if (element.closest('.truncate,[class*="line-clamp"]')) continue;
        for (
          let parent = element;
          parent && parent !== document.body;
          parent = parent.parentElement
        ) {
          const s = getComputedStyle(parent),
            box = parent.getBoundingClientRect();
          if (
            ["hidden", "clip"].includes(s.overflowX) &&
            (rect.left < box.left - 2 || rect.right > box.right + 2)
          ) {
            problems.add(`clipped by ${parent.tagName}: ${label}`);
          }
        }
      }
    }
    return [...problems];
  });
}

for (const engine of engines) {
  const browser = await { chromium, webkit }[engine].launch();
  try {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        isMobile: width < 768,
        hasTouch: width < 768,
        reducedMotion: "reduce",
      });
      // Never send conversions or estimate records while exercising production UI.
      await context.route(
        /google-analytics|googletagmanager|googleadservices|\/api\/trpc\/estimate\.record/,
        route => route.abort()
      );
      if (isLocalPreview) {
        // These arbitrary local ports are not registered as Sanity CORS origins.
        // Relay real, public, read-only responses in the test harness only.
        // Never install this relay for production-domain verification.
        await context.route(
          /^https:\/\/oyph9zy1\.api(?:cdn)?\.sanity\.io\/v[^/]+\/data\/query\/production\?/,
          async route => {
            const url = route.request().url();
            if (!publishedCmsResponses.has(url)) {
              const response = await fetch(url, {
                headers: { Accept: "application/json" },
              });
              if (!response.ok)
                throw new Error(
                  `Published CMS query failed: ${response.status}`
                );
              publishedCmsResponses.set(url, {
                status: response.status,
                headers: {
                  "content-type": "application/json",
                  "access-control-allow-origin": new URL(base).origin,
                },
                body: await response.text(),
              });
            }
            await route.fulfill(publishedCmsResponses.get(url));
          }
        );
      }
      const page = await context.newPage();
      for (const route of routes) {
        const response = await page.goto(`${base}${route}`, {
          waitUntil: "networkidle",
        });
        if (!response?.ok()) {
          failures.push(
            `${engine} ${width} ${route}: HTTP ${response?.status()}`
          );
          continue;
        }
        await page.locator("h1").first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        const title = await page.locator("h1").first().textContent();
        if (/文章暫時未能載入|找不到頁面/.test(title)) {
          failures.push(
            `${engine} ${width} ${route}: expected content missing (${title})`
          );
          continue;
        }
        if (textScale !== 1) {
          await page.addStyleTag({
            content: `html { font-size: ${textScale * 100}% !important; }`,
          });
          await settleTextLayout(page);
        }
        const problems = await inspect(page);
        if (problems.length)
          failures.push(`${engine} ${width} ${route}: ${problems.join(" | ")}`);
        if (interactions) {
          const checkState = async state => {
            await settleTextLayout(page);
            const issues = await inspect(page);
            if (issues.length)
              failures.push(
                `${engine} ${width} ${route} ${state}: ${issues.join(" | ")}`
              );
          };
          if (route === "/guide") {
            const calculator = page.locator("#calculator");
            await calculator
              .getByRole("button", { name: "大廈主渠 / 沙井", exact: true })
              .click();
            await calculator
              .getByRole("button", { name: "村屋 / 獨立屋", exact: true })
              .click();
            await calculator
              .getByRole("button", { name: "深夜（23:00–07:00）", exact: true })
              .click();
            await calculator
              .getByRole("link", { name: "WhatsApp 確認實際報價", exact: true })
              .waitFor();
            const href = await calculator
              .locator(".calculator-result-cta")
              .getAttribute("href");
            const url = new URL(href);
            const message = url.searchParams.get("text") || "";
            if (
              url.hostname !== "wa.me" ||
              !message.includes("HK$2950–5700") ||
              !message.includes("村屋 / 獨立屋")
            ) {
              failures.push(
                `${engine} ${width}: calculator price/message incorrect: ${message}`
              );
            }
            await checkState("calculator result");
            await calculator.screenshot({
              path: `${directory}/${engine}-${width}-calculator-${textScale}x.png`,
            });
            await calculator
              .getByRole("button", { name: "重新選擇", exact: true })
              .click();
            if (await calculator.locator('[aria-pressed="true"]').count())
              failures.push(`${engine} ${width}: calculator reset failed`);
            await checkState("calculator reset");
          }
          if (route === "/areas") {
            const search = page.getByRole("combobox", { name: "搜尋服務地區" });
            await search.fill("觀塘");
            await page.getByRole("option").first().waitFor();
            await checkState("area search");
            await search.press("ArrowDown");
            await search.press("Enter");
            await page.waitForURL(/\/areas\/kwun-tong$/, { timeout: 10_000 });
            await checkState("area selected");
          }
          if (route === "/faq") {
            await page.locator("main details").evaluateAll(items =>
              items.forEach(item => {
                item.open = true;
              })
            );
            await checkState("FAQ expanded");
          }
          if (route === "/") {
            const menu = page.locator('[data-mobile-menu-trigger="true"]');
            if (await menu.isVisible()) {
              await menu.click();
              await page.locator("#mobile-navigation").waitFor();
              await checkState("menu open");
              await page.keyboard.press("Escape");
              await page
                .locator("#mobile-navigation")
                .waitFor({ state: "detached" });
            }
            const footer = page.locator(
              '[data-site-footer="true"] button[aria-controls^="footer-area-panel"]'
            );
            for (const button of await footer.all())
              if (await button.isVisible()) await button.click();
            await checkState("footer expanded");
          }
        }
        if (
          [390, 1440].includes(width) &&
          [
            "/",
            "/services",
            "/guide",
            "/areas",
            "/faq",
            "/services/main-drain-manhole",
          ].includes(route)
        ) {
          await page.screenshot({
            path: `${directory}/${engine}-${width}-${route.replaceAll("/", "_") || "home"}.png`,
            fullPage: true,
          });
        }
      }
      console.log(`CHECKED ${engine} ${width}px: ${routes.length} routes`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `PASS: ${routes.length} routes, ${widths.length} widths, ${engines.length} engines, text ${textScale}x, interactions ${interactions}. Screenshots: ${directory}`
  );
