# 地區頁及全站頁腳精簡

日期：2026-10-08（香港）。

## 實作

- 地區頁以港島、九龍、新界及離島三個預設收合群組，整合原有卡片與另一組地點資料；保留 18 個獨立地區專頁入口。
- 群組內區分地區服務頁及鄰近地點；沒有專頁的地點可以直接 WhatsApp 查詢，訊息帶入選擇的位置。
- 搜尋支援中文地點、區域、分組及已有專頁的英文名；包含先前未在鄰近清單內的行政區入口。每次顯示 12 筆，可繼續載入；清除後返回收合目錄，焦點回到搜尋欄。
- 原有 `/areas#coverage-0`、`#coverage-1`、`#coverage-2` 書籤仍會開啟並捲至對應區域。
- 共用頁腳縮為品牌與緊湊聯絡入口，三個預設收合的導航群組，及版權資料；手機直排、桌面三欄。導覽到另一頁時重設收合，`/thanks` 保留精簡無重複聯絡版本。
- 共用 `AnimatedDisclosure` 使用原生 details／summary。開合與箭頭動畫按 CSS 支援漸進增強；減少動態時即時切換。收起時立即以 inert 停用內容互動，開啟時恢復；原生開合、焦點與收合後的鍵盤順序已核對，關閉 JavaScript 仍可展開連結。
- 內容及連結保留於預渲染 HTML，不依賴點擊後才下載；聯絡資料及一次性 handoff 沿用現有共用設定。

## 實際長度比較

同一個本機 production server、相同尺寸、字體完成載入、所有目錄預設收合，量度整頁高度與 footer 元素高度。before 為 PR #49；after 為本次版本。整頁包含手機固定 CTA 的底部預留。

| 視窗 | 整頁高度 | 縮短 | 頁腳高度 | 縮短 |
| --- | --- | --- | --- | --- |
| 390px | 4,993 → 1,954px | 60.9% | 1692 → 521px | 69.2% |
| 1440px | 3,666 → 1,605px | 56.2% | 839 → 275px | 67.2% |

展開內容或顯示更多搜尋結果時會增加高度；上述數字不是效能、排名或轉換提升。

## 驗證

- TypeScript 與 120 項現有測試通過，沒有新增套件或改變鎖檔。
- 完整 build 通過；73 個預渲染路由、71 個可索引標準網址、107 筆 FAQ 答案，AEO／SEO／sitemap 核對通過。
- 全站 61 個公開路由、100 組響應式檢查、41 次 axe 檢查通過。
- 額外核對 320／390／768／1024／1440px 的收合、搜尋、分批結果、清除焦點、舊書籤及換頁重設；320／1440px 開啟地區與全部頁腳群組後的 axe 通過。
- 動態效果、收起時跳過隱藏連結、原生無 JavaScript 操作通過；一次 WhatsApp 點擊及 handoff，沒有虛假收件事件，彈窗被攔截，未傳送訊息。
- 手動檢視手機及桌面版截圖，修正地區頁標題的孤字換行。

證據位於 `/workspace/drainbear-review/compact-final`、`compact-final-quality`，及同一資料夾內的命令日誌。重現互動檢查：

```sh
NODE_USE_ENV_PROXY=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium AXE_CORE_PATH=/workspace/drainbear-review/tools/node_modules/axe-core/axe.min.js node scripts/verify-compact-navigation.mjs
```

套件命令沿用 Corepack／pnpm 10.4.1、workspace XDG 目錄及 cloud start_skill 的設定。正式部署另以正式網域核對；本機 axe 不代表完整 WCAG 認證，亦未證明搜尋收錄或真機 WhatsApp 收件。
