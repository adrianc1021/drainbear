import CmsPageSEO from "@/components/CmsPageSEO";
import ContactActions from "@/components/ContactActions";
import CustomerPaths from "@/components/CustomerPaths";
import DrainHomeFaq, { FAQ_ITEMS } from "@/components/DrainHomeFaq";
import HomeServiceFinder from "@/components/HomeServiceFinder";
import ServiceDirectory from "@/components/ServiceDirectory";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { ArrowRight, Droplets, FileCheck2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: `${SITE_URL}/`,
  name: "香港 24 小時通渠服務｜通渠熊 DrainBear",
  description: "香港住宅、食肆及物業通渠查詢，現場確認收費後才動工。",
  inLanguage: "zh-Hant-HK",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": BUSINESS_ID },
};
const HOME_FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#home-faq`,
  mainEntity: FAQ_ITEMS.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};
const PROCESS = [
  ["提供現場資料", "傳送地區、堵塞位置及相片；有倒灌或用過通渠水，也請說明。"],
  ["確認上門安排", "按現場情況確認人手、工具及可安排時間。"],
  ["檢查後確認收費", "師傅說明處理方法及總收費，雙方確認後才動工。"],
  ["疏通及測試去水", "完成已確認工序，測試去水，整理施工位置。"],
] as const;

export default function Home() {
  return (
    <div className="home-page">
      <CmsPageSEO
        cmsEnabled={false}
        title="香港通渠服務｜先報價後動工・24 小時查詢｜通渠熊 DrainBear"
        description="塞廁所、鋅盤去水慢或污水倒灌？通渠熊提供香港住宅、食肆及物業通渠查詢。24 小時熱線及 WhatsApp 傳相問價，現場確認收費後才動工。"
        path="/"
        jsonLd={[HOME_JSONLD, HOME_FAQ_JSONLD]}
      />
      <section
        className="home-hero"
        aria-labelledby="home-heading"
        data-pr20-section="hero"
      >
        <div className="home-hero__stage">
          <div className="container home-hero__grid">
            <div className="home-hero__copy">
              <p className="brand-eyebrow">香港通渠服務 · 24 小時接受查詢</p>
              <h1 id="home-heading">
                <span className="home-hero__headline-line">香港通渠，</span>
                <span className="home-hero__headline-line">先搵通渠熊。</span>
              </h1>
              <p className="home-hero__intro">
                塞廁所、鋅盤去水慢，定係污水倒灌？
                <br />
                傳相片同地區，先了解處理方法及報價。
              </p>
              <ContactActions location="home_hero" prominent />
              <p className="contact-note">
                24 小時接受查詢；上門時間按地區、人手及設備確認。
              </p>
            </div>
          </div>
          <figure className="home-hero__media">
            <img
              src="/images/drainbear-paper-hero.webp"
              srcSet="/images/drainbear-paper-hero-640.webp 640w, /images/drainbear-paper-hero-960.webp 960w, /images/drainbear-paper-hero.webp 1536w"
              sizes="100vw"
              alt="白色紙藝通渠熊、香港天際線及渠務工具的品牌示意"
              width="1536"
              height="1024"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>服務示意圖，非客戶工程紀錄。</figcaption>
          </figure>
        </div>
        <HomeServiceFinder />
        <ul className="container home-hero__proofs" aria-label="服務原則">
          {[
            {
              icon: ShieldCheck,
              title: "動工前確認收費",
              description: "現場檢查後，先講清楚總收費。",
            },
            {
              icon: FileCheck2,
              title: "新增工序先說明",
              description: "有額外處理需要，先同你確認。",
            },
            {
              icon: Droplets,
              title: "完工後測試去水",
              description: "完成工序，再檢查去水情況。",
            },
          ].map(item => (
            <li key={item.title}>
              <span className="home-hero__proof-icon">
                <item.icon aria-hidden="true" />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section
        className="brand-section home-problems"
        aria-labelledby="home-services-heading"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">由眼前嘅問題開始</p>
              <h2 id="home-services-heading">塞邊度？搵啱處理方法。</h2>
            </div>
            <Link href="/drain-diagnosis">
              未確定？先做問題判斷
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ServiceDirectory location="home_common_problems" compact />
          <aside
            className="home-safety-note"
            aria-labelledby="home-safety-heading"
          >
            <ShieldCheck aria-hidden="true" />
            <div>
              <h3 id="home-safety-heading">污水倒灌？先停用相關水源。</h3>
              <p>
                停止沖廁，避免直接接觸污水；不要加入或混合通渠水。拍下受影響位置，並說明其他去水位有沒有同時倒灌。
              </p>
            </div>
            <Link href="/services/sewage-backflow">
              查看處理建議
              <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
      <section
        className="brand-section home-customers"
        aria-labelledby="home-customers-heading"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">住宅、商舖同物業都照顧到</p>
              <h2 id="home-customers-heading">你嘅場所，點樣處理？</h2>
            </div>
            <Link href="/areas">
              查看服務地區
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <CustomerPaths compact />
        </div>
      </section>
      <section
        className="brand-section brand-section--soft home-arrangement"
        aria-labelledby="home-process-heading"
      >
        <div className="container home-arrangement__grid">
          <div className="home-arrangement__intro">
            <div>
              <p className="brand-eyebrow">收費與安排</p>
              <h2 id="home-process-heading">
                先講清楚收費，
                <br />
                再開始工程。
              </h2>
              <p className="home-arrangement__description">
                同樣係塞渠，堵塞位置、工具同施工範圍都會影響報價。先提供資料，再由師傅現場確認總收費。
              </p>
            </div>
            <Link href="/guide">
              查看收費參考
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ol className="home-arrangement__steps">
            {PROCESS.map(([title, description], index) => (
              <li key={title}>
                <span aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="section-footnote home-arrangement__footnote">
            相片只供初步評估；實際管道狀況及總收費，在現場檢查後確認。
            <Link href="/service-process">了解完整流程</Link>
          </p>
        </div>
      </section>
      <DrainHomeFaq />
      <nav className="container home-resource-links" aria-label="延伸渠務資料">
        <Link href="/cases">
          查看工程紀錄
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/blog">
          閱讀渠務保養文章
          <ArrowRight aria-hidden="true" />
        </Link>
      </nav>
    </div>
  );
}
