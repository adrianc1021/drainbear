# 通渠熊 DrainBear — Analytics Event Taxonomy(v1)

統一事件規格。所有事件經 `client/src/lib/analytics.ts` 的 `sendEvent()` 發送,
參數鍵採白名單制,白名單以外的鍵不會被傳送;疑似個人資料(電郵/電話樣式)的
參數值會被整個丟棄。

## 私隱紅線

**絕不傳送**:姓名、電話號碼、電郵、地址、WhatsApp 內容、表格完整內容。
`sendEvent()` 內建 PII 樣式防護(電郵 regex、8 位以上連續數字)。

## 配置

| 變數                | 位置                 | 說明                                                            |
| ------------------- | -------------------- | --------------------------------------------------------------- |
| `window.__GA4_ID__` | 開發環境 window 設定 | 僅供本地除錯時暫時覆寫，不參與正式建置                          |
| `VITE_GA4_DEBUG`    | 前端 env             | `"true"` 時開發環境亦上報(帶 `debug_mode`,事件入 GA4 DebugView) |

行為:

- **正式預設資料串流**:網站內建 `G-05DW80HCTS`，首次頁面瀏覽會立即開始載入
  Google tag。正式網域固定使用此 Property；任何 Render build environment 都不會覆寫它。
  開發環境使用 `window.__GA4_ID__` 時，格式錯誤的非空覆寫值會
  停止 GA4 初始化，網站仍正常運作。此情況下事件只推入當前頁面的 `dataLayer`，
  **僅作除錯/相容用途**——`dataLayer` 只存在於當前頁面的記憶體，**不會永久儲存**，
  亦**不能補回 GA4 安裝前的歷史數據**。Preview／開發環境仍預設不上報。
- **ID 格式驗證**:只接受合法 `G-` 格式(`isValidGa4Id()`)。值存在但格式錯誤時
  不初始化 GA4、不呼叫 `gtag('config', …)`,開發環境顯示不含該值的警告,網站照常運作。
- **開發環境(`import.meta.env.DEV`)**:預設不上報 GA4,避免污染正式數據。
- **事件目的地隔離**:GA4 啟用時,`sendEvent()` 及 `trackPageView()` 均帶
  `send_to: <GA4 Measurement ID>`,自訂事件只送 GA4,不會流向 Google Ads Destination。
- **避免 `Unassigned`**:首次手動 `page_view` 保留經安全過濾的 UTM／Google Ads
  click ID，並以 GA4 標準 `campaign_source`、`campaign_medium`、`campaign_name`
  欄位送出。`gclid`、`dclid`、`gbraid`、`wbraid` 存在時以 Google Ads 自動標記
  優先，不讓錯誤 UTM 覆寫付費流量歸因。未知網址參數不會進入 `page_location`。
- **工作階段來源**:所有自訂互動及轉化事件自動附帶首次著陸的
  `traffic_source`、`traffic_medium`、`campaign_name`、`landing_page`、
  `click_id_type`，方便以自訂維度核對內建管道群組。
- **Google Ads Tag `AW-18128738982`**:由 `client/index.html` 先排入 dataLayer;
  外部 `gtag.js` 於首次頁面瀏覽立即載入；GA4 與 Ads 重用同一 gtag.js 及
  dataLayer，不會重複載入腳本。
- **Google Ads conversion**:WhatsApp CTA 直接送往
  `AW-18128738982/CSxUCPrKmOQcEKa1usRD`；電話及表格 conversion label 以
  `VITE_GOOGLE_ADS_PHONE_LABEL`／`VITE_GOOGLE_ADS_FORM_LABEL` 可選配置。

## 去重責任劃分

`analytics.ts` 為**純事件發送 Helper**,不保存「每次瀏覽一次」的去重狀態。
每頁/每篇一次的去重由 Component 生命週期管理:

- **估價計算機**(`PriceCalculator.tsx`):以 `useRef` 持有 `createPerViewDedup()`
  (`client/src/lib/perViewDedup.ts`)實例——每次 Mount 一個新實例。
  同一次頁面瀏覽中 `quote_calculator_start` 只記一次、同一組合的
  `quote_calculator_complete` 只記一次(A→B→A 時 A 不再記錄);
  離開頁面再返回(重新 Mount)可重新記錄。
- **Blog 閱讀**(`BlogPost.tsx`):以 `createBlogReadTracker()`
  (`client/src/lib/blogReadTracker.ts`)管理,每次文章瀏覽一個實例,
  unmount 時 `dispose()`;成功記錄後立即清除 Timer 及 Scroll Listener,
  45 秒 Timer 觸發前檢查分頁可見;同一次瀏覽只記一次,返回同一文章可重新記錄。

