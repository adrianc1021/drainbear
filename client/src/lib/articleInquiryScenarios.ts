/** Hypothetical situations help readers prepare enquiries; these are not case records. */
export const ARTICLE_INQUIRY_REVISION_DATE = "2026-10-14";

export interface ArticleInquiryScenario {
  heading: string;
  example: string;
  nextStep: string;
  homeLinkLabel: string;
  whatsappMessage: string;
}

const SCENARIOS: Record<string, ArticleInquiryScenario> = {
  "toilet-clog-emergency-guide": {
    heading: "坐廁塞住，想安排師傅檢查？",
    example:
      "假設沖水後水位升高，等候後仍未回落，而其他去水位暫時正常。先停用坐廁，查詢時交代有沒有異物跌入或用過通渠水。",
    nextStep: "可先了解通渠熊的",
    homeLinkLabel: "香港通渠服務及上門安排",
    whatsappMessage:
      "您好，我想查詢坐廁通渠。地區：＿＿；問題（水位升高／去水慢／其他）：＿＿；其他去水位是否異常：＿＿；是否有異物跌入或使用過化學通渠劑：＿＿。我會提供安全拍攝的相片，請先了解處理方向及可安排時間。",
  },
  "slow-basin-drain-causes-solutions": {
    heading: "洗手盆去水慢，未確定塞喺邊？",
    example:
      "假設洗手盆去水慢，櫃底未見明顯漏水，但你未能確認堵塞位置。查詢時提供盆內水位、可安全拍攝的去水喉位置，以及其他去水位是否正常。",
    nextStep: "未能分辨隔氣或後段喉管問題，可先查看",
    homeLinkLabel: "通渠服務與檢查流程",
    whatsappMessage:
      "您好，我想查詢洗手盆去水慢。地區：＿＿；情況（積水／去水慢／異味／其他）：＿＿；櫃底是否滲漏：＿＿；其他去水位是否正常：＿＿；已做過的處理：＿＿。我會提供安全拍攝的相片，請先了解檢查方向及安排。",
  },
  "building-main-drain-vs-unit-branch-pipe": {
    heading: "多個單位去水異常，點樣開始查詢？",
    example:
      "假設同層幾個單位同時去水慢或冒水。先向管理處說明受影響範圍、樓層及位置，再查詢共用渠段的檢查與進場安排；這個情況不能單憑描述確認是主渠淤塞。",
    nextStep: "需要安排檢查時，可先了解",
    homeLinkLabel: "住宅與物業通渠服務",
    whatsappMessage:
      "您好，我想查詢單位支渠／大廈主渠問題。地區及樓宇：＿＿；受影響位置、樓層及單位數：＿＿；是否倒灌：＿＿；管理處聯絡及進場安排：＿＿。我會提供現場資料，請先了解檢查範圍及可安排時間。",
  },
};

export function getArticleInquiryScenario(slug: string) {
  return SCENARIOS[slug];
}
