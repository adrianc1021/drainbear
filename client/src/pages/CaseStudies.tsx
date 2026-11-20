import Breadcrumbs from "@/components/Breadcrumbs";
import CaseStudyCard from "@/components/CaseStudyCard";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import InquiryContactPanel from "@/components/InquiryContactPanel";
import { WhatsAppButton } from "@/components/Layout";
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
      name: "通渠工程案例與施工紀錄｜通渠熊 DrainBear",
      inLanguage: "zh-Hant-HK",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
    },
    ...(studies.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: [...otherStudies, ...videoStudies].map((study, index) => ({
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
        title="通渠工程案例｜學校雨水渠高壓清洗、家居洗手盆疏通｜通渠熊"
        description="查看通渠熊的渠務工程實例。學校雨水渠記錄高壓清走泥沙後的排水測試，家居洗手盆記錄拆洗隔氣及接口試漏。另有坐廁、櫃底及戶外渠口的施工短片。"
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
          description="想知同你情況相似嘅工程點收尾？先睇施工前邊度積水、師傅清咗邊段喉，再睇完工後點試水。下面亦有現場操作短片。"
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
            {otherStudies.length ? (
              <h2 className="mb-6 text-3xl font-black">渠務工程實例與完工紀錄</h2>
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
                    <h3 className="mt-3 text-2xl font-black leading-tight text-[var(--db-ink)] md:text-3xl">
                      {study.title}
                    </h3>
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
            {videoStudies.length ? (
              <section
                aria-labelledby="recorded-videos-heading"
                className={otherStudies.length ? "mt-12" : undefined}
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
          <InquiryContactPanel
            location="cases_quote_form"
            title="您的現場情況，未必與公開案例完全相同"
            description="提供地區、問題位置及大概情況，團隊會按您提供的資料作初步跟進；不同管道仍需按現場確認。"
          />
        </div>
      </section>
    </div>
  );
}
