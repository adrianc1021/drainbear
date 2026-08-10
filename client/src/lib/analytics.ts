/**
 * 通渠熊 DrainBear — 統一 Analytics 模組（GA4 + Google Ads 共存）
 *
 * 事件 Taxonomy 詳見 docs/analytics-taxonomy.md。核心事件：
 *  - whatsapp_click / phone_click：聯絡 CTA 點擊（cta_location、page_path、topic）
 *  - whatsapp_open：/thanks 頁觸發，真實對話開啟率代理轉換
 *  - area_click：地區互動（地圖／搜尋／連結；area_name）
 *  - quote_calculator_start / quote_calculator_complete：估價計算機
 *  - blog_post_click / blog_read：Blog 內容互動
 *  - contact_form_start / contact_form_submit / contact_form_error：聯絡表格（helpers 已備妥）
 *  - cta_click / service_click / navigation_click / pricing_click：導航及內容互動
 *
 * 配置：
 *  - VITE_GA4_MEASUREMENT_ID（建議）或 VITE_GA4_ID（舊名兼容）或 window.__GA4_ID__
 *  - 未設定 GA4 ID：網站正常運作，事件推入 dataLayer 佇列，不載入額外腳本
 *  - 開發環境：預設不上報 GA4（避免污染正式數據）；設 VITE_GA4_DEBUG="true"
 *    可於開發環境以 debug_mode 上報，事件會出現在 GA4 DebugView
 *
 * Google Ads：client/index.html 已載入 gtag.js（AW-18128738982）。本模組
 * 重用同一 gtag.js 及 dataLayer，只以 gtag('config', 'G-…') 附加 GA4，
 * 絕不重複載入腳本，也不改動 Ads 轉換設定。
 *
 * 私隱紅線：不得傳送姓名、電話、電郵、地址或表格內容到 GA4。
 * sendEvent 內建 PII 樣式防護，疑似個人資料的參數值會被整個丟棄。
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __GA4_ID__?: string;
  }
}

// ---------------------------------------------------------------------------
// 配置解析
// ---------------------------------------------------------------------------

function resolveGa4Id(): string | undefined {
  const fromWindow =
    typeof window !== "undefined" ? window.__GA4_ID__ : undefined;
  const fromEnv =
    (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined) ||
    (import.meta.env.VITE_GA4_ID as string | undefined);
  const id = fromWindow || fromEnv;
  return id && id.trim() ? id.trim() : undefined;
}

const IS_DEV = Boolean(import.meta.env.DEV);
const DEV_DEBUG_ENABLED = import.meta.env.VITE_GA4_DEBUG === "true";

/** GA4 是否應該實際上報（有 ID，且非開發環境或已明確開啟 debug 上報） */
function isGa4Active(): boolean {
  return Boolean(resolveGa4Id()) && (!IS_DEV || DEV_DEBUG_ENABLED);
}

let initialized = false;

/**
 * 初始化 Analytics。
 * - 確保 dataLayer 與 gtag stub 存在（與 index.html 的 Ads 片段共用）
 * - GA4 ID 已配置且允許上報時：附加 GA4 config；gtag.js 已由 Ads 片段載入
 *   則直接重用，否則才動態載入一次
 * - 未配置時：僅建立 dataLayer 佇列，網站功能完全不受影響
 */
export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

  if (!isGa4Active()) {
    if (IS_DEV && resolveGa4Id()) {
      console.info(
        "[analytics] 開發環境已停用 GA4 上報（設 VITE_GA4_DEBUG=\"true\" 可啟用 DebugView 上報）",
      );
    }
    return;
  }

  const ga4Id = resolveGa4Id()!;

  // 重用已存在的 gtag.js（index.html Google Ads 片段已載入），避免重複載入。
  const alreadyLoaded = Boolean(
    document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
  );
  if (!alreadyLoaded) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
    document.head.appendChild(s);
    window.gtag("js", new Date());
  }

  window.gtag("config", ga4Id, {
    send_page_view: true,
    ...(IS_DEV ? { debug_mode: true } : {}),
  });
}

// ---------------------------------------------------------------------------
// 事件發送核心
// ---------------------------------------------------------------------------

/** 允許的事件參數鍵（統一 Taxonomy，白名單以外的鍵不會被傳送） */
export interface AnalyticsEventParams {
  cta_location?: string;
  cta_label?: string;
  page_path?: string;
  page_title?: string;
  destination_url?: string;
  service_name?: string;
  area_name?: string;
  article_slug?: string;
  topic?: string;
  form_name?: string;
  error_type?: string;
  read_percent?: number;
}

