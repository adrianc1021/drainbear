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
