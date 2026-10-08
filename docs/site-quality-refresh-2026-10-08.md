# 通渠熊全站改版與品質驗證

## 本次結果

首頁、服務目錄、八個服務詳情、收費、地區目錄及18個地區頁、FAQ、上門流程、問題診斷、文章、案例及共用頁首／頁尾使用一致的視覺規範。首頁首屏有大電話及WhatsApp入口；主要頁面也保留直接聯絡。沒有部署或改寫遠端CMS。

十二份歷次改版CSS及首頁的重複視覺覆寫已整合為 `client/src/styles/brand-system.css`，保留基礎 `index.css`。移除公開頁面的WebGL背景及重複的承諾、關鍵字矩陣、長版頁尾和重複流程段落。詳情頁仍保留服務限制、報價因素、當區內容、真實文章及案例；收費維持既有參考價格。

共用元件：`ContactActions`、`ServiceDirectory`、`CustomerPaths`、`EditorialPageHero`及既有Layout。電話和WhatsApp來自同一SiteSettings；既有聯絡追蹤和WhatsApp轉交保持使用原有analytics helper。沒有啟用原本停用的詢價表單。

## 品牌與內容

深藍文字／首屏、淺灰背景、WhatsApp綠按鈕、少量深橙標示；共同字級、容器、間距、卡片及focus規則。按鈕有hover、active及focus-visible；尊重reduced-motion。手機先顯示內容和聯絡，表格可橫向捲動，地區列表用原生details整理。

文案縮短標題和段落，以「位置、症狀、方法、收費條件、下一步」組織。刪除部分無法保證的「徹底」說法和無來源的免費條件；不加入到達分鐘數、評論、地址、認證或新價格。24小時為查詢安排，上門時間仍需按實際情況確認。

住宅、食肆及商舖、業主及物業管理三類客群的入口與行銷安排見 [品牌與行銷方案](marketing-review-2026-10-08.md)。競品首頁的實際觀察已採納；完整競品介面及Google榜首尚未核實。

## SEO與AEO

- 使用語意化main／article／header／section／nav、單一H1、標題層級、表格caption／th、搜尋label、skip link及原生FAQ。
- 保留各頁獨立title、description、canonical、Open Graph、zh-Hant-HK及麵包屑。CMS載入期間也立即提供正確的fallback canonical；預渲染仍等待正式CMS內容，不以fallback冒充成功。
- 商家改為Plumber，與WebSite及WebPage透過穩定ID連接。修正ServiceChannel.servicePhone為ContactPoint。
- 八個服務頁增加與可見FAQ使用同一資料的FAQPage；首頁、收費及地區頁的FAQ也保留資料一致性。具體答案、服務範圍和安全建議構成AEO基礎。
- 服務與地區slug由 `shared/publicRoutes.ts`統一，修正開發伺服器把有效服務詳情頁判成404的問題；未知頁保持真正404／noindex。
- sitemap由預渲染輸出到dist；建置不再覆寫source sitemap。驗證生成HTML、canonical、robots和路由manifest一致。更新llms.txt的頁面描述。

上述工作不能保證Google排名、FAQ富摘要或AI引用。正式Search Console、索引和實際搜尋表現尚未驗證。

## 程式與資料庫審查

