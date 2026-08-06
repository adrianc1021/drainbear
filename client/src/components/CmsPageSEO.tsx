import {useQuery} from "@tanstack/react-query";
import SEO, {type SEOProps} from "@/components/SEO";
import {getPageSeo} from "@/lib/sanity/queries";

interface CmsPageSEOProps extends SEOProps {
  cmsPath?: string;
}

export default function CmsPageSEO({
  cmsPath,
  ...fallback
}: CmsPageSEOProps) {
  const queryPath = cmsPath ?? fallback.path;

  const {data, isLoading} = useQuery({
    queryKey: ["sanity", "pageSeo", queryPath],
    queryFn: () => getPageSeo(queryPath),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const seo = data?.seo;

  return (
    <SEO
      {...fallback}
      contentReady={!isLoading}
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
