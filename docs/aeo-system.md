# 通渠熊 AEO 系統

本輪把 AI 檢索需要的資料與實際公開頁面連接，目標是讓住宅、食肆、商舖及物業管理的問題更容易找到適合的答案。系統不控制平台的推薦結果；robots 放行、schema 或 llms.txt 也不是推薦保證。

## 已實作的五層

| 層次           | 實作                                                                                       | 維護方式                                                                |
| -------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| 直接答案       | `/faq` 有15題答案、固定題目連結、可見相關資料及更新日期；服務頁保留適用情況、限制與各自FAQ | 同一份內容產生畫面及FAQ schema；修改答案時同步檢視來源                  |
| 商家與服務實體 | Plumber、WebSite、WebPage、ContactPoint、OfferCatalog、Service及Article使用穩定ID互相連接  | 電話、WhatsApp和正式檔案連結來自CMS；不新增假地址、評論或認證           |
| 可擷取內容     | 預渲染HTML、canonical、sitemap、robots以及真實HTTP404                                      | 公開搜尋及AI檢索可讀取；感謝與404頁noindex，API不供爬蟲索引             |
| AI資料索引     | 建置產生 `/llms.txt`、`/llms-full.txt`、`/knowledge.json`                                  | 只使用本次已完成CMS載入的公開HTML；文字、答案、日期和schema沿用原頁資料 |
| 品質與監測     | `pnpm build` 自動執行AEO、sitemap及搜尋配置核查；既有詢盤追蹤保留referrer來源              | 發布後檢查來源、詢盤及實際AI引用；不把爬蟲請求或聯絡點擊當成交          |

## 內容與需求的對應

| 客戶問題                     | 主要答案與深入資料                                         |
| ---------------------------- | ---------------------------------------------------------- |
| 塞廁所、沖水水位升高         | `/services/toilet-unblocking`、`/faq#pricing`              |
| 鋅盤去水慢或浴室積水         | 對應鋅盤／浴室服務頁、`/drain-diagnosis`                   |
| 污水倒灌、多個位置同時受影響 | `/faq#backflow-safety`、污水倒灌及主渠服務頁               |
| 食肆隔油池或商舖渠務         | 隔油池服務頁、`/faq#restaurant-property`                   |
| 物業主渠、沙井或反覆淤塞     | 主渠、高壓洗渠及CCTV服務頁、正式工程案例                   |
| 深夜查詢、特定地區安排       | `/faq#night-enquiries`、`/faq#service-areas`、18個地區專頁 |
| 收費、上門檢查及新增工序     | `/guide`、`/service-process`及FAQ收費條件                  |

這些入口回答不同的實際需要，沒有新增批量地區門頁或重複的答案頁。

## 建置資料流

`CMS及頁面內容 → 預渲染完整HTML → 篩選indexable canonical頁面 → 可見答案及來源核對 → AI索引 → sitemap覆蓋核對`

- `scripts/aeo-artifacts.ts`抽取商家、可見正文、FAQ及結構化資料，不從CMS管理欄位匯出私有內容。
- 排除noindex、非canonical及重複canonical頁面。電話與首頁不一致、schema答案不在正文、題目anchor不存在或引用未在頁面顯示，都會令建置失敗。
- `knowledge.json.generatedAt`是建置時間；`pages[].modifiedAt`只沿用頁面原有日期，不把每次build冒充所有文章更新。
- `llms-full.txt`包含公開正文與答案；`llms.txt`是指向正式頁面的索引。兩者是輔助入口，預渲染HTML仍是主要來源。
- 修改CMS後須重新建置與部署，才能更新静態頁面與索引。
- Vercel部署別名及Render預設域名設noindex；正式自訂域名保持可索引。robots是爬蟲偏好，API存取仍由原有伺服器驗證處理。

## 驗證與營運

本輪建置包含64頁、62個可索引來源及102個可見FAQ答案。19個測試檔案／114项測試通過；52條路由、75組響應式檢查及31次axe審查通過。另檢查FAQ固定連結能直接展開答案，以及圖示卡片和手機首屏兩個聯絡入口。

每次發布執行 `pnpm check`、`pnpm test`、`pnpm build`、`pnpm verify:routes`及必要的瀏覽器檢查。發布後核對正式域名上的FAQ、robots、sitemap及三個AI資料端點，並核對電話、canonical和noindex頁。

後續以既有GA4的來源／媒介及詢盤事件觀察ChatGPT、Perplexity、Claude、Gemini等來源；`trackingSession.ts`會保存外部referrer hostname及UTM歸因，轉交WhatsApp時沿用同一歸因。部分AI應用不傳referrer，因此不能用referral流量推算所有AI推薦。GA4後台、Search Console、Bing Webmaster Tools及Google Business Profile的設定和帳戶資料，這次沒有登入操作。

每月檢视代表性問題在不同AI平台的實際結果，記錄平台、查詢、日期、是否提及通渠熊、引用網址、電話及服務條件是否正確；分開記錄品牌提及、引用、網站訪問、聯絡與成交。用真實工程資料和客戶常問問題補充內容，避免為AI寫沒有依據的排名或承諾。

## 參考入口

- Google Search Central：[AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- OpenAI：[爬蟲用途](https://platform.openai.com/docs/bots)
- Anthropic：[爬蟲與robots說明](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- Perplexity：[Bots](https://docs.perplexity.ai/guides/bots)

本輪雲端網絡代理未允許讀取上述文档，沒有將它們描述為已即時核實。爬蟲名稱與技術文件若有更新，應以平台最新說明再核對；公開預渲染HTML、預設公開爬蟲規則和來源驗證仍可獨立運作。
