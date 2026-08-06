/**
 * 通渠熊 DrainBear — 右下角常駐 WhatsApp 懸浮對話框
 * 設計語言：Premium SaaS Minimalism（navy #0B132B、WhatsApp 綠、8px 圓角、懸浮陰影、平滑過渡）
 * 桌面：右下角固定；手機：升高避開底部固定 CTA 列
 */
import { useEffect, useState } from "react";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { trackCTA, goThanksAfterWhatsApp } from "@/lib/analytics";

const LOGO =
  "https://res.cloudinary.com/pgjztf2p/image/upload/v1785314740/A_pure_black_and_white_vector_mascot_logo_of_a_con-1785146902762_k8ruvx.jpg";

const QUICK_TOPICS = [
  { label: "坐廁 / 馬桶淤塞", msg: "你好，我屋企坐廁塞咗，想查詢通渠報價。" },
  {
    label: "廚房 / 企缸去水慢",
    msg: "你好，我想查詢廚房鋅盤或企缸去水慢嘅通渠報價。",
  },
  {
    label: "食肆 / 商業通渠",
    msg: "你好，我想查詢食肆或商業場所嘅通渠服務報價。",
  },
  { label: "其他渠務問題", msg: "你好，我想查詢通渠服務報價。" },
];

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const {whatsappHref} = useContactSettings();

  // 開啟後停止呼吸提示動畫
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  return (
    <div
      className="pointer-events-none fixed bottom-[86px] right-3 z-[60] flex flex-col items-end md:bottom-6 md:right-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* 對話卡 */}
      <div
        className={`mb-3 w-[320px] max-w-[calc(100vw-1.5rem)] origin-bottom-right overflow-hidden rounded-lg bg-white shadow-[0_20px_60px_rgba(11,19,43,0.25)] ring-1 ring-border transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        role="dialog"
        aria-label="WhatsApp 即時查詢"
        aria-hidden={!open}
        inert={!open}
      >
        {/* 頂部 */}
        <div className="flex items-center gap-3 bg-navy px-5 py-4">
          <div className="relative">
            <img
              src={LOGO}
              alt="通渠熊 DrainBear"
              className="h-10 w-10 rounded-full bg-white p-1"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy bg-wagreen" />
          </div>
          <div className="flex-1">
            <div className="font-display text-sm font-bold text-white">
              白熊師傅
            </div>
            <div className="text-xs text-wagreen">在線・通常 1 分鐘內回覆</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="btn-smooth rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="關閉對話框"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* 訊息氣泡 */}
        <div className="bg-mist px-5 py-4">
          <div className="max-w-[85%] rounded-lg rounded-tl-none bg-white px-4 py-3 text-sm leading-relaxed text-navy shadow-sm">
            你好！我係通渠熊白熊師傅。請問遇到咩渠務問題？揀個主題或直接開始對話，即時免費報價。
          </div>
        </div>

        {/* 快速主題 */}
        <div className="space-y-2 px-5 py-4">
          {QUICK_TOPICS.map(t => (
            <a
              key={t.label}
              href={whatsappHref(t.msg)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackCTA("whatsapp", "floating_widget", t.label);
                goThanksAfterWhatsApp("floating_widget");
              }}
              className="btn-smooth group flex items-center justify-between rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-navy hover:border-wagreen/50 hover:bg-wagreen/5"
            >
              {t.label}
              <ArrowRight
                className="h-3.5 w-3.5 text-wagreen opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                strokeWidth={2.5}
              />
            </a>
          ))}
          <a
            href={whatsappHref("你好，我想查詢通渠服務報價。")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackCTA("whatsapp", "floating_widget", "開始對話");
              goThanksAfterWhatsApp("floating_widget");
            }}
            className="btn-smooth mt-1 flex items-center justify-center gap-2 rounded-lg bg-wagreen px-4 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            開始 WhatsApp 對話
          </a>
          <p className="pt-1 text-center text-[11px] text-muted-foreground">
            24 小時全天候・先報價後動工・不成功不收費
          </p>
        </div>
      </div>

      {/* 懸浮按鈕 */}
      <button
        onClick={() => setOpen(!open)}
        className="btn-smooth pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white shadow-[0_8px_24px_rgba(11,19,43,0.4)] hover:bg-navy-light active:scale-95 md:h-14 md:w-14 md:bg-wagreen md:shadow-[0_8px_24px_rgba(37,211,102,0.45)] md:hover:bg-wagreen-dark md:hover:shadow-[0_10px_32px_rgba(37,211,102,0.55)]"
        aria-label={open ? "關閉 WhatsApp 對話框" : "開啟 WhatsApp 對話框"}
        aria-expanded={open}
      >
        {pulse && !open && (
          <span className="absolute inset-0 hidden animate-ping rounded-full bg-wagreen/50 [animation-duration:2s] md:block" />
        )}
        <span
          className="relative flex items-center justify-center transition-transform duration-200"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {open ? (
            <X className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
          ) : (
            <MessageCircle
              className="h-5 w-5 text-wagreen md:h-6 md:w-6 md:text-white"
              strokeWidth={2.4}
            />
          )}
        </span>
      </button>
    </div>
  );
}
