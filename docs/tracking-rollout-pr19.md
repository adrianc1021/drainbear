# PR #19 — Conversion & Attribution Tracking

## Production IDs

- GA4 Measurement ID: `G-05DW80HCTS`
- Google Ads Destination: `AW-18128738982`

以上 ID 為公開 Tracking ID，不屬於 Secret。

## Event funnel

1. `page_view`
2. `quote_calculator_start`
3. `quote_calculator_complete`
4. `whatsapp_click` / `phone_click`
5. `whatsapp_handoff`
6. `generate_lead`（日後後台確認）
7. `qualified_lead`（日後 CRM／人手確認）
8. `job_booked`（日後 CRM／人手確認）

`whatsapp_handoff` 只代表一次有效 WhatsApp 外跳流程，不代表訊息已發送。
Ads conversion 會在 WhatsApp CTA 點擊當下送出，`/thanks` handoff 只作 GA4
質量訊號及舊元件的補送後備，避免手機開啟 WhatsApp App 後原頁暫停而漏記。

## GA4 Admin 上線後設定

將以下標記為 Key events：

- `whatsapp_handoff`
- `phone_click`

以下暫時保持普通事件：

- `whatsapp_click`
- `quote_calculator_start`
- `quote_calculator_complete`
- `area_click`
- `service_click`
- `blog_read`

## Custom dimensions

建立 event-scoped dimensions：

- `cta_location`
- `service_name`
- `area_name`
- `landing_page`
- `traffic_source`
- `traffic_medium`
- `campaign_name`
- `click_id_type`

## Google Ads

Google Ads 帳戶必須保持 Auto-tagging 開啟。網站首次 `page_view` 會完整保留
`gclid`／`dclid`／`gbraid`／`wbraid`（不保存其原值至 sessionStorage），並讓
click ID 優先於手動 UTM，避免 Google Ads 流量落入 GA4 `Unassigned`。

`quote_calculator_start` 會在正式網域直接送往 Google Ads Destination
`AW-18128738982`，並另外送往 GA4；兩個目的地明確分開，避免 GA4 重複事件。

WhatsApp CTA 使用 Website Conversion Action 的完整目的地：
`AW-18128738982/CSxUCPrKmOQcEKa1usRD`。點擊當下送出一次，並以記憶體去重
同一次 SPA 流程；`/thanks` 不會再重複計算。

建立 Website Conversion Action 後，將 Conversion Label 設定到：

`VITE_GOOGLE_ADS_WHATSAPP_LABEL`

這是 Vite build-time 環境變數。必須在 Render 的正式服務加入實際 Label
（只填 `AW-.../` 後面的部分），然後重新部署；只更新 Runtime 環境而不重建前端，
已發布的 JavaScript 不會取得新值。

Render 會把 Docker 服務的環境變數轉為 build argument；專案的 `Dockerfile`
必須宣告同名 `ARG`，Vite 才能在建置時把 Label 寫入前端 bundle。

電話及表格成功提交可按需要另設：

- `VITE_GOOGLE_ADS_PHONE_LABEL`
- `VITE_GOOGLE_ADS_FORM_LABEL`

未設定這兩項時，網站仍會記錄 GA4 的 `phone_click` 及
`contact_form_submit`，但不會虛構 Google Ads conversion。

建議初期設為 Secondary；有真實 qualified lead 後再改用 Offline Conversion 作 Primary。

其他渠道的 UTM 應使用 GA4 可識別的 medium：付費搜尋 `cpc`、付費社交
`paid_social`、電郵 `email`、自然社交 `social`、合作網站 `referral`、展示廣告
`display`。版位名稱只放 `utm_content`，不可放 `utm_medium`。

## Privacy

不傳送：

- 姓名
- 電話
- 電郵
- 地址
- WhatsApp 訊息內容
- 表格完整內容

Attribution 只保存於 sessionStorage，關閉分頁後失效。
