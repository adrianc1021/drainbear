# 通渠熊 DrainBear — Phase 0 視覺審計

> **唯讀審計。零 code 改動。** 本文件係 MASTER_BRIEF v2 Phase 0 的交付物，記錄現況，為 Phase 1–6 提供確實靶。
>
> Audited: 2026-09-28 · Repo: main @ `dfa9b54` · CSS total: 8,861 行 / 13 個檔案

---

## 1. CSS 載入鏈與覆寫地圖

### 載入順序（`client/src/main.tsx:3-14`）

| # | 檔案 | 大小估算 | 引入的 token 家族 | 關鍵覆寫 |
|---|------|----------|------------------|---------|
| 1a | `index.css` | 1,102 行 | **Family A** `--navy/--safety/--mist`；shadcn tokens；`PR20_EDITORIAL_FOUNDATION` 與 `HOME_VISUAL_SYSTEM_PHASE1` 兩個嵌入區塊 | 基底，被後續全部覆寫 |
| 1b | ↳ `styles/editorial-system.css`（`@import` 於 index.css 第 3 行） | ~500 行 | **Family B-site** `--site-paper/--site-ink/--site-safety`；case-studies / areas editorial classes | 作為 1a 的一部分載入，`--site-safety: #ff7a00` 被 7 號覆寫 |
| 2 | `styles/home-editorial-phase3.css` | ~650 行 | 無新 `:root` token；修正 `.home-editorial` 排版 | 覆寫 1a 的 display 字型 scale 與 section spacing |
| 3 | `styles/services-guide-phase4.css` | ~780 行 | **Family C** `--phase4-*`（scoped to `.phase4-*`），`--phase4-safety: #ff6b00` | 引入 `#003566` 作為 hero 背景色（非 token） |
| 4 | `styles/site-chrome-phase5.css` | ~400 行 | `--site-header-z/--site-dialog-z` 等 z-index tokens | 無色彩 token 覆寫 |
| 5 | `styles/secondary-pages-stage6a.css` | ~200 行 | 無新 token；依賴 `--site-*` | 無覆寫 |
| 6 | `styles/editorial-art-direction.css` | ~200 行 | `--db-art-rule/--db-art-paper` | 強制所有 `.card-float` border-radius 為 `0 !important`；removes hover transforms |
| **7** | **`styles/visual-upgrade.css`** | ~960 行 | **Family D** `--brand-ink: #003566`；大規模 `:root` 覆寫 | **最大破壞點：把 `--safety`、`--db-safety`、`--phase4-safety`、`--site-safety` 全部改為 `#003566`（navy 藍）** |
| 8 | `styles/home-reference-inspired.css` | ~2,100 行 | 無新 `:root` token | 大量 backdrop-filter 工具 class；無限循環動畫 `db-cue-bounce` |
| 9 | `styles/home-mobile-optimization.css` | ~300 行 | 無 token | 手機文字尺寸修正 |
| 10 | `styles/motionsites-reference-refresh.css` | ~400 行 | **Family E** `--db-refresh-*`（night/warm/accent） | 設定 homepage sections 背景色 |
| 11 | `styles/motionsites-inner-pages.css` | ~300 行 | 無 token；依賴 `--site-*` | Inner page hero media layout |
| **12** | **`styles/home-compact-refresh.css`** | ~450 行 | **Family F** 覆寫 Family E 全部 4 個 token 為 `var(--brand-*)` | **無限動畫 `header-glass-flow`、`whatsapp-breathe`、`whatsapp-sheen`** |

### 最終生效值（瀏覽器 computed，按載入鏈推導）

