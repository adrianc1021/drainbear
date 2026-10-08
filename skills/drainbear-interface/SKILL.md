---
name: drainbear-interface
description: 使用語意化React元件與Flexbox/Grid統一通渠熊介面，修正響應式佈局和程式缺陷。
---

# 元件、排版與除錯

- 技術：React、TypeScript、Tailwind、Vite、Express、wouter；先使用現有元件和鎖定依賴。
- 主要樣式來源為 client/src/styles/brand-system.css；全站單一字級、間距、色彩、邊界及圓角規範。不要重新疊加一套改版專用CSS。
- 使用ContactActions、EditorialPageHero、ServiceDirectory及CustomerPaths。聯絡資料來自SiteSettingsContext；保留trackCTA及WhatsApp handoff，不能重複送出轉換。
- 用main、section、nav、article、figure、ol、table、details等合適語意。互動用button或有有效href的a。
- Grid欄位使用minmax(0,1fr)，Flex子項需min-width:0。中文標題自然換行，不能以overflow:hidden掩蓋文字溢出。
- 320px至1440px驗證，包括手機首屏兩個聯絡按鈕、表格可捲動、固定CTA不遮擋內容、平板導覽不擠壓。
- 提供hover、active、focus-visible；尊重prefers-reduced-motion。裝飾不應持續佔用GPU，或阻擋點擊。
- 重現缺陷後修正；檢查資料生命週期、事件移除、計時器和記憶體上限。率限制不可為清理記憶體而任意驅逐仍生效的限制。
- Vite設定可能是函式或Promise，必須解析後才傳入createServer。新增服務／地區時同步shared/publicRoutes.ts並驗證真實HTTP狀態。
- 只對已修改檔案格式化。執行pnpm check、相關測試、pnpm build:app及實際瀏覽器操作；不要把單純HTTP200或空白頁當成通過。

資料庫：先確認DB存取及查詢用途；使用EXPLAIN與代表性資料辨認瓶頸。users.openId已有unique索引、inquiries.id為主鍵；避免重複索引。listInquiries目前無界限，若擴充管理後台，設計穩定游標分頁、(createdAt,id)排序及經驗證的索引；沒有實測不能宣稱SQL效能已改善。正式DB遷移需遵守任務授權及備份要求。
