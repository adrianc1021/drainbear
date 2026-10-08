# WhatsApp 品牌圖示

全站 WhatsApp 聯絡入口使用共用 `client/src/components/WhatsAppIcon.tsx`，包括頁首、首屏、手機固定列、頁腳、浮動面板、地區搜尋、問題判斷與查詢接續頁。手機版保留標誌。

圖示來源為 Simple Icons 的 WhatsApp 品牌 SVG：
https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/whatsapp.svg

下載日期：2026-10-08（香港時間）。原始 SVG SHA-256：`8fb209a53a61618c3483594b3e070481a35575d6aaecbe00a6fe386670c8fb1c`。保留來源的完整輪廓與 24 × 24 viewBox，透過 currentColor 配合按鈕文字色；不使用一般對話泡泡代替。素材來源是 Simple Icons，並非從 Meta 官網下載。

SVG 隨網站部署，不需第三方圖示請求或新增套件。標誌為裝飾圖示（aria-hidden），按鈕沿用可讀名稱及既有 WhatsApp 跳轉、查詢接續和點擊追蹤。電話按鈕及一般對話步驟圖示仍按其用途顯示。

已通過 TypeScript、正式建置及 SEO/AEO 檢查。瀏覽器核對 320、390、768、1440px 四種尺寸，涵蓋首頁、服務頁、地區首頁及內頁、食肆頁、問題判斷及查詢接續頁；另驗證手機選單、桌面浮動面板、展開地區、搜尋及 WhatsApp 跳轉。所有 WhatsApp 連結均包含原始品牌輪廓，可見按鈕圖示尺寸正常，各頁無橫向溢出。
