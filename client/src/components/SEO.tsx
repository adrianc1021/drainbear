/**
 * 通渠熊 DrainBear — SEO 元件
 * 每頁獨立 title / description / canonical / Open Graph / JSON-LD
 */
import { useEffect } from "react";
import {useSiteSettings} from "@/contexts/SiteSettingsContext";

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
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  imageAlt?: string;
  contentReady?: boolean;
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
  canonicalUrl,
  ogTitle,
  ogDescription,
  imageAlt,
  contentReady = true,
  jsonLd,
  keywords,
  image,
  type = "website",
  breadcrumbs,
  noindex = false,
}: SEOProps) {
  const {
    settings,
    isLoading: isSiteSettingsLoading,
  } = useSiteSettings();

  useEffect(() => {
    const isSeoReady =
      contentReady && !isSiteSettingsLoading;

    if (!isSeoReady) {
      document.documentElement.dataset.seoReady = "false";
      return;
    }

    const cleanPath = path.split(/[?#]/)[0] || "/";
    const siteUrl = settings.siteUrl.replace(/\/+$/, "");

    const toAbsoluteUrl = (value = "/") => {
      if (/^https?:\/\//i.test(value)) return value;

      const normalizedValue = value.startsWith("/")
        ? value
        : `/${value}`;

      return new URL(normalizedValue, `${siteUrl}/`).toString();
    };

    const pageUrl = toAbsoluteUrl(cleanPath);
    const canonicalPageUrl = canonicalUrl
      ? toAbsoluteUrl(canonicalUrl)
      : pageUrl;
    const socialImage = toAbsoluteUrl(
      image ||
        settings.defaultOgImage?.url ||
        "/favicon-512x512.png"
    );
    const socialTitle = ogTitle || title;
    const socialDescription = ogDescription || description;

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

    setCanonical(canonicalPageUrl);

    setMeta("property", "og:title", socialTitle);
    setMeta("property", "og:description", socialDescription);
    setMeta("property", "og:url", canonicalPageUrl);
    setMeta("property", "og:type", type);
    setMeta(
      "property",
      "og:site_name",
      settings.businessName
    );
    setMeta("property", "og:locale", "zh_HK");
    setMeta("property", "og:image", socialImage);
    setMeta(
      "property",
      "og:image:alt",
      imageAlt ||
        settings.defaultOgImage?.alt ||
        `${settings.businessName}｜香港專業通渠服務`
    );

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", socialTitle);
    setMeta("name", "twitter:description", socialDescription);
    setMeta("name", "twitter:image", socialImage);

    // 全站統一商家實體。
    // 暫時使用Organization，避免提供未核實或不完整地址。
    setJsonLd("jsonld-business", {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: settings.businessName,
      alternateName: ["通渠熊", "DrainBear"],
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/favicon-512x512.png"),
        width: 512,
        height: 512,
      },
      image: toAbsoluteUrl(
        settings.defaultOgImage?.url ||
          "/favicon-512x512.png"
      ),
      description: settings.businessDescription,
      telephone: settings.phoneE164,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: settings.phoneE164,
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
          item: toAbsoluteUrl(breadcrumb.path),
        })),
      });
    } else {
      document.getElementById("jsonld-breadcrumb")?.remove();
    }

    document.documentElement.dataset.seoReady = "true";
    window.scrollTo(0, 0);
  }, [
    title,
    description,
    path,
    canonicalUrl,
    ogTitle,
    ogDescription,
    imageAlt,
    contentReady,
    isSiteSettingsLoading,
    jsonLd,
    keywords,
    image,
    type,
    breadcrumbs,
    noindex,
    settings,
  ]);

  return null;
}
