import {
  STARTING_PRICE_ANSWER,
  STARTING_PRICE_LINE,
} from "../../../shared/pricing";
import type { BlogPost } from "./blogData";

/** Existing selection guide: one destination for recommendation/comparison intent. */
export const DRAIN_COMPANY_SELECTION_GUIDE: BlogPost = {
  slug: "choosing-professional-drain-company",
  title: "香港通渠公司推介：通渠邊間好？收費與案例比較",
  category: "實用指南",
  date: "2026-10-09",
  updatedAt: "2026-10-19",
  readMins: 4,
  authorName: "通渠熊編輯團隊",
  reviewerName: "",
  featured: true,
  excerpt:
    "香港通渠公司推介點揀？比較處理範圍、通渠收費、施工紀錄及上門安排。通渠熊全線通渠服務 HK$300 起，提供住宅、食肆及物業渠務，附真實案例，立即 WhatsApp 傳相查詢。",
  keywords: [
    "香港通渠公司推介",
    "通渠公司推介",
    "通渠邊間好",
    "香港通渠公司",
    "通渠師傅介紹",
    "通渠師傅推介",
  ],
  serviceSlugs: [
    "toilet-unblocking",
    "kitchen-sink-unblocking",
    "cctv-drain-inspection",
    "main-drain-manhole",
    "high-pressure-jetting",
  ],
  relatedSlugs: [
    "hong-kong-drain-cleaning-price-guide",
    "drain-company-reviews-red-flags",
    "drain-service-completion-checklist",
  ],
  whatsappMessage:
    "您好，我睇過香港通渠公司推介指南，想查詢通渠熊服務。地區：＿＿；場所（住宅／食肆／物業）：＿＿；堵塞位置：＿＿；情況（去水慢／積水／倒灌）：＿＿。我會提供現場相片或已有短片，請提供報價及可安排時間。",
  sections: [
    {
      type: "p",
      text: "搵香港通渠公司，先比較對方能否處理你的堵塞問題、報價包括甚麼，以及有沒有附完工測試的施工紀錄。以下按住宅、食肆及物業需要列出選擇重點，方便你揀服務、問報價及安排師傅。",
    },
    {
      type: "p",
      text: `想直接查詢？通渠熊${STARTING_PRICE_LINE}，坐廁、鋅盤、浴室及主渠問題都可傳相了解處理安排。`,
      link: { label: "查看通渠熊香港通渠服務", href: "/" },
    },
    { type: "h2", text: "揀通渠公司，先比較這五項" },
    {
      type: "list",
      ordered: true,
      items: [
        "服務是否對應問題：單一坐廁淤塞、食肆油垢及共用主渠，需要了解的範圍不同。",
        "報價包括甚麼：確認處理位置、工具、拆裝及試水，有改動先交代工序與費用。",
        "有沒有真實施工紀錄：看問題、處理及測試，不只看機器相片或一句好評。",
        "上門時間能否確認：交代地區與進場條件，取得具體安排；24 小時接受查詢不等於已確認到場。",
        "由誰跟進工程：核對公司、到場師傅、收款及後續聯絡資料，保留確認紀錄。",
      ],
    },
    { type: "h2", text: "揀老字號通渠公司，還要核對甚麼？" },
    {
      type: "p",
      text: "年資可以作參考，亦要看今次由誰接洽、施工和跟進。核對公司名稱、電話及官方商家資料是否一致，再看與自己問題相近的工程紀錄：發現甚麼、用了甚麼方法、完成後如何試水。介紹寫得再長，都應該對應得到具體資料。",
      link: { label: "核對通渠熊公司及聯絡資料", href: "/about#company-facts" },
    },
    { type: "h2", text: "通渠熊適合處理哪些問題？" },
    {
      type: "list",
      items: [
        "住宅：坐廁水位升高、鋅盤去水慢、浴室積水及污水倒灌。先交代哪個位置受影響，其他去水位是否正常。",
        "食肆及商舖：廚房油垢、隔油池清理及排水保養，查詢時提供設備位置與可配合施工時段。",
        "業主及物業管理：主渠、沙井、高壓洗渠及 CCTV 照渠，先說明受影響單位、入口及現場協調安排。",
      ],
    },
    {
      type: "p",
      text: "未確定需要疏通、清洗還是檢查，可按受影響位置開始。",
      link: { label: "查看各項通渠服務", href: "/services" },
    },
    { type: "h2", text: "通渠收費要比較哪些項目？" },
    {
      type: "p",
      text: "比較報價時，將堵塞範圍、可用入口、是否拆裝及所需工具放在一起看。確認這次處理哪個位置、包括哪些工序，以及完成後在哪裡試水，才容易比較不同報價。",
      link: {
        label: "了解通渠收費與報價因素",
        href: "/blog/hong-kong-drain-cleaning-price-guide",
      },
    },
    { type: "h2", text: "兩個有完工測試的真實通渠案例" },
    {
      type: "p",
      text: "家居洗手盆長期去水慢：拆開去水喉及隔氣後，發現油污、皂垢及黏稠積聚物。清理並重新接駁後進行連續放水測試，紀錄顯示去水恢復正常，接口沒有明顯滲漏。",
      link: {
        label: "查看洗手盆拆喉清理紀錄及原相片",
        href: "/cases/home-basin-grease-buildup-cleaning",
      },
    },
    {
      type: "p",
      text: "學校戶外雨水渠積水：從可操作管口進行高壓清洗，沖散及帶走泥沙和積聚物，完成後以排水測試觀察去水速度及渠口水位。這兩項是個別工程紀錄，可用來了解處理與測試的交代。",
      link: {
        label: "查看學校雨水渠高壓清洗紀錄",
        href: "/cases/school-rainwater-drain-high-pressure-cleaning",
      },
    },
    { type: "h2", text: "朋友介紹或網上推介，點樣核對？" },
    {
      type: "p",
      text: "問介紹人當時處理甚麼問題、有沒有交代報價和完工試水，再比較是否與你的場所相近。收到個別師傅姓名或電話，亦要確認所屬公司及誰會到場。網上評價值得看具體工程經過，而不只看星級或留言數量。",
    },
    { type: "h2", text: "傳相查詢，一次過提供這些資料" },
    {
      type: "list",
      items: [
        "所在地區、場所，以及可配合的進場時間。",
        "堵塞位置、何時開始，有沒有倒灌或其他去水位異常。",
        "安全拍攝的全景及受影響位置相片；如已用過通渠水，亦一併告知。",
      ],
    },
  ],
  resourceLinks: [
    { label: "搜尋通渠爭議公開資料庫", href: "/consumer-alerts" },
    { label: "通渠熊公司及聯絡資料", href: "/about#company-facts" },
    { label: "上門與處理流程", href: "/service-process" },
    {
      label: "通渠黑店相關報道與防騙清單",
      href: "/blog/drain-company-reviews-red-flags",
    },
  ],
  faqs: [
    {
      question: "香港通渠公司推介應該點比較？",
      answer:
        "先比較能否處理你的場所與堵塞問題、報價所包括的工序、真實施工及試水紀錄，再確認上門時間與聯絡身份。朋友或網上推介最好附具體工程背景，方便與自己的需要比較。",
    },
    {
      question: "通渠熊的通渠收費由幾多起？",
      answer: STARTING_PRICE_ANSWER,
    },
    {
      question: "點樣查詢通渠熊上門通渠？",
      answer:
        "透過 WhatsApp 提供地區、場所、堵塞位置及現場相片，或致電網站所列查詢電話。通渠熊 24 小時接受查詢，上門時間按地區、人手、設備及進場條件確認。",
    },
  ],
};
