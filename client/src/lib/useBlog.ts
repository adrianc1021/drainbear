import { useEffect, useState } from "react";
import {
  fetchBlogPostBySlug,
  fetchBlogPosts,
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
