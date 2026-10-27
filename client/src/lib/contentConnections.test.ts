import { describe, expect, it } from "vitest";
import {
  getArticleResourceLinks,
  contentConnectionDate,
  SERVICE_TOPIC_ARTICLES,
} from "./contentConnections";
import { mapSanityBlogPost, mapStaticBlogPost } from "./blogRepository";
import { SERVICE_SLUGS } from "../../../shared/publicRoutes";

describe("contextual article/service connections", () => {
  it("preserves editorial links and labels while removing repeated destinations", () => {
    const links = getArticleResourceLinks("restaurant-grease-trap-guide", [
      { label: "原有指定文案", href: "/services/grease-trap-cleaning" },
      { label: "原有案例", href: "/cases" },
    ]);
    expect(
      links.filter(x => x.href === "/services/grease-trap-cleaning")
    ).toEqual([
      { label: "原有指定文案", href: "/services/grease-trap-cleaning" },
    ]);
    expect(links.some(x => x.href === "/cases")).toBe(true);
    expect(links.some(x => x.href === "/services/high-pressure-jetting")).toBe(
      true
    );
    for (const topic of SERVICE_TOPIC_ARTICLES)
      for (const service of topic.services)
        expect(SERVICE_SLUGS).toContain(service);
  });
  it("keeps published dates and source bodies while applying the same revision to CMS and fallback", () => {
    const common = {
      slug: "restaurant-grease-trap-guide",
      title: "原有文章",
      category: "commercial",
      excerpt: "原有摘要",
      readMins: 4,
      updatedAt: "2026-09-01",
    };
    const cms = mapSanityBlogPost({
      ...common,
      _id: "published",
      publishedAt: "2026-08-01",
      body: [],
    });
    const fallback = mapStaticBlogPost({
      ...common,
      date: "2026-08-01",
      keywords: [],
      sections: [],
    });
    expect(cms.date).toBe("2026-08-01");
    expect(cms.body).toEqual([]);
    expect(cms.updatedAt).toBe("2026-10-27");
    expect(fallback.updatedAt).toBe(cms.updatedAt);
    expect(fallback.resourceLinks).toEqual(cms.resourceLinks);
    expect(contentConnectionDate(common.slug, "2026-11-01")).toBe("2026-11-01");
    expect(contentConnectionDate("unrelated", "2026-09-01")).toBe("2026-09-01");
    expect(getArticleResourceLinks("unrelated")).toEqual([]);
    expect(getArticleResourceLinks("prevent-kitchen-sink-clog", [])).toEqual(
      []
    );
  });
});
