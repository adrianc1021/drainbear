# HK$300 起及通渠問題解答擴充

日期：2026-10-16（香港）。用戶已確認「所有通渠服務都以 HK$300 起報價」，並要求直接、有銷售力的文案。保留 B「光影水流」首頁與原有真實施工紀錄。

## 實作

- 全線價格共用 `shared/pricing.ts`。首頁、服務總覽、八個服務頁、報價指南、FAQ、解答頁及全站頁腳顯示起步價；商家 priceRange 和服務 Offer 同步。Schema 記錄 HKD 的 minPrice 300，不標成每宗工程固定總價。
- 新增 `/answers` 目錄及 128 個具體問題的解答頁，八項服務各 16 題。每題有直接答案、觀察重點、下一步、相關服務、首頁和報價入口。全部正文在預渲染 HTML，不依賴點擊才能讀取。
- 首頁、FAQ 及服務詳情加入正文連結；目錄按服務分類提供全部 128 個連結，解答間有相關問題連結。保留現有文章、案例及地區網址。
- TypeSafe Jev（jev-1.13.0）一次並行 Choice 請求協助選出八類服務的優先問題，輸入 6,276 tokens、輸出 2,464 tokens。只影響可逆的入口編排，沒有用模型分數宣稱 SEO 效果或內容已獲專業認證。結果見 [原始選擇](pricing-answers-2026-10-16/jev-navigation-choices.json)。
- 新增發布檢查 `verify:answers`，阻止正文遺漏、路由不一致、錯誤固定價格和子頁數不足。路由快照以 `pnpm exec tsx scripts/sync-answer-routes.ts` 更新，建置不改寫來源清單。

## 主要文案前後

| 位置             | 修改前                                         | 修改後                                                                                                                                    |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 首頁 Title       | 香港通渠公司｜24小時通渠查詢｜通渠熊 DrainBear | 香港通渠公司｜通渠 HK$300 起｜通渠熊 DrainBear                                                                                            |
| 首頁主標題       | 香港通渠，先搵通渠熊。                         | 保留                                                                                                                                      |
| 首頁起步價       | 沒有數字起步價                                 | 全線通渠服務 HK$300 起                                                                                                                    |
| 首頁 Description | 以服務類型、24小時查詢及上門確認為主           | 通渠熊全線通渠服務 HK$300 起！坐廁塞、鋅盤去水慢、浴室淤塞及主渠倒灌，住宅、食肆及物業都可查詢。立即 WhatsApp 傳相報價，24 小時接受查詢。 |
| 報價頁 Title     | 通渠報價查詢｜住宅、食肆及物業資料清單｜通渠熊 | 通渠報價 HK$300 起｜WhatsApp 傳相查詢｜通渠熊                                                                                             |
| 報價頁 H1        | 講清現場情況，先了解點處理。                   | 通渠 HK$300 起，傳相即刻問報價。                                                                                                          |
| 收費文章         | 通渠收費點計？比較價錢先了解工具及施工範圍     | 通渠 HK$300 起｜坐廁、鋅盤及主渠報價指南                                                                                                  |

價格 FAQ：「通渠熊全線通渠服務 HK$300 起報價。坐廁、鋅盤、浴室、主渠、高壓洗渠及 CCTV 照渠，立即 WhatsApp 傳相查詢，安排處理。」

128 題完整文案及所屬服務見 [內容清單 CSV](pricing-answers-2026-10-16/content-inventory.csv)；來源是 `shared/drainAnswers/household.ts` 及 `property.ts`，不是地區名稱組合，也沒有新增虛構案例、評價或資歷。

## 網址及檢查

本機完整建置：216 條路由，214 個可索引網址（包含首頁，因此有 213 個子頁面），較原有 85 個可索引網址增加 129 個。AEO 索引涵蓋 291 條可見答案紀錄。此數目代表網站提供的可索引 URL，不是 Google 已收錄數量。

型別及 25 個測試檔／138 項測試通過。新增解答發布檢查逐頁核對正文、唯一 title、canonical、robots、連結及最低報價 Schema。Sitemap、AEO、五段真實影片校驗及 SEO 檢查通過。

本機瀏覽器驗證 28 組版面（320、390、768、1024、1199、1200、1440px）、128 個實際解答 HTTP 網址、WhatsApp 預填與重試、無 JavaScript 目錄／正文及 axe 全部通過。另有 16 條路由的 metadata／導航一致性，以及五種尺寸的收合、鍵盤、搜尋、分批目錄和原生操作檢查通過。見 [瀏覽器結果](pricing-answers-2026-10-16/local-browser-validation.json) 及 [收合檢查](pricing-answers-2026-10-16/compact-validation.json)。網站程式提交 `2f0ebc9` 已部署；正式域名於 2026-10-16 12:44（香港）驗證通過。390/1440px 共八組版面、全部 128 個解答 HTTP／正文、WhatsApp 預填及重試、無 JavaScript 目錄／答案和 axe 均無問題。實際 Sitemap 有 214 個網址、213 個子頁及 128 個解答頁；首頁與新解答的 HTTP robots 標頭沒有 noindex，robots.txt 沒有禁止解答路徑。證據：[正式站瀏覽器驗證](pricing-answers-2026-10-16/production-browser-validation.json)、[價格與 Sitemap](pricing-answers-2026-10-16/production-sitemap-pricing.json)、[HTTP 索引設定](pricing-answers-2026-10-16/production-indexability.json)。第一輪腳本提早讀取延後載入的 React 畫面，已改成等候實際頁面載入；無 JavaScript 的 CSS 收合測試改用 Node 側量度動畫完成，保留一般動態、原生開合、鍵盤及所有斷言。新增中文標題改用正常斷行，避免問號獨立成行。

## 維護檔案

程式：Home、Services、ServiceDetail、Guide、FAQ、DrainAnswers、SEO、Layout、SiteEditorial、DrainHomeFaq、ServiceAnswerLinks、routePrefetch、App、priceGuideRevision 及兩份現有測試。

路由／內容：`shared/pricing.ts`、`shared/drainAnswers.ts`、`shared/drainAnswers/`、`shared/drainAnswerRoutes.json`、`shared/featuredDrainAnswers.json`、`shared/publicRoutes.ts`、`server/_core/vite.ts`、`scripts/prerender.ts`。其餘是發布檢查、樣式、產品及專案技能文件。沒有新增依賴或改寫鎖定檔。

後續用 Search Console 觀察香港的「通渠」、收費及具體問題詞，分開手機與桌面；以發布後完整 28 日作首次比較。搜尋點擊、WhatsApp 外跳與實際收到客人查詢分開記錄，不預設價格或頁數增加就一定獲 AI 推薦。

正式站批量讀取原先使用 Playwright API 請求，曾遇到無 IPv6 路由；改用 Node 已配置的受信任代理後，128 個實際網址全部通過。瀏覽器互動仍由 Chromium 直接驗證；沒有停用 TLS 或更改網站來迴避檢查。
