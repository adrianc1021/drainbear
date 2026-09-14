# DrainBear — 2026-09-14 visual and search update

## Brief and baseline

Improve the homepage's appeal and the quality of search landing pages, while preserving conspicuous WhatsApp actions and safe mobile text flow. The supplied Search Console screenshot is for the query「通渠」: 255 impressions, 0 clicks and average position 76.8 over 28 days, not a site-wide ranking. No immediate ranking promise is appropriate.

The starting checkout is `3782ecc`. Network/browser access was initially blocked, then restored by the user on 2026-09-14. A fresh GitHub fetch confirmed main still matched that starting revision. Previous production screenshots are historical reference; new browser verification is recorded below.

## Design plan, reviewed before implementation

- Palette: white `#ffffff`, deep water `#173f52`, sea mist `#eaf4f8`, slate `#4e6571`, divider `#cfdee6`, contact green `#25d366`.
- Typography: existing local CJK system stack (PingFang TC / Microsoft JhengHei / sans-serif), bold compact headings and regular readable copy. No new remote font dependency. Headlines use one colour; no tracked uppercase decoration.
- Layout: one spacious, water-blue service masthead, a deliberate landscape photograph and a plain-language headline with immediate contact actions. Compact service links follow. Pricing clarity and actual CMS cases come before equipment explanations. Latest articles retain live publication ordering.
- Alignment: left aligned text, at least 20px side gutters at 320px, `minmax(0, …)` columns, no fixed-height copy panels, and natural Chinese wrapping. Mobile does not depend on text over photographs.
- Principles: show what the customer can do next; reserve bright green for contact; use numbers only for actual process steps; show existing verified evidence without inventing credentials or portraying the hero illustration as a customer case.

Desktop concept:

```text
brand / navigation                              WhatsApp
┌──────────────────────────────────────────────────────┐
│ 香港通渠，           │ existing landscape photograph │
│ 先報價後動工。       │                               │
│ short explanation   │ residential / commercial scope│
│ WhatsApp + phone    │                               │
├──────────────────────────────────────────────────────┤
│ contact hours       quoted scope       completion    │
└──────────────────────────────────────────────────────┘
4 direct problem links → fee explanation → CMS cases
equipment / commercial links → latest articles → contact
```

Mobile concept:

```text
brand / menu
literal H1 + one short explanation
green WhatsApp / telephone
landscape photo
useful service arrangements
compact problem links
pricing / cases / latest articles
persistent contact bar
```

Self-critique: merely swapping cream for blue would reproduce the rejected page. Change the information structure too: remove duplicated service directories and ornamental numbering, shorten the introduction, make the photo visible earlier, move case evidence forward, and use actual article imagery when available. Do not copy another brand's logo, layout or claims. This iteration builds on earlier observations of Apple HK, IKEA HK and HSBC HK; no new live brand research is claimed while network access is blocked.

## Search and conversion scope

- Align homepage H1, title and description with Hong Kong drainage service intent and the actual quoting process.
- Keep primary service, pricing, area, case and article links crawlable.
- Fix only technical and content issues backed by source evidence; do not claim crawl/index status without live or Search Console evidence.
- Preserve CMS content and avoid new thin doorway pages or fabricated reviews.
- Test type safety, unit regressions, build, mobile boundaries, enlarged text, contact destinations and calculator interactions; distinguish blocked tests from passing tests.

## Verification and release

### Implemented locally

- Rebuilt the homepage masthead around a shorter service headline, immediate WhatsApp/telephone actions, a landscape image and clear quote arrangements. The supplied hero is explicitly labelled a service illustration, not customer evidence.
- Removed the duplicated service directory from the rendered homepage, kept all seven service destinations crawlable and placed pricing and available published cases earlier.
- Added responsive CMS case/article imagery while preserving the latest-article ordering and 60-second refresh. The lightweight latest-post query now returns image metadata without downloading article bodies. Article image `sizes` matches the one-column / three-column layout at 768px, with higher-resolution options for dense displays.
- Applied white/water-blue surfaces and typography refinements using the frontend-design skill. Existing mobile gutters, shrink-safe grids and natural text wrapping are retained. Fresh screenshots were subsequently inspected after network/browser access resumed.
- Used the SEO audit and copywriting review to clarify homepage search intent, quote wording and district information. Removed unsupported fixed arrival times, fleet claims and unconditional inspection-fee claims; retained each district's geography, questions and route.
- Hardened CMS/SEO readiness so the build cannot silently publish a failed or still-loading page. Blog lists, articles (including related content) and case lists expose their own loading/error state. Static fallback content remains available to visitors when CMS reads fail.
- Restricted long-lived immutable caching to fingerprinted assets. Replaceable files revalidate. Metadata refreshes no longer scroll visitors to the top.

### Initial checks on 2026-09-14, 11:19 HKT (before access resumed)

| Check | Observed result |
| --- | --- |
| TypeScript `check` | Passed |
| Full Vitest suite | 100 tests passed across 14 files |
| `build:app` | Passed; this only compiles the application and server |
| Static SEO discoverability configuration | Passed; not evidence of Google's live crawl/index status |
| `git diff --check` | Passed |
| Independent source review | No remaining concrete P1/P2 finding; article image sizing observation addressed |
| Full published-CMS prerender and generated sitemap consistency | Not completed |
| Browser screenshots, 320–1440px layout and 200% text checks | Blocked; no new visual acceptance evidence |
| Real calculator/contact/navigation interactions | Blocked; existing browser tests were not executed this turn |
| GitHub synchronization, commit, push and deployment | Not performed |

