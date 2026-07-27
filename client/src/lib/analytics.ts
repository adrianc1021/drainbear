/**
 * 通渠熊 DrainBear — GA4 點擊追蹤
 * 事件規格：
 *  - whatsapp_click：所有 WhatsApp CTA 點擊（參數：cta_location、page_path、topic）
 *  - phone_click：所有電話直撥 CTA 點擊（參數：cta_location、page_path）
 * 配置方式：於 client/index.html 設定 window.__GA4_ID__ 或環境變數 VITE_GA4_ID。
 * 未配置 GA4 ID 時事件仍會推入 dataLayer 佇列，之後接入 GTM/GA4 即可回收。
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __GA4_ID__?: string;
  }
}

const GA4_ID: string | undefined =
  (typeof window !== "undefined" && window.__GA4_ID__) ||
  (import.meta.env.VITE_GA4_ID as string | undefined);

let initialized = false;

/** 初始化 GA4（僅在配置了測量 ID 時載入 gtag.js；否則只建立 dataLayer 佇列） */
export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

  if (GA4_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID, { send_page_view: true });
  }
}

export type CtaChannel = "whatsapp" | "phone";

/**
 * 追蹤 CTA 點擊。
 * @param channel  whatsapp | phone
 * @param location CTA 位置標籤，如 header / mobile_bar / floating_widget / hero / price_calculator
 * @param topic    可選：查詢主題或預填內容摘要
 */
export function trackCTA(channel: CtaChannel, location: string, topic?: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const eventName = channel === "whatsapp" ? "whatsapp_click" : "phone_click";
  const params = {
    cta_location: location,
    page_path: window.location.pathname,
    ...(topic ? { topic } : {}),
  };
  if (window.gtag) {
    window.gtag("event", eventName, params);
  } else {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

/**
 * WhatsApp 點擊後跳轉感謝頁（/thanks）：
 * - WhatsApp 於新分頁/App 開啟（原 <a target="_blank"> 行為不變）
 * - 原分頁延遲 600ms 導向 /thanks?from=<cta_location>，不阻擋 WhatsApp 開啟
 * - /thanks 頁面觸發 whatsapp_open 事件，作為「真實對話開啟率」的代理轉化指標
 */
export function goThanksAfterWhatsApp(location: string) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    // 使用 wouter 以外的原生導向，確保任何組件情境都可用
    window.history.pushState(null, "", `/thanks?from=${encodeURIComponent(location)}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, 600);
}

/** /thanks 頁面觸發：whatsapp_open 轉化事件（真實對話開啟率代理指標） */
export function trackWhatsAppOpen(from: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const params = { cta_location: from, page_path: "/thanks" };
  if (window.gtag) {
    window.gtag("event", "whatsapp_open", params);
  } else {
    window.dataLayer.push({ event: "whatsapp_open", ...params });
  }
}
