# DrainBear WhatsApp 報表口徑

## 事件定義

| 報表指標 | GA4 事件 | 意義 |
|---|---|---|
| CTA 互動量 | `whatsapp_click` | 使用者按下任一 WhatsApp CTA；按位置以 `cta_location` 分組。 |
| 成功交接量 | `whatsapp_handoff` | 點擊後成功抵達 `/thanks` 並消耗一次性 handoff token；不代表使用者已發出訊息。 |
| 成功交接率 | `whatsapp_handoff` / `whatsapp_click` | 同一日期範圍及相同篩選條件下計算，結果以百分比顯示。 |

## 報表設定

- 總量卡片只使用上述兩個事件其中一個，不要把兩者相加。
- 分區比較使用 `cta_location`，不要以按鈕文字、頁面標題或自由文字自行分組。
- 首頁、服務頁、地區頁如需合計，先以 `whatsapp_click` 計算 CTA 互動量，再另列 `whatsapp_handoff` 成功交接量。
- `whatsapp_open` 是舊版兼容事件，不應放入新轉換報表或與 `whatsapp_handoff` 合計。
- `/thanks` 重整不會重複計算 `whatsapp_handoff`；這是刻意的去重行為。

## 解讀限制

`whatsapp_click` 與 `whatsapp_handoff` 之間的差額可能來自使用者關閉頁面、跳轉中斷、瀏覽器阻擋新分頁或網絡延遲。兩者不應被視為同一個漏斗步驟的重複資料。
