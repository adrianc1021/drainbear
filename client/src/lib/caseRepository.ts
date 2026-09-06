import type { SanityCaseStudy } from "@/lib/sanity/types";

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

export type CaseStudyView = SanityCaseStudy & {
  serviceLabel: string;
};

export function mapCaseStudy(study: SanityCaseStudy): CaseStudyView {
  return {
    ...study,
    serviceLabel: SERVICE_LABELS[study.serviceType] ?? "渠務工程",
  };
}

export async function fetchCaseStudies(): Promise<CaseStudyView[]> {
  const { getPublishedCaseStudies } = await import("@/lib/sanity/queries");
  return (await getPublishedCaseStudies()).map(mapCaseStudy);
}

export async function fetchFeaturedCaseStudies(
  limit = 3
): Promise<CaseStudyView[]> {
  const { getFeaturedCaseStudies } = await import("@/lib/sanity/queries");
  return (await getFeaturedCaseStudies(limit)).map(mapCaseStudy);
}

export async function fetchCaseStudyBySlug(
  slug: string
): Promise<CaseStudyView | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return null;

  const { getPublishedCaseStudyBySlug } = await import("@/lib/sanity/queries");
  const study = await getPublishedCaseStudyBySlug(normalizedSlug);
  return study ? mapCaseStudy(study) : null;
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
