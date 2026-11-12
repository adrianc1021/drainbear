/**
 * Narrow service-intent explanations for existing canonical service pages.
 * Do not create competing landing pages for these query variants.
 */
export const SERVICE_INTENT_FOCUS = {
  "bathroom-drain-unblocking": {
    heading: "洗手盆通渠：塞頭、隔氣定支渠出問題？",
    summary:
      "洗手盆積水未必全部係喉管淤塞。按壓式塞頭卡住、隔氣積聚毛髮皂垢、較深入支渠不暢，處理方法同拆裝範圍都唔同。先停用積水嘅洗手盆，記下其他去水位有冇同時異常。",
    guidance:
      "查詢洗手盆通渠時，可提供盆口、塞頭同櫃底喉管相片；唔使自行強拆。請師傅確認檢查位置、拆裝費用、疏通方法同完工試水有冇包括。",
    articleHref: "/blog/slow-basin-drain-causes-solutions",
    articleLabel: "洗手盆塞與去水慢：原因及處理指南",
  },
  "toilet-unblocking": {
    heading: "通廁所／坐廁通渠：水位升高、馬桶塞點算？",
    summary:
      "坐廁沖水後水位唔退，先停止再沖。大量廁紙、硬物跌入、座廁隔氣或共用支渠問題，都可能出現相似症狀；未檢查前唔應假設一定要拆馬桶。",
    guidance:
      "查詢時講清楚有冇異物、其他去水位是否倒灌；如已經加過化學通渠劑，必須預先告知。動工前確認需要處理嘅位置、拆裝及測試項目。",
    articleHref: "/blog/toilet-clog-emergency-guide",
    articleLabel: "塞廁所緊急處理與安全判斷",
  },
  "high-pressure-jetting": {
    heading: "高壓通渠收費：幾時適合高壓水槍洗渠？",
    summary:
      "高壓通渠通常用於評估清理較長管段嘅油垢、泥沙及沉積物，唔代表每宗塞渠都需要高壓機器。管道老化、接駁不穩或入口限制，可能令高壓清洗不合適。",
    guidance:
      "要比較高壓通渠報價，應問清楚管段與清洗長度、設備入口、供水排污、現場保護同完工試水；最終收費按實際工序確認，唔可以用一般通渠起步價推斷高壓工程總額。",
    articleHref: "/blog/high-pressure-drain-cleaning-vs-spring-machine",
    articleLabel: "高壓通渠與彈弓機：用途及報價因素比較",
  },
} as const;

export type ServiceIntentFocusSlug = keyof typeof SERVICE_INTENT_FOCUS;
export function getServiceIntentFocus(slug: string) {
  return SERVICE_INTENT_FOCUS[slug as ServiceIntentFocusSlug] ?? null;
}
