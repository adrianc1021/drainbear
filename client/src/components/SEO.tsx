/**
 * 通渠熊 DrainBear — SEO 元件
 * 每頁獨立 title / description / canonical / Open Graph / JSON-LD 結構化資料
 */
import { useEffect } from "react";

const SITE_NAME = "通渠熊 DrainBear";
const SITE_URL = "https://drainbear.manus.space";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setJsonLd(id: string, data: object | object[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: object | object[];
  keywords?: string;
  image?: string;
  type?: "website" | "article";
  breadcrumbs?: { name: string; path: string }[];
  /** 工具頁/感謝頁等不需被搜尋引擎收錄的頁面 */
  noindex?: boolean;
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/manus-storage/hero-plumber_ade9e162.png`;

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
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "zh_HK");
    setMeta("property", "og:image", image || DEFAULT_OG_IMAGE);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image || DEFAULT_OG_IMAGE);

    // 全站 LocalBusiness 結構化資料
    setJsonLd("jsonld-business", {
      "@context": "https://schema.org",
      "@type": "Plumber",
      name: SITE_NAME,
      alternateName: "DrainBear",
      description:
        "香港 24 小時現代化通渠公司，德國高壓水槍、CCTV 照喉檢測，不成功不收費，覆蓋港島、九龍、新界及離島。",
      url: SITE_URL,
      telephone: "+85295588260",
      priceRange: "$$",
      areaServed: ["香港島", "九龍", "新界", "離島"],
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      address: {
        "@type": "PostalAddress",
        addressRegion: "Hong Kong",
        addressCountry: "HK",
      },
    });

    if (jsonLd) {
      setJsonLd("jsonld-page", jsonLd);
    } else {
      document.getElementById("jsonld-page")?.remove();
    }

    // BreadcrumbList 結構化資料
    if (breadcrumbs && breadcrumbs.length > 0) {
      setJsonLd("jsonld-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path}`,
        })),
      });
    } else {
      document.getElementById("jsonld-breadcrumb")?.remove();
    }

    window.scrollTo(0, 0);
  }, [title, description, path, jsonLd, keywords, image, type, breadcrumbs, noindex]);

  return null;
}
