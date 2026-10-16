---
name: "通渠熊 DrainBear — 首頁光影水流"
description: "白熊夜景、水流與開放式香港通渠服務版面；首頁覆寫及共用品牌基礎"
colors:
  home-night: "#09294c"
  home-blue: "#0867c7"
  home-blue-hover: "#094f94"
  home-paper: "#f5f8fb"
  home-copy: "#355574"
  home-line: "#bfd0df"
  home-dark-copy: "#d6e5f2"
  home-dark-rule: "#587591"
  home-field-line: "#a4bdd2"
  home-control-idle: "#e2edf6"
  home-control-ink: "#183e62"
  home-control-selected: "#173f68"
  home-control-indicator: "#2f9edb"
  home-whatsapp: "#21c77b"
  white: "#ffffff"
  brand-ink: "#0b132b"
  brand-copy: "#42516a"
  brand-paper: "#f1f7fc"
  brand-line: "#dce8f2"
  brand-accent: "#075286"
  brand-green: "#25d366"
typography:
  display:
    fontFamily: '"DrainBear Display", "Noto Sans HK", "PingFang HK", sans-serif'
    fontSize: "clamp(3rem, 6.2vw, 6rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  display-mobile:
    fontFamily: '"DrainBear Display", "Noto Sans HK", "PingFang HK", sans-serif'
    fontSize: "clamp(2rem, 10.6vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: '"DrainBear Display", "Noto Sans HK", "PingFang HK", sans-serif'
    fontSize: "clamp(1.7rem, 3.2vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  title-service:
    fontFamily: '"DrainBear Display", "Noto Sans HK", "PingFang HK", sans-serif'
    fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)"
    fontWeight: 900
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang HK", "Noto Sans HK", "Microsoft JhengHei", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang HK", "Noto Sans HK", "Microsoft JhengHei", sans-serif'
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.7
rounded:
  open-surface: "0"
  home-control: "3px"
  home-contact: "6px"
  shared-container: "12px"
  pill: "999px"
spacing:
  half: "0.5rem"
  three-quarter: "0.75rem"
  unit: "1rem"
  one-half: "1.5rem"
  double: "2rem"
  section-home: "clamp(3rem, 6vw, 6rem)"
  container-inline: "clamp(1.25rem, 3vw, 2rem)"
components:
  contact-whatsapp:
    backgroundColor: "{colors.home-whatsapp}"
    textColor: "{colors.home-night}"
    rounded: "{rounded.home-contact}"
    padding: "0.8rem 1.2rem"
  contact-phone:
    backgroundColor: "{colors.home-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.home-contact}"
    padding: "0.8rem 1.2rem"
  contact-whatsapp-mobile:
    backgroundColor: "{colors.home-whatsapp}"
    textColor: "{colors.home-night}"
    rounded: "{rounded.home-contact}"
    padding: "0.65rem 0.8rem"
  contact-phone-mobile:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.home-contact}"
    padding: "0.65rem 0.8rem"
  finder-send:
    backgroundColor: "{colors.home-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.home-control}"
    padding: "0.8rem"
  finder-send-hover:
    backgroundColor: "{colors.home-blue-hover}"
  finder-select:
    backgroundColor: "{colors.white}"
    textColor: "{colors.home-night}"
    rounded: "{rounded.home-control}"
    padding: "0.75rem"
  audience-control:
    backgroundColor: "{colors.home-control-idle}"
    textColor: "{colors.home-control-ink}"
    rounded: "{rounded.home-control}"
    padding: "0.75rem"
  audience-control-selected:
    backgroundColor: "{colors.home-control-selected}"
    textColor: "{colors.white}"
---

# Design System: 通渠熊 DrainBear

## Overview

**Creative North Star: "光影水流"**

首頁以白熊、香港夜景與水流建立主視覺，深藍段落與冷白閱讀區交替。繁體中文重標題、細分隔線和開放式服務列令內容有層次；查詢控件保留直接、清楚的操作語言。

本文件記錄 2026-10-14 已實作的首頁 B 視覺系統，以及 2026-10-16 的手機延伸、跨裝置文案層次精簡及最新手機首屏原始碼，適用範圍是 `.home-page` 及 `.site-shell--home`。最新手機首屏的最終視覺覆核及發佈驗證另見首頁 surface 紀錄；文件更新本身不代表驗收通過。共用 Header、Footer、正文字體和內頁既有品牌規則仍然保留。用戶確認「可以：B 作方向，保留原素材，細節授權你完成（推薦）」；本文件不表示歷史 strict-comp 機器關卡已通過，也不將首頁規則自動套用至內頁。

