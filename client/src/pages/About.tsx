import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import CustomerPaths from "@/components/CustomerPaths";
import CompletedCaseEvidence from "@/components/CompletedCaseEvidence";
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
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
        title="關於通渠熊｜香港通渠公司・服務流程與施工紀錄"
        description="認識通渠熊 DrainBear 的香港住宅、食肆及物業通渠服務。了解檢查、報價及試水流程，查看洗手盆與雨水渠施工紀錄、公司聯絡及官方商家資料。"
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
          title="通渠熊，做事有交代。"
          description="承接香港住宅、食肆及物業渠務。由檢查、報價到施工試水，把處理工序交代清楚。"
          contactLocation="about_hero"
        />
      </div>
      <section className="brand-section" id="company-facts">
        <div className="container company-profile">
          <div className="company-profile__intro">
            <p className="brand-eyebrow">通渠熊 DrainBear</p>
            <h2>
              通渠靠手藝，
              <br />
              信任靠交代。
            </h2>
            <p>
              每個去水位都有不同情況。我們先了解堵塞範圍與施工入口，說明處理方法及收費，確認後才動工。
            </p>
            <nav
              className="company-profile__links"
              aria-label="了解通渠熊的服務"
            >
              <Link href="/service-process">檢查、施工與試水流程</Link>
              <Link href="/cases">查看現場施工紀錄</Link>
              <Link href="/blog/hong-kong-drain-cleaning-price-guide">
                了解報價包括哪些工序
              </Link>
            </nav>
          </div>
          <div>
            <h3>公司及聯絡資料</h3>
            <dl className="company-facts">
              <div>
                <dt>品牌名稱</dt>
                <dd>{settings.businessName}（通渠熊／DrainBear）</dd>
              </div>
              <div>
                <dt>查詢電話</dt>
                <dd>
                  <a href={`tel:${settings.phoneE164}`}>
                    {settings.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt>官方網站</dt>
                <dd>
                  <Link href="/">drainbearhk.com</Link>
                </dd>
              </div>
              {settings.googleBusinessUrl ? (
                <div>
                  <dt>Google 商家資料</dt>
                  <dd>
                    <a
                      href={settings.googleBusinessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      查看通渠熊商家資料
                      <span className="sr-only">（另開視窗）</span>
                    </a>
                  </dd>
                </div>
              ) : null}
              {settings.instagramUrl ? (
                <div>
                  <dt>Instagram</dt>
                  <dd>
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @drainbearhk<span className="sr-only">（另開視窗）</span>
                    </a>
                  </dd>
                </div>
              ) : null}
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
          <CustomerPaths illustrated compact />
        </div>
      </section>
      <section className="brand-section">
        <div className="container brand-narrow">
          <h2>做過甚麼，睇返施工紀錄。</h2>
          <p className="mt-4">
            家居洗手盆的油垢清理、學校雨水渠的高壓清洗，分別記錄現場問題、處理方法及完成後的試水。相片與工程詳情一併保留，方便了解實際工序。
          </p>
          <CompletedCaseEvidence />
          <p className="mt-4">
            需要安排師傅？可先查看<Link href="/">通渠熊香港通渠服務</Link>
            ，再按受影響位置提供資料查詢。
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
