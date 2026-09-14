import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "wouter";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import { WhatsAppButton } from "@/components/Layout";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { formatCaseDate } from "@/lib/caseRepository";
import { useCaseStudies } from "@/lib/useCases";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "工程案例", path: "/cases" },
];

export default function CaseStudies() {
  const { studies, isLoading, error } = useCaseStudies();
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
      ? [{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: studies.map((study, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/cases/${study.slug}`,
            name: study.title,
          })),
        }]
      : []),
  ];

  return (
    <div className="bg-[var(--db-paper)]" data-cms-loading={isLoading} data-cms-error={Boolean(error)}>
      <SEO
        title="通渠工程案例｜現場問題、處理方法與完成結果｜通渠熊"
        description="查看通渠熊已核實並由 CMS 發佈的渠務工程紀錄，包括地區、現場問題、使用設備、處理步驟及完成測試。"
        path="/cases"
        keywords="通渠案例, 通渠工程, 高壓水槍案例, CCTV照喉案例, 香港渠務工程"
        jsonLd={jsonLd}
        breadcrumbs={CRUMBS}
        contentReady={!isLoading}
      />
      <Breadcrumbs items={CRUMBS} />

      <header className="case-studies-hero border-b border-[var(--db-rule)]">
        <div className="db-container grid gap-8 py-14 md:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.85fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--db-safety)]">
              Field records / 工程紀錄
            </p>
            <h1 className="case-studies-hero__title mt-5 max-w-2xl font-display font-black text-[var(--db-ink)]">
              現場問題、做法與結果，逐項記錄。
            </h1>
          </div>
          <p className="max-w-xl text-base leading-8 text-[var(--db-copy)] lg:justify-self-end">
            此頁只顯示已在內容系統正式發佈的工程紀錄。個案會隱去客戶完整地址，並列出工程日期、地區、設備及完成測試；不同現場不能視為固定報價或時間保證。
          </p>
        </div>
      </header>

      <main className="db-container py-12 md:py-16">
        {isLoading ? (
          <p role="status" className="border-y border-[var(--db-rule)] py-10 text-[var(--db-copy)]">
            正在讀取已發佈工程紀錄…
          </p>
        ) : studies.length ? (
          <div className="border-b border-[var(--db-rule)]">
            {studies.map((study, index) => (
              <article key={study._id} className="case-studies-row border-t border-[var(--db-rule)] py-10 md:py-14">
                <Link
                  href={`/cases/${study.slug}`}
                  className="group grid gap-7 lg:grid-cols-[3rem_minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10"
                >
                  <span className="text-sm font-black text-[var(--db-safety)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-[var(--db-copy)]">
                      <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{study.district}</span>
                      <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{formatCaseDate(study.projectDate)}</span>
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--db-safety)]">
                      {study.serviceLabel}
                    </p>
                    <h2 className="mt-3 text-2xl font-black leading-tight text-[var(--db-ink)] md:text-3xl">
                      {study.title}
                    </h2>
                  </div>
                  <div>
                    <p className="text-base leading-8 text-[var(--db-copy)]">{study.summary}</p>
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
              <h2 className="text-2xl font-black text-[var(--db-ink)]">工程資料正在整理</h2>
              <p className="mt-3 leading-7 text-[var(--db-copy)]">
                暫未有已完成核對並公開的案例。我們不會以示例內容冒充真實工程；你仍可傳送現場資料，由團隊按實際情況提供初步方向。
              </p>
            </div>
            <WhatsAppButton className="w-full md:w-fit md:justify-self-end" label="WhatsApp 傳送現場資料" trackLocation="cases_empty" />
          </section>
        )}

        {error ? (
          <p className="mt-5 text-sm text-[var(--db-copy)]">
            案例資料暫時未能更新，請稍後再試。
          </p>
        ) : null}
      </main>

      <section className="bg-[var(--db-ink)] text-white">
        <div className="db-container grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black">你的情況未必與案例完全相同。</h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/70">傳送地點、淤塞位置及相片或短片，團隊會先了解情況，再確認方案與收費。</p>
          </div>
          <WhatsAppButton label="WhatsApp 即時查詢" trackLocation="cases_footer" className="w-full md:w-auto" />
        </div>
      </section>
    </div>
  );
}
