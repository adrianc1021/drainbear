import type { BlogPost } from "./blogData";

/** Website editorial revision: replaces the old market-price/fee-policy draft. */
export const PRICE_GUIDE_REVISION: BlogPost = {
  slug: "hong-kong-drain-cleaning-price-guide",
  title: "通渠價錢點計？先了解堵塞位置、工具及施工範圍",
  category: "通渠迷思",
  date: "2026-08-10",
  updatedAt: "2026-10-09",
  readMins: 4,
  authorName: "通渠熊編輯團隊",
  reviewerName: "",
  excerpt:
    "通渠費用要按堵塞位置、管道入口、工具及處理範圍評估。了解坐廁、鋅盤與主渠的差別，再提供現場資料查詢個別報價。",
  keywords: ["通渠價錢", "通渠費用", "通渠價格", "通渠報價"],
  coverImage: {
    url: "/images/blog/choosing-professional-drain-company.webp",
    srcSet:
      "/images/blog/choosing-professional-drain-company-640.webp 640w, /images/blog/choosing-professional-drain-company.webp 1200w",
    alt: "AI 紙藝插圖：通渠熊師傅與住戶對照施工資料清單",
    width: 1200,
    height: 676,
  },
  sections: [
    {
      type: "p",
      text: "通渠沒有適用所有現場的統一價錢。同樣是去水慢，堵塞在鋅盤隔氣、坐廁彎位，還是共用主渠，需要的入口、工具和處理範圍都可能不同。先了解問題在哪裡，再查詢個別報價，會比單看一個起步數字清楚。",
    },
    { type: "h2", text: "哪些現場資料會影響報價？" },
    {
      type: "list",
      items: [
        "堵塞範圍：只有一個去水位，還是多個位置或單位同時異常。",
        "可用入口：喉口能否接近，有沒有固定設備、狹窄櫃底或需要協調的共用位置。",
        "處理目的：局部疏通、清理管段積垢，還是檢查反覆出現的問題。",
        "施工條件：工具搬運、門禁、可配合時段及現場保護。",
      ],
    },
    { type: "h2", text: "坐廁、鋅盤及主渠，評估重點不同" },
    {
      type: "list",
      items: [
        "坐廁：是否有硬物掉入、水位有沒有升高，以及現有入口能否處理。是否拆卸，要經檢查確認。",
        "鋅盤：櫃底接駁、隔氣和其他相連設備；先拍全景，不用自行拆喉。",
        "浴室：企缸、浴缸與地台去水是否同時變慢，清走表面頭髮後有沒有改善。",
        "主渠及沙井：受影響單位、可用入口與配合試水的位置，由管理處或現場負責人協調。",
      ],
    },
    { type: "h2", text: "用機器，是否一定比其他方法合適？" },
    {
      type: "p",
      text: "不一定。機械疏通、高壓洗渠及 CCTV 照喉各有用途。局部堵塞未必需要高壓清洗，影像檢查也不能代替疏通。選工具要對應現場問題，不能只憑機器名稱決定施工範圍或費用。",
    },
    { type: "h2", text: "相片可以先了解甚麼？" },
    {
      type: "p",
      text: "相片有助了解位置、積水和進場條件；隱藏管段與堵塞物仍可能需要檢查。查詢時先提供地區、受影響位置及安全拍攝的畫面，並說明有沒有用過通渠水。已經倒灌或水位很高，不用再開水測試來拍片。",
    },
    { type: "h2", text: "確認處理後，保留哪些交代？" },
    {
      type: "p",
      text: "記下這次處理的去水位、採用方法和試水觀察。若仍有未檢查管段或需後續跟進，亦請團隊交代。一次水位回落不代表所有管道已檢查；施工片段與完工測試要分開看。",
    },
    {
      type: "tip",
      text: "準備查詢不用寫長篇：地區、塞渠位置、何時開始、是否倒灌，再附相片便可開始了解。完整資料清單見通渠查詢指南。",
    },
  ],
  resourceLinks: [
    { label: "準備相片與查詢資料", href: "/guide" },
    { label: "按堵塞位置找服務", href: "/services" },
    { label: "上門與處理流程", href: "/service-process" },
  ],
  relatedSlugs: [
    "whatsapp-drain-quote-checklist",
    "drain-tool-selection-guide",
    "drain-service-completion-checklist",
  ],
  faqs: [
    {
      question: "通渠價錢可以按一張相片確定嗎？",
      answer:
        "相片可以幫助初步了解，但隱藏管段、堵塞原因及入口條件未必能確認。報價須配合實際處理範圍與現場評估，沒有適用所有工程的統一價格。",
    },
    {
      question: "同樣坐廁塞住，通渠費用為甚麼可能不同？",
      answer:
        "硬物位置、坐廁結構、可用入口及是否需要拆裝都會影響工序。先交代物件、水位和其他去水位情況，再由團隊評估。",
    },
    {
      question: "查詢通渠報價，最先要提供甚麼？",
      answer:
        "先提供地區、受影響去水位、問題開始時間及安全拍攝的相片或短片；說明有沒有倒灌、其他位置異常或使用過通渠水。",
    },
  ],
};
