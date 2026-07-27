/**
 * 手機視窗（375x812）按鈕可點性稽核腳本
 * 逐頁掃描所有可見可點元素，將其捲至視口中央後以 elementFromPoint 檢測是否被遮擋。
 * 另實測 WhatsAppWidget 開合與 MobileCTABar 行為。
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PAGES = ["/", "/guide", "/services", "/faq", "/areas", "/blog", "/thanks"];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await ctx.newPage();

let totalFails = 0;

for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const result = await page.evaluate(async () => {
    const els = [...document.querySelectorAll("a[href], button")].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      if (el.closest('[role="dialog"]')) return false; // 關閉狀態的 WhatsApp 對話卡
      const cs = getComputedStyle(el);
      if (cs.pointerEvents === "none" || parseFloat(cs.opacity) === 0) return false;
      if (cs.visibility === "hidden" || cs.display === "none") return false;
      return true;
    });
    const fails = [];
    let tested = 0;
    for (const el of els) {
      el.scrollIntoView({ block: "center", behavior: "instant" });
      await new Promise((r) => setTimeout(r, 40));
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
      tested++;
      const top = document.elementFromPoint(cx, cy);
      const ok = top && (el === top || el.contains(top));
      if (!ok)
        fails.push({
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20),
          blocker: top ? top.tagName + "." + String(top.className).slice(0, 50) + (top.id ? "#" + top.id : "") : "none",
        });
    }
    window.scrollTo(0, 0);
    return { total: els.length, tested, fails };
  });

  // 排除 dev 預覽工具注入的 manus-previewer-root（正式站不存在）
  const realFails = result.fails.filter((f) => !f.blocker.includes("manus-previewer-root"));
  totalFails += realFails.length;
  console.log(
    `${path}  可點元素:${result.total} 已測:${result.tested} 失敗:${realFails.length}` +
      (realFails.length ? "\n  " + realFails.map((f) => `[${f.text}] 被 ${f.blocker} 遮擋`).join("\n  ") : "")
  );
}

// 實測 WhatsAppWidget：開啟 → 面板按鈕可點 → 關閉 → 面板區域不攔截
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const widgetTest = await page.evaluate(async () => {
  const openBtn = document.querySelector('button[aria-label="開啟 WhatsApp 對話框"]');
  if (!openBtn) return { error: "找不到開啟按鈕" };
  openBtn.click();
  await new Promise((r) => setTimeout(r, 400));
  const dialog = document.querySelector('[role="dialog"]');
  const openOk = dialog && getComputedStyle(dialog).opacity === "1" && getComputedStyle(dialog).pointerEvents !== "none";
  // 面板內按鈕可點性
  const inner = [...dialog.querySelectorAll("a,button")].map((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return top && (el === top || el.contains(top));
  });
  // 關閉
  document.querySelector('button[aria-label="關閉 WhatsApp 對話框"]')?.click();
  await new Promise((r) => setTimeout(r, 400));
  const closedPe = getComputedStyle(dialog).pointerEvents;
  const dr = dialog.getBoundingClientRect();
  const probe = document.elementFromPoint(dr.left + dr.width / 2, dr.top + dr.height / 2);
  const closedNotBlocking = !dialog.contains(probe);
  return { openOk, innerAllClickable: inner.every(Boolean), innerCount: inner.length, closedPe, closedNotBlocking };
});
console.log("WhatsAppWidget 實測:", JSON.stringify(widgetTest));
if (widgetTest.error || !widgetTest.openOk || !widgetTest.innerAllClickable || widgetTest.closedPe !== "none" || !widgetTest.closedNotBlocking) totalFails++;

await browser.close();
console.log(totalFails === 0 ? "\n✅ 全部通過" : `\n❌ 共 ${totalFails} 項失敗`);
process.exit(totalFails === 0 ? 0 : 1);
