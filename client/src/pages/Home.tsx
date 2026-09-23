import {
  ArrowRight,
  Check,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";
import CmsPageSEO from "@/components/CmsPageSEO";
import DrainHomeFaq, { FAQ_ITEMS } from "@/components/DrainHomeFaq";
import { EditorialPromise } from "@/components/editorial/HomeEditorialCore";
import { EditorialKicker } from "@/components/editorial/EditorialPrimitives";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import { createImageSrcSet, optimizedImageUrl } from "@/lib/imageOptimization";
import { useLatestBlogPosts } from "@/lib/useBlog";

const HERO_IMAGE = "/images/home-drain-technician-wide.jpg";

const PROCESS = [
  {
    number: "01",
    title: "傳送現場資料",
    description: "透過 WhatsApp 提供所在地區、淤塞位置及現場相片或短片。",
  },
  {
    number: "02",
    title: "初步了解情況",
    description:
      "團隊先了解問題類型，再確認可安排的時間、人員及可能需要的設備。",
  },
  {
    number: "03",
    title: "到場檢查及報價",
    description: "師傅按實際管道狀況說明處理方法，雙方確認最終收費後才動工。",
  },
  {
    number: "04",
    title: "施工、測試及整理",
    description: "完成已確認工序後測試去水情況，並整理受工程影響的位置。",
  },
] as const;

const COMMON_PROBLEMS = [
  {
    href: "/services/toilet-unblocking",
    label: "塞廁所／坐廁倒灌",
    detail: "先了解堵塞位置及處理方法",
  },
  {
    href: "/services/kitchen-sink-unblocking",
    label: "鋅盤去水慢",
    detail: "常見油垢及食物殘渣問題",
  },
  {
    href: "/services/bathroom-drain-unblocking",
    label: "浴室地台去水慢",
    detail: "毛髮、番梘垢及隔氣問題",
  },
  {
    href: "/services/sewage-backflow",
    label: "污水倒灌",
    detail: "先處理受影響位置，再確認安排",
  },
] as const;

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: `${SITE_URL}/`,
  name: "香港 24 小時通渠服務｜通渠熊 DrainBear",
  description:
    "香港住宅及商業通渠服務，可透過 WhatsApp 提供現場相片或短片作初步評估，現場確認收費後才動工。",
  inLanguage: "zh-Hant-HK",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": BUSINESS_ID },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}${HERO_IMAGE}`,
  },
};

const HOME_FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#home-faq`,
  mainEntity: FAQ_ITEMS.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function CompactHero() {
  const { phoneDisplay, phoneHref, whatsappDefaultHref } = useContactSettings();

  return (
    <section
      className="home-compact-hero"
      aria-labelledby="home-editorial-heading"
      data-pr20-section="hero"
    >
      <img
        className="home-compact-hero__image"
        src={HERO_IMAGE}
        alt=""
        width="1600"
        height="1000"
        fetchPriority="high"
        decoding="async"
        aria-hidden="true"
      />
      <div className="home-compact-hero__wash" aria-hidden="true" />

      <div className="db-container home-compact-hero__content">
        <p className="home-compact-hero__eyebrow">
          香港住宅及商業渠務・24 小時接受查詢
        </p>
        <h1 id="home-editorial-heading">
          香港通渠，
          <br />
          先報價後動工。
        </h1>
        <p className="home-compact-hero__intro">
          座廁、鋅盤、企缸、主渠或污水倒灌問題，可先提供所在地區及現場相片，讓團隊了解情況及安排上門。
        </p>

        <div className="home-compact-hero__actions">
          <a
            href={whatsappDefaultHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackCTA("whatsapp", "home_hero");
              goThanksAfterWhatsApp("home_hero");
            }}
            className="home-compact-hero__primary"
          >
            <MessageCircle aria-hidden="true" />
            <span>WhatsApp 傳送相片查詢</span>
          </a>
          <a
            href={phoneHref}
            onClick={() => trackCTA("phone", "home_hero")}
            className="home-compact-hero__secondary"
          >
            <Phone aria-hidden="true" />
            <span>{phoneDisplay}</span>
          </a>
        </div>

        <ul className="home-compact-hero__proofs" aria-label="服務原則">
          <li>
            <Check aria-hidden="true" /> 動工前確認收費
          </li>
          <li>
            <ShieldCheck aria-hidden="true" /> 新增工序事前說明
          </li>
          <li>
            <Check aria-hidden="true" /> 完工後測試去水
          </li>
        </ul>
      </div>
    </section>
  );
}

