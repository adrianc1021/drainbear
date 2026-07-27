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

## 新一輪任務（地區頁+案例+計算機）進度
- 已建 client/src/lib/districtData.ts（DISTRICTS: kwun-tong 觀塘、sha-tin 沙田，含 intro/painPoints/landmarks/nearby/faqs/keywords/metaDescription）
- 已建 client/src/pages/District.tsx（/areas/:slug 共用著陸頁：Hero、當區介紹+側欄承諾卡、4 大求助場景、FAQ、鄰近地區 CTA；Service+FAQPage JSON-LD+麵包屑）
- 已加路由 /areas/:slug；Areas 頁觀塘/沙田 Pill 已連結至新頁（DISTRICT_PAGES 對照）
- 待辦：sitemap 加 /areas/kwun-tong /areas/sha-tin；首頁工程案例+Google 評價區塊（不可捏造評論文字，僅放連結入口）；/guide 估價計算機（堵塞位置×樓宇類型×緊急程度→估價範圍+WhatsApp 預填）；截圖驗證+檢查點
- Guide.tsx 結構：收費表區段約在 163-207 行後為插入計算機的理想位置；Home.tsx 服務卡(323-382)與 blog teaser(384-426)之間插入案例區塊
- 已完成：sitemap 加兩地區頁；首頁 CASE_STUDIES 案例區塊+Google 評價入口（連結 google maps 搜尋，無虛構評論）；PriceCalculator.tsx 已建（3 步選擇→估價範圍→WhatsApp 預填）
- 待辦：Guide.tsx 收費表後插入 <PriceCalculator />（import 加入）；截圖驗證（/、/guide、/areas/kwun-tong、/areas/sha-tin、手機版）；檢查點交付
1. /guide 已完成：2026 收費參考表、揀公司 4 貼士、4 步流程、18 區覆蓋、收費 FAQ、CTA；FAQPage JSON-LD + 麵包屑；已入導航、Footer、sitemap。
2. 美化完成：reveal 捲動進場（useReveal hook，路由變更重掃）、card-accent 頂邊光條、dot-grid 網點紋理、CTA 收尾深藍高對比、手機按鈕全寬。
3. 排名模版完成：全頁 SEO+keywords+canonical+OG；Services/Areas/FAQ/Blog/BlogPost 有 Breadcrumbs 視覺 + BreadcrumbList JSON-LD；首頁透明報價區加 /guide 內部連結。
- 舊 devserver.log 的 WhatsAppWidget 錯誤為過期日誌，檔案存在且 HMR 正常。
- 待辦：手機版截圖驗證 → 儲存檢查點 → 交付。

## 第五輪（GA4 + 在線綠點 + 估價同步 + 額外優化）— 進行中
- 前情 checkpoint：64d53513（地區頁/案例/計算機）→ 53e180d3（手機版 UX：CTA 列重構、safe-area、捲動收起、懸浮鈕手機版 48px 深藍底綠圖標）
- 已建立：
  - client/src/lib/analytics.ts：initAnalytics()（GA4 via VITE_GA4_ID 或 window.__GA4_ID__；未配置時事件推 dataLayer 佇列）+ trackCTA(channel, location, topic)，事件名 whatsapp_click / phone_click，參數 cta_location / page_path / topic
  - client/src/contexts/EstimateContext.tsx：EstimateProvider / useEstimate()，EstimateResult{location,building,time,low,high,waMessage}
- 待辦：
  1. main.tsx（或 App.tsx）：initAnalytics()、以 EstimateProvider 包住 App
  2. PriceCalculator.tsx：結果變化時 useEffect setEstimate()；其 WhatsApp 按鈕 trackCTA("whatsapp","price_calculator",摘要)
  3. Layout.tsx MobileCTABar：useEstimate() → 有估價時 WhatsApp href=waLink(estimate.waMessage)、文案「發送估價詳情 HK$low–high」；加「現在有師傅在線」呼吸綠點；兩按鈕 trackCTA("whatsapp"/"phone","mobile_bar")
  4. WhatsAppButton（Layout 匯出）加可選 trackLocation prop 統一上報；Header 綠鈕=header；WhatsAppWidget=floating_widget（topic=所選快速主題）；hero/頁內電話連結 trackCTA("phone",...)
  5. 額外 UX 優化候選：估價完成 toast 提示底部列已同步；District/Guide 頁內 CTA 追蹤
  6. 截圖驗證（桌面+手機 375px）→ checkpoint → 交付
- MobileCTABar 現狀（Layout.tsx）：v2 版本，WhatsApp 主 CTA flex-[1.6]（副標「即時免費・1 分鐘內回覆」）+ 電話次 CTA flex-1，捲動收起邏輯 hidden state，safe-area padding

