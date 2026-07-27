# 本輪任務：地區著陸頁 + 工程案例 + 估價計算機

## 1. 地區著陸頁
- [x] 建立 /areas/kwun-tong 觀塘通渠著陸頁（當區內容、SEO、JSON-LD、麵包屑）
- [x] 建立 /areas/sha-tin 沙田通渠著陸頁（當區內容、SEO、JSON-LD、麵包屑）
- [x] Areas 頁地區 Pill 連結至新著陸頁；App.tsx 路由；sitemap.xml 更新

## 2. 首頁工程案例 + Google 評價
- [x] 首頁新增「真實工程案例」區塊（案例卡：問題/方案/結果/地區/工時）
- [x] Google 評價連結與評分展示（注意：不可捏造用戶評價文字，僅展示連結入口，不偽造評論）

## 3. 估價計算機
- [x] /guide 頁加入互動式估價計算機（堵塞位置 × 樓宇類型 × 緊急程度 → 估價範圍 + WhatsApp 預填 CTA）

## 收尾
- [x] TypeScript 檢查 + 截圖驗證（桌面/手機）
- [x] 儲存檢查點並交付（64d53513）

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
- [x] 建立 analytics.ts：gtag 載入（可透過 VITE_GA4_ID 配置，未配置時 dataLayer 佇列）+ trackCTA() 事件函數
- [x] 建立追蹤事件規格：whatsapp_click / phone_click，參數含 location（cta 位置）、page（路徑）、topic
- [x] 為全站所有 WhatsApp/電話按鈕接上追蹤：Header、MobileCTABar、WhatsAppWidget、WhatsAppButton、PriceCalculator、頁內 CTA

## 2. 底部 CTA 列強化
- [x] 「現在有師傅在線」動態綠點（呼吸動畫）取代副標
- [x] 估價計算機結果透過 Context/全域 store 同步至 MobileCTABar 的 WhatsApp 預填訊息

## 3. 額外外觀/UX 優化
- [x] 審視並實施：如 tel: 連結統一、estimate 完成時 CTA 列文案變化、FAQ/導航微調等

## 收尾
- [x] 截圖驗證（桌面+手機）
- [x] 儲存 checkpoint 並交付（f0016cd0）

---

# 第六輪任務：服務地區頁優化 + 感謝頁 + 選單按鈕（上輪已交付 f0016cd0）

- [x] 手機選單按鈕（Layout.tsx ~182 行 hamburger button）點擊範圍加大（用戶視覺編輯要求，未自動套用）
- [x] 審視 Areas.tsx 現狀並全面優化：內容、視覺層次、地區卡片互動、通往觀塘/沙田著陸頁的明顯入口、CTA
- [x] 感謝頁 /thanks：WhatsApp 點擊後跳轉（延遲跳轉不阻擋 WhatsApp 開啟），頁面含 GA4 whatsapp_open 轉化事件 + 後續引導內容
- [x] 全站 WhatsApp CTA 接上跳轉邏輯（集中於 trackCTA 或新 openWhatsApp() helper）
- [x] 截圖驗證（桌面+手機：/areas、/thanks）
- [x] 儲存 checkpoint 並交付（7f854f8e）

---

# 第七輪任務：感謝頁 FAQ + 全站手機按鈕觸控優化 + Wix 說明（上輪已交付 7f854f8e）

- [x] 感謝頁 /thanks 下方加入 FAQ 區塊（服務流程 + 收費標準，可重用 Guide FAQ 資料，手風琴式）
- [x] 全站審查手機版按鈕觸控目標：Header 電話/CTA、Footer 連結、地區 pill、計算機選項、卡片連結等，統一 ≥44px
- [x] 截圖驗證（手機 375px：/、/thanks、/guide、/areas）
- [x] 儲存 checkpoint 並交付，說明 Wix 發佈可行性（不可直接匯入，建議 Manus 發佈 + 自訂網域）

---

# 第八輪任務：回到頂部按鈕 + 按鈕層級（z-index）修正（上輪已交付 66a47202）

- [x] 審查全站 z-index 層級：固定元素（Header z-50、MobileCTABar z-50、WhatsAppWidget）、裝飾層（dot-grid、漸變遮罩、絕對定位圖形）、reveal 動畫層是否遮擋可點元素
- [x] 修正遮擋問題：裝飾層加 pointer-events-none；互動按鈕確保 position/z-index 在其上（relative z-10+）
- [x] 新增懸浮「回到頂部」按鈕：捲動超過一定距離後淡入，點擊平滑捲回頂部；手機版位置避開底部 CTA 列與 WhatsApp 懸浮鈕
- [x] 截圖驗證（手機 375px + 桌面）
- [x] 儲存 checkpoint 並交付（66a47202）

