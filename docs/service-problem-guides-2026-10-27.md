# Service pages: follow the washing-machine guide's useful structure

2026-10-27 (Hong Kong). Reference: `/blog/washing-machine-drain-backflow-causes-fixes`.

The reference page explains a concrete symptom, immediate safe actions, possible causes, observable clues, and when to contact a service provider. The user reports that this page performs best; the prior Windsor analysis showed 7 Hong Kong query×page clicks and average position 3.03 for `洗衣機去水倒灌` in 2026-09-27–10-24. That evidence does not establish that prose alone caused its performance or prove it is the highest-performing page by every metric.

## Implemented

All eight existing service pages now follow that answer-first reading sequence:

- Toilet: stop flushing, identify known foreign objects, check other affected fixtures.
- Kitchen sink: pause connected appliances, distinguish twin-basin backflow and cabinet leaks.
- Bathroom/basin: distinguish one outlet from connected washing-machine/branch-drain symptoms.
- Sewage backflow: pause affected use, record floors and timing, coordinate shared access.
- High-pressure jetting: preserve previous work records; assess pipe, access and discharge conditions.
- CCTV: clarify inspection access, scope and footage/report delivery; inspection is not unblocking.
- Main drain/manhole: coordinate the responsible property contact; no resident opening or entry.
- Grease trap: distinguish cleaning the trap from unblocking its outlet/downstream pipe.

Each has a unique hero introduction, three immediate actions, existing causes made visible, three observation prompts, a service-specific help paragraph and a topic-specific WhatsApp message. First actions and causes are no longer hidden inside a disclosure. Existing symptoms/limitations remain expandable, with no duplicate cause list. Added contact anchor uses the existing enquiry panel. Existing photos, case records, articles and service-answer links remain.

Files: `client/src/lib/serviceProblemGuides.ts`, its coverage test, `client/src/pages/ServiceDetail.tsx`, `client/src/styles/brand-system.css`, `scripts/prerender.ts`.

The washing-machine article, existing service URLs/titles/canonicals, Ads settings and conversion configuration are unchanged. All eight service Sitemap lastmod values reflect the actual 2026-10-27 edit. No fabricated cases, results, reviews, arrival times or qualifications.

## Validation

- TypeScript and 180 tests (32 files) passed.
- Full CMS-backed build: sitemap, SEO, AEO and answer-library checks passed.
- Eight services at 320, 390 and 1440 pixels: one H1, self-canonical, indexability, no horizontal overflow, visible first steps, correct topic-specific WhatsApp links, phone links and working enquiry anchor.
- All eight guides readable with JavaScript disabled.
- Mobile axe WCAG A/AA checks: no findings in tested pages; not a full accessibility certification.
- Existing contact tracking reused; no new conversion events added.

Full service-specific copy and browser evidence are in `/workspace/drainbear-service-guides-2026-10-27/`. Compare post-release complete 28-day periods using consistent query×page/country/device filters; do not infer enquiries from search clicks or promise comparable rankings.
