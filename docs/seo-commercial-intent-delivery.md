# Commercial-intent SEO delivery — 2026-11-12

## Goal
Prioritise non-location-specific Hong Kong searches around:
- Choosing or recommending a drain-clearing company;
- Basin / bathroom drain unblocking;
- Toilet unblocking;
- High-pressure drain jetting.

This release **does not** create near-duplicate location landing pages or claim to be an independent recommendation ranking.

## Canonical target map
| Search intent | Existing target (kept) |
| --- | --- |
| 通渠推薦／通渠公司推薦／通渠公司推介 | /blog/choosing-professional-drain-company |
| 通渠公司 (brand/service) | / |
| 洗手盆通渠 | /services/bathroom-drain-unblocking |
| 通廁所／坐廁通渠 | /services/toilet-unblocking |
| 高壓通渠／高壓通渠收費 | /services/high-pressure-jetting |
| 通渠價錢／通渠收費 | /blog/hong-kong-drain-cleaning-price-guide |

## Changes included
1. Updated the existing selection guide's title, introduction, recommendation/comparison language, verifiable review-checking steps and contextual service links.
2. Improved homepage recommendation guide anchors and service-directory wording.
3. Improved service listing metadata and direct navigation links for the three service intents.
4. Adjusted the canonical service metadata titles/descriptions for clearer query matching.
5. Added concise intent-specific explanations and links **inside existing** service pages rather than generating competing URLs.
6. Added Vitest regression coverage for recommendation and service-intent target consistency.
7. Preserved the newer versions of PR #53's AI index, sitemap, structured data, deployment and CMS improvements already present in main.

## Release checks
- [x] Read and compare PR #53 with recent main; preserve existing enhanced versions.
- [x] Static repository checks for 11 key headings, route targets, and component wiring.
- [ ] `pnpm install --frozen-lockfile` and `pnpm check`
- [ ] `pnpm test --run` (includes searchIntentFocus tests)
- [ ] `pnpm build` (prerender + SEO, sitemap and AEO verification)
- [ ] Verify preview rendered page title, canonical, main body, internal links and robot directives.
- [ ] Review changes and merge manually only when checks pass.

## Search Console monitoring
Use **non-branded Web Search** queries, compare matched 28-day periods before and after release; also review a 90-day trend. Track each mapped intent group:
- impressions, clicks, CTR, average position;
- exact landing page (export Google Search Console with both Query and Page dimensions, not separate aggregated tables);
- organic WhatsApp/call events and genuine customer enquiries.

The exported GSC spreadsheets are not committed to this public repository.
No ranking or lead increase is guaranteed. Search-engine re-crawling may take weeks.

## Notes
- The source PR #53 remains open and is **not** merged or force-rebased.
- No direct production deployment is authorised by this draft branch.
