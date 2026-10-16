# 通渠收費爭議報道整理 — 2026-10-16（香港）

更新原有 `/blog/drain-company-reviews-red-flags`，保留網址、自我 canonical、2026-10-11 首次發布日期及實際修訂日期 2026-10-16。沒有增加重複黑名單路由。

## 內容與來源

新標題／H1：**通渠黑店報道整理｜收費爭議、被捕個案與防騙清單**。

新描述：通渠黑店點避？整理香港01三則通渠收費爭議及被捕報道，附原文、日期與消委會資料，睇清臨場加價、聯絡身份及單據要核對甚麼。

原標題：通渠公司黑店點避？報價、口碑與施工紀錄核對清單。
原描述：擔心通渠報價含糊、臨場加項或口碑難核實？由聯絡資料、施工範圍到完工試水，整理選公司前值得問清楚的事項。

| 原始日期 | 已閱讀原文 | 本頁呈現方式 |
| --- | --- | --- |
| 2021-08-05 | [香港01：兩名通渠男子被捕](https://www.hk01.com/突發/659813) | 涉嫌欺詐及刑事恐嚇的拘捕報道；按當時資料寫保釋候查，不寫成定罪。 |
| 2023-01-06 | [香港01：柳俊江報價經歷](https://www.hk01.com/食玩買/854079) | 引述當事人經歷，報價 $750 至 $7,500、最終支付 $1,500；「渠王」不當作公司正式身份。 |
| 2018-11-08 | [香港01：疑似同一人接聽](https://www.hk01.com/熱爆話題/256527) | 標示傳媒轉述網民帖文，不推定公司關係、不補全遮蔽名稱。 |
| 2019-07，513期 | [消委會投訴個案](https://www.consumer.org.hk/tc/article/513-plumbing-service) | 摘要 $1,500 至 $58,000 個案及其他跟進問題，保留 A、B、C 公司匿名性質。 |

這些來源沒有提供足以確認涉事商戶完整身份及定罪結果的資料，本頁沒有把它們改寫成「已證實黑店公司名單」。不由匿名留言辨認同名師傅。沒有聲稱完成全部歷史案件或後續裁決調查。新聞金額清楚屬當年個案，不作本站報價或現時行業價目。

來源 HTTP 200、原標題、出版／更新日期及抓取雜湊見 [sources.json](consumer-reports-2026-10-16/sources.json)。搜尋摘要只作尋找原文，摘要以已讀原文核對。新聞以自行撰寫摘要及原文連結呈現；原有 AI 封面及兩張正文示意圖保留，不作新聞現場證據。

## 實際檔案

- `client/src/lib/drainCompanyReviewsGuide.ts`：四段有來源事件、標題／描述／關鍵字、新增 FAQ；保留防騙清單、兩張正文插圖及返回首頁／服務資料入口。完整公開新增文案見此單一資料檔。
- `client/src/lib/drainCompanySelectionGuide.ts`：原有相關閱讀標籤更新為「通渠黑店相關報道與防騙清單」。
- `client/src/pages/BlogPost.tsx`：外部新聞用原生 `<a>` 開啟，避免 wouter Link 攔截外站導航；內部連結沿用既有路由及追蹤。
- `skills/drainbear-writing/SKILL.md`：保存有來源爭議整理規則。

## 驗證

TypeScript、26 個檔案／142 項現有測試及完整 build 通過。216 個預渲染路由、214 個 Sitemap URL、213 個子頁及 128 個完整答案保持一致；可見 AEO 答案新增至 292。五個真實影片、字幕、schema 及 video sitemap 驗證通過。

本地 Chromium：320、390、768、1024、1440px 五種尺寸，標題、description、H1、canonical、robots、社交標題、發布／更新日期、四項 FAQ 及可見內容一致；圖片解碼、無橫向溢出及 axe 檢查通過。公司推介文章仍有四張正文圖與更新後的相關閱讀；文章目錄的全量可抓取入口使用新標題。原有目錄有分頁，不能要求當前第一頁必定有此文章。

四個新聞／消委會來源逐個實際點擊，攔截目標頁面核對原生外跳成功；原文讀取另外已 HTTP 200。電話 URI 及 WhatsApp handoff 核對正常，沒有撥電話或發送訊息。關閉 JavaScript 仍有四個來源連結、兩張正文圖及可展開 FAQ。

證據：[本地瀏覽器結果](consumer-reports-2026-10-16/local-browser-results.json)、[手機](consumer-reports-2026-10-16/news-section-390.png)、[桌面](consumer-reports-2026-10-16/news-section-1440.png)。限制：未測 Safari／實體手機，不代表 Google 已重新收錄或提升排名。

## 環境

重新連接後 PATH 使用 fallback pnpm 11，首次指令因嘗試重整 modules 且沒有 TTY 而中止。以 Corepack 在 `/workspace/.local/bin` 啟用專案固定 pnpm 10.4.1，沿用現有依賴後檢查通過，沒有修改 package.json 或鎖檔。環境 helper 與 start_skill 草稿已保存啟動方式；草稿儲存不等於環境版本已發布。本次本地伺服器實際使用 4571（4570 已被佔用）。

## 正式發布

提交 `3c322c7` 已推送 main，正式網站已發布。於 2026-10-16 17:57:43 HKT 完成 390／1440px Chromium 覆查：標題／描述／H1、canonical、robots、社交標題、首次發布與修訂日期、四項 FAQ、兩張正文圖及四個來源連結均通過；新聞來源逐個實際外跳驗證，WhatsApp 外跳攔截及電話 URI 正常，沒有發送訊息或撥電話。關閉 JavaScript 保留完整內容、來源及 FAQ；214 個 Sitemap URL 保持一致。公司推介文章的相關閱讀、四張正文圖及全量文章目錄標題亦已核對。沒有收集到 JS 錯誤或 axe 違例，正式手機及桌面截圖已人工開啟確認。

[正式頁面](https://drainbearhk.com/blog/drain-company-reviews-red-flags)、[版本紀錄](consumer-reports-2026-10-16/production-version.json)、[正式瀏覽器結果](consumer-reports-2026-10-16/production-browser-results.json)。正式發布不代表已證實 Google 排名變動。
