import { describe, expect, it } from "vitest";
import {
  mapSanityBlogPost,
  mergeBlogPosts,
  getStaticBlogPostBySlug,
  mapStaticBlogPost,
} from "./blogRepository";
import type { SanityBlogPost } from "./sanity/types";

const original: SanityBlogPost = {
  _id: "published-price-guide",
  slug: "hong-kong-drain-cleaning-price-guide",
  title: "Old price table",
  category: "myths",
  excerpt: "Old fee policy",
  publishedAt: "2026-08-10T00:00:00Z",
  updatedAt: "2026-08-19T00:00:00Z",
  readMins: 8,
  seo: { metaTitle: "Old price table", metaDescription: "Old fee policy" },
  body: [
    {
      _type: "block",
      _key: "old",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: "s", text: "數百元起", marks: [] }],
    },
  ],
};

describe("published editorial revision", () => {
  it("keeps one current price guide across CMS lists, detail mapping and fallback", () => {
    const direct = mapSanityBlogPost(original),
      list = mergeBlogPosts([original]).filter(
        post => post.slug === original.slug
      ),
      fallback = getStaticBlogPostBySlug(original.slug)!;
    expect(list).toHaveLength(1);
    expect(list[0].sections).toEqual(direct.sections);
    expect(direct.sections).toEqual(fallback.sections);
    expect(direct.date).toBe(original.publishedAt);
    expect(direct.updatedAt).toBe("2026-10-24");
    expect(JSON.stringify(direct)).toContain("HK$300 起");
    expect(direct.seo?.metaTitle).not.toBe(original.seo.metaTitle);
    expect(JSON.stringify(direct)).not.toContain("數百元起");
    expect(direct.reviewerName).toBe("");
    expect(direct.faqs).toHaveLength(3);
    expect(direct.resourceLinks?.some(link => link.href === "/guide")).toBe(
      true
    );
  });
  it("retains unrelated CMS editorial content", () => {
    const unrelated = { ...original, slug: "another-article" };
    const mapped = mapSanityBlogPost(unrelated);
    expect(mapped.body).toEqual(unrelated.body);
    expect(mapped.seo).toEqual(unrelated.seo);
    expect(mapped.updatedAt).toBe(unrelated.updatedAt);
  });
  it("requires explicit reviewer data instead of inventing a team review", () => {
    const unrelated = { ...original, slug: "another-article" };
    expect(mapSanityBlogPost(unrelated).reviewerName).toBe("");
    expect(
      mapSanityBlogPost({ ...unrelated, reviewerName: "  已確認審閱單位  " })
        .reviewerName
    ).toBe("已確認審閱單位");
    const staticPost = {
      slug: "unrelated-guide",
      title: "示例文章",
      category: "家居防塞",
      date: "2026-07-05",
      readMins: 3,
      excerpt: "摘要",
      keywords: [],
      sections: [],
    };
    expect(mapStaticBlogPost(staticPost).reviewerName).toBe("");
    expect(
      mapStaticBlogPost({ ...staticPost, reviewerName: "已確認審閱單位" })
        .reviewerName
    ).toBe("已確認審閱單位");
  });
  it("uses a concise basin website revision without mutating CMS or publication dates", () => {
    const cms = {
      ...original,
      slug: "slow-basin-drain-causes-solutions",
      reviewerName: "舊稿審閱單位",
    };
    const saved = structuredClone(cms);
    const mapped = mapSanityBlogPost(cms);
    expect(cms).toEqual(saved);
    expect(mapped.body).toBeUndefined();
    expect(mapped.sections?.length).toBeGreaterThan(0);
    expect(mapped.date).toBe(cms.publishedAt);
    expect(mapped.updatedAt).toBe("2026-10-26");
    expect(mapped.inquiryScenario).toBeUndefined();
    expect(mapped.whatsappMessage).toContain("洗手盆去水慢");
    expect(mapped.reviewerName).toBe("");
    expect(
      mapSanityBlogPost({ ...cms, updatedAt: "2026-10-26" }).updatedAt
    ).toBe("2026-10-26");
    expect(
      mapSanityBlogPost({ ...cms, slug: "unrelated-guide" }).inquiryScenario
    ).toBeUndefined();
    const toilet = getStaticBlogPostBySlug("toilet-clog-emergency-guide")!;
    expect(toilet.date).toBe("2026-07-05");
    expect(toilet.inquiryScenario).toBeDefined();
    expect(JSON.stringify(toilet)).not.toContain("一次過斷症根治");
  });
});
