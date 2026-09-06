import { CalendarDays, Clock, MapPin, Wrench } from "lucide-react";
import { useParams } from "wouter";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import { WhatsAppButton } from "@/components/Layout";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";
import { formatCaseDate, formatMinutes } from "@/lib/caseRepository";
import { useCaseStudy } from "@/lib/useCases";
import NotFound from "@/pages/NotFound";

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { study, isLoading, error } = useCaseStudy(slug || "");

  if (!isLoading && !study) return <NotFound />;

  const path = `/cases/${slug || ""}`;
  const crumbs = [
    { name: "首頁", path: "/" },
    { name: "工程案例", path: "/cases" },
    { name: study?.title ?? "工程紀錄", path },
  ];
  const image = study?.seo?.ogImage?.url || study?.coverImage?.url;
  const jsonLd = study
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${SITE_URL}${path}#article`,
        url: `${SITE_URL}${path}`,
        headline: study.title,
        description: study.summary,
        image: image ? [image] : undefined,
        datePublished: study.projectDate,
        dateModified: study.updatedAt ?? study.projectDate,
        inLanguage: "zh-Hant-HK",
        author: { "@id": BUSINESS_ID },
        publisher: { "@id": BUSINESS_ID },
        isPartOf: { "@id": WEBSITE_ID },
        spatialCoverage: { "@type": "Place", name: study.district },
        about: { "@type": "Service", name: study.serviceLabel, provider: { "@id": BUSINESS_ID } },
      }
    : undefined;

  return (
    <div className="bg-[var(--db-paper)]">
      <SEO
        title={study?.seo?.metaTitle || study?.title || "工程案例｜通渠熊"}
        description={study?.seo?.metaDescription || study?.summary || "通渠熊工程案例紀錄"}
        path={path}
        canonicalUrl={study?.seo?.canonicalUrl}
        keywords={study?.seo?.focusKeywords?.join(", ")}
        image={image}
        imageAlt={study?.coverImage?.alt}
        type="article"
        jsonLd={jsonLd}
        breadcrumbs={crumbs}
        contentReady={!isLoading}
      />
      <Breadcrumbs items={crumbs} />

      {isLoading ? (
        <main className="db-container min-h-[55vh] py-16" role="status">正在讀取工程紀錄…</main>
      ) : study ? (
        <>
          <article>
            <header className="border-b border-[var(--db-rule)]">
              <div className="db-container grid gap-10 py-12 md:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--db-safety)]">{study.serviceLabel}</p>
                  <h1 className="mt-5 max-w-4xl font-display text-4xl font-black leading-[1.08] text-[var(--db-ink)] md:text-6xl">{study.title}</h1>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--db-copy)]">{study.summary}</p>
                </div>
                <dl className="grid grid-cols-2 border-y border-[var(--db-rule)] text-sm">
                  <div className="py-5 pr-4"><dt className="flex items-center gap-2 text-[var(--db-copy)]"><MapPin className="h-4 w-4" />地區</dt><dd className="mt-2 font-black text-[var(--db-ink)]">{study.district}</dd></div>
                  <div className="border-l border-[var(--db-rule)] py-5 pl-5"><dt className="flex items-center gap-2 text-[var(--db-copy)]"><CalendarDays className="h-4 w-4" />工程日期</dt><dd className="mt-2 font-black text-[var(--db-ink)]">{formatCaseDate(study.projectDate)}</dd></div>
                  {study.arrivalMinutes ? <div className="border-t border-[var(--db-rule)] py-5 pr-4"><dt className="flex items-center gap-2 text-[var(--db-copy)]"><Clock className="h-4 w-4" />到達紀錄</dt><dd className="mt-2 font-black text-[var(--db-ink)]">{formatMinutes(study.arrivalMinutes)}</dd></div> : null}
                  {study.durationMinutes ? <div className="border-l border-t border-[var(--db-rule)] py-5 pl-5"><dt className="flex items-center gap-2 text-[var(--db-copy)]"><Wrench className="h-4 w-4" />施工時間</dt><dd className="mt-2 font-black text-[var(--db-ink)]">{formatMinutes(study.durationMinutes)}</dd></div> : null}
                </dl>
              </div>
            </header>

            {study.coverImage?.url ? (
              <figure className="db-container py-10">
                <img src={study.coverImage.url} alt={study.coverImage.alt || study.title} width={study.coverImage.width} height={study.coverImage.height} className="max-h-[720px] w-full object-cover" loading="eager" fetchPriority="high" />
                {study.coverImage.caption ? <figcaption className="mt-3 text-sm text-[var(--db-copy)]">{study.coverImage.caption}</figcaption> : null}
              </figure>
            ) : null}

            <div className="db-container grid gap-12 py-10 md:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-12">
                {[
                  ["現場問題", study.problem],
                  ["施工內容", study.workPerformed],
                  ["完成結果", study.result],
                ].map(([heading, text]) => (
                  <section key={heading} className="border-t border-[var(--db-rule)] pt-7">
                    <h2 className="text-2xl font-black text-[var(--db-ink)]">{heading}</h2>
                    <p className="mt-4 whitespace-pre-line text-base leading-8 text-[var(--db-copy)]">{text}</p>
                  </section>
                ))}
              </div>
              <aside className="border-t border-[var(--db-rule)] pt-7">
                <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[var(--db-ink)]">紀錄資料</h2>
                <dl className="mt-5 space-y-5 text-sm">
                  <div><dt className="text-[var(--db-copy)]">工程類型</dt><dd className="mt-1 font-black">{study.serviceLabel}</dd></div>
                  {study.equipmentUsed?.length ? <div><dt className="text-[var(--db-copy)]">使用設備</dt><dd className="mt-2 flex flex-wrap gap-2">{study.equipmentUsed.map(item => <span key={item} className="border border-[var(--db-rule)] px-3 py-1.5 font-bold">{item}</span>)}</dd></div> : null}
                </dl>
                <p className="mt-7 text-xs leading-6 text-[var(--db-copy)]">此紀錄只代表該次工程。到達時間、施工方法及結果受現場條件影響，不構成其他個案的保證。</p>
              </aside>
            </div>

            {[study.beforeImages, study.afterImages].some(images => images?.length) ? (
              <section className="border-t border-[var(--db-rule)]">
                <div className="db-container py-12 md:py-16">
                  <h2 className="text-3xl font-black text-[var(--db-ink)]">施工影像紀錄</h2>
                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    {([...[...(study.beforeImages || [])].map(image => ({ ...image, stage: "施工前" })), ...[...(study.afterImages || [])].map(image => ({ ...image, stage: "施工後" }))]).map((image, index) => image.url ? (
                      <figure key={`${image.url}-${index}`}>
                        <img src={image.url} alt={image.alt || `${study.title}${image.stage}`} width={image.width} height={image.height} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                        <figcaption className="mt-3 text-sm text-[var(--db-copy)]"><strong className="text-[var(--db-ink)]">{image.stage}</strong>{image.caption ? `｜${image.caption}` : ""}</figcaption>
                      </figure>
                    ) : null)}
                  </div>
                </div>
              </section>
            ) : null}
          </article>

          <section className="bg-[var(--db-ink)] text-white">
            <div className="db-container grid gap-7 py-12 md:grid-cols-[1fr_auto] md:items-center">
              <div><h2 className="text-3xl font-black">遇到相似渠務問題？</h2><p className="mt-3 text-white/70">先傳送位置與現場相片，團隊會按你的實際情況判斷。</p></div>
              <WhatsAppButton label="WhatsApp 傳送資料" trackLocation="case_detail_footer" className="w-full md:w-auto" />
            </div>
          </section>
        </>
      ) : null}

      {error ? <p className="db-container py-8 text-sm text-[var(--db-copy)]">案例資料暫時未能讀取。</p> : null}
    </div>
  );
}
