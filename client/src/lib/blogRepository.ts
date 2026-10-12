import { PRICE_GUIDE_REVISION } from "./priceGuideRevision";
import { KITCHEN_PREVENTION_REVISION } from "./kitchenPreventionRevision";
import {
  BODY_REVISION_SLUGS,
  BLOG_BODY_REVISION_DATE,
  WASHING_MACHINE_MESSAGE,
  latestEditorialDate,
  reviseBlogBody,
} from "./blogBodyRevisions";
import { ARTICLE_SERVICE_LINKS } from "./contentConnections";
import {
  BLOG_POSTS,
  getPostBySlug,
  type BlogPost as StaticBlogPost,
} from "@/lib/blogData";
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
  authorName: string;
  reviewerName?: string;
  readMins: number;
  excerpt: string;
  keywords: string[];
  featured: boolean;
  coverImage?: SanityImageData;
  seo?: SeoData;
  body?: SanityBlogBodyBlock[];
  sections?: StaticBlogPost["sections"];
  resourceLinks?: StaticBlogPost["resourceLinks"];
  faqs?: StaticBlogPost["faqs"];
  relatedSlugs?: StaticBlogPost["relatedSlugs"];
  whatsappMessage?: string;
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category ?? "未分類";
}

export function mapSanityBlogPost(post: SanityBlogPost): BlogPostView {
  if (post.slug === PRICE_GUIDE_REVISION.slug) {
    return {
      ...mapStaticBlogPost(PRICE_GUIDE_REVISION),
      id: post._id,
      date: post.publishedAt,
    };
  }
  if (post.slug === KITCHEN_PREVENTION_REVISION.slug) {
    return {
      ...mapStaticBlogPost(KITCHEN_PREVENTION_REVISION),
      id: post._id,
      date: post.publishedAt,
      updatedAt: latestEditorialDate(
        post.updatedAt,
        KITCHEN_PREVENTION_REVISION.updatedAt!
      ),
      coverImage: post.coverImage ?? KITCHEN_PREVENTION_REVISION.coverImage,
    };
  }
  return {
    source: "sanity",
    id: post._id,
    slug: post.slug,
    title: post.title,
    category: getCategoryLabel(post.category),
    date: post.publishedAt,
    updatedAt: BODY_REVISION_SLUGS.includes(post.slug)
      ? latestEditorialDate(post.updatedAt, BLOG_BODY_REVISION_DATE)
      : post.updatedAt,
    authorName: post.authorName?.trim() || "通渠熊編輯團隊",
    reviewerName: BODY_REVISION_SLUGS.includes(post.slug)
      ? ""
      : post.reviewerName?.trim() || "通渠熊渠務團隊",
    readMins: post.readMins,
    excerpt: post.excerpt,
    keywords: post.seo?.focusKeywords ?? [],
    featured: Boolean(post.featured),
    coverImage: post.coverImage,
    seo: post.seo,
    body: reviseBlogBody(post.slug, post.body ?? []),
    resourceLinks: ARTICLE_SERVICE_LINKS[post.slug],
    whatsappMessage:
      post.slug === "washing-machine-drain-backflow-causes-fixes"
        ? WASHING_MACHINE_MESSAGE
        : undefined,
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
    updatedAt: post.updatedAt,
    authorName: post.authorName ?? "通渠熊編輯團隊",
    reviewerName: post.reviewerName ?? "通渠熊渠務團隊",
    readMins: post.readMins,
    excerpt: post.excerpt,
    keywords: post.keywords,
    featured: Boolean(post.featured),
    coverImage: post.coverImage,
    sections: post.sections,
    resourceLinks: post.resourceLinks ?? ARTICLE_SERVICE_LINKS[post.slug],
    faqs: post.faqs,
    relatedSlugs: post.relatedSlugs,
    whatsappMessage: post.whatsappMessage,
  };
}

export function getStaticBlogPosts(): BlogPostView[] {
  return BLOG_POSTS.map(mapStaticBlogPost);
}

export function getLatestStaticBlogPosts(limit: number): BlogPostView[] {
  return getStaticBlogPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
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

export function mergeLatestBlogPosts(
  sanityPosts: SanityBlogPost[],
  limit: number
): BlogPostView[] {
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

  return Array.from(merged.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function fetchBlogPosts(): Promise<BlogPostView[]> {
  const { getPublishedBlogPosts } = await import("@/lib/sanity/queries");
  const sanityPosts = await getPublishedBlogPosts();
  return mergeBlogPosts(sanityPosts ?? []);
}

export async function fetchLatestBlogPosts(
  limit: number
): Promise<BlogPostView[]> {
  const { getLatestPublishedBlogPosts } = await import("@/lib/sanity/queries");
  const sanityPosts = await getLatestPublishedBlogPosts();
  return mergeLatestBlogPosts(sanityPosts ?? [], limit);
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPostView | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) return null;

  const { getPublishedBlogPostBySlug } = await import("@/lib/sanity/queries");
  const sanityPost = await getPublishedBlogPostBySlug(normalizedSlug);

  if (sanityPost) {
    return mapSanityBlogPost(sanityPost);
  }

  return getStaticBlogPostBySlug(normalizedSlug);
}
