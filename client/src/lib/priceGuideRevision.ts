import { STARTING_PRICE_LINE } from "../../../shared/pricing";
import type { BlogPost } from "./blogData";

/** Website editorial revision: replaces the old market-price/fee-policy draft. */
export const PRICE_GUIDE_REVISION: BlogPost = {
  slug: "hong-kong-drain-cleaning-price-guide",
  title: "通渠價錢幾多？HK$300 起，局部疏通同高壓洗渠點格價？",
  category: "通渠迷思",
  date: "2026-08-10",
  updatedAt: "2026-11-25",
  readMins: 4,
  authorName: "通渠熊編輯團隊",
  reviewerName: "",
  excerpt:
    `通渠熊${STARTING_PRICE_LINE}。比較兩份報價，先睇包邊個去水位、需唔需要拆裝；如果要高壓洗渠，就要問清洗邊段喉、點樣試水同幾時確認總額。`,
  keywords: ["通渠價錢", "通渠收費", "通渠收費lihkg", "通渠費用", "通渠報價"],
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
      text: `通渠熊${STARTING_PRICE_LINE}。單靠起步價，未知道今次埋單幾多。師傅到場睇過堵塞位置同喉管入口，會交代要做嘅工序同總額，你確認後先動工。`,
    },
    { type: "h2", text: "通渠價錢點問？先確認總額包括甚麼" },
    {
      type: "p",
      text: "假設鋅盤去水慢，一份報價只寫「通鋅盤」，另一份寫明「拆洗隔氣、裝回後放水試漏」。先問第一間包唔包拆裝同試水，再比較總額。如果拆開先發現塞喺後面條支喉，就要再問清楚處理嗰段喉要幾錢。",
    },
    {
      type: "list",
      items: [
        "只塞一個洗手盆：傳盆口與櫃底相片，先了解隔氣及支渠入口。",
        "坐廁水位升高：停沖水，交代有沒有異物，問清楚是否涉及拆裝。",
        "多個位置倒灌：說明受影響設備及共用渠入口，先界定檢查範圍。",
      ],
    },
    { type: "h2", text: "搜尋「通渠收費 LIHKG」，討論價錢可以點比較？" },
    {
      type: "p",
      text: "LIHKG 或其他討論區的通渠收費分享，要連同發文日期、場所、堵塞位置、使用工具與實際施工範圍一起看。多年前的住宅鋅盤疏通，未必能套用到今天的公共主渠清洗；只有總額、沒有工序資料的留言，也難以直接比較。這篇指南沒有引用或驗證個別討論串，亦不代表任何平台推介通渠熊。",
    },
    {
      type: "list",
      items: [
        "先看日期：報價是否近期，還是多年以前的經驗。",
        "核對同類工程：去水位、管道入口、是否拆裝及使用工具是否相近。",
        "看清包括甚麼：有沒有檢查、疏通、清理、試水或其他工序的說明。",
        "向服務提供者確認：把自己的地區與現場資料交代清楚，取得適用於這次工程的報價。",
      ],
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
      text: "要睇塞喺邊度。局部疏通着重打通堵塞位置，高壓洗渠可以清理一段喉內嘅油垢或泥沙。收到高壓洗渠報價，可以直接問：「由邊個檢查口入？洗到邊個位置？清出嚟嘅泥沙邊個處理？完工喺邊度放水驗收？」如果兩份報價所包嘅管段唔同，就要先對清範圍。",
      link: { label: "高壓洗渠報價及現場要求", href: "/services/high-pressure-jetting" },
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
    { label: "返回通渠熊首頁，了解香港通渠服務", href: "/" },
  ],
  relatedSlugs: [
    "choosing-professional-drain-company",
    "drain-company-reviews-red-flags",
    "drain-service-completion-checklist",
  ],
  faqs: [
    {
      question: "通渠價錢可以按一張相片確定嗎？",
      answer:
        "相片可以幫助初步了解，未必看得到隱藏管段、異物及拆裝需要。通渠熊 HK$300 起，先傳地區與相片問價，總額按現場工序確認，雙方確認後動工。",
    },
    {
      question: "通渠收費 LIHKG 的討論，可以直接當報價參考嗎？",
      answer:
        "只可作了解其他人的經驗，先核對日期、堵塞位置、工具、是否拆裝及費用包括的工序。不同現場不能只比較總額，個別報價仍需由服務提供者按你的資料確認。",
    },
    {
      question: "查詢通渠報價，最先要提供甚麼？",
      answer:
        "先提供地區、受影響去水位、問題開始時間及安全拍攝的相片或短片；說明有沒有倒灌、其他位置異常或使用過通渠水。",
    },
  ],
};
