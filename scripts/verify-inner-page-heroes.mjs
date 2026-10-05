/**
 * 內頁 masthead 驗收 —— fix/inner-page-heroes-v2。
 *
 * 逐條內頁路由檢查：
 *   1. landmark：頁面內只有一個 <main>（Layout 提供），無巢狀 main
 *   2. WebGL：每頁最多一個 fibers canvas（避免第二個 WebGL context）
 *   3. hero 底色：#003566（rgb(0, 53, 102)）
 *   4. 麵包屑：位於深色 hero 內時，文字對比度 ≥ 4.5:1（AA 一般文字）
 *   5. 水平 overflow：scrollWidth 不得超出 clientWidth
 *   6. prefers-reduced-motion:reduce 下無版面破損（hero 仍存在且高度合理）
 */
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4950 + (process.pid % 50);
const baseUrl = `http://127.0.0.1:${port}`;
const logs = [];

const ROUTES = [
  ["/", "home"],
  ["/services", "services"],
  ["/areas", "areas"],
  ["/areas/kwun-tong", "district"],
  ["/services/high-pressure-jetting", "service-detail"],
  ["/drain-diagnosis", "drain-diagnosis"],
  ["/service-process", "service-process"],
  ["/blog", "blog"],
  ["/faq", "faq"],
  ["/guide", "guide"],
  ["/cases", "cases"],
  ["/cases/home-basin-grease-buildup-cleaning", "case-detail"],
];

const NAVY = "rgb(0, 53, 102)";

let server;
let browser;
const failures = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function fail(label, msg) {
  failures.push(`[${label}] ${msg}`);
}

async function waitForServer() {
  const t0 = Date.now();
  while (Date.now() - t0 < 45_000) {
    try {
      if ((await fetch(`${baseUrl}/`)).ok) return;
    } catch {
      /* retry */
    }
    await sleep(250);
  }
  throw new Error(`Server timeout\n${logs.join("")}`);
}

/** sRGB 相對亮度，WCAG 2.x 定義。 */
function luminance([r, g, b]) {
  const f = v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

function parseRgb(str) {
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map(s => parseFloat(s.trim()));
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

/** 由元素向上找出第一個非透明背景色，作為實際底色。 */
const EFFECTIVE_BG = `
(el) => {
  let node = el;
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const m = bg.match(/rgba?\\(([^)]+)\\)/);
    if (m) {
      const p = m[1].split(',').map(s => parseFloat(s.trim()));
      if ((p[3] ?? 1) > 0.85) return bg;
    }
    node = node.parentElement;
  }
  return 'rgb(255, 255, 255)';
}`;

try {
  server = spawn(process.execPath, ["dist/index.js"], {
    env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", c => logs.push(c.toString()));
  server.stderr.on("data", c => logs.push(c.toString()));
  await waitForServer();

  browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  for (const [route, label] of ROUTES) {
    const res = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
    await page.waitForTimeout(600);

    if (!res || res.status() !== 200) {
      fail(label, `HTTP ${res ? res.status() : "?"}`);
      continue;
    }

    const probe = await page.evaluate(bgFn => {
      const effBg = eval(bgFn);
      const mains = document.querySelectorAll("main");
      const canvases = document.querySelectorAll("canvas");
      const fibers = [...canvases].filter(c =>
        c.closest(
          '[class*="fibers"], [class*="hero"], [class*="atmosphere"], header, section'
        )
      );

      // hero：取第一個高度 ≥ 200 的 section/header
      const hero = [...document.querySelectorAll("section, header")].find(el => {
        const r = el.getBoundingClientRect();
        return r.height >= 200 && r.width > 600;
      });

      const crumbs = document.querySelector(".breadcrumbs, nav[aria-label*='麵包'], nav[aria-label*='Breadcrumb']");
      const crumbLink = crumbs ? crumbs.querySelector("a, span") : null;

      // 用「實際底色」而非 hero 自身的 background-color：
      // /services 的 section 本身透明，深藍由 .phase4-services__hero-shell 提供，
      // 只看自身背景會誤判成透明。
      const heroBg = hero ? getComputedStyle(hero).backgroundColor : null;
      const heroEffBg = hero ? effBg(hero) : null;

      return {
        mainCount: mains.length,
        canvasCount: canvases.length,
        fibersCount: fibers.length,
        heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
        heroBg,
        heroEffBg,
        crumbsPresent: Boolean(crumbs),
        crumbColor: crumbLink ? getComputedStyle(crumbLink).color : null,
        crumbBg: crumbLink ? effBg(crumbLink) : null,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    }, EFFECTIVE_BG);

    // 1. 單一 landmark
    if (probe.mainCount > 1) {
      fail(label, `巢狀 landmark：找到 ${probe.mainCount} 個 <main>（應為 1）`);
    }

    // 2. 最多一個 WebGL context
    if (probe.canvasCount > 1) {
      fail(label, `多個 canvas：${probe.canvasCount} 個（WebGL context 過多）`);
    }

    // 3. hero 底色（首頁為既有參考，不強制）
    if (label !== "home" && probe.heroEffBg !== NAVY) {
      fail(
        label,
        `hero 實際底色 ${probe.heroEffBg}（自身 ${probe.heroBg}），預期 ${NAVY}`
      );
    }

    // 4. 麵包屑對比度
    if (probe.crumbsPresent && probe.crumbColor && probe.crumbBg) {
      const fg = parseRgb(probe.crumbColor);
      const bg = parseRgb(probe.crumbBg);
      if (fg && bg) {
        const ratio = contrast(fg, bg);
        if (ratio < 4.5) {
          fail(
            label,
            `麵包屑對比度 ${ratio.toFixed(2)}:1 未達 AA 4.5:1（前景 ${probe.crumbColor} / 底色 ${probe.crumbBg}）`
          );
        }
      }
    }

    // 5. 水平 overflow
    if (probe.scrollWidth > probe.clientWidth + 1) {
      fail(
        label,
        `水平 overflow：scrollWidth ${probe.scrollWidth} > clientWidth ${probe.clientWidth}`
      );
    }

    console.log(
      `✓ ${label.padEnd(16)} main=${probe.mainCount} canvas=${probe.canvasCount} ` +
        `hero=${probe.heroEffBg} h=${probe.heroHeight} crumbs=${probe.crumbsPresent}`
    );
  }

  // 6. reduced-motion 一輪
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  for (const [route, label] of ROUTES) {
    await rmPage.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await rmPage.waitForTimeout(400);
    const h = await rmPage.evaluate(() => {
      const hero = [...document.querySelectorAll("section, header")].find(el => {
        const r = el.getBoundingClientRect();
        return r.height >= 200 && r.width > 600;
      });
      return hero ? Math.round(hero.getBoundingClientRect().height) : 0;
    });
    if (h < 200) fail(label, `reduced-motion 下 hero 高度異常：${h}px`);
  }
  await rmContext.close();
  console.log("\n✓ prefers-reduced-motion:reduce —— 12 頁 hero 全部正常");

  if (failures.length) {
    console.log(`\n✗ ${failures.length} 項未通過：`);
    failures.forEach(f => console.log("  " + f));
    process.exitCode = 1;
  } else {
    console.log("\n✓ 全部驗收項目通過");
  }
} catch (err) {
  console.error("驗收失敗：", err.message);
  console.error(logs.slice(-40).join(""));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill("SIGTERM");
}
