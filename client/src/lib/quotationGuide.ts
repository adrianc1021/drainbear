import { STARTING_PRICE_LABEL } from "../../../shared/pricing";

export const QUOTATION_GUIDE_UPDATED = "2026-11-03";
export const QUOTATION_GUIDE_TITLE =
  "通渠收費及報價 HK$300 起｜工序、拆裝與費用確認｜通渠熊";
export const QUOTATION_GUIDE_DESCRIPTION =
  "通渠幾多錢？通渠熊 HK$300 起，了解坐廁、鋅盤、浴室、主渠及照渠報價要確認哪些工序。先問清檢查、拆裝、設備及追加費用，現場確認總收費後才動工。";

/** Confirmed starting quote only; no unverified package inclusions or price ranges. */
export const QUOTATION_ANSWERS = [
  {
    id: "quote-context",
    question: "通渠幾錢起？起步價是否就是最終收費？",
    answer: `通渠熊全線通渠服務 ${STARTING_PRICE_LABEL}。起步價不是每宗工程的固定總價，也不代表包括所有檢查、拆裝或設備。先提供地區、受影響位置及相片；師傅現場檢查後說明工序與總收費，雙方確認才動工。`,
  },
  {
    id: "quote-photos",
    question: "傳相片得到的初步估價，與現場報價有甚麼分別？",
    answer:
      "相片可協助了解受影響位置、可見接駁及進場條件，但未必看得到隱藏管段或堵塞物。初步估價供了解安排，最終處理範圍、拆裝需要與總收費仍在現場檢查後、動工前確認。",
  },
  {
    id: "quote-tools",
    question: "機械通渠、高壓洗渠及 CCTV 照渠是否同一項收費？",
    answer:
      "三者工作目的不同，不能假設一次報價全部包括。機械疏通處理合適的局部堵塞；高壓清洗按管段、入口及排污條件評估；CCTV 是影像檢查，並不等於疏通。報價時應逐項確認所需方法與交付內容。",
  },
  {
    id: "quote-inclusions",
    question: "上門檢查、拆裝及未能疏通，會怎樣收費？",
    answer:
      "預約前先確認上門及檢查是否收費；動工前再問清疏通、拆裝、設備及試水包含哪些項目。亦要先確認若未能完成疏通，已做的檢查或獨立工序如何計費。不能只憑起步價推定全部免費或已包含。",
  },
  {
    id: "quote-extra-work",
    question: "施工期間發現要加做工序，會直接加價嗎？",
    answer:
      "如發現需要額外工序，先說明新增的處理範圍與費用，經確認後才繼續。確認時可要求分清原報價與追加項目，並保留雙方確認的內容。",
  },
];

export const QUOTATION_SCOPES = [
  {
    title: "坐廁、鋅盤及浴室疏通",
    detail:
      "說明受影響設備及其他去水位是否正常，確認處理哪個位置、可用入口、是否拆裝及完工試水範圍。",
    href: "/services",
    label: "按淤塞位置查看服務",
  },
  {
    title: "主渠及高壓洗渠",
    detail:
      "確認工作管段、管道狀況、設備搬運、供水及排污條件。多戶或公共位置受影響時，先協調管理處與進場安排。",
    href: "/services/high-pressure-jetting",
    label: "了解高壓清洗適用情況",
  },
  {
    title: "CCTV 照渠檢查",
    detail:
      "確認可進入的檢查口、檢查管段、是否需先疏通，以及影片、截圖或書面報告的交付安排。檢查與疏通分開確認。",
    href: "/services/cctv-drain-inspection",
    label: "了解照渠與影像交付",
  },
];
