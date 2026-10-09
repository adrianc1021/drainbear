import { getServicePage } from "@/lib/serviceData";
import { cloudinaryImageUrl } from "@/lib/cloudinary";

/** Short labels for browsing. Photos only claim the work shown by their source. */
const VISUALS: Record<
  string,
  { summary: string; poster?: string; alt?: string }
> = {
  "toilet-unblocking": {
    summary: "沖水唔順 · 水位升高",
    poster: "toilet-drain-tool-operation",
    alt: "真實施工短片：師傅在坐廁去水位置操作工具",
  },
  "kitchen-sink-unblocking": {
    summary: "鋅盤積水 · 去水慢",
    poster: "under-sink-drain-line-operation",
    alt: "真實施工短片：櫃底去水位置的工具及接水操作",
  },
  "bathroom-drain-unblocking": { summary: "企缸積水 · 地台去水慢" },
  "sewage-backflow": { summary: "污水湧出 · 多處倒灌" },
  "grease-trap-cleaning": { summary: "食肆油垢 · 隔油池清理" },
  "high-pressure-jetting": { summary: "管段積垢 · 高壓清洗" },
  "cctv-drain-inspection": {
    summary: "反覆塞渠 · 檢查管內",
    poster: "drain-inspection-line-feed",
    alt: "真實施工短片：檢查線盤與喉口操作，並非管內診斷影像",
  },
  "main-drain-manhole": {
    summary: "主渠淤塞 · 沙井檢視",
    poster: "outdoor-drain-chamber-operation",
    alt: "真實施工短片：戶外渠口開蓋及工具操作",
  },
};

export function getServiceVisual(slug: string) {
  const service = getServicePage(slug)!;
  const visual = VISUALS[slug];
  return {
    summary: visual?.summary ?? service.shortName,
    src: visual?.poster
      ? `/videos/cases/${visual.poster}-v1.webp`
      : cloudinaryImageUrl(service.image, 480),
    alt: visual?.alt ?? service.imageAlt,
    recorded: !!visual?.poster,
  };
}