const ALLOWED_PARAM_KEYS: ReadonlyArray<keyof AnalyticsEventParams> = [
  "cta_location",
  "cta_label",
  "page_path",
  "page_title",
  "destination_url",
  "service_name",
  "area_name",
  "article_slug",
  "topic",
  "form_name",
  "error_type",
  "read_percent",
];

// 疑似個人資料樣式：電郵、8 位以上連續數字（香港電話）、+852 開頭
const PII_PATTERNS = [
  /[\w.+-]+@[\w-]+\.[\w.]+/, // email
  /(?:\+?852[\s-]?)?\d{4}[\s-]?\d{4,}/, // HK phone-like
];

function looksLikePII(value: string): boolean {
  return PII_PATTERNS.some((re) => re.test(value));
}

/**
 * 統一事件發送：
 * - 只保留白名單參數鍵；疑似 PII 的字串值整個丟棄並警告
 * - 自動補上 page_path / page_title
 * - gtag 可用時經 gtag('event')；否則推入 dataLayer 佇列（GA4 未配置亦不報錯）
 */
export function sendEvent(
  eventName: string,
  params: AnalyticsEventParams = {},
) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  const clean: Record<string, string | number> = {};
  for (const key of ALLOWED_PARAM_KEYS) {
    const value = params[key];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "string" && looksLikePII(value)) {
      console.warn(
        `[analytics] 參數 ${key} 疑似含個人資料，已丟棄（事件 ${eventName}）`,
      );
      continue;
    }
    clean[key] = value;
  }

  if (clean.page_path === undefined && window.location) {
    clean.page_path = window.location.pathname;
  }
  if (
    clean.page_title === undefined &&
    typeof document !== "undefined" &&
    document.title
  ) {
    clean.page_title = document.title;
  }

  if (window.gtag && isGa4Active()) {
    window.gtag("event", eventName, clean);
  } else if (window.gtag && !isGa4Active() && !resolveGa4Id()) {
    // gtag stub 存在但 GA4 未配置：入佇列，日後接 GTM/GA4 可回收
    window.dataLayer.push({ event: eventName, ...clean });
  } else if (window.gtag) {
    // 開發環境停用上報：僅記錄到 console 方便驗證
    if (IS_DEV) console.debug(`[analytics] (dev, 未上報) ${eventName}`, clean);
    window.dataLayer.push({ event: eventName, ...clean });
  } else {
    window.dataLayer.push({ event: eventName, ...clean });
  }
}

// ---------------------------------------------------------------------------
// SPA Pageview
// ---------------------------------------------------------------------------

let lastTrackedPath: string | null = null;

/**
 * SPA 路由變更 page_view（首次載入由 gtag config 的 send_page_view 處理，
 * 呼叫端應跳過第一次）。同一路徑不重複上報。
 */
export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  if (path === lastTrackedPath) return;
  lastTrackedPath = path;

  const ga4Id = resolveGa4Id();
  if (window.gtag && ga4Id && isGa4Active()) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: typeof document !== "undefined" ? document.title : undefined,
      page_location:
        typeof location !== "undefined"
          ? `${location.origin}${path}`
          : undefined,
    });
  }
}

// ---------------------------------------------------------------------------
// 聯絡 CTA（現有 API，保持簽名不變）
// ---------------------------------------------------------------------------

export type CtaChannel = "whatsapp" | "phone" | "map";

/**
 * 追蹤聯絡 CTA 點擊（現有呼叫點沿用，不需改動）。
 * @param channel  whatsapp | phone | map
 * @param location CTA 位置標籤，如 header / mobile_bar / floating_widget / price_calculator
 * @param topic    可選：查詢主題摘要（channel="map" 時視為地區名 area_name）
 *
 * 事件對應：whatsapp → whatsapp_click；phone → phone_click；
 * map → area_click（原 map_district_click 統一命名；GA4 未接駁，無歷史數據斷層）
 */
export function trackCTA(
  channel: CtaChannel,
  location: string,
  topic?: string,
) {
  if (channel === "map") {
    sendEvent("area_click", {
      cta_location: location,
      ...(topic ? { area_name: topic } : {}),
    });
    return;
  }
  sendEvent(channel === "whatsapp" ? "whatsapp_click" : "phone_click", {
    cta_location: location,
    ...(topic ? { topic } : {}),
  });
}

