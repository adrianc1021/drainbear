# 真實施工影片

2026年10月8日發布。五段原片由通渠熊提供，剪輯保留原速；未收到工程地區、實際工程日期、故障原因和完工測試資料，所以這些欄位不作推測。五段影像不代表五個不同客戶，也不擅自合併成同一工程。檔名中的 WhatsApp 日期不作工程日期。

## 已製作內容

| 原片       | 網站紀錄                 | 選用原片時間     |
| ---------- | ------------------------ | ---------------- |
| 無括號編號 | 坐廁積水，現場疏通操作   | 21–25.5、42–53秒 |
| (1)        | 櫃底去水位，工具處理紀錄 | 0.3–7.3秒        |
| (2)        | 喉口檢查，送入線材的過程 | 4–16秒           |
| (3)        | 櫃內喉口，近鏡施工紀錄   | 0–2、9–12.6秒    |
| (4)        | 戶外渠口，開蓋施工紀錄   | 2.5–6.5、33–38秒 |

影片為540×960、H.264、24fps、MP4 faststart，移除原聲及原始 metadata。附品牌字樣、繁體畫面說明、WebVTT、WebP封面及可讀文字紀錄；採用原生 controls、playsInline、preload="none"，不自動播放。首屏及聯絡入口繼續使用既有電話與 WhatsApp 資料。

首頁展示三段精選，案例目錄展示五段影片，原有 CMS 工程紀錄保留。每段有獨立 canonical 播放頁、Article／VideoObject 商家關聯及正式媒體連結。紀錄發布日期與工程日期分開；不以施工操作聲稱完工結果。

## 維護

`docs/video-cases-edit-plan.json` 為人工核對剪輯與文案；`scripts/edit-case-videos.py` 用 ffmpeg／ffprobe 由原片重建。原片不進公開資料夾，網站只發布已剪輯素材。執行：

```sh
python3 scripts/edit-case-videos.py /path/to/originals
pnpm check
pnpm test
pnpm build
```

輸出 `shared/recordedVideoCases.json` 為影片長度、字幕時間、checksum及內容的單一來源。網站 build 不需要 ffmpeg；已核對素材納入版本管理。改動素材時更新版本尾碼及文案，重新審閱畫面後才發布。

`pnpm build` 把五段案例納入一般 sitemap、AEO 公開資料及 `video-sitemap.xml`。`verify:aeo` 核對影片檔案checksum、MP4 faststart、封面格式、字幕、可見文字、VideoObject與影片sitemap；不是Google或AI平台的實際收錄證明。

```sh
NODE_USE_ENV_PROXY=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/verify-case-video-browser.mjs
```

瀏覽器驗證首頁／案例列表不下載 MP4，五段影片均可播放及跳轉時間、字幕能載入，HTTP Range 回應206。既有 site quality 審查包括五段路由及影片頁版型。發布後另驗證正式網域與影片 HTTP Range。

後續可補充：工程地區、真實日期、原片對應關係、檢查結果及完整放水／沖水測試片段。收到資料後更新同一案例網址，不新增重複案例。

## 發布前驗證

- TypeScript檢查及20個測試檔案、117項測試通過。
- 完整build預渲染69頁；一般sitemap與AEO資料涵蓋67個canonical頁面、102個可見答案。五段影片checksum、faststart、字幕、VideoObject及影片sitemap通過核對。
- 57個路由、80組RWD檢查及33次axe審查通過；案例頁320與390px的首屏聯絡入口已確認。
- 五段影片在390及1440px的實際播放器測試通過，包括播放、跳轉時間、字幕載入及HTTP Range 206。首頁及案例列表未提前下載MP4。
- 正式網域部署後的媒體及索引檢查另存於本次任務的review資料夾，不能用預覽成功取代正式網站驗證。

## 補充工程資料

使用 `docs/case-facts-intake.json` 對應原片及既有案例網址；未知欄位保持 `null`，此檔為內部整理表，不會公開輸出。請只填可公開的地區，不填客戶完整地址。

1. 由通渠熊確認地區、實際工程日期及完工結果，記錄核對人、確認時間與來源，例如完工短片、工作單或師傅紀錄。工程日期不能使用上傳日期代替。
2. 如多段素材屬同一工程，填寫 `sameProjectAs` 的既有 slug；未確認前不合併，也不聲稱五個不同客戶。
3. 確認公開使用後，按核實資料更新剪輯計劃及 `shared/recordedVideoCases.json`。新增地區或日期欄位時，先核對案例元件與 AEO 的資料型別；完成結果在 `result` 記錄，來源仍保留在整理表。
4. 相應修改案例可見文字、Service↔Case 關聯及地區證據。維持原本案例網址及真實影片；必要時換用有版本號的完工片段。
5. 執行 `pnpm check`、`pnpm build` 及影片瀏覽器驗證，核對可見內容、VideoObject、knowledge.json 與影片 sitemap。發布後確認正式頁面及媒體。

沒有確認資料的案例維持目前影片可證明的操作描述，不填上猜測的成功結果。
