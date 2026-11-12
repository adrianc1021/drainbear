# PR #53 selective integration audit (2026-11-12)

Source: https://github.com/adrianc1021/drainbear/pull/53
Target: integrate/pr53-seo-20261112 (based on main)

## Confirmed already present on main
- client/public/llms.txt (newer expanded content)
- vercel.json (newer deployment configuration)
- scripts/verify-seo-discoverability.mjs (expanded checks)
- client/index.html: og:locale:alternate
- client/src/components/SEO.tsx: knowsAbout
- client/src/lib/blogData.ts: whatsapp-drain-quote-checklist, drain-tool-selection-guide, read-cctv-drain-inspection-report and reviewer metadata
- studio/schemaTypes/blogPost.ts: reviewerName

Do not overwrite these files with the October PR snapshot.

## Integration rules
1. Preserve current main implementations, particularly prerender, robots, canonical, deployment and generated AI indexes.
2. Review remaining changed files line by line before porting; a diff against the old PR base is not evidence a change is missing from main.
3. Port only missing behavior with tests, then run typecheck/build/prerender/SEO verification.
4. Keep the original PR #53 and production main unchanged.
5. Open a draft PR only after at least one substantive code change has been validated.

## Status
Audit started; no feature migration or test run is claimed by this document.

## Second-pass file audit (19 files)
Comparison method: PR #53 added lines checked against latest main file content. Matching lines are a signal of overlap, **not proof of identical behavior**. Different implementations and removed CSS require manual review.

- Exact additions already present: client/index.html, client/public/sitemap.xml, client/src/lib/sanity/types.ts, package.json, scripts/prerender.ts, studio/schemaTypes/blogPost.ts.
- Largely superseded by expanded implementations: client/public/llms.txt, client/public/robots.txt, scripts/verify-seo-discoverability.mjs, vercel.json, client/src/components/SEO.tsx.
- Manual behavioral comparison required: client/src/components/HongKongMap.tsx, client/src/components/Layout.tsx, client/src/lib/blogRepository.ts, client/src/lib/sanity/queries.ts, client/src/pages/BlogPost.tsx, client/src/lib/blogData.ts.
- **High priority manual review:** client/src/pages/Areas.tsx (only 3/24 sampled added lines present verbatim; implementation may have changed entirely).
- client/src/styles/secondary-pages-stage6a.css no longer exists on main; do not reintroduce obsolete stylesheet without checking its replacement and imports.

## Decision
Do not merge PR #53 or copy its files wholesale. Current main already contains most SEO/content features; assess the remaining UI behaviors and their tests before writing any feature changes. No production or SEO improvements are claimed by this audit.
