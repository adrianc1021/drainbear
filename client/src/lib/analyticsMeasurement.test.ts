import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("GA4 production measurement", () => {
  const appendChild = vi.fn();

  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        dataLayer: [],
        location: {
          hostname: "drainbearhk.com",
          pathname: "/",
          origin: "https://drainbearhk.com",
          href: "https://drainbearhk.com/",
          search: "",
        },
        sessionStorage: { getItem: () => null, setItem: () => undefined },
      },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        title: "香港通渠服務｜通渠熊",
        querySelector: () => null,
        createElement: () => ({ dataset: {} }),
        head: { appendChild },
      },
    });
    appendChild.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("loads the active data stream and routes the first page view to it", async () => {
    vi.stubEnv("VITE_GA4_DEBUG", "true");
    const { initAnalytics, trackPageView } = await import("./analytics");

    initAnalytics();
    trackPageView("/");

    expect((window.dataLayer as unknown[][])).toContainEqual([
      "config",
      "G-05DW80HCTS",
      { send_page_view: false, debug_mode: true },
    ]);
    expect((window.dataLayer as unknown[][])).toContainEqual([
      "event",
      "page_view",
      expect.objectContaining({
        page_path: "/",
        page_title: "香港通渠服務｜通渠熊",
        send_to: "G-05DW80HCTS",
      }),
    ]);
    expect(appendChild).toHaveBeenCalledTimes(1);
  });
});
