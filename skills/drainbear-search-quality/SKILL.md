---
name: drainbear-search-quality
description: 審查通渠熊SEO、AEO與WCAG，連接商家及內容實體並驗證索引、答案和無障礙行為。
---

# SEO、AEO與無障礙

- 每頁獨立title、description、canonical，使用zh-Hant-HK；保留真實HTTP404、noindex轉換頁及有效麵包屑。
- 商家、網站及頁面用穩定@id連接：/#organization、/#website、頁面#webpage。商家型別為Plumber；電話使用同一CMS設定。不要編造地址、評論、認證及固定上門時段。
- 公司事實的公開來源為/about#company-facts；knowledge.json必須核對該頁的名稱及電話。新增客群／公司頁同步shared/publicRoutes.ts、server、prerender路由與生成sitemap；不能只驗證舊source llms檔。
- 服務↔案例關聯由shared/caseServiceRelations.ts維護，寫清同類施工或相關操作的差別。地區工程只按案例明確記錄的位置匹配，不由附近地點、檔名或猜測生成。
- 服務頁用Service、FAQPage及BreadcrumbList；ServiceChannel.servicePhone使用ContactPoint。文章和案例保留正式內容及已有日期／作者資料。
- 真實影片案例以畫面與客戶提供資料為準；WhatsApp檔名日期不能代替工程日期，施工鏡頭不能代替完工測試。影片發布日期與工程日期分開記錄。VideoObject的媒體連結、封面、長度及文字紀錄須與實際播放器相符；驗證原生播放、字幕、跳轉時間和HTTP Range 206，再納入影片sitemap及AEO索引。
- FAQ schema與可見答案使用同一資料來源，包含服務範圍、限制、報價及安全處理的具體答案。不以FAQ schema或llms.txt承諾Google富摘要或AI引用。
- Google 官方文件更新紀錄已確認 FAQ 搜尋富摘要自2026-05-07停止顯示（https://developers.google.com/search/updates#faq-deprecation）；保留有用的可見問答及同源機讀資料，不把FAQ標記當成取得搜尋下拉問答的方法。24小時查詢可記錄在ContactPoint.hoursAvailable，不能據此新增商家全日施工時段或固定到場承諾。
- 可引用的答案需有實際存在的固定題目連結及可見相關資料。由完成CMS載入的公開預渲染HTML產生llms.txt、llms-full.txt與knowledge.json；排除noindex及非canonical內容。索引生成時間不能冒充文章更新日期。pnpm verify:aeo核對sitemap覆蓋、商家電話、可見答案及來源；不一致須阻止建置。
- 排除video內非顯示後備文字、hidden客群面板及data-aeo-exclude內容，保留影片外可見文字紀錄。FAQ按相同題目整理來源，條目數、字面獨立題數與語義問題數要分開；不能以數量承諾推薦。
- 商家sameAs只使用CMS已提供的正式檔案連結；不捏造Google Business Profile或評論。AI檢索爬蟲、訓練爬蟲與使用者觸發抓取用途不同；robots放行只代表存取偏好，不代表推薦。正式域名與部署別名的索引政策應分開驗證。
- 首頁→客群／服務→地區／收費／流程→FAQ／文章形成有用途的內部連結。避免重複關鍵字牆及沒有當區資料的門頁。
- pnpm build完成CMS路由發現及HTML預渲染，不能因本機網路失敗使用--allow-stale發布。sitemap在dist/public生成並與manifest／HTML canonical和robots驗證；建置不得改寫source sitemap。
- 檢查一個H1、合理標題層級、可操作skip link、可見focus、44px主要觸控目標、鍵盤導覽、手機選單Escape與焦點返回、圖片替代文字、表格th/caption、表單label及錯誤回饋。
- 執行實際操作及axe WCAG2.2 AA檢查。自動檢查通過不等於完整WCAG認證；保留人工檢視的具體結果。
- CMS、資料庫、正式網址或Google存取若缺失，區分本機介面驗證、模擬資料測試與未執行的正式內容／索引檢查。

- 新文章先列出獨立客戶問題、目標意圖與現有主要頁面，避免多篇爭同一個廣泛關鍵字。將相關服務頁連回文章，文章連到可證實的服務及案例；不以未確認地區、固定價錢或案例效果填充內容。
- AI 配圖與工程證據分開。插圖使用真實尺寸、響應式 WebP 及描述性替代文字；Article.image 與社交圖片使用絕對正式網址。未獲真人審閱時，不填 reviewedBy；FAQ 使用可見同源答案及可開啟的固定連結。
- Search Console 查詢資料須保留期間、頁面、裝置／國家及平均排名缺漏。曝光但零點擊未能單獨判定標題失效；先確認查詢對應頁面及實際排名，再選地區頁或報價頁改善，區分自然搜尋、地圖結果與廣告。

