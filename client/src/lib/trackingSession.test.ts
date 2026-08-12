import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  __clearTrackingSessionForTests,
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