**Key Characteristics:**

- 白熊為主角，品牌示意與真實施工證據分開。
- 冷白閱讀區、深藍服務區及完整寬度的開放列。
- 自託管香港繁體字重標題，細線分隔與可見焦點。
- 可暫停水流與景深動效，支援減少動態偏好。

## Colors

深海軍藍與冷白建立明暗節奏；水藍指示連結及查詢，綠色只承擔 WhatsApp 語意。

### Primary

- **夜港深藍** (`home-night`): 首屏、服務列、方法區及首頁 Footer；亦是冷白區的主文字。
- **服務水藍** (`home-blue`): 電話、查詢送出及連結；送出按鈕 hover 使用 `home-blue-hover`。

### Secondary

- **WhatsApp 綠** (`home-whatsapp`): 首屏及首頁 Header 查詢入口。共用元件原有綠色仍為 `brand-green`，不視為相同 token。

### Neutral

- **冷白閱讀底** (`home-paper`) 與 **純白** (`white`): 閱讀區、指南區及選擇欄位。
- **灰藍正文** (`home-copy`) 與 **淡藍正文** (`home-dark-copy`): 分別用於淺底與深底。
- **淺藍細線** (`home-line`) 與 **深區細線** (`home-dark-rule`): 分隔內容而非框成卡片。
- `home-control-*` 指控件狀態；`home-field-line` 是選單描邊。
- `brand-*` 是既有共用系統，見 `brand-system.css`；內頁不自動採用首頁的 `home-*`。

**The Evidence Rule.** 品牌插圖、設備示意及真實施工照片／影片須以文案及 alt 說清楚各自用途，原始工程資料優先。

## Typography

**Display Font:** `DrainBear Display` 是自託管 Noto Sans HK 900 的 CSS 名稱；fallback 為 `Noto Sans HK`, `PingFang HK`, `sans-serif`。

**Body Font:** 既有 `--font-sans` 平台字體堆疊，前置 `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`，保留香港繁體 fallback。

**Character:** 有份量的香港繁體標題配合輕量正文。首頁 h1–h3 採 900 字重與 -0.025em 字距；正文保留行距，不用字體效果取代資訊層次。

### Hierarchy

- **Display:** 桌面 `clamp(3rem, 6.2vw, 6rem)`、1.15 行高；手機 `clamp(2rem, 10.6vw, 3rem)`、1.1 行高；手機 h1 使用可用全寬，兩個完整行塊保留「香港通渠，先搵通渠熊。」及標點，不插入可選斷行。
- **Headline:** h2 使用 `clamp(1.7rem, 3.2vw, 3rem)`、1.35 行高。
- **Title:** 服務列標題使用 `clamp(1.4rem, 2.8vw, 2.4rem)`；手機固定 1.5rem。
- **Body:** 首頁基礎、可見服務／方法／流程及方法限制正文為 1rem，行高按段落為 1.7–1.85；案例收合內的紀錄可用 0.9rem、1.8 行高。段落介紹上限 74ch。手機首屏價格背景文字 1rem／500，起步價為 1.5rem／800；兩者以 baseline 對齊，必要時可換行。
- **Label:** 表單標籤 0.95rem、700 字重；手機精簡聯絡標籤同為 0.95rem／700。受眾按鈕等控件仍有各自字級，不用英文字母全大寫作中文標題替代。

**The Reading Priority Rule.** 先顯示標題、簡短用途、價錢與操作；設備限制及技術詳述放入明確命名的原生收合。刪除重複介紹、提示與摘要，不以縮小正文換取密度；表單標籤、工程證據及服務連結仍須清楚。

現有字體檔為 353 字子集、57,028 bytes。新增文案需更新字體子集或核對 fallback，不能當作完整 CJK 字庫。

## Layout

容器寬 `min(100%, 1200px)`，水平內距 `clamp(1.25rem, 3vw, 2rem)`。首頁分段垂直距 `clamp(3rem, 6vw, 6rem)`；767px 以下為 2.25rem。常見間距為 0.5、0.75、1、1.5、2rem；它們是抽取的實際用值，不代表所有元件受單一數學 scale 約束。

桌面首屏文案寬 48%、上限 580px；全寬夜景在底層，白熊靠右。首屏高至少 `clamp(660px, 56vw, 860px)`。2026-10-16 最新手機修正取代同日較早的左右窄欄構圖：小於 768px 時，完整兩行標題、同行價錢及精簡並排聯絡先行，全幅白熊／夜港場景接在下方。內容格沒有固定最小高度，上下內距 100px／0，文案使用可用全寬；場景以自然文流、100% 寬、0.75rem 頂距及 contain 保留原圖比例，頂部僅以 3% 深藍淡出接合。479px 以下沿用 960／938 素材比例；480–767px 沿用 1685／933 橫幅比例，兩者 sizes 均為 100vw。手機隱藏受眾短句，完整起步價保留；文字放大或長標籤可推開下方場景。這些是首頁響應式實作值，不是固定首屏高度 token。桌面首屏幾何及其受眾／價錢排列沿用既有實作。

