import { BUSINESS_ID, SITE_URL, WEBSITE_ID, absoluteUrl } from "@/config/site";
import type { CaseStudyView } from "@/lib/caseRepository";

export function caseVideoSchema(study: CaseStudyView) {
  if (!study.video || !study.publishedAt) return undefined;
  const url = `${SITE_URL}/cases/${study.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    url: `${url}#施工影片`,
    name: study.title,
    description: study.summary,
    thumbnailUrl: absoluteUrl(study.video.poster),
    contentUrl: absoluteUrl(study.video.src),
    uploadDate: study.publishedAt,
    duration: `PT${study.video.durationSeconds}S`,
    inLanguage: "zh-Hant-HK",
    publisher: { "@id": BUSINESS_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": WEBSITE_ID },
    transcript: study.video.chapters.map(chapter => chapter.text).join("。"),
  };
}
