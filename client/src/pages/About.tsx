import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import CustomerPaths from "@/components/CustomerPaths";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { SERVICE_PAGES } from "@/lib/serviceData";
import { Link } from "wouter";

export default function About() {
  const { settings } = useSiteSettings();
  const crumbs = [
    { name: "首頁", path: "/" },
    { name: "關於通渠熊", path: "/about" },
  ];
  return (
    <div className="about-page">
      <SEO
        title="關於通渠熊 DrainBear｜香港住宅、食肆及物業渠務"
        description="了解通渠熊的服務範圍、聯絡方式與施工紀錄。香港住宅、食肆及物業渠務，24 小時接受查詢，上門時間按實際安排確認。"
        path="/about"
        breadcrumbs={crumbs}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${SITE_URL}/about#webpage`,
          url: `${SITE_URL}/about`,
          about: { "@id": BUSINESS_ID },
        }}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={crumbs} tone="dark" />
        <EditorialPageHero
          kicker="關於通渠熊"
          title="香港通渠，先搵通渠熊。"
          description="由家居去水到食肆及物業渠務，先了解實際情況，再安排合適處理。"
          contactLocation="about_hero"
        />
      </div>
      <section className="brand-section" id="company-facts">
        <div className="container brand-narrow">
          <p className="brand-eyebrow">公司及聯絡資料</p>
          <h2>認識通渠熊</h2>
          <dl className="company-facts">
            <div>
              <dt>品牌名稱</dt>
              <dd>{settings.businessName}（通渠熊／DrainBear）</dd>
            </div>
            <div>
              <dt>查詢電話</dt>
              <dd>{settings.phoneDisplay}</dd>
            </div>
            <div>
              <dt>服務對象</dt>
              <dd>住宅住戶、食肆及商舖、業主及物業管理</dd>
            </div>
            <div>
              <dt>服務地區</dt>
              <dd>
                港島、九龍、新界及離島可先查詢；進場、交通及設備安排按位置確認。
              </dd>
            </div>
            <div>
              <dt>查詢安排</dt>
              <dd>24 小時接受查詢；上門時間由團隊按地區、人手及設備確認。</dd>
            </div>
          </dl>
          <p className="section-footnote">
            聯絡資料以本頁及網站的最新顯示為準。
          </p>
        </div>
      </section>
      <section className="brand-section brand-section--soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">按你的情況開始</p>
              <h2>住宅、食肆與物業</h2>
            </div>
          </div>
          <CustomerPaths />
        </div>
      </section>
      <section className="brand-section">
        <div className="container brand-narrow">
          <h2>服務與施工紀錄</h2>
          <p className="mt-4">
            提供現場資料，有助了解堵塞位置與合適工具。公開施工影片記錄現場操作，工程結果以個別紀錄及現場確認為準。
          </p>
          <nav className="related-inline" aria-label="公司服務及證據">
            {SERVICE_PAGES.map(service => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.shortName}
              </Link>
            ))}
            <Link href="/cases">真實施工紀錄</Link>
            <Link href="/service-process">上門服務流程</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
