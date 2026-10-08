import Breadcrumbs from "@/components/Breadcrumbs";
import CaseStudyCard from "@/components/CaseStudyCard";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import { WhatsAppButton } from "@/components/Layout";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { formatCaseDate } from "@/lib/caseRepository";
import { useCaseStudies } from "@/lib/useCases";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "wouter";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "工程案例", path: "/cases" },
];

export default function CaseStudies() {
  const { studies, isLoading, error } = useCaseStudies();
  const videoStudies = studies.filter(study => study.video);
  const otherStudies = studies.filter(study => !study.video);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/cases#webpage`,
      url: `${SITE_URL}/cases`,
      name: "通渠工程案例｜通渠熊 DrainBear",
      inLanguage: "zh-Hant-HK",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
    },
    ...(studies.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: studies.map((study, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}/cases/${study.slug}`,
              name: study.title,
            })),
          },
        ]
      : []),
  ];

  return (
    <div
      className="bg-[var(--db-paper)]"
      data-cms-loading={isLoading}
      data-cms-error={Boolean(error)}
    >
      <SEO
        title="通渠工程案例｜現場問題、處理方法與完成結果｜通渠熊"
        description="觀看通渠熊真實施工短片，了解坐廁通渠、櫃內去水位、喉口檢查與戶外渠口處理。每段影片附現場情況、施工說明及文字紀錄。"
        path="/cases"
        keywords="通渠案例, 通渠工程, 高壓水槍案例, CCTV照喉案例, 香港渠務工程"
        jsonLd={jsonLd}
        breadcrumbs={CRUMBS}
        contentReady={!isLoading}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          kicker="工程紀錄"
          title="通渠工程案例"
          description="睇真實現場，了解師傅點樣處理。施工短片附文字說明；相似問題的處理方法和收費，仍按現場情況確認。"
          contactLocation="cases_hero"
        />
      </div>

      <div className="db-container py-12 md:py-16">
        {isLoading ? (
          <p
            role="status"
            className="border-y border-[var(--db-rule)] py-10 text-[var(--db-copy)]"
          >
            正在讀取已發佈工程紀錄…
          </p>
        ) : studies.length ? (
          <div>
            {videoStudies.length ? (
              <section
                aria-labelledby="recorded-videos-heading"
                className="mb-12"
              >
                <div className="section-heading">
                  <div>
                    <p className="brand-eyebrow">真實現場 · 施工短片</p>
                    <h2 id="recorded-videos-heading">由畫面了解施工過程</h2>
                  </div>
                </div>
                <div className="recorded-case-grid">
                  {videoStudies.map(study => (
                    <CaseStudyCard key={study._id} study={study} />
                  ))}
                </div>
              </section>
            ) : null}
            {otherStudies.length ? (
              <h2 className="mb-6 text-3xl font-black">更多工程紀錄</h2>
            ) : null}
            {otherStudies.map((study, index) => (
              <article
                key={study._id}
                className="case-studies-row border-t border-[var(--db-rule)] py-10 md:py-14"
              >
                <Link
                  href={`/cases/${study.slug}`}
                  className="group grid gap-7 lg:grid-cols-[3rem_minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10"
                >
                  <span className="text-sm font-black text-[var(--db-safety)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-[var(--db-copy)]">
                      {study.district ? (
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {study.district}
                        </span>
                      ) : null}
                      {study.projectDate ? (
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {formatCaseDate(study.projectDate)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--db-safety)]">
                      {study.serviceLabel}
                    </p>
                    <h2 className="mt-3 text-2xl font-black leading-tight text-[var(--db-ink)] md:text-3xl">
                      {study.title}
                    </h2>
                  </div>
                  <div>
                    <p className="text-base leading-8 text-[var(--db-copy)]">
                      {study.summary}
                    </p>
                    <span className="mt-6 inline-flex min-h-11 items-center gap-2 font-black text-[var(--db-ink)] group-hover:text-[var(--db-safety)]">
                      查看工程紀錄 <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <section className="grid gap-8 border-y border-[var(--db-rule)] py-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-black text-[var(--db-ink)]">
                工程資料正在整理
              </h2>
              <p className="mt-3 leading-7 text-[var(--db-copy)]">
                暫未有已完成核對並公開的案例。我們不會以示例內容冒充真實工程；您仍可傳送現場資料，由團隊按實際情況提供初步方向。
              </p>
            </div>
            <WhatsAppButton
              className="w-full md:w-fit md:justify-self-end"
              label="WhatsApp 傳送現場資料"
              trackLocation="cases_empty"
            />
          </section>
        )}

        {error ? (
          <p className="mt-5 text-sm text-[var(--db-copy)]">
            案例資料暫時未能更新，請稍後再試。
          </p>
        ) : null}
      </div>

      <section className="border-y border-[var(--db-rule)] bg-white">
        <div className="db-container py-12 md:py-16">
          <QuoteRequestForm
            location="cases_quote_form"
            title="您的現場情況，未必與公開案例完全相同"
            description="提供地區、問題位置及大概情況，團隊會按您提供的資料作初步跟進；不同管道仍需按現場確認。"
          />
        </div>
      </section>

      <section className="bg-[var(--db-ink)] text-white">
        <div className="db-container grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black">
              您的情況未必與案例完全相同。
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/70">
              傳送地點、淤塞位置及相片或短片，團隊會先了解情況，再確認方案與收費。
            </p>
          </div>
          <WhatsAppButton
            label="WhatsApp 即時查詢"
            trackLocation="cases_footer"
            className="w-full md:w-auto"
          />
        </div>
      </section>
    </div>
  );
}
