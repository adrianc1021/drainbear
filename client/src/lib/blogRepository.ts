import {
  BLOG_POSTS,
  getPostBySlug,
  type BlogPost as StaticBlogPost,
} from "@/lib/blogData";
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/sanity/queries";
import type {
  SanityBlogBodyBlock,
  SanityBlogPost,
  SanityImageData,
  SeoData,
} from "@/lib/sanity/types";

const CATEGORY_LABELS: Record<string, string> = {
  "home-prevention": "家居防塞",
  emergency: "緊急應對",
  myths: "通渠迷思",
  commercial: "商業渠務",
  "village-house": "村屋渠務",
  building: "大廈渠務",
  technology: "渠務科技",
};

export interface BlogPostView {
  source: "sanity" | "static";
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  updatedAt?: string;
  readMins: number;
  excerpt: string;
  keywords: string[];
  featured: boolean;
  coverImage?: SanityImageData;
  seo?: SeoData;
  body?: SanityBlogBodyBlock[];
  sections?: StaticBlogPost["sections"];
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category ?? "未分類";
}

export function mapSanityBlogPost(post: SanityBlogPost): BlogPostView {
  return {
    source: "sanity",
    id: post._id,
    slug: post.slug,
    title: post.title,
    category: getCategoryLabel(post.category),
    date: post.publishedAt,
    updatedAt: post.updatedAt,
    readMins: post.readMins,
    excerpt: post.excerpt,
    keywords: post.seo?.focusKeywords ?? [],
    featured: Boolean(post.featured),
    coverImage: post.coverImage,
    seo: post.seo,
    body: post.body ?? [],
  };
}

export function mapStaticBlogPost(post: StaticBlogPost): BlogPostView {
  return {
    source: "static",
    id: `static-${post.slug}`,
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: post.date,
    readMins: post.readMins,
    excerpt: post.excerpt,
    keywords: post.keywords,
    featured: false,
    sections: post.sections,
  };
}

export function getStaticBlogPosts(): BlogPostView[] {
  return BLOG_POSTS.map(mapStaticBlogPost);
}

export function getStaticBlogPostBySlug(slug: string): BlogPostView | null {
  const post = getPostBySlug(slug);
  return post ? mapStaticBlogPost(post) : null;
}

export function mergeBlogPosts(sanityPosts: SanityBlogPost[]): BlogPostView[] {
  const merged = new Map<string, BlogPostView>();

  for (const sanityPost of sanityPosts) {
    if (!sanityPost.slug) continue;

    const key = sanityPost.slug.trim().toLowerCase();
    if (!key) continue;

    merged.set(key, mapSanityBlogPost(sanityPost));
  }

  for (const staticPost of BLOG_POSTS) {
    const key = staticPost.slug.trim().toLowerCase();
    if (!key || merged.has(key)) continue;

    merged.set(key, mapStaticBlogPost(staticPost));
  }

  return Array.from(merged.values()).sort((a, b) => {
    const featuredDifference = Number(b.featured) - Number(a.featured);

    if (featuredDifference !== 0) {
      return featuredDifference;
    }

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function fetchBlogPosts(): Promise<BlogPostView[]> {
  const sanityPosts = await getPublishedBlogPosts();
  return mergeBlogPosts(sanityPosts ?? []);
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPostView | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) return null;

  const sanityPost = await getPublishedBlogPostBySlug(normalizedSlug);

  if (sanityPost) {
    return mapSanityBlogPost(sanityPost);
  }

  return getStaticBlogPostBySlug(normalizedSlug);
}
