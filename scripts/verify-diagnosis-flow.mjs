import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.DIAGNOSIS_TEST_PORT || 4210);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitForServer() {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/drain-diagnosis`);
      if (response.ok) return;
    } catch {
      // Wait for the production server.
    }

    await sleep(250);
  }

  throw new Error(`Server did not start at ${BASE_URL}`);
}

async function hasHorizontalOverflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
}

async function completeBackflowFlow(page) {
  await page.getByRole("button", { name: "企缸／浴室去水" }).click();
  await page.getByRole("button", { name: "污水或積水倒灌" }).click();
  await page.getByRole("button", { name: "同一單位多個位置" }).click();
  await page.getByRole("button", { name: "有污水外溢或倒灌" }).click();

  await page
    .getByRole("heading", {
      name: "先控制外溢風險，再確認堵塞範圍",
    })
    .waitFor({ state: "visible" });
}

const server = spawn(process.execPath, ["dist/index.js"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(PORT),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", data => process.stdout.write(`[server] ${data}`));
server.stderr.on("data", data => process.stderr.write(`[server] ${data}`));

let browser;

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });

  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const pageErrors = [];

    page.on("pageerror", error => pageErrors.push(error));

    const response = await page.goto(`${BASE_URL}/drain-diagnosis`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    if (!response?.ok()) {
      throw new Error(`Diagnosis route returned ${response?.status()}`);
    }

    await page
      .getByRole("heading", { name: "先看症狀，再決定下一步" })
      .waitFor({ state: "visible" });

    if (await hasHorizontalOverflow(page)) {
      throw new Error(
        `${viewport.name} diagnosis page has horizontal overflow`
      );
    }

    await completeBackflowFlow(page);

    await page
      .getByLabel("大概服務地區（可稍後補充）")
      .selectOption({ label: "九龍" });

    const whatsappHref = await page
      .getByRole("link", { name: "將判斷結果傳給師傅" })
      .getAttribute("href");

    if (
      !whatsappHref?.startsWith("https://wa.me/") ||
      !decodeURIComponent(whatsappHref).includes("污水或積水倒灌") ||
      !decodeURIComponent(whatsappHref).includes("大概服務地區：九龍")
    ) {
      throw new Error(
        "Diagnosis result did not produce the expected WhatsApp handoff"
      );
    }

    if (viewport.name === "mobile") {
      const mobileCta = page.locator('[data-mobile-cta="true"]');
      await mobileCta.getByText("發送判斷結果", { exact: true }).waitFor();

      const mobileHref = await mobileCta
        .locator('a[href^="https://wa.me/"]')
        .getAttribute("href");

      if (
        !mobileHref ||
        !decodeURIComponent(mobileHref).includes("大概服務地區：九龍")
      ) {
        throw new Error("Mobile CTA did not retain the diagnosis handoff");
      }
    }

    const diagnosisEvents = await page.evaluate(() =>
      (window.dataLayer ?? [])
        .filter(item =>
          ["drain_diagnosis_start", "drain_diagnosis_complete"].includes(
            item?.event
          )
        )
        .map(item => item.event)
    );

    if (
      diagnosisEvents.filter(event => event === "drain_diagnosis_start")
        .length !== 1 ||
      diagnosisEvents.filter(event => event === "drain_diagnosis_complete")
        .length !== 1
    ) {
      throw new Error(
        `${viewport.name} diagnosis analytics events were missing or duplicated: ${diagnosisEvents.join(", ")}`
      );
    }

    await page.screenshot({
      path: `/tmp/drainbear-diagnosis-${viewport.name}.png`,
      fullPage: true,
    });

    await page.goto(`${BASE_URL}/service-process`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    await page
      .getByRole("heading", {
        name: "上門服務如何安排，報價如何確認",
      })
      .waitFor({ state: "visible" });

    await page.getByText("上門服務，不設門市", { exact: true }).waitFor();

    if (await hasHorizontalOverflow(page)) {
      throw new Error(
        `${viewport.name} service process page has horizontal overflow`
      );
    }

    if (pageErrors.length > 0) {
      throw new Error(
        `${viewport.name} page errors: ${pageErrors.map(error => error.message).join(" | ")}`
      );
    }

    await page.screenshot({
      path: `/tmp/drainbear-service-process-${viewport.name}.png`,
      fullPage: true,
    });

    await context.close();
    console.log(`PASS: ${viewport.name} diagnosis and service-process flows`);
  }
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
