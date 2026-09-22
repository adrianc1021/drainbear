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
  click_id_type?: "gclid" | "dclid" | "gbraid" | "wbraid";
}

export interface Ga4CampaignFields {
  campaign_id?: string;
  campaign_source?: string;
  campaign_medium?: string;
  campaign_name?: string;
  campaign_term?: string;
  campaign_content?: string;
}

export interface Ga4AttributionSnapshot {
  page_location: string;
  campaign: Ga4CampaignFields;
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

const SOURCE_ALIASES: Readonly<Record<string, string>> = {
  adwords: "google",
  googleads: "google",
  google_ads: "google",
  "google ads": "google",
  fb: "facebook",
  fb_ads: "facebook",
  meta: "facebook",
  meta_ads: "facebook",
  ig: "instagram",
  ig_ads: "instagram",
};

const MEDIUM_ALIASES: Readonly<Record<string, string>> = {
  adwords: "cpc",
  googleads: "cpc",
  google_ads: "cpc",
  sem: "cpc",
  paidsearch: "cpc",
  paid_search: "cpc",
  "paid-search": "cpc",
  fbads: "paid_social",
  fb_ads: "paid_social",
  facebook_ads: "paid_social",
  meta_ads: "paid_social",
  ig_ads: "paid_social",
  instagram_ads: "paid_social",
  paidsocial: "paid_social",
  "paid-social": "paid_social",
  social_paid: "paid_social",
  newsletter: "email",
  edm: "email",
  mail: "email",
  "e-mail": "email",
  e_mail: "email",
  "e mail": "email",
  social_media: "social",
  "social-media": "social",
  organic_social: "social",
  display_ads: "display",
  banner: "display",
  programmatic: "display",
  affiliates: "affiliate",
};

const SAFE_CLICK_ID_PATTERN = /^[A-Za-z0-9._~-]+$/;

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

function normalizedCampaignValue(
  value: string | null,
  aliases?: Readonly<Record<string, string>>
) {
  const safe = safeValue(value);
  if (!safe) return undefined;

  const normalized = safe.toLowerCase();
  return aliases?.[normalized] || normalized;
}

function currentUrl(): URL | null {
  if (typeof window === "undefined") return null;

  try {
    return new URL(window.location.href);
  } catch {
    try {
      return new URL(
        `${window.location.origin || "https://drainbearhk.com"}${
          window.location.pathname || "/"
        }${window.location.search || ""}`
      );
    } catch {
      return null;
    }
  }
}

function manualCampaign(params: URLSearchParams): Ga4CampaignFields {
  return {
    campaign_id: normalizedCampaignValue(params.get("utm_id")),
    campaign_source: normalizedCampaignValue(
      params.get("utm_source"),
      SOURCE_ALIASES
    ),
    campaign_medium: normalizedCampaignValue(
      params.get("utm_medium"),
      MEDIUM_ALIASES
    ),
    campaign_name: normalizedCampaignValue(params.get("utm_campaign")),
    campaign_term: normalizedCampaignValue(params.get("utm_term")),
    campaign_content: normalizedCampaignValue(params.get("utm_content")),
  };
}

function safeClickId(value: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, 300);
  return SAFE_CLICK_ID_PATTERN.test(trimmed) ? trimmed : undefined;
}

/**
 * Snapshot the original landing URL before SPA navigation. Only recognised
 * campaign parameters are retained, so arbitrary query values cannot leak
 * into GA4 through page_location. Click IDs are kept only in this transient
 * URL and are never written to sessionStorage.
 */
export function captureGa4AttributionSnapshot(): Ga4AttributionSnapshot {
  const url = currentUrl();

  if (!url) {
    return {
      page_location: "https://drainbearhk.com/",
      campaign: {},
    };
  }

  const campaign = manualCampaign(url.searchParams);
  const cleanParams = new URLSearchParams();
  const clickIds: Array<["gclid" | "dclid" | "gbraid" | "wbraid", string]> = [];

  for (const key of ["gclid", "dclid", "gbraid", "wbraid"] as const) {
    const value = safeClickId(url.searchParams.get(key));
    if (value) clickIds.push([key, value]);
  }
  const campaignEntries: Array<[string, string | undefined]> = [
    ["utm_id", campaign.campaign_id],
    ["utm_source", campaign.campaign_source],
    ["utm_medium", campaign.campaign_medium],
    ["utm_campaign", campaign.campaign_name],
    ["utm_term", campaign.campaign_term],
    ["utm_content", campaign.campaign_content],
  ];

  // Auto-tagging is more reliable than manual UTM for Google Ads. If a click
  // ID exists, omit UTM from page_location as well as campaign fields so a
  // malformed utm_medium cannot override Paid Search / Display attribution.
  if (clickIds.length === 0) {
    for (const [key, value] of campaignEntries) {
      if (value) cleanParams.set(key, value);
    }
  }

  for (const [key, value] of clickIds) {
    cleanParams.set(key, value);
  }

  const query = cleanParams.toString();

  return {
    page_location: `${url.origin}${url.pathname}${query ? `?${query}` : ""}`,
    // Google Ads click IDs must retain auto-tagging priority. Supplying manual
    // campaign fields alongside a click ID can overwrite paid-search routing.
    campaign: clickIds.length > 0 ? {} : campaign,
  };
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

  let params: URLSearchParams;

  try {
    params = new URL(window.location.href).searchParams;
  } catch {
    // 測試環境、受限 WebView 或不完整 location object 可能沒有有效 href。
    // Attribution 初始化不可因 URL 解析失敗而中斷網站。
    params = new URLSearchParams(window.location.search || "");
  }

  const gclid = params.get("gclid");
  const dclid = params.get("dclid");
  const gbraid = params.get("gbraid");
  const wbraid = params.get("wbraid");

  const clickIdType: SessionAttribution["click_id_type"] = gclid
    ? "gclid"
    : dclid
      ? "dclid"
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

  const campaign = manualCampaign(params);
  const attribution: SessionAttribution = {
    traffic_source:
      (clickIdType ? "google" : campaign.campaign_source) || referrerHost,
    traffic_medium:
      (clickIdType
        ? clickIdType === "dclid"
          ? "display"
          : "cpc"
        : campaign.campaign_medium) || (referrerHost ? "referral" : undefined),
    campaign_name: campaign.campaign_name,
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
