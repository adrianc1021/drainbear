import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import DistrictServiceLinks from "@/components/DistrictServiceLinks";
import InquiryContactPanel from "@/components/InquiryContactPanel";
/** Shared reading layout; each district has its own complete service article. */
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import DistrictCaseRecords from "@/components/DistrictCaseRecords";
import { getDistrict } from "@/lib/districtData";
import { DISTRICT_CONTENT_REVISED_AT } from "@/lib/districtSearchContent";
import NotFound from "@/pages/NotFound";
import { ArrowRight, MapPin } from "lucide-react";
import { Link, useParams } from "wouter";

export default function District() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSiteSettings();
  const d = getDistrict(slug || "");
  if (!d) return <NotFound />;
  const seoTitle =
    d.metaTitle ?? `${d.name}通渠｜住宅及商戶處理・24小時查詢｜通渠熊`;
  const pageHeading = d.pageHeading ?? `${d.name}通渠服務`;

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
      name: seoTitle,
      description: d.metaDescription,
      dateModified: DISTRICT_CONTENT_REVISED_AT,
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
        title={seoTitle}
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
          title={pageHeading}
          description={
            d.leadDescription ??
            "住宅、食肆或共用渠問題，先提供位置與相片，確認合適處理及上門時間。"
          }
          contactLocation="district_hero"
          topic={d.name}
          message={`您好，我位於${d.name}，想查詢通渠處理安排。`}
        />
      </div>

      {/* The full local article is readable without opening a disclosure. */}
      <section className="bg-white py-14 md:py-16">
        <div className="container district-reading-layout">
          <article
            className="district-article"
            aria-labelledby="district-article-title"
          >
            <h2
              id="district-article-title"
              className="font-display text-2xl font-black text-navy md:text-3xl"
            >
              {d.articleTitle}
            </h2>
            <div id="district-background" className="district-article__intro">
              {d.intro.map(p => (
                <p key={p.slice(0, 12)}>{p}</p>
              ))}
            </div>
            <nav
              className="district-article__contents"
              aria-label={`${d.name}通渠文章目錄`}
            >
              <span>本頁重點</span>
              <ol>
                {d.localSections?.map(section => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
            {d.localSections?.map(section => (
              <section
                key={section.id}
                id={section.id}
                className="mt-8"
                aria-labelledby={`${section.id}-heading`}
              >
                <h3
                  id={`${section.id}-heading`}
                  className="font-display text-lg font-black text-navy"
                >
                  {section.title}
                </h3>
                {section.paragraphs.map(paragraph => (
                  <p
                    key={paragraph}
                    className="mt-3 leading-relaxed text-navy/75"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.link ? (
                  <Link
                    className="district-article__link"
                    href={section.link.href}
                  >
                    {section.link.label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ) : null}
              </section>
            ))}
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

          <DistrictServiceLinks
            district={d.name}
            serviceSlugs={d.serviceSlugs}
          />
        </div>
      </section>

      <DistrictCaseRecords district={d.name} />
      {/* Preparation follows this district's article, rather than repeated symptoms. */}
      <section className="bg-mist py-14 md:py-16">
        <div className="container">
          <div className="reveal mb-10 max-w-xl">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              查詢前準備
            </div>
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              {d.name}通渠，帶齊這三類資料
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
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
          <nav
            className="district-article__reading"
            aria-label={`${d.name}相關閱讀`}
          >
            <h3>延伸閱讀</h3>
            {d.relatedReading?.map(item => (
              <Link key={item.href} href={item.href}>
                {item.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
            <Link href="/">
              通渠熊香港通渠服務
              <ArrowRight aria-hidden="true" />
            </Link>
          </nav>
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
