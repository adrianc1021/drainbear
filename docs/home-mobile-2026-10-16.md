# 手機首頁精簡 — 2026-10-16（香港）

首頁保留 B「光影水流」、白熊、原始 Logo、真實施工影片及 HK$300 起報價，改用原生掃動展示和按需展開的案例資料。沒有新增套件或圖片，也沒有更改網址、首頁 title、description、H1、canonical 或 FAQ 答案。

## 可比較結果

同一網址、本地正式建置、Chromium、844px 視窗高度、減少動態、字體及已發布 CMS 圖片載入完成；案例詳情預設收合，未操作任何掃動區。高度包含共用頁腳。

| 寬度   | 原版頁高 | 新版頁高 |  減少 |
| ------ | -------: | -------: | ----: |
| 320px  | 11,057px |  7,338px | 33.6% |
| 390px  |  9,906px |  6,833px | 31.0% |
| 768px  |  6,172px |  5,873px |  4.8% |
| 1024px |  6,009px |  5,787px |  3.7% |
| 1440px |  6,547px |  6,324px |  3.4% |

這是預設頁面長度比較，不代表速度、搜尋排名或查詢轉換改善。展開詳情後頁面會自然增長。資料見 [修改前](home-mobile-2026-10-16/before.json)及[修改後](home-mobile-2026-10-16/after.json)。

[原手機版](home-mobile-2026-10-16/before-mobile.png) · [新手機版](home-mobile-2026-10-16/after-mobile.png) · [新桌面版](home-mobile-2026-10-16/after-desktop.png)

## 元件素材庫參考

透過已連接的 21st MCP 實際搜尋及取得兩個公開元件：

