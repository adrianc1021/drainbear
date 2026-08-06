import {sanityClient} from "./client";
import type {PageSeo, SiteSettings} from "./types";

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

export function getSiteSettings() {
  return sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);
}

export function getPageSeo(path: string) {
  return sanityClient.fetch<PageSeo | null>(pageSeoByPathQuery, {path});
}
