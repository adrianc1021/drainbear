import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.SITE_CHROME_TEST_PORT || 4213);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 45_000) {
    try {
      const response = await fetch(`${BASE_URL}/`);

      if (response.ok) return;
    } catch {
      // 等待 production server。
    }

    await sleep(250);
  }

  throw new Error(`Production server 未能啟動：${BASE_URL}`);
}

async function isVisible(locator) {
  if ((await locator.count()) === 0) return false;

  return locator.first().evaluate(element => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) !== 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  });
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

server.stdout.on("data", data => {
  process.stdout.write(`[server] ${data}`);
});

server.stderr.on("data", data => {
  process.stderr.write(`[server] ${data}`);
});

let browser;

try {
  await waitForServer();

  browser = await chromium.launch({ headless: true });

  /*
   * 390px mobile:
   * menu autofocus / focus trap / Escape / scroll lock / conversion chrome
   */
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });

    const page = await context.newPage();
    const pageErrors = [];

    page.on("pageerror", error => {
      pageErrors.push(error);
    });

    await page.goto(`${BASE_URL}/`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    await page.locator('[data-mobile-menu-trigger="true"]').waitFor({
      state: "visible",
      timeout: 15_000,
    });

    assert(
      await isVisible(page.locator('[data-mobile-cta="true"]')),
      "390px：Mobile CTA 應該可見"
    );

    assert(
      !(await isVisible(page.locator('[data-whatsapp-widget="true"]'))),
      "390px：Desktop WhatsApp widget 不應可見"
    );

    const menuButton = page.locator('[data-mobile-menu-trigger="true"]');
    await menuButton.click();

    const mobileNavigation = page.locator('[data-mobile-navigation="true"]');

    await mobileNavigation.waitFor({
      state: "visible",
      timeout: 5_000,
    });

    await page.waitForFunction(() => {
      return (
        document.activeElement?.getAttribute("data-mobile-nav-link") === "true"
      );
    });

    const bodyOverflow = await page.evaluate(
      () => window.getComputedStyle(document.body).overflow
    );

    assert(
      bodyOverflow === "hidden",
      `390px：開啟 menu 後 body overflow 應為 hidden，實際 ${bodyOverflow}`
    );

    const firstFocused = await page.evaluate(() => {
      const first = document.querySelector(
        '[data-mobile-navigation="true"] [data-mobile-nav-link="true"]'
      );

      return document.activeElement === first;
    });

    assert(firstFocused, "390px：開啟 menu 後首個連結未獲得焦點");

    await page.keyboard.press("Shift+Tab");

    const shiftTabTrapped = await page.evaluate(() => {
      const panel = document.querySelector('[data-mobile-navigation="true"]');

      if (!panel) return false;

      const focusable = [
        ...panel.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
      ].filter(element => {
        const style = window.getComputedStyle(element);

        return style.display !== "none" && style.visibility !== "hidden";
      });

      return document.activeElement === focusable.at(-1);
    });

    assert(shiftTabTrapped, "390px：Shift+Tab 未由第一項循環到最後一項");

    await page.keyboard.press("Tab");

    const tabTrapped = await page.evaluate(() => {
      const first = document.querySelector(
        '[data-mobile-navigation="true"] [data-mobile-nav-link="true"]'
      );

      return document.activeElement === first;
    });

    assert(tabTrapped, "390px：Tab 未由最後一項循環到第一項");

    await page.keyboard.press("Escape");

    await page.waitForFunction(() => {
      return !document.querySelector('[data-mobile-navigation="true"]');
    });

    const focusReturned = await page.evaluate(() => {
      return (
        document.activeElement?.getAttribute("data-mobile-menu-trigger") ===
        "true"
      );
    });

    assert(focusReturned, "390px：Escape 關閉後焦點未返回 menu button");

    const bodyOverflowAfterClose = await page.evaluate(
      () => document.body.style.overflow
    );

    assert(
      bodyOverflowAfterClose === "",
      "390px：關閉 menu 後 body scroll lock 未解除"
    );

    const mobileOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));

    assert(
      mobileOverflow.scrollWidth <= mobileOverflow.innerWidth + 1,
      `390px：頁面水平溢出 ${JSON.stringify(mobileOverflow)}`
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
        timeout: 15_000,
      });

    await page.waitForFunction(
      () => {
        return (
          !document.querySelector('[data-mobile-cta="true"]') &&
          !document.querySelector('[data-whatsapp-widget="true"]') &&
          !document.querySelector('[data-header-whatsapp="true"]')
        );
      },
      undefined,
      {
        timeout: 15_000,
      }
    );

    assert(
      (await page.locator('[data-mobile-cta="true"]').count()) === 0,
      "/thanks：不應渲染 Mobile CTA"
    );

    assert(
      (await page.locator('[data-whatsapp-widget="true"]').count()) === 0,
      "/thanks：不應渲染 WhatsApp widget"
    );

    assert(
      (await page.locator('[data-header-whatsapp="true"]').count()) === 0,
      "/thanks：不應渲染 Header WhatsApp CTA"
    );

    assert(
      pageErrors.length === 0,
      `390px：出現 ${pageErrors.length} 個 browser page error`
    );

    console.log(
      "PASS：390px menu focus、focus trap、Escape、scroll lock、CTA 及 /thanks"
    );

    await context.close();
  }

  /*
   * Tablet widths:
   * desktop navigation remains visible and no horizontal overflow
   */
  for (const width of [768, 1024]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });

    const page = await context.newPage();

    await page.goto(`${BASE_URL}/`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    await page
      .getByRole("navigation", {
        name: "主要導覽",
      })
      .waitFor({
        state: "visible",
        timeout: 15_000,
      });

    const tabletResult = await page.evaluate(() => {
      const header = document.querySelector('[data-site-header="true"]');
      const nav = document.querySelector('nav[aria-label="主要導覽"]');
      const brand = document.querySelector('[data-site-brand="header"]');
      const whatsapp = document.querySelector('[data-header-whatsapp="true"]');

      const links = nav
        ? [...nav.querySelectorAll("a")].filter(element => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();

            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              rect.width > 0 &&
              rect.height > 0
            );
          })
        : [];

      const headerRect = header?.getBoundingClientRect();
      const brandRect = brand?.getBoundingClientRect();
      const navRect = nav?.getBoundingClientRect();
      const whatsappRect = whatsapp?.getBoundingClientRect();

      return {
        documentScrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        headerLeft: headerRect?.left ?? -1,
        headerRight: headerRect?.right ?? -1,
        visibleNavLinks: links.length,
        brandNavGap: brandRect && navRect ? navRect.left - brandRect.right : -1,
        navWhatsappGap:
          navRect && whatsappRect ? whatsappRect.left - navRect.right : -1,
      };
    });

    assert(
      tabletResult.visibleNavLinks === 7,
      `${width}px：預期 7 個 desktop navigation links，實際 ${tabletResult.visibleNavLinks}`
    );

    assert(
      tabletResult.documentScrollWidth <= tabletResult.viewportWidth + 1,
      `${width}px：出現水平 overflow ${JSON.stringify(tabletResult)}`
    );

    assert(
      tabletResult.headerLeft >= -1 &&
        tabletResult.headerRight <= tabletResult.viewportWidth + 1,
      `${width}px：Header 超出 viewport ${JSON.stringify(tabletResult)}`
    );

    assert(
      await isVisible(page.locator('[data-header-whatsapp="true"]')),
      `${width}px：Header WhatsApp CTA 應該可見`
    );

    assert(
      tabletResult.brandNavGap >= 0 && tabletResult.navWhatsappGap >= 0,
      `${width}px：品牌、導覽或 WhatsApp CTA 互相重疊 ${JSON.stringify(tabletResult)}`
    );

    console.log(
      `PASS：${width}px header 七個 links、WhatsApp CTA、無重疊或水平 overflow`
    );

    await context.close();
  }

  /*
   * Desktop:
   * skip link and desktop-only widget
   */
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });

    const page = await context.newPage();

    await page.goto(`${BASE_URL}/`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    await page.locator('[data-site-header="true"]').waitFor({
      state: "visible",
      timeout: 15_000,
    });

    assert(
      await isVisible(page.locator('[data-whatsapp-widget="true"]')),
      "1440px：Desktop WhatsApp widget 應該可見"
    );

    assert(
      !(await isVisible(page.locator('[data-mobile-cta="true"]'))),
      "1440px：Mobile CTA 不應可見"
    );

    await page.keyboard.press("Tab");

    const skipFocused = await page.evaluate(() => {
      return document.activeElement?.getAttribute("href") === "#main-content";
    });

    assert(skipFocused, "1440px：第一個 Tab 未聚焦 Skip Link");

    await page.keyboard.press("Enter");

    const skipTargetedMain = await page.evaluate(() => {
      return window.location.hash === "#main-content";
    });

    assert(skipTargetedMain, "1440px：Skip Link 未跳到主要內容");

    const desktopOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));

    assert(
      desktopOverflow.scrollWidth <= desktopOverflow.innerWidth + 1,
      `1440px：頁面水平溢出 ${JSON.stringify(desktopOverflow)}`
    );

    console.log(
      "PASS：1440px Skip Link、desktop widget、Mobile CTA 分流及無 overflow"
    );

    await context.close();
  }

  console.log("\n✅ Stage 5 site chrome browser verification 全部通過");
} finally {
  if (browser) {
    await browser.close();
  }

  server.kill("SIGTERM");

  await Promise.race([
    new Promise(resolve => server.once("exit", resolve)),
    sleep(3_000),
  ]);

  if (server.exitCode === null) {
    server.kill("SIGKILL");
  }
}
