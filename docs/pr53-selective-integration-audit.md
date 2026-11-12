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
