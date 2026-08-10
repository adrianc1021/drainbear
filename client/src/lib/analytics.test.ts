/**
 * 統一 Analytics 模組測試(第二階段驗收)
 * 環境:node + 手動 window/document stub(不依賴 jsdom,不新增套件)
 *
 * 註:vitest 下 import.meta.env.DEV = true 且未設 GA4 ID,
 * 因此事件走 dataLayer 佇列路徑 — 正好驗證「GA4 未設定時不報錯」的行為。
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetAnalyticsStateForTests,
  initAnalytics,
  sendEvent,
  trackBlogRead,
  trackCTA,
  trackContactFormStart,
  trackContactFormSubmit,
  trackQuoteCalculatorComplete,
  trackQuoteCalculatorStart,
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

describe("估價計算機事件", () => {
  it("quote_calculator_start 每次載入只記一次", () => {
    trackQuoteCalculatorStart();
    trackQuoteCalculatorStart();
    trackQuoteCalculatorStart();
    expect(eventsNamed("quote_calculator_start")).toHaveLength(1);
  });

  it("quote_calculator_complete 同一組合只記一次,不同組合各記一次", () => {
    trackQuoteCalculatorComplete("toilet_apartment_day");
    trackQuoteCalculatorComplete("toilet_apartment_day");
    trackQuoteCalculatorComplete("sink_village_night");
    expect(eventsNamed("quote_calculator_complete")).toHaveLength(2);
  });
});

describe("表格事件", () => {
  it("contact_form_start 同一表格只記一次", () => {
    trackContactFormStart("inquiry_form");
    trackContactFormStart("inquiry_form");
    expect(eventsNamed("contact_form_start")).toHaveLength(1);
  });

  it("contact_form_submit 記錄 form_name", () => {
    trackContactFormSubmit("inquiry_form", "contact_page");
    const events = eventsNamed("contact_form_submit");
    expect(events).toHaveLength(1);
    expect(events[0].form_name).toBe("inquiry_form");
  });
});

describe("Blog 事件", () => {
  it("blog_read 同一篇文章只記一次", () => {
    trackBlogRead("prevent-kitchen-sink-clog", 62);
    trackBlogRead("prevent-kitchen-sink-clog", 80);
    const events = eventsNamed("blog_read");
    expect(events).toHaveLength(1);
    expect(events[0].article_slug).toBe("prevent-kitchen-sink-clog");
    expect(events[0].read_percent).toBe(62);
  });
});

describe("whatsapp_open(/thanks 代理轉換)", () => {
  it("記錄來源位置及 /thanks 路徑", () => {
    trackWhatsAppOpen("mobile_bar");
    const events = eventsNamed("whatsapp_open");
    expect(events).toHaveLength(1);
    expect(events[0].cta_location).toBe("mobile_bar");
    expect(events[0].page_path).toBe("/thanks");
  });
});

describe("參數白名單", () => {
  it("空值參數不會被傳送", () => {
    sendEvent("cta_click", { cta_location: "", cta_label: "了解更多" });
    const events = eventsNamed("cta_click");
    expect(events[0].cta_location).toBeUndefined();
    expect(events[0].cta_label).toBe("了解更多");
  });
});
