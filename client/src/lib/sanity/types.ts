import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImageData {
  url?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SanityImageData;
  noIndex?: boolean;
}

export interface SiteSettings {
  businessName: string;
  siteUrl: string;
  businessDescription: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  instagramUrl?: string;
  googleBusinessUrl?: string;
  featuredBlogCount: number;
  featuredCaseCount: number;
  defaultOgImage?: SanityImageData;
  defaultSeo: SeoData;
}

export interface PageSeo {
  name: string;
  path: string;
  seo: SeoData;
}

export interface SanityArticleImage {
  _type: "articleImage";
  _key: string;
  url?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface SanityExpertTip {
  _type: "expertTip";
  _key: string;
  title: string;
  text: string;
}

export type SanityBlogBodyBlock =
  | PortableTextBlock
  | SanityArticleImage
  | SanityExpertTip;

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage?: SanityImageData;
  body?: SanityBlogBodyBlock[];
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  reviewerName?: string;
  readMins: number;
  featured?: boolean;
  instagramUrl?: string;
  seo: SeoData;
}
