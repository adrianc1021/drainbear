import { formatVideoDuration, type CaseStudyView } from "@/lib/caseRepository";
import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyCard({ study }: { study: CaseStudyView }) {
  return (
    <article className="recorded-case-card">
      <Link href={`/cases/${study.slug}`} className="recorded-case-card__link">
        {study.coverImage?.url ? (
          <div className="recorded-case-card__media">
            <img
              src={study.coverImage.url}
              alt=""
              width={study.coverImage.width}
              height={study.coverImage.height}
              loading="lazy"
              decoding="async"
            />
            {study.video ? (
              <span className="recorded-case-card__play" aria-hidden="true">
                <Play />
                {formatVideoDuration(study.video.durationSeconds)}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="recorded-case-card__copy">
          <p className="recorded-case-card__category">{study.serviceLabel}</p>
          <h3>{study.title}</h3>
          <p>{study.summary}</p>
          <span className="recorded-case-card__action">
            {study.video ? "觀看施工短片" : "查看工程紀錄"}
            <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
