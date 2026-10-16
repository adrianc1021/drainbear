import CmsPageSEO from "@/components/CmsPageSEO";
import ContactActions from "@/components/ContactActions";
import DrainHomeFaq, { FAQ_ITEMS } from "@/components/DrainHomeFaq";
import HomeServiceFinder from "@/components/HomeServiceFinder";
import HomeCompanyGuides from "@/components/HomeCompanyGuides";
import HomeDrainMethods from "@/components/HomeDrainMethods";
import RecordedCaseGallery from "@/components/RecordedCaseGallery";
import HomeHeroScene from "@/components/HomeHeroScene";
import HomeServiceRows from "@/components/HomeServiceRows";
import { SITE_URL } from "@/config/site";
import { BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import {
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  Droplets,
  MessageSquareText,
} from "lucide-react";
import { Link } from "wouter";

import {
  STARTING_PRICE_LINE,
  STARTING_PRICE_LABEL,
} from "../../../shared/pricing";

const HOME_TITLE = "香港通渠公司｜通渠 HK$300 起｜通渠熊 DrainBear";
const HOME_DESCRIPTION =
  "通渠熊全線通渠服務 HK$300 起！坐廁塞、鋅盤去水慢、浴室淤塞及主渠倒灌，住宅、食肆及物業都可查詢。立即 WhatsApp 傳相報價，24 小時接受查詢。";

const HOME_FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#home-faq`,
  mainEntity: FAQ_ITEMS.map((item, index) => ({
    "@type": "Question",
    url: `${SITE_URL}/#home-answer-${index + 1}`,
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};
const PROCESS = [
  {
    icon: MessageSquareText,
    title: "提供現場資料",
    description: "提供地區、受影響位置及相片或短片。",
  },
  {
    icon: CalendarClock,
    title: "確認上門安排",
    description: "按地區、人手、設備及進場條件確認時間。",
  },
  {
    icon: ClipboardCheck,
    title: "現場檢查及確認",
    description: "了解問題，說明處理方法和收費，確認後才動工。",
  },
  {
    icon: Droplets,
    title: "疏通及測試去水",
    description: "按現場條件疏通，完成後測試相關去水位置。",
  },
] as const;

export default function Home() {
  return (
    <div className="home-page">
      <CmsPageSEO
        cmsEnabled={false}
        title={HOME_TITLE}
        description={HOME_DESCRIPTION}
        path="/"
        image="/images/drainbear-home-social.jpg"
        imageAlt={BRAND_SOCIAL_ALT}
        jsonLd={HOME_FAQ_JSONLD}
      />
      <section
        className="home-hero"
        aria-labelledby="home-heading"
        data-pr20-section="hero"
      >
        <div className="home-hero__stage">
          <div className="container home-hero__grid">
            <div className="home-hero__copy">
              <h1 id="home-heading">
                <span className="home-hero__headline-line">香港通渠，</span>
                <span className="home-hero__headline-line">
                  先搵
                  <wbr className="home-hero__mobile-break" />
                  通渠熊。
                </span>
              </h1>
              <p className="home-hero__coverage">住宅 · 食肆 · 物業渠務</p>
              <p className="home-hero__price">
                <span className="home-hero__price-context">
                  {STARTING_PRICE_LINE.replace(STARTING_PRICE_LABEL, "")}
                </span>
                <strong>{STARTING_PRICE_LABEL}</strong>
              </p>
              <ContactActions
                location="home_hero"
                prominent
                whatsappFirst
                compactOnMobile
              />
            </div>
          </div>
          <HomeHeroScene />
        </div>
      </section>
      <HomeServiceFinder />
      <HomeServiceRows />
      <RecordedCaseGallery />
      <HomeDrainMethods />
      <section
        className="brand-section brand-section--soft home-arrangement"
        aria-labelledby="home-process-heading"
      >
        <div className="container home-arrangement__grid">
          <div className="home-arrangement__intro">
            <div>
              <h2 id="home-process-heading">
                專業通渠，
                <br />
                先檢查再處理。
              </h2>
            </div>
            <Link href="/service-process">
              了解通渠流程
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ol className="home-arrangement__steps">
            {PROCESS.map((step, index) => (
              <li key={step.title}>
                <div className="home-arrangement__step-copy">
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
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <HomeCompanyGuides />
      <DrainHomeFaq />
      <nav className="container home-resource-links" aria-label="延伸渠務資料">
        <Link href="/areas">
          查看服務地區 <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/about">
          關於通渠熊 <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/guide">
          通渠查詢資料
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/answers">
          通渠問題解答
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/blog">
          通渠小知識
          <ArrowRight aria-hidden="true" />
        </Link>
      </nav>
    </div>
  );
}
