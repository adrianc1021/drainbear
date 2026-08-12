/**
 * 通渠熊 DrainBear — Session Attribution & WhatsApp Handoff
 *
 * 只保存廣告歸因及技術資料，不保存姓名、電話、電郵、地址或訊息內容。
 * 使用 sessionStorage：關閉分頁後自動失效。
 */

export interface SessionAttribution {
  traffic_source?: string;
  traffic_medium?: string;
  campaign_name?: string;
  landing_page: string;
  click_id_type?: "gclid" | "gbraid" | "wbraid";
}

export interface WhatsAppHandoff {
  nonce: string;
  cta_location: string;
  created_at: number;
  attribution: SessionAttribution;
}

const ATTRIBUTION_KEY = "drainbear_session_attribution_v1";
const HANDOFF_KEY = "drainbear_whatsapp_handoff_v1";
const HANDOFF_MAX_AGE_MS = 5 * 60 * 1000;

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE_PATTERN = /(?:\+?852[\s-]?)?\d{4}[\s-]?\d{4,}/;

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function safeValue(value: string | null, maxLength = 100) {
  if (!value) return undefined;

  const cleaned = value.trim().slice(0, maxLength);

  if (!cleaned || EMAIL_PATTERN.test(cleaned) || PHONE_PATTERN.test(cleaned)) {
    return undefined;
  }

  return cleaned;
}

function createNonce() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
}

export function captureInitialAttribution(): SessionAttribution {
  const fallback: SessionAttribution = {
    landing_page:
      typeof window !== "undefined" ? window.location.pathname : "/",
  };

  if (typeof window === "undefined") return fallback;

  const storage = safeStorage();

  if (storage) {
    try {
      const existing = storage.getItem(ATTRIBUTION_KEY);

      if (existing) {
        return JSON.parse(existing) as SessionAttribution;
      }
    } catch {
      // Invalid/blocked storage：重新建立即可。
    }
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;

  const gclid = params.get("gclid");
  const gbraid = params.get("gbraid");
  const wbraid = params.get("wbraid");

  const clickIdType: SessionAttribution["click_id_type"] = gclid
    ? "gclid"
    : gbraid
      ? "gbraid"
      : wbraid
        ? "wbraid"
        : undefined;

  let referrerHost: string | undefined;

  try {
    if (document.referrer) {
      const referrer = new URL(document.referrer);

      if (referrer.hostname !== window.location.hostname) {
        referrerHost = safeValue(referrer.hostname);
      }
    }
  } catch {
    referrerHost = undefined;
  }

  const attribution: SessionAttribution = {
    traffic_source:
      safeValue(params.get("utm_source")) ||
      (clickIdType ? "google" : referrerHost),
    traffic_medium:
      safeValue(params.get("utm_medium")) ||
      (clickIdType ? "cpc" : referrerHost ? "referral" : undefined),
    campaign_name: safeValue(params.get("utm_campaign")),
    landing_page: window.location.pathname,
    click_id_type: clickIdType,
  };

  if (storage) {
    try {
      storage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    } catch {
      // Storage blocked：追蹤功能降級，不影響網站。
    }
  }

  return attribution;
}

export function getSessionAttribution(): SessionAttribution {
  return captureInitialAttribution();
}

export function createWhatsAppHandoff(
  ctaLocation: string
): WhatsAppHandoff | null {
  const storage = safeStorage();

  if (!storage) return null;

  const handoff: WhatsAppHandoff = {
    nonce: createNonce(),
    cta_location: safeValue(ctaLocation, 80) || "unknown",
    created_at: Date.now(),
    attribution: getSessionAttribution(),
  };

  try {
    storage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
    return handoff;
  } catch {
    return null;
  }
}

export function consumeWhatsAppHandoff(): WhatsAppHandoff | null {
  const storage = safeStorage();

  if (!storage) return null;

  let raw: string | null = null;

  try {
    raw = storage.getItem(HANDOFF_KEY);

    // 先刪除再驗證，確保 refresh／返回頁面不會重複使用。
    storage.removeItem(HANDOFF_KEY);
  } catch {
    return null;
  }

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as WhatsAppHandoff;

    if (
      !parsed ||
      typeof parsed.nonce !== "string" ||
      typeof parsed.cta_location !== "string" ||
      typeof parsed.created_at !== "number" ||
      !parsed.attribution
    ) {
      return null;
    }

    const age = Date.now() - parsed.created_at;

    if (age < 0 || age > HANDOFF_MAX_AGE_MS) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function __clearTrackingSessionForTests() {
  const storage = safeStorage();

  try {
    storage?.removeItem(ATTRIBUTION_KEY);
    storage?.removeItem(HANDOFF_KEY);
  } catch {
    // Test/reset helper。
  }
}