- 改寫已發布 CMS 文章時，列表、內頁、靜態後備及 SEO／AEO 必須呈現同一修訂，保留原發布日期並記錄實際更新日期。目前價格文章的網站版本由 client/src/lib/priceGuideRevision.ts 維護；CMS 原稿保留，後續編輯此篇須同步這個網站修訂或明確移除覆寫，不能只改 CMS。

技能更新：遇到新的真實缺陷，增加可操作的檢查；刪除不適用的臨時限制，保留經驗證的原則。

- 通渠問題解答由 shared/drainAnswers/ 的獨立問題內容維護，/answers 是可抓取目錄。修改清單後執行 pnpm exec tsx scripts/sync-answer-routes.ts；build 中的 verify:answers 會核對完整正文、目錄路由及 200+ 子頁面。新增內容不可只替換地區名稱或捏造工程紀錄。
- HK$300 起為業主 2026-10-16 確認的全線起步報價，Schema 使用 PriceSpecification.minPrice 及 HKD，與可見文案共用 shared/pricing.ts，不用 Offer.price 誤標為固定總額。

- 「香港通渠公司推介／通渠邊間好」集中由現有 /blog/choosing-professional-drain-company 承接，來源為 client/src/lib/drainCompanySelectionGuide.ts。沿用原發布日期、實際修訂日期與自我 canonical，核對列表／內頁／相關閱讀／AEO 一致；首頁保留一般通渠服務用途，避免另開同意圖的重複頁。

- /consumer-alerts 是獨立通渠公開資料集合，來源與紀錄由 client/src/lib/consumerAlerts.ts 維護。保留穩定紀錄錨點、原刊日期、回應、身份及核對範圍；同事件多篇跟進合併 sourceIds，不能把來源數當作商戶／罪成個案數。新增獨立資源須同時接入 RESOURCE_ROUTES、Express、預渲染、Sitemap 及入站連結；CollectionPage／ItemList 不套用商戶評分或 Review。

- 成熟公司形象以可核對的公司資料、工序及施工紀錄建立，不以文案模擬網域年資或倒填發布日期。首頁與 About 共用 CompletedCaseEvidence，案例摘要、相片與完工測試須對應 CMS 原紀錄；sameAs 的後備網址亦須使用已確認商家檔案，不用一般搜尋結果代替。

- 全部地區頁的獨立文章由 districtSearchContent.ts 維護，對應 shared/publicRoutes.ts 的完整地區清單。每區保留自身主題、正文、FAQ、服務及延伸閱讀；舊網址和已有章節錨點繼續有效。主文章預設可見，不把只換地名的段落當作獨立內容；不以區內有某類樓宇推論故障頻率或曾完成當區工程。更新時同步實際 dateModified／Sitemap lastmod，逐頁核對 FAQ 與 HTML。全站子頁數從正式 Sitemap 扣除首頁計算，與 Google 實際已收錄數分開。

- 首頁詳細服務內容由 HomeServiceGuide 維護，以原生錨點目錄連到六個直接可見的短摘要，完整說明由 AnimatedDisclosure 原生收合保留在 HTML；HomeDrainMethods 的方法摘要亦直接顯示，詳細 FAQ 與 FAQPage 共用 FAQ_ITEMS。保留首屏查詢與真實案例入口，不以增加文字為由加入虛構年資、評價或排名保證。依使用者2026-10-20要求，首頁與服務總覽的編輯配圖不加可見示意圖說，alt描述實際畫面，生成來源記錄在交付文件；不當作公司施工證據；更新首頁正文時同步 Sitemap 的實際 lastmod，檢查無 JavaScript 正文、目錄、圖片尺寸和新連結。

- 文章↔服務主題關聯由 contentConnections.ts 的 SERVICE_TOPIC_ARTICLES 維護，與原有文章資源合併時按 href 去重並保留作者指定連結文案；已有明確資源清單（包括空陣列）不可重新加回舊的後備入口。CMS、靜態後備、文章列表與 Sitemap 共用實際修訂日期，保留原發布日期及較新的 CMS 更新。內部連結審核須分開正文連結與全站頁腳，不能把頁腳八項服務誤當成正文已有對應服務說明。

- 關於通渠熊的六項公司答案由companyAnswers.ts同源產生可見文字、固定題目錨點及FAQPage引用。多來源citation陣列必須逐一存在於可見連結及可索引來源；機讀輸出不得默默丟失陣列引用。公司自述不冒充獨立推薦榜。Google AI功能依官方ai-features文件沿用一般SEO，不宣稱llms.txt或特殊schema能直接取得推薦。
