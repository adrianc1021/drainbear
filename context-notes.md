# 專案關鍵上下文（防壓縮遺失）

## 聯絡資訊（真實號碼，已更新）
- 電話顯示：+852 9558 8260｜tel:+85295588260｜WhatsApp: 85295588260
- 統一由 client/src/lib/contact.ts 管理（PHONE_DISPLAY, PHONE_TEL, WHATSAPP_NUMBER, waLink(), WA_DEFAULT）

## 設計 Token（index.css）
- --navy:#0b132b --navy-light:#1c2541 --wagreen:#25d366 --wagreen-dark:#1eb556 --safety:#ff7a00 --mist:#f4f7fb
- 字體：display=Manrope+Noto Sans TC；圓角 --radius:0.5rem (8px)
- 工具類：.btn-smooth（按鈕過渡+active scale0.97）、.card-float（懸浮陰影）、.float-anim、.fade-up、.text-balance
- 禁 Emoji，只用 lucide SVG 圖標

## 頁面路由（App.tsx）
- / Home｜/services Services｜/areas Areas｜/blog Blog｜/blog/:slug BlogPost｜/faq FAQ
- Layout：Header(fixed, 導航5項+綠色24hr緊急報價鈕)、Footer(4數據列+3地區SEO連結+版權)、MobileCTABar(底部固定 WhatsApp+電話, md:hidden)、WhatsAppWidget(右下懸浮對話框)
- WhatsAppButton 從 @/components/Layout 匯出

## SEO 現狀
- SEO.tsx：title/description/canonical/OG/LocalBusiness(Plumber) JSON-LD，SITE_URL=https://drainbear.manus.space
- FAQ 頁有 FAQPage JSON-LD；Services 有 Service JSON-LD；BlogPost 有 Article JSON-LD
- sitemap.xml 含全部頁面+6篇 blog；robots.txt 已有
- Blog 資料：client/src/lib/blogData.ts（BLOG_POSTS，6篇，slug: prevent-kitchen-sink-clog, why-not-drain-cleaner, toilet-clog-emergency-guide, bathroom-hair-clog-prevention, restaurant-grease-trap-guide, village-house-manhole-rainy-season, old-building-backflow-signs）

## 靜態資產（manus-storage）
- Logo: /manus-storage/drainbear-logo_3d941447.png
- Hero: /manus-storage/hero-plumber_ade9e162.png（若不符請 grep Home.tsx）
- service-residential_f3e50e1c.png, service-commercial_4fc05340.png, service-hydrojet_20c6c68d.png, service-cctv_595f666d.png, why-choose-us（grep Home.tsx）

## 本輪任務（見 todo.md）
1. /guide SEO 著陸頁（通渠收費+服務指南長內容）
2. 全站美化+手機版優化
3. 排名優化模版：Breadcrumb+BreadcrumbList JSON-LD、SEO.tsx 擴充 og:image/keywords、內部連結、lang=zh-HK

## 本輪完成狀態（截圖已驗證 6 頁正常）
1. /guide 已完成：2026 收費參考表、揀公司 4 貼士、4 步流程、18 區覆蓋、收費 FAQ、CTA；FAQPage JSON-LD + 麵包屑；已入導航、Footer、sitemap。
2. 美化完成：reveal 捲動進場（useReveal hook，路由變更重掃）、card-accent 頂邊光條、dot-grid 網點紋理、CTA 收尾深藍高對比、手機按鈕全寬。
3. 排名模版完成：全頁 SEO+keywords+canonical+OG；Services/Areas/FAQ/Blog/BlogPost 有 Breadcrumbs 視覺 + BreadcrumbList JSON-LD；首頁透明報價區加 /guide 內部連結。
- 舊 devserver.log 的 WhatsAppWidget 錯誤為過期日誌，檔案存在且 HMR 正常。
- 待辦：手機版截圖驗證 → 儲存檢查點 → 交付。
