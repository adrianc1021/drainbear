import HomeMobileRail from "./HomeMobileRail";
import CompletedCaseEvidence from "./CompletedCaseEvidence";
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
            <h2 id="home-recorded-cases-heading">施工過程紀錄</h2>
          </div>
          <Link href="/cases">
            查看全部施工紀錄 <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <HomeMobileRail label="施工短片" className="home-work-films">
          {[recordedCaseStudies[1], recordedCaseStudies[4]].map(study => (
            <figure key={study._id}>
              <video
                controls
                playsInline
                preload="none"
                poster={study.video!.poster}
                width={study.video!.width}
                height={study.video!.height}
                aria-label={study.title}
              >
                <source src={study.video!.src} type="video/mp4" />
                <track
                  kind="captions"
                  src={study.video!.captions}
                  srcLang="zh-HK"
                  label="繁體中文"
                  default
                />
                <a href={study.video!.src}>下載施工短片</a>
              </video>
              <figcaption>
                <h3>
                  <Link href={`/cases/${study.slug}`}>
                    {study.title} <ArrowRight aria-hidden="true" />
                  </Link>
                </h3>
              </figcaption>
            </figure>
          ))}
        </HomeMobileRail>
        <CompletedCaseEvidence />
      </div>
    </section>
  );
}
