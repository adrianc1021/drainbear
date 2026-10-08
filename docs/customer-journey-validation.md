# 客戶路徑重整驗證

日期：2026-10-08。實作說明見 [customer-journey-refresh.md](customer-journey-refresh.md)。

## 本機實際結果

- Node 24.19.0、Corepack／pnpm 10.4.1；使用 workspace 內的 XDG 目錄、既有信任及網絡代理。
- 凍結鎖檔安裝、TypeScript 通過；20 個測試檔案、120 項測試通過。
- 完整 `pnpm build` 通過；使用真實公開 CMS 資料，未使用 stale 模式。
- 73 個預渲染路由、71 個可索引標準網址；AEO、sitemap、SEO 核對通過。
- 知識檔包含 107 筆 FAQ 答案條目；按移除空白後的題目整理後亦為 107，不聲稱這些都是語義不同的問題。
- 61 個公開路由、100 組 320／390／768／1024／1440px 版型及 41 次 axe 檢查通過；另驗證 skip link、手機選單、客群切換、地區搜尋與問題判斷交接。
- 14 個代表路由的 metadata、標準網址與導覽核對通過。
- 9 個經審閱的服務↔案例關聯、3 個客群清單、公司來源及知識抽取核對通過；沒有維護提示或影片非顯示後備文字混入知識檔。
- WhatsApp 點擊與一次性 handoff 各一次；重新整理為零次新 handoff；沒有發出應用程式已開啟、實際收件或成交事件。外部測試頁截取跳轉，未傳送訊息。
- 五段影片在 390／1440px 的原生播放、字幕、跳播及 HTTP Range 206 通過；start／中點／complete 每次影片頁各一次，內容事件不代表查詢或成交。

## 可重複檢查

按環境 start_skill 的 Corepack、XDG、Node proxy、Chromium 設定後執行：

```sh
corepack pnpm check
corepack pnpm test
corepack pnpm build
corepack pnpm verify:routes
corepack pnpm verify:conversion
AXE_CORE_PATH=/workspace/drainbear-review/tools/node_modules/axe-core/axe.min.js corepack pnpm verify:quality
node scripts/verify-customer-journeys.mjs
node scripts/verify-case-video-browser.mjs
```

本次證據及截圖位於 `/workspace/drainbear-review/journeys-final`，詳細命令日誌位於同一 review 資料夾，未加入網站公開內容。

## 已知範圍

自動無障礙與版型檢查不是完整 WCAG 認證；沒有量度真實用戶 CWV。搜尋收錄、排名、AI 引用、真機 WhatsApp 接收、實際成交及 Google／廣告後台設定沒有已驗證資料。

兩個 CMS 案例的地區為佔位字元，五段影片亦尚無經確認的工程位置；未捏造地區案例。地區案例模組會在 CMS 提供明確位置後顯示。歷史 CMS 文章未批量改寫。

雲端 install_script 及 start_skill 草稿已儲存 workspace XDG 設定，避免套件管理器寫入受限 home；草稿儲存不代表環境版本已發布，亦不等於網站部署。

正式部署結果在發布後另行核對。
