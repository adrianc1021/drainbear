import { sanityClient, sanityFreshClient } from "./client";
import type { PageSeo, SanityBlogPost, SiteSettings } from "./types";

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    businessName,
    siteUrl,
    businessDescription,
    phoneDisplay,
    phoneE164,
    whatsappNumber,
    whatsappDefaultMessage,
    instagramUrl,
    googleBusinessUrl,
    featuredBlogCount,
    featuredCaseCount,
    "defaultOgImage": defaultOgImage {
      alt,
      "url": asset->url
    },
    "defaultSeo": defaultSeo {
      metaTitle,
      metaDescription,
      focusKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      noIndex,
      "ogImage": ogImage {
        alt,
        "url": asset->url
      }
    }
  }
`;

export const pageSeoByPathQuery = `
  *[_type == "pageSeo" && path == $path][0] {
    name,
    path,
    "seo": seo {
      metaTitle,
      metaDescription,
      focusKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      noIndex,
      "ogImage": ogImage {
        alt,
        "url": asset->url
      }
    }
  }
`;

const blogPostFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  "coverImage": coverImage {
    alt,
    caption,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  body[] {
    ...,
    _type == "articleImage" => {
      ...,
      alt,
      caption,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  publishedAt,
  "updatedAt": coalesce(updatedAt, _updatedAt, publishedAt),
  authorName,
  reviewerName,
  readMins,
  featured,
  instagramUrl,
  "seo": seo {
    metaTitle,
    metaDescription,
    focusKeywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    noIndex,
    "ogImage": ogImage {
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`;

export const publishedBlogPostsQuery = `
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc) {
    ${blogPostFields}
  }
`;

export const publishedBlogPostBySlugQuery = `
  *[
    _type == "blogPost" &&
    slug.current == $slug &&
    defined(publishedAt) &&
    publishedAt <= now()
  ][0] {
    ${blogPostFields}
  }
`;

export const latestPublishedBlogPostsQuery = `
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    publishedAt,
    "updatedAt": coalesce(updatedAt, _updatedAt, publishedAt),
    authorName,
    reviewerName,
    readMins,
    featured
  }
`;

export function getSiteSettings() {
  return sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);
}

export function getPageSeo(path: string) {
  return sanityClient.fetch<PageSeo | null>(pageSeoByPathQuery, { path });
}

export function getPublishedBlogPosts() {
  return sanityClient.fetch<SanityBlogPost[]>(publishedBlogPostsQuery);
}

export function getLatestPublishedBlogPosts() {
  return sanityFreshClient.fetch<SanityBlogPost[]>(
    latestPublishedBlogPostsQuery
  );
}

export function getPublishedBlogPostBySlug(slug: string) {
  return sanityClient.fetch<SanityBlogPost | null>(
    publishedBlogPostBySlugQuery,
    { slug }
  );
}
