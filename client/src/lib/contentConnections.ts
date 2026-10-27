/** Purposeful article/service links; local names never stand in for project evidence. */
export const ARTICLE_SERVICE_LINKS: Record<
  string,
  { label: string; href: string }[]
> = {
  "bathroom-hair-clog-prevention": [
    {
      label: "頭髮清走仍積水？了解浴室通渠",
      href: "/services/bathroom-drain-unblocking",
    },
    {
      label: "多個位置一起倒灌？了解共用渠處理",
      href: "/services/sewage-backflow",
    },
  ],
  "bathroom-drain-smell-causes-solutions": [
    {
      label: "渠味伴隨去水慢？了解浴室通渠",
      href: "/services/bathroom-drain-unblocking",
    },
    {
      label: "反覆異常需要看管內？了解 CCTV 照喉",
      href: "/services/cctv-drain-inspection",
    },
  ],
  "prevent-kitchen-sink-clog": [
    {
      label: "鋅盤仍然去水慢？了解鋅盤通渠",
      href: "/services/kitchen-sink-unblocking",
    },
    {
      label: "食肆隔油設施需要清理？查看適用服務",
      href: "/services/grease-trap-cleaning",
    },
  ],
  "toilet-clog-emergency-guide": [
    {
      label: "坐廁水位升高？了解坐廁通渠",
      href: "/services/toilet-unblocking",
    },
    {
      label: "多戶或多處倒灌？了解主渠及沙井",
      href: "/services/main-drain-manhole",
    },
  ],
};

export const SERVICE_READING_LINKS: Record<
  string,
  { slug: string; title: string }[]
> = {
  "bathroom-drain-unblocking": [
    {
      slug: "bathroom-hair-clog-prevention",
      title: "浴室頭髮堵塞：清理與預防",
    },
    {
      slug: "bathroom-drain-smell-causes-solutions",
      title: "浴室渠味與去水問題",
    },
  ],
  "kitchen-sink-unblocking": [
    {
      slug: "home-drain-service-preparation-protection",
      title: "上門前清出櫃底與施工入口",
    },
    { slug: "prevent-kitchen-sink-clog", title: "鋅盤防塞與日常清理" },
  ],
  "cctv-drain-inspection": [
    {
      slug: "cctv-drain-inspection-hong-kong-guide",
      title: "CCTV 照渠：適用情況、流程及影像資料",
    },
  ],
  "sewage-backflow": [
    {
      slug: "washing-machine-drain-backflow-causes-fixes",
      title: "洗衣機排水倒灌：支渠與共用渠的分別",
    },
  ],
  "toilet-unblocking": [
    {
      slug: "toilet-gurgling-sounds-drain-check",
      title: "坐廁咕嚕聲：記錄水位與受影響位置",
    },
    { slug: "toilet-clog-emergency-guide", title: "塞廁所時先做甚麼？" },
  ],
};

/** Editorially matched reading paths; never infer a service from a keyword alone. */
export const CONTENT_CONNECTIONS_REVISED_AT = "2026-10-22";
export const SERVICE_TOPIC_ARTICLES = [
  {
    slug: "building-main-drain-vs-unit-branch-pipe",
    title: "大廈主渠與單位支喉點分？",
    services: ["main-drain-manhole", "sewage-backflow"],
    note: "多戶同時倒灌，先與管理處確認共用渠及檢查入口。",
  },
  {
    slug: "drain-blocked-after-renovation",
    title: "裝修後塞渠，先查甚麼？",
    services: ["cctv-drain-inspection", "main-drain-manhole"],
    note: "懷疑喉內有殘留物或管段異常，可先了解影像檢查的入口與視野限制。",
  },
  {
    slug: "drain-blocked-again-after-cleaning-root-causes",
    title: "通完又塞：反覆淤塞的檢查方向",
    services: ["cctv-drain-inspection", "high-pressure-jetting"],
    note: "反覆淤塞需了解原因；是否適合清洗，仍要按管道狀況確認。",
  },
  {
    slug: "drain-tool-selection-guide",
    title: "機械疏通、高壓洗渠與照渠點揀？",
    services: ["high-pressure-jetting", "cctv-drain-inspection"],
    note: "疏通、清洗與影像檢查用途不同，先了解各項服務的適用條件。",
  },
  {
    slug: "high-pressure-drain-cleaning-vs-spring-machine",
    title: "高壓洗渠與彈簧機的分別",
    services: ["high-pressure-jetting", "kitchen-sink-unblocking"],
    note: "局部鋅盤堵塞與較長管段積聚，所需入口及工具未必相同。",
  },
  {
    slug: "old-building-backflow-signs",
    title: "舊樓倒灌，如何交代受影響範圍？",
    services: ["sewage-backflow", "main-drain-manhole"],
    note: "說明是否多個單位或去水位同時受影響，再確認共用渠工作範圍。",
  },
  {
    slug: "rainstorm-typhoon-drain-checklist-hong-kong",
    title: "雨季前的去水與沙井檢查",
    services: ["main-drain-manhole", "high-pressure-jetting"],
    note: "預約檢查前先確認可安全接近的位置，毋須自行落井或在暴雨中檢查。",
  },
  {
    slug: "read-cctv-drain-inspection-report",
    title: "點睇CCTV照渠影像與報告？",
    services: ["cctv-drain-inspection"],
    note: "安排檢查時，先確認可檢查範圍及影像交付方式。",
  },
  {
    slug: "restaurant-grease-trap-guide",
    title: "食肆隔油池清理與保養",
    services: ["grease-trap-cleaning", "high-pressure-jetting"],
    note: "隔油池與下游管段分開確認清理範圍，並配合廚房營業安排。",
  },
  {
    slug: "slow-basin-drain-causes-solutions",
    title: "洗手盆去水慢：隔氣與支渠檢查",
    services: ["bathroom-drain-unblocking"],
    note: "浴室洗手盆去水慢，可先傳隔氣、櫃底及其他受影響位置的相片。",
  },
  {
    slug: "tree-roots-in-underground-drain",
    title: "懷疑地下渠有樹根，點樣檢查？",
    services: ["cctv-drain-inspection", "main-drain-manhole"],
    note: "樹根或喉管損壞需按檢查結果判斷，不能單憑去水慢確定。",
  },
  {
    slug: "village-house-manhole-rainy-season",
    title: "村屋沙井與雨季去水安排",
    services: ["main-drain-manhole", "sewage-backflow"],
    note: "先確認沙井位置、車輛通道及負責人，再安排合適處理。",
  },
] as const;

