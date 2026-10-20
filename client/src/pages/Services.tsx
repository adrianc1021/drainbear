import ServiceScenePhoto from "@/components/ServiceScenePhoto";
import {
  STARTING_PRICE_LINE,
  SERVICE_PRICE_SPECIFICATION,
} from "../../../shared/pricing";
import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
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
      offers: {
        "@type": "Offer",
        priceSpecification: SERVICE_PRICE_SPECIFICATION,
      },
    },
  })),
};
export default function Services() {
  return (
    <div className="services-page">
      <SEO
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
        title="通渠服務 HK$300 起｜坐廁、鋅盤、高壓洗渠及 CCTV｜通渠熊"
        description="通渠熊全線通渠服務 HK$300 起！坐廁、鋅盤、浴室、主渠、隔油池、高壓洗渠及 CCTV 照渠，立即 WhatsApp 傳相查詢報價。"
        path="/services"
        breadcrumbs={CRUMBS}
        jsonLd={SERVICES_JSONLD}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          priceLabel={STARTING_PRICE_LINE}
          kicker="住宅 · 食肆 · 物業渠務"
          title="通渠服務，按問題選擇"
          description="坐廁塞、鋅盤去水慢、浴室積水？即刻搵通渠熊，傳相查詢報價。"
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
          <CustomerPaths illustrated compact />
        </div>
      </section>
      <section className="brand-section service-scene-gallery" aria-labelledby="service-scenes-heading">
        <div className="container">
          <div className="section-heading"><h2 id="service-scenes-heading">由現場入口，了解處理安排</h2></div>
          <div className="service-scene-gallery__grid">
            <div><ServiceScenePhoto scene="drain-inspection-guide" /><h3>鋅盤與支喉檢查</h3><Link href="/services/kitchen-sink-unblocking">了解鋅盤通渠 <ArrowRight aria-hidden="true" /></Link></div>
            <div><ServiceScenePhoto scene="restaurant-drains" /><h3>食肆廚房去水</h3><Link href="/services/grease-trap-cleaning">了解隔油池清理 <ArrowRight aria-hidden="true" /></Link></div>
            <div><ServiceScenePhoto scene="bathroom-preparation" /><h3>浴室與地台去水</h3><Link href="/services/bathroom-drain-unblocking">了解浴室通渠 <ArrowRight aria-hidden="true" /></Link></div>
          </div>
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
