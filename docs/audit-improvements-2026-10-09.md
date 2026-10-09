# 網站審查改善

依據 2026-10-09 正式站審查，基準版本為 019a939。此輪處理查詢連貫性、手機閱讀負擔及介紹圖片一致性。

## 已實作

- 所有 WhatsApp 交接入口保存當次目的地，/thanks 的重試及重新整理保留場所、服務及地區。重試資料獨立於追蹤模組，僅於該分頁的 sessionStorage 保留 15 分鐘；只接受同一公司電話的 HTTPS wa.me 連結，到期或儲存不可用時回到一般查詢入口。沒有新增收件、成交或應用程式成功開啟事件。
- 手機 /services 使用兩欄短圖片卡，/services、/guide、/about 的三類客戶入口改為短卡。完整服務連結及 AI 圖片保留。
- /blog 提供問題搜尋、分類、每頁六篇的實際網址分頁及空結果重設；換頁後把焦點和畫面帶回結果標題。全部 25 篇文章入口保留於原生收合目錄，無 JavaScript 仍可打開目錄及文章。
- 上門流程改為四張首頁同款 AI 插圖及簡短說明；詳細階段、準備清單、動工確認及工具差異可展開。移除長篇業務條款，個別報價只保留必要的現場確認說明。
- About 與住宅／食肆／物業頁的介紹入口改用 ServiceIllustration，修正舊 span 樣式擠壓插圖的問題。介紹與服務分享圖片沿用首頁的藍白 AI 品牌封面；工程頁仍保留真實素材。
- 文章共用 CTA 改為「WhatsApp 查詢」。指南及流程查詢清單可切換住宅、食肆與物業，WhatsApp 預填內容隨之更新。
- 新增五段原片的 `case-facts-intake.json` 整理表及核實／發布流程。未知地區、施工日期與完工結果保持空白，不推測五段素材是五個不同客戶。

## 驗證方式

沿用雲端設定技能的 workspace XDG、Corepack pnpm 10.4.1、Node 網絡代理及 Chromium 設定：

```sh
corepack pnpm check
corepack pnpm test
corepack pnpm build
NODE_USE_ENV_PROXY=1 READING_QA_OUTPUT=/tmp/drainbear-reading node scripts/verify-visual-reading.mjs
NODE_USE_ENV_PROXY=1 AXE_SOURCE_PATH=/path/to/axe.min.js AUDIT_QA_OUTPUT=/tmp/drainbear-audit node scripts/verify-audit-improvements.mjs
```

第二個瀏覽器腳本驗證五種尺寸、完整 AI 場景、文章分頁／搜尋／分類／返回／空結果、客戶清單切換及無 JavaScript 目錄。兩個腳本均讀取實際網站與 CMS 回應，封鎖分析請求，攔截 WhatsApp 視窗；不傳送訊息。axe 路徑省略時不執行自動無障礙檢查，本輪驗證有提供該路徑。

## 案例及量度

真實工程地區、施工日期和完工結果仍需公司確認；影片發布日期不代替施工日期。確認後更新原案例及公開來源，再建立相關地區證據。沒有提供搜尋帳戶或客服收件資料，本輪不聲稱 Google 排名、AI 引用率、真實成交或 Core Web Vitals 已提升。

後續依 `lead-register-template.csv` 分開記錄收到查詢、報價、接納及完工；依 `ai-citation-review-template.csv` 保存問題、平台版本、是否搜尋、引用網址及事實錯誤，不以網站知識檔可讀取代外部 AI 實測。

## 本機結果

TypeScript、21 個測試檔案／127 項測試及完整建置通過。建置使用真實公開 CMS，預渲染 73 個路由；71 個 canonical 頁面、107 項可見答案及五段影片的 AEO／sitemap／SEO 核對通過。

8 個更新頁面 × 五種尺寸共 40 組版型及圖片檢查，16 組 axe WCAG 2／2.1／2.2 AA 自動檢查通過；另核對首頁引導、服務選擇及 WhatsApp 交接。自動檢查不等於完整 WCAG 認證。

390px、同一組 CMS 內容及瀏覽器設定的預設整頁高度如下；高度會隨文字、字型和內容更新而改變，不代表真實用戶速度數據。

| 頁面             | 審查基準 |  更新後 |  縮短 |
| ---------------- | -------: | ------: | ----: |
| /services        |  6,060px | 3,181px | 47.5% |
| /blog            | 13,096px | 2,860px | 78.2% |
| /guide           |  3,775px | 3,026px | 19.8% |
| /service-process |  4,800px | 3,399px | 29.2% |
| /about           |  3,889px | 3,033px | 22.0% |

流程頁預設可見非空白字元由 932 減至 384；文章目錄由 2,910 減至 397。完整資料仍可展開或進入內頁。正式網站結果於發布後另行核對。
