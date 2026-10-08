import type { SanityCaseStudy } from "@/lib/sanity/types";
import {
  RECORDED_VIDEO_CASES,
  type CaseVideo,
} from "@shared/recordedVideoCases";

const SERVICE_LABELS: Record<string, string> = {
  residential: "住宅通渠",
  commercial: "商業通渠",
  hydrojet: "高壓水槍洗渠",
  cctv: "CCTV 照喉",
  "grease-trap": "隔油池清理",
  manhole: "沙井／村屋渠務",
  "building-main": "大廈主渠工程",
  other: "其他渠務工程",
};

export type CaseStudyView = Omit<
  SanityCaseStudy,
  "district" | "projectDate"
> & {
  district?: string;
  projectDate?: string;
  publishedAt?: string;
  serviceLabel: string;
  servicePath?: string;
  video?: CaseVideo;
};

export const recordedCaseStudies: CaseStudyView[] = RECORDED_VIDEO_CASES.map(
  record => ({
    ...record,
    _id: `recorded-video-${record.slug}`,
    updatedAt: record.publishedAt,
    featured: true,
    coverImage: {
      url: record.video.poster,
      alt: record.title,
      width: record.video.width,
      height: record.video.height,
    },
    seo: {
      metaTitle: `${record.title}｜真實施工影片｜通渠熊`,
      metaDescription: record.summary,
    },
  })
);

export function combineCaseStudies(cmsStudies: SanityCaseStudy[]) {
  const localSlugs = new Set(recordedCaseStudies.map(study => study.slug));
  if (cmsStudies.some(study => localSlugs.has(study.slug)))
    throw new Error("CMS 與已核對影片案例的網址重複，請先確認發布來源");
  return [...recordedCaseStudies, ...cmsStudies.map(mapCaseStudy)];
}

export function mapCaseStudy(study: SanityCaseStudy): CaseStudyView {
  const district = study.district?.trim();
  return {
    ...study,
    district: district && !/^[-—－–]+$/.test(district) ? district : undefined,
    serviceLabel: SERVICE_LABELS[study.serviceType] ?? "渠務工程",
  };
}

export async function fetchCaseStudies(): Promise<CaseStudyView[]> {
  const { getPublishedCaseStudies } = await import("@/lib/sanity/queries");
  return combineCaseStudies(await getPublishedCaseStudies());
}

export async function fetchFeaturedCaseStudies(
  limit = 3
): Promise<CaseStudyView[]> {
  const { getFeaturedCaseStudies } = await import("@/lib/sanity/queries");
  return combineCaseStudies(await getFeaturedCaseStudies(limit)).slice(
    0,
    limit
  );
}

export async function fetchCaseStudyBySlug(
  slug: string
): Promise<CaseStudyView | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return null;

  const recordedStudy = recordedCaseStudies.find(
    study => study.slug === normalizedSlug
  );
  if (recordedStudy) return recordedStudy;

  const { getPublishedCaseStudyBySlug } = await import("@/lib/sanity/queries");
  const study = await getPublishedCaseStudyBySlug(normalizedSlug);
  return study ? mapCaseStudy(study) : null;
}

export function formatVideoDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;
}

export function formatCaseDate(value: string) {
  return new Intl.DateTimeFormat("zh-HK", {
    year: "numeric",
    month: "long",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

export function formatMinutes(value?: number) {
  if (!value) return undefined;
  if (value < 60) return `${value} 分鐘`;

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes ? `${hours} 小時 ${minutes} 分鐘` : `${hours} 小時`;
}