/**
 * WhatsApp 點擊後跳轉感謝頁（/thanks）：
 * - WhatsApp 於新分頁/App 開啟（原 <a target="_blank"> 行為不變，不阻擋開啟）
 * - 原分頁延遲 600ms 導向 /thanks?from=<cta_location>
 * - /thanks 頁面觸發 whatsapp_open 事件，作為「真實對話開啟率」的代理轉化指標
 */
export function goThanksAfterWhatsApp(location: string) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    // 使用 wouter 以外的原生導向，確保任何組件情境都可用
    window.history.pushState(
      null,
      "",
      `/thanks?from=${encodeURIComponent(location)}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, 600);
}

/** /thanks 頁面觸發：whatsapp_open 轉化事件（真實對話開啟率代理指標） */
export function trackWhatsAppOpen(from: string) {
  sendEvent("whatsapp_open", { cta_location: from, page_path: "/thanks" });
}

// ---------------------------------------------------------------------------
// 聯絡表格（helpers 備妥；前台表格建立後接上）
// ---------------------------------------------------------------------------

const formStartTracked = new Set<string>();

/** 表格開始填寫（每個表格每次載入只記一次） */
export function trackContactFormStart(formName: string, location?: string) {
  const key = formName;
  if (formStartTracked.has(key)) return;
  formStartTracked.add(key);
  sendEvent("contact_form_start", {
    form_name: formName,
    ...(location ? { cta_location: location } : {}),
  });
}

/** 表格成功提交（必須在伺服器確認成功後呼叫，不重複記錄由呼叫端保證單次觸發） */
export function trackContactFormSubmit(formName: string, location?: string) {
  sendEvent("contact_form_submit", {
    form_name: formName,
    ...(location ? { cta_location: location } : {}),
  });
}

/** 表格提交錯誤（只傳錯誤類型，不傳錯誤訊息內文以免夾帶個人資料） */
export function trackContactFormError(formName: string, errorType: string) {
  sendEvent("contact_form_error", {
    form_name: formName,
    error_type: errorType,
  });
}

// ---------------------------------------------------------------------------
// 估價計算機
// ---------------------------------------------------------------------------

let quoteStartTracked = false;
let lastQuoteCompleteKey: string | null = null;

/** 估價計算機開始互動（每次頁面載入只記一次） */
export function trackQuoteCalculatorStart() {
  if (quoteStartTracked) return;
  quoteStartTracked = true;
  sendEvent("quote_calculator_start", { cta_location: "price_calculator" });
}

/** 估價計算機完成估價（同一選項組合只記一次；topic 為選項摘要，不含個人資料） */
export function trackQuoteCalculatorComplete(comboKey: string, topic?: string) {
  if (lastQuoteCompleteKey === comboKey) return;
  lastQuoteCompleteKey = comboKey;
  sendEvent("quote_calculator_complete", {
    cta_location: "price_calculator",
    ...(topic ? { topic } : {}),
  });
}

// ---------------------------------------------------------------------------
// 導航及內容互動
// ---------------------------------------------------------------------------

export type NavClickKind =
  | "cta"
  | "service"
  | "area"
  | "blog_post"
  | "navigation"
  | "pricing";

const NAV_EVENT_NAMES: Record<NavClickKind, string> = {
  cta: "cta_click",
  service: "service_click",
  area: "area_click",
  blog_post: "blog_post_click",
  navigation: "navigation_click",
  pricing: "pricing_click",
};

/** 導航／內容連結點擊（cta_click / service_click / area_click / blog_post_click / navigation_click / pricing_click） */
export function trackNavClick(
  kind: NavClickKind,
  params: Pick<
    AnalyticsEventParams,
    | "cta_location"
    | "cta_label"
    | "destination_url"
    | "service_name"
    | "area_name"
    | "article_slug"
  >,
) {
  sendEvent(NAV_EVENT_NAMES[kind], params);
}

const blogReadTracked = new Set<string>();

/** Blog 文章實際閱讀（捲動 60% 或停留 45 秒；每篇每次載入只記一次） */
export function trackBlogRead(slug: string, readPercent?: number) {
  if (blogReadTracked.has(slug)) return;
  blogReadTracked.add(slug);
  sendEvent("blog_read", {
    article_slug: slug,
    ...(readPercent !== undefined ? { read_percent: readPercent } : {}),
  });
}

// ---------------------------------------------------------------------------
// 測試專用：重設模組內部去重狀態（正式程式碼不應呼叫）
// ---------------------------------------------------------------------------

export function __resetAnalyticsStateForTests() {
  initialized = false;
  lastTrackedPath = null;
  quoteStartTracked = false;
  lastQuoteCompleteKey = null;
  formStartTracked.clear();
  blogReadTracked.clear();
}
