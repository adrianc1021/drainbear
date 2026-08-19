# PR #19 — Conversion & Attribution Tracking

## Production IDs

- GA4 Measurement ID: `G-7JEL7SLBGQ`
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

`quote_calculator_start` 會在正式網域直接送往 Google Ads Destination
`AW-18128738982`，並另外送往 GA4；兩個目的地明確分開，避免 GA4 重複事件。

建立 Website Conversion Action 後，將 Conversion Label 設定到：

`VITE_GOOGLE_ADS_WHATSAPP_LABEL`

這是 Vite build-time 環境變數。必須在 Render 的正式服務加入實際 Label
（只填 `AW-.../` 後面的部分），然後重新部署；只更新 Runtime 環境而不重建前端，
已發布的 JavaScript 不會取得新值。

建議初期設為 Secondary；有真實 qualified lead 後再改用 Offline Conversion 作 Primary。

## Privacy

不傳送：

- 姓名
- 電話
- 電郵
- 地址
- WhatsApp 訊息內容
- 表格完整內容

Attribution 只保存於 sessionStorage，關閉分頁後失效。
