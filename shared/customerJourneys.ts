/** Public intake guidance. These are preparation prompts, not submission forms. */
export const CUSTOMER_JOURNEYS = [
  {
    slug: "residential",
    name: "住宅住戶",
    shortName: "住宅通渠",
    title: "家居塞渠，先睇受影響位置。",
    description:
      "坐廁塞、鋅盤去水慢，定係浴室積水？說明位置同現場情況，先了解合適的處理方法。",
    serviceSlugs: [
      "toilet-unblocking",
      "kitchen-sink-unblocking",
      "bathroom-drain-unblocking",
      "sewage-backflow",
    ],
    checklist: [
      "所在區域及住宅類型",
      "堵塞位置、何時開始及有沒有倒灌",
      "安全情況下拍攝的相片或短片",
      "是否用過通渠水，或曾自行拆喉",
    ],
    preparation:
      "有倒灌先停止使用相關水源，不要繼續沖廁或混合通渠水。現場相片可先拍受影響位置，毋須在公開頁面留下完整地址。",
    message:
      "你好，我想查詢住宅通渠。地區：\n受影響位置及情況：\n是否倒灌或用過通渠水：\n我可以補充現場相片。",
    faqs: [
      {
        question: "家居通渠前要提供甚麼資料？",
        answer:
          "先說明地區、堵塞位置、發生時間及有沒有倒灌，再提供相片或短片。如用過通渠水或自行拆喉，請一併告知。",
      },
      {
        question: "多個去水位同時倒灌，應怎樣處理？",
        answer:
          "先停止使用相關水源，避免接觸污水或加入化學清潔劑。說明其他去水位及鄰近單位是否也受影響，再安排檢查。",
      },
    ],
  },
  {
    slug: "restaurants",
    name: "食肆及商舖",
    shortName: "食肆及商舖",
    title: "食肆去水唔順，先了解現場同營業安排。",
    description:
      "廚房去水、隔油池清理或反覆油垢淤塞，先說明受影響位置，再確認清理及保養安排。",
    serviceSlugs: [
      "grease-trap-cleaning",
      "kitchen-sink-unblocking",
      "high-pressure-jetting",
    ],
    checklist: [
      "所在區域、店舖類型及營業時段",
      "隔油池或去水位置、最近清理紀錄",
      "現場相片、設備入口及可進場時段",
      "有沒有滿瀉、倒灌或影響其他去水位",
    ],
    preparation:
      "說明營業時段及設備位置，方便團隊了解進場條件。定期保養的範圍與頻率，要按使用量及實際渠況評估。",
    message:
      "你好，我想查詢食肆／商舖渠務。地區及店舖類型：\n去水或隔油池情況：\n營業及可進場時段：\n我可以補充現場相片。",
    faqs: [
      {
        question: "食肆清理隔油池前，要準備甚麼？",
        answer:
          "請提供地區、隔油池位置及大概容量、相片、最近清理紀錄，以及營業和可進場時段。團隊再按入口、排放及現場條件確認安排。",
      },
      {
        question: "食肆可以查詢定期渠務保養嗎？",
        answer:
          "可以先說明店舖使用量、去水情況及過往淤塞紀錄。清理範圍、頻率與施工時段需按實際現場條件確認。",
      },
    ],
  },
  {
    slug: "property-management",
    name: "業主及物業管理",
    shortName: "物業渠務",
    title: "主渠、沙井出問題，先確認影響範圍。",
    description:
      "多個單位倒灌、主渠反覆淤塞，或需要檢查管內情況？整理受影響位置與進場資料，方便協調工程。",
    serviceSlugs: [
      "main-drain-manhole",
      "sewage-backflow",
      "cctv-drain-inspection",
      "high-pressure-jetting",
    ],
    checklist: [
      "所在區域及樓宇／物業類型",
      "受影響樓層、單位或公共去水範圍",
      "沙井、檢查口及設備可到達的位置",
      "現場聯絡人、進場授權及需要的工程紀錄",
    ],
    preparation:
      "先與管理處確認公共渠管及進場安排。有既有圖則或檢測紀錄可一併提供；勘察及報告範圍由團隊按工程需要確認。",
    message:
      "你好，我想查詢物業渠務。地區及物業類型：\n受影響樓層或範圍：\n檢查口及進場安排：\n需要的工程紀錄：",
    faqs: [
      {
        question: "物業主渠工程查詢，要提供甚麼資料？",
        answer:
          "先提供樓宇位置、受影響樓層或單位、沙井及檢查口資料，以及管理聯絡和進場方式。有圖則或過往檢測紀錄可一併提供。",
      },
      {
        question: "反覆淤塞一定要做 CCTV 照喉嗎？",
        answer:
          "不一定。若原因或管道狀況不明，影像檢查可協助判斷；是否適合仍取決於管徑、入口、積水及現場條件。",
      },
    ],
  },
] as const;

export type CustomerSlug = (typeof CUSTOMER_JOURNEYS)[number]["slug"];
export function getCustomerJourney(slug: string) {
  return CUSTOMER_JOURNEYS.find(customer => customer.slug === slug);
}
