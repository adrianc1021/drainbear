/**
 * 通渠熊 DrainBear — 地區專屬著陸頁（觀塘/沙田等）
 * 風格：Premium SaaS Minimalism，大量留白、8px 圓角、懸浮陰影卡片、無 Emoji
 * SEO：Service JSON-LD + FAQPage + 麵包屑 + 長內容當區關鍵字
 */
import { Link, useParams } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PHONE_DISPLAY, PHONE_TEL, waLink } from "@/lib/contact";
import { trackCTA, goThanksAfterWhatsApp } from "@/lib/analytics";
import { getDistrict } from "@/lib/districtData";
import NotFound from "@/pages/NotFound";

export default function District() {
  const { slug } = useParams<{ slug: string }>();
  const d = getDistrict(slug || "");
  if (!d) return <NotFound />;

  const crumbs = [
    { name: "首頁", path: "/" },
    { name: "服務地區", path: "/areas" },
    { name: `${d.name}通渠`, path: `/areas/${d.slug}` },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: `${d.name}24 小時通渠服務`,
      provider: { "@type": "Plumber", name: "通渠熊 DrainBear", telephone: "+85295588260" },
      areaServed: [d.name, ...d.nearby].map((n) => ({ "@type": "Place", name: n })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const waDistrict = waLink(`你好，我喺${d.name}，想查詢通渠服務報價。`);

  return (
    <div>
      <SEO
        title={`${d.name}通渠｜24 小時特快上門・1 小時到達・不成功不收費｜通渠熊 DrainBear`}
        description={d.metaDescription}
        path={`/areas/${d.slug}`}
        keywords={d.keywords}
        jsonLd={jsonLd}
        breadcrumbs={crumbs}
      />
      <Breadcrumbs items={crumbs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-mist to-white py-14 md:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-safety">
              <MapPin className="h-4 w-4" strokeWidth={2.5} />
              {d.en} · {d.region}
            </div>
            <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
              {d.heroTitle}
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">{d.heroDesc}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={waDistrict}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA("whatsapp", "district_hero", d.name);
                  goThanksAfterWhatsApp("district_hero");
                }}
                className="btn-smooth inline-flex items-center justify-center gap-2 rounded-lg bg-wagreen px-7 py-3.5 text-base font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
                WhatsApp {d.name}師傅
              </a>
              <a
                href={PHONE_TEL}
                onClick={() => trackCTA("phone", "district_hero", d.name)}
                className="btn-smooth inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-7 py-3.5 text-base font-bold text-white hover:bg-navy-light"
              >
                <Phone className="h-5 w-5" strokeWidth={2.2} />
                {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              先報價・後動工・不成功不收費・上門檢查費全免
            </p>
          </div>
        </div>
      </section>

      {/* 當區介紹（SEO 長內容） */}
      <section className="bg-white py-14 md:py-16">
        <div className="container grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="reveal max-w-3xl">
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              {d.name}區渠務特點
            </h2>
            {d.intro.map((p) => (
              <p key={p.slice(0, 12)} className="mt-4 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            <div className="mt-6 flex flex-wrap gap-2">
              {d.landmarks.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-mist px-3.5 py-1.5 text-sm font-medium text-navy"
                >
                  <MapPin className="h-3 w-3 text-wagreen" strokeWidth={2.5} />
                  {l}
                </span>
              ))}
            </div>
          </article>

          {/* 側欄：服務承諾卡 */}
          <aside className="reveal">
            <div className="card-float card-accent rounded-lg border border-border bg-white p-7">
              <h3 className="font-display text-lg font-black text-navy">{d.name}區服務承諾</h3>
              <ul className="mt-5 space-y-4">
                {[
                  { icon: Clock, text: `${d.name}及鄰近地區 1 小時內到達` },
                  { icon: BadgeCheck, text: "出發前確認總價，絕不坐地起價" },
                  { icon: ShieldCheck, text: "不成功不收費，上門檢查費全免" },
                  { icon: Wrench, text: "高壓水槍 + CCTV 照喉科技斷症" },
                ].map((i) => (
                  <li key={i.text} className="flex items-start gap-3 text-sm text-navy/80">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-wagreen">
                      <i.icon className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    {i.text}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <WhatsAppButton className="w-full justify-center" label="立即免費報價" trackLocation="district_sidebar" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 當區常見問題場景 */}
      <section className="bg-mist py-14 md:py-16">
        <div className="container">
          <div className="reveal mb-10 max-w-xl">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              COMMON ISSUES
            </div>
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              {d.name}最常見的 4 大渠務求助
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.painPoints.map((p, i) => (
              <div
                key={p.title}
                className="card-float card-accent reveal rounded-lg border border-border bg-white p-6"
                data-reveal-delay={i * 70}
              >
                <div className="mb-3 font-display text-base font-black text-navy">{p.title}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 當區 FAQ */}
      <section className="bg-white py-14 md:py-16">
        <div className="container max-w-3xl">
          <h2 className="reveal font-display text-2xl font-black text-navy md:text-3xl">
            {d.name}通渠常見問題
          </h2>
          <div className="mt-8 space-y-5">
            {d.faqs.map((f, i) => (
              <div
                key={f.q}
                className="card-float reveal rounded-lg border border-border bg-white p-6"
                data-reveal-delay={i * 70}
              >
                <h3 className="flex items-start gap-2.5 font-bold text-navy">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wagreen/10 text-xs font-black text-wagreen-dark">
                    Q
                  </span>
                  {f.q}
                </h3>
                <p className="mt-3 pl-[34px] text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
          <div className="reveal mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">想了解更多收費詳情？</span>
            <Link
              href="/guide"
              className="btn-smooth inline-flex items-center gap-1.5 font-bold text-wagreen-dark hover:gap-2.5"
            >
              查看通渠收費指南 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/guide#calculator"
              className="btn-smooth inline-flex items-center gap-1.5 font-bold text-navy/70 hover:gap-2.5 hover:text-navy"
            >
              試用估價計算機 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 鄰近地區 + CTA */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="container">
          <div className="dot-grid rounded-lg bg-navy px-8 py-12 text-center md:px-16">
            <h2 className="text-balance font-display text-2xl font-black text-white md:text-3xl">
              {d.name}塞渠？白熊師傅隨時候命。
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              同時覆蓋{d.nearby.join("、")}等鄰近地區，收費一致，絕不因地區加價。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={waDistrict}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA("whatsapp", "district_footer_cta", d.name);
                  goThanksAfterWhatsApp("district_footer_cta");
                }}
                className="btn-smooth inline-flex items-center gap-2 rounded-lg bg-wagreen px-8 py-4 text-base font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
                WhatsApp 即時報價
              </a>
              <a
                href={PHONE_TEL}
                onClick={() => trackCTA("phone", "district_footer_cta", d.name)}
                className="btn-smooth inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white hover:bg-white hover:text-navy"
              >
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
