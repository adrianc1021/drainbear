# 通渠熊 SEO 診斷核對與實際改善

核對日期：2026-10-18（香港）。範圍：正式首頁、觀塘頁、沙田頁、About、公開 robots／Sitemap、現有程式碼與 Google 官方文件。這是網站及建議查證，沒有讀取新的 Search Console、Google Business Profile 後台或實際轉換資料，不能據此判定排名低的主要原因。

本次工作以已部署提交 `3b81749` 為基礎。初始 checkout 落後正式版本；核對遠端後只作乾淨分支的快進更新，保留已完成的首頁、文章、公開資料庫及其他修改。

## 核對結論

| 提供的說法 | 實際證據及修正 |
| --- | --- |
| 搜尋意圖57.1%、反向連結54.8%是核心排名比重 | 未提供調查原文、問卷、樣本或定義，不能當成Google演算法權重。三條主線可作工作框架，不是公開的固定配方。 |
| E-E-A-T本身是一項排名因子 | Google明確寫明「E-E-A-T itself isn't a specific ranking factor」；應以真實經驗、可靠來源及可核實身份改善內容，不計算自製E-E-A-T分數。 |
| 首頁偏科普，缺乏緊急服務訊號 | 正式首頁已有「香港通渠，先搵通渠熊」、全線HK$300起、首屏電話及WhatsApp、住宅／食肆／物業服務入口。工程摘要亦是服務證據，不能推論Google因此把網站歸為百科。可以觀察查詢與入口頁，但沒有這次的排名或轉換資料支持此因果說法。 |
| 地區頁只是更換地名，可能連累全站 | 抽查觀塘有工廈、貨梯、工具搬運及食肆資料；沙田有村屋、窄路、閘門及公共渠安全資料，兩頁的介紹、情況及FAQ不同。共用版型及頁腳連結不等於門頁濫用。仍可補足真實當區證據，但不能宣稱已獲Google降權，也未完成全部地區頁的品質判定。 |
| 網站缺少本地商家Schema | 四個抽查頁均已有Plumber（LocalBusiness的專門型別）、穩定商家ID、電話、服務地區、社交及Google Maps連結；不是尚未加入LocalBusiness。網站連結不能證明商家檔案完整或地圖排名良好。 |
| 加FAQ Schema便會在Google顯示下拉問答 | 首頁及地區頁本來已有FAQPage，且Google官方更新紀錄確認此富摘要自2026-05-07停止顯示，相關文件其後移除。保留實用問答及同源機讀資料；不為取得已停用的搜尋外觀增加FAQ。 |
| 商家名稱加入「24小時香港專業通渠公司」 | 應先核對實際對外品牌，而非把搜尋關鍵字任意拼進商家名稱。本次保留「通渠熊 DrainBear」，未改動外部商家檔案。Google Business Profile相關支援頁本次回傳429；沒有假稱讀取到商家後台或完成名稱合規審核。 |
| 24小時服務及全港30分鐘到場能推升排名 | 已確認的是24小時接受查詢，上門另行安排，並非全港固定到場承諾。此次只把查詢時間寫入ContactPoint.hoursAvailable，對應可見資料。 |
| .hk或本地高流量連結對排名有決定性推動 | 優先考慮真實、相關、編輯自主的引用及合作案例。不能只憑.hk、流量或網域數推算排名效果；公開資料庫連往新聞網站是出站引用，不等於香港01、TVB等反向連結或背書通渠熊；也不把自有網站互換或虛構提及當作信任證據。 |
| 網站慢／跳出率高已造成排名差 | 本次未取得新的CrUX、RUM或速度測試，不能建立因果關係。Google的Core Web Vitals反映真實體驗；實驗室和真實用戶結果要分開。 |

## 正式網站已核實資料

四頁均HTTP 200。首頁title為「香港通渠公司｜通渠 HK$300 起｜通渠熊 DrainBear」，並非本機舊版本的無價格title。電話與WhatsApp為同一組已確認聯絡資料。首頁提供服務選擇、真實施工短片、兩宗有處理／去水測試的工程紀錄，以及流程及問答。

觀塘、沙田各有獨立H1、內容及FAQ。About已有公司公開資料、24小時查詢安排及Google Maps連結。公開Maps網址可到達需要JavaScript的Google頁面，但這次沒有核實檔案擁有權、商家類別、營業時間、評價、曝光或地圖排名。Google Business Profile支援頁的429及未登入後台均不代表商家不存在。

技術快照見[修改前頁面證據](seo-ranking-diagnosis-2026-10-18/before-site.json)。現有頁腳及地區網址保留，沒有刪頁、合併、noindex或調整canonical。

## 今次實際更新

`client/src/components/SEO.tsx`：在既有ContactPoint加入「24小時通渠查詢」名稱、與可見頁面一致的查詢／上門說明，以及七日00:00–23:59的hoursAvailable。這是聯絡可用時段，不是Plumber商家全日施工時間，也不是排名加分保證。電話、WhatsApp、商家名稱、sameAs、價格資料及既有FAQ維持同源。

`client/src/lib/seoLifecycle.test.ts`：增加語意回歸驗證，確認24小時屬聯絡點、電話／WhatsApp一致，且沒有把它轉為商家全日施工時間。

`skills/drainbear-search-quality/SKILL.md`：保存已核實的FAQ富摘要停止資訊，以及聯絡與施工時段的區分，避免後續再採用過時的SEO建議。

