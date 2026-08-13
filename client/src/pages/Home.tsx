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
  BUSINESS_NAME,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
} from "@/config/site";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import { useBlogPosts } from "@/lib/useBlog";

const HERO_IMAGE =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_960/v1785149281/copy_of_a_portrait_of_a_young_handsome_asian_male_plumbin-1785149206310_mmq04g.png";

const CAPABILITY_IMAGE =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_960/v1785149473/why_sv7tw9.png";

const CASE_STUDIES = [
  {
    number: "01",
    area: "觀塘",
    type: "商業工程",
    title: "工廈食堂去水位嚴重淤塞",
    description:
      "活化工廈內食堂鋅盤及地台去水完全停滯，高壓水槍沖洗約 15 米排水管，清除管壁積聚油脂，再即場放水測試。",
    arrival: "42 分鐘",
    duration: "約 1.5 小時",
  },
  {
    number: "02",
    area: "沙田",
    type: "村屋工程",
    title: "村屋沙井雨後滿瀉",
    description:
      "大圍村屋沙井雨後倒灌後院，到場抽走積水後以 CCTV 檢查，發現樹根進入管道，再按現場情況處理及測試排水。",
    arrival: "55 分鐘",
    duration: "約 2 小時",
  },
  {
    number: "03",
    area: "旺角",
    type: "住宅工程",
    title: "唐樓座廁深夜淤塞",
    description:
      "深夜接獲座廁淤塞倒灌查詢，師傅到場檢查後，以合適通渠工具疏通；動工前確認收費，完成後清理工作位置。",
    arrival: "31 分鐘",
    duration: "約 45 分鐘",
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
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  alternateName: [BUSINESS_NAME, "DrainBear", "drainbearhk.com"],
  inLanguage: "zh-Hant-HK",
  publisher: {
    "@id": BUSINESS_ID,
  },
};

function EditorialCases() {
  return (
    <section
      aria-labelledby="home-cases-heading"
      className="bg-[var(--db-paper)]"
      data-pr20-section="cases"
    >
      <div className="db-container py-[var(--db-editorial-section)]">
        <div className="grid gap-8 border-b border-[var(--db-rule)] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <EditorialKicker>Field notes / 工程紀錄</EditorialKicker>
            <h2 id="home-cases-heading" className="db-editorial-heading mt-6">
              現場問題，
              <br />
              逐步處理。
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-[var(--db-copy)] lg:justify-self-end">
            以下為實際工程紀錄摘要。不同樓宇、管道結構及淤塞程度會影響處理方法，
            到場時間與施工時間不構成服務保證。
          </p>
        </div>

        <div className="border-b border-[var(--db-rule)]">
          {CASE_STUDIES.map(study => (
            <article
              key={study.number}
              className="grid gap-6 border-t border-[var(--db-rule)] py-9 md:grid-cols-[4rem_0.7fr_1.3fr] md:py-12"
            >
              <EditorialIndex>{study.number}</EditorialIndex>

              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--db-safety)]">
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

                <dl className="mt-6 grid grid-cols-2 border-y border-[var(--db-rule)] py-4">
                  <div>
                    <dt className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-[var(--db-copy-light)]">
                      Arrival record
                    </dt>
                    <dd className="mt-1 font-black text-[var(--db-ink)]">
                      {study.arrival}
                    </dd>
                  </div>

                  <div className="border-l border-[var(--db-rule)] pl-5">
                    <dt className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-[var(--db-copy-light)]">
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
        <div className="grid gap-8 border-b border-white/20 pb-10 lg:grid-cols-2 lg:items-end">
          <div>
            <EditorialKicker tone="light">
              How it works / 處理流程
            </EditorialKicker>
            <h2
              id="home-process-heading"
              className="mt-6 text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[0.92] tracking-[-0.06em]"
            >
              四步，
              <br />
              唔兜圈。
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-white/65 lg:justify-self-end">
            先講清楚現場，再安排到場。服務流程保持簡單，
            但每一步都要有足夠資料及雙方確認。
          </p>
        </div>

        <ol className="grid border-b border-white/20 md:grid-cols-2 xl:grid-cols-4">
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

              <p className="mt-4 text-sm leading-7 text-white/60">
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
  const { posts } = useBlogPosts();
  const selectedPosts = posts.slice(0, 3);

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
              渠務知識，
              <br />
              留低慢慢睇。
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

        <div className="border-b border-[var(--db-rule)]">
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
              className="group grid gap-5 border-t border-[var(--db-rule)] py-8 text-[var(--db-ink)] transition-colors hover:bg-[var(--db-paper)] sm:grid-cols-[4rem_0.7fr_1.3fr_auto] sm:items-center sm:px-5 md:min-h-36"
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
        <EditorialKicker>Emergency line / 24H inquiry</EditorialKicker>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h2
              id="home-final-cta-heading"
              className="text-[clamp(3.2rem,9vw,8.5rem)] font-black leading-[0.84] tracking-[-0.07em]"
            >
              渠道告急？
              <br />
              直接講情況。
            </h2>

            <p className="mt-8 max-w-2xl text-base font-bold leading-8 text-[var(--db-ink-deep)]/75 md:text-lg">
              提供地點、問題位置及現場相片或影片，
              團隊會先了解情況，再確認可以安排的時間及下一步。
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

export default function Home() {
  return (
    <div className="home-editorial">
      <CmsPageSEO
        title="通渠熊 DrainBear｜24小時通渠公司・全港特快上門・收費條款事前說明"
        description="香港通渠救星！通渠熊專營24小時緊急通渠服務。配備德國高壓水槍洗渠及CCTV照喉技術，專治塞廁所、廚房星盆去水慢、企缸淤塞、食肆隔油池及大廈沙井。全港九新界特快上門，報價後動工，收費條款事前說明。"
        path="/"
        keywords="香港通渠, 24小時通渠, 通渠公司推薦, 塞廁所, 廚房通渠, 高壓水槍洗渠, CCTV照喉, 隔油池清理, 收費條款事前說明, 通渠收費"
        jsonLd={HOME_JSONLD}
      />

      <EditorialHero imageSrc={HERO_IMAGE} />
      <ServiceQuickSelect />
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
