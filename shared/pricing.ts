/** Business owner confirmed all service starting quotes on 2026-10-16. */
export const STARTING_PRICE_HKD = 300;
export const STARTING_PRICE_LABEL = "HK$300 起";
export const STARTING_PRICE_LINE = "全線通渠服務 HK$300 起";
export const STARTING_PRICE_ANSWER =
  "通渠熊全線通渠服務 HK$300 起報價。坐廁、鋅盤、浴室、主渠、高壓洗渠及 CCTV 照渠，立即 WhatsApp 傳相查詢，安排處理。";
/** Minimum quote, never a fixed total for every job. */
export const SERVICE_PRICE_SPECIFICATION = {
  "@type": "PriceSpecification",
  minPrice: STARTING_PRICE_HKD,
  priceCurrency: "HKD",
};
