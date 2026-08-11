import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.REVEAL_TEST_PORT || 4199);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_TIMEOUT = 30_000;

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitForServer() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < SERVER_TIMEOUT) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) return;
    } catch {
      // Server 仲未 ready。
    }

    await sleep(250);
  }

  throw new Error(`Server 未能在 ${SERVER_TIMEOUT}ms 內啟動：${BASE_URL}`);
}

async function assertRevealVisible(page, locator, label) {
  await locator.waitFor({
    state: "attached",
    timeout: 15_000,
  });

  await locator.scrollIntoViewIfNeeded();

  const element = await locator.elementHandle();

  if (!element) {
    throw new Error(`${label}：找不到 element handle`);
  }

  await page.waitForFunction(
    target => {
      const reveal = target.closest(".reveal");

      // 元件沒有 reveal 外層時，本身可見即可。
      if (!reveal) {
        const style = window.getComputedStyle(target);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number.parseFloat(style.opacity || "1") >= 0.95
        );
      }

      const style = window.getComputedStyle(reveal);

      return (
        reveal.classList.contains("reveal-in") &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number.parseFloat(style.opacity || "1") >= 0.95
      );
    },
    element,
    {
      timeout: 10_000,
    }
  );

  console.log(`PASS：${label} 可見`);
}

async function createColdPage(browser) {
  const context = await browser.newContext();

  // 故意延遲 lazy route chunks，穩定重現原本的 race condition。
  await context.route(
    /\/assets\/(GuideRoute|Guide|Areas)-[^/]+\.js(?:\?.*)?$/,
    async route => {
      await sleep(900);
      await route.continue();
    }
  );

  const page = await context.newPage();
  const pageErrors = [];

  page.on("pageerror", error => {
    pageErrors.push(error);
    console.error("Browser page error:", error);
  });

  return {
    context,
    page,
    pageErrors,
  };
}

const server = spawn("node", ["dist/index.js"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(PORT),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", chunk => {
  process.stdout.write(`[server] ${chunk}`);
});

server.stderr.on("data", chunk => {
  process.stderr.write(`[server] ${chunk}`);
});

let browser;

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });

  // ───────────────────────────────────────────
  // /guide：確認計算機 cold-load 後可見及可操作
  // ───────────────────────────────────────────
  {
    const { context, page, pageErrors } = await createColdPage(browser);

    await page.goto(`${BASE_URL}/guide`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    const toiletOption = page
      .getByText("坐廁 / 馬桶", {
        exact: true,
      })
      .first();

    await assertRevealVisible(page, toiletOption, "/guide 報價計算機");

    await toiletOption.click();

    const apartmentOption = page
      .getByText("私樓 / 屋苑", {
        exact: true,
      })
      .first();

    await apartmentOption.click();

    const estimateCard = page
      .getByText("ESTIMATED PRICE", {
        exact: true,
      })
      .locator("..");

    const estimateHandle = await estimateCard.elementHandle();

    if (!estimateHandle) {
      throw new Error("/guide：找不到估價結果卡片");
    }

    await page.waitForFunction(
      element => {
        const text = element.textContent || "";

        return text.includes("HK$600") && text.includes("1,200");
      },
      estimateHandle,
      {
        timeout: 10_000,
      }
    );

    if (pageErrors.length > 0) {
      throw new Error(`/guide 發生 ${pageErrors.length} 個 browser page error`);
    }

    console.log("PASS：/guide 計算機可操作並顯示 HK$600–1,200");

    await context.close();
  }

  // ───────────────────────────────────────────
  // /areas：確認互動香港地圖 cold-load 後可見
  // ───────────────────────────────────────────
  {
    const { context, page, pageErrors } = await createColdPage(browser);

    await page.goto(`${BASE_URL}/areas`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    const map = page.locator(
      'svg[aria-label="香港十八區服務地圖，點擊分區查看當區通渠服務"]'
    );

    await assertRevealVisible(page, map, "/areas 香港十八區地圖");

    const districtPaths = map.locator("path");
    const districtCount = await districtPaths.count();

    if (districtCount < 18) {
      throw new Error(
        `/areas 地圖分區數量不足：預期至少 18，實際 ${districtCount}`
      );
    }

    if (pageErrors.length > 0) {
      throw new Error(`/areas 發生 ${pageErrors.length} 個 browser page error`);
    }

    console.log(`PASS：/areas 已載入 ${districtCount} 個可互動地圖分區`);

    await context.close();
  }

  console.log("\n所有 reveal lazy-route 回歸測試通過。");
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
