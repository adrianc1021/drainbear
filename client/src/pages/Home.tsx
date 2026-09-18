import { ArrowRight, Check, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import CmsPageSEO from "@/components/CmsPageSEO";
import DrainDiagnosisStory from "@/components/DrainDiagnosisStory";
import DrainHomeFaq from "@/components/DrainHomeFaq";
import DrainMethodComparison from "@/components/DrainMethodComparison";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import ServiceQuickSelect from "@/components/ServiceQuickSelect";
import DrainHeroScenes from "@/components/DrainHeroScenes";
import {
  EditorialCapability,
  EditorialPromise,
} from "@/components/editorial/HomeEditorialCore";
import { EditorialKicker } from "@/components/editorial/EditorialPrimitives";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import { useLatestBlogPosts } from "@/lib/useBlog";
import { formatCaseDate, formatMinutes } from "@/lib/caseRepository";
import { useFeaturedCaseStudies } from "@/lib/useCases";
import { createImageSrcSet, optimizedImageUrl } from "@/lib/imageOptimization";

const HERO_IMAGE = "/images/home-drain-technician-wide.jpg";

const CAPABILITY_IMAGE = "/images/home-cctv-inspection.jpg";

const FIELD_IMAGE = "/images/home-drain-technician.jpg";

const COMMON_SCENARIOS = [
  {
    number: "01",
    area: "觀塘",
    type: "商業工程",
    title: "工廈食堂排水位反覆淤塞",
    description:
      "商業廚房常見油脂附著於管壁。處理前要先了解隔油設施、受影響管段及營業時段，再決定是否需要高壓清洗。",
    arrival: "按位置確認",
    duration: "視管段而定",
  },
  {
    number: "02",
    area: "沙田",
    type: "村屋工程",
    title: "村屋沙井雨後滿溢",
    description:
      "應先停止大量排水並隔離受污染範圍，再按沙井水位、車輛通道及是否懷疑樹根入侵，安排抽吸、清洗或 CCTV 檢查。",
    arrival: "按交通確認",
    duration: "視設備而定",
  },
  {
    number: "03",
    area: "旺角",
    type: "住宅工程",
    title: "唐樓座廁及共用主渠異常",
    description:
      "若只有一個座廁受影響，可能是潔具或單位支管；若多戶同時倒灌，應通知管理處並檢查大廈共用主渠。",
    arrival: "先確認範圍",
    duration: "視渠位而定",
  },
] as const;

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
      "團隊先判斷問題類型，再確認可安排的時間、師傅及可能需要的設備。",
  },
  {
    number: "03",
    title: "到場檢查及報價",
    description: "師傅根據實際管道狀況說明處理方法，確認最終收費後才動工。",
  },
  {
    number: "04",
    title: "施工、測試、整理",
    description: "完成疏通後測試去水情況，並整理受工程影響的工作位置。",
  },
] as const;

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: `${SITE_URL}/`,
  name: "香港 24 小時通渠服務｜通渠熊 DrainBear",
  description:
    "香港住宅及商業通渠服務總覽，涵蓋座廁、鋅盤、企缸、主渠沙井、污水倒灌、高壓水槍及 CCTV 照喉。",
  inLanguage: "zh-Hant-HK",
  isPartOf: {
    "@id": WEBSITE_ID,
  },
  about: {
    "@id": BUSINESS_ID,
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}${HERO_IMAGE}`,
  },
};

function EditorialCases() {
  const { studies, isLoading, error } = useFeaturedCaseStudies(3);
  const hasVerifiedStudies = studies.length > 0;
  const records = hasVerifiedStudies
    ? studies.map((study, index) => ({
        number: String(index + 1).padStart(2, "0"),
        area: study.district,
        type: study.serviceLabel,
        title: study.title,
        description: study.summary,
        arrival: formatMinutes(study.arrivalMinutes) || "未有紀錄",
        duration: formatMinutes(study.durationMinutes) || "未有紀錄",
        slug: study.slug,
        date: formatCaseDate(study.projectDate),
        image: study.coverImage,
        imageSrc: undefined,
      }))
    : COMMON_SCENARIOS.map(study => ({
        ...study,
        slug: undefined,
        date: undefined,
        image: undefined,
        imageSrc:
          study.number === "01"
            ? FIELD_IMAGE
            : study.number === "02"
              ? CAPABILITY_IMAGE
              : HERO_IMAGE,
      }));

  return (
    <section
      aria-labelledby="home-cases-heading"
      className="bg-[var(--db-paper)]"
      data-pr20-section="cases"
      data-cms-loading={isLoading}
      data-cms-error={Boolean(error)}
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="home-section-head grid gap-8 border-b border-[var(--db-rule)] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <EditorialKicker>
              {hasVerifiedStudies ? "工程紀錄" : "常見情況"}
            </EditorialKicker>
            <h2 id="home-cases-heading" className="db-editorial-heading mt-6">
              {hasVerifiedStudies
                ? "看看同類問題怎樣處理。"
                : "先了解問題影響的範圍。"}
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-[var(--db-copy)] lg:justify-self-end">
            {hasVerifiedStudies
              ? "以下資料來自已公開的真實工程紀錄。不同樓宇、管道結構及淤塞程度會影響處理方法，紀錄不構成其他個案的時間或結果保證。"
              : "以下是常見情況的判斷示例，並非指定客戶工程。真實案例只會在資料、日期及相片完成核對後公開。"}
          </p>
        </div>

        <div className="home-evidence-list">
          {records.map(study => (
            <article
              key={study.number}
              className={`home-evidence${study.image?.url || study.imageSrc ? " home-evidence--with-image" : ""}`}
            >
              {study.image?.url || study.imageSrc ? (
                <img
                  className="home-evidence__image"
                  src={
                    study.image?.url
                      ? optimizedImageUrl(study.image.url, 800)
                      : study.imageSrc
                  }
                  srcSet={
                    study.image?.url
                      ? createImageSrcSet(study.image.url, [360, 640, 800])
                      : undefined
                  }
                  sizes="(min-width: 900px) 35vw, 100vw"
                  alt={study.image?.alt || `${study.title}服務示意圖片`}
                  width={study.image?.width || 1200}
                  height={study.image?.height || 800}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--db-safety)]">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {study.area} / {study.type}
                </div>

                <h3 className="mt-4 text-2xl font-black tracking-[-0.035em] text-[var(--db-ink)] md:text-3xl">
                  {study.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--db-copy)] md:text-base">
                  {study.description}
                </p>

                {study.slug ? (
                  <Link
                    href={`/cases/${study.slug}`}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 font-black text-[var(--db-ink)] hover:text-[var(--db-safety)]"
                  >
                    查看完整紀錄 <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}

                <dl className="mt-6 grid grid-cols-2 border-y border-[var(--db-rule)] py-4">
                  <div>
                    <dt className="text-xs font-semibold text-[var(--db-copy)]">
                      {study.date ? "工程日期" : "上門安排"}
                    </dt>
                    <dd className="mt-1 font-black text-[var(--db-ink)]">
                      {study.date || study.arrival}
                    </dd>
                  </div>

                  <div className="border-l border-[var(--db-rule)] pl-5">
                    <dt className="text-xs font-semibold text-[var(--db-copy)]">
                      工程時間
                    </dt>
                    <dd className="mt-1 font-black text-[var(--db-ink)]">
                      {study.duration}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm leading-6 text-[var(--db-copy)]">
            {isLoading
              ? "正在同步已公開工程紀錄…"
              : "只有已完成資料核對的案例才會公開。"}
          </p>
          <Link
            href="/cases"
            className="inline-flex min-h-11 items-center gap-2 font-black text-[var(--db-ink)] hover:text-[var(--db-safety)]"
          >
            查看工程案例 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EditorialProcess() {
  return (
    <section
      aria-labelledby="home-process-heading"
      className="bg-[var(--db-ink)] text-white"
      data-pr20-section="process"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="home-section-head home-section-head--dark grid gap-8 border-b border-white/20 pb-10 lg:grid-cols-2 lg:items-end">
          <div>
            <EditorialKicker tone="light">處理流程</EditorialKicker>
            <h2
              id="home-process-heading"
              className="db-editorial-heading mt-6 text-white"
            >
              由查詢到完工，清楚跟進。
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-white/65 lg:justify-self-end">
            團隊會先了解現場情況，再安排合適人員到場。每個步驟均以充分資料及雙方確認為基礎。
          </p>
        </div>

        <ol className="home-process-grid grid border-b border-white/20 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS.map((step, index) => (
            <li
              key={step.number}
              className="border-t border-white/20 py-8 md:min-h-72 md:px-6 md:first:pl-0 xl:border-l xl:first:border-l-0"
            >
              <span className="text-xs font-black tracking-[0.16em] text-[var(--db-safety)]">
                {step.number}
              </span>

              <h3 className="mt-12 text-2xl font-black tracking-[-0.035em]">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/75">
                {step.description}
              </p>

              {index < PROCESS.length - 1 ? (
                <ArrowRight
                  className="mt-8 h-5 w-5 text-white/40"
                  aria-hidden="true"
                />
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
                  sizes="(min-width: 768px) calc((min(100vw, 84rem) - clamp(2.5rem, 8vw, 7rem) - 4rem) / 3), calc(100vw - clamp(2.5rem, 8vw, 7rem))"
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
                <span className="block text-xl font-black tracking-[-0.03em] md:text-2xl">
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
      className="bg-[var(--db-safety)] text-[var(--db-ink-deep)]"
      data-pr20-section="final-cta"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <EditorialKicker>24 小時服務查詢</EditorialKicker>

        <div className="home-final-grid mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h2 id="home-final-cta-heading" className="db-final-cta-heading">
              緊急通渠？
              <br />
              立即聯絡。
            </h2>

            <p className="mt-8 max-w-2xl text-base font-bold leading-8 text-[var(--db-ink-deep)]/75 md:text-lg">
              提供所在地區、受影響位置及現場相片或短片，
              團隊會先作初步評估，再確認可安排的服務時間及後續處理方案。
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
              className="inline-flex min-h-16 items-center justify-center gap-3 bg-[var(--db-ink)] px-7 text-base font-black text-white transition-transform hover:-translate-y-1"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp 查詢報價
            </a>

            <a
              href={phoneHref}
              onClick={() => trackCTA("phone", "home_footer_cta")}
              className="inline-flex min-h-14 items-center justify-center gap-3 border-2 border-[var(--db-ink)] px-7 text-base font-black"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {phoneDisplay}
            </a>
          </div>
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

function FieldEvidenceShowcase() {
  return (
    <section
      className="home-field-showcase"
      aria-labelledby="home-field-showcase-heading"
      data-pr20-section="field-evidence"
    >
      <div className="db-container home-field-showcase__grid">
        <figure className="home-field-showcase__media">
          <img
            src={FIELD_IMAGE}
            alt="師傅檢查浴室排水管道的服務示意圖"
            width="960"
            height="1280"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <span>現場資料</span>
            <span>服務示意圖</span>
          </figcaption>
        </figure>

        <div className="home-field-showcase__copy">
          <EditorialKicker>現場資料</EditorialKicker>
          <h2 id="home-field-showcase-heading">
            資料越清楚，
            <br />
            現場安排越準確。
          </h2>
          <p>
            提供所在地區、排水位置、異常時間，以及相片或短片，團隊即可先了解受影響範圍，安排合適的跟進方式。
          </p>
          <ul>
            <li>
              <Check aria-hidden="true" /> 確認受影響的排水位
            </li>
            <li>
              <Check aria-hidden="true" /> 說明住宅或商業用途
            </li>
            <li>
              <Check aria-hidden="true" /> 補充是否出現倒灌或異味
            </li>
          </ul>
          <Link
            href="/drain-diagnosis"
            onClick={() =>
              trackNavClick("navigation", {
                cta_location: "home_field_evidence",
                cta_label: "開始問題判斷",
                destination_url: "/drain-diagnosis",
              })
            }
            className="db-diagnosis-cta"
          >
            開始問題判斷 <ArrowRight className="db-arrow-link__icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EditorialQuoteForm() {
  return (
    <section
      className="border-b border-[var(--db-rule)] bg-white"
      aria-labelledby="home-quote-section-heading"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="mb-8 max-w-2xl">
          <EditorialKicker>不只限於 WhatsApp</EditorialKicker>
          <h2
            id="home-quote-section-heading"
            className="db-editorial-heading mt-6"
          >
            想先留下資料，再由團隊跟進？
          </h2>
        </div>
        <QuoteRequestForm
          location="home_quote_form"
          title="先留下資料，團隊再回覆您"
          description="適合想先整理資料、比較方案，或需要同事／管理處跟進的查詢。"
        />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="home-editorial">
      <CmsPageSEO
        cmsEnabled={false}
        title="香港通渠服務｜先報價後動工・24 小時查詢｜通渠熊 DrainBear"
        description="通渠熊 DrainBear 提供香港住宅及商業通渠服務，處理座廁、鋅盤、企缸、主渠及污水倒灌等問題。可透過 WhatsApp 提供位置及相片，了解初步處理方向，現場確認收費後才動工。"
        path="/"
        keywords="香港通渠, 24小時通渠, 塞廁所, 企缸塞, 浴室去水慢, 廚房鋅盤塞, 污水渠倒灌, 高壓水槍洗渠, CCTV照喉, 通渠收費"
        jsonLd={HOME_JSONLD}
      />

      <DrainHeroScenes imageSrc={HERO_IMAGE} />
      <FieldEvidenceShowcase />
      <ServiceQuickSelect />
      <DrainDiagnosisStory />
      <EditorialPromise />
      <EditorialCases />
      <DrainMethodComparison />
      <EditorialPhotoQuoteCTA />
      <EditorialQuoteForm />
      <EditorialCapability imageSrc={CAPABILITY_IMAGE} />
      <EditorialProcess />
      <EditorialJournal />
      <DrainHomeFaq />
      <EditorialFinalCTA />
    </div>
  );
}
