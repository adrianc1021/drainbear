import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  __clearTrackingSessionForTests,
  captureGa4AttributionSnapshot,
  captureInitialAttribution,
  consumeWhatsAppHandoff,
  createWhatsAppHandoff,
} from "./trackingSession";

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
    key(index: number) {
      return [...values.keys()][index] ?? null;
    },
    get length() {
      return values.size;
    },
  } as Storage;
}

beforeEach(() => {
  const sessionStorage = createStorage();

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: {
        href: "https://drainbearhk.com/?utm_source=google&utm_medium=cpc&utm_campaign=emergency&gclid=test-click",
        pathname: "/",
        hostname: "drainbearhk.com",
      },
      sessionStorage,
    },
  });

  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      referrer: "",
    },
  });

  __clearTrackingSessionForTests();
  vi.restoreAllMocks();
});

describe("session attribution", () => {
  it("保存 UTM、landing page 及 click ID 類型，但不保存 click ID 原值", () => {
    const result = captureInitialAttribution();

    expect(result).toEqual({
      traffic_source: "google",
      traffic_medium: "cpc",
      campaign_name: "emergency",
      landing_page: "/",
      click_id_type: "gclid",
    });

    expect(JSON.stringify(result)).not.toContain("test-click");
  });

  it("同一 session 保留首次 landing attribution", () => {
    const first = captureInitialAttribution();

    window.location.href = "https://drainbearhk.com/areas?utm_source=yahoo";
    window.location.pathname = "/areas";

    const second = captureInitialAttribution();

    expect(second).toEqual(first);
    expect(second.traffic_source).toBe("google");
  });

  it("將常見 UTM 別名正規化，並從 GA4 page_location 移除未知查詢參數", () => {
    window.location.href =
      "https://drainbearhk.com/?utm_source=meta_ads&utm_medium=paid-social&utm_campaign=Drain%20Emergency&utm_content=Hero&customer_email=chan@example.com";

    const snapshot = captureGa4AttributionSnapshot();

    expect(snapshot).toEqual({
      page_location:
        "https://drainbearhk.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=drain+emergency&utm_content=hero",
      campaign: {
        campaign_id: undefined,
        campaign_source: "facebook",
        campaign_medium: "paid_social",
        campaign_name: "drain emergency",
        campaign_term: undefined,
        campaign_content: "hero",
      },
    });
    expect(snapshot.page_location).not.toContain("customer_email");
  });

  it("Google Ads click ID 優先於手動 UTM，且 click ID 不寫入 sessionStorage", () => {
    window.location.href =
      "https://drainbearhk.com/?utm_source=unknown&utm_medium=home_banner&gclid=TEST-CLICK-ID";

    const snapshot = captureGa4AttributionSnapshot();
    const attribution = captureInitialAttribution();

    expect(snapshot).toEqual({
      page_location: "https://drainbearhk.com/?gclid=TEST-CLICK-ID",
      campaign: {},
    });
    expect(attribution.traffic_source).toBe("google");
    expect(attribution.traffic_medium).toBe("cpc");
    expect(JSON.stringify(attribution)).not.toContain("TEST-CLICK-ID");
  });
});

describe("WhatsApp handoff", () => {
  it("只可 consume 一次，refresh 不重複計算", () => {
    createWhatsAppHandoff("home_hero");

    const first = consumeWhatsAppHandoff();
    const refresh = consumeWhatsAppHandoff();

    expect(first?.cta_location).toBe("home_hero");
    expect(refresh).toBeNull();
  });

  it("直接開啟 thanks 沒有 token 時不計 handoff", () => {
    expect(consumeWhatsAppHandoff()).toBeNull();
  });

  it("超過五分鐘 token 自動失效", () => {
    const now = 1_800_000_000_000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    createWhatsAppHandoff("mobile_bar");

    vi.spyOn(Date, "now").mockReturnValue(now + 5 * 60 * 1000 + 1);

    expect(consumeWhatsAppHandoff()).toBeNull();
  });
});
