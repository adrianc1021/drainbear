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
  "kitchen-sink-unblocking": {
    heading: "廚房鋅盤塞，報價要問清楚邊段喉？",
    summary:
      "鋅盤積水，可以先告知通渠熊係單盆定雙盆、兩邊會唔會互相冒水，以及浴室去水有冇同時受影響。呢幾項資料有助安排檢查盆底隔氣、櫃內去水喉，或較深嘅支渠。",
    guidance:
      "格價時，請對方列明拆隔氣、清理、重新接駁同放水試漏是否已包括。如果堵塞伸延至牆內，要另外使用工具，可以先確認新增工序同總額，再決定是否繼續。",
    articleHref: "/blog/sink-drain-access-disassembly",
    articleLabel: "睇鋅盤櫃底入口同拆裝點樣影響報價",
  },
  "sewage-backflow": {
    heading: "低層單位或洗衣機去水倒灌，應先搵邊個？",
    summary:
      "留意邊個去水口冒水、係咪只喺洗衣機排水時出現，以及鄰戶有冇同時受影響。單靠樓層判斷唔到塞喺邊段。多戶同時倒灌，先通知管理處協調共用渠入口，再安排師傅檢查。",
    guidance:
      "向通渠熊查詢時，可提供地區、受影響位置及已有相片。先確認今次報價涵蓋單位內支渠，定包括共用管段，並由有權安排進場嘅一方確認。毋須再開機或放水重演倒灌。",
    articleHref: "/blog/washing-machine-drain-backflow-causes-fixes",
    articleLabel: "洗衣機排水時地渠冒水：點分單位支渠同共用渠",
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