## 第五輪已完成（Phase 29-30 done）
- App.tsx：initAnalytics() + EstimateProvider 已接入
- 追蹤已接入全部 CTA：Layout（header、mobile_menu、mobile_bar wa+phone、footer phone）、WhatsAppButton trackLocation prop（預設 shared_button）、WhatsAppWidget（floating_widget）、PriceCalculator（price_calculator）、Home（home_hero wa+phone、home_service_card、home_footer_cta）、Guide（guide_hero、guide_howto、guide_footer_cta）、District、Areas、Services、FAQ（faq_cta）、Blog（blog_cta）、BlogPost（blogpost_cta）
- MobileCTABar：estimate 有值時 href=waLink(estimate.waMessage)、標題「發送估價詳情」、副標「已附上估價 HK$X–Y」；無估價時副標「現在有師傅在線・即時回覆」+ animate-ping 白色呼吸點
- PriceCalculator：useEffect setEstimate 同步 + 右側「估價已同步至頁底 WhatsApp 按鈕」綠色提示
- tsc 0 errors；devserver log 中 WhatsAppWidget import 錯誤為 04:24 舊日誌，可忽略

## 剩餘待辦（Phase 31-33）
- Phase 31 額外優化候選：Guide 頁計算機錨點連結（首頁/District 指向 /guide#calculator）、計算機結果變化時 sonner toast、District 頁補充內部連結、檢查手機版 Header 選單 UX
- Phase 32：截圖驗證 desktop + 375px（/、/guide、/areas/kwun-tong）→ webdev_save_checkpoint
- Phase 33：交付，告知 GA4 ID 配置方式（client/index.html window.__GA4_ID__ 或 VITE_GA4_ID env），事件規格 whatsapp_click/phone_click + cta_location/page_path/topic

## 第五輪已全部完成並交付（checkpoint f0016cd0）
- 完成：GA4 追蹤全站、在線綠點、估價同步+toast、/guide#calculator 錨點、Home/District 內部連結、Layout hash 錨點捲動

## 第六輪（進行中）：服務地區頁優化 + 感謝頁 + 選單按鈕
1. 手機 hamburger 按鈕（Layout.tsx Header 內 aria-label="開啟選單"）點擊範圍加大：p-2 → 加大 padding/min-size 44px
2. Areas.tsx 全面優化（需先讀檔審視）：加強觀塘/沙田著陸頁入口卡、地區覆蓋視覺化、CTA
3. /thanks 感謝頁：openWhatsApp() helper（window.open WhatsApp + navigate /thanks?from=location）；/thanks 發 GA4 事件 whatsapp_open（真實對話開啟率代理指標）；頁面內容：確認訊息+等候提示+電話後備+返回首頁/瀏覽 blog
4. 注意：MobileCTABar/WhatsAppButton/WhatsAppWidget/PriceCalculator/各頁 inline <a> 都要改用 helper 或在 onClick 加跳轉

## 第六輪進度（截至 05:56）
- [x] hamburger 按鈕加大至 48px（h-12 w-12）
- [x] Areas.tsx 全面重寫：Hero+地區速查搜尋（過濾 ALL_DISTRICTS，有專頁的顯示「專屬地區頁」連結）、覆蓋統計帶（32+ 分區/1小時/統一價）、DISTRICTS 精選著陸頁卡（用 districtData 的 region/en/heroDesc/landmarks）、三大分區卡加 eta 徽章、dot-grid CTA
- [x] analytics.ts 加 goThanksAfterWhatsApp(location)（600ms 後 pushState /thanks?from=x + popstate）及 trackWhatsAppOpen(from)（whatsapp_open 事件）
- [x] Thanks.tsx 建立（noindex、whatsapp_open 事件、3 步指引、再按一次/電話後備、導流 guide/blog）；SEO.tsx 加 noindex prop；App.tsx 註冊 /thanks 路由
- [x] Layout.tsx WhatsAppButton + MobileCTABar 已接 goThanksAfterWhatsApp
- [ ] 剩餘 inline WhatsApp 錨點接跳轉：District.tsx(hero/footer_cta)、Guide.tsx(283)、Home.tsx(201/408)、Services.tsx(187)、WhatsAppWidget.tsx(77/88)、PriceCalculator.tsx(188)
- [ ] 截圖驗證（/areas 桌面+手機、/thanks）→ checkpoint → 交付

## 第六輪已全部完成並交付（checkpoint 7f854f8e）

## 第七輪（進行中）：感謝頁 FAQ + 手機觸控優化 + Wix 說明
- Thanks.tsx 已加入 FAQ 手風琴區塊（服務流程與收費標準）
- 觸控優化已完成：WhatsAppButton min-h-44、MobileCTABar 按鈕 min-h-52、手機選單項 min-h-48、footer 連結 min-h-44、Areas pill min-h-44、Guide 地區關鍵字 pill min-h-40、PriceCalculator 選項 min-h-48、文字型箭嘴連結（Home/Guide/District/Thanks/BlogPost/Breadcrumbs 共 13 處）min-h-44
- Wix 回答要點：React 程式碼無法直接匯入 Wix；建議 Manus Publish（支援自訂網域，Wix 網域可指向）；或 GitHub 匯出自行部署
- 待辦：tsc 檢查、手機截圖驗證（/、/thanks、/guide、/areas）、checkpoint、交付
