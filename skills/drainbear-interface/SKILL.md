---
name: drainbear-interface
description: 使用語意化React元件與Flexbox/Grid統一通渠熊介面，修正響應式佈局和程式缺陷。
---

# 元件、排版與除錯

- 技術：React、TypeScript、Tailwind、Vite、Express、wouter；先使用現有元件和鎖定依賴。
- 主要樣式來源為 client/src/styles/brand-system.css；全站單一字級、間距、色彩、邊界及圓角規範。不要重新疊加一套改版專用CSS。
- WhatsApp相關按鈕一律使用共用WhatsAppIcon的真實品牌輪廓，包括浮動面板的主題、地區及頁腳。不要以一般MessageCircle代替，也不要在手機隱藏WhatsApp標誌。純電話或一般對話步驟圖示保持各自用途。
- 使用ContactActions、InquiryContactPanel、EditorialPageHero及CustomerPaths。首頁由HomeServiceFinder整合場所與問題入口，避免再疊加相同分類。聯絡資料來自SiteSettingsContext；保留trackCTA及WhatsApp handoff，不能重複送出轉換。
- 首頁第二段是同一個HomeServiceFinder快速查詢，先選場所、相關服務及可選地區，再帶入WhatsApp；未知問題須可選「未確定」。AI服務圖示隨選項更新，完整圖片入口可原生收合。三類場所各自保留選取，地區跨分類保留；不得在另一段重複整套查詢。核對全部服務、未確定、空白地區及分類切換的預填內容。
- 公開查詢區必須可用；未驗證接收的表格不顯示為可提交，也不長期展示維護提示。WhatsApp跳轉只能引導傳送，不能聲稱已開啟應用程式、已發訊息或已收到查詢。
- 用main、section、nav、article、figure、ol、table、details等合適語意。互動用button或有有效href的a。
- 圖片優先的服務入口使用ServicePhoto與serviceVisuals，一張圖片、一個短標題及一句症狀摘要。首頁服務選擇區使用ServiceIllustration的乾淨AI紙藝插圖，住宅、食肆及物業所有選項都不能混入施工照片或污水近鏡；核對三個分類切換及八款服務對應場景。首頁按「首屏→服務選擇→真實案例→上門安排」引導；上門安排使用AI紙藝白熊流程插圖，圖片描述清楚說明示意用途；縮略圖可按版型裁切，案例完整影片和證據說明仍可開啟。不可用圖片或固定高度裁掉重要文字。
- 詳細症狀、成因、流程、資料清單及FAQ可使用AnimatedDisclosure預設收合；答案及連結保留在HTML，FAQ與JSON-LD一致。直接答案錨點需自動展開相應內容，亦核對hash變更、原生鍵盤及無JavaScript操作。CMS照片必須來自已發布紀錄，等待data-cms-loading完成並確認圖片成功解碼，不能用空色塊當成已展示照片。
- Grid欄位使用minmax(0,1fr)，Flex子項需min-width:0。中文標題自然換行，不能以overflow:hidden掩蓋文字溢出。
- 320px至1440px驗證，包括手機首屏兩個聯絡按鈕、表格可捲動、固定CTA不遮擋內容、平板導覽不擠壓。
- 提供hover、active、focus-visible；尊重prefers-reduced-motion。裝飾不應持續佔用GPU，或阻擋點擊。
- 地區目錄及頁腳使用共用AnimatedDisclosure（原生details／summary），預設收合。內容和真實連結保留在預渲染HTML，支援原生鍵盤及關閉JavaScript；高度動畫以CSS能力偵測漸進增強，減少動態時立即開合。頁腳導覽後重設收合，地區舊coverage錨點需開啟並捲至對應群組。收合按下時以inert即時停用內容，不能只依賴稍後執行的原生toggle事件；用toggle同步程式開合，CSS interactivity支援的瀏覽器在無JavaScript下亦即時停用關閉內容；驗證完全展開後收起再立即按Tab，不能只測減少動態或開到一半反向的情況。
- 地區搜尋保留所有既有服務頁入口，按批次顯示大量結果；沒有專頁的地點可使用帶入位置的WhatsApp連結，沿用共用handoff，不能以無作用的收合錨點取代查詢。
- 主標題入場動態使用CSS有限次播放；減少動態時仍須完整可見。改動首屏後，量度標題中線、兩個聯絡按鈕的位置，截圖前等候圖片解碼及動畫結束；不能把動畫中途的畫面當成完成版。
- 透明頁首要核對實際背景、文字對比、捲動及選單開啟狀態；不能只看class名稱。skip link平時移出畫面，focus時置於頁首前方，不佔據版面。漸層／圖像背景仍須人工檢視，axe不能代替畫面核查。
- 重現缺陷後修正；檢查資料生命週期、事件移除、計時器和記憶體上限。率限制不可為清理記憶體而任意驅逐仍生效的限制。
- Vite設定可能是函式或Promise，必須解析後才傳入createServer。新增服務／地區時同步shared/publicRoutes.ts並驗證真實HTTP狀態。
- 只對已修改檔案格式化。執行pnpm check、相關測試、pnpm build:app及實際瀏覽器操作；不要把單純HTTP200或空白頁當成通過。

資料庫：先確認DB存取及查詢用途；使用EXPLAIN與代表性資料辨認瓶頸。users.openId已有unique索引、inquiries.id為主鍵；避免重複索引。listInquiries目前無界限，若擴充管理後台，設計穩定游標分頁、(createdAt,id)排序及經驗證的索引；沒有實測不能宣稱SQL效能已改善。正式DB遷移需遵守任務授權及備份要求。
