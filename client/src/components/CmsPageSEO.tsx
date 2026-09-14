import { useEffect, useState } from "react";
import SEO, { type SEOProps } from "@/components/SEO";
import type { PageSeo } from "@/lib/sanity/types";

interface CmsPageSEOProps extends SEOProps {
  cmsPath?: string;
  cmsEnabled?: boolean;
}

export default function CmsPageSEO({
  cmsPath,
  cmsEnabled = true,
  ...fallback
}: CmsPageSEOProps) {
  const queryPath = cmsPath ?? fallback.path;
  const [data, setData] = useState<PageSeo | null>(null);
  const [resolvedPath, setResolvedPath] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setData(null);
    setResolvedPath(null);
    setHasError(false);
    if (!cmsEnabled) {
      return;
    }

    let active = true;

    const load = () => {
      void import("@/lib/sanity/queries")
        .then(({ getPageSeo }) => getPageSeo(queryPath))
        .then(result => {
          if (active) setData(result);
        })
        .catch(() => {
          // The static fallback metadata is complete when the CMS is unavailable.
          if (active) setHasError(true);
        })
        .finally(() => {
          if (active) setResolvedPath(queryPath);
        });
    };

    const idleId = window.requestIdleCallback?.(load, { timeout: 1500 });
    const timeoutId = idleId === undefined ? window.setTimeout(load, 1) : null;

    return () => {
      active = false;
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [cmsEnabled, queryPath]);

  // A route change must not briefly reuse the previous page's CMS canonical.
  const seo = cmsEnabled && resolvedPath === queryPath ? data?.seo : undefined;

  return (
    <SEO
      {...fallback}
      contentReady={fallback.contentReady}
      metadataReady={!cmsEnabled || resolvedPath === queryPath}
      metadataError={cmsEnabled && hasError}
      title={seo?.metaTitle || fallback.title}
      description={seo?.metaDescription || fallback.description}
      keywords={
        seo?.focusKeywords?.length
          ? seo.focusKeywords.join(", ")
          : fallback.keywords
      }
      canonicalUrl={seo?.canonicalUrl || fallback.canonicalUrl}
      ogTitle={seo?.ogTitle || fallback.ogTitle}
      ogDescription={seo?.ogDescription || fallback.ogDescription}
      image={seo?.ogImage?.url || fallback.image}
      imageAlt={seo?.ogImage?.alt || fallback.imageAlt}
      noindex={seo?.noIndex ?? fallback.noindex}
    />
  );
}