修正開發伺服器未求值Vite config函式的問題，正常 `pnpm dev`可啟動React及API。預渲染支援 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`；本機唯讀CMS中繼改用Node fetch，遵循Node24環境代理，仍完整傳回上游資料及錯誤。中繼只用於本機建置／驗證，不加入產品請求流程。

詢價限流的IP紀錄原本長期累積。現在以請求觸發清理、10分鐘視窗及最多10,000來源限制控制記憶體；不以淘汰現行紀錄讓限流失效。原有每10分鐘5次提交上限不變。

SQL審查：目前查詢已有users.openId唯一索引及inquiries.id主鍵。管理端listInquiries按createdAt排序且未分頁；若資料量增長，應先用實際開發資料與EXPLAIN確認，再實作穩定的(createdAt,id)游標分頁及匹配索引。DATABASE_URL未配置，所以沒有執行SQL基準或新增猜測性的索引／migration，也不聲稱資料庫效能已改善。

## Skills

目前可用的第三方技能只有cloud-environment-onboarding:setup。使用者列出的Marketing Skills、Humanizer、Writing Guidelines、Skill Creator及五個開發技能沒有已安裝來源；未假裝已調用。

本次建立、讀取並沿用五個通渠熊專案技能：

- [總流程](../skills/drainbear-site-quality/SKILL.md)
- [品牌與行銷](../skills/drainbear-marketing/SKILL.md)
- [自然文字與行文規範](../skills/drainbear-writing/SKILL.md)
- [元件、切版、除錯與SQL審查](../skills/drainbear-interface/SKILL.md)
- [SEO、AEO與無障礙](../skills/drainbear-search-quality/SKILL.md)

它們是版本化的專案技能文件，可供之後任務讀取，不代表已安裝同名第三方插件或已註冊到其他平台。文件已納入本次發現的canonical載入、代理中繼、共享路由及不改source sitemap等檢查。

## 驗證與重跑

執行環境：Node24.19.0、pnpm10.4.1、系統Chromium、Playwright1.62.0；axe-core4.14.0安裝於checkout外的 `/workspace/drainbear-review/tools`。依賴宣告及lockfile沒有增加新套件。

| 驗證                          | 結果／範圍                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| pnpm check                    | 通過                                                                                                            |
| pnpm test                     | 18個檔案、111項測試通過；新增限流、路由及SEO生命週期回歸檢查；詢價測試使用mock DB                               |
| pnpm build（含正式CMS預渲染） | 64條路由；15篇CMS文章、10篇既有本地文章、2個CMS案例；沒有使用allow-stale                                        |
| pnpm verify:sitemap           | 62個可索引網址與manifest／HTML canonical／robots一致                                                            |
| pnpm verify:seo               | 搜尋發現檔案及Vercel fallback設定通過                                                                           |
| pnpm verify:routes            | 10個代表路由的HTTP、標題、canonical及當前導覽狀態通過                                                           |
| pnpm verify:quality           | 52條路由HTTP200、3條未知路由404／noindex；15種版型×5尺寸共75項RWD檢查；31次axe審查零違規                        |
| 實際操作                      | skip link、手機選單焦點及Escape、觀塘搜尋、四步診斷WhatsApp內容、桌面WhatsApp面板焦點及Escape通過；沒有發送訊息 |
| 正常pnpm dev                  | HTTP200服務詳情、React頁面及tRPC health通過                                                                     |

品質檢查尺寸：320、390、768、1024、1440px；檢查橫向溢出、標題及按鈕邊界、首屏聯絡、單一H1、canonical、JSON-LD有效性及FAQ答案一致性。CMS查詢透過唯讀本機中繼取得真實回應，沒有fixture。人工檢視手機及桌面首頁、目錄、收費與地區畫面；自動axe通過不等於完整WCAG認證。

重跑（先有Node24、依賴及可信axe-core安裝）：

```bash
export COREPACK_HOME=/workspace/.cache/corepack
export NODE_USE_ENV_PROXY=1
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
corepack pnpm check
corepack pnpm test
corepack pnpm build
corepack pnpm verify:sitemap
corepack pnpm verify:seo
corepack pnpm verify:routes
AXE_CORE_PATH=/workspace/drainbear-review/tools/node_modules/axe-core/axe.min.js \
SITE_QUALITY_OUTPUT=/workspace/drainbear-review corepack pnpm verify:quality
```

JSON結果、執行記錄和手機／桌面截圖在 `/workspace/drainbear-review`；它們是本機驗證產物。完整競品JavaScript、Google實際排名、正式網站部署／索引、CMS登入編輯、真實SQL和詢價持久化沒有驗證。