| Token | 首次定義 | 最後覆寫 | 最終值 | Brief 目標 |
|-------|---------|---------|--------|-----------|
| `--safety` / `--db-safety` / `--phase4-safety` / `--site-safety` | `#ff7a00` / `#ff6b00` / `#ff6b00` / `#ff7a00` | visual-upgrade.css `:root` | **`#003566`（navy 藍）** | `--brand-orange: #FF7A00` |
| `--navy` / `--brand-ink` / `--db-ink` / `--site-ink` | `#0b132b` | visual-upgrade.css | **`#003566`** | `--brand-navy: #0B132B` |
| `--db-paper` / `--brand-paper` / `--db-refresh-paper` | `#f3f0e8` | visual-upgrade.css / home-compact-refresh.css | **`#f0ebd8`** | `--surface-0` |
| `--wagreen` | `#25d366` | 無覆寫 | `#25d366` | `--brand-wa` |
| `--shadow-soft` | index.css:82 | 無覆寫 | `0 1px 2px rgba(11,19,43,.04), 0 8px 24px rgba(11,19,43,.055)` | soft shadow ✓ |
| `--shadow-raised` | index.css:83 | 無覆寫 | `0 4px 12px rgba(11,19,43,.07), 0 16px 36px rgba(11,19,43,.09)` | raised shadow ✓ |

**核心問題：`--safety`（橙色 CTA accent）已被 visual-upgrade.css 靜默改為 `#003566`（藍色），全站 CTA 橙色消失。**

---

## 2. 色彩清冊

### 已確認出現的 hex 色值（主要）

| 色值 | 色相 | 出現檔案 | 角色 | 對應 Brief 5.1 |
|------|------|---------|------|---------------|
| `#0b132b` | 深海軍藍 | index.css、editorial-system.css、site-chrome-phase5.css | 主色、body color | ✅ `--brand-navy` 目標 |
| `#003566` | 中海軍藍 | visual-upgrade.css（`--brand-ink`）、phase4 hero | 被錯誤設為 safety/accent | ⚠️ 保留為 `--brand-navy-2`，但不可用作 CTA accent |
| `#091226` | 深墨色 | editorial-system.css、phase4 | `--db-ink`/`--phase4-ink` | 近 `--brand-navy`，可合併 |
| `#1c2541` | 藍灰 | index.css | `--navy-light` | 可刪，用 `--brand-navy-2` 代替 |
| `#073b70` | 深藍 | site-chrome-phase5.css（.site-inner-atmosphere） | 裝飾漸變 | 待刪 |
| `#082d5e` | 深藍 | home-reference-inspired.css | mobile nav 背景 | 待刪 |
| `#07518e` / `#0b3f78` | 藍色 | home-reference-inspired.css | 共用 header 背景漸變 | 待刪 |
| `#174c75` | 藍色 | visual-upgrade.css（`--navy-light`） | 無用途 | 待刪 |
| `#ff7a00` | 橙色 | index.css（`--safety`），editorial-system.css（`--site-safety`） | 原始 CTA orange | ✅ `--brand-orange` 目標，但被覆寫 |
| `#ff6b00` | 橙色 | editorial-system.css PR20 block（`--db-safety`）、phase4 | 略暗橙 CTA | 合併到 `--brand-orange` |
| `#eb5b19` | 橙紅 | （未在本次 grep 直接確認，brief 已知）| — | 待刪 |
| `#f2a344` | 琥珀橙 | motionsites-reference-refresh.css（`--db-refresh-accent`） | 無用 accent | 待刪 |
| `#25d366` | WhatsApp 綠 | index.css（`--wagreen`）、多處硬碼 | WhatsApp CTA | ✅ `--brand-wa` 目標 |
| `#1eb556` | 深綠 | index.css（`--wagreen-dark`） | hover 狀態 | ✅ `--brand-wa-dark` 保留 |
| `#092016` | 深綠黑 | home-compact-refresh.css | WhatsApp 按鈕文字 | 待評估 |
| `#f3f0e8` | 暖米白 | editorial-system.css（`--site-paper`）、多處 | 主背景 | ✅ `--surface-0` 候選 |
| `#f0ebd8` | 略暖米白 | visual-upgrade.css（`--brand-paper`） | 被最終用作背景 | 與 `#f3f0e8` 差異極小，二選一 |
| `#f8f6f0` | 淺米 | phase4（`--phase4-paper-soft`）、editorial-system.css | 次要背景 | ✅ `--surface-1` 候選 |
| `#f4f7fb` | 冷白灰 | index.css（`--mist`）| 舊背景色 | 與 brief 暖色系衝突，待刪 |
| `#4d586b` | 中灰藍 | index.css（`--db-copy`） | 正文輔助色 | ✅ `--text-2` 候選 |
| `#3d495d` | 深灰藍 | editorial-system.css（`--site-copy`）| 正文色 | ✅ `--text-1` 候選 |
| `#29465b` | 深藍灰 | visual-upgrade.css（`--brand-copy`）| 最終正文色（被用作 --site-copy） | ✅ `--text-1` 候選（三者選一） |
| `#667187` / `#6f7b91` / `#526078` | 中灰 | 多個 | muted text | 合併為 `--text-2` |