沒有新增虛構評價、工程、資歷、地址或效果承諾。服務文案可具吸引力，但示意內容與可核實業務證據分開；不能把虛構紀錄當作第一手經驗。

## 下一輪最值得做的五項

1. **核實現有Google商家檔案**：對照真正品牌、主要類別、服務範圍、電話、網站及聯絡時段，查閱商家搜尋與地圖表現。業務若不接待到訪客人，按實際服務區域業務方式設定；不建立虛構分店或地址。這是需後台資料的工作，未假稱完成。
2. **以查詢數據決定首頁定位**：在GSC使用香港＋完全相符「通渠」，分手機／桌面，觀察首頁與文章的曝光、點擊、平均排名及被顯示頁面。另拆開「香港通渠公司推介」「地區＋通渠」等意圖；不把2026-09-13至10-10的歷史快照當成今次最新資料。
3. **將真實當區工程加入相關地區頁**：優先有曝光機會且確有素材的頁面。所需資料是施工地區、問題、現場發現、方法、測試及可公開原相／短片；沒有紀錄的觀塘翠屏邨或開源道工程不冒充「上週完成」。
4. **取得真實評價及行業引用**：從已完成客戶、合作伙伴、供應商或物業案例出發，保存可追溯來源。沒有自動聯絡第三方、購買連結、提交disavow或修改外部帳戶；後續合作按個別授權進行。
5. **量度手機查詢路徑與真實效能**：觀察首屏到服務選擇、電話及WhatsApp的實際使用，分開外跳與客服收到查詢。速度比較使用同一網址／裝置／網路條件；先看LCP元素、JS及影片載入，再作有證據的修改。此次沒有用舊實驗室數字宣稱CWV失敗。

修改後以首個完整28日作首次比較，樣本不足再累積；不每日反覆改title。排名、搜尋點擊、聯絡外跳及真正收到查詢分開記錄。

## 官方依據與存取範圍

- [Google：建立實用、可靠、以使用者為先的內容](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)：E-E-A-T及第一手經驗。
- [Google：FAQ富摘要停止顯示的更新紀錄](https://developers.google.com/search/updates#faq-deprecation)：2026-05-07停止，文件其後移除；原FAQ文件網址已重新導向此更新紀錄。
- [Google：搜尋垃圾內容政策](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse)：門頁及規模化低價值內容，不能只憑共用版型定性。
- [Google：LocalBusiness結構化資料](https://developers.google.com/search/docs/appearance/structured-data/local-business)：商家資料及型別。
- [Schema.org：hoursAvailable](https://schema.org/hoursAvailable)：適用於ContactPoint／Service的可用時段。
- [Google：Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)、[行動版優先索引](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)：真實用戶體驗與手機內容。
- [Google商家名稱指引](https://support.google.com/business/answer/3038177)、[本地排名說明](https://support.google.com/business/answer/7091)：本次HTTP 429，列作後續人工核對入口，未冒充本次可讀引文。

可讀官方文件與頁面SHA256、重新導向及未取得項目見[來源紀錄](seo-ranking-diagnosis-2026-10-18/sources.json)。

## 驗證與發布

TypeScript及27個測試檔案／149項測試通過。完整build、217個路由預渲染、215個canonical／Sitemap URL、214個子頁、128個完整答案及292個可見AEO答案通過；既有5段真實影片及媒體／字幕／video sitemap亦通過。

逐一核對215個預渲染頁面的Plumber及ContactPoint：七日查詢時段、名稱與電話一致，沒有把查詢時段寫成商家全日施工時間；knowledge.json的商家聯絡資料一致。

本機Chromium於320、390、768、1024、1440px，對首頁、About、觀塘、沙田共20個頁面／尺寸組合核對title、description、唯一H1、canonical、robots、商家資料、價格及原有電話／WhatsApp連結。四頁390px的axe檢查未見違例，所有尺寸沒有水平溢出或收集到JS錯誤。關閉JavaScript仍有首頁標題、價格、電話及機讀資料；沒有撥電話或發訊息。人工開啟手機／桌面截圖，確認原有外觀及查詢入口保留。未測實體手機或Safari。

瀏覽器檢查先等可見H1、目前SEO及CMS完成，避免React初次啟動的短暫載入狀態誤報為缺少標題。沒有移除或放寬H1檢查。

證據：[瀏覽器結果](seo-ranking-diagnosis-2026-10-18/local-browser-results.json)、[215頁機讀資料核對](seo-ranking-diagnosis-2026-10-18/prerender-contact-results.json)、[手機](seo-ranking-diagnosis-2026-10-18/home-390.png)、[桌面](seo-ranking-diagnosis-2026-10-18/home-1440.png)。

程式提交 `ef050e9` 已推送main並正式部署。2026-10-18 01:49香港時間，正式首頁與knowledge.json已核對同一組24小時查詢資料。正式Chromium 390／1440px對四頁共8個頁面／尺寸組合驗證通過；schema、canonical、robots、H1、價格及電話／WhatsApp連結一致，無JavaScript仍可讀取主要內容。四頁390px axe未見違例，沒有水平溢出或收集到JS錯誤。人工開啟正式手機／桌面首屏截圖，確認既有版面。

正式證據：[版本及聯絡資料](seo-ranking-diagnosis-2026-10-18/production-version.json)、[瀏覽器核對](seo-ranking-diagnosis-2026-10-18/production-browser-results.json)。這些檢查不代表Google已採用新資料或排名已提升。
