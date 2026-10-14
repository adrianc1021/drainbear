# 通渠熊外觀整理與設計工具

日期：2026-10-14。沿用現有品牌與內容，改善首頁及共用介面；本次沒有重新設計全站資訊架構。用戶在本對話已有正式部署授權。

## 安裝與實際使用

| 工具                                                                     | 安裝                                                   | 本次實際用途                                                                    |
| ------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 官方 CLI 2.15.0，專案 `.agents/skills/ui-ux-pro-max/`  | 執行設計系統查詢、React 及焦點可見性查詢，核對網站觸控、對比及響應式要求        |
| [Impeccable](https://github.com/pbakaus/impeccable)                      | 官方 4.5.2，engine 0.1.14；專案 skill，手動檢測模式    | 讀取 context、polish 及 craft-floor 指引，整理版面並執行一次機械檢測，回傳 0 項 |
| [21st MCP／21st UI](https://github.com/21st-dev/magic-mcp)               | 官方 21st UI skill、MCP 設定及官方代理 launcher 已啟用 | 已認證，通過初始化、51 個工具發現、帳戶功能查詢及兩次元件搜尋；AI 生成未開啟    |

三份 SKILL.md、來源與 SHA-256 記錄於 [安裝清單](design-tools-installation-2026-10-14.json)。TypeSafe 既有安裝保留。UI UX Pro Max CLI 附送的其他設計技能留於工作區備份，專案只加入本次要求的主 skill。Impeccable 的系統二進位保留在環境、排除於 Git；launcher 與資料／指引均保留。沒有安裝自動 edit hooks，使用官方支援的手動掃描。

自動設計系統搜尋兩次均提供了不適合繁體中文通渠品牌的英文字體方案，沒有把它寫成網站的權威設計系統，也沒有加入建議中的資格徽章或證書。實際採用已核對的 React 焦點及 UX「Focus Not Obscured」建議，保留現有繁中字體、香港藍色、白熊及 WhatsApp 綠色。這是既有介面的 polish，依照 Impeccable 對 scoped refinement 的指引進行，沒有執行新專案 init 訪談或宣稱已有 PRODUCT.md。

## 外觀改動

- 桌面首頁：標題與查詢入口靠左，白熊及香港插圖呈現在右側；標題上限由 112px 改為 80px，避免文字壓在主體上。
- 手機：首頁仍有完整電話與 WhatsApp 入口，兩行 H1 保留；客群資訊置於標題後，減少段首小標籤。
- Hero 圖片：沿用原圖及響應式版本，保留優先載入。加入適合文字與頁首的分區遮罩；標題只有短距離位移，從一開始即可見，移除圖片入場動畫。
- 查詢入口：統一圓角與圖示形態，移除多層陰影。場所選中狀態改為實心藍底白字，欄位標籤及入口圖片更清楚。
- 方法與公司指南：使用分隔線、留白和開放欄位呈現，減少重複卡片包裹。正文、服務連結及處理限制保留。
- 文章列表：沿用最新三篇的真實尺寸 AI 配圖，統一卡片圓角與 hover 層次。
- 共用細節：加入品牌文字選取色、輸入游標色及焦點捲動留白，保留鍵盤 focus、原生收合及減少動態偏好。

## 實際修改檔案

- `client/src/pages/Home.tsx`
- `client/src/components/HomeServiceFinder.tsx`
- `client/src/components/RecordedCaseGallery.tsx`
- `client/src/components/HomeDrainMethods.tsx`
- `client/src/components/DrainHomeFaq.tsx`
- `client/src/components/HomeCompanyGuides.tsx`
- `client/src/styles/brand-system.css`
- `.agents/skills/{ui-ux-pro-max,impeccable,21st-ui}/`：官方工具資料與指引
- `.codex/config.toml`：21st HTTPS MCP 及環境變數 header 設定
- `.gitignore`：排除本機二進位、Python cache 及瀏覽器臨時輸出

## 驗證及預覽

型別、24 組／136 個測試、完整建置、87 個預渲染路由、85 個 canonical／Sitemap URL、163 個可見 AEO 答案及既有影片檢查均通過。轉換追蹤配置檢查亦通過。

本機真實瀏覽器共 47 次版型／axe 檢查，覆蓋 320、390、768、1024、1199、1200、1440px；包含首頁、服務總覽、CCTV 服務、文章列表、三篇新文章、About 與坐廁影片案例。28 個客群／服務選擇組合、地區保存、未知服務、空地區、手機選單 Escape／焦點返回、WhatsApp 交接與重載及實際影片播放均通過，沒有發送訊息。另核對無 JavaScript 閱讀，以及捲動事件和入場動畫完成後的頁首與區塊可見狀態。

首次即時捲動截圖早於頁首狀態及 observer 更新；補足等候後，頁首變為白底深色文字、方法區正常顯示，沒有因此改寫應用程式。截圖保留的是完成狀態。自動無障礙檢查不等於完整 WCAG 認證。

- [桌面首頁](design-preview-2026-10-14/home-desktop.png)
- [手機首頁](design-preview-2026-10-14/home-mobile.png)
- [驗證結果](design-validation-2026-10-14.json)

首頁 title、description、H1 文案、FAQ 答案、canonical、聯絡電話、服務網址及文章內容保留，沒有新增施工／客戶／到場保證。正式發布驗證另記錄於上述 JSON。

## 21st 連線與憑證設定

用戶提供 key 後已完成認證及搜尋驗證。key 保存在本環境排除 Git 的 `.env.local`，權限為 0600，沒有加入程式碼、文件、公開網站或提交。平台憑證欄位仍未綁定值；本機設定可用，不等於已保存平台 vault 綁定。既有環境草稿已登記 `API_KEY_21ST`，允許目的地為 `21st.dev`。

專案 MCP 現已設為 `enabled = true`。`.agents/skills/21st-ui/scripts/launch.mjs` 先讀取環境的 `API_KEY_21ST`，缺少時讀取本機 `.env.local`，再啟動固定版本的官方 `@21st-dev/magic@0.2.3`。這是官方的 stdio 到 HTTPS 代理，實際端點仍為 `https://21st.dev/api/mcp`。launcher 的標準輸入／輸出完整通過 MCP 初始化、工具發現、`get_usage` 及 `search` 檢查，不需要把 key 放在命令列。Codex 載入專案 MCP 設定後可使用此啟動方式；本對話的驗證透過 workspace MCP client 執行，不冒稱工具已自動加入宿主工具列。

搜尋 `service hero` 及 `service selector` 均返回 3 個元件 metadata。這是連線與搜尋驗證，並非已把六個元件加入網站。帳戶回報免費方案、今日 2 次程式碼讀取額度、AI 生成關閉；沒有呼叫付費生成、升級帳戶或扣除程式碼讀取額度。完整結果見 [21st 驗證紀錄](21st-mcp-validation-2026-10-14.json)。

正式發布核對完成：來源提交 `b2ab04b`，2026-10-14 正式網址共 18 次版型／axe、28 個服務選擇組合、2 次 WhatsApp 交接與重載、2 次真實影片播放及無 JavaScript 閱讀均通過。正式網站直接讀取 Sanity，沒有套用本機 CORS 中繼。其後的 21st 接入只修改 MCP 啟動設定及紀錄，網站外觀與功能保留。