**總計：現有 97 個不同 hex 色值（含 rgba 變體）。Brief 5.1 目標：7 個 token。刪減比例 ≈ 93%。**

### `--safety` 顏色衝突詳情

| 出現位置 | 值 | 載入順序 |
|---------|-----|---------|
| `index.css:74` | `#ff7a00`（橙） | 1 |
| `editorial-system.css:14`（`--site-safety`） | `#ff7a00`（橙） | 1b |
| `editorial-system.css` PR20 block（`--db-safety`） | `#ff6b00`（橙） | 1b |
| `services-guide-phase4.css:16`（`--phase4-safety`） | `#ff6b00`（橙） | 3 |
| **`visual-upgrade.css:14`**（`--safety`、`--db-safety`、`--phase4-safety`、`--site-safety`） | **`#003566`（藍）** | **7，最終生效** |

---

## 3. 圓角 / 陰影 / 間距清冊

### 圓角（border-radius）

| 值 | 出現位置 | 建議 |
|----|---------|------|
| `0 !important` | editorial-art-direction.css（卡片、功能故事） | 保留（Brief 風格） |
| `2px !important` | editorial-art-direction.css（phase4 services img、rounded-*） | 刪除，統一為 Brief 8px |
| `4px` | visual-upgrade.css（多處）、home-compact-refresh.css | 合併為 Brief **8px**（small level） |
| `6px` / `6px !important` | visual-upgrade.css（8 處） | 合併為 Brief **8px** |
| `8px` | site-chrome-phase5.css（skip link） | ✅ Brief 小圓角 |
| `12px` | visual-upgrade.css | 合併為 Brief **16px** |
| `0.375rem` (`≈6px`) !important | services-guide-phase4.css（`.phase4-primary-action`） | 合併為 **8px** |
| `1rem` (`16px`) | home-reference-inspired.css | ✅ Brief 大圓角 |
| `1.15rem` | home-reference-inspired.css | 合併為 **16px** |
| `1.25rem` (`20px`) | index.css | 合併為 **16px** |
| `30px` | home-reference-inspired.css | 待刪，改 **16px** |
| `999px` | home-reference-inspired.css（多處）| 僅用於 pill 形狀時保留 |
| `clamp(18px, 1.7vw, 28px)` | home-reference-inspired.css | 刪除，用 **16px** |
| `var(--radius)` = `0.75rem` (`12px`) | shadcn tokens | 改為 `16px` |

**現有圓角值：≥ 14 種。Brief 5.2 目標：2 級（8px / 16px）。**

### 陰影（box-shadow）