查詢區桌面以 0.85fr / 1.3fr 分欄，1023px 以下用 1fr / 1.2fr，767px 以下單欄。表單桌面兩欄、768–1023px 單欄、360–767px 兩欄、359px 以下單欄。

服務列桌面照片在右側；服務及施工影片在 767px 以下共用原生橫向捲動軌道，每項寬 `calc(100% - 1.75rem)`、間距 1rem，以露出的下一項提示可捲動。手機服務照片在文案之後保留獨立 140px 圖像列，不加深色遮罩。桌面影片及案例雙欄、方法及指南三欄；手機案例改為 80px 圖像／正文兩欄，方法改為 64px 設備／正文的開放列（359px 以下設備欄 48px），指南改為正文／72px 縮圖列。流程桌面四欄、768–1023px 兩欄、767px 以下單欄，各步保留 64px 步驟標記欄。

Header 保留 72px 高度；1199px 以下隱藏桌面導航並顯示手機選單。此斷點屬共用導航，不應跟首頁 767px 的內容斷點混用。

## Elevation & Depth

首頁內容表面沒有卡片陰影。深度來自夜景底層、品牌插圖、水流透明覆層及明暗分段；服務圖片旁的漸變只協助圖文接合，不用作梯度文字。共用內頁仍保留原有 `--brand-elevation: 0 14px 36px #06375812`，不是首頁浮起容器的許可。

**The Open Surface Rule.** 首頁服務、查詢、指南及 FAQ 以開放佈局和細線分隔；不再用重複圓角卡片包裹每段內容。功能控件本身可保留小圓角。

## Shapes

首頁內容列、FAQ、查詢面板不設圓角外框。選單、送出按鈕及受眾控件使用 3px 小圓角；桌面及手機首屏聯絡按鈕均為 6px；暫停動效及 Header WhatsApp 保留 999px 膠囊控件。既有共用容器半徑 12px 繼續適用其原有元件。

## Components

### Buttons

桌面首屏 WhatsApp 綠／深藍文字與電話水藍／白字維持單欄，最大寬度 340px、間距 0.75rem、最小高度 66px、內距 0.8rem 1.2rem。hover 上移 2px、亮度 1.08；focus 為白色 3px 輪廓，偏移 5px。

手機首頁透過 `compactOnMobile` 明確啟用同列雙控件：WhatsApp 綠底及深藍字，電話透明底／白字配 1px 淺藍描邊；兩者為 6px 圓角、最小高度 48px、內距 0.65rem 0.8rem、20px 圖示。整組最大寬度 380px、1.3fr／1fr 分欄、間距 0.625rem，接在價錢下方 1.1rem、全幅場景之前；可見名稱為「WhatsApp」及「致電查詢」，完整聯絡語意保留於 accessible name。原有電話、WhatsApp 目的地及追蹤沿用。這是首頁 opt-in，不更改其他入口。

手機固定聯絡列在 JavaScript 增強後，首屏操作仍可見時隱藏；首屏聯絡組底部到達視窗 80px 或以上時顯示，回到首屏則再次隱藏。無 JavaScript 維持固定列後備；預渲染重設 `data-enhanced`，避免將暫態隱藏帶入靜態頁。固定列只在有判斷結果交接時顯示額外細字。

送出查詢為水藍底白字、3px 圓角、最小 54px 高；hover 深藍。普通焦點 3px 水藍輪廓、偏移 5px，深藍服務／方法區則淡藍輪廓。

### Audience Controls

三個原生按鈕以 `aria-pressed` 表達狀態。未選為淡藍底，已選為深藍底白字，底部 3px 指示線。此為現有選取狀態；偵測器對底線的既有提示仍保留為檢查紀錄，不提升為新表面的裝飾規則。

### Inputs / Fields

原生 select 為白底、1px 灰藍描邊、3px 圓角、0.75rem 內距、最小 52px 高。標籤維持可見；服務及地區值繼續傳入 WhatsApp 查詢內容。

### Navigation

保留原始 Logo 與共用導航組成。首頁 Header 為夜港深藍、連結白色；桌面字級 0.8rem，手機選單維持鍵盤關閉與既有聯絡入口。首頁 Footer 使用夜港深藍，內頁原 Footer 深色保持不變。