Some analytics tests deliberately emit diagnostics for invalid IDs or rejected personal-data parameters. They passed without sending live analytics.

### Initial environment blocker (resolved for this task)

Normal network access failed DNS resolution. Escalated GitHub synchronization and browser verification were rejected by the Codex approval backend with HTTP 404 for unsupported model `codex-auto-review`. The local server also failed to bind (`EPERM`), and the sandboxed browser could not start (`MachPortRendezvousServer Permission denied`). The browser connector reported no Codex auth token. These are environment failures, not evidence that the production website is failing.

No alternative route was used to bypass the denied controls. The user subsequently enabled full network/browser access. The previous checkout was not overwritten. A complete build with current published CMS content replaced the earlier compilation-only output.

Sanity browser access from prerender origin `http://127.0.0.1:4173` succeeded directly during the complete build. No CORS configuration change or fabricated CMS data was required.

### Resumed verification and additional repairs

- Complete build succeeded with 59 prerendered routes: 22 article URLs (12 CMS and 10 built-in), 2 case URLs, and 58 indexable sitemap URLs; `/thanks` intentionally stays noindex.
- TypeScript passed. The expanded unit/integration suite passed 107 tests across 15 files.
- Independent review found inherited stale-sitemap fallback during CMS route discovery. The real entrypoint test first reproduced six fail-open cases; now both current CMS route queries must succeed before modifying artifacts or rendering. Invalid/missing results and invalid slugs fail the build.
- Vercel does not run the Express static handler. Added a matching fingerprint-only cache rule in `vercel.json`; validated the configuration and example URL matches with Vercel's own routing library in a temporary tooling directory, without adding a project dependency.
- At 320px and 200% root font size, a WebKit run found the FAQ callout's WhatsApp label clipped. Reduced excessive horizontal padding and allowed the control to wrap within its parent. The test now settles font/layout changes before measuring.
- The subsequent 32 route/width/engine enlarged-text scenarios passed: home, guide, areas and FAQ; 320/390/768/1440px; Chromium and WebKit. Includes calculator result/message/reset, area search navigation, expanded FAQ answers, mobile menu and footer accordions.
- The subsequent full-site layout scan passed 1,062 route/width/engine combinations: 59 routes at 320/360/375/390/430/640/768/1024/1440px in Chromium and WebKit. It checks actual text ranges and ancestor clipping, not only document scroll width.
- Contact/navigation checks passed: four service entrances, WhatsApp message, calculator anchor scrolling, fee wording, 18 district links and 10-route metadata/active navigation consistency. Shared chrome tests passed focus trapping, Escape, tablet menus, contact placement and contrast.
- Browser tracking checks passed without sending GA4 or Ads conversion requests. No real enquiries or WhatsApp messages were submitted.
- Sitemap, manifest, canonical/robots consistency and static SEO discoverability checks passed.
- Inspected new desktop/mobile screenshots of the homepage, equipment section, pricing calculator and main-drain service. This exposed an equipment heading that inherited the background colour (1:1 contrast). Added a specific white heading rule and a browser heading-contrast regression script. The regression failed before the fix and passed on the final build in both engines at 390/1440px.
- The final colour-only full build and all 59 prerenders passed. The final CSS is `/assets/index-DgvvmoPt.css`; the local entry bundle is `/assets/index-CPlI1MFG.js`. A further 24 route/width/engine layout checks with interactions passed on home, guide, FAQ and main-drain pages at 320/390/1440px, followed by successful sitemap/canonical/robots and diff checks. The complete 1,062-check geometry run above preceded only the final heading-colour adjustment.

Screenshot directories: `/tmp/drainbear-final-2026-09-14`, `/tmp/drainbear-final-large-text-2026-09-14`, `/tmp/drainbear-final-visual-2026-09-14`.

Content observations: the two published CMS cases are not selected as homepage features, so the explicitly labelled scenario fallback remains on home. The newest built-in articles are newer than the current CMS posts and have no cover images. The redesign preserves that publication ordering and editorial selection; it does not misrepresent examples as real jobs or change CMS documents to manufacture visible evidence.

Limitations: WebKit is not a physical iPhone, and root-font enlargement does not cover every OS accessibility setting. These results do not demonstrate higher Google rankings. Local broad layout tests relay real public read-only CMS responses on an unregistered preview port; final production verification must use direct requests.

### Final publication checklist

1. Local release gates are complete. GitHub main was fetched again and still matches `3782ecc`; commit the reviewed files and push without rewriting history.
2. Verify deployment completion and current content/assets on both `https://drainbearhk.com/` (Render/Express behind Cloudflare) and `https://drainbear.vercel.app/`. Their deployment paths are not identical.
3. Verify indexing/search performance in Search Console after release. Use the provided 「通渠」 figures as a query-specific baseline, not proof of a site-wide decline or an immediate ranking improvement.
