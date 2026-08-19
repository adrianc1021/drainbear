import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.SERVICE_SEO_TEST_PORT || 4202);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const services = [
  {
    slug: "toilet-unblocking",
    h1: "坐廁淤塞、去水慢或倒灌，先判斷堵塞位置",
  },
  {
    slug: "kitchen-sink-unblocking",
    h1: "鋅盤去水慢，通常不只是一小撮食物殘渣",
  },
  {
    slug: "bathroom-drain-unblocking",
    h1: "企缸塞、浴缸去水慢，先分辨隔渣位還是喉管堵塞",
  },
  {
    slug: "sewage-backflow",
    h1: "污水渠倒灌要先停止用水，再判斷受影響範圍",
  },
  {
    slug: "high-pressure-jetting",
    h1: "反覆淤塞，不一定適合只做局部打通",
  },
  {
    slug: "cctv-drain-inspection",
    h1: "反覆淤塞或問題位置不明，先用影像了解管內情況",
  },
  {
    slug: "main-drain-manhole",
    h1: "多個單位或去水位同時受影響，問題可能在主渠",
  },
];

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 30_000) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) return;
    } catch {
      // 等待 production server。
    }

    await sleep(250);
  }

  throw new Error(`Server 未能啟動：${BASE_URL}`);
}

const sitemap = await fs.readFile(
  path.resolve("dist/public/sitemap.xml"),
  "utf8"
);
const manifest = JSON.parse(
  await fs.readFile(path.resolve("dist/prerender/routes.json"), "utf8")
);

for (const service of services) {
  const route = `/services/${service.slug}`;
  const outputPath = path.resolve(
    "dist/public",
    `services/${service.slug}/index.html`
  );

  await fs.access(outputPath);

  if (!manifest.routes.includes(route)) {
    throw new Error(`${route} 未加入 prerender routes manifest`);
  }

  if (!sitemap.includes(`https://drainbearhk.com${route}`)) {
    throw new Error(`${route} 未加入 sitemap`);
  }
}

console.log("PASS：7 個服務頁已加入 prerender manifest 及 sitemap");

const server = spawn("node", ["dist/index.js"], {
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
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];

  page.on("pageerror", error => {
    pageErrors.push(error);
    console.error("Browser page error:", error);
  });

  for (const service of services) {
    const route = `/services/${service.slug}`;

    const response = await page.goto(`${BASE_URL}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    if (!response?.ok()) {
      throw new Error(`${route} HTTP 狀態錯誤：${response?.status()}`);
    }

    await page.getByRole("heading", { level: 1, name: service.h1 }).waitFor({
      state: "visible",
      timeout: 15_000,
    });

    const title = await page.title();

    if (!title.includes("通渠熊")) {
      throw new Error(`${route} title 缺少品牌名稱：${title}`);
    }

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");

    if (!description || description.length < 50) {
      throw new Error(`${route} meta description 過短或不存在`);
    }

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");

    const expectedCanonical = `https://drainbearhk.com${route}`;

    if (canonical !== expectedCanonical) {
      throw new Error(
        `${route} canonical 錯誤：預期 ${expectedCanonical}，實際 ${canonical}`
      );
    }

    const serviceSchema = await page.locator("#jsonld-page").textContent();

    if (!serviceSchema?.includes('"@type":"Service"')) {
      throw new Error(`${route} 缺少 Service JSON-LD`);
    }

    const whatsappHref = await page
      .getByRole("link", { name: /WhatsApp 索取初步估價/ })
      .getAttribute("href");

    if (!whatsappHref?.startsWith("https://wa.me/")) {
      throw new Error(`${route} WhatsApp CTA 不正確`);
    }

    console.log(`PASS：${route}`);
  }

  const servicesPrerenderedHtml = await fs.readFile(
    path.resolve("dist/public/services/index.html"),
    "utf8"
  );

  for (const service of services) {
    const expectedHref = `href="/services/${service.slug}"`;

    if (!servicesPrerenderedHtml.includes(expectedHref)) {
      throw new Error(`/services prerender HTML 缺少 ${service.slug} 內部連結`);
    }
  }

  console.log("PASS：/services prerender HTML 包含 7 個服務頁內部連結");

  await page.goto(`${BASE_URL}/services`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page
    .getByRole("heading", {
      name: "按問題查看處理方法",
    })
    .waitFor({
      state: "visible",
      timeout: 15_000,
    });

  for (const service of services) {
    const link = page.locator(`a[href="/services/${service.slug}"]`).first();

    await link.waitFor({
      state: "attached",
      timeout: 10_000,
    });
  }

  console.log("PASS：服務總覽包含 7 個可導航的服務頁內部連結");

  if (pageErrors.length > 0) {
    throw new Error(`測試期間出現 ${pageErrors.length} 個 page error`);
  }

  await context.close();
  console.log("\n所有服務頁 SEO 回歸測試通過。");
} finally {
  await browser?.close();
  server.kill("SIGTERM");

  await Promise.race([
    new Promise(resolve => server.once("exit", resolve)),
    sleep(3_000),
  ]);

  if (server.exitCode === null) {
    server.kill("SIGKILL");
  }
}
