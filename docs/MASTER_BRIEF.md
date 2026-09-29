# 通渠熊 DrainBear — MASTER_BRIEF v2.1

> **此文件是項目唯一真相來源（Single Source of Truth）。**
> 所有設計、開發及驗收決定均以此為準。如與舊版 brief、舊筆記或舊 code 有牴觸，以此文件為準。
>
> 版本：v2.1 · 日期：2026-09-28

---

## §1 項目概況

**品牌**：通渠熊 DrainBear（香港通渠服務公司）
**目標**：對現有多輪迭代堆疊出嚟嘅視覺系統做全面收斂，建立單一 token 體系，統一元件語言，移除死碼及違規動畫，並按6個階段逐步交付。
**部署平台**：Vercel（`vercel.json` 確認）
**聯絡電話（唯一來源）**：+852 9558 8260，定義於 `client/src/lib/contact.ts`

---

## §2 技術棧

| 層 | 技術 |
|---|---|
| 框架 | Vite + React 19 + TypeScript |
| 樣式 | Tailwind v4 + shadcn/Radix |
| API | tRPC |
| 資料庫 ORM | Drizzle ORM |
| 部署 | Vercel |
| 套件管理 | pnpm（使用 `npx pnpm@10.4.1`，`-w` flag for workspace root installs） |
| 測試 | Playwright（截圖）、vitest |

**Monorepo 結構**：root `package.json` 位於 `~/drainbear/`，client 程式碼位於 `~/drainbear/client/src/`，無獨立 `client/package.json`。

---

## §3 工具 / Skills

| Skill | 用途 |
|---|---|
| `web-design-guidelines` | 每階段 §3.3 格式審查清單 |
| `vercel-react-best-practices` | React 最佳實踐 |
| `vercel-composition-patterns` | 元件組合模式 |
| `vercel-optimize` | Vercel 部署優化（階段 6） |
| `accesslint` | WCAG 無障礙審查 |

**§3.2 Skills 使用規則**：每次使用 Skills 前須列明 purpose、tone、constraints、differentiation。`frontend-design` 建議可接受基本排版原則，但以下建議一律否決：grain texture、gradient mesh、自訂游標、斜向排版、換字體。

**§3.3 web-design-guidelines 審查格式**：

```
## web-design-guidelines 審查（§3.3）
### 已修正
- `file:line` — 問題說明
### 待確認
- `file:line` — 問題說明
```

---

## §4 硬性規則（不可違反）

1. **聯絡資料**只以 `client/src/lib/contact.ts` 為準（+852 9558 8260）。全 repo 搜尋並移除任何「6531 8580」殘留。
2. **不可捏造**：評價、案例、數據、牌照、獎項。
3. **「真實案例」區**只可放真實工程相片；AI 生成圖一律標示「示意圖」，且不可出現在案例區。
4. **不可改動**：URL 路由、SEO/JSON-LD、GA4 事件名稱、prerender 流程、現有文案的意思。
5. **不可新增重型依賴**或 WebGL 背景；不可加入人為延遲。
6. **不可在任何檔案寫入 API key、token 或密碼**（repo 是公開的）。
7. **每階段完成後必須通過**：`pnpm check`、`pnpm test`、全部 `verify:*` 腳本、`web-design-guidelines` 審查，以及 Playwright 截圖（375px、1440px × 所有路由）。

---

## §5 設計 Token 系統

### §5.1 品牌色（7 個 canonical token）

所有顏色 hex 值**只可出現在 `client/src/styles/tokens.css`**，其他所有 CSS/TSX 只能用 `var(--token-name)` 或 `color-mix()`。

| Token | 值 | 用途 |
|---|---|---|
| `--brand-navy` | `#0b132b` | 主色：深色背景、標題文字 |
| `--brand-navy-2` | `#1c2541` | 次深色：卡片、hover 背景 |
| `--brand-orange` | `#ff7a00` | 強調色：CTA 標籤、流程數字 |
| `--brand-wa` | `#25d366` | WhatsApp 綠：主要 CTA |
| `--brand-wa-dark` | `#1eb556` | WhatsApp 深綠：hover 狀態 |
| `--surface-0` | `#ffffff` | 純白背景 |
| `--surface-1` | `#f4f7fb` | 淺灰藍背景 |
| `--text-1` | `#0b132b` | 主要文字（同 brand-navy） |
| `--text-2` | `#526078` | 次要文字 |