function CommonProblemsNav() {
  return (
    <section
      className="home-common-problems"
      aria-labelledby="home-common-problems-heading"
      data-pr20-section="common-problems"
    >
      <div className="db-container home-common-problems__inner">
        <div className="home-common-problems__heading">
          <EditorialKicker>快速找到相關服務</EditorialKicker>
          <h2 id="home-common-problems-heading">
            你遇到邊種渠務問題？
          </h2>
          <p>
            可以直接查看處理方法，亦可以跳過閱讀，立即 WhatsApp 傳送現場相片。
          </p>
        </div>
        <div className="home-common-problems__grid">
          {COMMON_PROBLEMS.map(problem => (
            <Link
              key={problem.href}
              href={problem.href}
              className="home-common-problem"
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "home_common_problems",
                  cta_label: problem.label,
                  destination_url: problem.href,
                })
              }
            >
              <span className="home-common-problem__label">
                {problem.label}
                <ArrowRight aria-hidden="true" />
              </span>
              <span className="home-common-problem__detail">
                {problem.detail}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialPhotoQuoteCTA() {
  const { whatsappDefaultHref } = useContactSettings();

  return (
    <section
      className="home-photo-quote"
      aria-labelledby="home-photo-quote-heading"
      data-pr20-section="photo-quote"
    >
      <div className="db-container home-photo-quote__inner">
        <div>
          <p className="home-photo-quote__eyebrow">WhatsApp 相片初步評估</p>
          <h2 id="home-photo-quote-heading">
            尚未確定淤塞原因？可先提供現場相片或短片。
          </h2>
        </div>
        <a
          href={whatsappDefaultHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackCTA("whatsapp", "home_photo_quote");
            goThanksAfterWhatsApp("home_photo_quote");
          }}
        >
          <MessageCircle aria-hidden="true" />
          傳送相片查詢
        </a>
      </div>
    </section>
  );
}

function EditorialProcess() {
  return (
    <section
      aria-labelledby="home-process-heading"
      className="home-compact-process"
      data-pr20-section="process"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="home-section-head grid gap-8 border-b border-[var(--db-rule)] pb-10 lg:grid-cols-2 lg:items-end">
          <div>
            <EditorialKicker>處理流程</EditorialKicker>
            <h2 id="home-process-heading" className="db-editorial-heading mt-6">
              由查詢到完工，清楚跟進。
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-[var(--db-copy)] lg:justify-self-end">
            先了解現場情況，再安排合適人員到場。每個步驟均以充分資料及雙方確認為基礎。
          </p>
        </div>

        <ol className="home-process-grid grid border-b border-[var(--db-rule)] md:grid-cols-2 xl:grid-cols-4">
          {PROCESS.map((step, index) => (
            <li
              key={step.number}
              className="border-t border-[var(--db-rule)] py-8 md:px-6 md:first:pl-0 xl:border-l xl:first:border-l-0"
            >
              <span className="text-xs font-black tracking-[0.16em] text-[var(--db-safety)]">
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--db-copy)]">
                {step.description}
              </p>
              {index < PROCESS.length - 1 ? (
                <ArrowRight aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EditorialJournal() {
  const { posts: selectedPosts, isLoading, error } = useLatestBlogPosts(3);

  return (
    <section
      aria-labelledby="home-journal-heading"
      className="bg-white"
      data-pr20-section="journal"
      data-cms-loading={isLoading}
      data-cms-error={Boolean(error)}
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="flex flex-col gap-7 border-b border-[var(--db-rule)] pb-9 md:flex-row md:items-end md:justify-between">
          <div>
            <EditorialKicker>最新實用文章</EditorialKicker>
            <h2 id="home-journal-heading" className="db-editorial-heading mt-6">
              有些問題，可以先知道。
            </h2>
          </div>
          <Link
            href="/blog"
            onClick={() =>
              trackNavClick("navigation", {
                cta_location: "home_journal",
                cta_label: "查看全部文章",
                destination_url: "/blog",
              })
            }
            className="db-arrow-link"
          >
            查看全部文章
            <ArrowRight className="db-arrow-link__icon" aria-hidden="true" />
          </Link>
        </div>

        <div className="home-reading-grid">
          {selectedPosts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={() =>
                trackNavClick("blog_post", {
                  cta_location: "home_journal",
                  cta_label: post.title,
                  article_slug: post.slug,
                  destination_url: `/blog/${post.slug}`,
                })
              }
              className="home-reading"
            >
              {post.coverImage?.url ? (
                <img
                  src={optimizedImageUrl(post.coverImage.url, 640)}
                  srcSet={createImageSrcSet(
                    post.coverImage.url,
                    [320, 480, 640, 960, 1280]
                  )}
                  sizes="(min-width: 768px) 30vw, calc(100vw - 2.5rem)"
                  alt={post.coverImage.alt || post.title}
                  width={post.coverImage.width || 1200}
                  height={post.coverImage.height || 800}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <span className="home-reading__meta">
                {post.category}・{post.readMins} 分鐘閱讀
              </span>
              <span>
                <span className="block text-xl font-black md:text-2xl">
                  {post.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[var(--db-copy)]">
                  {post.excerpt}
                </span>
              </span>
              <span className="home-reading__link">
                閱讀文章
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialFinalCTA() {
  const { phoneDisplay, phoneHref, whatsappDefaultHref } = useContactSettings();

  return (
    <section
      aria-labelledby="home-final-cta-heading"
      data-pr20-section="final-cta"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <EditorialKicker>24 小時服務查詢</EditorialKicker>
        <div className="home-final-grid mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h2 id="home-final-cta-heading" className="db-final-cta-heading">
              有渠務問題？
              <br />
              現在提供現場資料。
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[var(--db-copy)] md:text-lg">
              提供所在地區、受影響位置及現場相片或短片，團隊會先作初步評估，再確認可安排的服務時間。
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:pb-2">
            <a
              href={whatsappDefaultHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackCTA("whatsapp", "home_footer_cta");
                goThanksAfterWhatsApp("home_footer_cta");
              }}
              className="inline-flex min-h-16 items-center justify-center gap-3 px-7 text-base font-black"
            >
              <MessageCircle aria-hidden="true" />
              WhatsApp 查詢報價
            </a>
            <a
              href={phoneHref}
              onClick={() => trackCTA("phone", "home_footer_cta")}
              className="inline-flex min-h-14 items-center justify-center gap-3 border border-[var(--db-ink)] px-7 text-base font-black"
            >
              <Phone aria-hidden="true" />
              {phoneDisplay}
            </a>
          </div>
        </div>
        <nav
          className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--db-rule)] pt-5 text-sm"
          aria-label="首頁延伸入口"
        >
          <span className="font-bold text-[var(--db-copy)]">快速查看</span>
          <Link
            href="/services"
            onClick={() =>
              trackNavClick("service", {
                cta_location: "home_footer_cta",
                cta_label: "服務範圍",
                destination_url: "/services",
              })
            }
            className="underline decoration-[var(--db-safety)] underline-offset-4"
          >
            服務範圍
          </Link>
          <Link
            href="/areas"
            onClick={() =>
              trackNavClick("area", {
                cta_location: "home_footer_cta",
                cta_label: "服務地區",
                destination_url: "/areas",
              })
            }
            className="underline decoration-[var(--db-safety)] underline-offset-4"
          >
            服務地區
          </Link>
          <Link
            href="/guide"
            onClick={() =>
              trackNavClick("pricing", {
                cta_location: "home_footer_cta",
                cta_label: "收費原則",
                destination_url: "/guide",
              })
            }
            className="underline decoration-[var(--db-safety)] underline-offset-4"
          >
            收費原則
          </Link>
        </nav>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="home-editorial home-editorial--compact">
      <CmsPageSEO
        cmsEnabled={false}
        title="香港通渠服務｜先報價後動工・24 小時查詢｜通渠熊 DrainBear"
        description="通渠熊提供香港住宅及商業通渠服務。可透過 WhatsApp 提供所在地區及現場相片或短片作初步評估，現場確認收費後才動工。"
        path="/"
        keywords="香港通渠, 24小時通渠, 塞廁所, 企缸塞, 浴室去水慢, 廚房鋅盤塞, 污水渠倒灌, 通渠收費"
        jsonLd={[HOME_JSONLD, HOME_FAQ_JSONLD]}
      />

      <CompactHero />
      <CommonProblemsNav />
      <EditorialPromise />
      <EditorialPhotoQuoteCTA />
      <EditorialProcess />
      <EditorialJournal />
      <DrainHomeFaq />
      <EditorialFinalCTA />
    </div>
  );
}
