/**
 * 通渠熊 DrainBear — WhatsApp 查詢感謝頁
 * 目的：WhatsApp CTA 點擊後原分頁跳轉至此，觸發 GA4 whatsapp_open 轉化事件，
 *       量度真實對話開啟率；同時提供等候指引、電話後備及導流內容。
 * 風格：Premium SaaS Minimalism
 */
import { useEffect } from "react";
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
import { trackCTA, trackWhatsAppHandoff } from "@/lib/analytics";
import { consumeWhatsAppHandoff } from "@/lib/trackingSession";

const NEXT_STEPS = [
  {
    icon: MessageCircle,
    title: "1. 傳送現場相片或短片",
    desc: "可在 WhatsApp 對話中補充堵塞位置的相片或短片，方便團隊作初步判斷及估價。",
  },
  {
    icon: Clock,
    title: "2. 團隊確認資料",
    desc: "團隊會按所在地區及現場資料回覆可安排的服務時段與初步估價。",
  },
  {
    icon: Wrench,
    title: "3. 確認收費後安排工程",
    desc: "確認報價後，團隊會按已確認的時間安排工程；實際到場時間受交通、人員及設備供應影響。",
  },
];

/* 等候期間 FAQ：服務流程 + 收費標準 */
const THANKS_FAQS = [
  {
    q: "通渠收費大約是多少？",
    a: "常見服務參考價：坐廁／馬桶淤塞 HK$600 起、廚房鋅盤 HK$500 起、企缸／地台去水位 HK$500 起、大廈主渠／沙井 HK$1,800 起、高壓水槍洗渠 HK$2,800 起。先報價，確認後才動工。",
  },
  {
    q: "報價及施工如何確認？",
    a: "通渠熊採用「先報價、後動工」原則：師傅到場評估後，會在動工前說明並確認最終總收費。工程按雙方已確認的報價及範圍進行。",
  },
  {
    q: "何時可以到場？我的地區是否在服務範圍內？",
    a: "港島、九龍、新界及離島均可先行查詢。到場時間受所在地區、交通、進場條件、人員及設備供應影響；團隊收到位置及現場資料後，會回覆可安排的時段與初步估算。",
  },
  {
    q: "到場後會採用甚麼方法通渠？",
    a: "師傅會按淤塞性質選用合適工具，例如手動工具、電動通渠機或高壓水槍；如懷疑喉管破損，則會按需要建議 CCTV 照喉檢測。",
  },
  {
    q: "「不成功不收費」適用於哪些情況？",
    a: "此安排只適用於事前確認的合資格疏通項目，具體範圍及條款會在安排服務前說明。",
  },
  {
    q: "等候回覆期間可以準備甚麼資料？",
    a: "可在 WhatsApp 對話中補充堵塞位置的相片或短片、所在地區、樓宇類型（住宅／村屋／商舖）及大概發生時間。如曾使用化學通渠劑、拆喉或出現污水倒灌，亦請一併說明。",
  },
];

export default function Thanks() {
  const { phoneDisplay, phoneHref, whatsappDefaultHref } = useContactSettings();

  useEffect(() => {
    const handoff = consumeWhatsAppHandoff();

    if (!handoff) return;

    trackWhatsAppHandoff(handoff.cta_location, handoff.attribution);
  }, []);

  return (
    <div>
      <SEO
        title="已開啟 WhatsApp 對話｜通渠熊 DrainBear"
        description="感謝查詢通渠熊 24 小時通渠服務。請在 WhatsApp 提供所在地區及現場資料；如未能開啟 WhatsApp，歡迎直接致電查詢。"
        path="/thanks"
        noindex
        nofollow
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
            感謝查詢！團隊會按您提供的資料回覆可安排的服務時段及初步估價。
            請留意 WhatsApp 通知，並按以下步驟準備資料。
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
              未能開啟 WhatsApp？再次查詢
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
            先報價・後動工・合資格項目按已確認條款處理
          </p>
        </div>
      </section>

      {/* 接下來的服務安排 */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="container max-w-4xl">
          <h2 className="reveal text-center font-display text-2xl font-black text-navy md:text-3xl">
            接下來三個步驟，了解服務安排
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
                <h3 className="font-display text-base font-black text-navy">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 等候時導流 */}
          <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <span className="text-muted-foreground">
              等候回覆期間，可先了解以下內容：
            </span>
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
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              等候回覆期間
            </div>
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              等候回覆期間，先了解服務流程及收費
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              以下整理客戶查詢時常見的問題，方便您與團隊溝通及準備資料。
            </p>
          </div>
          <div className="reveal mt-8">
            <Accordion
              type="single"
              collapsible
              className="card-float overflow-hidden rounded-lg border border-border bg-white"
            >
              {THANKS_FAQS.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-${i}`}
                  className="border-border px-5 md:px-7"
                >
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
            如需查看完整價目表及選擇服務供應商的參考資料，
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
