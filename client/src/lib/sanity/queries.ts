import { sanityClient, sanityFreshClient } from "./client";
import type {
  PageSeo,
  SanityBlogPost,
  SanityCaseStudy,
  SiteSettings,
} from "./types";

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

const caseStudyFields = `
  _id,
  "updatedAt": _updatedAt,
  title,
  "slug": slug.current,
  district,
  serviceType,
  projectDate,
  summary,
  problem,
  workPerformed,
  result,
  arrivalMinutes,
  durationMinutes,
  equipmentUsed,
  "coverImage": coverImage {
    alt,
    caption,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  "beforeImages": beforeImages[] {
    alt,
    caption,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  "afterImages": afterImages[] {
    alt,
    caption,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  featured,
  homepageOrder,
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

export const publishedCaseStudiesQuery = `
  *[
    _type == "caseStudy" &&
    defined(slug.current) &&
    defined(projectDate) &&
    coalesce(seo.noIndex, false) == false
  ] | order(projectDate desc) {
    ${caseStudyFields}
  }
`;

export const featuredCaseStudiesQuery = `
  *[
    _type == "caseStudy" &&
    featured == true &&
    defined(slug.current) &&
    defined(projectDate) &&
    coalesce(seo.noIndex, false) == false
  ] | order(coalesce(homepageOrder, 999) asc, projectDate desc)[0...$limit] {
    ${caseStudyFields}
  }
`;

export const publishedCaseStudyBySlugQuery = `
  *[
    _type == "caseStudy" &&
    slug.current == $slug &&
    defined(projectDate) &&
    coalesce(seo.noIndex, false) == false
  ][0] {
    ${caseStudyFields}
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

export function getPublishedCaseStudies() {
  return sanityFreshClient.fetch<SanityCaseStudy[]>(publishedCaseStudiesQuery);
}

export function getFeaturedCaseStudies(limit = 3) {
  return sanityFreshClient.fetch<SanityCaseStudy[]>(
    featuredCaseStudiesQuery,
    { limit }
  );
}

export function getPublishedCaseStudyBySlug(slug: string) {
  return sanityFreshClient.fetch<SanityCaseStudy | null>(
    publishedCaseStudyBySlugQuery,
    { slug }
  );
}
