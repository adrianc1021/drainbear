# DrainBear indexability audit and preventive fix — 2026-11-12

## Scope and evidence
The only uploaded Page Indexing export available in this conversation lists **Page with redirect** URLs. It does **not** include Google's "Crawled — currently not indexed" or "Discovered — currently not indexed" URL inventory. Do not conflate redirected old URLs with a non-indexing defect.

Live read-only crawl of the public `https://drainbearhk.com/sitemap.xml` on 2026-11-12:

- **217/217** sitemap URLs returned HTTP 200
- **217/217** URLs used a matching canonical
- **217/217** had a usable HTML title, H1 and main content
- **0** duplicate page titles
- **0** accidental `noindex` headers or meta tags detected
- **0** SEO prerender readiness failures
- All 35 legacy redirect URLs from the uploaded export ended at working HTTP 200 URLs; most used one 301.

These checks establish technical *indexability*, not Google's decision to *index*. No mass `noindex`, redirects, or sitemap removals are justified from the available evidence.

## Confirmed discrepancy
The 128 published answer detail pages displayed an October 16 "updated" byline while JSON-LD `dateModified` and sitemap `lastmod` used October 24. This release introduces a shared, explicitly reviewed `ANSWERS_UPDATED_AT` constant so all three sources agree. It deliberately preserves the actual October 24 date rather than falsely claiming every answer was updated today.

## Build-time preventive checks
The existing `verify:sitemap` build gate now also rejects an indexable route if:
- prerendered title, H1, description or meaningful main text is missing;
- HTML does not report SEO readiness;
- multiple indexable routes share a title;
- existing canonical, robots or manifest checks fail.

## After deployment
1. Export **Google Search Console → Pages → Crawled — currently not indexed** and **Discovered — currently not indexed** with affected URLs, including Google's most recent crawl dates. These are not part of the redirect report.
2. Match those URLs to on-site status, Google-selected canonical (URL Inspection), actual main content, and internal links. Prioritise non-location service and recommendation URLs already selected in the commercial SEO project.
3. Avoid blanket index requests and blanket canonical/noindex changes. Use Google's crawl/index findings and 28-day measurements to choose changes.
4. The SMEPost read-only GSC feed currently provides only a short three-day performance window; that is insufficient to establish index coverage or post-release uplift.

**This release is a verifiable consistency fix and regression guard. It is not evidence that Google's excluded-page counts or rankings have improved.**
