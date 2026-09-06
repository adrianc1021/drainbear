import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import CmsPageSEO from "@/components/CmsPageSEO";
import ServiceQuickSelect from "@/components/ServiceQuickSelect";
import {
  EditorialCapability,
  EditorialHero,
  EditorialPromise,
  EditorialServices,
} from "@/components/editorial/HomeEditorialCore";
import {
  EditorialIndex,
  EditorialKicker,
} from "@/components/editorial/EditorialPrimitives";
import {
  BUSINESS_ID,
  SITE_URL,
  WEBSITE_ID,
} from "@/config/site";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import { useLatestBlogPosts } from "@/lib/useBlog";
import { formatCaseDate, formatMinutes } from "@/lib/caseRepository";
import { useFeaturedCaseStudies } from "@/lib/useCases";

const HERO_IMAGE = "/images/home-drain-technician-wide.jpg";

const CAPABILITY_IMAGE = "/images/home-cctv-inspection.jpg";

const COMMON_SCENARIOS = [
  {
    number: "01",
    area: "觀塘",
    type: "商業工程",
    title: "工廈食堂去水位反覆淤塞",
    description:
      "商業廚房常見油脂附於管壁。處理前要先了解隔油設施、受影響管段及營業時段，再決定是否需要高壓清洗。",
    arrival: "按位置確認",
    duration: "視管段而定",
  },
  {
    number: "02",
    area: "沙田",
    type: "村屋工程",
    title: "村屋沙井雨後滿溢",
    description:
      "應先停止大量排水並隔離污染範圍，再按沙井水位、車輛通道及是否懷疑樹根入侵，安排抽吸、清洗或 CCTV 檢查。",
    arrival: "按交通確認",
    duration: "視設備而定",
  },
  {
    number: "03",
    area: "旺角",
    type: "住宅工程",
    title: "唐樓座廁及共用渠異常",
    description:
      "若只有一個座廁受影響，可能是潔具或單位支渠；若多戶同時倒灌，應通知管理處並檢查大廈共用主渠。",
    arrival: "先確認範圍",
    duration: "視渠位而定",
  },
] as const;

