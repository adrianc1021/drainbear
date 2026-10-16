# 手機首屏重排 — 2026-10-16（香港）

用戶認為剛發佈的左右窄欄版本不及上一版，並要求參考設計師打造的網站。本次恢復完整兩行大標題和全幅白熊，保留精簡文字及小型並排聯絡按鈕。只調整手機首頁首屏；桌面構圖、其他頁面及既有查詢流程保留。

[手機畫面](mobile-hero-rethink-2026-10-16/mobile.png) · [寬手機](mobile-hero-rethink-2026-10-16/wide-mobile.png) · [桌面](mobile-hero-rethink-2026-10-16/desktop.png)

## 實際參考

- [Lemonade](https://www.lemonade.com/)：實際讀取正式網站及手機畫面，參考「主要訊息 → 行動 → 寬幅品牌插圖」次序，沒有複製其價格或業務聲稱。
- [COLLINS — Mailchimp](https://www.wearecollins.com/work/mailchimp/)：實際讀取設計案例與手機畫面，參考大字、留白及吉祥物與品牌的關係，沒有使用其相片或品牌素材。
- [Hello Monday](https://www.hellomonday.com/)：實際讀取作品列表與手機畫面；首張截圖的入場仍未完全穩定，因此只作構圖及圖像份量參考，沒有聲稱驗證其動態或效能。
- 21st MCP 已驗證連線並搜尋全幅插圖 Hero 及精簡操作；本次結果包括 [Hero Carousel — crafterui](https://21st.dev/@crafterui/components/hero-carousel)。只參考寬幅圖像的視覺份量，沒有加入輪播、安裝付費元件或呼叫未啟用的 AI 生成。

## 變更

1. 主標保持「香港通渠，先搵通渠熊。」原文，手機使用兩個完整行塊，不再把第二句擠成兩行。
2. 「全線通渠服務 HK$300 起」同一基線，價格取自既有共用資料；沒有增加業務聲稱或提示小字。
3. WhatsApp／致電查詢緊接起步價，兩個約 50px 高的按鈕並排，改用 6px 圓角，保留品牌圖示、焦點、tracking 及原有聯絡 URL。
4. 白熊、香港夜景及水流改為下方全幅場景，以自然文流及原始圖片比例展示，避免文字與白熊互相擠壓。479px 以下使用原有接近正方形素材；480–767px 使用原有橫幅素材，完整保留頭盔及場景，沒有重新生成圖片。
5. 既有水流動效、暫停、減少動態模式及聯絡列捲動時機不變。無 JavaScript 仍可查詢及閱讀內容。

390px 新首屏高約 699px，比先前全幅白熊版約 774px 短約 75px；被否定的左右窄欄版是 560px，這次增加圖像展示空間以恢復主角份量。1440px 首屏仍高 806.390625px，兩個按鈕的座標與改動前完全一致。

## 檔案及檢查

程式修改：`client/src/pages/Home.tsx`、`client/src/components/HomeHeroScene.tsx`、`client/src/styles/home.css`。新增兩行標題及全幅場景的實際斷言：`scripts/verify-home-mobile.mjs`。設計紀錄同步至 DESIGN.md、.impeccable/design.json 與首頁 brief。

- 型別檢查通過；25 個測試檔案、138 個測試通過。
- 瀏覽器核對七個尺寸、28 個服務組合，`issues: []`；標題、description、H1、canonical、robots、電話及 WhatsApp、導覽、影片與減少動態路徑通過。
- 320／390／430／767／1440px 畫面已逐一開啟核對；標題及價格原文保留，無全頁水平溢出。
- 手機全幅標題、場景與聯絡列時機、觸控橫掃及直向捲動、影片切走暫停、原生鍵盤／錨點／無 JavaScript 內容通過。
- 驗證使用 Chromium 和合成觸控；沒有實體裝置或 Safari 驗證，沒有發送 WhatsApp 訊息或撥出電話。

[幾何量度](mobile-hero-rethink-2026-10-16/geometry.json) · [完整瀏覽器驗證](mobile-hero-rethink-2026-10-16/browser.json) · [手機互動](mobile-hero-rethink-2026-10-16/mobile-checks.json)

完整建置已通過：216 個預渲染路由、214 個 Sitemap 可索引網址、213 個子頁、128 篇完整解答及 291 項可見 AEO 答案；五段真實影片及其校驗、字幕、schema 與影片 Sitemap 一致。沒有使用舊 CMS 快照。

[獨立設計審閱](mobile-hero-rethink-2026-10-16/review.md)：本次手機首頁首屏修正的完整審閱結論為 `ship`，沒有要求再修正的項目。這不是整站重新認證，歷史 strict-comp gate 仍維持未通過，沒有建立新像素樣稿或捏造批准。
