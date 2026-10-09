import Breadcrumbs from "@/components/Breadcrumbs";
import CustomerPaths from "@/components/CustomerPaths";
import SEO from "@/components/SEO";
import ServiceDirectory from "@/components/ServiceDirectory";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { SERVICE_PAGES } from "@/lib/serviceData";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "通渠服務", path: "/services" },
];
const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "通渠熊通渠服務",
  itemListElement: SERVICE_PAGES.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": `${SITE_URL}/services/${service.slug}#service`,
      name: service.name,
      url: `${SITE_URL}/services/${service.slug}`,
      provider: { "@id": BUSINESS_ID },
    },
  })),
};
export default function Services() {
  return (
    <div className="services-page">
      <SEO
        title="通渠服務｜住宅通渠・食肆隔油池・高壓水槍洗渠・CCTV 照喉｜通渠熊 DrainBear"
        description="坐廁、鋅盤、浴室去水慢，或食肆隔油池、大廈主渠淤塞？按問題查看通渠方法、收費因素及注意事項。通渠熊24小時接受查詢，現場確認報價後才動工。"
        path="/services"
        breadcrumbs={CRUMBS}
        jsonLd={SERVICES_JSONLD}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          kicker="住宅 · 食肆 · 物業渠務"
          title="通渠服務，按問題選擇"
          description="塞邊度？按位置搵啱處理方法。"
          contactLocation="services_hero"
        />
      </div>
      <section className="brand-section" aria-labelledby="services-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">八項服務</p>
              <h2 id="services-heading">找到相應的處理方法</h2>
            </div>
            <Link href="/drain-diagnosis">
              未確定問題在哪裏？
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ServiceDirectory location="services_directory" />
        </div>
      </section>
      <section
        className="brand-section brand-section--soft"
        aria-labelledby="services-customers"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">按場所查詢</p>
              <h2 id="services-customers">你的場所，需要甚麼安排？</h2>
            </div>
          </div>
          <CustomerPaths />
        </div>
      </section>
      <section className="brand-section" aria-labelledby="services-tools">
        <div className="container answer-panel">
          <div>
            <p className="brand-eyebrow">工具與檢查</p>
            <h2 id="services-tools">反覆塞渠，要再查原因</h2>
          </div>
          <div>
            <p>
              短暫疏通後很快再塞，可能涉及較長管段積垢或管道問題。CCTV
              照喉可協助查看管內狀況；高壓水槍是否合適，要按管道物料、入口及現場條件判斷。
            </p>
            <nav className="related-inline" aria-label="進一步檢查及報價">
              <Link href="/services/cctv-drain-inspection">CCTV 照喉</Link>
              <Link href="/services/high-pressure-jetting">高壓水槍</Link>
              <Link href="/guide">查詢指南</Link>
              <Link href="/service-process">上門流程</Link>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
