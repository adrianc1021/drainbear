/**
 * 通渠熊 DrainBear — 統一 Analytics 模組(GA4 + Google Ads 共存)
 *
 * 事件 Taxonomy 詳見 docs/analytics-taxonomy.md。
 *
 * 設計原則:
 * - 本模組只提供「純事件發送 Helper」,不持有跨頁面瀏覽的去重狀態。
 *   「每次頁面/文章瀏覽一次」的去重由各 Component 以 useRef 於 Mount
 *   生命週期內管理(見 perViewDedup.ts、blogReadTracker.ts)。
 *
 * 配置:
 * - VITE_GA4_MEASUREMENT_ID(建議)或 VITE_GA4_ID(舊名兼容)或 window.__GA4_ID__
 * - Measurement ID 必須符合 G-XXXXXXXXXX 格式;格式不正確時 GA4 不會初始化、
 *   錯誤值不會傳給 gtag config,網站照常運作(開發環境顯示警告)
 * - 未設定 GA4 ID:網站正常運作,不載入額外腳本;事件只推入當前頁面的
 *   dataLayer 作除錯/相容用途 —— 該佇列不會永久儲存,重新整理即消失,
 *   亦不能補回 GA4 安裝前的歷史數據
 * - 開發環境:預設不上報 GA4(避免污染正式數據);設 VITE_GA4_DEBUG="true"
 *   可於開發環境以 debug_mode 上報,事件會出現在 GA4 DebugView
 *
 * Google Ads:client/index.html 已載入 gtag.js(AW-18128738982)。本模組
 * 重用同一 gtag.js 及 dataLayer,只以 gtag('config', 'G-…') 附加 GA4,
 * 絕不重複載入腳本,也不改動 Ads 轉換設定。所有自訂事件均以 send_to
 * 明確指定 GA4 Measurement ID,避免誤送到 Google Ads Destination。
 *
 * 私隱紅線:不得傳送姓名、電話、電郵、地址或表格內容到 GA4。
 * sendEvent 內建 PII 樣式防護,疑似個人資料的參數值會被整個丟棄。
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __GA4_ID__?: string;
  }
}

// ---------------------------------------------------------------------------
// GA4 Measurement ID 驗證(純函式,可獨立測試)
// ---------------------------------------------------------------------------

/**
 * 驗證 GA4 Measurement ID 格式(G- 開頭,後接 4–16 位大寫英數)。
 * 例:G-XXXXXXXXXX。AW-(Google Ads)、UA-(Universal Analytics)等一律拒絕。
 */
export function isValidGa4Id(value: unknown): value is string {
  return typeof value === "string" && /^G-[A-Z0-9]{4,16}$/.test(value.trim());
}

// ---------------------------------------------------------------------------
// 配置解析
// ---------------------------------------------------------------------------

let invalidIdWarned = false;

/** 取得原始設定值(未驗證) */
function rawGa4Id(): string | undefined {
  const fromWindow =
    typeof window !== "undefined" ? window.__GA4_ID__ : undefined;
  const fromEnv =
    (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined) ||
    (import.meta.env.VITE_GA4_ID as string | undefined);
  const id = fromWindow || fromEnv;
  return id && id.trim() ? id.trim() : undefined;
}

/**
 * 取得已驗證的 GA4 Measurement ID。
 * 值存在但格式錯誤時:回傳 undefined(GA4 不初始化、不傳給 gtag),
 * 開發環境顯示一次性警告(不輸出原始值)。
 */
function resolveGa4Id(): string | undefined {
  const raw = rawGa4Id();
  if (!raw) return undefined;
  if (!isValidGa4Id(raw)) {
    if (IS_DEV && !invalidIdWarned) {
      invalidIdWarned = true;
      console.warn(
        "[analytics] GA4 Measurement ID 格式不正確(應為 G-XXXXXXXXXX),GA4 已停用;網站其他功能不受影響。",
      );
    }
    return undefined;
  }
  return raw;
}

