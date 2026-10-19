# 全部地區頁獨立文章改寫

2026-10-19（香港）。使用者已確認：全站至少150個可索引子頁，重點是改善現有地區內容。

## 數量及範圍

正式 Sitemap 修改前有215個網址，扣除首頁為214個子頁，其中18個是地區專頁。此次保留所有網址及既有目錄入口，改寫全部18區，沒有為湊數新增地區×服務的重複頁面。完成建置後仍為215個可索引網址／214個子頁。這是網站技術可索引數量，不代表Google實際已收錄數量；本次未讀取新的Search Console索引報告。

## 每區獨立主題

| 地區頁 | 文章主題 |
| --- | --- |
| [觀塘](https://drainbearhk.com/areas/kwun-tong) | 觀塘工廈與住宅通渠，先分清排水用途 |
| [沙田](https://drainbearhk.com/areas/sha-tin) | 沙田屋苑與村屋，兩種排水問題兩種準備 |
| [旺角](https://drainbearhk.com/areas/mong-kok) | 旺角樓上單位塞渠，入口與協調人同樣重要 |
| [深水埗](https://drainbearhk.com/areas/sham-shui-po) | 深水埗租住單位與舖頭，先把問題位置講清楚 |
| [銅鑼灣](https://drainbearhk.com/areas/causeway-bay) | 銅鑼灣食肆與大坑住宅，通渠前要分清的安排 |
| [北角](https://drainbearhk.com/areas/north-point) | 北角單位去水慢，先由三個位置分辨範圍 |
| [荃灣](https://drainbearhk.com/areas/tsuen-wan) | 荃灣不同樓型，通渠前先交代曾經改過甚麼 |
| [元朗](https://drainbearhk.com/areas/yuen-long) | 元朗村屋倒灌，先分清沙井、化糞池與接駁 |
| [屯門](https://drainbearhk.com/areas/tuen-mun) | 屯門塞渠，按發生時間及樓宇位置整理線索 |
| [將軍澳](https://drainbearhk.com/areas/tseung-kwan-o) | 將軍澳屋苑通渠，先對照交樓與使用後的變化 |
| [中西區](https://drainbearhk.com/areas/central-western) | 中西區通渠，從商廈使用時段到半山搬運路線 |
| [南區](https://drainbearhk.com/areas/southern) | 香港仔及南區通渠，室內設備與戶外管段分開看 |
| [九龍城](https://drainbearhk.com/areas/kowloon-city) | 九龍城通渠，舊樓與新裝修單位都先看實際管段 |
| [葵青](https://drainbearhk.com/areas/kwai-tsing) | 葵青工廈與貨倉排水，先說明流過喉管的是甚麼 |
| [黃大仙](https://drainbearhk.com/areas/wong-tai-sin) | 黃大仙屋邨倒灌，記下誰在甚麼時候受影響 |
| [離島](https://drainbearhk.com/areas/islands) | 離島通渠，先確認工具如何到達工作位置 |
| [北區](https://drainbearhk.com/areas/north-district) | 北區住宅與村屋通渠，位置描述要跟得上現場 |
| [大埔](https://drainbearhk.com/areas/tai-po) | 大埔通渠與保養，把日常使用和下雨時的情況分開 |

每區有兩段引言、三節各兩段正文、三類查詢準備、三條獨立FAQ、四項按主題選取的服務及兩篇延伸閱讀。正文共144段，沒有完全相同的段落；54條FAQ題目各有獨立內容。共用閱讀版型、品牌、聯絡及服務事實正常保留，並不宣稱每句文字均與其他頁無語義交集。

原有部分頁面已有不同介紹，但主要文章被收合，多頁也重用夜間安排答案及同一組服務入口。此次改成主文章直接顯示、三項章節目錄、段落內服務／文章連結；手機單欄，桌面側欄提供相關服務。準備清單與FAQ可原生收合，避免重複展開大段說明。保留旺角與大坑既有主要章節錨點。

沒有新增地區施工聲稱、樓齡推論、故障頻率或保證結果。真實案例仍只按CMS明確記錄的地區配對；沒有將無地區案例硬放成當區工程。未確認某區最常發生甚麼問題，因此以具體場所與可觀察現象組織內容，不作統計聲稱。

## 檔案與搜尋資料

- `client/src/lib/districtSearchContent.ts`：18頁完整獨立文案、標題、描述、章節連結、FAQ及相關服務；TypeScript核對完整公開地區清單，避免漏掉某頁。南區保留「香港仔及南區」H1，其他地區沿用本身服務H1。
- `client/src/lib/districtData.ts`：擴充文章欄位及限定地區slug；基礎地區、地標及網址對照保留，完整文章以districtSearchContent為維護來源。
- `client/src/pages/District.tsx`：可直接閱讀的article、目錄、正文連結、專屬準備資料及延伸閱讀；WebPage記錄實際dateModified。
- `client/src/components/DistrictServiceLinks.tsx`：按各區文章提供的服務排序顯示，保留既有導航追蹤。
- `client/src/styles/brand-system.css`：沿用品牌字體及顏色，加入文章欄寬、閱讀目錄與響應式側欄。
- `scripts/prerender.ts`：18頁Sitemap lastmod與實際文章更新日期2026-10-19一致；canonical和robots維持。
- `skills/drainbear-search-quality/SKILL.md`：保存地區內容維護、完整清單、日期及索引數量的核對規則。

完整修改前後的標題、描述、引言、正文、FAQ、準備清單及服務連結見[文案對照](district-articles-2026-10-19/before-after-content.json)。

## 已執行驗證

- TypeScript、27個測試檔案／149項測試通過；Vite及伺服器編譯通過。既有主程式chunk超過500kB的提示仍在，沒有聲稱消除它或改善速度分數。
- 使用即時CMS資料完成217個路由預渲染；215個canonical／Sitemap網址、214個子頁、128個完整問題答案、291個可見AEO答案、5段真實影片及媒體檢查通過。答案總數由292變291，是旺角原有4條FAQ整合為3條的結果。
- 18頁全部核對title、description、OG、唯一H1、自我canonical、robots、dateModified，以及FAQ JSON-LD與可見答案一致。
- 18頁×320／390／768／1024／1440px共90組版面檢查，無橫向溢出。服務圖片成功解碼，目錄錨點、鍵盤開啟FAQ、電話及帶當區名稱的WhatsApp URL正常。
- 18頁390px的axe WCAG AA自動檢查零違例，沒有收集到JavaScript執行錯誤；關閉JavaScript後，18頁完整8段正文仍直接可見，原生FAQ可開啟。未測實體手機或Safari，自動結果不代表完整WCAG認證。
- 頁內連結及錨點、18頁Sitemap日期均有效。已查看觀塘手機及離島桌面閱讀畫面。第一次無JavaScript檢查在整站預渲染尚未完成時中止；完成後逐頁及完整瀏覽器驗證均通過，沒有放寬正文要求。

證據：[頁數與站內連結](district-articles-2026-10-19/static-index-checks.json)、[瀏覽器結果](district-articles-2026-10-19/local-browser.json)、[手機閱讀畫面](district-articles-2026-10-19/kwun-tong-article-390.png)、[桌面閱讀畫面](district-articles-2026-10-19/islands-article-1440.png)。另有[正文比對診斷](district-articles-2026-10-19/similarity-review.json)，它只是編輯檢查，不是Google重複內容分數或排名保證。

## 後續資料

若要加入各區實績，仍需可公開的工程地點、日期、相片、處理範圍、完工測試與使用同意。此項未阻止獨立文章完成，也沒有以虛構案例填補。專業團隊可逐步補充實際工具、管道及現場紀錄；現時技術文字保持條件說明。

發布後以Search Console觀察地區頁的抓取、已收錄狀態，以及「地區＋通渠」的曝光、點擊和平均排名；首個完整28日再比較，不能將可索引數量當作流量成效。