| 類型 | 出現位置 | 建議 |
|------|---------|------|
| `var(--shadow-soft)` | 僅 3 處 | ✅ 保留，Phase 1 全面推廣 |
| `var(--shadow-raised)` | 僅 0 處（token 定義但未使用） | ✅ Phase 1 引入 |
| `0 8px 30px rgba(11,19,43,.24)` | site-chrome-phase5.css | 替換為 `--shadow-raised` |
| `0 5px 0 rgba(11,19,43,.2) !important` | editorial-art-direction.css | 待評估，offset shadow 不同語義 |
| `0 14px 30px rgba(37,211,102,.18)` | phase4 (.phase4-primary-action) | 刪除，用 `--shadow-raised` |
| `0 8px 24px rgba(4,29,64,.18)` | home-reference-inspired.css | 刪除，用 `--shadow-raised` |
| `box-shadow: none !important` | editorial-art-direction.css（6 處） | 保留作扁平化覆寫 |
| 各種一次性 rgba shadow | 散落 30+ 處 | Phase 1 替換為 2 個 token |

**`!important` 陰影覆寫：6 處，全在 editorial-art-direction.css，Phase 1 應先清理。**

### 間距（spacing）

間距遵循 8 unit 節奏（clamp 為主），但有零星 magic number（0.85rem、0.65rem、1.15rem）。Phase 1 不列為優先，記錄備查。

---

## 4. 字體現況

### 現有 font stack

```css
/* index.css:24-29 */
--font-display: -apple-system, BlinkMacSystemFont, "Segoe UI",
  "PingFang HK", "Noto Sans HK", "Microsoft JhengHei", sans-serif;
--font-sans: /* 相同 */
```

**問題：**
- 無任何 `@font-face` 宣告，無 woff2 檔案在 `public/` 或 `client/src/`。
- `Noto Sans HK` 僅為 fallback 名稱，瀏覽器只會使用已裝系統字體。
- Brief 5.3 要求自託管 Noto Sans HK（woff2），目前完全缺失。

### index.html 外部字體請求

| 行 | 資源 | 類型 | Brief 要求 |
|----|------|------|-----------|
| `index.html:71` | `https://fonts.googleapis.com/icon?family=Material+Icons` | 外部 CSS + font | 🚫 外部依賴，Brief 隱含移除（Brief 11 的 SVG icon 方向） |
| `index.html:67` | `preconnect https://cdn.sanity.io` | 預連接 | ✅ Sanity CMS，保留 |
| `index.html:68` | `preconnect https://res.cloudinary.com` | 預連接 | ✅ Cloudinary，保留 |

**Material Icons 仍然載入（index.html:71）。若 Phase 1 改用純 SVG icon，此行可刪。**

---

## 5. 動態清冊

### `@keyframes` 全覽

| Keyframe 名稱 | 定義位置 | 使用位置 | 時長 / 循環 | Brief §7 對應 |
|--------------|---------|---------|------------|-------------|
| `floatY` | `index.css:365` | `index.css:363`（GhostFibers 背景纖維） | 6s **infinite** | 🚫 **刪除**（無限浮動） |
| `fadeUp` | `index.css:377` | `index.css:375` | `var(--motion-reveal)` both | ✅ M3（scroll reveal） |
| `db-home-rise` | `index.css:1015` | `index.css:995-1008`（hero kicker/display/lead/actions） | 560-680ms both | ✅ M1（page-load entrance） |
| `db-home-media-reveal` | `index.css:1027` | `index.css:1012` | 820ms both | ✅ M2（image entrance） |
| `site-editorial-rise` | `editorial-system.css:445` | `editorial-system.css:438,442` | 560-620ms both | ✅ M1 |
| `header-glass-flow` | `home-compact-refresh.css:63` | `home-compact-refresh.css:49` | 8s **infinite** alternate | 🚫 **刪除**（無限流動） |
| `whatsapp-breathe` | `home-compact-refresh.css:110` | `home-compact-refresh.css:79` | 3.8s **infinite** | 🚫 **刪除**（無限呼吸） |
| `whatsapp-sheen` | `home-compact-refresh.css:115` | `home-compact-refresh.css:91` | 3.4s **infinite** | 🚫 **刪除**（無限光澤） |
| `promise-banner-settle` | `home-compact-refresh.css:410` | `home-compact-refresh.css:406` | 1.4s both | ✅ M3（settle-in，合法） |
| `db-scene-image-in` | `home-reference-inspired.css:1676` | `home-reference-inspired.css:197` | 650ms both | ✅ M2 |
| `db-scene-copy-in` | `home-reference-inspired.css:1687` | `home-reference-inspired.css:307,1007,1429` | 420-480ms both | ✅ M1 |
| `db-scene-visual-in` | `home-reference-inspired.css:1698` | `home-reference-inspired.css:399` | 620ms both | ✅ M2 |
| `db-cue-bounce` | `home-reference-inspired.css:1709` | `home-reference-inspired.css:820` | 1800ms **infinite** | 🚫 **刪除**（無限彈跳） |

