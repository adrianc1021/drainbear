import CaseStudyCard from "@/components/CaseStudyCard";
import { useCaseStudies } from "@/lib/useCases";

/** Only an explicitly recorded district can establish a local project association. */
export default function DistrictCaseRecords({
  district,
}: {
  district: string;
}) {
  const { studies, isLoading, error } = useCaseStudies();
  if (isLoading)
    return (
      <div className="container py-6" data-cms-loading="true" role="status">
        正在讀取工程紀錄…
      </div>
    );
  if (error)
    return (
      <p className="container py-6" data-cms-error="true">
        工程紀錄暫時未能讀取，可先查詢現場安排。
      </p>
    );
  const local = studies
    .filter(study => study.district?.trim() === district)
    .slice(0, 3);
  if (!local.length) return null;
  return (
    <section className="brand-section" aria-labelledby="district-cases-heading">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="brand-eyebrow">已記錄的工程位置</p>
            <h2 id="district-cases-heading">{district}施工紀錄</h2>
          </div>
        </div>
        <div className="recorded-case-grid">
          {local.map(study => (
            <CaseStudyCard key={study._id} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
