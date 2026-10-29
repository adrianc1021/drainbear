import type { BlogPost } from "./blogData";
import { ARTICLE_IMAGES } from "./articleImages";
import { STARTING_PRICE_LINE } from "../../../shared/pricing";

/** Separate customer decisions, not copies of the general company-selection guide. */
const definitions: BlogPost[] = [
  {
    slug: "drain-company-quotation-receipt-warranty",
    title: "通渠公司報價單：加項、收據及保養",
    category: "實用指南",
    date: "2026-10-29",
    updatedAt: "2026-10-29",
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    readMins: 4,
    excerpt:
      "搵通渠公司格價，除咗起步價，仲要問工序、加項、收據及保養。用簡短清單核對報價與完工資料，避免兩份不同範圍的報價直接比較。",
    keywords: [
      "通渠公司報價單",
      "香港通渠公司報價",
      "通渠公司收據",
      "通渠公司保養",
      "通渠加價",
    ],
    coverImage: ARTICLE_IMAGES.quote,
    relatedSlugs: [
      "choosing-professional-drain-company",
      "hong-kong-drain-cleaning-price-guide",
      "drain-service-completion-checklist",
    ],
    whatsappMessage:
      "您好，我想查詢通渠報價及工作範圍。地區：＿＿；受影響位置：＿＿；現場情況：＿＿。我會提供相片，請說明包括的工序、可能另計項目、完工紀錄及收據安排。",
    sections: [
      {
        type: "p",
        text: "比較通渠公司報價，先對齊同一個處理位置、工序與總額，再確認加項由誰批准、完成後有哪些紀錄，以及是否有保養條款。起步價、電話初步估算和現場確認報價，不能當成同一回事。",
      },
      { type: "h2", text: "報價單要寫清楚哪幾項？" },
      {
        type: "list",
        items: [
          "聯絡資料：核對接洽公司、工程位置及現場負責人。",
          "處理範圍：例如一個鋅盤隔氣，還是連同下游支渠；是否包括拆裝、清理及試水。",
          "費用：確認總額、已包括項目，以及哪些情況需要另行報價。",
          "安排：確認進場時段、停用設備與付款方式；需要單據時預先提出。",
        ],
      },
      {
        type: "p",
        text: "用同一組相片和問題描述向各公司查詢。如果一份只包括檢查，另一份包括疏通和拆裝，價錢高低未能直接反映哪份較合適。",
        link: {
          label: "查看通渠收費與工序比較",
          href: "/blog/hong-kong-drain-cleaning-price-guide",
        },
      },
      { type: "h2", text: "到場後要加項，應先確認甚麼？" },
      {
        type: "p",
        text: "請對方說明新發現、原定範圍為何不足、建議增加甚麼工作，以及追加後的總額。涉及管理處、業主或商戶批准的項目，先由有權決定的人確認。保留文字確認，避免只留下「照做」而沒有範圍與金額。",
      },
      { type: "image", image: ARTICLE_IMAGES.handoff },
      { type: "h2", text: "收據與完工紀錄有甚麼分別？" },
      {
        type: "p",
        text: "收據用來記錄付款資料；完工紀錄則交代處理位置、方法及測試。可以先要求列明工程日期、項目和金額，並保留原本報價與付款紀錄。不能單靠收據判斷所有隱藏管段已檢查，亦不能把只有施工片段的影片當成完工測試。",
      },
      {
        type: "p",
        text: "有拆裝或需要後續檢查時，記下相關位置及未處理範圍，方便日後跟進。",
        link: {
          label: "了解通渠完成後點驗收",
          href: "/blog/drain-service-completion-checklist",
        },
      },
      { type: "h2", text: "「不成功不收費」或保養承諾點核對？" },
      {
        type: "p",
        text: "先問清楚成功如何判定、檢查或拆裝是否另計，以及保養期限、適用位置、例外情況和跟進方法。不要把別間公司的宣傳當成今次工程條款。通渠熊現有公開資料沒有承諾全線不成功不收費或固定免費保養期，相關安排需要查詢時確認。",
      },
      { type: "h2", text: "向通渠熊查詢，先傳位置與相片" },
      {
        type: "p",
        text: `通渠熊${STARTING_PRICE_LINE}。提供地區、受影響去水位及現有相片，我們先了解問題，再按現場範圍確認方法與收費；雙方確認後才動工。`,
        link: { label: "通渠熊香港通渠公司服務與查詢", href: "/" },
      },
    ],
    faqs: [
      {
        question: "通渠公司電話報價是否就是最後總額？",
        answer:
          "要先確認對方提供的是初步估算還是已確認的工作報價，以及所包括的範圍。隱藏管段、入口或拆裝需要可能要到場了解；有變更先確認工序及總額。",
      },
      {
        question: "只有付款收據，是否代表有通渠保養？",
        answer:
          "不是。收據記錄付款，保養須另外核對期限、適用位置、例外情況及跟進安排，不能單憑付款自行推定。",
      },
      {
        question: "通渠公司提出加項時，可以先問清楚再決定嗎？",
        answer:
          "可以要求說明新增工作、原因、金額及不做該項工作的影響，再由有權批准的人確認。報價、追加項目及付款紀錄應一併保留。",
      },
    ],
  },
  {
    slug: "hong-kong-drain-company-property-commissioning",
    title: "香港通渠公司｜物業工程報價與交接",
    category: "大廈渠務",
    date: "2026-10-29",
    updatedAt: "2026-10-29",
    authorName: "通渠熊編輯團隊",
    reviewerName: "",
    readMins: 4,
    excerpt:
      "管理處搵香港通渠公司，先界定公共渠範圍、受影響單位及進場安排，再比較工序、報價和交付紀錄。附緊急倒灌與日常保養委託清單。",
    keywords: [
      "香港通渠公司",
      "物業通渠公司",
      "大廈通渠公司",
      "公共渠通渠報價",
      "管理處通渠工程",
    ],
    coverImage: ARTICLE_IMAGES.property,
    relatedSlugs: [
      "building-main-drain-vs-unit-branch-pipe",
      "property-drain-maintenance-plan",
      "drain-company-quotation-receipt-warranty",
    ],
    whatsappMessage:
      "您好，我代表物業查詢通渠工程。地區及物業：＿＿；受影響單位／公共位置：＿＿；發生時間：＿＿；可用入口與進場時段：＿＿；現場協調人：＿＿。我會提供已有紀錄，請確認檢查範圍、報價及交付資料。",
    sections: [
      {
        type: "p",
        text: "物業管理委託通渠公司，重點是界定今次處理哪段渠、誰能安排進場及批准工作，以及完工要交付哪些紀錄。先把各公司的工作範圍對齊，再比較報價；不應單靠機器名稱或起步價決定整項公共渠工程。",
      },
      { type: "h2", text: "緊急倒灌，先整理受影響範圍" },
      {
        type: "list",
        items: [
          "記下哪些樓層、單位或公共位置受影響，以及開始時間；不用住戶反覆放水拍片。",
          "通知可協調共用位置的負責人，確認有沒有可安全接近的檢查入口。",
          "涉及積水或污水的位置先限制接近，避免自行開井或進入渠井。",
          "緊急處理與後續檢查分開確認，說明誰可批准工序及費用。",
        ],
      },
      {
        type: "p",
        text: "出水位置未必就是堵塞位置，亦不能單靠出水樓層判定費用責任。",
        link: {
          label: "查看污水倒灌處理與協調資料",
          href: "/services/sewage-backflow",
        },
      },
      { type: "h2", text: "向不同通渠公司提供同一份工作資料" },
      {
        type: "list",
        items: [
          "位置與用途：公共主渠、沙井、食肆下游管段或單位支渠；未確定時明確提出需先檢查。",
          "已有資料：過往處理方法、再次出問題的時間、可公開相片及管道資料。",
          "進場條件：貨梯、搬運路線、門禁、供水排污及可停用設備時段。",
          "交付要求：處理位置、施工方法、測試觀察；若需要 CCTV 影片或書面報告，另外確認。",
        ],
      },
      { type: "image", image: ARTICLE_IMAGES.shared },
      { type: "h2", text: "疏通、清洗與照渠，報價分開核對" },
      {
        type: "p",
        text: "局部疏通、管段清洗與 CCTV 影像檢查用途不同。問清楚哪項是今次處理所需、哪些是待檢查後才決定；影像檢查是否包含前置疏通，以及影片、截圖或報告如何交付，應在委託前說明。",
      },
      {
        type: "p",
        text: "如已知涉及主渠或沙井，可先提供入口及受影響範圍，安排合適評估。",
        link: {
          label: "了解主渠與沙井服務",
          href: "/services/main-drain-manhole",
        },
      },
      { type: "h2", text: "完工交接，留下可供下一位跟進的紀錄" },
      {
        type: "p",
        text: "記錄已處理位置、採用方法、相關去水位的測試觀察，以及未能接近或尚待檢查的範圍。若涉及住戶配合試水，預先安排現場聯絡人。一次工程與定期保養是不同委託，不把當次測試當作所有管段長期暢通的保證。",
      },
      {
        type: "p",
        text: "需要持續保養時，再按現有紀錄、設施與使用情況討論巡查及清理安排。",
        link: {
          label: "物業通渠保養與紀錄交接",
          href: "/blog/property-drain-maintenance-plan",
        },
      },
      { type: "h2", text: "通渠熊可按哪些資料安排查詢？" },
      {
        type: "p",
        text: "通渠熊提供香港住宅、食肆及物業渠務，接受主渠沙井、高壓洗渠與 CCTV 照渠查詢。提供物業位置、受影響範圍、入口及可進場時段，先確認檢查與報價安排；24 小時接受查詢，實際到場時間另行確認。",
        link: { label: "查看通渠熊香港通渠公司服務", href: "/" },
      },
    ],
    faqs: [
      {
        question: "大廈通渠是否只需要最低報價？",
        answer:
          "應先比較相同處理範圍、工具與拆裝、進場條件、測試及交付紀錄。只列起步價、未確認管段的報價，未必與完整工程報價可直接比較。",
      },
      {
        question: "多個住戶倒灌，要逐戶找通渠公司嗎？",
        answer:
          "先通知管理處或可協調共用位置的負責人，整理受影響樓層及時間，再確認單位支渠與公共渠的檢查安排；不能未檢查就認定各戶是獨立堵塞。",
      },
      {
        question: "CCTV 照渠報價一定包括書面報告嗎？",
        answer:
          "不一定。委託前分開確認檢查管段、是否先疏通、影片或截圖，以及是否需要書面報告，並說明交付安排。",
      },
    ],
  },
];

export const COMPANY_SEARCH_ARTICLES: BlogPost[] = definitions.map(post => ({
  ...post,
  featured: true,
  seo: {
    metaTitle: `${post.title}｜通渠熊`,
    metaDescription: post.excerpt,
    ogImage: post.coverImage,
  },
}));
