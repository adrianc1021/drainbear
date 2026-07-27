# 手機版按鈕點擊無反應 — 排查與修正紀錄（2026-07-27）

## 用戶回報
手機查看網頁時很多按鈕點擊無反應。

## 根因分析
1. **WhatsAppWidget 外層容器攔截點擊（主因）**：`WhatsAppWidget.tsx` 外層 `fixed z-[60]` 容器包含一張 `w-[320px]` 的對話卡。對話卡關閉時雖有 `pointer-events-none opacity-0`，但外層容器本身仍是 pointer-events:auto，且 flex 容器覆蓋右下角一大塊區域（手機上 bottom-[86px] 起，寬 320px、高含卡片），令其下方的頁面按鈕（hero CTA、卡片 WhatsApp 按鈕等右側區域）點不到。
   - 修正：外層容器加 `pointer-events-none`，懸浮按鈕補 `pointer-events-auto`（對話卡開啟時已有 `pointer-events-auto`）。
2. **MobileCTABar 收起時仍攔截**：向下捲動時 CTA 列 `translate-y-full` 移出視窗，但在 iOS Safari 上仍可能攔截底部觸控。收起狀態補 `pointer-events-none`。
3. **底部佔位 div** 補 `pointer-events-none`（保險）。

## 已確認無問題
- Home/Services 裝飾 blur 層已於前一輪補 `pointer-events-none`。
- `.reveal` 進場動畫僅動 opacity/transform，不影響 pointer-events；useReveal 用 IntersectionObserver 正常。
- Header 手機選單按鈕 z-50，正常。

## 驗證（2026-07-27 完成）
- 瀏覽器 elementFromPoint 全頁掃描（首頁 32 個可點元素）：全部通過。唯一 fail 是 `#manus-previewer-root`（Manus 開發預覽工具注入的 0 高度 div，僅存在於 dev 預覽環境，非網站程式問題）。
- WhatsApp 對話卡關閉狀態：外層容器 pe:none 生效，面板覆蓋區域（x:956-1222）的 elementFromPoint 命中頁面元素而非面板 → 不再攔截。
- 對話卡開啟後：關閉鈕、4 個快速主題、開始對話按鈕全部可點（elementFromPoint ok:true）。
- BackToTop 隱藏狀態（opacity-0）已有 pointer-events-none（Layout.tsx L161）。
- MobileCTABar 收起狀態（translate-y-full）已有 pointer-events-none（Layout.tsx L90）。
- 375x812 手機截圖 /、/guide、/services、/faq 渲染正常，底部 CTA 列與 WhatsApp 懸浮鈕位置正確。

## 結論
根因為 WhatsAppWidget 外層 fixed 容器（含 320px 對話卡）在關閉狀態攔截右下角大面積點擊。修正三處 pointer-events 後全部按鈕恢復可點。

## 手機視窗（375x812）Playwright 全站稽核（2026-07-27）
腳本：`scripts/mobile-tap-audit.mjs`（isMobile + hasTouch + iPhone UA），逐頁捲動掃描所有可見 a/button 的 elementFromPoint 可點性：
- / 28、/guide 52、/services 21、/faq 23、/areas 20、/blog 18、/thanks 27 個元素——全部 0 失敗。
- WhatsAppWidget 實測：開啟正常、面板內 6 個按鈕全部可點、關閉後 pointer-events:none 且不攔截下方元素。
- 全部通過（唯一排除項為 dev 預覽注入的 manus-previewer-root，正式站不存在）。
