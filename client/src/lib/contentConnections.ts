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
