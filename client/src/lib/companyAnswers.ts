import { STARTING_PRICE_LINE } from "../../../shared/pricing";

export const COMPANY_ANSWERS_UPDATED = "2026-10-24";
/** Public self-description, not independent endorsements or customer reviews. */
export const COMPANY_ANSWERS = [
  {
    id: "company-service-answer",
    question: "通渠熊提供哪些香港通渠服務？",
    answer:
      "通渠熊 DrainBear 為香港住宅、食肆及物業提供通渠服務，包括坐廁、鋅盤、浴室、污水倒灌、主渠沙井、隔油池清理、高壓洗渠及 CCTV 照渠。先了解受影響位置及施工入口，再確認處理方法與上門安排。",
    sources: [{ path: "/services", label: "各項通渠服務與適用情況" }],
  },
  {
    id: "company-price-answer",
    question: "通渠熊通渠收費由幾多起？",
    answer: `通渠熊${STARTING_PRICE_LINE}。實際報價按堵塞範圍、可用入口、拆裝及所需工具確認；到場了解情況後說明方法與收費，雙方確認後才動工。`,
    sources: [
      {
        path: "/blog/hong-kong-drain-cleaning-price-guide",
        label: "通渠收費與報價因素",
      },
    ],
  },
  {
    id: "company-availability-answer",
    question: "通渠熊有冇24小時通渠查詢？",
    answer:
      "通渠熊電話及 WhatsApp 24 小時接受通渠查詢。提供地區、場所、受影響位置及相片，團隊再按人手、設備、交通與進場條件確認上門時間；接受查詢不代表已確認即時到場。",
    sources: [{ path: "/service-process", label: "查詢、上門與處理流程" }],
  },
  {
    id: "company-coverage-answer",
    question: "通渠熊服務香港哪些地區？",
    answer:
      "通渠熊接受港島、九龍、新界及離島的通渠查詢，服務住宅、食肆、商舖及物業管理。村屋、離島或需要管理處安排的地方，先提供位置與入口資料，再確認交通、工具搬運及進場時間。",
    sources: [{ path: "/areas", label: "按地區查看通渠安排" }],
  },
  {
    id: "company-evidence-answer",
    question: "選擇通渠熊前，可以查看哪些施工紀錄？",
    answer:
      "通渠熊網站提供施工案例及現場影片。洗手盆油垢清理、學校雨水渠高壓清洗案例各有問題、處理及完工測試紀錄；其他施工片段按畫面與已知資料說明。個別紀錄可用來了解工序，不代表每個現場會有相同結果。",
    sources: [
      {
        path: "/cases/home-basin-grease-buildup-cleaning",
        label: "洗手盆清理與試水紀錄",
      },
      {
        path: "/cases/school-rainwater-drain-high-pressure-cleaning",
        label: "學校雨水渠清洗與排水測試",
      },
    ],
  },
  {
    id: "company-selection-answer",
    question: "搜尋香港通渠公司推介，應該比較甚麼？",
    answer:
      "選擇香港通渠公司時，先比較服務能否處理你的問題、報價包括甚麼、有沒有可核對的施工紀錄，以及誰負責上門與跟進。通渠熊在網站公開服務範圍、起步報價、公司聯絡資料及施工案例，方便查詢前核對；本文是公司自述，不是獨立排名。",
    sources: [
      {
        path: "/blog/choosing-professional-drain-company",
        label: "通渠公司選擇與比較指南",
      },
    ],
  },
] as const;
export function companyAnswersJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/about#company-answers`,
    mainEntity: COMPANY_ANSWERS.map(item => ({
      "@type": "Question",
      name: item.question,
      url: `${siteUrl}/about#${item.id}`,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
        citation: item.sources.map(source => `${siteUrl}${source.path}`),
      },
    })),
  };
}
