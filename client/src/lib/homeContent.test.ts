import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";
import { describe, expect, it, vi } from "vitest";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import Home from "@/pages/Home";

// The network-backed hooks are the boundary: keep the real page, contact
// settings, routing and image URL handling. Fixtures are not real case claims.
const content = vi.hoisted(() => ({
  studies: [] as any[],
  posts: [] as any[],
}));
vi.mock("@/lib/useCases", () => ({
  useFeaturedCaseStudies: () => ({
    studies: content.studies,
    isLoading: false,
    error: null,
  }),
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
  it("makes all seven service destinations crawlable without depending on a click handler", () => {
    const html = renderHome();
    for (const slug of [
      "toilet-unblocking",
      "bathroom-drain-unblocking",
      "kitchen-sink-unblocking",
      "sewage-backflow",
      "main-drain-manhole",
      "high-pressure-jetting",
      "cctv-drain-inspection",
    ]) {
      expect(html).toContain(`href="/services/${slug}"`);
    }
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('href="https://wa.me/85295588260?');
    expect(html).toContain('href="tel:+85295588260"');
  });

  it("shows available case evidence with its own image, date and destination", () => {
    content.studies = [
      {
        _id: "test-case",
        title: "測試用案例",
        slug: "test-case",
        district: "觀塘",
        serviceType: "commercial",
        serviceLabel: "商業通渠",
        projectDate: "2026-09-01",
        summary: "測試摘要",
        problem: "測試問題",
        workPerformed: "測試工序",
        result: "測試結果",
        coverImage: {
          url: "https://cdn.sanity.io/images/test/production/case.jpg",
          alt: "測試案例相片",
          width: 1200,
          height: 800,
        },
      },
    ];
    const html = renderHome();
    expect(html).toContain('href="/cases/test-case"');
    expect(html).toContain('alt="測試案例相片"');
    expect(html).toContain("2026年9月");
    expect(html).toContain("/case.jpg?auto=format");
    content.studies = [];
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