## 事件清單

### 聯絡及轉換事件

| 事件                        | 觸發時機                                            | 參數                                              | 狀態                              |
| --------------------------- | --------------------------------------------------- | ------------------------------------------------- | --------------------------------- |
| `phone_click`               | 電話 CTA 點擊                                       | cta_location, page_path, page_title               | ✅ 已接(全站 8+ 位置)             |
| `whatsapp_click`            | WhatsApp CTA 點擊                                   | cta_location, page_path, page_title, topic        | ✅ 已接(全站 15+ 位置)            |
| `whatsapp_handoff`          | 點擊後成功建立一次性 WhatsApp handoff               | cta_location, page_path, 首次來源摘要              | ✅ 已接(`/thanks` 一次性消耗)     |
| `whatsapp_open`             | /thanks 頁載入(對話開啟代理轉換)                    | cta_location(來源位置), page_path                 | ✅ 已接                           |
| `contact_form_start`        | 表格開始填寫(每表格一次)                            | form_name, cta_location                           | ✅ 已接(首頁、指南、服務及案例頁) |
| `contact_form_submit`       | 伺服器確認提交成功後                                | form_name, cta_location                           | ✅ 已接                           |
| `contact_form_error`        | 表格提交失敗                                        | form_name, error_type(不含錯誤內文), cta_location | ✅ 已接                           |
| `quote_calculator_start`    | 估價計算機首次互動(每次頁面瀏覽一次,Component 去重) | cta_location                                      | ✅ 已接                           |
| `quote_calculator_complete` | 估價完成(每次頁面瀏覽同組合一次,Component 去重)     | cta_location, topic(選項摘要)                     | ✅ 已接                           |

### 導航及內容事件

| 事件               | 觸發時機                                                         | 參數                                                                                  | 狀態                                                  |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `navigation_click` | 主導航連結點擊                                                   | cta_location, cta_label, destination_url                                              | ✅ 已接(header / mobile_menu)                         |
| `blog_post_click`  | Blog 文章卡片點擊                                                | article_slug, cta_location, destination_url                                           | ✅ 已接(blog_featured / blog_grid / blogpost_related) |
| `blog_read`        | 捲動 60% 或停留 45 秒且分頁可見(每次文章瀏覽一次,Component 去重) | article_slug, read_percent                                                            | ✅ 已接                                               |
| `area_click`       | 地區互動(地圖/搜尋)(原 `map_district_click` 統一命名)            | cta_location, area_name                                                               | ✅ 已接(areas_map / areas_search)                     |
| `cta_click`        | 一般 CTA 點擊                                                    | cta_location, cta_label, destination_url                                              | 🟡 `trackNavClick("cta", …)` 可用                     |
| `service_click`    | 服務項目點擊                                                     | service_name, cta_location, destination_url                                           | 🟡 `trackNavClick("service", …)` 可用                 |
| `pricing_click`    | 收費相關連結點擊                                                 | cta_location, cta_label, destination_url                                              | 🟡 `trackNavClick("pricing", …)` 可用                 |
| `page_view`        | 首次載入及 SPA 路由變更（由 App.tsx PageViewTracker 手動發送）   | page_path, page_title, page_location, campaign_source, campaign_medium, campaign_name | ✅ 已接(App.tsx PageViewTracker)                      |

### GA4 Admin 對應設定

網站程式已送出事件及來源摘要；GA4 後台仍須完成以下設定，否則資料雖然已到達，報表未必能按來源及漏斗閱讀：

1. 在 **管理 → 資料顯示 → 自訂定義** 建立事件範圍自訂維度：
   `traffic_source`、`traffic_medium`、`campaign_name`、`landing_page`、
   `click_id_type`、`cta_location` 及 `topic`。
2. 將以下事件標記為 Key event：
   `whatsapp_handoff`、`contact_form_submit`；如電話接通資料未有外部回傳，
   可先將 `phone_click` 作為輔助 Key event，但不要將它當作已接通的證明。
3. `whatsapp_click`、`quote_calculator_start` 及
   `quote_calculator_complete` 用作漏斗分析，不應全部標記為主要轉化，
   以免把尚未產生查詢的互動計入業績轉化。
4. 建立自訂渠道群組時，優先使用 GA4 內建 Google Ads 歸因；手動渠道按
   `utm_medium=cpc`、`paid_social`、`email`、`social`、`referral` 及 `display`
   分類。不要以 `button`、`hero` 或 `article` 作渠道媒介。

這些設定不能改寫歷史 `Unassigned`，但可確保新資料具備可用的渠道、CTA 及
轉化漏斗欄位。

