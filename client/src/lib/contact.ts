/**
 * 通渠熊 DrainBear — 聯絡資訊統一常數
 * 電話與 WhatsApp 統一由此管理，方便日後更換真實號碼
 */
export const PHONE_DISPLAY = "+852 6531 8580";
export const PHONE_TEL = "tel:+85265318580";
export const WHATSAPP_NUMBER = "85265318580";

export function waLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WA_DEFAULT = waLink("你好，我想查詢通渠服務報價。");
