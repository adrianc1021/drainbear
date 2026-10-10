import CmsPageSEO from "@/components/CmsPageSEO";
import ContactActions from "@/components/ContactActions";
import DrainHomeFaq, { FAQ_ITEMS } from "@/components/DrainHomeFaq";
import HomeServiceFinder from "@/components/HomeServiceFinder";
import RecordedCaseGallery from "@/components/RecordedCaseGallery";
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

const HOME_TITLE = "香港專業通渠｜24小時通渠查詢｜通渠熊 DrainBear";
const HOME_DESCRIPTION =
  "通渠熊提供香港住宅、食肆及物業通渠服務，處理坐廁塞住、鋅盤去水慢、浴室淤塞及主渠倒灌。電話及 WhatsApp 24 小時接受通渠查詢；上門時間按地區、人手及設備確認。";

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
    imageAlt: "AI 流程插圖：白熊透過手機提供位置及現場相片",
  },
  {
    icon: CalendarClock,
    title: "確認上門安排",
    imageAlt: "AI 流程插圖：白熊師傅攜帶工具箱上門",
  },
  {
    icon: ClipboardCheck,
    title: "現場檢查及確認",
    imageAlt: "AI 流程插圖：白熊戴手套檢查喉口並記錄情況",
  },
  {
    icon: Droplets,
    title: "疏通及測試去水",
    imageAlt: "AI 流程插圖：白熊操作通渠工具並測試去水",
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
              <p className="brand-eyebrow">香港專業通渠 · 住宅／食肆／物業</p>
              <h1 id="home-heading">
                <span className="home-hero__headline-line">香港通渠，</span>
                <span className="home-hero__headline-line">先搵通渠熊。</span>
              </h1>
              <p className="home-hero__intro">
                坐廁、鋅盤、浴室塞渠？傳相片同地區，先了解點處理。
              </p>
              <ContactActions location="home_hero" prominent />
              <p className="contact-note">24 小時查詢 · 上門時間另行確認。</p>
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
                <span
                  className={`home-arrangement__illustration home-arrangement__illustration--${index}`}
                  role="img"
                  aria-label={step.imageAlt}
                >
                  <img
                    src="/images/drainbear-process-ai.webp"
                    alt=""
                    aria-hidden="true"
                    width="1024"
                    height="1024"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
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
                  </div>
                </div>
              </li>
            ))}
          </ol>
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
          通渠查詢資料
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
