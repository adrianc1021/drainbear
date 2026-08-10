# 通渠熊 DrainBear — Analytics Event Taxonomy(v1)

統一事件規格。所有事件經 `client/src/lib/analytics.ts` 的 `sendEvent()` 發送,
參數鍵採白名單制,白名單以外的鍵不會被傳送;疑似個人資料(電郵/電話樣式)的
參數值會被整個丟棄。

## 私隱紅線

**絕不傳送**:姓名、電話號碼、電郵、地址、WhatsApp 內容、表格完整內容。
`sendEvent()` 內建 PII 樣式防護(電郵 regex、8 位以上連續數字)。

## 配置

| 變數 | 位置 | 說明 |
|---|---|---|
| `VITE_GA4_MEASUREMENT_ID` | 前端 env(建議) | GA4 Measurement ID(`G-XXXXXXXXXX`) |
| `VITE_GA4_ID` | 前端 env(舊名兼容) | 同上,`VITE_GA4_MEASUREMENT_ID` 優先 |
| `window.__GA4_ID__` | index.html(後備) | 不經 build 注入 ID 的方式 |
| `VITE_GA4_DEBUG` | 前端 env | `"true"` 時開發環境亦上報(帶 `debug_mode`,事件入 GA4 DebugView) |

行為:
- **未設定 GA4 ID**:不載入任何額外腳本,事件推入 `dataLayer` 佇列,網站正常運作。
- **開發環境(`import.meta.env.DEV`)**:預設不上報 GA4,避免污染正式數據。
- **Google Ads Tag `AW-18128738982`**:由 `client/index.html` 載入,**不受本模組影響**;
  GA4 重用同一 gtag.js 及 dataLayer,不會重複載入腳本。

## 事件清單

### 聯絡及轉換事件

| 事件 | 觸發時機 | 參數 | 狀態 |
|---|---|---|---|
| `phone_click` | 電話 CTA 點擊 | cta_location, page_path, page_title | ✅ 已接(全站 8+ 位置) |
| `whatsapp_click` | WhatsApp CTA 點擊 | cta_location, page_path, page_title, topic | ✅ 已接(全站 15+ 位置) |
| `whatsapp_open` | /thanks 頁載入(對話開啟代理轉換) | cta_location(來源位置), page_path | ✅ 已接 |
| `contact_form_start` | 表格開始填寫(每表格一次) | form_name, cta_location | 🟡 helper 已備,前台尚無表格 |
| `contact_form_submit` | 伺服器確認提交成功後 | form_name, cta_location | 🟡 helper 已備 |
| `contact_form_error` | 表格提交失敗 | form_name, error_type(不含錯誤內文) | 🟡 helper 已備 |
| `quote_calculator_start` | 估價計算機首次互動(每頁一次) | cta_location | ✅ 已接 |
| `quote_calculator_complete` | 估價完成(同組合去重) | cta_location, topic(選項摘要) | ✅ 已接 |

### 導航及內容事件

| 事件 | 觸發時機 | 參數 | 狀態 |
|---|---|---|---|
| `navigation_click` | 主導航連結點擊 | cta_location, cta_label, destination_url | ✅ 已接(header / mobile_menu) |
| `blog_post_click` | Blog 文章卡片點擊 | article_slug, cta_location, destination_url | ✅ 已接(blog_featured / blog_grid / blogpost_related) |
| `blog_read` | 捲動 60% 或停留 45 秒(每篇一次) | article_slug, read_percent | ✅ 已接 |
| `area_click` | 地區互動(地圖/搜尋)(原 `map_district_click` 統一命名) | cta_location, area_name | ✅ 已接(areas_map / areas_search) |
| `cta_click` | 一般 CTA 點擊 | cta_location, cta_label, destination_url | 🟡 `trackNavClick("cta", …)` 可用 |
| `service_click` | 服務項目點擊 | service_name, cta_location, destination_url | 🟡 `trackNavClick("service", …)` 可用 |
| `pricing_click` | 收費相關連結點擊 | cta_location, cta_label, destination_url | 🟡 `trackNavClick("pricing", …)` 可用 |
| `page_view` | SPA 路由變更(首次載入由 gtag config 處理) | page_path, page_title, page_location | ✅ 已接(App.tsx PageViewTracker) |

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

## cta_location 位置標籤(現有,沿用)

| 標籤 | 位置 |
|---|---|
| `header` | 桌面 Header WhatsApp 按鈕/導航 |
| `mobile_menu` | 手機選單 |
| `mobile_bar` | 手機底部固定 CTA 列 |
| `floating_widget` | 右下懸浮 WhatsApp 對話框 |
| `footer` | Footer 電話連結 |
| `home_hero` / `home_service_card` / `home_footer_cta` | 首頁 |
| `guide_hero` / `guide_howto` / `guide_footer_cta` | 收費指南 |
| `district_hero` / `district_footer_cta` | 地區專頁 |
| `areas_map` / `areas_map_card` / `areas_search` / `areas_footer_cta` | 服務地區 |
| `services_section` | 服務頁 |
| `faq_cta` / `blog_cta` / `blogpost_cta` | FAQ / Blog CTA |
| `price_calculator` | 估價計算機 |
| `thanks_retry` / `thanks_fallback` | 感謝頁 |
| `blog_featured` / `blog_grid` / `blogpost_related` | Blog 文章卡片 |
| `shared_button` | 共用 WhatsApp 按鈕預設值 |

## 事件命名對照(舊 → 新)

| 舊(第五輪實作) | 新(本 Taxonomy) | 備註 |
|---|---|---|
| `whatsapp_click` | `whatsapp_click` | 不變 |
| `phone_click` | `phone_click` | 不變 |
| `whatsapp_open` | `whatsapp_open` | 不變 |
| `map_district_click` | `area_click` | 統一命名;GA4 未接駁,無歷史數據斷層 |
| — | `page_view`(SPA)、`quote_calculator_*`、`blog_post_click`、`blog_read`、`navigation_click`、`contact_form_*` | 新增 |

計劃書 `button_location` / `button_text` → 沿用現有 `cta_location` / 新增 `cta_label`(已確認決策 4)。
