import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import InquiryContactPanel from "@/components/InquiryContactPanel";
import RelatedCaseRecords from "@/components/RelatedCaseRecords";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { getServicePage } from "@/lib/serviceData";
import { getCustomerJourney } from "@shared/customerJourneys";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "wouter";
import NotFound from "./NotFound";

export default function CustomerJourney() {
  const { slug } = useParams<{ slug: string }>();
  const customer = getCustomerJourney(slug ?? "");
  if (!customer) return <NotFound />;
  const path = `/customers/${customer.slug}`;
  const crumbs = [
    { name: "首頁", path: "/" },
    { name: customer.name, path },
  ];
  return (
    <div className="customer-journey-page">
      <SEO
        title={`${customer.name}通渠｜處理方法與上門安排｜通渠熊`}
        description={customer.description}
        path={path}
        breadcrumbs={crumbs}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}${path}#webpage`,
            url: `${SITE_URL}${path}`,
            name: customer.title,
            about: { "@id": BUSINESS_ID },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: customer.faqs.map((faq, i) => ({
              "@type": "Question",
              url: `${SITE_URL}${path}#customer-answer-${i + 1}`,
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={crumbs} tone="dark" />
        <EditorialPageHero
          kicker={customer.name}
          title={customer.title}
          description={customer.description}
          contactLocation={`customer_${customer.slug}_hero`}
          message={customer.message}
          topic={customer.slug}
        />
      </div>
      <nav className="container page-section-nav" aria-label="本頁內容">
        <a href="#customer-services">相關服務</a>
        <a href="#customer-cases">施工紀錄</a>
        <a href="#customer-preparation">查詢資料</a>
        <a href="#customer-faq">常見問題</a>
      </nav>
      <section className="brand-section" id="customer-services">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">按受影響位置選擇</p>
              <h2>你可能需要的服務</h2>
            </div>
          </div>
          <div className="customer-services-grid">
            {customer.serviceSlugs.map(slug => {
              const service = getServicePage(slug)!;
              return (
                <Link href={`/services/${slug}`} key={slug}>
                  <h3>{service.shortName}</h3>
                  <p>{service.answerSummary.handles}</p>
                  <span>
                    了解處理方法 <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <RelatedCaseRecords
        serviceSlugs={customer.serviceSlugs}
        location={`customer_${customer.slug}_cases`}
        id="customer-cases"
      />
      <section className="brand-section" id="customer-preparation">
        <div className="container">
          <InquiryContactPanel
            customer={customer.slug}
            location={`customer_${customer.slug}_intake`}
            title="查詢前，準備這些資料"
            description={customer.preparation}
          />
          <nav className="related-inline" aria-label="進一步了解安排">
            <Link href="/guide">如何了解報價</Link>
            <Link href="/service-process">上門至完工流程</Link>
            <Link href="/areas">服務地區</Link>
          </nav>
        </div>
      </section>
      <section className="brand-section brand-section--soft" id="customer-faq">
        <div className="container brand-narrow">
          <h2>{customer.name}常見問題</h2>
          <div className="brand-faq">
            {customer.faqs.map((faq, i) => (
              <details key={faq.question} id={`customer-answer-${i + 1}`}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