**§5.1 v2.1 衍生色規則**：衍生色（邊框、hover、disabled、muted）只可用 `color-mix()` 或透明度從上述 7 個 token 計算；hex 值只可出現在 `tokens.css`。禁止在任何其他檔案使用 `bg-[#xxxxxx]` Tailwind arbitrary value。

**舊別名（待移除清單，Phase 2 刪除）**：

```
--navy → var(--brand-navy)
--navy-light → var(--brand-navy-2)
--wagreen → var(--brand-wa)
--wagreen-dark → var(--brand-wa-dark)
--safety → var(--brand-orange)
--mist → var(--surface-1)
--db-safety → var(--brand-orange)
--db-whatsapp → var(--brand-wa)
--db-whatsapp-dark → var(--brand-wa-dark)
--db-ink → var(--brand-navy)
--phase4-safety → var(--brand-orange)
--site-safety → var(--brand-orange)
```

### §5.2 圓角與陰影

**圓角 2 級**：

| Token | 值 | 用途 |
|---|---|---|
| `--radius-sm` | `8px` | 按鈕、輸入框、小卡片 |
| `--radius-lg` | `16px` | 大卡片、面板、圖片 |
| （允許） | `50%` | 圓形元素 |
| （允許） | `999px` / `9999px` | pill 標籤 |

禁止出現 `4px`、`6px`、`12px`、`30px`、`clamp(...)` 等其他值。

**陰影 2 級**：

| Token | 值 | 用途 |
|---|---|---|
| `--shadow-soft` | `0 1px 2px rgba(11,19,43,0.04), 0 8px 24px rgba(11,19,43,0.055)` | 卡片靜止狀態 |
| `--shadow-raised` | `0 4px 12px rgba(11,19,43,0.07), 0 16px 36px rgba(11,19,43,0.09)` | 卡片 hover、浮動層 |

禁止出現其他自訂 box-shadow 值（rgba() 裝飾性 offset shadow 亦不允許）。

### §5.3 字體

自託管 Noto Sans HK：`@fontsource/noto-sans-hk`，chinese-hongkong 及 latin 子集，weights 400/700/900，woff2 由 Vite 打包。禁止從外部 CDN 載入任何字體（包括 Material Icons）。

---

## §6 玻璃效果（GlassPanel）

`backdrop-filter` 及 `prefers-reduced-transparency` **留到階段 4**，透過階段 2 建立的 `GlassPanel` 元件統一實施。現有散落的 `backdrop-filter` 暫時保留，不在 Phase 1–3 動。

允許使用 `backdrop-filter` 的位置（Phase 4 GlassPanel 負責）：
- 全站 header
- 底部 sticky CTA bar
- WhatsApp 對話框
- 輪播控制
- Hero 卡片

---

## §7 動態規則

允許的動態（M1–M6）：

| 代號 | 說明 |
|---|---|
| M1 | hover/focus 狀態切換（transform translateY、color、background，120–240ms） |
| M2 | 卡片 hover 抬升（shadow + translateY(-2px)，240ms） |
| M3 | 頁面入場 fade-up（`data-entered="true"` trigger，420ms） |
| M4 | Sheen/shine 效果（hover 觸發，非 infinite） |
| M5 | scroll-linked parallax（`will-change: transform`，低強度） |
| M6 | promise-banner-settle（once，`prefers-reduced-motion: no-preference` guard） |

**禁止的動態**（已刪除）：
- `animation: header-glass-flow 8s ease-in-out infinite alternate`
- `animation: whatsapp-breathe 3.8s ease-in-out infinite`
- `animation: whatsapp-sheen 3.4s ease-in-out infinite`
- `animation: db-cue-bounce 1800ms ease-in-out infinite`
- 任何未被 `prefers-reduced-motion: no-preference` guard 保護的 `infinite` 動畫

所有動畫必須有 `prefers-reduced-motion: reduce` fallback。

---

## §8 元件語言

Phase 2 建立的 shared component 清單（待建立）：

- `GlassPanel` — 統一 `backdrop-filter` 實施
- `SectionHeader` — 統一 eyebrow/title/description pattern
- `CTAButton` — 主要/次要/WhatsApp 三種變體
- `ServiceCard` — 服務卡片
- `EditorialHero` — 頁首 hero
- `ProofBadge` — 信任標誌

---

## §9 無障礙（WCAG 2.1 AA）