## 通用參數(白名單)

```
cta_location    CTA 位置標籤(見下)
cta_label       按鈕/連結文字
page_path       頁面路徑(自動補上)
page_title      頁面標題(自動補上)
destination_url 目的地連結
service_name    服務名稱
area_name       地區名稱
article_slug    文章 slug
topic           查詢主題/選項摘要(不含個人資料)
form_name       表格識別名
error_type      錯誤類型(不含錯誤內文)
read_percent    閱讀捲動百分比
```

## UTM 命名規則

`utm_medium` 必須描述**渠道類型**，版位、按鈕或素材名稱應放在 `utm_content`。
以下格式符合 GA4 預設管道群組，並可減少 `Unassigned`：

| 渠道           | `utm_source`             | `utm_medium`  | 範例                                          |
| -------------- | ------------------------ | ------------- | --------------------------------------------- |
| Google Ads     | 不需手動 UTM             | 不需手動 UTM  | 保持 Google Ads Auto-tagging，使用 `gclid`    |
| 手動付費搜尋   | `google` / `bing`        | `cpc`         | `utm_source=google&utm_medium=cpc`            |
| Facebook 廣告  | `facebook`               | `paid_social` | `utm_source=facebook&utm_medium=paid_social`  |
| Instagram 廣告 | `instagram`              | `paid_social` | `utm_source=instagram&utm_medium=paid_social` |
| 電郵           | `newsletter`             | `email`       | `utm_source=newsletter&utm_medium=email`      |
| 自然社交帖文   | `facebook` / `instagram` | `social`      | `utm_source=facebook&utm_medium=social`       |
| 合作網站       | 合作方網域或名稱         | `referral`    | `utm_source=partner&utm_medium=referral`      |
| 展示廣告       | 平台名稱                 | `display`     | `utm_source=google&utm_medium=display`        |

禁止把 `home_banner`、`article`、`button`、`hero` 或代理商名稱放入
`utm_medium`。這些值應放在 `utm_content`，例如：

```text
?utm_source=facebook&utm_medium=paid_social&utm_campaign=emergency_drain&utm_content=home_banner
```

網站會把常見舊別名（例如 `meta_ads`、`paid-social`、`newsletter`）正規化，
但廣告平台上的最終網址仍應按以上規則設定。歷史 `Unassigned` 不會被網站程式
改寫；如需重新整理歷史數據，須在 GA4 Admin 建立 Custom channel group，按現有
Source／Medium 值加入相應渠道。

## cta_location 位置標籤(現有,沿用)

| 標籤                                                                 | 位置                           |
| -------------------------------------------------------------------- | ------------------------------ |
| `header`                                                             | 桌面 Header WhatsApp 按鈕/導航 |
| `mobile_menu`                                                        | 手機選單                       |
| `mobile_bar`                                                         | 手機底部固定 CTA 列            |
| `floating_widget`                                                    | 右下懸浮 WhatsApp 對話框       |
| `footer`                                                             | Footer 電話連結                |
| `home_hero` / `home_service_card` / `home_footer_cta`                | 首頁                           |
| `guide_hero` / `guide_howto` / `guide_footer_cta`                    | 收費指南                       |
| `district_hero` / `district_footer_cta`                              | 地區專頁                       |
| `areas_map` / `areas_map_card` / `areas_search` / `areas_footer_cta` | 服務地區                       |
| `services_section`                                                   | 服務頁                         |
| `faq_cta` / `blog_cta` / `blogpost_cta`                              | FAQ / Blog CTA                 |
| `price_calculator`                                                   | 估價計算機                     |
| `thanks_retry` / `thanks_fallback`                                   | 感謝頁                         |
| `blog_featured` / `blog_grid` / `blogpost_related`                   | Blog 文章卡片                  |
| `shared_button`                                                      | 共用 WhatsApp 按鈕預設值       |

## 事件命名對照(舊 → 新)

| 舊(第五輪實作)       | 新(本 Taxonomy)                                                                                              | 備註                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `whatsapp_click`     | `whatsapp_click`                                                                                             | 不變                               |
| `phone_click`        | `phone_click`                                                                                                | 不變                               |
| `whatsapp_open`      | `whatsapp_open`                                                                                              | 不變                               |
| `map_district_click` | `area_click`                                                                                                 | 統一命名;GA4 未接駁,無歷史數據斷層 |
| —                    | `page_view`(SPA)、`quote_calculator_*`、`blog_post_click`、`blog_read`、`navigation_click`、`contact_form_*` | 新增                               |

計劃書 `button_location` / `button_text` → 沿用現有 `cta_location` / 新增 `cta_label`(已確認決策 4)。
