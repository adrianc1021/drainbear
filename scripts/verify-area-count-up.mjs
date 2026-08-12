import { spawn } from "node:child_process";
import fs from "node:fs";
import process from "node:process";
import { chromium } from "playwright";

const port = 4300 + (process.pid % 400);
const baseUrl = `http://127.0.0.1:${port}`;
const serverLogs = [];

let server;
let browser;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(timeoutMs = 30_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (server?.exitCode !== null) {
      throw new Error(
        `Production server 提早終止：${server?.exitCode}\n${serverLogs.join("")}`
      );
    }

    try {
      const response = await fetch(`${baseUrl}/areas`);

      if (response.ok) return;
    } catch {
      // Server 尚未 ready，稍後再試。
    }

    await sleep(250);
  }

  throw new Error(
    `Production server 在 ${timeoutMs}ms 內未能啟動\n${serverLogs.join("")}`
  );
}

function collectJsonLdObjects(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectJsonLdObjects(item, output);
    }
    return output;
  }

  if (!value || typeof value !== "object") return output;

  output.push(value);

  if (Array.isArray(value["@graph"])) {
    collectJsonLdObjects(value["@graph"], output);
  }

  return output;
}

async function readCountValues(page) {
  return page.locator("[data-count-up-value]").evaluateAll(elements =>
    elements.map(element => ({
      finalValue: Number(element.getAttribute("data-count-up-value")),
      currentValue: Number(element.getAttribute("data-count-up-current")),
      textValue: Number((element.textContent ?? "").replace(/[^\d]/g, "")),
    }))
  );
}

