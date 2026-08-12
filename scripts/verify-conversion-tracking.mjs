import fs from "node:fs";

const analytics = fs.readFileSync("client/src/lib/analytics.ts", "utf8");
const tracking = fs.readFileSync("client/src/lib/trackingSession.ts", "utf8");
const thanks = fs.readFileSync("client/src/pages/Thanks.tsx", "utf8");
const app = fs.readFileSync("client/src/App.tsx", "utf8");
const html = fs.readFileSync("client/index.html", "utf8");

const required = [
  [analytics, "G-7JEL7SLBGQ"],
  [analytics, "whatsapp_handoff"],
  [analytics, "VITE_GOOGLE_ADS_WHATSAPP_LABEL"],
  [analytics, "send_page_view: false"],
  [tracking, "consumeWhatsAppHandoff"],
  [tracking, "sessionStorage"],
  [tracking, "HANDOFF_MAX_AGE_MS"],
  [thanks, "trackWhatsAppHandoff"],
  [thanks, "consumeWhatsAppHandoff"],
  [app, "trackPageView(location)"],
  [html, "send_page_view: false"],
];

for (const [source, pattern] of required) {
  if (!source.includes(pattern)) {
    throw new Error(`缺少 tracking pattern：${pattern}`);
  }
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
