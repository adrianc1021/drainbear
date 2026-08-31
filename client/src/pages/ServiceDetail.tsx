import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Link, useParams } from "wouter";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import {
  useContactSettings,
  useSiteSettings,
} from "@/contexts/SiteSettingsContext";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import { getServicePage } from "@/lib/serviceData";
import { prefetchRoute } from "@/lib/routePrefetch";
import NotFound from "@/pages/NotFound";

const CALCULATOR_LOCATION_BY_SLUG: Record<string, string> = {
  "toilet-unblocking": "toilet",
  "bathroom-drain-unblocking": "shower",
  "kitchen-sink-unblocking": "sink",
  "sewage-backflow": "mainpipe",
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServicePage(slug || "");
  const { phoneDisplay, phoneHref, whatsappHref } = useContactSettings();
  const { settings } = useSiteSettings();

  if (!service) return <NotFound />;

  const path = `/services/${service.slug}`;
  const calculatorHref = `/guide?location=${encodeURIComponent(
    CALCULATOR_LOCATION_BY_SLUG[service.slug] || ""
  )}#calculator`;
  const whatsappUrl = whatsappHref(service.whatsappMessage);
  const crumbs = [
    { name: "首頁", path: "/" },
    { name: "通渠服務", path: "/services" },
    { name: service.shortName, path },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${path}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: `${SITE_URL}${path}`,
    image: service.image,
    provider: {
      "@id": BUSINESS_ID,
      name: settings.businessName,
    },
    areaServed: {
      "@type": "Country",
      name: "Hong Kong",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}${path}`,
      servicePhone: settings.phoneE164,
      availableLanguage: ["zh-Hant", "zh-HK"],
    },
  };

  return (
    <div className="phase4-service-detail" data-phase4-page="service-detail">
      <SEO
        title={service.title}
        description={service.description}
        path={path}
        image={service.image}
        imageAlt={service.imageAlt}
        jsonLd={serviceJsonLd}
        breadcrumbs={crumbs}
      />

      <Breadcrumbs items={crumbs} />

      <main>
        <section className="phase4-service-detail__hero bg-gradient-to-b from-mist to-white py-14 md:py-20">
          <div className="container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-safety">
                {service.eyebrow}
              </p>
              <h1 className="mt-3 text-balance font-display text-4xl font-black text-navy md:text-5xl">
                {service.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {service.heroDescription}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCTA("whatsapp", "service_detail_hero", service.slug);
                    goThanksAfterWhatsApp(
                      `service_detail_hero_${service.slug}`
                    );
                  }}
                  className="btn-smooth inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-wagreen px-7 py-3.5 font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:bg-wagreen-dark"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp 索取初步估價
                </a>

                <a
                  href={phoneHref}
                  onClick={() =>
                    trackCTA("phone", "service_detail_hero", service.slug)
                  }
                  className="btn-smooth inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-navy px-7 py-3.5 font-bold text-white hover:bg-navy-light"
                >
                  <Phone className="h-5 w-5" />
                  {phoneDisplay}
                </a>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                WhatsApp
                可先提供初步估價；師傅現場檢查後、動工前確認最終總收費。
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-navy shadow-[0_20px_60px_rgba(11,19,43,0.18)]">
              <img
                src={service.image}
                alt={service.imageAlt}
                width="1200"
                height="800"
                fetchPriority="high"
                decoding="async"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white py-8">
          <div className="container grid gap-4 md:grid-cols-2">
            <Link
              href="/drain-diagnosis"
              onMouseEnter={() => prefetchRoute("/drain-diagnosis")}
              onFocus={() => prefetchRoute("/drain-diagnosis")}
              onTouchStart={() => prefetchRoute("/drain-diagnosis")}
              onClick={() =>
                trackNavClick("cta", {
                  cta_location: "service_detail_support_links",
                  cta_label: "重新判斷症狀",
                  destination_url: "/drain-diagnosis",
                  service_name: service.slug,
                })
              }
              className="group flex min-h-[92px] items-center gap-4 rounded-lg border border-border bg-mist/45 px-5 py-4 hover:border-navy/35 hover:bg-white"
            >
              <Search className="h-6 w-6 shrink-0 text-wagreen-dark" />
              <span>
                <span className="block font-display font-black text-navy">
                  症狀與這項服務不完全相符？
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  使用快速判斷工具整理影響範圍
                </span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-navy/35 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/service-process"
              onMouseEnter={() => prefetchRoute("/service-process")}
              onFocus={() => prefetchRoute("/service-process")}
              onTouchStart={() => prefetchRoute("/service-process")}
              onClick={() =>
                trackNavClick("navigation", {
                  cta_location: "service_detail_support_links",
                  cta_label: "服務及報價原則",
                  destination_url: "/service-process",
                  service_name: service.slug,
                })
              }
              className="group flex min-h-[92px] items-center gap-4 rounded-lg border border-border bg-mist/45 px-5 py-4 hover:border-navy/35 hover:bg-white"
            >
              <ShieldCheck className="h-6 w-6 shrink-0 text-safety" />
              <span>
                <span className="block font-display font-black text-navy">
                  先了解報價與追加工序界線
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  查看現場檢查及動工前確認原則
                </span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-navy/35 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="bg-white py-14 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-2">
            <article>
              <div className="flex items-center gap-3">
                <CircleAlert className="h-6 w-6 text-safety" />
                <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                  常見症狀
                </h2>
              </div>
              <ul className="mt-6 space-y-4">
                {service.symptoms.map(item => (
                  <li
                    key={item}
                    className="flex items-start gap-3 leading-relaxed text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-wagreen-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-border bg-mist/55 p-7 md:p-8">
              <div className="flex items-center gap-3">
                <Search className="h-6 w-6 text-wagreen-dark" />
                <h2 className="font-display text-2xl font-black text-navy">
                  常見成因
                </h2>
              </div>
              <ul className="mt-6 space-y-4">
                {service.causes.map(item => (
                  <li
                    key={item}
                    className="flex items-start gap-3 leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-safety" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="bg-mist py-14 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-safety">
                SERVICE PROCESS
              </p>
              <h2 className="mt-3 font-display text-3xl font-black text-navy md:text-4xl">
                處理流程
              </h2>
              <p className="mt-4 text-muted-foreground">
                先理解問題，再按現場狀況選擇方法；不是一到場就盲目開工。
              </p>
            </div>

            <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-border bg-white p-6"
                >
                  <span className="font-display text-xs font-black tracking-[0.18em] text-safety">
                    STEP {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-black text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white py-14 md:py-20">
          <div className="container grid gap-8 lg:grid-cols-2">
            <article className="rounded-xl border border-border p-7 md:p-8">
              <div className="flex items-center gap-3">
                <Wrench className="h-6 w-6 text-wagreen-dark" />
                <h2 className="font-display text-2xl font-black text-navy">
                  適合處理的情況
                </h2>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.suitableFor.map(item => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-lg bg-mist px-4 py-3 text-sm font-medium text-navy"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-wagreen-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl bg-navy p-7 text-white md:p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-wagreen" />
                <h2 className="font-display text-2xl font-black">
                  哪些因素影響收費？
                </h2>
              </div>
              <ul className="mt-6 space-y-4">
                {service.priceFactors.map(item => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-wagreen" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={calculatorHref}
                onMouseEnter={() => prefetchRoute(calculatorHref)}
                onFocus={() => prefetchRoute(calculatorHref)}
                onTouchStart={() => prefetchRoute(calculatorHref)}
                onClick={() =>
                  trackNavClick("pricing", {
                    cta_location: "service_detail_price_factors",
                    cta_label: "使用估價計算機",
                    destination_url: calculatorHref,
                    service_name: service.slug,
                  })
                }
                className="mt-7 inline-flex min-h-[44px] items-center gap-2 font-bold text-wagreen hover:text-white"
              >
                使用估價計算機
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </section>

        <section className="bg-mist py-14 md:py-20">
          <div className="container max-w-3xl">
            <h2 className="font-display text-3xl font-black text-navy">
              {service.shortName}常見問題
            </h2>
            <div className="mt-8 space-y-4">
              {service.faqs.map(faq => (
                <article
                  key={faq.question}
                  className="rounded-xl border border-border bg-white p-6"
                >
                  <h3 className="font-display text-lg font-black text-navy">
                    {faq.question}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 md:py-20">
          <div className="container">
            <h2 className="font-display text-2xl font-black text-navy">
              相關通渠服務
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {service.relatedSlugs.map(relatedSlug => {
                const related = getServicePage(relatedSlug);
                if (!related) return null;

                return (
                  <Link
                    key={related.slug}
                    href={`/services/${related.slug}`}
                    onClick={() =>
                      trackNavClick("service", {
                        cta_location: "service_detail_related",
                        cta_label: related.shortName,
                        service_name: related.slug,
                        destination_url: `/services/${related.slug}`,
                      })
                    }
                    className="group rounded-xl border border-border p-6 transition hover:-translate-y-1 hover:border-wagreen/50 hover:shadow-lg"
                  >
                    <span className="text-xs font-bold tracking-[0.15em] text-safety">
                      {related.eyebrow}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-black text-navy">
                      {related.name}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen-dark">
                      查看服務詳情
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 rounded-2xl bg-navy px-7 py-10 text-center md:px-12">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">
                未確定應該用哪種處理方法？
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/65">
                傳送問題位置、去水情況及影片，師傅可先了解情況並提供初步估價。
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA("whatsapp", "service_detail_footer", service.slug);
                  goThanksAfterWhatsApp(
                    `service_detail_footer_${service.slug}`
                  );
                }}
                className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-wagreen px-8 py-3.5 font-bold text-white hover:bg-wagreen-dark"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp 查詢
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
