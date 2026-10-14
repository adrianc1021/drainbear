# 通渠熊首頁：B「光影水流」實作

改版日期：2026-10-14。用戶選擇 B，並批准「B 作方向，保留原素材，細節授權你完成」。本次集中首頁，保留其他頁面及已完成的 SEO 工作。

## 實際改動

- 白熊、香港夜景和水流構成主視覺，配自家託管的繁中粗體標題；手機採專用構圖。
- 明暗段落、開放式服務行列及細分隔線取代首頁原有重複卡片。服務查詢、真實施工、方法、流程、文章及 FAQ 維持清楚次序。
- 加入低幅度景深、水流和文字揭示動效；主視覺可暫停，尊重減少動態偏好，背景頁及離開視窗時停止場景更新。
- 保留原 Logo、五段施工紀錄及兩個 CMS 真實案例。首頁精選兩段原始影片，其餘仍由案例目錄取得；施工片段與完工案例清楚分開。
- 首屏 WebP 使用響應式尺寸及高優先載入；原始影片 `preload="none"`，預留圖片及影片尺寸。未新增動畫套件或改套件鎖定檔。
- 手機四個服務行列各有清晰圖片區；三幅設備線稿使用真正透明背景。圖片屬品牌或服務示意，沒有當成客戶工程證據。
- WhatsApp／電話、場所及服務選擇、地區、查詢預填資料、重試和既有追蹤沿用。

## 工具如何配合

UI UX Pro Max 用於版型、色彩及動態方向；Impeccable 用於三款樣稿、方向紀錄、素材製作、獨立審閱及設計文件。21st MCP 已驗證連線，參考 Scroll Reveal（cnippet-dev，18675）及 Parallax Image（pulkitxm，20023）的行為，再以原有 observer 和原生 rAF 實作，沒有整套搬入展示頁模板。

## SEO／AEO 保留

修改前後相同：

| 項目 | 內容 |
| --- | --- |
| Title | 香港通渠公司｜24小時通渠查詢｜通渠熊 DrainBear |
| H1 | 香港通渠，先搵通渠熊。 |
| Description | 搵香港通渠公司？通渠熊為住宅、食肆及物業處理坐廁塞住、鋅盤去水慢、浴室淤塞及主渠倒灌。電話及 WhatsApp 24 小時接受通渠查詢；上門時間按地區、人手及設備確認。 |
| Canonical | https://drainbearhk.com/ |

FAQ 答案、穩定錨點及結構化資料保留。主要內容和服務連結存在於預渲染 HTML，沒有要求先按互動控制才能取得。沒有捏造收費、地址、即時到場、資格或效果。

## 檔案

- `client/src/pages/Home.tsx`：首頁組成與四步流程。
- `client/src/components/HomeHeroScene.tsx`、`HomeServiceRows.tsx`：主視覺和開放服務行列。
- `HomeServiceFinder.tsx`、`HomeDrainMethods.tsx`、`HomeCompanyGuides.tsx`、`RecordedCaseGallery.tsx`：現有元件配合新版面。
- `ContactActions.tsx`：首頁 WhatsApp 優先順序及明確 accessible name；其他頁預設順序保留。
- `client/src/styles/home.css`、`brand-system.css`、`main.tsx`：首頁單一樣式入口及移除舊首頁樣式。
- `client/public/images/home/`、`client/public/fonts/`：正式圖片、來源 sidecar、自託管字型及 OFL 授權。
- `assets/plates/`、`assets/production-provenance/`：原始素材和生成／來源紀錄。
- `client/src/lib/homeContent.test.ts`：更新已被新主視覺取代的圖片尺寸及替代文字斷言。
- `PRODUCT.md`、`DESIGN.md`、`.impeccable/design.json`、方向及樣稿：產品真實資料與設計系統。

## 驗證及限制

型別檢查、24 個測試檔／136 項測試及完整 build 通過。建置涵蓋 87 條路由、85 個可索引網址、163 個可見 AEO 答案，以及五段真實影片的校驗、字幕、VideoObject 和影片 Sitemap。

瀏覽器驗證使用 320、390、768、1024、1199、1200、1440px；涵蓋服務組合、WhatsApp 預填及重試、手機選單、FAQ、影片、暫停動效、無 JavaScript 閱讀及 axe。結果及截圖見 [驗證資料](home-light-water-2026-10-14/validation.json)。WhatsApp 外跳由測試攔截，沒有傳訊或打電話。

獨立審閱提出三項修正；同一位審閱者檢查修正後截圖，判定三項全部 resolved，disposition: ship。此判決只涵蓋其列出的三項修正，不能擴大成全站審查。詳見 [審閱](home-light-water-2026-10-14/finish-review.md) 及 [修正判決](home-light-water-2026-10-14/finish-verdict.md)。正式部署待推送後另驗證域名。

Impeccable 歷史嚴格樣稿流程仍停於素材關卡：真實 Logo 和施工影像與生成樣稿縮圖不同，CLI 未能登記用戶的細節授權。本次按該授權完成實際網站，沒有偽造素材批准、逐像素比對或工具關卡通過。

沒有在相同實驗室條件重測載入速度，亦沒有宣稱 LCP、排名或客戶查詢改善。仍需真實公司背景、資格或更多完工素材時，應由業主提供可核實來源；本次沒有增加未確認資料。

後續 Search Console 用香港＋完全相符「通渠」，分手機／桌面，觀察曝光、點擊、平均排名及顯示頁面；首個完整 28 日再比較。搜尋點擊與實際電話／WhatsApp 查詢分開記錄。
