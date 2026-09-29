#!/usr/bin/env node
/**
 * 階段 0 審計用：改動前截圖基準。
 *
 * 用途：為每個路由在 375px（手機）與 1440px（桌面）各截一張全頁圖，
 * 另加一輪 prefers-reduced-motion: reduce，存到 audits/before/。
 * 之後每個階段完成後可重跑，與基準對比。
 *
 * 用法：
 *   node scripts/audit-screenshots.mjs                    # 預設 http://localhost:3002
 *   BASE_URL=http://localhost:3000 node scripts/audit-screenshots.mjs
 *   OUT_DIR=audits/after node scripts/audit-screenshots.mjs
 *
 * 前置：需要 dev server 已啟動（pnpm dev）。
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3002";
const OUT_DIR = process.env.OUT_DIR || "audits/before";

// 靜態路由取自 client/src/App.tsx。動態路由各取一個代表 slug。
const ROUTES = [
  { path: "/", name: "home" },
  { path: "/services", name: "services" },
  { path: "/services/toilet-unblocking", name: "service-detail" },
  { path: "/drain-diagnosis", name: "drain-diagnosis" },
  { path: "/service-process", name: "service-process" },
  { path: "/guide", name: "guide" },
  { path: "/areas", name: "areas" },
  { path: "/areas/kwun-tong", name: "district" },
  { path: "/blog", name: "blog" },
  { path: "/blog/whatsapp-drain-quote-checklist", name: "blog-post" },
  { path: "/cases", name: "cases" },
  { path: "/faq", name: "faq" },
  { path: "/thanks", name: "thanks" },
  { path: "/404", name: "not-found" },
];

const VIEWPORTS = [
  { width: 375, height: 812, label: "375" },
  { width: 1440, height: 900, label: "1440" },
];

const MOTION_MODES = [
  { reduce: false, suffix: "" },
  { reduce: true, suffix: "-reduced-motion" },
];

async function main() {
  const browser = await chromium.launch();
  const results = [];

  for (const vp of VIEWPORTS) {
    for (const motion of MOTION_MODES) {
      const dir = path.join(OUT_DIR, `${vp.label}px${motion.suffix}`);
      await mkdir(dir, { recursive: true });

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        reducedMotion: motion.reduce ? "reduce" : "no-preference",
        locale: "zh-HK",
      });
      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}`;
        const file = path.join(dir, `${route.name}.png`);
        try {
          const response = await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 30000,
          });
          // 等入場動畫與 lazy 內容穩定。
          await page.waitForTimeout(1200);
          await page.screenshot({ path: file, fullPage: true });
          results.push({
            route: route.path,
            viewport: `${vp.label}px${motion.suffix}`,
            status: response?.status() ?? "no-response",
            ok: true,
          });
          console.log(`  ok  ${vp.label}px${motion.suffix}  ${route.path}`);
        } catch (error) {
          results.push({
            route: route.path,
            viewport: `${vp.label}px${motion.suffix}`,
            status: "error",
            ok: false,
            error: error.message.split("\n")[0],
          });
          console.log(
            `  FAIL ${vp.label}px${motion.suffix}  ${route.path} — ${error.message.split("\n")[0]}`
          );
        }
      }

      await context.close();
    }
  }

  await browser.close();

  const failed = results.filter(r => !r.ok);
  console.log(
    `\n完成：${results.length - failed.length}/${results.length} 張 → ${OUT_DIR}/`
  );
  if (failed.length) {
    console.log("失敗清單：");
    for (const f of failed) console.log(`  ${f.viewport} ${f.route} — ${f.error}`);
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