**需刪除的無限動畫：4 個（`floatY`、`header-glass-flow`、`whatsapp-breathe`、`db-cue-bounce`）。`whatsapp-sheen` 需確認是否屬於 CTA 反饋（若屬則保留 once 版本）。**

### `prefers-reduced-motion` 覆蓋情況

| 位置 | 覆蓋範圍 | 完整性 |
|------|---------|--------|
| `index.css:1090-1101` | hero section 的全部動畫 | ✅ 完整 |
| `editorial-system.css:459-468` | site-editorial-rise | ✅ 完整 |
| `home-compact-refresh.css:68-71,122-127` | header-glass-flow、whatsapp-breathe | ✅（但動畫本身應刪除） |
| `home-editorial-phase3.css:642-648` | .home-editorial animations | ✅ |
| `home-mobile-optimization.css:278-281` | mobile 動畫 | ✅ |
| `home-reference-inspired.css:2032-2037` | scene 動畫 | ✅ |
| `services-guide-phase4.css:766-773` | phase4 動畫 | ✅ |
| `visual-upgrade.css:948-954` | visual-upgrade 動畫 | ✅ |

**`prefers-reduced-motion` 覆蓋率：所有現有動畫均有對應覆蓋（24+ 處）。Brief §6 的 `prefers-reduced-transparency` 後備：0 處，完全缺失。**

---

## 6. 玻璃（backdrop-filter）清冊

Brief §6 允許的 5 個玻璃表面：① header、② 底部 CTA、③ WhatsApp 對話框、④ 輪播控制、⑤ hero 卡

| 位置 | blur 值 | 選擇器 | 是否在允許清單 |
|------|--------|-------|--------------|
| `home-compact-refresh.css:25-26` | blur(24px) saturate(175%) | `.site-header--home:not(scrolled)` | ✅ header |
| `home-compact-refresh.css:32-33` | blur(22px) saturate(165%) | `[data-site-header="true"]` | ✅ header |
| `home-compact-refresh.css:59-60` | blur(24px) saturate(175%) | `.site-header--home-scrolled` | ✅ header |
| `home-reference-inspired.css:21` | blur(18px) saturate(135%) | `.site-header--shared` | ✅ header |
| `home-reference-inspired.css:115` | blur(18px) | 需查選擇器 | ⚠️ 待確認 |
| `home-reference-inspired.css:451-452` | blur(14px) saturate(115%) | 需查選擇器 | ⚠️ 待確認 |
| `home-reference-inspired.css:522-657` | blur(0.5px–48px)（8 個工具 class） | `.db-blur-*` 工具 class | 🚫 **沒有 `.glass` class，自由散用，任何人可引入** |
| `home-reference-inspired.css:694-695` | blur(16px) saturate(120%) | 需查選擇器 | ⚠️ 待確認 |
| `visual-upgrade.css:90,898` | `none` | 明確取消 | ✅ 清理行為 |

**核心問題：**
1. **無 `.glass` class**（Brief §6 要求統一入口），backdrop-filter 散落 13+ 處。
2. `home-reference-inspired.css:522-657` 有 8 個不同 blur 強度的工具 class（0.5px 到 48px），任何元素均可套用，無 Brief 限制。
3. **無任何 `prefers-reduced-transparency` 後備**（`@media (prefers-reduced-transparency: reduce) { backdrop-filter: none }`）。

