import { describe, expect, it } from "vitest";
import { mapSanityBlogPost } from "./blogRepository";
import {
  applyQueryIntentRevision,
  queryIntentDate,
} from "./queryIntentRevision";
import type { SanityBlogPost } from "./sanity/types";

describe("query-led editorial additions", () => {
  it.each([
    "why-not-drain-cleaner",
    "cctv-drain-inspection-hong-kong-guide",
    "building-main-drain-vs-unit-branch-pipe",
    "high-pressure-drain-cleaning-vs-spring-machine",
  ])("preserves original CMS content and publication for %s", slug => {
    const source = {
      _id: "original",
      slug,
      title: "原題",
      excerpt: "原摘要",
      category: "home-prevention",
      publishedAt: "2026-08-10",
      updatedAt: "2026-09-01",
      coverImage: { url: "/original.webp" },
      body: [
        {
          _type: "block",
          _key: "original",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "原有施工內容與來源。",
            },
          ],
          markDefs: [],
        },
      ],
    } as unknown as SanityBlogPost;
    const saved = structuredClone(source);
    const post = mapSanityBlogPost(source);
    expect(source).toEqual(saved);
    expect(post.date).toBe(source.publishedAt);
    expect(post.coverImage).toEqual(source.coverImage);
    expect(JSON.stringify(post.body)).toContain("原有施工內容與來源。");
    expect(post.updatedAt).toBe("2026-10-26");
    expect(post.seo?.metaTitle).toBe(post.title);
    const oldFaq = { question: "原有問題", answer: "原有答案" };
    expect(
      applyQueryIntentRevision({ ...post, faqs: [oldFaq] }).faqs?.[0]
    ).toEqual(oldFaq);
    expect(applyQueryIntentRevision(post).faqs).toEqual(post.faqs);
  });
  it("does not backdate later content or revise unrelated pages", () => {
    expect(queryIntentDate("why-not-drain-cleaner", "2026-10-27")).toBe(
      "2026-10-27"
    );
    expect(queryIntentDate("unrelated", "2026-09-01")).toBe("2026-09-01");
  });
});
