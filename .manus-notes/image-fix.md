# 服務卡圖片修復紀錄（2026-07-27）

## 問題
首頁四張服務卡 `<img>`（Home.tsx 原引用 service-residential_e150660f / service-commercial_04a25422 / service-hydrojet_a744b6de / service-cctv_138076b0）的 manus-storage 物件已失效（presign 後 404），導致圖片無法載入。用戶透過視覺編輯器留下「找可用圖片」註解。

## 修復
將本地 `/home/ubuntu/webdev-static-assets/` 的原圖以 `manus-upload-file --webdev` 重新上傳，取得新路徑並替換：
- service-residential_69154457.png
- service-commercial_99bef6a7.png
- service-hydrojet_55800a40.png
- service-cctv_5ac58f72.png
- hero-plumber_f9109f53.png（hero 圖同為失效，一併修復；SEO.tsx 預設 OG 圖同步更新）

## 驗證
- curl 追蹤 307 redirect：五張新圖全部 200。
- 全站掃描所有 manus-storage 引用，無其他失效路徑。
- 瀏覽器實測：首頁所有 img `naturalWidth > 0`（服務卡為 lazy loading，捲動至區塊後正常載入）。
- /services、/guide、/areas 全頁截圖確認圖片渲染正常。
