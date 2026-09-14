import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CmsPageSEO from "@/components/CmsPageSEO";
import type { SEOProps } from "@/components/SEO";

const hooks = vi.hoisted(() => ({
  values: [] as unknown[],
  index: 0,
  effectIndex: 0,
  previous: [] as (unknown[] | undefined)[],
  queued: [] as (() => void)[],
  getPageSeo: vi.fn(),
}));
vi.mock("react", async importOriginal => ({
  ...(await importOriginal<typeof import("react")>()),
  useState: (initial: unknown) => {
    const index = hooks.index++;
    if (!(index in hooks.values)) hooks.values[index] = initial;
    return [
      hooks.values[index],
      (value: unknown) => {
        hooks.values[index] = value;
      },
    ];
  },
  useEffect: (callback: () => void, dependencies: unknown[]) => {
    const index = hooks.effectIndex++;
    const previous = hooks.previous[index];
    if (
      !previous ||
      dependencies.some(
        (value, position) => !Object.is(value, previous[position])
      )
    ) {
      hooks.queued.push(callback);
    }
    hooks.previous[index] = dependencies;
  },
}));
vi.mock("@/lib/sanity/queries", () => ({ getPageSeo: hooks.getPageSeo }));

function render(extra: Partial<SEOProps> & { cmsEnabled?: boolean } = {}) {
  hooks.index = 0;
  hooks.effectIndex = 0;
  const element = CmsPageSEO({
    title: "香港通渠服務",
    description: "現場確認報價",
    path: "/services",
    ...extra,
  });
  const queued = hooks.queued.splice(0);
  queued.forEach(callback => callback());
  return element.props as SEOProps;
}

beforeEach(() => {
  hooks.values = [];
  hooks.previous = [];
  hooks.queued = [];
  hooks.getPageSeo.mockReset();
  vi.stubGlobal("React", React);
  vi.stubGlobal("window", {
    requestIdleCallback: (callback: () => void) => {
      callback();
      return 1;
    },
    cancelIdleCallback: vi.fn(),
  });
});

describe("CMS page metadata readiness", () => {
  it("keeps fallback metadata while waiting for the published override", async () => {
    hooks.getPageSeo.mockResolvedValue({
      path: "/services",
      seo: { metaTitle: "已發佈通渠服務", noIndex: true },
    });
    const pending = render();
    expect(pending.title).toBe("香港通渠服務");
    expect(pending.metadataReady).toBe(false);
    await vi.waitFor(() => expect(render().metadataReady).toBe(true));
    expect(render().title).toBe("已發佈通渠服務");
    expect(render().noindex).toBe(true);
  });

  it("preserves content readiness from its page instead of overriding it", async () => {
    hooks.getPageSeo.mockResolvedValue(null);
    const props = render({ contentReady: false });
    expect(props.contentReady).toBe(false);
    await vi.waitFor(() =>
      expect(render({ contentReady: false }).metadataReady).toBe(true)
    );
    expect(render({ contentReady: false }).contentReady).toBe(false);
  });

  it("never applies a previous page canonical after the next CMS read fails", async () => {
    hooks.getPageSeo.mockResolvedValueOnce({
      path: "/services",
      seo: { canonicalUrl: "/services" },
    });
    render();
    await vi.waitFor(() => expect(render().metadataReady).toBe(true));
    hooks.getPageSeo.mockRejectedValueOnce(new Error("CMS unavailable"));
    expect(render({ path: "/guide" }).canonicalUrl).toBeUndefined();
    await vi.waitFor(() =>
      expect(render({ path: "/guide" }).metadataError).toBe(true)
    );
    const failed = render({ path: "/guide" });
    expect(failed.canonicalUrl).toBeUndefined();
    expect(failed.title).toBe("香港通渠服務");
  });

  it("uses static metadata without waiting when CMS is deliberately disabled", () => {
    const props = render({ cmsEnabled: false });
    expect(props.metadataReady).toBe(true);
    expect(props.title).toBe("香港通渠服務");
    expect(hooks.getPageSeo).not.toHaveBeenCalled();
  });
});
