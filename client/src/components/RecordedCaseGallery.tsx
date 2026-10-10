import CaseStudyCard from "@/components/CaseStudyCard";
import { recordedCaseStudies } from "@/lib/caseRepository";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function RecordedCaseGallery() {
  return (
    <section
      className="brand-section home-recorded-cases"
      aria-labelledby="home-recorded-cases-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="brand-eyebrow">真實現場 · 施工短片</p>
            <h2 id="home-recorded-cases-heading">點樣通渠？睇現場。</h2>
          </div>
          <Link href="/cases">
            查看全部施工紀錄 <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <p className="section-heading-description">
          現場短片展示坐廁疏通、喉口檢查及戶外渠口操作；完整紀錄可在各案例內頁查看。
        </p>
        <div className="recorded-case-grid">
          {[
            recordedCaseStudies[2],
            recordedCaseStudies[0],
            recordedCaseStudies[4],
          ].map(study => (
            <CaseStudyCard key={study._id} study={study} concise />
          ))}
        </div>
        <nav className="home-case-links" aria-label="附完工測試的工程紀錄">
          <Link href="/cases/home-basin-grease-buildup-cleaning">
            洗手盆拆喉清理及放水測試 <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/cases/school-rainwater-drain-high-pressure-cleaning">
            雨水渠高壓清洗及排水測試 <ArrowRight aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </section>
  );
}
