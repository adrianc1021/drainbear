# 通渠行業SEO：現有內容關聯與服務入口改善

日期：2026-10-22（香港）。目標為改善既有網站對通渠服務需求的承接，非排名保證。沿用專案search-quality、site-quality、interface及writing指引，保留手機首頁、18個地區獨立文章、真實案例、現有URL、追蹤與廣告設定。

## 核實結果

直接抓取正式Sitemap及215個HTML網址：全部200、各一個H1、有獨立title及description、canonical一致、沒有noindex或robots阻擋、沒有孤立頁。5個影片頁亦在主Sitemap。頁內連出的5條MP4是媒體檔案，不是漏入Sitemap的內容頁。這是技術可收錄性檢查，不是Google已收錄數或排名報告。本回合沒有可用GSC連接工具，沒有將歷史Search Console快照當成最新成效。

全頁包含頁腳八項服務，不能據此判斷文章已有主題服務入口。另檢查article正文，找到若干文章未有對應服務連結。挑選12篇與具體渠務問題直接相關的內容補強；防騙、公司挑選等文章保留各自用途，沒有強行全部導向相同服務。

## 實作

- 12篇文章：加入1至2個對應服務連結及一段適用情況說明，詳見contentConnections.ts的SERVICE_TOPIC_ARTICLES。
- 對應服務頁：反向連到這些指南，與既有閱讀清單按slug去重。高壓洗渠、CCTV、隔油池、主渠沙井、倒灌、鋅盤、浴室形成具體閱讀路徑；坐廁保留已有相關文章。
- 全部8項服務：直接顯示處理範圍與適用情況，原收合內移除同段重複，保留限制及準備事項。
- /services：新增三條閱讀路徑，分別為家居淤塞、反覆塞渠／倒灌、收費與上門安排，連到既有服務、比較文章、CCTV指南、收費、流程、地區及案例。
- 日期：12篇文章的列表、內頁、JSON-LD與Sitemap共用實際修訂日期；保留原發布日期及較新更新。服務總覽與8項服務Sitemap日期為本次修訂日。
- 不反覆更換首頁title，不增加虛構年資、評價、地址或工程結果；沒有新增頁面湊數。

## 頁面與關鍵字分工

| 主題 | 主要承接頁 | 補強文章 |
| --- | --- | --- |
| 通渠、香港通渠、通渠公司 | /、/services | 現有收費、流程及案例入口 |
| 高壓洗渠、彈簧機通渠 | /services/high-pressure-jetting | high-pressure-drain-cleaning-vs-spring-machine、drain-tool-selection-guide、drain-blocked-again-after-cleaning-root-causes |
| CCTV照渠、照喉檢測 | /services/cctv-drain-inspection | read-cctv-drain-inspection-report、drain-blocked-after-renovation、tree-roots-in-underground-drain |
| 主渠、沙井、污水倒灌 | /services/main-drain-manhole、/services/sewage-backflow | building-main-drain-vs-unit-branch-pipe、old-building-backflow-signs、rainstorm-typhoon-drain-checklist-hong-kong、village-house-manhole-rainy-season |
| 隔油池清理 | /services/grease-trap-cleaning | restaurant-grease-trap-guide |
| 浴室通渠、洗手盆去水慢 | /services/bathroom-drain-unblocking | slow-basin-drain-causes-solutions |

以上是內容分工，沒有以當前搜尋量或排名數據排序。全部文章前綴為/blog/。

## 後續成效與所需資料

用GSC比較發布後首個完整28日（2026-10-23至11-19）與此前28日，按香港、手機／桌面、非品牌查詢、主要服務頁分開觀察曝光、點擊、CTR、平均排名與入口頁；樣本不足再累積。重新核對Google索引需GSC目前授權。Google商家資料、真實客戶評價、合作商戶引用及當區施工記錄需要可核對來源，未自行聯絡第三方或製造素材。搜尋點擊不等於實際電話／WhatsApp查詢。

## 驗證

TypeScript通過；28個測試檔／151項測試通過。新增測試覆蓋既有連結保留與去重、明確空清單、CMS與後備一致、原發布日期保留及較新日期不被覆蓋。首次測試發現鋅盤文章的舊後備入口被重加，已修正合併邏輯，並更新實際新增服務入口文章的修訂日期期望；修正後重新完成建置。

完整build通過：215個canonical/Sitemap網址、214子頁、128個問題答案、SEO與AEO一致性檢查。瀏覽器逐項核對12篇文章的正文服務入口、日期與原發布日期、8項服務可見摘要與反向文章連結；320／390／768／1024／1440px無溢出，手機axe AA零違例，無JavaScript仍可閱讀服務摘要及展開文章連結。已人工檢視手機截圖。本機CMS依專案唯讀中繼讀取真實資料，非模擬內容；不代表實體Safari或完整無障礙認證。

修改檔案：contentConnections.ts、blogRepository.ts、RelatedDrainArticles.tsx、ServiceDetail.tsx、Services.tsx、brand-system.css、prerender.ts、兩個相關測試檔與search-quality維護指引。原創新增摘要、連結文案及說明完整保存在上述版本化檔案。

## 正式發布

應用程式提交f9b6694已部署至drainbearhk.com。2026-10-22直接驗證正式域名：12篇文章正文服務連結與原發布日期、8項服務摘要及對應文章、五種寬度、axe、無JavaScript操作全部通過。正式Sitemap仍為215網址，9個服務相關頁及12篇文章的lastmod為2026-10-22。正式證據見sector-seo-2026-10-22/production.json。沒有聲稱Google已重新抓取或排名已上升。