const IS_DEV = Boolean(import.meta.env.DEV);
const DEV_DEBUG_ENABLED = import.meta.env.VITE_GA4_DEBUG === "true";

/** GA4 是否應該實際上報(有合法 ID,且非開發環境或已明確開啟 debug 上報) */
function isGa4Active(): boolean {
  return Boolean(resolveGa4Id()) && (!IS_DEV || DEV_DEBUG_ENABLED);
}

let initialized = false;

/**
 * 初始化 Analytics。
 * - 確保 dataLayer 與 gtag stub 存在(與 index.html 的 Ads 片段共用)
 * - 合法 GA4 ID 已配置且允許上報時:附加 GA4 config;gtag.js 已由 Ads 片段
 *   載入則直接重用,否則才動態載入一次
 * - 未配置或格式錯誤時:僅建立 dataLayer 佇列,網站功能完全不受影響
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

  const ga4Id = resolveGa4Id();

  if (!ga4Id || !isGa4Active()) {
    if (IS_DEV && ga4Id) {
      console.info(
        '[analytics] 開發環境已停用 GA4 上報(設 VITE_GA4_DEBUG="true" 可啟用 DebugView 上報)',
      );
    }
    return;
  }

  // 重用已存在的 gtag.js(index.html Google Ads 片段已載入),避免重複載入。
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

/** 允許的事件參數鍵(統一 Taxonomy,白名單以外的鍵不會被傳送) */
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

// 疑似個人資料樣式:電郵、8 位以上連續數字(香港電話)、+852 開頭
const PII_PATTERNS = [
  /[\w.+-]+@[\w-]+\.[\w.]+/, // email
  /(?:\+?852[\s-]?)?\d{4}[\s-]?\d{4,}/, // HK phone-like
];

function looksLikePII(value: string): boolean {
  return PII_PATTERNS.some((re) => re.test(value));
}

/**
 * 統一事件發送:
 * - 只保留白名單參數鍵;疑似 PII 的字串值整個丟棄並警告
 * - 自動補上 page_path / page_title
 * - GA4 有效啟用時:經 gtag('event') 上報,並以 send_to 明確指定 GA4
 *   Measurement ID,避免自訂事件誤送到 Google Ads Destination
 * - GA4 未配置/未啟用:事件只推入當前頁面的 dataLayer 作除錯/相容用途;
 *   該佇列不會永久儲存,亦不能補回 GA4 安裝前的歷史數據
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
        `[analytics] 參數 ${key} 疑似含個人資料,已丟棄(事件 ${eventName})`,
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

  const ga4Id = resolveGa4Id();
  if (window.gtag && ga4Id && isGa4Active()) {
    window.gtag("event", eventName, { ...clean, send_to: ga4Id });
    return;
  }

  // GA4 未配置/開發環境停用:推入當前頁面 dataLayer 作除錯用(不會永久儲存)
  if (IS_DEV && ga4Id) {
    console.debug(`[analytics] (dev, 未上報) ${eventName}`, clean);
  }
  window.dataLayer.push({ event: eventName, ...clean });
}

// ---------------------------------------------------------------------------
// SPA Pageview
// ---------------------------------------------------------------------------

let lastTrackedPath: string | null = null;

/**
 * SPA 路由變更 page_view(首次載入由 gtag config 的 send_page_view 處理,
 * 呼叫端應跳過第一次)。連續同一路徑不重複上報。
 * 以 send_to 明確指定 GA4 Measurement ID。
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
      send_to: ga4Id,
    });
  }
}

// ---------------------------------------------------------------------------
// 聯絡 CTA(現有 API,保持簽名不變)
// ---------------------------------------------------------------------------

export type CtaChannel = "whatsapp" | "phone" | "map";

/**
 * 追蹤聯絡 CTA 點擊(現有呼叫點沿用,不需改動)。
 * @param channel  whatsapp | phone | map
 * @param location CTA 位置標籤,如 header / mobile_bar / floating_widget / price_calculator
 * @param topic    可選:查詢主題摘要(channel="map" 時視為地區名 area_name)
 *
 * 事件對應:whatsapp → whatsapp_click;phone → phone_click;
 * map → area_click(原 map_district_click 統一命名;GA4 未接駁,無歷史數據斷層)
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
 * WhatsApp 點擊後跳轉感謝頁(/thanks):
 * - WhatsApp 於新分頁/App 開啟(原 <a target="_blank"> 行為不變,不阻擋開啟)
 * - 原分頁延遲 600ms 導向 /thanks?from=<cta_location>
 * - /thanks 頁面觸發 whatsapp_open 事件,作為「真實對話開啟率」的代理轉化指標
 */
