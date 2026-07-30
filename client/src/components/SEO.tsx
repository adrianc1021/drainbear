/**
 * 通渠熊 DrainBear — SEO 元件
 * 每頁獨立 title / description / canonical / Open Graph / JSON-LD
 */
import { useEffect } from "react";
import {
  BUSINESS_ID,
  BUSINESS_NAME,
  DEFAULT_OG_IMAGE,
  PHONE_E164,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/config/site";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string) {
  document.head
    .querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
    ?.remove();
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);
}

function setJsonLd(id: string, data: object | object[]) {
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.id = id;
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: object | object[];
  keywords?: string;
  image?: string;
  type?: "website" | "article";
  breadcrumbs?: {
    name: string;
    path: string;
  }[];
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  path,
  jsonLd,
  keywords,
  image,
  type = "website",
  breadcrumbs,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const cleanPath = path.split(/[?#]/)[0] || "/";
    const pageUrl = absoluteUrl(cleanPath);
    const socialImage = absoluteUrl(image || DEFAULT_OG_IMAGE);

    document.documentElement.lang = "zh-Hant-HK";
    document.title = title;

    setMeta("name", "description", description);

    if (keywords) {
      setMeta("name", "keywords", keywords);
    } else {
      removeMeta("name", "keywords");
    }

    setMeta(
      "name",
      "robots",
      noindex ? "noindex, follow" : "index, follow, max-image-preview:large"
    );

    setMeta(
      "name",
      "googlebot",
      noindex ? "noindex, follow" : "index, follow, max-image-preview:large"
    );

    setCanonical(pageUrl);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "zh_HK");
    setMeta("property", "og:image", socialImage);
    setMeta("property", "og:image:alt", `${BUSINESS_NAME}｜香港專業通渠服務`);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", socialImage);

    // 全站統一商家實體。
    // 暫時使用Organization，避免提供未核實或不完整地址。
    setJsonLd("jsonld-business", {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": BUSINESS_ID,
      name: BUSINESS_NAME,
      alternateName: [SITE_NAME, "DrainBear"],
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon-512x512.png"),
        width: 512,
        height: 512,
      },
      image: socialImage,
      description:
        "香港24小時專業通渠服務，提供住宅及商業通渠、高壓水槍洗渠、CCTV照喉、隔油池及沙井處理。",
      telephone: PHONE_E164,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: PHONE_E164,
        contactType: "customer service",
        areaServed: "HK",
        availableLanguage: ["zh-Hant", "zh-HK", "en"],
      },
      areaServed: {
        "@type": "Country",
        name: "Hong Kong",
      },
    });

    if (jsonLd) {
      setJsonLd("jsonld-page", jsonLd);
    } else {
      document.getElementById("jsonld-page")?.remove();
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      setJsonLd("jsonld-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: breadcrumb.name,
          item: absoluteUrl(breadcrumb.path),
        })),
      });
    } else {
      document.getElementById("jsonld-breadcrumb")?.remove();
    }

    window.scrollTo(0, 0);
  }, [
    title,
    description,
    path,
    jsonLd,
    keywords,
    image,
    type,
    breadcrumbs,
    noindex,
  ]);

  return null;
}