- [Snap Carousel — ddoemonn](https://21st.dev/@ddoemonn/components/snap-carousel)：採用露出下一項、前後按鍵、位置提示及鍵盤操作的模式，按本網站改寫為原生 CSS scroll-snap；不加入其 motion runtime、自動播放或攔截觸控拖曳。
- [Ghost Accordion — arihantcodes](https://21st.dev/@arihantcodes_1f7b8c4d/components/accordion-ghost)：參考無外框、細線分隔及展開詳情的模式，沿用網站 AnimatedDisclosure 的原生 details/summary；不複製編號裝飾或另建 Radix 動態系統。

UI UX Pro Max 的手勢衝突及拖曳替代控件指引用於保留直向捲動、44px 箭頭和鍵盤操作；Impeccable 用於保留既有視覺及完成獨立審閱。沒有啟用付費 AI 元件生成。

## 實際檔案改動

| 檔案                                                   | 改動                                                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| client/src/components/HomeMobileRail.tsx               | 共用手機掃動區、前後按鍵、位置、鍵盤、減少動態、離開畫面的影片暫停；保留原生捲動及所有 HTML 子項。 |
| client/src/components/HomeServiceRows.tsx              | 四項服務在手機橫向展示，桌面維持開放式服務列。                                                     |
| client/src/components/RecordedCaseGallery.tsx          | 兩段原生短片採掃動展示；真實完成案例以小圖、標題及詳情收合呈現，保留四項完整工程資料。             |
| client/src/components/HomeServiceFinder.tsx            | 精簡介紹及移除重複的五項常用服務列；完整服務仍在原選擇器、相關方法及服務目錄內。                   |
| client/src/components/HomeDrainMethods.tsx             | 精簡方法介紹，保留適用條件及技術限制。                                                             |
| client/src/styles/home.css                             | 在原有首頁樣式中調整手機主視覺、掃動展示、案例、方法、流程及指南；移除過時樣式，未另疊一套 CSS。   |
| scripts/prerender.ts                                   | 保存 HTML 時重設暫時的 data-enhanced 狀態，避免無 JavaScript 版出現不可操作的箭頭；原生掃動保留。  |
| scripts/verify-home-mobile.mjs                         | 可重跑的觸控、鍵盤、影片切走暫停、收合焦點及無 JavaScript 驗證。                                   |
| DESIGN.md、.impeccable/design.json、首頁 surface brief | 記錄實際完成的手機元件與尺寸；品牌視覺不變。                                                       |

## 修改後文案

介紹：

> 通渠熊為香港住宅、食肆及物業處理坐廁淤塞、鋅盤去水慢、浴室積水及主渠倒灌。選擇場所、問題及地區，立即傳相查詢。

方法介紹：

> 堵塞位置、喉管物料及入口，決定適合的通渠方法；不是每宗工程都需要全部設備。

- 機械疏通：「按堵塞位置及喉管條件處理局部淤塞；懷疑硬物或喉管損壞，先檢查。」
- 高壓洗渠：「按喉管物料、入口及現場排水、污水處理條件，評估是否適合清理管段積聚物。」
- CCTV 照渠：「查看鏡頭可到達位置的管內情況，協助了解反覆淤塞；照渠不等於疏通。」

施工介紹：

> 原片展示施工過程，下方另附兩宗完成去水測試的案例。完整紀錄可在案例內頁查看。

新控件文案：「左右掃動查看更多」、上一項／下一項、項目位置及「查看處理及測試紀錄」。原案例資料與個別短片的證據範圍說明保留；沒有新增未記錄的工程效果。

## 驗證

- `pnpm check`、25 個測試檔案／138 個測試通過。
- `pnpm build` 完成 216 個頁面預渲染；Sitemap 214 個可索引網址、213 個子頁、128 篇完整解答、291 項可見答案及五段真實影片檢查通過，未使用 stale CMS 選項。
- 320、390、768、1024、1199、1200、1440px：無全頁水平溢出；title、H1、canonical、robots、首屏聯絡按鈕及頁首無重疊；axe WCAG 2.2 AA 規則無違規。
- 28 個場所／服務組合、地區帶入、WhatsApp 實際跳轉及重試保留內容、手機選單與 Escape、原生影片播放、動效暫停、FAQ、案例詳情及錨點通過。WhatsApp 由測試攔截，沒有發出訊息。
- Chromium CDP 實際 touchStart／touchMove／touchEnd 合成觸控：橫向掃動改變項目，直向掃動仍捲動頁面。前後按鍵、Home／End／方向鍵可用；影片切走後暫停，下一段不自動播放。
- 無 JavaScript：四項服務連結、兩段首頁影片及案例四項完整資料保留，原生收合可開啟，不顯示不能運作的箭頭。關閉展開內容時立即 inert，焦點不會進入收合內容。
- 第一次無 JavaScript 測試在 CSS 動畫尚未完成時即時判讀，後改為等待最終可見狀態；完成重跑通過。CDP synthesizeScrollGesture 未產生捲動，改以實際觸控事件序列驗證通過，沒有以畫面截圖代替手勢測試。
- 沒有實體 iPhone／Android 或 Safari 裝置驗證；上述手勢證據來自 Chromium 合成觸控。

[瀏覽器結果](home-mobile-2026-10-16/browser-verification.json) · [觸控與原生操作結果](home-mobile-2026-10-16/touch-verification.json) · [獨立審閱：ship（本次精簡範圍）](home-mobile-2026-10-16/finish-review.md)

## 維護

本次沒有新增 SEO 頁面，也沒有改寫 128 篇解答或其網址。首頁所有掃動項目及收合案例資料仍在預渲染 HTML。後續手機元件變更可執行 `node scripts/verify-home-mobile.mjs`；使用 QA_ORIGIN 指向待驗網址，MOBILE_REVIEW_OUTPUT 設定證據輸出位置。

Impeccable 提示既有 config.json 的 telemetry 欄位不被目前版本讀取；本次沒有擴大範圍修復該設定。歷史 strict-comp 機器關卡沒有新增通過聲稱；本次為已授權的響應式精簡，審閱結果只適用於此範圍。

## 正式網站驗證

已部署至 https://drainbearhk.com/ ，應用程式提交為 `b15e954`。2026-10-16 香港時間 13:10，直接確認正式域名出現新版 HTML、精簡文案、原生後備狀態及可用的 JavaScript 資產；未以 Vercel 狀態取代正式域名驗證。

正式域名 390px／1440px 排版、axe、28 個服務組合、WhatsApp 跳轉／重試、影片及動效檢查通過，問題清單為空。實際 Chromium 合成觸控、直向捲動、影片切走暫停、鍵盤、收合焦點及無 JavaScript 案例資料重跑通過。正式手機頁高 6,833px，桌面 6,324px，與本地相同條件的最終建置一致。Sitemap 維持 214 個網址；四個服務和兩個完成案例的 HTTP 200 及 canonical 已核對。

[線上瀏覽器結果](home-mobile-2026-10-16/production-browser.json) · [線上觸控結果](home-mobile-2026-10-16/production-touch.json) · [線上高度](home-mobile-2026-10-16/production-height.json) · [正式版本](home-mobile-2026-10-16/production-version.json) · [Sitemap／連結](home-mobile-2026-10-16/production-routes.json)