const SERVICE_LABELS: Record<string, string> = {
  "main-drain-manhole": "主渠及沙井處理",
  "sewage-backflow": "污水倒灌處理",
  "cctv-drain-inspection": "CCTV 照渠／照喉檢測",
  "high-pressure-jetting": "高壓洗渠服務",
  "kitchen-sink-unblocking": "廚房鋅盤通渠",
  "grease-trap-cleaning": "食肆隔油池清理",
  "bathroom-drain-unblocking": "浴室與洗手盆通渠",
};
type ResourceLink = { label: string; href: string; note?: string };
export const DISTRICT_READING_REVISED_AT = "2026-10-27";
/** Preparation guidance, not evidence of work completed in these districts. */
export const ARTICLE_DISTRICT_READING: Record<string, ResourceLink[]> = {
  "toilet-clog-emergency-guide": [
    {
      href: "/areas/north-point#north-point-toilet-water",
      label: "北角、炮台山坐廁塞：上門前要記錄甚麼？",
      note: "在北角或炮台山查詢時，可按地區頁整理水位、異物及其他去水位的情況，毋須反覆沖水測試。",
    },
  ],
  "bathroom-hair-clog-prevention": [
    {
      href: "/areas/causeway-bay#tai-hang-drain-arrangements",
      label: "大坑浴室去水慢：相連喉管與施工入口",
      note: "清走表面頭髮後仍積水，大坑住宅可先了解相連去水位及入口安排，再提供現有相片查詢。",
    },
  ],
  "restaurant-grease-trap-guide": [
    {
      href: "/areas/kwun-tong#kwun-tong-kitchen-route",
      label: "觀塘工廈食堂：隔油池清理後仍去水慢",
      note: "隔油池與下游管道是不同處理範圍；觀塘商戶可先列出受影響設備及可停用時段，方便安排檢查。",
    },
  ],
  "village-house-manhole-rainy-season": [
    {
      href: "/areas/tai-po#tai-po-village-rain",
      label: "大埔村屋戶外積水：雨天情況與進場資料",
      note: "大埔村屋查詢可先交代日常與雨天的差別、落車位置及負責人，毋須自行開井拍攝。",
    },
  ],
};
export function getArticleResourceLinks(
  slug: string,
  existing?: ResourceLink[]
) {
  const topic = SERVICE_TOPIC_ARTICLES.find(item => item.slug === slug);
  const links: ResourceLink[] = [
    ...(existing ?? ARTICLE_SERVICE_LINKS[slug] ?? []),
    ...(topic?.services.map((service, index) => ({
      label: SERVICE_LABELS[service],
      href: `/services/${service}`,
      ...(index === 0 ? { note: topic.note } : {}),
    })) ?? []),
    ...(ARTICLE_DISTRICT_READING[slug] ?? []),
  ];
  return links.filter(
    (link, index) => links.findIndex(item => item.href === link.href) === index
  );
}
export function contentConnectionDate(slug: string, date?: string) {
  const revision = ARTICLE_DISTRICT_READING[slug]
    ? DISTRICT_READING_REVISED_AT
    : SERVICE_TOPIC_ARTICLES.some(item => item.slug === slug)
      ? CONTENT_CONNECTIONS_REVISED_AT
      : undefined;
  if (!revision) return date;
  return date && Date.parse(date) > Date.parse(revision) ? date : revision;
}
