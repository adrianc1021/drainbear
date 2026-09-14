import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import CaseStudies from "@/pages/CaseStudies";
import { getLatestStaticBlogPosts } from "./blogRepository";

const state = vi.hoisted(() => ({
  article: { isLoading: false, error: null as Error | null },
  list: { isLoading: false, error: null as Error | null },
  cases: { isLoading: false, error: null as Error | null },
}));
vi.mock("./useBlog", async () => {
  const { getLatestStaticBlogPosts } = await import("./blogRepository");
  return {
    useBlogPosts: () => ({
      ...state.list,
      posts: getLatestStaticBlogPosts(3),
      isFallback: Boolean(state.list.error),
    }),
    useBlogPost: () => ({
      ...state.article,
      post: getLatestStaticBlogPosts(1)[0],
      isNotFound: false,
      isFallback: Boolean(state.article.error),
    }),
  };
});
vi.mock("./useCases", () => ({
  useCaseStudies: () => ({ ...state.cases, studies: [] }),
}));

function render(Component: React.ComponentType) {
  return renderToStaticMarkup(
    React.createElement(
      Router,
      { ssrPath: "/blog" },
      React.createElement(
        SiteSettingsProvider,
        null,
        React.createElement(Component)
      )
    )
  );
}

beforeEach(() => {
  for (const source of Object.values(state)) {
    source.isLoading = false;
    source.error = null;
  }
});

describe("published content readiness on article and case routes", () => {
  for (const [name, Component, source] of [
    ["blog", Blog, state.list],
    ["article", BlogPost, state.article],
    ["cases", CaseStudies, state.cases],
  ] as const) {
    it(`${name} prevents incomplete CMS content being captured while retaining usable fallback content`, () => {
      source.isLoading = true;
      expect(render(Component)).toContain('data-cms-loading="true"');
      source.isLoading = false;
      source.error = new Error("CMS unavailable");
      const html = render(Component);
      expect(html).toContain('data-cms-error="true"');
      expect(html).toContain("<h1");
      if (name === "article")
        expect(html).toContain(getLatestStaticBlogPosts(1)[0].title);
      source.error = null;
      expect(render(Component)).toContain('data-cms-error="false"');
    });
  }

  it("keeps an otherwise loaded article unready while related articles are still loading", () => {
    state.list.isLoading = true;
    const html = render(BlogPost);
    expect(html).toContain('data-cms-loading="true"');
    expect(html).toContain('data-cms-error="false"');
    expect(html).toContain(getLatestStaticBlogPosts(1)[0].title);
  });

  it("rejects incomplete related content even when the primary article loaded successfully", () => {
    state.list.error = new Error("Related articles unavailable");
    const html = render(BlogPost);
    expect(html).toContain('data-cms-loading="false"');
    expect(html).toContain('data-cms-error="true"');
    expect(html).toContain(getLatestStaticBlogPosts(1)[0].title);
  });

  it("marks the article ready only when both independent CMS reads succeeded", () => {
    const html = render(BlogPost);
    expect(html).toContain('data-cms-loading="false"');
    expect(html).toContain('data-cms-error="false"');
  });
});
