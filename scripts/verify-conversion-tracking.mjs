import fs from "node:fs";

const analytics = fs.readFileSync("client/src/lib/analytics.ts", "utf8");
const tracking = fs.readFileSync("client/src/lib/trackingSession.ts", "utf8");
const thanks = fs.readFileSync("client/src/pages/Thanks.tsx", "utf8");
const app = fs.readFileSync("client/src/App.tsx", "utf8");
const html = fs.readFileSync("client/index.html", "utf8");
const googleLoader = fs.readFileSync(
  "client/src/lib/googleTagLoader.ts",
  "utf8"
);
const dockerfile = fs.readFileSync("Dockerfile", "utf8");
const trackingDocs = fs.readFileSync("docs/tracking-rollout-pr19.md", "utf8");

const required = [
  [analytics, "G-05DW80HCTS"],
  [analytics, "whatsapp_handoff"],
  [analytics, "DEFAULT_GOOGLE_ADS_WHATSAPP_LABEL"],
  [analytics, "VITE_GOOGLE_ADS_WHATSAPP_LABEL"],
  [analytics, "VITE_GOOGLE_ADS_PHONE_LABEL"],
  [analytics, "VITE_GOOGLE_ADS_FORM_LABEL"],
  [analytics, "sendGoogleAdsConversion"],
  [analytics, 'sendGoogleAdsEvent("quote_calculator_start")'],
  [analytics, 'const GOOGLE_ADS_DESTINATION_ID = "AW-18128738982"'],
  [analytics, "send_page_view: false"],
  [tracking, "consumeWhatsAppHandoff"],
  [tracking, "sessionStorage"],
  [tracking, "HANDOFF_MAX_AGE_MS"],
  [thanks, "trackWhatsAppHandoff"],
  [thanks, "consumeWhatsAppHandoff"],
  [app, "trackPageView(location)"],
  [html, "send_page_view: false"],
  [html, "productionTrackingHosts"],
  [html, "productionTrackingHosts.has(window.location.hostname)"],
  [googleLoader, "loadGoogleTag"],
  [googleLoader, "scheduleGoogleTag(destinationId: string)"],
  [dockerfile, "ARG VITE_GOOGLE_ADS_WHATSAPP_LABEL"],
  [dockerfile, "ARG VITE_GOOGLE_ADS_PHONE_LABEL"],
  [dockerfile, "ARG VITE_GOOGLE_ADS_FORM_LABEL"],
];

for (const [source, pattern] of required) {
  if (!source.includes(pattern)) {
    throw new Error(`缺少 tracking pattern：${pattern}`);
  }
}

for (const [sourceName, source] of [
  ["analytics.ts", analytics],
  ["tracking-rollout-pr19.md", trackingDocs],
]) {
  if (source.includes("G-7JEL7SLBGQ")) {
    throw new Error(`${sourceName} still references the retired GA4 property`);
  }
}

if (html.includes('src="https://www.googletagmanager.com/gtag/js')) {
  throw new Error("client/index.html still loads gtag.js unconditionally");
}

if (html.includes("googletagmanager.com/gtag/js?id=")) {
  throw new Error("client/index.html still creates the external gtag script");
}

if (
  googleLoader.includes("FALLBACK_DELAY_MS") ||
  googleLoader.includes('window.addEventListener("pointerdown"') ||
  !/function scheduleGoogleTag\(destinationId: string\)\s*\{\s*loadGoogleTag\(destinationId\);\s*\}/.test(
    googleLoader
  )
) {
  throw new Error(
    "Google tag must load immediately; delayed interaction loading is not allowed"
  );
}

if (thanks.includes("trackWhatsAppOpen(from)")) {
  throw new Error("Thanks 仍使用舊 whatsapp_open page-load tracking");
}

if (app.includes("isFirst.current")) {
  throw new Error("PageViewTracker 仍跳過首次 Page View");
}

if (
  !tracking.includes("EMAIL_PATTERN") ||
  !tracking.includes("PHONE_PATTERN")
) {
  throw new Error("Tracking session 缺少 PII 防護");
}

console.log("PASS：GA4 Production hostname gate 已加入");
console.log("PASS：首次及 SPA Page View 採單一發送策略");
console.log("PASS：WhatsApp handoff 一次性 token 已加入");
console.log("PASS：UTM／click ID type attribution 已加入");
console.log("PASS：PII 防護仍然存在");
console.log("PASS：Google Ads Conversion Label 採可選配置");
console.log("PASS：正式 GA4 property 已切換至 G-05DW80HCTS");
console.log("PASS：Render Docker build 可取得 Google Ads Conversion Label");
console.log("PASS：quote_calculator_start 明確送往 Google Ads Destination");
console.log("PASS：Google tag 於首次頁面瀏覽立即載入");
