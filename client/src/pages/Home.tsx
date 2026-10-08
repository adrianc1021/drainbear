import CmsPageSEO from "@/components/CmsPageSEO";
import ContactActions from "@/components/ContactActions";
import CustomerPaths from "@/components/CustomerPaths";
import DrainHomeFaq, { FAQ_ITEMS } from "@/components/DrainHomeFaq";
import ServiceDirectory from "@/components/ServiceDirectory";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { ArrowRight, Check } from "lucide-react";
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
        <div className="container home-hero__grid">
          <div className="home-hero__copy">
            <p className="brand-eyebrow">
              通渠熊 DrainBear · 香港住宅及商業渠務
            </p>
            <h1 id="home-heading">
              香港通渠，
              <br />
              先報價後動工。
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
            <ul className="home-hero__proofs" aria-label="服務原則">
              {["動工前確認收費", "新增工序先說明", "完工後測試去水"].map(
                text => (
                  <li key={text}>
                    <Check aria-hidden="true" />
                    {text}
                  </li>
                )
              )}
            </ul>
          </div>
          <figure className="home-hero__media">
            <img
              src="/images/home-drain-technician-wide.jpg"
              alt="通渠工具與室內去水位的服務示意"
              width="1600"
              height="1000"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>服務示意圖，非客戶工程紀錄。</figcaption>
          </figure>
        </div>
      </section>
      <section
        className="brand-section"
        aria-labelledby="home-services-heading"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">按問題找服務</p>
              <h2 id="home-services-heading">邊個位置塞咗？</h2>
            </div>
            <Link href="/drain-diagnosis">
              未確定？先做問題判斷
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ServiceDirectory location="home_common_problems" />
        </div>
      </section>
      <section
        className="brand-section brand-section--soft"
        aria-labelledby="home-customers-heading"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">不同場所，不同處理</p>
              <h2 id="home-customers-heading">搵到適合你嘅服務</h2>
            </div>
            <Link href="/areas">
              查看服務地區
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <CustomerPaths />
        </div>
      </section>
      <section className="brand-section" aria-labelledby="home-process-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">收費與安排</p>
              <h2 id="home-process-heading">先講清楚，再開始工程</h2>
            </div>
            <Link href="/guide">
              查看收費參考
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ol className="service-process-grid">
            {PROCESS.map(([title, description], index) => (
              <li key={title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
          <p className="section-footnote">
            相片只供初步評估；實際管道狀況及總收費，在現場檢查後確認。
            <Link href="/service-process">了解完整流程</Link>
          </p>
        </div>
      </section>
      <section
        className="brand-section brand-section--soft"
        aria-labelledby="home-emergency-heading"
      >
        <div className="container answer-panel">
          <div>
            <p className="brand-eyebrow">污水倒灌快速答案</p>
            <h2 id="home-emergency-heading">水位一直升，現在點做？</h2>
          </div>
          <div>
            <p>
              先停止沖廁及使用相關水源，移開附近物品，避免直接接觸污水。不要再加入或混合通渠水；拍下受影響位置，聯絡師傅並說明有沒有其他去水位同時倒灌。
            </p>
            <Link href="/services/sewage-backflow">
              查看倒灌處理與注意事項
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
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