try {
  if (!fs.existsSync("dist/index.js")) {
    throw new Error("找不到 dist/index.js，請先執行 pnpm build");
  }

  server = spawn(process.execPath, ["dist/index.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.stdout.on("data", chunk => {
    const text = chunk.toString();
    serverLogs.push(text);
    process.stdout.write(`[server] ${text}`);
  });

  server.stderr.on("data", chunk => {
    const text = chunk.toString();
    serverLogs.push(text);
    process.stderr.write(`[server] ${text}`);
  });

  await waitForServer();

  browser = await chromium.launch({ headless: true });

  /*
   * 正常動畫模式：
   * 使用較矮 viewport，確保統計區最初不在畫面內。
   */
  const animatedContext = await browser.newContext({
    viewport: { width: 1280, height: 360 },
    reducedMotion: "no-preference",
  });

  const animatedPage = await animatedContext.newPage();
  const pageErrors = [];

  animatedPage.on("pageerror", error => {
    pageErrors.push(error.message);
  });

  await animatedPage.goto(`${baseUrl}/areas`, {
    waitUntil: "domcontentloaded",
  });

  await animatedPage
    .getByRole("heading", {
      name: "港九新界及離島通渠服務",
      exact: true,
    })
    .waitFor({ state: "visible" });

  const countElements = animatedPage.locator("[data-count-up-value]");

  const countElementTotal = await countElements.count();

  if (countElementTotal !== 2) {
    throw new Error(`預期 2 個動態統計數字，實際 ${countElementTotal} 個`);
  }

  /*
   * 從 JSON-LD 取得 areaServed，確認畫面數字並非手動寫死。
   */
  const jsonLdValues = await animatedPage
    .locator('script[type="application/ld+json"]')
    .evaluateAll(elements =>
      elements.map(element => element.textContent ?? "")
    );

  const jsonLdObjects = [];

  for (const value of jsonLdValues) {
    if (!value.trim()) continue;

    try {
      collectJsonLdObjects(JSON.parse(value), jsonLdObjects);
    } catch {
      // 其他非相關 JSON-LD 不影響本項測試。
    }
  }

  const areaService = jsonLdObjects.find(
    item =>
      item["@type"] === "Service" &&
      Array.isArray(item.areaServed) &&
      item.areaServed.length > 20
  );

  if (!areaService) {
    throw new Error("找不到包含完整 areaServed 的 Service JSON-LD");
  }

  const uniqueAreaNames = new Set(
    areaService.areaServed
      .map(item => item?.name)
      .filter(name => typeof name === "string" && name.trim().length > 0)
  );

  const expectedCoverageCount = uniqueAreaNames.size;

  /*
   * 專屬地區頁數：由頁面實際 /areas/:slug 連結去重。
   */
  const dedicatedAreaPaths = await animatedPage
    .locator('a[href^="/areas/"]')
    .evaluateAll(elements =>
      [
        ...new Set(
          elements
            .map(element => element.getAttribute("href"))
            .filter(
              href =>
                typeof href === "string" && /^\/areas\/[^/?#]+$/.test(href)
            )
        ),
      ].sort()
    );

  const expectedLandingPageCount = dedicatedAreaPaths.length;

  if (expectedLandingPageCount !== 10) {
    throw new Error(
      `預期 10 個專屬地區 route，實際 ${expectedLandingPageCount} 個：${dedicatedAreaPaths.join(", ")}`
    );
  }

  const initialValues = await readCountValues(animatedPage);

  const finalValues = initialValues.map(item => item.finalValue);

  if (
    finalValues[0] !== expectedCoverageCount ||
    finalValues[1] !== expectedLandingPageCount
  ) {
    throw new Error(
      `動態統計不一致：畫面=${finalValues.join(", ")}；JSON-LD 地點=${expectedCoverageCount}；專屬頁=${expectedLandingPageCount}`
    );
  }

  const firstCounter = countElements.first();
  await firstCounter.scrollIntoViewIfNeeded();

  const firstCounterHandle = await firstCounter.elementHandle();

  if (!firstCounterHandle) {
    throw new Error("無法取得第一個 Count-up element");
  }

  /*
   * 確認動畫曾出現低於最終值的中間狀態。
   */
  await animatedPage.waitForFunction(
    element => {
      const finalValue = Number(element.getAttribute("data-count-up-value"));
      const currentValue = Number(
        element.getAttribute("data-count-up-current")
      );

      return (
        Number.isFinite(finalValue) &&
        Number.isFinite(currentValue) &&
        currentValue >= 0 &&
        currentValue < finalValue
      );
    },
    firstCounterHandle,
    { timeout: 3_000 }
  );

  /*
   * 確認動畫最後準確定格。
   */
  await animatedPage.waitForFunction(
    element => {
      const finalValue = Number(element.getAttribute("data-count-up-value"));
      const currentValue = Number(
        element.getAttribute("data-count-up-current")
      );
      const textValue = Number(
        (element.textContent ?? "").replace(/[^\d]/g, "")
      );

      return currentValue === finalValue && textValue === finalValue;
    },
    firstCounterHandle,
    { timeout: 4_000 }
  );

  const settledValues = await readCountValues(animatedPage);

  for (const item of settledValues) {
    if (
      item.currentValue !== item.finalValue ||
      item.textValue !== item.finalValue
    ) {
      throw new Error(`Count-up 未正確定格：${JSON.stringify(item)}`);
    }
  }

  if (pageErrors.length > 0) {
    throw new Error(`動畫頁面出現錯誤：${pageErrors.join(" | ")}`);
  }

  console.log(
    `PASS：Count-up 由中間值動畫至 ${settledValues
      .map(item => item.finalValue)
      .join("／")}`
  );
  console.log(
    `PASS：主要服務地點與 ${expectedCoverageCount} 個 JSON-LD areaServed 一致`
  );
  console.log(`PASS：專屬地區頁與 ${expectedLandingPageCount} 個 route 一致`);

  await animatedContext.close();

  /*
   * Reduced motion：
   * 進入統計區後仍應直接顯示最終值。
   */
  const reducedContext = await browser.newContext({
    viewport: { width: 1280, height: 360 },
    reducedMotion: "reduce",
  });

  const reducedPage = await reducedContext.newPage();

  await reducedPage.goto(`${baseUrl}/areas`, {
    waitUntil: "domcontentloaded",
  });

  const reducedCounters = reducedPage.locator("[data-count-up-value]");

  await reducedCounters.first().scrollIntoViewIfNeeded();
  await reducedPage.waitForTimeout(150);

  const reducedValues = await readCountValues(reducedPage);

  for (const item of reducedValues) {
    if (
      item.currentValue !== item.finalValue ||
      item.textValue !== item.finalValue
    ) {
      throw new Error(`Reduced motion 不應播放中間值：${JSON.stringify(item)}`);
    }
  }

  console.log("PASS：prefers-reduced-motion 直接顯示最終值");

  await reducedContext.close();

  /*
   * Prerender HTML 必須包含最終統計，而非 0。
   */
  const prerenderFile = "dist/prerender/areas.html";

  if (!fs.existsSync(prerenderFile)) {
    throw new Error(`找不到 ${prerenderFile}`);
  }

  const prerenderHtml = fs.readFileSync(prerenderFile, "utf8");

  for (const expectedValue of [
    expectedCoverageCount,
    expectedLandingPageCount,
  ]) {
    if (!prerenderHtml.includes(`data-count-up-value="${expectedValue}"`)) {
      throw new Error(`Prerender HTML 缺少最終統計值：${expectedValue}`);
    }
  }

  console.log("PASS：Prerender HTML 保留最終統計值");
  console.log("PASS：所有地區 Count-up 回歸測試通過");
} finally {
  if (browser) {
    await browser.close().catch(() => {});
  }

  if (server && server.exitCode === null) {
    server.kill("SIGTERM");

    await Promise.race([
      new Promise(resolve => server.once("exit", resolve)),
      sleep(3_000),
    ]);

    if (server.exitCode === null) {
      server.kill("SIGKILL");
    }
  }
}
