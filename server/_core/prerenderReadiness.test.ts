import { describe, expect, it } from "vitest";
import {
  assessPrerenderSnapshot,
  type PrerenderSnapshot,
} from "../../scripts/prerender-readiness";

const ready: PrerenderSnapshot = {
  title: "香港通渠服務",
  canonicalHref: "https://drainbearhk.com/services",
  rootText: "住宅、商舖及辦公室通渠服務。",
  heading: "香港通渠服務",
  seoReady: "true",
  seoCmsError: "false",
  cmsLoadingCount: 0,
  cmsErrorCount: 0,
  robots: "index, follow",
  googlebot: "index, follow",
};

describe("prerender publication readiness", () => {
  it("accepts complete crawlable content and canonical metadata", () => {
    expect(assessPrerenderSnapshot(ready, "/services")).toEqual({
      ready: true,
    });
  });
  it("does not confuse a genuine service question with an error heading", () => {
    expect(
      assessPrerenderSnapshot(
        { ...ready, heading: "找不到淤塞原因？了解 CCTV 照喉" },
        "/services"
      )
    ).toEqual({ ready: true });
  });
  it.each([
    { seoReady: "false" },
    { cmsLoadingCount: 1 },
    { heading: "" },
    { canonicalHref: "https://drainbearhk.com/" },
  ])("waits for pending or previous-route data: %j", pending => {
    expect(
      assessPrerenderSnapshot({ ...ready, ...pending }, "/services").ready
    ).toBe(false);
  });
  it.each([
    { seoCmsError: "true" },
    { cmsErrorCount: 1 },
    { canonicalHref: "https://example.com/services" },
    { robots: "noindex, follow" },
    { googlebot: "noindex, follow" },
    { heading: "暫時無法載入文章" },
  ])("rejects an unsafe publication snapshot: %j", invalid => {
    const result = assessPrerenderSnapshot(
      { ...ready, ...invalid },
      "/services"
    );
    expect(result.ready).toBe(false);
    expect(result.error).toBeTruthy();
  });
  it("allows the intentionally excluded thank-you page only with both noindex directives", () => {
    const thanks = {
      ...ready,
      canonicalHref: "https://drainbearhk.com/thanks",
      robots: "noindex, follow",
      googlebot: "noindex, follow",
    };
    expect(assessPrerenderSnapshot(thanks, "/thanks").ready).toBe(true);
    expect(
      assessPrerenderSnapshot(
        { ...thanks, googlebot: "index, follow" },
        "/thanks"
      ).ready
    ).toBe(false);
  });
  it("allows the real 404 document only with both noindex directives", () => {
    const notFound = {
      ...ready,
      canonicalHref: "https://drainbearhk.com/404",
      heading: "找不到頁面",
      robots: "noindex, follow",
      googlebot: "noindex, follow",
    };
    expect(assessPrerenderSnapshot(notFound, "/404").ready).toBe(true);
    expect(
      assessPrerenderSnapshot(
        { ...notFound, robots: "index, follow" },
        "/404"
      ).ready
    ).toBe(false);
  });
});
