import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";
import { describe, expect, it, vi } from "vitest";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import Home from "@/pages/Home";

// The network-backed article hook is the boundary: keep the real page,
// contact settings, routing and image URL handling.
const content = vi.hoisted(() => ({
  posts: [] as any[],
}));
vi.mock("@/lib/useBlog", () => ({
  useLatestBlogPosts: () => ({
    posts: content.posts,
    isLoading: false,
    isFallback: false,
    error: null,
  }),
}));

function renderHome() {
  return renderToStaticMarkup(
    React.createElement(
      Router,
      { ssrPath: "/" },
      React.createElement(SiteSettingsProvider, null, React.createElement(Home))
    )
  );
}

describe("homepage content and discovery", () => {
  it("keeps the focused conversion sections and removes the former information-heavy bands", () => {
    const html = renderHome();
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('href="https://wa.me/85295588260?');
    expect(html).toContain('href="tel:+85295588260"');
    for (const section of [
      "promise",
      "photo-quote",
      "process",
      "journal",
      "faq",
      "final-cta",
    ]) {
      expect(html).toContain(`data-pr20-section="${section}"`);
    }
    for (const removedSection of [
      "quick-service",
      "diagnosis-story",
      "cases",
      "method-comparison",
      "field-evidence",
      "capability",
    ]) {
      expect(html).not.toContain(`data-pr20-section="${removedSection}"`);
    }
  });

  it("uses available CMS article covers at responsive sizes and leaves static posts usable without an image", () => {
    content.posts = [
      {
        source: "sanity",
        id: "test-post",
        slug: "test-post",
        title: "測試文章",
        category: "家居防塞",
        date: "2026-09-02",
        authorName: "測試作者",
        readMins: 4,
        excerpt: "測試摘要",
        featured: false,
        keywords: [],
        coverImage: {
          url: "https://cdn.sanity.io/images/test/production/blog.jpg",
          alt: "測試文章封面",
          width: 1200,
          height: 800,
        },
      },
      {
        source: "static",
        id: "test-static",
        slug: "test-static",
        title: "沒有圖片的文章",
        category: "家居防塞",
        date: "2026-09-01",
        authorName: "測試作者",
        readMins: 3,
        excerpt: "測試摘要",
        featured: false,
        keywords: [],
      },
    ];
    const html = renderHome();
    expect(html).toContain('href="/blog/test-post"');
    expect(html).toContain('href="/blog/test-static"');
    expect(html).toContain('alt="測試文章封面"');
    expect(html).toContain("srcSet=");
    expect(html).not.toContain('src="undefined"');
    expect(html).not.toContain('src=""');
    content.posts = [];
  });
});
