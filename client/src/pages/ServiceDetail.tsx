import ServiceDistrictReading from "@/components/ServiceDistrictReading";
import SectionIllustration from "@/components/SectionIllustration";
import { HouseholdServiceTopics } from "@/components/HouseholdTopicGuide";
import {
  STARTING_PRICE_LINE,
  SERVICE_PRICE_SPECIFICATION,
} from "../../../shared/pricing";
import ServiceAnswerLinks from "@/components/ServiceAnswerLinks";
import ServiceIllustration from "@/components/ServiceIllustration";
import RelatedDrainArticles from "@/components/RelatedDrainArticles";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import { SERVICE_PROBLEM_GUIDES } from "@/lib/serviceProblemGuides";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import InquiryContactPanel, {
  type InquiryServiceType,
} from "@/components/InquiryContactPanel";
import SEO from "@/components/SEO";
import RelatedCaseRecords from "@/components/RelatedCaseRecords";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { trackNavClick } from "@/lib/analytics";
import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import { getServicePage } from "@/lib/serviceData";
import NotFound from "@/pages/NotFound";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "wouter";

const INQUIRY_TYPE_BY_SLUG: Record<string, InquiryServiceType> = {
  "toilet-unblocking": "residential",
  "kitchen-sink-unblocking": "residential",
  "bathroom-drain-unblocking": "residential",
  "sewage-backflow": "commercial",
  "high-pressure-jetting": "hydrojet",
  "cctv-drain-inspection": "cctv",
  "main-drain-manhole": "commercial",
  "grease-trap-cleaning": "commercial",
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServicePage(slug || "");
  const { settings } = useSiteSettings();

  if (!service) return <NotFound />;

  const guide = SERVICE_PROBLEM_GUIDES[service.slug];
  const path = `/services/${service.slug}`;
  const serviceSocialImage = `${SITE_URL}${BRAND_SOCIAL_IMAGE}`;
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
    description: `${service.description} ${STARTING_PRICE_LINE}。`,
    offers: {
      "@type": "Offer",
      priceSpecification: SERVICE_PRICE_SPECIFICATION,
      url: `${SITE_URL}${path}`,
    },
    url: `${SITE_URL}${path}`,
    image: serviceSocialImage,
    provider: {
      "@id": BUSINESS_ID,
      name: settings.businessName,
    },
    mainEntityOfPage: { "@id": `${SITE_URL}${path}#webpage` },
    subjectOf: { "@id": `${SITE_URL}${path}#webpage` },
    areaServed: {
      "@type": "Country",
      name: "Hong Kong",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}${path}`,
      servicePhone: {
        "@type": "ContactPoint",
        "@id": `${SITE_URL}/#contact`,
        telephone: settings.phoneE164,
        contactType: "customer service",
      },
      availableLanguage: ["zh-Hant", "zh-HK"],
    },
  };

  return (
    <div className="phase4-service-detail" data-phase4-page="service-detail">
      <SEO
        title={service.title}
        description={`${service.description} ${STARTING_PRICE_LINE}，立即查詢。`}
        path={path}
        image={serviceSocialImage}
        imageAlt={BRAND_SOCIAL_ALT}
        jsonLd={[
          serviceJsonLd,
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${SITE_URL}${path}#faq`,
            mainEntity: service.faqs.map((faq, index) => ({
              "@id": `${SITE_URL}${path}#service-answer-${index + 1}`,
              url: `${SITE_URL}${path}#service-answer-${index + 1}`,
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]}
        breadcrumbs={crumbs}
      />

      <div className="site-hero-shell">
        <Breadcrumbs items={crumbs} tone="dark" />
        <EditorialPageHero
          priceLabel={STARTING_PRICE_LINE}
          kicker={service.shortName}
          title={service.name}
          description={guide.intro}
          contactLocation="service_detail_hero"
          topic={service.slug}
          message={guide.message}
        />
      </div>
      <nav className="container page-section-nav" aria-label="本頁內容">
        <a href="#service-answer-summary">問題與處理</a>
        <a href="#service-cases">施工紀錄</a>
        <a href="#service-method">處理流程</a>
        <a href="#service-questions">常見問題</a>
        <a href="#service-contact">現場查詢</a>
      </nav>
      <section
        className="brand-section brand-section--soft"
        aria-labelledby="service-answer-summary"
      >
        <div className="container service-reading">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">先睇重點</p>
              <h2 id="service-answer-summary">係咪你遇到嘅情況？</h2>
            </div>
            <Link href="/drain-diagnosis">
              幫我判斷 <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="service-intent-overview">
            <ServiceIllustration slug={service.slug} />
            <ul className="service-situation-chips">
              {service.suitableFor.map(item => (
                <li key={item}>
                  <CheckCircle2 aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="service-problem-guide">
            <section aria-labelledby="service-first-steps">
              <h3 id="service-first-steps">{guide.firstHeading}</h3>
              <ul>
                {guide.firstSteps.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="service-common-causes">
              <h3 id="service-common-causes">可能由哪些情況引起？</h3>
              <ul>
                {service.causes.map(cause => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="service-safe-observation">
              <h3 id="service-safe-observation">{guide.observeHeading}</h3>
              <ul>
                {guide.observations.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="service-when-to-call">
              <h3 id="service-when-to-call">{guide.helpHeading}</h3>
              <p>{guide.help}</p>
              <a href="#service-contact">
                提供現場資料，查詢處理及報價 <ArrowRight aria-hidden="true" />
              </a>
            </section>
          </div>
          <AnimatedDisclosure
            id="service-symptoms"
            title="其他症狀與檢查限制"
            className="reading-disclosure"
          >
            <div className="service-reading__columns">
              <div>
                <h3>常見症狀</h3>
                <SectionIllustration scene="observe" />
                <ul>
                  {service.symptoms.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <dl className="service-reading__facts">
              {[
                ["主要限制", service.answerSummary.limitation],
                ["動工前確認", service.answerSummary.confirmBeforeWork],
              ].map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </AnimatedDisclosure>
        </div>
      </section>
      <RelatedCaseRecords
        serviceSlugs={[service.slug]}
        location={`service_${service.slug}_cases`}
        id="service-cases"
      />
      <section id="service-method" className="brand-section">
        <div className="container service-reading">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">四個步驟</p>
              <h2>點樣處理？</h2>
            </div>
          </div>
          <SectionIllustration scene="services" />
          <ol className="service-step-overview">
            {service.process.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{step.title}</h3>
              </li>
            ))}
          </ol>
          <AnimatedDisclosure
            id="service-method-details"
            title="了解各步驟與施工準備"
            className="reading-disclosure"
          >
            <ol className="service-reading__process">
              {service.process.map(step => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
            <h3>施工前需要了解</h3>
            <ul>
              {service.priceFactors.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href="/service-process">
              查看完整上門流程 <ArrowRight aria-hidden="true" />
            </Link>
          </AnimatedDisclosure>
        </div>
      </section>
      <section
        id="service-questions"
        className="brand-section brand-section--soft"
      >
        <div className="container brand-narrow">
          <h2>{service.shortName}常見問題</h2>
          <SectionIllustration scene="quote" />
          <div className="reading-faq">
            {service.faqs.map((faq, index) => (
              <AnimatedDisclosure
                key={faq.question}
                id={`service-answer-${index + 1}`}
                title={faq.question}
              >
                <p>{faq.answer}</p>
              </AnimatedDisclosure>
            ))}
          </div>
        </div>
      </section>
      <section id="service-contact" className="brand-section">
        <div className="container">
          <InquiryContactPanel
            location={`service_${service.slug}`}
            title={`想查詢${service.shortName}？`}
            description="傳相片同地區，先了解點處理。"
            defaultServiceType={INQUIRY_TYPE_BY_SLUG[service.slug]}
            customer={
              ["main-drain-manhole", "sewage-backflow"].includes(service.slug)
                ? "property-management"
                : undefined
            }
            defaultMessage={guide.message}
          />
          <nav className="service-related-links" aria-label="相關通渠服務">
            {service.relatedSlugs.map(slug => {
              const related = getServicePage(slug);
              return related ? (
                <Link
                  href={`/services/${slug}`}
                  key={slug}
                  onClick={() =>
                    trackNavClick("service", {
                      cta_location: "service_detail_related",
                      cta_label: related.shortName,
                      service_name: slug,
                      destination_url: `/services/${slug}`,
                    })
                  }
                >
                  {related.shortName}
                  <ArrowRight aria-hidden="true" />
                </Link>
              ) : null;
            })}
          </nav>
          <HouseholdServiceTopics serviceSlug={service.slug} />
          <ServiceDistrictReading serviceSlug={service.slug} />
          <ServiceAnswerLinks serviceSlug={service.slug} />
          <RelatedDrainArticles serviceSlug={service.slug} />
        </div>
      </section>
    </div>
  );
}