---

## 7. 各頁系統歸屬

### 靜態路由（`client/src/App.tsx:78-93`）

| 路由 | 頁面元件 | CSS 系統 class | 生效的主要 CSS 家族 | 跨系統混用 |
|------|---------|--------------|-------------------|-----------|
| `/` | `Home.tsx` | `.home-editorial` + `.home-editorial--compact` | Phase1（index.css PR20）＋ Phase3（home-editorial-phase3.css）＋ compact-refresh（home-compact-refresh.css）＋ home-reference-inspired.css | ⚠️ **3 個系統疊加**；phase3 覆寫 phase1 typography；compact-refresh 再覆寫背景色 |
| `/services` | `Services.tsx` | `.phase4-services` | Phase4（services-guide-phase4.css）＋ editorial-art-direction.css（強制 radius=0）＋ visual-upgrade.css（token 覆寫） | ⚠️ art-direction 強制 `border-radius: 0 !important` 覆蓋 phase4 style |
| `/services/:slug` | `ServiceDetail.tsx` | `.phase4-service-detail` | Phase4 ＋ editorial-art-direction.css | 同上 |
| `/drain-diagnosis` | `DrainDiagnosis.tsx` | 無系統 class | 依賴全域 token | ✅ 較乾淨，但 token 最終值已被 visual-upgrade 改動 |
| `/service-process` | `ServiceProcess.tsx` | 無系統 class | 全域 token | ✅ |
| `/guide` | `Guide.tsx` | `.phase4-guide` | Phase4 ＋ editorial-art-direction.css | ⚠️ |
| `/areas` | `Areas.tsx` | `.areas-editorial` | motionsites-inner-pages.css ＋ editorial-system.css | ✅ 單一系統 |
| `/areas/:slug` | `District.tsx` | 未偵測到系統 class | 全域 token | 需 Phase 1 確認 |
| `/blog` | `Blog.tsx` | 未偵測到系統 class | editorial-system.css（.site-article-card 全域）＋ 全域 token | 需 Phase 1 確認 |
| `/blog/:slug` | `BlogPost.tsx` | 未偵測到系統 class | editorial-system.css ＋ 全域 token | 需 Phase 1 確認 |
| `/cases` | `CaseStudies.tsx` | 未偵測到系統 class | editorial-system.css（.case-studies-hero 全域）＋ 全域 token | ✅ |
| `/cases/:slug` | （動態，Sanity） | 未偵測到系統 class | editorial-system.css | 需 Phase 1 確認 |
| `/faq` | `FAQ.tsx` | 未偵測到系統 class | 全域 token | ✅ |
| `/thanks` | `Thanks.tsx` | 未偵測到系統 class | 全域 token | ✅ |
| `/404` | `NotFound.tsx` | `.stage6a-not-found` | stage6a（secondary-pages-stage6a.css）＋ 全域 token | ✅ 單一系統 |

### 動態路由代表 slug（截圖已覆蓋）

- `/areas/kwun-tong` — `.areas-editorial`（同 `/areas`）
- `/services/toilet-unblocking` — `.phase4-service-detail`
- `/cases/:slug` — Sanity 動態，依賴 editorial-system.css 全域 class
- `/blog/whatsapp-drain-quote-checklist` — 無系統 class，依賴全域

### Brief 與 caseData 的出入

Brief §8 提及 `client/src/lib/caseData.ts`，**此檔案不存在**。案例數據來自 Sanity CMS，透過 `client/src/lib/caseRepository.ts` 的 `getPublishedCaseStudies()` 取得。Phase 1 可忽略此出入，直接處理 Sanity 呈現層。

---

## 8. 死碼與待補素材清單

### 死碼元件（零 App 路由引用）

