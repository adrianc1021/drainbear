import type { BlogPostView } from "./blogRepository";

export const QUERY_INTENT_UPDATED = "2026-10-26";
export const QUERY_INTENT_REVISIONS: Record<
  string,
  {
    title: string;
    replaceScenario?: boolean;
    description: string;
    heading: string;
    answer: string;
    href: string;
    label: string;
    faqs: { question: string; answer: string }[];
  }
> = {
  "cctv-drain-inspection-hong-kong-guide": {
    title: "CCTV 照渠指南｜適用情況、流程及報告內容",
    description:
      "照渠 CCTV 點收費、包唔包疏通及報告？了解鏡頭檢查用途、入口限制、影片交付及報價因素，傳現場相片查詢合適檢測安排。",
    heading: "照渠收費，查詢前要講清楚甚麼？",
    answer:
      "先提供地區、受影響去水位、可用檢查口及過往通渠紀錄，再確認檢查管段、是否要先疏通，以及需要影片、截圖還是書面報告。入口、管段長度與交付內容會影響報價；CCTV 照渠是影像檢查，不等於已包括疏通。",
    href: "/services/cctv-drain-inspection",
    label: "查看 CCTV 照渠服務，查詢檢查及影像交付",
    faqs: [
      {
        question: "照渠報價是否包括通渠及書面報告？",
        answer:
          "不一定。查詢時分別確認影像檢查、前置疏通或拆裝，以及影片、截圖或書面報告的交付安排。所需工序和資料不同，報價範圍也不同。",
      },
    ],
  },
  "building-main-drain-vs-unit-branch-pipe": {
    title: "污水渠塞邊個負責？大廈主渠、單位支渠及處理流程｜通渠熊",
    description:
      "污水渠塞責任點分？先確認堵塞管段、服務範圍及大廈公契等文件；多戶倒灌先通知管理處。了解報修、檢查與通渠報價要保留哪些紀錄。",
    replaceScenario: true,
    heading: "污水渠塞，住戶定管理處負責？",
    answer:
      "不能只憑污水從哪個單位湧出判定責任。先確認堵塞管段屬單位專用還是共用部分，再核對大廈公契、租約及維修紀錄。多戶同時倒灌，先通知管理處協調檢查；委託施工前講清楚處理範圍、報價與付款安排，費用責任有爭議時另按文件及專業意見處理。",
    href: "/services/main-drain-manhole",
    label: "了解主渠及沙井檢查，準備進場與報價資料",
    faqs: [
      {
        question: "樓下單位倒灌，是否一定由樓下住戶支付通渠費？",
        answer:
          "不是。出水位置不等於堵塞位置或責任界線。需要確認管段是否共用、檢查結果及相關物業文件；先與管理處、業主及施工方確認工作與付款安排。",
      },
    ],
  },
  "high-pressure-drain-cleaning-vs-spring-machine": {
    title: "高壓通渠定彈弓機？方法、收費因素與適用範圍｜通渠熊",
    description:
      "高壓通渠與彈弓機點揀？比較管段清洗、局部疏通、入口與喉管限制，了解高壓通渠收費要提供哪些資料，再傳相查詢合適方法。",
    heading: "高壓通渠定彈弓機，點樣揀？",
    answer:
      "局部淤塞可按入口與喉管條件評估機械疏通；較長管段積垢可評估高壓清洗。先看堵塞範圍、管道狀況及排污去向，唔係水壓越大越好。傳受影響位置及檢查口相片，先了解合適方法與報價。",
    href: "/services/high-pressure-jetting",
    label: "高壓通渠服務與收費查詢",
    faqs: [
      {
        question: "高壓通渠收費點計？",
        answer:
          "通渠熊全線通渠服務 HK$300 起。高壓工程需按管段長度、管徑、積垢、供水排污及工具入口確認工序與總額；傳相可先了解安排，不能把起步價當成每宗工程總價。",
      },
      {
        question: "通渠彈弓同高壓水槍，係咪要兩樣都用？",
        answer:
          "不一定。兩者用途及入口要求不同，先按堵塞位置、管道狀況和處理範圍選擇。反覆塞渠時亦要了解接駁或結構問題，不能只靠更大力度處理。",
      },
    ],
  },
  "why-not-drain-cleaner": {
    title: "通渠水、通渠神器有用嗎？使用限制與塞渠處理｜通渠熊",
    description:
      "通渠水、通渠神器、梳打粉點揀？先分清堵塞及工具限制；用過藥劑後不要混加清潔劑或泵壓。保留產品相片，查詢師傅檢查及疏通安排。",
    heading: "買通渠工具之前，先睇係邊種堵塞",
    answer:
      "「通渠神器」並非一種固定工具。隔網表面毛髮、硬物卡住、支渠積垢，需要的處理不同；買到工具不代表適合現有喉管。完全塞住、倒灌或已倒通渠水，先停用，傳位置與產品相片查詢，勿再混加藥劑。",
    href: "/",
    label: "了解通渠熊服務，傳相查詢處理方法",
    faqs: [
      {
        question: "通渠水邊隻好？可以直接跟網上推介買嗎？",
        answer:
          "不能單靠品牌或推介判斷。產品成分、標示適用設備與現場堵塞不同；未確認喉管或已有倒灌時，先停用並查詢，不要反覆加藥或混用清潔劑。",
      },
      {
        question: "梳打粉通渠，可以代替師傅疏通嗎？",
        answer:
          "不能保證。不能憑冒泡判定隔氣或深處支渠已暢通，也未必能處理硬物及結構問題。已使用通渠水時，不要再加入梳打粉、白醋或其他清潔劑。",
      },
      {
        question: "通渠神器、通渠泵或彈弓可否用喺任何去水口？",
        answer:
          "不可以一概而論。工具尺寸、設備結構及喉管狀況都要配合；有藥劑殘留、硬物、漏水或倒灌時，不要自行加壓或強行深入。先傳工具及現場相片了解限制。",
      },
    ],
  },
};
export function queryIntentDate(slug: string, date?: string) {
  return QUERY_INTENT_REVISIONS[slug] &&
    (!date || Date.parse(date) < Date.parse(QUERY_INTENT_UPDATED))
    ? QUERY_INTENT_UPDATED
    : date;
}
export function applyQueryIntentRevision(post: BlogPostView): BlogPostView {
  const revision = QUERY_INTENT_REVISIONS[post.slug];
  if (!revision) return post;
  const existing = post.faqs ?? [];
  return {
    ...post,
    title: revision.title,
    excerpt: revision.description,
    updatedAt: queryIntentDate(post.slug, post.updatedAt),
    reviewerName: "",
    inquiryScenario: revision.replaceScenario
      ? undefined
      : post.inquiryScenario,
    seo: {
      ...post.seo,
      metaTitle: revision.title,
      metaDescription: revision.description,
    },
    faqs: [
      ...existing,
      ...revision.faqs.filter(
        f => !existing.some(e => e.question === f.question)
      ),
    ],
  };
}
