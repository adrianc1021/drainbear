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
        <div className="recorded-case-grid">
          {recordedCaseStudies.slice(0, 3).map(study => (
            <CaseStudyCard key={study._id} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
