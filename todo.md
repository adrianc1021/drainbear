# 本輪任務：地區著陸頁 + 工程案例 + 估價計算機

## 1. 地區著陸頁
- [ ] 建立 /areas/kwun-tong 觀塘通渠著陸頁（當區內容、SEO、JSON-LD、麵包屑）
- [ ] 建立 /areas/sha-tin 沙田通渠著陸頁（當區內容、SEO、JSON-LD、麵包屑）
- [ ] Areas 頁地區 Pill 連結至新著陸頁；App.tsx 路由；sitemap.xml 更新

## 2. 首頁工程案例 + Google 評價
- [ ] 首頁新增「真實工程案例」區塊（案例卡：問題/方案/結果/地區/工時）
- [ ] Google 評價連結與評分展示（注意：不可捏造用戶評價文字，僅展示連結入口，不偽造評論）

## 3. 估價計算機
- [ ] /guide 頁加入互動式估價計算機（堵塞位置 × 樓宇類型 × 緊急程度 → 估價範圍 + WhatsApp 預填 CTA）

## 收尾
- [ ] TypeScript 檢查 + 截圖驗證（桌面/手機）
- [ ] 儲存檢查點並交付

---

# 新一輪任務：手機版 UX 優化（上輪三項功能已完成並交付 64d53513）

- [x] 檢視 Layout.tsx 的 MobileCTABar 與 WhatsAppWidget 現有實作及重疊情況
- [x] 底部 CTA 列：WhatsApp 主 CTA（62% 闊、副標）、電話次 CTA、safe-area-inset-bottom、圓角卡片化、active 縮放回饋
- [x] 向下捲動自動收起 CTA 列、向上捲/近頁底重現（減少閱讀遮擋）
- [x] WhatsApp 懸浮按鈕手機版縮細至 48px、改深藍底綠圖標（與綠色 CTA 列區分）、上移至 bottom-86px、停用手機版 ping 動畫
- [x] Footer 後加 68px 佔位 div，內容不被固定 CTA 列遮蓋
- [x] 手機版截圖驗證（/、/guide、/areas/kwun-tong、375px 及 390px）
- [x] 儲存 checkpoint 並交付（53e180d3）

---

# 新一輪任務：GA4 追蹤 + 在線綠點 + 估價同步 + 額外優化

## 1. GA4 點擊追蹤
- [ ] 建立 analytics.ts：gtag 載入（可透過 VITE_GA4_ID 配置，未配置時 dataLayer 佇列）+ trackCTA() 事件函數
- [ ] 建立追蹤事件規格：whatsapp_click / phone_click，參數含 location（cta 位置）、page（路徑）、topic
- [ ] 為全站所有 WhatsApp/電話按鈕接上追蹤：Header、MobileCTABar、WhatsAppWidget、WhatsAppButton、PriceCalculator、頁內 CTA

## 2. 底部 CTA 列強化
- [ ] 「現在有師傅在線」動態綠點（呼吸動畫）取代副標
- [ ] 估價計算機結果透過 Context/全域 store 同步至 MobileCTABar 的 WhatsApp 預填訊息

## 3. 額外外觀/UX 優化
- [ ] 審視並實施：如 tel: 連結統一、estimate 完成時 CTA 列文案變化、FAQ/導航微調等

## 收尾
- [ ] 截圖驗證（桌面+手機）
- [ ] 儲存 checkpoint 並交付
