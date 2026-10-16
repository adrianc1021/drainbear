import type { SanityImageData } from "./sanity/types";

/** Reuse verified brand illustrations; illustrative diagrams are not case evidence. */
function illustration(
  stem: string,
  alt: string,
  caption: string,
  height: number
): SanityImageData {
  const url = `/images/blog/${stem}`;
  return {
    url: `${url}.webp`,
    srcSet:
      height === 800
        ? `${url}-640.webp 640w, ${url}-960.webp 960w, ${url}.webp 1200w`
        : `${url}-640.webp 640w, ${url}.webp 1200w`,
    width: 1200,
    height,
    alt: `AI 示意插圖：${alt}`,
    caption: `AI 示意｜${caption}`,
  };
}

export const ARTICLE_IMAGES = {
  quote: illustration(
    "editorial/quote-review",
    "白熊與住戶在桌前核對工程清單",
    "報價及工序確認",
    800
  ),
  services: illustration(
    "editorial/service-scenes",
    "白熊在住宅浴室、食肆廚房與物業戶外三種場所介紹渠務",
    "住宅、食肆與物業的服務場景",
    800
  ),
  camera: illustration(
    "editorial/camera-inspection",
    "白熊在可接近的去水入口旁操作檢查線盤與影像屏幕",
    "CCTV 設備、入口及影像檢查",
    800
  ),
  restaurant: illustration(
    "24-hour-restaurant-drain-emergency",
    "白熊與廚師在食肆廚房核對工作資料",
    "食肆廚房與進場協調",
    676
  ),
  property: illustration(
    "property-drain-maintenance-plan",
    "白熊與物業人員對照管線示意及檢查設備",
    "物業排水資料與檢查安排",
    676
  ),
  village: illustration(
    "village-house-drain-access-planning",
    "白熊在村屋通道搬運工具及線盤",
    "先交代通道及設備進場條件",
    676
  ),
  shared: illustration(
    "24-hour-shared-drain-backflow-coordination",
    "白熊與住戶及物業人員對照排水位置示意",
    "住戶與管理處協調受影響位置",
    676
  ),
  sink: illustration(
    "sink-drain-access-disassembly",
    "白熊在鋅盤櫃底觀察隔氣和喉管接駁",
    "櫃底入口及隔氣位置",
    676
  ),
  waterTest: illustration(
    "drain-service-completion-checklist",
    "白熊在鋅盤旁觀察放水及記錄",
    "按實際處理位置觀察去水",
    676
  ),
  observe: illustration(
    "toilet-gurgling-sounds-drain-check-inline",
    "坐廁、洗手盆及地台去水口的紙藝示意",
    "記錄受影響的去水位置",
    800
  ),
  handoff: illustration(
    "tenant-blocked-drain-landlord-arrangements-inline",
    "住戶與白熊在門前核對電話、相片及進場資料",
    "整理相片、聯絡及進場資料",
    800
  ),
  prepare: illustration(
    "home-drain-service-preparation-protection-inline",
    "白熊清出櫃底、保留通道及觀察放水的三個場景",
    "清出入口、保留通道與配合試水",
    800
  ),
  basinCase: {
    alt: "家居洗手盆去水喉拆開後可見管內陳年油污及皂垢積聚",
    caption: "工程原相｜洗手盆去水喉的積聚物",
    height: 1600,
    url: "https://cdn.sanity.io/images/oyph9zy1/production/6bae8f0dde300e30dcd96f0978755356a4ae9464-1200x1600.jpg",
    width: 1200,
  },
  schoolCase: {
    alt: "學校戶外雨水渠旁的高壓洗渠設備及水喉",
    caption: "工程原相｜學校雨水渠清洗設備與水喉",
    height: 1600,
    url: "https://cdn.sanity.io/images/oyph9zy1/production/12e4ade62b033f98e8700c240d4c3617e8146966-1200x1600.jpg",
    width: 1200,
  },
} satisfies Record<string, SanityImageData>;