export function goThanksAfterWhatsApp(location: string) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    // 使用 wouter 以外的原生導向,確保任何組件情境都可用
    window.history.pushState(
      null,
      "",
      `/thanks?from=${encodeURIComponent(location)}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, 600);
}

/** /thanks 頁面觸發:whatsapp_open 轉化事件(真實對話開啟率代理指標) */
export function trackWhatsAppOpen(from: string) {
  sendEvent("whatsapp_open", { cta_location: from, page_path: "/thanks" });
}

// ---------------------------------------------------------------------------
// 聯絡表格(純 Helper;「每次瀏覽一次」的去重由呼叫端 Component 以
// useRef + perViewDedup 管理,見 perViewDedup.ts)
// ---------------------------------------------------------------------------

/** 表格開始填寫(去重由呼叫端保證:每個表格每次頁面瀏覽只呼叫一次) */
export function trackContactFormStart(formName: string, location?: string) {
  sendEvent("contact_form_start", {
    form_name: formName,
    ...(location ? { cta_location: location } : {}),
  });
}

/** 表格成功提交(必須在伺服器確認成功後呼叫,單次觸發由呼叫端保證) */
export function trackContactFormSubmit(formName: string, location?: string) {
  sendEvent("contact_form_submit", {
    form_name: formName,
    ...(location ? { cta_location: location } : {}),
  });
}

/** 表格提交錯誤(只傳錯誤類型,不傳錯誤訊息內文以免夾帶個人資料) */
export function trackContactFormError(formName: string, errorType: string) {
  sendEvent("contact_form_error", {
    form_name: formName,
    error_type: errorType,
  });
}

// ---------------------------------------------------------------------------
// 估價計算機(純 Helper;每次頁面瀏覽/組合的去重由 PriceCalculator
// Component 以 useRef + perViewDedup 管理)
// ---------------------------------------------------------------------------

/** 估價計算機開始互動(去重由呼叫端保證:每次頁面瀏覽只呼叫一次) */
export function trackQuoteCalculatorStart() {
  sendEvent("quote_calculator_start", { cta_location: "price_calculator" });
}

/** 估價計算機完成估價(去重由呼叫端保證:同一次頁面瀏覽同一組合只呼叫一次;topic 為選項摘要,不含個人資料) */
export function trackQuoteCalculatorComplete(topic?: string) {
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

/** 導航/內容連結點擊(cta_click / service_click / area_click / blog_post_click / navigation_click / pricing_click) */
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

/**
 * Blog 文章實際閱讀(純 Helper;「每次文章瀏覽只記一次」及觸發條件
 * (捲動 60% / 停留 45 秒 / visibility 檢查)由 BlogPost Component 以
 * blogReadTracker.ts 的 createBlogReadTracker 管理)
 */
export function trackBlogRead(slug: string, readPercent?: number) {
  sendEvent("blog_read", {
    article_slug: slug,
    ...(readPercent !== undefined ? { read_percent: readPercent } : {}),
  });
}

// ---------------------------------------------------------------------------
// 測試專用:重設模組內部狀態(正式程式碼不應呼叫;
// 正式程式碼的去重不依賴本函式,均由 Component 生命週期管理)
// ---------------------------------------------------------------------------

export function __resetAnalyticsStateForTests() {
  initialized = false;
  lastTrackedPath = null;
  invalidIdWarned = false;
}
