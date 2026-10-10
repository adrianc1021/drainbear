import { describe, expect, it } from "vitest";
import {
  mapSanityBlogPost,
  mergeBlogPosts,
  getStaticBlogPostBySlug,
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
    expect(direct.updatedAt).toBe("2026-10-11");
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
});
