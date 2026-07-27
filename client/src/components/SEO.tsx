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
}

export default function SEO({ title, description, path, jsonLd }: SEOProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setMeta("name", "description", description);
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "zh_HK");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

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

    window.scrollTo(0, 0);
  }, [title, description, path, jsonLd]);

  return null;
}
