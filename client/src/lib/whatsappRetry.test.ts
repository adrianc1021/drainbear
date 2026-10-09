import { beforeEach, describe, expect, it, vi } from "vitest";
import { getWhatsAppRetryHref, rememberWhatsAppRetry } from "./whatsappRetry";

const fallback = "https://wa.me/85295588260?text=hello";
beforeEach(() => {
  const data = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      sessionStorage: {
        getItem: (key: string) => data.get(key) || null,
        setItem: (key: string, value: string) => data.set(key, value),
        removeItem: (key: string) => data.delete(key),
      },
    },
  });
  vi.useRealTimers();
});
describe("WhatsApp retry context", () => {
  it("keeps the selected service/district through repeated retries", () => {
    const href =
      "https://wa.me/85295588260?text=" +
      encodeURIComponent("隔油池清理，觀塘");
    rememberWhatsAppRetry(href);
    expect(getWhatsAppRetryHref(fallback)).toBe(href);
    expect(getWhatsAppRetryHref(fallback)).toBe(href);
  });
  it("expires and rejects destinations for a different contact", () => {
    vi.useFakeTimers();
    rememberWhatsAppRetry(fallback);
    vi.advanceTimersByTime(16 * 60 * 1000);
    expect(
      getWhatsAppRetryHref("https://wa.me/85295588260?text=new")
    ).toContain("text=new");
    rememberWhatsAppRetry("https://wa.me/85212345678?text=other");
    expect(getWhatsAppRetryHref(fallback)).toBe(fallback);
    vi.useRealTimers();
  });
  it.each([
    "https://wa.me.attacker.example/85295588260",
    "javascript:alert(1)",
    "https://wa.me/85295588260?redirect=other",
    "https://wa.me/85295588260#other",
  ])("rejects unsupported destinations: %s", value => {
    rememberWhatsAppRetry("https://wa.me/85295588260?text=previous");
    rememberWhatsAppRetry(value);
    expect(getWhatsAppRetryHref(fallback)).toBe(fallback);
  });
  it("uses the ordinary contact when storage is blocked", () => {
    Object.defineProperty(window, "sessionStorage", {
      get: () => {
        throw new Error("blocked");
      },
    });
    expect(() => rememberWhatsAppRetry(fallback)).not.toThrow();
    expect(getWhatsAppRetryHref(fallback)).toBe(fallback);
  });
});
