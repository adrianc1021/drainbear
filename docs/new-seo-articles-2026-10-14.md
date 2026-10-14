# 三篇新文章與配圖

日期：2026-10-14（香港）。直接發布已獲用戶授權。

| 頁面                                             | 主題與搜尋意圖             | 查詢方向                                         |
| ------------------------------------------------ | -------------------------- | ------------------------------------------------ |
| /blog/toilet-gurgling-sounds-drain-check         | 坐廁咕嚕聲、冒泡與水位異常 | 記錄聲響時機、水位及其他受影響位置，再安排檢查   |
| /blog/tenant-blocked-drain-landlord-arrangements | 租客塞渠、租屋通渠安排     | 通知業主、確認報價聯絡人及進場；不判定法律責任   |
| /blog/home-drain-service-preparation-protection  | 上門通渠前準備、施工保護   | 清出櫃底與入口、交代化學劑及漏水、確認保護和試水 |

坐廁文章補充特定設備的觀察及安全停用問題；現有 `/blog/drain-gurgling-sound-causes` 綜合指南保留。新文章使用已確認的服務用途與限制，沒有虛構公司資料、客戶評價或完工成果。

每篇都有獨立 title、description、H1、正式 canonical、三題 FAQ、正文首頁入口、相關服務／文章及專用 WhatsApp 預填訊息。FAQ 可見答案與 JSON-LD 同源，固定答案錨點可直接開啟。沒有聲稱已獲真人專業審閱。

## 圖片

六張原創 AI 紙藝白熊插圖，每篇封面與內文使用不同畫面。公開圖說及 alt 清楚標示示意用途。

- 封面：1600 × 1000 WebP，另有 960 × 600、640 × 400。
- 文章列表預覽：沿用封面響應式版本，由現有卡片裁切。
- 社交分享預覽：1200 × 630 JPEG，供 Open Graph、Twitter 及 Article.image 使用。
- 內文插圖：1200 × 800 WebP，另有 960 × 640、640 × 427。
- 共 21 個圖片檔；640px 封面約 24–35 KB、內文約 17–22 KB。封面 eager/high、內文 lazy，提供真實尺寸預留空間。

完整尺寸、檔案大小與 SHA-256 見 [圖片清單](new-article-images-2026-10-14.json)。原始生成 PNG 留在工作區，網站發布使用壓縮版本。完整標題、描述、正文、FAQ、圖片 alt／圖說及 WhatsApp 文案見 [全文交付](new-article-copy-2026-10-14.json)。

## 修改檔案

- `client/src/lib/newServiceArticles.ts`：三篇文章的單一資料來源。
- `client/src/lib/blogData.ts`：登記文章，支援內文圖片與獨立分享 metadata。
- `client/src/lib/blogRepository.ts`：保留 static 文章的 metadata。
- `client/src/pages/BlogPost.tsx`：語意化響應式內文 figure 與圖說。
- `client/src/lib/contentConnections.ts`：坐廁及鋅盤服務連回相關新文章。
- `scripts/prerender.ts`：加入三個正式文章路由。
- `scripts/verify-new-seo-articles.mjs`：圖片完整性、metadata、FAQ、連結、列表、版型及查詢交接驗證。
- `client/public/images/blog/`：上述三篇的 21 個圖片版本。

## 驗證

型別檢查通過；既有測試 24 組、136 個通過。完整 Sanity 建置通過，87 個預渲染路由、85 個可索引 URL、39 篇文章、7 個案例；Sitemap／canonical／robots、AEO（163 個可見答案）、SEO 及既有影片驗證通過。

瀏覽器檢查及正式發布結果由 `new-article-validation-2026-10-14.json` 保存。驗證 WhatsApp 交接時攔截外跳，沒有向任何人發訊息。自動無障礙檢查只表示已執行範圍通過，不等於完整認證。

## 後續觀察

保留發布日期，用發布後完整 28 日觀察各文章長尾查詢及首頁「通渠」的香港搜尋曝光、平均排名與點擊，手機／桌面分開。沒有新搜尋量或轉換數據，不能把模型判斷、外跳或搜尋點擊當成客戶查詢，也不保證排名。

若要加入工程相片、客戶引用或法律／渠務專業審閱，仍需真實資料及實際覆核。本次 AI 圖片只作教學示意，文章已可獨立發布。
