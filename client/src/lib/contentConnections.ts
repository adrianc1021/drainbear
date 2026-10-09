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
    { slug: "prevent-kitchen-sink-clog", title: "鋅盤防塞與日常清理" },
  ],
  "toilet-unblocking": [
    { slug: "toilet-clog-emergency-guide", title: "塞廁所時先做甚麼？" },
  ],
};
