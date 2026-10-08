---
name: drainbear-interface
description: 使用語意化React元件與Flexbox/Grid統一通渠熊介面，修正響應式佈局和程式缺陷。
---

# 元件、排版與除錯

- 技術：React、TypeScript、Tailwind、Vite、Express、wouter；先使用現有元件和鎖定依賴。
- 主要樣式來源為 client/src/styles/brand-system.css；全站單一字級、間距、色彩、邊界及圓角規範。不要重新疊加一套改版專用CSS。
- 使用ContactActions、InquiryContactPanel、EditorialPageHero及CustomerPaths。首頁由HomeServiceFinder整合場所與問題入口，避免再疊加相同分類。聯絡資料來自SiteSettingsContext；保留trackCTA及WhatsApp handoff，不能重複送出轉換。
- 公開查詢區必須可用；未驗證接收的表格不顯示為可提交，也不長期展示維護提示。WhatsApp跳轉只能引導傳送，不能聲稱已開啟應用程式、已發訊息或已收到查詢。
- 用main、section、nav、article、figure、ol、table、details等合適語意。互動用button或有有效href的a。
- Grid欄位使用minmax(0,1fr)，Flex子項需min-width:0。中文標題自然換行，不能以overflow:hidden掩蓋文字溢出。
- 320px至1440px驗證，包括手機首屏兩個聯絡按鈕、表格可捲動、固定CTA不遮擋內容、平板導覽不擠壓。
- 提供hover、active、focus-visible；尊重prefers-reduced-motion。裝飾不應持續佔用GPU，或阻擋點擊。
- 地區目錄及頁腳使用共用AnimatedDisclosure（原生details／summary），預設收合。內容和真實連結保留在預渲染HTML，支援原生鍵盤及關閉JavaScript；高度動畫以CSS能力偵測漸進增強，減少動態時立即開合。頁腳導覽後重設收合，地區舊coverage錨點需開啟並捲至對應群組。收起動畫期間以inert即時停用內容，在原生開啟時恢復；驗證完全展開後收起再立即按Tab，不能只測減少動態或開到一半反向的情況。
- 地區搜尋保留所有既有服務頁入口，按批次顯示大量結果；沒有專頁的地點可使用帶入位置的WhatsApp連結，沿用共用handoff，不能以無作用的收合錨點取代查詢。
- 主標題入場動態使用CSS有限次播放；減少動態時仍須完整可見。改動首屏後，量度標題中線、兩個聯絡按鈕的位置，截圖前等候圖片解碼及動畫結束；不能把動畫中途的畫面當成完成版。
- 透明頁首要核對實際背景、文字對比、捲動及選單開啟狀態；不能只看class名稱。skip link平時移出畫面，focus時置於頁首前方，不佔據版面。漸層／圖像背景仍須人工檢視，axe不能代替畫面核查。
- 重現缺陷後修正；檢查資料生命週期、事件移除、計時器和記憶體上限。率限制不可為清理記憶體而任意驅逐仍生效的限制。
- Vite設定可能是函式或Promise，必須解析後才傳入createServer。新增服務／地區時同步shared/publicRoutes.ts並驗證真實HTTP狀態。
- 只對已修改檔案格式化。執行pnpm check、相關測試、pnpm build:app及實際瀏覽器操作；不要把單純HTTP200或空白頁當成通過。

資料庫：先確認DB存取及查詢用途；使用EXPLAIN與代表性資料辨認瓶頸。users.openId已有unique索引、inquiries.id為主鍵；避免重複索引。listInquiries目前無界限，若擴充管理後台，設計穩定游標分頁、(createdAt,id)排序及經驗證的索引；沒有實測不能宣稱SQL效能已改善。正式DB遷移需遵守任務授權及備份要求。
