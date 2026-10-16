# 文章圖文更新 — 2026-10-16

## 實際改動

39 篇已發布文章全部有至少兩張正文圖片。原有五張正文圖片保留，本輪為 38 篇文章加入 75 個圖位，合共 80 張正文圖片（不包括文章封面）。新增三款白熊紙藝 AI 插圖：報價溝通、服務場景及 CCTV 檢查；另按文章主題重用現有插圖，以及已發布案例原相。75 個新圖位不代表 75 款新創作。

「香港通渠公司推介」正文有四張配圖：報價溝通及服務場景示意、家居洗手盆積聚物原相、學校雨水渠清洗設備與水喉原相。AI 圖標示「AI 示意」，案例相標示「工程原相」。原相完整展示、不裁走證據；施工圖不作未記錄結果的證明。

沿用原有閱讀版面，在完整相關章節後穿插插圖，在對應案例段落後放原相。短圖說、響應式 WebP、真實寬高及正文 lazy loading 由共用 ArticleFigure 處理。保留原有封面、文字、連結、標題、描述、網址、canonical、robots 及首次發布日期。實際新增圖片文章的修訂日期同步為 2026-10-16，反映於列表、詳情、Article schema 及 Sitemap；未更動 CMS 原始文件。

## 修改檔案

- `client/src/components/ArticleFigure.tsx`：共用圖片語意、響應式來源、完整直幅及短圖說。
- `client/src/lib/articleImages.ts`：插圖及真實相片的來源、尺寸與說明。
- `client/src/lib/articleIllustrationPlan.ts`：38 篇文章的明確章節／段落配圖計劃。
- `client/src/lib/articleIllustrations.ts`、`articleIllustrations.test.ts`：保留原文、避免重複圖片的純映射及測試。
- `client/src/lib/blogRepository.ts`、`client/src/lib/sanity/types.ts`、`client/src/pages/BlogPost.tsx`：接入靜態及 CMS 文章。
- `client/public/images/blog/editorial/`：三款新插圖，各有 640、960、1200px WebP。
- `scripts/prerender.ts`：對應修訂日期；`scripts/verify-new-seo-articles.mjs`：現有三篇新文章的增加圖位與日期驗收。
- `DESIGN.md`、`.impeccable/surfaces/blog.md`：保留本次閱讀介面規則。
- `docs/article-visual-assets-2026-10-16.json`：完整生成提示、原圖位置、尺寸、檔案大小及 SHA256。

## 驗證

- `pnpm check` 通過；26 個測試檔案、142 項測試通過；完整建置通過。
- 216 個預渲染路由、214 個 Sitemap URL、213 個子頁、128 個完整答案及 291 個 AEO 答案檢查通過。五個真實影片及字幕／schema／video sitemap 檢查通過。
- Chromium 本地：39 篇文章逐篇以 390px 核對；四篇代表文章另以 320、768、1024、1440px 檢查，合共 55 個版型，沒有收集到錯誤。
- 80 張正文圖片均成功解碼、比例正確、沒有橫向溢出；正文先採 lazy loading，直幅原相高度不超過 448px。
- 核對原文、文字標記、連結、metadata、原發布日期、FAQ schema 與可見內容、實際修訂日期及 Sitemap。一組三篇文章關閉 JavaScript 仍可讀取正文圖片。
- 四篇代表文章的各尺寸 axe 檢查通過。七張指定配圖截圖經人工及獨立審閱，結論為 ship、沒有實質設計缺陷。
- 現有三篇新文章工具：15 個版型、六個 WhatsApp 外跳流程、17 個連結、21 個原有圖片檔案及無 JavaScript 檢查全部通過。沒有實際發送訊息或撥電話。
- 新九個 WebP 來源提示掃描：九個檔案、零個缺漏；HTTP 檔案大小與 SHA256 另有核對。

證據：[本地結果](article-visuals-2026-10-16/local-browser-results.json)、[改前清單](article-visuals-2026-10-16/inventory-before.json)、[改後清單](article-visuals-2026-10-16/inventory-after.json)、[獨立審閱](article-visuals-2026-10-16/finish-review.md)。

限制：Chromium 模擬尺寸，未實測 Safari 或實體手機；沒有把圖片更新當成已證實的搜尋排名提升。既有首頁 strict-comp 狀態及既有 11px 提示不屬於本次文章配圖通過範圍。

## 正式發布

待部署及正式域名核對後記錄。
