export interface SanityImageData {
  url?: string;
  alt?: string;
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
