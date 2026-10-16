import HomeMobileRail from "./HomeMobileRail";
import AnimatedDisclosure from "./AnimatedDisclosure";
import { recordedCaseStudies } from "@/lib/caseRepository";
import { useCaseStudies } from "@/lib/useCases";
import { createImageSrcSet, optimizedImageUrl } from "@/lib/imageOptimization";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

/** Summaries checked against the published CMS records on 2026-10-13 (Hong Kong). */
const COMPLETED_CASES = [
  {
    slug: "home-basin-grease-buildup-cleaning",
    title: "洗手盆拆喉清理及放水測試",
    facts: [
      ["問題", "家居洗手盆長期去水緩慢。"],
      ["發現", "去水喉及隔氣位置積聚油污、皂垢和黏稠污物。"],
      ["處理", "拆喉清理阻塞物，排走污水後重新接駁。"],
      ["測試", "連續放水後去水恢復正常，接駁位置沒有明顯滲漏。"],
    ],
  },
  {
    slug: "school-rainwater-drain-high-pressure-cleaning",
    title: "雨水渠高壓清洗及排水測試",
    facts: [
      ["問題", "學校戶外雨水渠排水緩慢並出現積水。"],
      ["發現", "落水管及相連渠段有泥沙和積聚物淤積。"],
      ["處理", "從可操作管口放入高壓水喉，清理管段積聚物。"],
      ["測試", "清洗後進行排水測試，紀錄顯示排水恢復暢順。"],
    ],
  },
];

export default function RecordedCaseGallery() {
  const { studies, isLoading, error } = useCaseStudies();
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
        <p className="section-heading-description">
          原片展示施工過程，下方另附兩宗完成去水測試的案例。完整紀錄可在案例內頁查看。
        </p>
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
                <p>{study.result}</p>
              </figcaption>
            </figure>
          ))}
        </HomeMobileRail>
        <div
          className="home-case-evidence"
          data-cms-loading={isLoading}
          data-cms-error={Boolean(error)}
        >
          <h3>附完工測試的通渠紀錄</h3>
          <div className="home-case-evidence__grid">
            {COMPLETED_CASES.map(record => {
              const study = studies.find(item => item.slug === record.slug);
              return (
                <article key={record.slug}>
                  {study?.coverImage?.url ? (
                    <img
                      src={optimizedImageUrl(study.coverImage.url, 640)}
                      srcSet={createImageSrcSet(
                        study.coverImage.url,
                        [320, 480, 640, 960]
                      )}
                      sizes="(min-width: 768px) 50vw, 80px"
                      alt={study.coverImage.alt || study.title}
                      width={study.coverImage.width}
                      height={study.coverImage.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div>
                    <h4>
                      <Link href={`/cases/${record.slug}`}>
                        {record.title} <ArrowRight aria-hidden="true" />
                      </Link>
                    </h4>
                    {study ? (
                      <AnimatedDisclosure
                        id={`home-evidence-${record.slug}`}
                        title="查看處理及測試紀錄"
                        className="home-evidence-details"
                      >
                        <dl>
                          {record.facts.map(([label, text]) => (
                            <div key={label}>
                              <dt>{label}</dt>
                              <dd>{text}</dd>
                            </div>
                          ))}
                        </dl>
                      </AnimatedDisclosure>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
