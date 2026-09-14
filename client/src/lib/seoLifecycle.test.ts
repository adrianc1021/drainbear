import { beforeEach, describe, expect, it, vi } from "vitest";
import SEO from "@/components/SEO";

const lifecycle = vi.hoisted(() => ({
  effects: [] as {
    callback: () => void | (() => void);
    dependencies?: unknown[];
  }[],
  previous: [] as (unknown[] | undefined)[],
  site: {
    isLoading: false,
    hasCmsError: false,
    settings: {
      siteUrl: "https://drainbearhk.com",
      businessName: "通渠熊 DrainBear",
      businessDescription: "香港通渠服務",
      phoneE164: "+85295588260",
    },
  },
}));

// The browser is unavailable in the sandbox. Run the component's real effects
// against a small head/document adapter; do not mock the SEO implementation.
vi.mock("react", () => ({
  useEffect: (callback: () => void, dependencies?: unknown[]) => {
    lifecycle.effects.push({ callback, dependencies });
  },
}));
vi.mock("@/contexts/SiteSettingsContext", () => ({
  useSiteSettings: () => lifecycle.site,
}));

class HeadElement {
  attributes = new Map<string, string>();
  id = "";
  type = "";
  textContent = "";
  constructor(private elements: HeadElement[]) {}
  setAttribute(key: string, value: string) {
    this.attributes.set(key, value);
  }
  getAttribute(key: string) {
    return this.attributes.get(key) ?? null;
  }
  remove() {
    this.elements.splice(this.elements.indexOf(this), 1);
  }
}

function renderSeo(extra: Record<string, unknown> = {}) {
  lifecycle.effects = [];
  SEO({
    title: "香港通渠服務",
    description: "先了解情況，再確認報價。",
    path: "/services",
    ...extra,
  });
  lifecycle.effects.forEach((effect, index) => {
    const previous = lifecycle.previous[index];
    if (
      !previous ||
      effect.dependencies?.some(
        (value, position) => !Object.is(value, previous[position])
      )
    ) {
      effect.callback();
    }
  });
  lifecycle.previous = lifecycle.effects.map(effect => effect.dependencies);
}

beforeEach(() => {
  lifecycle.previous = [];
  lifecycle.site.isLoading = false;
  lifecycle.site.hasCmsError = false;
  const elements: HeadElement[] = [];
  vi.stubGlobal("document", {
    title: "Old page",
    documentElement: { dataset: {}, lang: "" },
    createElement: () => new HeadElement(elements),
    getElementById: (id: string) =>
      elements.find(element => element.id === id) ?? null,
    head: {
      appendChild: (element: HeadElement) => elements.push(element),
      querySelector: (selector: string) => {
        const attrs = [...selector.matchAll(/\[([^=]+)="([^"]+)"\]/g)];
        return (
          elements.find(element =>
            attrs.every(([, key, value]) => element.getAttribute(key) === value)
          ) ?? null
        );
      },
    },
  });
  vi.stubGlobal("window", {
    location: { hash: "" },
    scrollTo: vi.fn(),
    requestAnimationFrame: (callback: () => void) => {
      callback();
      return 1;
    },
    cancelAnimationFrame: vi.fn(),
  });
});

describe("SEO metadata lifecycle", () => {
  it("keeps useful fallback metadata while CMS site settings are pending", () => {
    lifecycle.site.isLoading = true;
    renderSeo();
    expect(document.title).toBe("香港通渠服務");
    expect(document.documentElement.dataset.seoReady).toBe("false");
  });

  it("does not let prerender capture metadata before a page override settles", () => {
    renderSeo({ metadataReady: false });
    expect(document.title).toBe("香港通渠服務");
    expect(document.documentElement.dataset.seoReady).toBe("false");
  });

  it("surfaces failed CMS reads so publishing can fail closed", () => {
    lifecycle.site.hasCmsError = true;
    renderSeo();
    expect(document.documentElement.dataset.seoCmsError).toBe("true");
    expect(document.title).toBe("香港通渠服務");
  });

  it("updates delayed metadata without jumping the visitor back to the top", () => {
    renderSeo();
    renderSeo({ title: "香港通渠及 CCTV 照喉服務" });
    expect(document.title).toBe("香港通渠及 CCTV 照喉服務");
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("still scrolls once when navigating to a different ready route", () => {
    renderSeo();
    renderSeo({ path: "/guide" });
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });

  it("waits for route content before exposing SEO as ready", () => {
    renderSeo({ contentReady: false });
    expect(document.documentElement.dataset.seoReady).toBe("false");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("supports an explicit nofollow directive for non-indexed conversion routes", () => {
    renderSeo({ noindex: true, nofollow: true });
    expect(
      document.head
        .querySelector('meta[name="robots"]')
        ?.getAttribute("content"),
    ).toBe("noindex, nofollow");
    expect(
      document.head
        .querySelector('meta[name="googlebot"]')
        ?.getAttribute("content"),
    ).toBe("noindex, nofollow");
  });
});
