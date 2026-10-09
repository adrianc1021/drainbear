import { CASE_SERVICE_RELATIONS } from "@shared/caseServiceRelations";
import { recordedCaseStudies } from "@/lib/caseRepository";
import { useCaseStudies } from "@/lib/useCases";
import { trackNavClick } from "@/lib/analytics";
import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "wouter";

const CMS_TITLES: Record<string, string> = {
  "home-basin-grease-buildup-cleaning": "家居去水油垢清理紀錄",
  "school-rainwater-drain-high-pressure-cleaning": "學校雨水渠高壓清洗紀錄",
};

export default function RelatedCaseRecords({
  serviceSlugs,
  location,
  id = "related-cases",
}: {
  serviceSlugs: readonly string[];
  location: string;
  id?: string;
}) {
  const { studies, isLoading, error } = useCaseStudies();
  const relations = CASE_SERVICE_RELATIONS.filter(item =>
    serviceSlugs.includes(item.serviceSlug)
  );
  const unique = relations
    .filter(
      (item, index) =>
        relations.findIndex(other => other.caseSlug === item.caseSlug) === index
    )
    .slice(0, 3);
  const needsCms = unique.some(
    relation =>
      !recordedCaseStudies.some(study => study.slug === relation.caseSlug)
  );
  return (
    <section
      className="brand-section related-case-records"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-cms-loading={needsCms && isLoading}
      data-cms-error={needsCms && Boolean(error)}
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="brand-eyebrow">實際操作 · 了解施工</p>
            <h2 id={`${id}-heading`}>相關施工紀錄</h2>
          </div>
          <Link href="/cases">
            查看全部案例 <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="related-case-records__grid">
          {unique.map(relation => {
            const study =
              recordedCaseStudies.find(
                item => item.slug === relation.caseSlug
              ) ?? studies.find(item => item.slug === relation.caseSlug);
            const title = study?.title ?? CMS_TITLES[relation.caseSlug];
            return (
              <article key={relation.caseSlug}>
                <Link
                  href={`/cases/${relation.caseSlug}`}
                  onClick={() =>
                    trackNavClick("cta", {
                      cta_location: location,
                      cta_label: title,
                      destination_url: `/cases/${relation.caseSlug}`,
                    })
                  }
                >
                  {study?.coverImage ? (
                    <img
                      src={study.coverImage.url}
                      alt=""
                      width={study.coverImage.width}
                      height={study.coverImage.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="related-case-records__icon">
                      <MessageIcon />
                    </span>
                  )}
                  <div>
                    <h3>{title}</h3>
                    <p>{relation.note}</p>
                    <span>
                      {study?.video ? "觀看施工短片" : "閱讀工程紀錄"}{" "}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function MessageIcon() {
  return <Play aria-hidden="true" />;
}
