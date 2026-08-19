/**
 * 統一 Analytics 模組測試(第二階段驗收 + PR#4 修正輪)
 * 環境:node + 手動 window/document stub(不依賴 jsdom,不新增套件)
 *
 * 註:vitest 下 import.meta.env.DEV = true 且未設 GA4 ID,
 * 因此事件走 dataLayer 佇列路徑 — 正好驗證「GA4 未設定時不報錯」的行為。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetAnalyticsStateForTests,
  initAnalytics,
  isValidGa4Id,
  sendEvent,
  trackBlogRead,
  trackCTA,
  trackContactFormStart,
  trackContactFormSubmit,
  trackQuoteCalculatorComplete,
  trackQuoteCalculatorStart,
  trackWhatsAppHandoff,
  trackWhatsAppOpen,
} from "./analytics";

type QueueEntry = Record<string, unknown>;

function getQueue(): QueueEntry[] {
  return (globalThis as { window?: { dataLayer: unknown[] } }).window!
    .dataLayer as QueueEntry[];
}

function eventsNamed(name: string): QueueEntry[] {
  return getQueue().filter(
    (e) => typeof e === "object" && e !== null && e.event === name,
  );
}

beforeEach(() => {
  const g = globalThis as Record<string, unknown>;
  g.window = {
    dataLayer: [],
    location: { pathname: "/services", origin: "https://drainbearhk.com" },
    setTimeout: globalThis.setTimeout.bind(globalThis),
    history: { pushState: () => undefined },
    dispatchEvent: () => true,
  };
  g.document = { title: "通渠服務｜通渠熊" };
  __resetAnalyticsStateForTests();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

// ---------------------------------------------------------------------------
// GA4 Measurement ID 驗證(修正項 3)
// ---------------------------------------------------------------------------

describe("isValidGa4Id", () => {
  it("合法 G- 格式通過", () => {
    expect(isValidGa4Id("G-XXXXXXXXXX")).toBe(true);
    expect(isValidGa4Id("G-ABC123DEF4")).toBe(true);
    expect(isValidGa4Id("G-1234567890")).toBe(true);
    expect(isValidGa4Id("G-AB12")).toBe(true); // 最短 4 位
    expect(isValidGa4Id(" G-ABC123DEF4 ")).toBe(true); // 前後空白可容忍
  });

  it("非 G- 格式拒絕", () => {
    expect(isValidGa4Id("AW-18128738982")).toBe(false); // Google Ads tag
    expect(isValidGa4Id("UA-12345678-1")).toBe(false); // Universal Analytics
    expect(isValidGa4Id("GT-ABC123")).toBe(false);
    expect(isValidGa4Id("G-")).toBe(false);
    expect(isValidGa4Id("G-abc123def4")).toBe(false); // 小寫拒絕
    expect(isValidGa4Id("G-XXXX XXXX")).toBe(false); // 內含空白
    expect(isValidGa4Id("g-ABC123DEF4")).toBe(false);
    expect(isValidGa4Id("")).toBe(false);
    expect(isValidGa4Id(undefined)).toBe(false);
    expect(isValidGa4Id(null)).toBe(false);
    expect(isValidGa4Id(12345)).toBe(false);
    expect(isValidGa4Id("javascript:alert(1)")).toBe(false);
  });
});

describe("initAnalytics — 格式錯誤 ID 防護", () => {
  it("window.__GA4_ID__ 為非法格式時不拋錯、不初始化 GA4,網站正常運作", () => {
    const w = (globalThis as Record<string, unknown>).window as Record<
      string,
      unknown
    >;
    w.__GA4_ID__ = "not-a-valid-id";
    expect(() => initAnalytics()).not.toThrow();
    // gtag stub 已建立(dataLayer 佇列可用),但沒有任何 config 呼叫入佇列
    const configCalls = getQueue().filter(
      (e) => Array.isArray(e) && (e as unknown as unknown[])[0] === "config",
    );
    expect(configCalls).toHaveLength(0);
    // 事件仍可正常發送(不報錯)
    expect(() => trackCTA("phone", "header")).not.toThrow();
    expect(eventsNamed("phone_click")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// GA4 未設定時網站正常運作
// ---------------------------------------------------------------------------

describe("initAnalytics(GA4 未設定)", () => {
  it("不會拋出錯誤,並建立 dataLayer 佇列", () => {
    expect(() => initAnalytics()).not.toThrow();
    expect(Array.isArray(getQueue())).toBe(true);
  });

  it("重複呼叫不會重複初始化", () => {
    initAnalytics();
    const len = getQueue().length;
    initAnalytics();
    expect(getQueue().length).toBe(len);
  });
});

// ---------------------------------------------------------------------------
// trackCTA
// ---------------------------------------------------------------------------

describe("trackCTA", () => {
  it("whatsapp 點擊記錄 whatsapp_click,一次呼叫只入一筆", () => {
    trackCTA("whatsapp", "mobile_bar");
    const events = eventsNamed("whatsapp_click");
    expect(events).toHaveLength(1);
    expect(events[0].cta_location).toBe("mobile_bar");
    expect(events[0].page_path).toBe("/services");
    expect(events[0].page_title).toBe("通渠服務｜通渠熊");
  });

  it("phone 點擊記錄 phone_click,一次呼叫只入一筆", () => {
    trackCTA("phone", "header");
    const events = eventsNamed("phone_click");
    expect(events).toHaveLength(1);
    expect(events[0].cta_location).toBe("header");
  });

  it("map 頻道統一映射為 area_click,topic 轉為 area_name", () => {
    trackCTA("map", "areas_map", "觀塘");
    const events = eventsNamed("area_click");
    expect(events).toHaveLength(1);
    expect(events[0].area_name).toBe("觀塘");
    expect(events[0].cta_location).toBe("areas_map");
  });
});

// ---------------------------------------------------------------------------
// PII 防護
// ---------------------------------------------------------------------------

describe("PII 防護", () => {
  it("疑似電話號碼的參數值會被丟棄", () => {
    trackCTA("whatsapp", "header", "請回電 95588260 我係陳生");
    const events = eventsNamed("whatsapp_click");
    expect(events).toHaveLength(1);
    expect(events[0].topic).toBeUndefined();
    expect(events[0].cta_location).toBe("header");
  });

  it("疑似電郵的參數值會被丟棄", () => {
    sendEvent("cta_click", {
      cta_location: "footer",
      cta_label: "chan@example.com",
    });
    const events = eventsNamed("cta_click");
    expect(events[0].cta_label).toBeUndefined();
    expect(events[0].cta_location).toBe("footer");
  });

  it("正常選項摘要(價格範圍)不會被誤殺", () => {
    trackCTA("whatsapp", "price_calculator", "坐廁_私樓_day");
    const events = eventsNamed("whatsapp_click");
    expect(events[0].topic).toBe("坐廁_私樓_day");
  });
});

// ---------------------------------------------------------------------------
// 純 Helper:每次呼叫發送一次(去重責任在 Component,見 perViewDedup 測試)
// ---------------------------------------------------------------------------

describe("純事件 Helper(不持有跨頁面去重狀態)", () => {
  it("trackQuoteCalculatorStart 每次呼叫各發一筆(去重由 Component 負責)", () => {
    trackQuoteCalculatorStart();
    trackQuoteCalculatorStart();
    expect(eventsNamed("quote_calculator_start")).toHaveLength(2);
  });

  it("trackQuoteCalculatorComplete 帶 topic 摘要", () => {
    trackQuoteCalculatorComplete("坐廁_私樓_day");
    const events = eventsNamed("quote_calculator_complete");
    expect(events).toHaveLength(1);
    expect(events[0].topic).toBe("坐廁_私樓_day");
    expect(events[0].cta_location).toBe("price_calculator");
  });

  it("trackBlogRead 每次呼叫各發一筆(去重由 blogReadTracker 負責)", () => {
    trackBlogRead("prevent-kitchen-sink-clog", 62);
    trackBlogRead("prevent-kitchen-sink-clog", 80);
    expect(eventsNamed("blog_read")).toHaveLength(2);
    expect(eventsNamed("blog_read")[0].read_percent).toBe(62);
  });

  it("trackContactFormStart / Submit 記錄 form_name", () => {
    trackContactFormStart("inquiry_form", "contact_page");
    trackContactFormSubmit("inquiry_form", "contact_page");
    expect(eventsNamed("contact_form_start")).toHaveLength(1);
    const submits = eventsNamed("contact_form_submit");
    expect(submits).toHaveLength(1);
    expect(submits[0].form_name).toBe("inquiry_form");
  });
});

// ---------------------------------------------------------------------------
// Google Ads 事件路由
// ---------------------------------------------------------------------------

describe("Google Ads 事件路由", () => {
  function useProductionHost() {
    const gtag = vi.fn();
    const currentWindow = (globalThis as Record<string, any>).window;
    currentWindow.location.hostname = "drainbearhk.com";
    currentWindow.gtag = gtag;
    return gtag;
  }

  it("quote_calculator_start 只明確送往 Ads destination", () => {
    const gtag = useProductionHost();

    trackQuoteCalculatorStart();

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "quote_calculator_start", {
      send_to: "AW-18128738982",
    });
  });

  it("非正式網域不會外送 Google Ads 事件", () => {
    const gtag = vi.fn();
    const currentWindow = (globalThis as Record<string, any>).window;
    currentWindow.location.hostname = "localhost";
    currentWindow.gtag = gtag;

    trackQuoteCalculatorStart();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("有效 WhatsApp label 會送出一次 Ads conversion", () => {
    vi.stubEnv("VITE_GOOGLE_ADS_WHATSAPP_LABEL", "test_Label-123");
    const gtag = useProductionHost();

    trackWhatsAppHandoff("mobile_bar", {
      traffic_source: "google",
      traffic_medium: "cpc",
      landing_page: "/",
      click_id_type: "gclid",
    });

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "conversion", {
      send_to: "AW-18128738982/test_Label-123",
      transport_type: "beacon",
    });
  });

  it("缺少 WhatsApp label 時不會誤送 conversion", () => {
    vi.stubEnv("VITE_GOOGLE_ADS_WHATSAPP_LABEL", "");
    const gtag = useProductionHost();

    trackWhatsAppHandoff("mobile_bar", { landing_page: "/" });

    expect(gtag).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// whatsapp_open
// ---------------------------------------------------------------------------

describe("whatsapp_open(/thanks 代理轉換)", () => {
  it("記錄來源位置及 /thanks 路徑", () => {
    trackWhatsAppOpen("mobile_bar");
    const events = eventsNamed("whatsapp_open");
    expect(events).toHaveLength(1);
    expect(events[0].cta_location).toBe("mobile_bar");
    expect(events[0].page_path).toBe("/thanks");
  });
});

// ---------------------------------------------------------------------------
// 參數白名單
// ---------------------------------------------------------------------------

describe("參數白名單", () => {
  it("空值參數不會被傳送", () => {
    sendEvent("cta_click", { cta_location: "", cta_label: "了解更多" });
    const events = eventsNamed("cta_click");
    expect(events[0].cta_location).toBeUndefined();
    expect(events[0].cta_label).toBe("了解更多");
  });
});
