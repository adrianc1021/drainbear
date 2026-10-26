# Search Console indexing repair — 2026-10-26

## Source and scope

Six uploaded Search Console issue exports contain 80 URLs: redirect 32, alternate canonical 9, crawled not indexed 3, not found 2, soft 404 1, discovered not indexed 33. Charts end 2026-10-19; the screenshot reports 181 indexed pages. These are historical reports, not a current inspection of Google's index. `1970-01-01` in discovered URL rows is treated as missing crawl information.

## Repairs

- Permanently redirect obsolete `/guide?location=toilet`, `shower`, and `mainpipe` filters to the matching service. Empty location maps to `/guide`. Preserve other query parameters. Unknown or duplicate locations are unchanged.
- Serve `/404`, `/404.html`, and `/404/` with HTTP 404 and noindex, including when the error document is pre-rendered. Previously `/404` returned HTTP 200.
- Link all 128 answers directly from their eight relevant service pages. Keep four primary links visible and place remaining links in a native disclosure, with links present in HTML and usable without JavaScript.
- Update lastmod only for the eight service pages actually changed.

## Deliberately retained behavior

- HTTP/www/trailing-slash variants redirect to canonical URLs. These source URLs do not need indexing.
- Blog pagination retains its existing canonical policy; no changes to article canonicals.
- `/$` remains a genuine 404, rather than redirecting an invalid URL to the homepage.
- `/blog/drain-gurgling-sound-causes` already returns HTTP 200 with its own canonical and substantial article content; the exported 404 record is historical.
- `/sitemap.xml` is an XML discovery document, not a search-result content page.
- All 33 discovered URLs and the carpark flooding answer were accessible before changes. Better internal links aid discovery but do not guarantee indexing.

## Verification

- TypeScript check passed.
- Full test run passed: 175 tests; subsequent redirect edge-case additions passed all 17 route tests (two additional cases).
- Full build passed: 215 canonical pages, 214 child pages, 128 answers; AEO, sitemap, SEO and answer checks passed.
- HTTP response matrix verified legacy redirects, preserved query parameters, genuine 404s and the recovered article.
- Browser checks across all eight services at 320, 390 and 1440 pixels passed: all 128 answer links present, disclosure interactive, no horizontal overflow. No-JavaScript disclosure check passed.

## Search Console follow-up

Deployment alone cannot change historical Search Console counts. After production verification, inspect the carpark answer and recovered gurgling article and request indexing where needed; validate the repaired soft-404 issue. Intended redirects and alternate URLs should remain excluded. Re-check Google's selected canonical, last crawl and indexing status after recrawling. No Search Console validation or request-indexing submission is claimed by this change.