## 追加：資料庫持久化（用戶新要求）
- [x] webdev_add_feature 升級 web-db-user（後端 + 資料庫 + 用戶系統）
- [x] 設計資料表：客戶查詢/估價記錄（estimate_leads：位置/樓宇/時段/估價範圍/來源頁/時間）
- [x] 設計資料表：inquiries 客戶查詢表（稱呼/電話/服務類型/地區/訊息/狀態）
- [x] tRPC 路由：inquiry.submit（公開提交）、inquiry.list / updateStatus（管理員）、estimate.record（公開）、estimate.list（管理員）
- [x] PriceCalculator 完成估價時寫入資料庫（匿名記錄，同一組合去重）
- [x] 驗證資料寫入與讀取正常（SQL 插入/查詢/刪除測試通過）
- [x] vitest 單元測試 12 項全部通過（提交驗證、權限控制、估價記錄）
- [x] 瀏覽器端到端驗證：估價計算機操作後 estimate_leads 成功寫入（坐廁/私樓/$600-1200，測試資料已清除）
- [x] 儲存 checkpoint 並交付

## 補強：第八輪缺口修補（自動審查發現）
- [x] Services.tsx / Home.tsx 裝飾 blur 層補上 pointer-events-none，確保不遮擋互動元素
- [x] Layout.tsx 實作 BackToTop 元件：捲動 >600px 淡入、平滑捲頂、手機 bottom-150px 避開 CTA 列、桌面 bottom-104px
- [x] 截圖驗證（桌面 /guide 全頁 + 手機 375px /、/areas），無遮擋

## 用戶回報：手機版按鈕點擊無反應
- [x] 排查手機版按鈕無法點擊的根因（遮擋層 z-index / pointer-events / 事件綁定）——根因：WhatsAppWidget 外層 fixed 容器在對話卡關閉時攔截右下角大面積點擊
- [x] 修正所有受影響按鈕並全站手機視窗驗證（外層容器 pointer-events-none、按鈕 pointer-events-auto、MobileCTABar 收起補 pointer-events-none；elementFromPoint 全頁掃描通過、12 項 vitest 通過、手機截圖正常）
- [x] 儲存檢查點並交付（7f0d46c2）

---

# 用戶視覺編輯要求：首頁服務卡圖片失效（「找可用圖片」）
- [x] 排查四張服務卡圖片（service-residential / commercial / hydrojet / cctv）載入失敗原因——storage 物件失效（presign 404）
- [x] 找回或重新生成可用圖片，重新上傳並更新 Home.tsx（及其他引用處）——以本地原圖重新上傳，Home.tsx 四張服務卡 + hero 圖 + SEO.tsx OG 圖已更新
- [x] 全站檢查其他 /manus-storage 圖片是否同樣失效並一併修復——全站掃描所有引用均返回 200
- [x] 截圖驗證後儲存檢查點並交付（a4857065；首頁/services/guide/areas 截圖正常，稽核輸出存於 .manus-notes/storage-audit.txt）

---

# 第九輪任務：服務地區頁全面優化（更多熱門地區 + 分區擴充）

- [x] 審視 Areas.tsx、現有著陸頁（觀塘/沙田）與路由/資料結構，規劃可擴充的地區資料架構
- [x] 建立集中式地區資料檔（districtData）：每區含名稱/分區/地標/常見渠務問題/到達時間，支援動態著陸頁（districtData2.ts 批次合併 + DISTRICT_SLUGS 對照）
- [x] 新增 8 個熱門地區著陸頁：旺角、深水埗、銅鑼灣、北角、荃灣、元朗、屯門、將軍澳（動態路由 /areas/:slug，總數達 10 區）
- [x] 擴充三大分區覆蓋清單：港島 24 區、九龍 26 區、新界及離島 28 區，共 78 區（統計帶更新為 78+）
- [x] 熱門地區區塊改為三欄卡片網格（sm:2 / lg:3），每卡含地標 pill 與 CTA
- [x] 分區清單中每個地區 pill 連結至對應著陸頁（DISTRICT_SLUGS 自動對照），統一 ≥44px 觸控目標
- [x] 更新 sitemap.xml（+8 URL 共 23）、路由沿用動態 /areas/:slug、地區搜尋自動涵蓋新地區
- [x] 頁面視覺優化：層次、互動、SEO（title/description/keywords 更新、JSON-LD areaServed 自動擴充、麵包屑沿用）
- [x] 截圖驗證（桌面 + 手機 375px：/areas、/areas/mong-kok、/areas/tsuen-wan、/areas/causeway-bay）+ vitest 12 項通過
- [ ] 儲存檢查點並交付