| 元件 | 定義位置 | 現有引用 | 相關依賴 | 建議 |
|------|---------|---------|---------|------|
| `AIChatBox` | `components/AIChatBox.tsx` | `pages/ComponentShowcase.tsx:174`（ComponentShowcase 本身無路由） | — | 🗑 Phase 1 刪除 |
| `DashboardLayout` | `components/DashboardLayout.tsx` | 僅 `DashboardLayoutSkeleton`（互相引用，無外部路由） | — | 🗑 Phase 1 刪除 |
| `DashboardLayoutSkeleton` | `components/DashboardLayoutSkeleton.tsx` | 同上 | — | 🗑 Phase 1 刪除 |
| `ManusDialog` | `components/ManusDialog.tsx` | 0 | — | 🗑 Phase 1 刪除 |
| `ServiceQuickSelect` | `components/ServiceQuickSelect.tsx` | 0 | — | 🗑 Phase 1 刪除 |
| `DirectModeCard` | `components/DirectModeCard.tsx` | 0 | — | 🗑 Phase 1 刪除 |
| `ComponentShowcase` | `pages/ComponentShowcase.tsx` | 0（App.tsx 無路由） | `AIChatBox` | 🗑 Phase 1 刪除 |

### 仍在使用的元件（非死碼，但值得留意）

| 元件 | 使用頁面 | 相關依賴 | 備注 |
|------|---------|---------|------|
| `GhostFibers` | `Layout.tsx:32,426`、`Home.tsx:11,113`、`ServiceDetail.tsx:13,105`、`Services.tsx:26,198` | `ogl`（WebGL 依賴，`package.json`） | ✅ 仍在用；`ogl` 是真實依賴，不可隨意刪除。Brief 未提及移除，Phase 1 記錄備查 |
| `Map.tsx` | 目前只有 Google Maps API 使用示例（全文皆為 JSDoc 註解），無實際 render | — | 疑似未完成功能，Phase 1 確認後可刪 |

### CSS 待刪區塊

| 區塊 | 位置 | 說明 |
|------|------|------|
| `.dark {}` block | `index.css:122-155` | 全部 oklch 藍紫色，brief §12 明文要刪 |
| `PR20_EDITORIAL_FOUNDATION_START/END` | `index.css:544-872` | 被後載的 phase3/visual-upgrade 大量覆寫，Phase 2 清理 |
| `HOME_VISUAL_SYSTEM_PHASE1_START/END` | `index.css:874-1102` | 同上，Phase 2 合併到單一 token 系統 |

### Brief §11 待補素材現況

| 素材 | Brief 要求 | 現況 |
|------|-----------|------|
| 真實案例相片 | 實際施工照片（非示意圖） | 🔲 未提供；現用 Cloudinary 圖片為概念圖 |
| 公司登記證明 | 顯示於 footer / about | 🔲 未有 |
| Google 評價 | 嵌入真實評分 | 🔲 未有（`SiteSettingsContext.tsx:22` 指向 Google Maps 搜尋頁，非 Places API 評分） |
| 師傅相 | 人像照配簡介 | 🔲 未有 |
| Logo | 正式 SVG/PNG Logo | ⚠️ Cloudinary 有 mascot 圖（`index.html:47`），但品質與格式需確認 |
| 舊電話號碼 | 需清除 `6531 8580` | ✅ 代碼已乾淨；僅殘留在 `ideas.md`、`reference-notes.md`、`optimization-summary.md`（文件）|
| Emoji 限制 | 禁止正文 emoji | ✅ 僅 `components/Map.tsx` 的 JSDoc 註解有 emoji，非呈現層 |

---

## 附錄：截圖基準位置

```
audits/before/
  375px/          # 14 個路由，正常動畫
  375px-reduced-motion/  # 同上，reduced-motion
  1440px/         # 14 個路由，正常動畫
  1440px-reduced-motion/ # 同上，reduced-motion
```

56 張 PNG，全部成功（56/56）。重跑方法：

```bash
# 需先啟動 dev server（port 3002）
node scripts/audit-screenshots.mjs
```

---

*Phase 0 完成。等待確認後進入 Phase 1。*