const PROCESS = [
  {
    number: "01",
    title: "傳送現場資料",
    description: "透過 WhatsApp 提供地點、淤塞位置，以及現場相片或短片。",
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
  const { studies, isLoading } = useFeaturedCaseStudies(3);
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
      }))
    : COMMON_SCENARIOS.map(study => ({ ...study, slug: undefined, date: undefined }));

  return (
    <section
      aria-labelledby="home-cases-heading"
      className="bg-[var(--db-paper)]"
      data-pr20-section="cases"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="home-section-head grid gap-8 border-b border-[var(--db-rule)] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <EditorialKicker>{hasVerifiedStudies ? "Field notes / 工程紀錄" : "Decision guide / 常見場景"}</EditorialKicker>
            <h2 id="home-cases-heading" className="db-editorial-heading mt-6">
              {hasVerifiedStudies ? "已核實紀錄，" : "先判斷範圍，"}
              <br />
              再選處理方法。
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-[var(--db-copy)] lg:justify-self-end">
            {hasVerifiedStudies
              ? "以下資料來自已公開的真實工程紀錄。不同樓宇、管道結構及淤塞程度會影響處理方法，紀錄不構成其他個案的時間或結果保證。"
              : "以下是常見情況的判斷示例，並非指定客戶工程。真實案例只會在資料、日期及相片完成核對後公開。"}
          </p>
        </div>

        <div className="home-case-list border-b border-[var(--db-rule)]">
          {records.map(study => (
            <article
              key={study.number}
              className="home-case-row grid gap-6 border-t border-[var(--db-rule)] py-9 md:grid-cols-[4rem_0.7fr_1.3fr] md:py-12"
            >
              <EditorialIndex>{study.number}</EditorialIndex>

              <div>
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[var(--db-safety)]">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {study.area} / {study.type}
                </div>

                <h3 className="mt-4 text-2xl font-black tracking-[-0.035em] text-[var(--db-ink)] md:text-3xl">
                  {study.title}
                </h3>
              </div>

              <div>
                <p className="text-sm leading-7 text-[var(--db-copy)] md:text-base">
                  {study.description}
                </p>

                {study.slug ? (
                  <Link href={`/cases/${study.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 font-black text-[var(--db-ink)] hover:text-[var(--db-safety)]">
                    查看完整紀錄 <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}

                <dl className="mt-6 grid grid-cols-2 border-y border-[var(--db-rule)] py-4">
                  <div>
                    <dt className="text-xs font-black uppercase tracking-[0.1em] text-[var(--db-copy)]">
                      {study.date ? "Project date" : "Arrival"}
                    </dt>
                    <dd className="mt-1 font-black text-[var(--db-ink)]">
                      {study.date || study.arrival}
                    </dd>
                  </div>

                  <div className="border-l border-[var(--db-rule)] pl-5">
                    <dt className="text-xs font-black uppercase tracking-[0.1em] text-[var(--db-copy)]">
                      Work duration
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
            {isLoading ? "正在同步已公開工程紀錄…" : "只有已完成資料核對的案例才會公開。"}
          </p>
          <Link href="/cases" className="inline-flex min-h-11 items-center gap-2 font-black text-[var(--db-ink)] hover:text-[var(--db-safety)]">
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
            <EditorialKicker tone="light">
              How it works / 處理流程
            </EditorialKicker>
            <h2
              id="home-process-heading"
              className="db-editorial-heading mt-6 text-white"
            >
              四步流程，
              <br />
              清楚跟進。
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
  const { posts: selectedPosts } = useLatestBlogPosts(3);

  return (
    <section
      aria-labelledby="home-journal-heading"
      className="bg-white"
      data-pr20-section="journal"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="flex flex-col gap-7 border-b border-[var(--db-rule)] pb-9 md:flex-row md:items-end md:justify-between">
          <div>
            <EditorialKicker>Drain journal / 實用文章</EditorialKicker>
            <h2 id="home-journal-heading" className="db-editorial-heading mt-6">
              渠務資訊，
              <br />
              隨時查閱。
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

        <div className="home-journal-list border-b border-[var(--db-rule)]">
          {selectedPosts.map((post, index) => (
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
              className="home-journal-row group grid gap-5 border-t border-[var(--db-rule)] py-8 text-[var(--db-ink)] transition-colors hover:bg-[var(--db-paper)] sm:grid-cols-[4rem_0.7fr_1.3fr_auto] sm:items-center sm:px-5 md:min-h-36"
            >
              <EditorialIndex>
                {String(index + 1).padStart(2, "0")}
              </EditorialIndex>

              <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--db-safety)]">
                {post.category} / {post.readMins} min
              </span>

              <span>
                <span className="block text-xl font-black tracking-[-0.03em] md:text-2xl">
                  {post.title}
                </span>
                <span className="mt-2 line-clamp-2 block text-sm leading-6 text-[var(--db-copy)]">
                  {post.excerpt}
                </span>
              </span>

              <span className="flex h-11 w-11 items-center justify-center border border-[var(--db-rule-strong)] transition-all group-hover:border-[var(--db-ink)] group-hover:bg-[var(--db-ink)] group-hover:text-white">
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
        <EditorialKicker>Emergency service / 24小時服務查詢</EditorialKicker>

        <div className="home-final-grid mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h2 id="home-final-cta-heading" className="db-final-cta-heading">
              緊急通渠？
              <br />
              立即聯絡。
            </h2>

            <p className="mt-8 max-w-2xl text-base font-bold leading-8 text-[var(--db-ink-deep)]/75 md:text-lg">
              提供地點、問題位置及現場相片或影片，
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
            未確定淤塞原因？先傳送現場相片或短片。
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

export default function Home() {
  return (
    <div className="home-editorial">
      <CmsPageSEO
        cmsEnabled={false}
        title="香港24小時通渠服務｜塞廁所・企缸・鋅盤・污水倒灌｜通渠熊"
        description="通渠熊提供香港24小時通渠查詢，處理塞廁所、企缸及浴室去水、廚房鋅盤淤塞、污水倒灌、大廈主渠與沙井問題。先了解現場及確認收費，再安排合適設備處理。"
        path="/"
        keywords="香港通渠, 24小時通渠, 塞廁所, 企缸塞, 浴室去水慢, 廚房鋅盤塞, 污水渠倒灌, 高壓水槍洗渠, CCTV照喉, 通渠收費"
        jsonLd={HOME_JSONLD}
      />

      <EditorialHero imageSrc={HERO_IMAGE} />
      <ServiceQuickSelect />
      <EditorialPhotoQuoteCTA />
      <EditorialPromise />
      <EditorialCapability imageSrc={CAPABILITY_IMAGE} />
      <EditorialServices />
      <EditorialCases />
      <EditorialProcess />
      <EditorialJournal />
      <EditorialFinalCTA />
    </div>
  );
}
