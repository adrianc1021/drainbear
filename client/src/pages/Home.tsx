import CmsPageSEO from "@/components/CmsPageSEO";
import ContactActions from "@/components/ContactActions";
import DrainHomeFaq, { FAQ_ITEMS } from "@/components/DrainHomeFaq";
import HomeServiceFinder from "@/components/HomeServiceFinder";
import RecordedCaseGallery from "@/components/RecordedCaseGallery";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import {
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  Droplets,
  MessageSquareText,
} from "lucide-react";
import { Link } from "wouter";

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: `${SITE_URL}/`,
  name: "香港 24 小時通渠服務｜通渠熊 DrainBear",
  description: "香港住宅、食肆及物業通渠查詢，按現場情況安排合適處理。",
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
  {
    icon: MessageSquareText,
    title: "提供現場資料",
    description: "傳地區、堵塞位置同相片；有倒灌或用過通渠水，也請說明。",
  },
  {
    icon: CalendarClock,
    title: "確認上門安排",
    description: "按現場情況確認人手、工具及可安排時間。",
  },
  {
    icon: ClipboardCheck,
    title: "現場檢查及確認",
    description: "師傅檢查管道及施工條件，說明方案，確認後開始處理。",
  },
  {
    icon: Droplets,
    title: "疏通及測試去水",
    description: "完成已確認工序，測試去水，再整理施工位置。",
  },
] as const;

export default function Home() {
  return (
    <div className="home-page">
      <CmsPageSEO
        cmsEnabled={false}
        title="香港通渠服務｜24 小時查詢・真實施工紀錄｜通渠熊 DrainBear"
        description="塞廁所、鋅盤去水慢或污水倒灌？通渠熊提供香港住宅、食肆及物業通渠查詢。24 小時熱線及 WhatsApp 傳相查詢，按現場情況了解處理及安排。"
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
          </figure>
        </div>
      </section>
      <HomeServiceFinder />
      <RecordedCaseGallery />
      <section
        className="brand-section brand-section--soft home-arrangement"
        aria-labelledby="home-process-heading"
      >
        <div className="container home-arrangement__grid">
          <div className="home-arrangement__intro">
            <div>
              <p className="brand-eyebrow">上門與處理安排</p>
              <h2 id="home-process-heading">
                先了解現場，
                <br />
                再安排處理。
              </h2>
              <p className="home-arrangement__description">
                說明問題位置與去水情況，方便團隊了解所需工具、進場條件及可安排時間。
              </p>
            </div>
            <Link href="/service-process">
              了解服務流程
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ol className="home-arrangement__steps">
            {PROCESS.map((step, index) => (
              <li key={step.title}>
                <span
                  className="home-arrangement__step-marker"
                  aria-hidden="true"
                >
                  <step.icon />
                  <span>0{index + 1}</span>
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="section-footnote home-arrangement__footnote">
            相片有助了解情況；實際處理方法由師傅檢查後確認。
            <Link href="/service-process">了解完整流程</Link>
          </p>
        </div>
      </section>
      <DrainHomeFaq />
      <nav className="container home-resource-links" aria-label="延伸渠務資料">
        <Link href="/areas">
          查看服務地區 <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/about">
          關於通渠熊 <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/guide">
          如何了解報價
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