- 正文文字對比度 ≥ 4.5:1
- 大型文字（18px bold / 24px 以上）≥ 3:1
- 所有互動元素有可見 focus-visible ring
- 點擊目標 ≥ 44px（手機）
- 不可只用顏色傳遞狀態（搭配圖標或文字）
- 所有 `<img>` 有語意化 `alt` 屬性

---

## §10 SEO / 結構化資料

- 每頁獨立 `<title>`、`<meta description>`、`<canonical>`、OG 標籤
- JSON-LD：LocalBusiness、FAQPage、Service、BreadcrumbList
- 唯一 `<h1>` per page
- 語意化 HTML（`<section>`、`<article>`、`<nav>`）
- 禁止改動現有 URL 路由、JSON-LD schema、GA4 事件名稱、prerender 流程

---

## §11 待補素材清單

以下項目目前標記為【待填】，相關區塊使用 placeholder：

- 真實工程相片（「真實案例」區專用）
- 公司商業登記資料
- Google 評價（真實）
- 師傅相片
- 品牌 Logo 最終版

---

## §12 死碼刪除清單

以下元件 / 資源已於 Phase 1 刪除（0 import 引用，超出頁面功能範圍）：

- `ServiceQuickSelect` — 服務快速選擇 UI（原定首頁用，從未實際渲染於任何路由頁面）
- `DirectModeCard` — Direct mode 卡片（早期 UX 探索，從未部署）
- `ComponentShowcase` — 元件展示頁（開發工具，非生產頁面）
- `AIChatBox`、`DashboardLayout`、`DashboardLayoutSkeleton`、`ManusDialog` — 已於更早期 PR 中棄用
- `GhostFibers` — WebGL fiber 背景（連帶 `ogl` 依賴，違反 §4 Rule 5）
- Material Icons CDN link（`index.html`）

---

## §13 Branch 策略

| Branch | 用途 |
|---|---|
| `main` | 生產，只接 PR merge |
| `phase-1/token-cleanup` | Phase 1 所有工作 |
| `phase-2/shared-components` | Phase 2（未開始） |
| `phase-3/editorial`、`phase-4/glass` 等 | 後續階段 |

---

## §14 階段計劃

| 階段 | 內容 | 狀態 |
|---|---|---|
| Phase 0 | 全站視覺審計（唯讀） | ✅ 完成 |
| Phase 1 | Token 收斂（色彩、圓角、陰影）、字體自託管、死碼刪除 | 🔄 進行中 |
| Phase 2 | 建立 Shared Components（GlassPanel、CTAButton 等）、移除舊別名 | ⏳ 待開始 |
| Phase 3 | Editorial 系統統一（首頁、服務頁、地區頁） | ⏳ 待開始 |
| Phase 4 | GlassPanel 統一 backdrop-filter、prefers-reduced-transparency | ⏳ 待開始 |
| Phase 5 | 地區頁 SEO 內容補完 | ⏳ 待開始 |
| Phase 6 | Vercel 部署優化（`vercel-optimize` skill） | ⏳ 待開始 |

---

## §15 進度記錄（Change Log）

### v2.1（2026-09-28）
- 加入 §5.1 v2.1 衍生色規則（`color-mix()` / 透明度限制）
- 修正 §14 進度記錄：動畫移除工作為「階段 4 提前完成項目（§7）」，**不屬於 Phase 2**；Phase 2（Shared Components）尚未開始

### v2.0（2026-09-28）
- Phase 0 審計完成：8,861 行 CSS、13 個檔案、97 個不同 hex 值、4 套競爭 token 家族已記錄於 `audits/visual-audit.md`
- 建立 `tokens.css`：7 個 canonical token + 相容層別名
- 刪除：`.dark` 區塊、`PR20_EDITORIAL_FOUNDATION`、`HOME_VISUAL_SYSTEM_PHASE1`
- 刪除：GhostFibers（含 `ogl` 依賴）、5 個零引用元件
- 自託管：Noto Sans HK 400/700/900（woff2，Vite 打包）
- 移除：Material Icons CDN link
- **階段 4 提前完成項目**：移除 4 個禁止 `infinite` 動畫
  - `header-glass-flow 8s infinite`（home-compact-refresh.css）
  - `whatsapp-breathe 3.8s infinite`（home-compact-refresh.css）
  - `whatsapp-sheen 3.4s infinite`（home-compact-refresh.css）
  - `db-cue-bounce 1800ms infinite`（home-reference-inspired.css）

### v1.0（2026-09 早期）
- 初始 brief 建立（設計方向、配色系統確認）

