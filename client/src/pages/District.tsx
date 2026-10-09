import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import DistrictServiceLinks from "@/components/DistrictServiceLinks";
import InquiryContactPanel from "@/components/InquiryContactPanel";
/**
 * 通渠熊 DrainBear — 地區專屬著陸頁（觀塘/沙田等）
 * 風格：Premium SaaS Minimalism，大量留白、8px 圓角、懸浮陰影卡片、無 Emoji
 * SEO：Service JSON-LD + FAQPage + 麵包屑 + 長內容當區關鍵字
 */
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import DistrictCaseRecords from "@/components/DistrictCaseRecords";
import { getDistrict } from "@/lib/districtData";
import NotFound from "@/pages/NotFound";
import { ArrowRight, MapPin } from "lucide-react";
import { Link, useParams } from "wouter";

export default function District() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSiteSettings();
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
      "@type": "WebPage",
      "@id": `${SITE_URL}/areas/${d.slug}#webpage`,
      url: `${SITE_URL}/areas/${d.slug}`,
      name: `${d.name}通渠服務`,
      description: d.metaDescription,
      inLanguage: "zh-Hant-HK",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": `${SITE_URL}/areas/${d.slug}#service` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}/areas/${d.slug}#service`,
      url: `${SITE_URL}/areas/${d.slug}`,
      name: `${d.name}通渠服務`,
      serviceType: `${d.name}通渠服務（24 小時接受查詢）`,
      provider: {
        "@id": BUSINESS_ID,
      },
      areaServed: [d.name, ...d.nearby].map(n => ({
        "@type": "Place",
        name: n,
      })),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE_URL}/areas/${d.slug}`,
        servicePhone: {
          "@type": "ContactPoint",
          telephone: settings.phoneE164,
          contactType: "customer service",
        },
        availableLanguage: ["zh-Hant", "zh-HK"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faqs.map((f, index) => ({
        url: `${SITE_URL}/areas/${d.slug}#district-answer-${index + 1}`,
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="district-editorial">
      <SEO
        title={`${d.name}通渠｜住宅及商戶處理・24小時查詢｜通渠熊`}
        description={d.metaDescription}
        path={`/areas/${d.slug}`}
        keywords={d.keywords}
        jsonLd={jsonLd}
        breadcrumbs={crumbs}
      />
      {/* Hero */}
      <div className="site-hero-shell">
        <Breadcrumbs items={crumbs} tone="dark" />
        <EditorialPageHero
          kicker={`${d.region} · ${d.name}通渠`}
          title={`${d.name}通渠服務`}
          description="住宅、食肆或共用渠問題，先提供位置與相片，確認合適處理及上門時間。"
          contactLocation="district_hero"
          topic={d.name}
          message={`您好，我位於${d.name}，想查詢通渠處理安排。`}
        />
      </div>

      {/* 當區介紹（SEO 長內容） */}
      <section className="bg-white py-14 md:py-16">
        <div className="container grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="reveal max-w-3xl">
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              {d.name}區渠務特點
            </h2>
            <AnimatedDisclosure
              id="district-background"
              title="了解當區渠務特點"
              className="reading-disclosure"
            >
              {d.intro.map(p => (
                <p key={p.slice(0, 12)}>{p}</p>
              ))}
            </AnimatedDisclosure>
            <div className="mt-6 flex flex-wrap gap-2">
              {d.landmarks.map(l => (
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

          <DistrictServiceLinks district={d.name} slug={d.slug} />
        </div>
      </section>

      <DistrictCaseRecords district={d.name} />
      {/* 當區常見問題場景 */}
      <section className="bg-mist py-14 md:py-16">
        <div className="container">
          <div className="reveal mb-10 max-w-xl">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              常見情況
            </div>
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              {d.name}常見渠務情況
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.painPoints.map((p, i) => (
              <AnimatedDisclosure
                key={p.title}
                id={`district-situation-${i + 1}`}
                title={p.title}
              >
                <p>{p.desc}</p>
              </AnimatedDisclosure>
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
              <AnimatedDisclosure
                key={f.q}
                id={`district-answer-${i + 1}`}
                title={f.q}
              >
                <p>{f.a}</p>
              </AnimatedDisclosure>
            ))}
          </div>
          <div className="reveal mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">想整理現場資料？</span>
            <Link
              href="/guide"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 font-bold text-wagreen-dark hover:gap-2.5"
            >
              如何了解處理及報價 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/drain-diagnosis"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 font-bold text-navy/70 hover:gap-2.5 hover:text-navy"
            >
              先判斷淤塞問題 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cases"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 font-bold text-navy/70 hover:gap-2.5 hover:text-navy"
            >
              查看工程案例 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 鄰近地區 + CTA */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="container">
          <InquiryContactPanel
            location={`district_${d.slug}`}
            title={`${d.name}通渠，先交代現場情況`}
            defaultMessage={`您好，我位於${d.name}，想查詢通渠處理安排。`}
            chooseCustomer
          />
        </div>
      </section>
    </div>
  );
}
