# 手機首屏與首頁文字優化 — 2026-10-16（香港）

按用戶新參考圖採用「大字在左、白熊在右、兩個精簡按鈕並排」的手機構圖，沿用通渠熊深藍品牌。只改手機首屏排版；同時保留這輪先完成的首頁解釋文字精簡。

[390px 手機預覽](mobile-hero-2026-10-16/mobile-390.png) · [320px](mobile-hero-2026-10-16/mobile-320.png) · [767px](mobile-hero-2026-10-16/mobile-767.png) · [文字精簡階段](home-focus-2026-10-16.md)

## 完成內容

- 手機首屏 560px 高；保留「香港通渠，先搵通渠熊。」完整文字，窄屏以三行排出層次，寬手機維持兩行。
- 白熊移至右側，保留原始品牌插圖、香港夜景、水流、景深及可暫停動效。圖片框寬限制在 356px，窄屏按版面調整；漸變跟隨真正圖像邊界，保留頭盔與主體，沒有新增圖片或虛構施工證據。
- 起步價由共用來源取得，手機以「全線通渠服務」及「HK$300 起」呈現；沒有改寫價格條件。
- WhatsApp 和電話按鈕同一行、實際約 50px 高；綠色主要按鈕配描邊次要按鈕，保留品牌圖示、清楚名稱、焦點及真實聯絡連結。`compactOnMobile` 只在首頁啟用，原有 tracking、WhatsApp handoff 和重試不變。
- 固定聯絡列在首屏按鈕離開可見範圍後才出現，返回頂部會收起。沒有 JavaScript 時仍有原生聯絡列及首屏、頁腳入口，預渲染沿用 transient `data-enhanced` 重設。
- 手機暫停動效改為 44px 圖示按鈕，保留可讀取的名稱；減少動態偏好停用動效，按鈕標籤與主標仍完整可見。
- 前一階段移除首頁重複提示、影片摘要、三篇指南摘要和 FAQ 引言；方法限制保留在原生收合內。服務、流程、價格、真實工程及相關頁面入口仍可到達。

## 素材庫參考

已透過 21st MCP 搜尋雙欄 Hero 及精簡按鈕組，並查看公開樣例與 shadcn 官方 registry 原碼：

- [Hero with image, text and two buttons — tommyjepsen](https://21st.dev/@tommyjepsen/components/hero-with-image-text-and-two-buttons)：圖文雙欄、主次兩個動作。
- [21st Button Group — shadcn](https://21st.dev/@shadcn/components/button-group) 與 [shadcn 官方 Button Group](https://ui.shadcn.com/docs/components/button-group)：相關動作成組、間距、焦點與狀態。

按現有 ContactActions、CSS 和原生元件整合，沒有新增依賴或使用付費 AI 生成。參考圖的配色沒有套用；品牌原圖、真實影片及標誌保留。

## 桌面保留範圍

手機 Hero 新規則限於 767px 以下。與文案精簡階段比較，1440px 首屏的兩個聯絡按鈕座標完全一致：x=152、寬 340、高 69.59375，頂部位置為 522.015625 及 603.609375。原標題、夜景、白熊、兩個堆疊按鈕及服務對象標記保留。

先前用戶同時要求的全首頁文字精簡適用於桌面及手機，與這次「只改手機首屏排版」分開記錄；沒有聲稱桌面所有文字均未變動。

## 檔案

在文字精簡階段檔案之外，新增修改 `client/src/components/ContactActions.tsx`、`client/src/components/HomeHeroScene.tsx`；手機 Hero 本身在 `client/src/pages/Home.tsx`、`client/src/styles/home.css`；固定聯絡列在 `client/src/components/Layout.tsx`。`scripts/verify-home-mobile.mjs` 增加精簡按鈕、標籤、同排及聯絡列捲動時機的驗證。設計紀錄同步至 DESIGN.md、.impeccable/design.json 及首頁 surface brief。

## 驗證

- 型別檢查、25 個測試檔案／138 個測試通過。
- 完整建置完成 216 個頁面預渲染、214 個 Sitemap 網址、213 個子頁、128 篇完整解答、291 項可見答案及五段原始影片檢查；未使用 stale CMS。
- 手機構圖額外核對 320、390、430、767px，全部沒有全頁水平溢出；按鈕約 50px，同列且文字可見。1440px 桌面首屏座標核對一致。
- 首頁七種尺寸、28 個場所／服務組合、axe、電話連結、WhatsApp 實際跳轉及重試、影片與暫停動效通過。
- 手機聯絡列初始隱藏、捲過首屏動作後顯示、返回頂部隱藏；其他頁面保留正常顯示，桌面及手機診斷資料傳遞通過。
- 原生觸控橫掃及直向捲動、鍵盤、方法限制錨點、無 JavaScript 下的服務連結／影片／案例與方法收合、影片切走暫停和關閉後即時 inert 通過。
- 第一次手機原型在減少動態模式下揭露標籤與換行的 CSS 覆寫問題，已修正並加入可見標籤檢查；獨立審閱指出 320／767px 圖片框邊界，已按同一組尺寸重拍確認修正。
- 證據來自 Chromium 視窗及合成觸控，沒有實體 iPhone／Android 或 Safari 驗證；沒有發出 WhatsApp 訊息。

[首屏幾何與標籤](mobile-hero-2026-10-16/hero-geometry.json) · [手機互動結果](mobile-hero-2026-10-16/mobile-checks.json)

[完整瀏覽器結果](mobile-hero-2026-10-16/browser.json) · [整頁量度](mobile-hero-2026-10-16/page-metrics.json) · [修正後審閱](mobile-hero-2026-10-16/review-verdict.md)

初次獨立審閱提出兩項修正，均已完成；最終結論為修正清單範圍可交付（ship），並非重新完成全頁嚴格樣稿評分。歷史 strict-comp gate 仍未通過，未將其改寫為已通過。
