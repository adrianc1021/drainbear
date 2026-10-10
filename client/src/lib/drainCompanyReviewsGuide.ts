import type { BlogPost } from "./blogData";

export const DRAIN_COMPANY_REVIEWS_GUIDE: BlogPost = {
  slug: "drain-company-reviews-red-flags",
  title: "通渠公司黑店點避？報價、口碑與施工紀錄核對清單",
  category: "實用指南",
  date: "2026-10-11",
  readMins: 4,
  authorName: "通渠熊編輯團隊",
  reviewerName: "",
  excerpt:
    "擔心通渠報價含糊、臨場加項或口碑難核實？由聯絡資料、施工範圍到完工試水，整理選公司前值得問清楚的事項。",
  keywords: ["通渠公司黑店", "通渠公司口碑", "通渠報價", "通渠公司比較"],
  serviceSlugs: [
    "toilet-unblocking",
    "kitchen-sink-unblocking",
    "main-drain-manhole",
  ],
  relatedSlugs: [
    "choosing-professional-drain-company",
    "hong-kong-drain-cleaning-price-guide",
    "drain-service-completion-checklist",
  ],
  coverImage: {
    url: "/images/blog/choosing-professional-drain-company.webp",
    srcSet:
      "/images/blog/choosing-professional-drain-company-640.webp 640w, /images/blog/choosing-professional-drain-company.webp 1200w",
    alt: "AI 紙藝插圖：通渠熊師傅與住戶核對施工資料清單",
    width: 1200,
    height: 676,
  },
  sections: [
    {
      type: "p",
      text: "搜尋『通渠公司黑店』，通常是擔心收費不清楚、施工說法與實際安排有出入。搜尋結果或匿名留言本身不足以判定某家公司有問題；較有用的做法，是在確認工程前核對對方身份、報價包括甚麼，以及完成後如何試水。",
    },
    { type: "h2", text: "確認前，先核對四項資料" },
    {
      type: "list",
      ordered: true,
      items: [
        "聯絡身份：確認公司或師傅名稱、電話，以及到場與收款的聯絡人是否一致；如不同，請對方說明。",
        "處理範圍：記下哪個去水位、預計使用的方法，以及尚未確認的管段。",
        "報價內容：問清楚檢查、疏通、拆裝或其他項目各包括甚麼，有沒有仍需到場確認的部分。",
        "改動安排：如現場發現需要另一種工具或增加工序，要求先說明原因、範圍與費用，再決定是否同意。",
      ],
    },
    { type: "h2", text: "哪些情況值得暫停，先問清楚？" },
    {
      type: "p",
      text: "對方只重複一個起步數字，卻不說明適用範圍；未看現場就保證任何問題都能一次解決；或在你未確認新增工序前，催促付款。遇到這些情況，先要求清楚交代並保留文字紀錄。這些是需要核對的訊號，不能單憑其中一項就公開指稱對方是『黑店』。",
    },
    { type: "h2", text: "網上好評或投訴，可以點核對？" },
    {
      type: "list",
      items: [
        "看時間與工程背景：近期住宅鋅盤的分享，未必適用於另一幢大廈的共用主渠。",
        "看具體過程：有沒有交代問題、工具、報價範圍與完工測試，而不只是『好快』或『好貴』。",
        "分清來源：當事人的紀錄、轉述、廣告與匿名留言，提供的證據不同。不要把未核實內容當成公司事實。",
        "留意回應：對爭議是否有可核對的說明；單看留言數量或星級，仍未能確認整項工程的情況。",
      ],
    },
    { type: "h2", text: "施工完成，留下可核對的結果" },
    {
      type: "p",
      text: "請對方交代處理位置、採用方法及試水觀察，並說明有沒有未檢查的管段。保留雙方確認的訊息、報價和收據；拍攝前先取得現場相關人士同意，避免公開住址或其他個人資料。若出現爭議，先整理時間、確認內容及實際結果，再向服務提供者查詢。",
    },
    {
      type: "tip",
      text: "可以直接問：『這次報價包括哪個位置和工序？如果要改方法，會怎樣跟我確認？完成後會在哪裡試水？』讓答案留下紀錄，比只問『有冇保證』更容易核對。",
    },
  ],
  resourceLinks: [
    {
      label: "比較通渠公司與師傅",
      href: "/blog/choosing-professional-drain-company",
    },
    {
      label: "了解通渠收費與報價範圍",
      href: "/blog/hong-kong-drain-cleaning-price-guide",
    },
    { label: "通渠熊公司資料與聯絡方式", href: "/about#company-facts" },
    {
      label: "附處理及測試說明的工程案例",
      href: "/cases/home-basin-grease-buildup-cleaning",
    },
    { label: "返回通渠熊首頁，了解香港通渠服務", href: "/" },
  ],
  faqs: [
    {
      question: "搜尋到通渠公司黑店的留言，就代表投訴屬實嗎？",
      answer:
        "不能只憑搜尋字眼或匿名留言判定。要核對是否由當事人提供、工程日期、雙方確認的範圍及實際紀錄；沒有可核實資料時，不宜轉述為公司事實。",
    },
    {
      question: "通渠師傅到場後提出加項，我應該問甚麼？",
      answer:
        "先問新增工序的原因、處理位置、工具及費用，並核對與原先確認範圍的差別。資料未清楚前，先暫停確認；保留雙方的文字紀錄。",
    },
    {
      question: "如何核對通渠公司的施工紀錄？",
      answer:
        "看紀錄有沒有說明原來問題、實際處理位置及完工試水。工具操作片段可以展示工序，但未包含試水時，不能據此推定所有管道都已恢復正常。",
    },
  ],
};
