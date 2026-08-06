/**
 * 通渠熊 DrainBear — WhatsApp 查詢感謝頁
 * 目的：WhatsApp CTA 點擊後原分頁跳轉至此，觸發 GA4 whatsapp_open 轉化事件，
 *       量度真實對話開啟率；同時提供等候指引、電話後備及導流內容。
 * 風格：Premium SaaS Minimalism
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { trackCTA, trackWhatsAppOpen } from "@/lib/analytics";

const NEXT_STEPS = [
  {
    icon: MessageCircle,
    title: "1. 傳送相片或短片",
    desc: "在 WhatsApp 對話中補充堵塞位置的相片或短片，師傅可更快斷症、報價更準確。",
  },
  {
    icon: Clock,
    title: "2. 師傅 1 分鐘內回覆",
    desc: "在線師傅會即時確認你的地區及情況，提供免費初步報價，絕無隱藏收費。",
  },
  {
    icon: Wrench,
    title: "3. 確認後極速上門",
    desc: "同意報價後即刻出發，全港 1 小時內特快到達，先報價、後動工。",
  },
];

/* 等候期間 FAQ：服務流程 + 收費標準 */
const THANKS_FAQS = [
  {
    q: "通渠收費大概幾多錢？",
    a: "常見服務參考價：坐廁/馬桶淤塞 HK$600 起、廚房鋅盤 HK$500 起、企缸/地台去水位 HK$500 起、大廈主渠/沙井 HK$1,800 起、高壓水槍洗渠 HK$2,800 起。師傅會在動工前一次過確認總價，絕不坐地起價；純異物淤塞打不通，分毫不收。",
  },
  {
    q: "報價之後仲會唔會加價？",
    a: "不會。通渠熊堅持「先報價、後動工」：師傅上門評估後、動工前確認最終總收費（已包上門費及完工清潔），深夜時段（23:00–07:00）附加費亦會一併講明。你確認價錢後才開工，絕無隱藏收費。",
  },
  {
    q: "師傅幾耐會到？服務範圍包唔包我嗰區？",
    a: "全港 1 小時特快到達，24 小時全天候候命，覆蓋港島、九龍、新界及離島 32+ 分區，統一收費、絕不因地區加價。深夜緊急塞渠亦可即時安排師傅出動。",
  },
  {
    q: "上門會用咩方法通渠？",
    a: "師傅會按淤塞性質選用最合適工具：手搖泵、電動通渠機或高壓水槍；懷疑喉管破損時會用 CCTV 照喉檢測，有片有真相，是堵塞便疏通、確認破損才建議維修，絕不無故推銷換喉工程。",
  },
  {
    q: "「不成功不收費」點樣計？",
    a: "凡屬異物淤塞（豬油膏、頭髮、紙巾、濕紙巾等）而未能成功疏通，我們分毫不收，上門檢查費亦全免。如檢測後確認屬喉管破損需維修，則屬另一種工程，師傅會先解釋清楚並另行報價，由你決定是否進行。",
  },
  {
    q: "等緊回覆，我可以做啲咩令報價更快？",
    a: "可以在 WhatsApp 對話中補充：堵塞位置的相片或短片、所在地區及樓宇類型（住宅/村屋/商舖）、大概發生時間。資料愈齊，師傅斷症愈快，通常 1 分鐘內就能給你初步報價。",
  },
];

export default function Thanks() {
  const tracked = useRef(false);
  const {
    phoneDisplay,
    phoneHref,
    whatsappDefaultHref,
  } = useContactSettings();

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const from = new URLSearchParams(window.location.search).get("from") || "unknown";
    trackWhatsAppOpen(from);
  }, []);

  return (
    <div>
      <SEO
        title="已開啟 WhatsApp 對話｜通渠熊 DrainBear"
        description="感謝查詢通渠熊 24 小時通渠服務，師傅將於 1 分鐘內回覆。如未能開啟 WhatsApp，歡迎直接致電 24 小時熱線。"
        path="/thanks"
        noindex
      />
      <section className="bg-gradient-to-b from-mist to-white py-16 md:py-24">
        <div className="container max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-wagreen/10 ring-8 ring-wagreen/5">
            <CheckCircle2 className="h-8 w-8 text-wagreen" strokeWidth={2.2} />
          </div>
          <h1 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
            WhatsApp 對話已開啟
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            感謝查詢！在線師傅會於 <strong className="text-navy">1 分鐘內</strong>回覆你。
            請留意 WhatsApp 通知，或按以下步驟令報價更快更準。
          </p>

          {/* 後備入口 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappDefaultHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA("whatsapp", "thanks_retry")}
              className="btn-smooth inline-flex items-center gap-2 rounded-lg bg-wagreen px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
              未開啟到？再按一次
            </a>
            <a
              href={phoneHref}
              onClick={() => trackCTA("phone", "thanks_fallback")}
              className="btn-smooth inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-light"
            >
              <Phone className="h-4 w-4" strokeWidth={2.2} />
              直接致電 {phoneDisplay}
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-wagreen" />
            先報價・後動工・不成功不收費・上門檢查費全免
          </p>
        </div>
      </section>

      {/* 接下來會發生咩事 */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="container max-w-4xl">
          <h2 className="reveal text-center font-display text-2xl font-black text-navy md:text-3xl">
            接下來 3 步，極速解決塞渠
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {NEXT_STEPS.map((s, i) => (
              <div
                key={s.title}
                className="card-float card-accent reveal rounded-lg border border-border bg-white p-7"
                data-reveal-delay={i * 70}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-wagreen">
                  <s.icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-base font-black text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* 等候時導流 */}
          <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <span className="text-muted-foreground">等候回覆時，不妨了解一下：</span>
            <Link
              href="/guide"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 font-bold text-wagreen-dark hover:gap-2.5"
            >
              通渠收費指南 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 font-bold text-wagreen-dark hover:gap-2.5"
            >
              通渠小知識 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 font-bold text-navy/70 hover:gap-2.5 hover:text-navy"
            >
              返回首頁 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 等候期間 FAQ */}
      <section className="bg-mist py-14 md:py-20">
        <div className="container max-w-3xl">
          <div className="reveal text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">WHILE YOU WAIT</div>
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              等候回覆時，先了解服務流程同收費
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              以下是客戶查詢時最關心的幾條問題，睇完之後同師傅溝通會更快更順。
            </p>
          </div>
          <div className="reveal mt-8">
            <Accordion
              type="single"
              collapsible
              className="card-float overflow-hidden rounded-lg border border-border bg-white"
            >
              {THANKS_FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-border px-5 md:px-7">
                  <AccordionTrigger className="min-h-[56px] py-4 text-left font-bold text-navy hover:no-underline md:text-base">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="reveal mt-6 text-center text-sm text-muted-foreground">
            想睇完整價目表同揀公司貼士？
            <Link
              href="/guide"
              className="btn-smooth ml-2 inline-flex items-center gap-1.5 font-bold text-wagreen-dark hover:gap-2.5"
            >
              前往收費指南 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