### Open Service Rows and Evidence

服務列以細線分隔、圖示、標題、說明、方向箭頭及設備照片構成；整列可連到服務頁。方法圖片是透明白色線條設備示意，直接融入深藍背景。真實工程使用原始影片、海報與案例如實呈現，不以生成圖片補充未記錄的施工。

影片用原生 controls、`playsInline`、`preload="none"`；桌面畫面高 350px、手機 280px，`object-fit: contain`。完成案例圖片同樣保留內容、不裁切證據。

### Mobile Rails

服務與施工影片共用原生 CSS scroll-snap 軌道，只在 767px 以下改為橫向；桌面保留服務列及影片雙欄。軌道本身可聚焦，ArrowLeft／ArrowRight、Home／End 只在焦點位於軌道時切換，不攔截影片或連結的鍵盤操作。增強後顯示 44px 圓形前後按鈕、停用邊界狀態及禮貌宣讀的項目計數；不自動輪播。減少動態偏好使用即時捲動。影片在軌道視窗內的可見寬度不足一半時暫停，不自動播放下一片。

JavaScript 未啟用時維持原生水平捲動、服務連結及影片，隱藏無作用的增強按鈕／計數；預渲染將暫態 `data-enhanced` 重設為 false。

### Borderless Disclosures

查詢相關方法、方法區「適用情況及設備限制」及完成案例的問題／發現／處理／測試使用原生 details／summary，預設收合，桌面與手機均可展開。沿用共用 disclosure 的語意、22px chevron 及 280ms 旋轉，但首頁移除外框、背景與圓角，只保留頂部細線及正文。共用摘要最小高度 76px；首頁案例手機版上下內距為 0.5rem，仍保留共用最小高度。支援的瀏覽器使用 280ms 高度／200ms 透明度轉換，減少動態偏好停用轉換。收合內容立即退出鍵盤操作；無 JavaScript 仍可原生展開，預渲染不保留暫態 inert 屬性。

方法區預設只顯示三項短用途；三項完整技術限制及工具指南連結保留在同一收合內，支援原生操作及 hash 開啟。手機軌道提示保留給輔助科技，不再作可見解說。影片預覽說明、指南摘要、重複引言及 FAQ 引言已精簡；此文案層次改動同時適用桌面與手機，並不屬於只限手機的首屏幾何調整。

### FAQ and Motion

FAQ 是原生 details／summary，以細線分隔、最低 65px 摘要列、箭頭旋轉 180 度表示開啟。保留答案 ID 和服務正文連結。

手機場景暫停控件為 44px 圖示按鈕，可見文字隱藏而動態 accessible name 保留；桌面維持原樣。標題進場 850ms、第二行延遲 100ms；水流 22s 循環，景深位移上限桌面 26px／手機 8px。離開畫面、頁面不可見或按暫停時停止。`prefers-reduced-motion: reduce` 停用標題、水流、景深與首頁 transition，隱藏不需要的暫停控件。共用 reveal 420ms、14px 位移，只有 observer 成功初始化才隱藏待進場內容。

## Do's and Don'ts

### Do:

- **Do** 保留首頁白熊主視覺和原始 Logo、施工影片及文章素材。
- **Do** 在冷白區用深藍正文，在深藍區用白色或已實作的淡藍文字。
- **Do** 新增標題時更新 Noto Sans HK 900 字體子集，或驗證缺字的既有 fallback；現有 353 字子集不是完整 CJK 字庫。
- **Do** 保留至少 44px 操作區、鍵盤焦點、動效暫停、減少動態支援及無 JavaScript 可讀內容。
- **Do** 沿用首頁 CSS 範圍，修改共用樣式時另外核對內頁。
- **Do** 以短用途及清楚操作維持閱讀層次，將完整設備限制放入可開啟、可連結及無 JavaScript 可讀的原生收合。
- **Do** 手機首屏保留完整兩行主標、同列兩個有名稱的聯絡操作及下方全幅白熊夜景，完整展示安全帽。

### Don't:

- **Don't** 在首頁新增重複浮起圓角卡片、硬偏移陰影、裝飾性小標或梯度文字。
- **Don't** 將設備插圖或施工片段當作已驗證完工結果。
- **Don't** 把深藍色遮罩壓到手機服務圖片難以辨認；手機圖片保留獨立完整圖像列。
- **Don't** 讓文字進場效果成為內容顯示的必要條件，或在減少動態偏好下持續播放水流。
- **Don't** 因首頁改版而將內頁既有 12px 容器半徑或共用字體規則全部替換。
