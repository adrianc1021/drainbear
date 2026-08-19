import { useEffect, useState } from "react";
import {
  fetchBlogPostBySlug,
  fetchBlogPosts,
  fetchLatestBlogPosts,
  getLatestStaticBlogPosts,
  getStaticBlogPostBySlug,
  getStaticBlogPosts,
  type BlogPostView,
} from "@/lib/blogRepository";

interface BlogListState {
  posts: BlogPostView[];
  isLoading: boolean;
  isFallback: boolean;
  error: Error | null;
}

interface BlogPostState {
  post: BlogPostView | null;
  isLoading: boolean;
  isFallback: boolean;
  isNotFound: boolean;
  error: Error | null;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("無法讀取Blog文章");
}

export function useBlogPosts(): BlogListState {
  const [state, setState] = useState<BlogListState>({
    posts: getStaticBlogPosts(),
    isLoading: true,
    isFallback: false,
    error: null,
  });

  useEffect(() => {
    let active = true;

    fetchBlogPosts()
      .then(posts => {
        if (!active) return;

        setState({
          posts: posts.length > 0 ? posts : getStaticBlogPosts(),
          isLoading: false,
          isFallback: posts.length === 0,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;

        setState({
          posts: getStaticBlogPosts(),
          isLoading: false,
          isFallback: true,
          error: toError(error),
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

const LATEST_BLOG_REFRESH_MS = 60_000;

export function useLatestBlogPosts(limit = 3): BlogListState {
  const [state, setState] = useState<BlogListState>(() => ({
    posts: getLatestStaticBlogPosts(limit),
    isLoading: true,
    isFallback: false,
    error: null,
  }));

  useEffect(() => {
    let active = true;
    let requestId = 0;

    const refresh = async () => {
      const currentRequestId = ++requestId;

      try {
        const posts = await fetchLatestBlogPosts(limit);
        if (!active || currentRequestId !== requestId) return;

        setState({
          posts: posts.length > 0 ? posts : getLatestStaticBlogPosts(limit),
          isLoading: false,
          isFallback: posts.length === 0,
          error: null,
        });
      } catch (error: unknown) {
        if (!active || currentRequestId !== requestId) return;

        setState(previous => ({
          posts:
            previous.posts.length > 0
              ? previous.posts
              : getLatestStaticBlogPosts(limit),
          isLoading: false,
          isFallback: true,
          error: toError(error),
        }));
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    void refresh();
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    const intervalId = window.setInterval(
      refreshWhenVisible,
      LATEST_BLOG_REFRESH_MS
    );

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [limit]);

  return state;
}

export function useBlogPost(slug: string): BlogPostState {
  const staticPost = getStaticBlogPostBySlug(slug);

  const [state, setState] = useState<BlogPostState>({
    post: staticPost,
    isLoading: true,
    isFallback: false,
    isNotFound: false,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const fallbackPost = getStaticBlogPostBySlug(slug);

    setState({
      post: fallbackPost,
      isLoading: true,
      isFallback: false,
      isNotFound: false,
      error: null,
    });

    fetchBlogPostBySlug(slug)
      .then(post => {
        if (!active) return;

        setState({
          post,
          isLoading: false,
          isFallback: false,
          isNotFound: !post,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;

        setState({
          post: fallbackPost,
          isLoading: false,
          isFallback: Boolean(fallbackPost),
          isNotFound: false,
          error: toError(error),
        });
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}
