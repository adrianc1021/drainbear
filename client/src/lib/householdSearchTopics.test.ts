import { describe, expect, it } from "vitest";
import {
  HOUSEHOLD_SEARCH_TOPICS,
  householdTopicDate,
} from "./householdSearchTopics";
import { mapSanityBlogPost, getStaticBlogPostBySlug } from "./blogRepository";
import type { SanityBlogPost } from "./sanity/types";

describe("household search series", () => {
  it.each(HOUSEHOLD_SEARCH_TOPICS)(
    "keeps CMS publication, images and body for $slug while revising searchable fields",
    topic => {
      const original = {
        _id: "example",
        slug: topic.slug,
        title: "old",
        excerpt: "old",
        category: "home-prevention",
        publishedAt: "2026-07-05",
        updatedAt: "2026-08-01",
        readMins: 4,
        seo: { metaTitle: "old", metaDescription: "old" },
        coverImage: { url: "https://cdn.sanity.io/example.webp" },
        body: [
          {
            _type: "block",
            _key: "original",
            style: "normal",
            markDefs: [],
            children: [
              {
                _type: "span",
                _key: "s",
                text: "原有工程內容與連結保留。",
                marks: [],
              },
            ],
          },
        ],
      } as SanityBlogPost;
      const copy = structuredClone(original),
        mapped = mapSanityBlogPost(original);
      expect(original).toEqual(copy);
      expect(mapped.body).toEqual(original.body);
      expect(mapped.date).toBe(original.publishedAt);
      expect(mapped.coverImage).toEqual(original.coverImage);
      expect(mapped.title).toBe(topic.title);
      expect(mapped.seo?.metaDescription).toBe(topic.description);
      expect(mapped.updatedAt).toBe("2026-10-24");
      expect(mapped.faqs).toHaveLength(4);
      expect(mapped.reviewerName).toBe("");
    }
  );
  it("preserves newer revisions and unrelated dates", () => {
    expect(
      householdTopicDate("slow-basin-drain-causes-solutions", "2026-10-25")
    ).toBe("2026-10-25");
    expect(householdTopicDate("other", "2026-08-01")).toBe("2026-08-01");
  });
  it("removes unsupported hair-clog claims while retaining heading-anchored illustrations", () => {
    const post = getStaticBlogPostBySlug("bathroom-hair-clog-prevention")!;
    expect(JSON.stringify(post)).not.toMatch(/九成|全程五分鐘|即刻少一半/);
    expect(
      post.sections?.filter(s => s.type === "image").length
    ).toBeGreaterThanOrEqual(2);
    expect(post.faqs).toHaveLength(4);
  });
});
