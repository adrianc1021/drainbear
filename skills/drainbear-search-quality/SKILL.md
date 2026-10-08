---
name: drainbear-search-quality
description: 審查通渠熊SEO、AEO與WCAG，連接商家及內容實體並驗證索引、答案和無障礙行為。
---

# SEO、AEO與無障礙

- 每頁獨立title、description、canonical，使用zh-Hant-HK；保留真實HTTP404、noindex轉換頁及有效麵包屑。
- 商家、網站及頁面用穩定@id連接：/#organization、/#website、頁面#webpage。商家型別為Plumber；電話使用同一CMS設定。不要編造地址、評論、認證及固定上門時段。
- 服務頁用Service、FAQPage及BreadcrumbList；ServiceChannel.servicePhone使用ContactPoint。文章和案例保留正式內容及已有日期／作者資料。
- FAQ schema與可見答案使用同一資料來源，包含服務範圍、限制、報價及安全處理的具體答案。不以FAQ schema或llms.txt承諾Google富摘要或AI引用。
- 首頁→客群／服務→地區／收費／流程→FAQ／文章形成有用途的內部連結。避免重複關鍵字牆及沒有當區資料的門頁。
- pnpm build完成CMS路由發現及HTML預渲染，不能因本機網路失敗使用--allow-stale發布。sitemap在dist/public生成並與manifest／HTML canonical和robots驗證；建置不得改寫source sitemap。
- 檢查一個H1、合理標題層級、可操作skip link、可見focus、44px主要觸控目標、鍵盤導覽、手機選單Escape與焦點返回、圖片替代文字、表格th/caption、表單label及錯誤回饋。
- 執行實際操作及axe WCAG2.2 AA檢查。自動檢查通過不等於完整WCAG認證；保留人工檢視的具體結果。
- CMS、資料庫、正式網址或Google存取若缺失，區分本機介面驗證、模擬資料測試與未執行的正式內容／索引檢查。

技能更新：遇到新的真實缺陷，增加可操作的檢查；刪除不適用的臨時限制，保留經驗證的原則。
