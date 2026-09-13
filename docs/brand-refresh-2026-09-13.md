# Brand refresh and mobile overflow repair — 2026-09-13

## Status

Local verification is complete; ready for GitHub main and Vercel publication.
Publication must be checked against both the GitHub commit status and the actual
production assets. Final CSS asset: /assets/index-BbsAZmRt.css.

## References actually visited

- https://www.apple.com/hk/ — compact navigation, restrained hierarchy, a clear
  primary and secondary action, space around the main visual.
- https://www.ikea.com.hk/zh — recognisable categories, content grouped for
  scanning, generous gutters and image-led navigation.
- https://www.hsbc.com.hk/zh-hk/ — clear service navigation, readable content on
  a solid surface, prominent next actions and explanatory information.
- MUJI was attempted but failed to load; it is not accepted reference evidence.

Only layout principles were used. No brand images, logos or marketing claims
were copied. Existing DrainBear photos, contact routing and SEO metadata remain.

## Reproduced defects

At 360px the pricing-guide heading extended to x=464, with its description
extending to x=458. The areas-page heading extended to x=416. Both were masked
by ancestor overflow clipping. The previous scrollWidth test did not catch a
whole text column positioned outside the viewport.

Further checks reproduced a WebKit image box collapsing to zero width and,
after an initial min-height fix, expanding beyond its column. Explicit width
with aspect ratio fixes both. At 200% root font size, fixed calculator columns,
unbreakable price ranges and intrinsic flex widths clipped control labels.
The calculator now uses space-aware option columns and wrapping price amounts.

Causes: CJK headings using keep-all without an emergency break, and flex text
children retaining their intrinsic minimum width. A further maintainability
problem was service styling tied to numbered section positions: new decision
and answer sections shifted the intended targets.

## Changes

- Natural CJK wrapping, long-string wrapping and shrinkable flex children.
- New text-range regression check detects actual text beyond viewport bounds
  and clipped by ancestors, independently of document scrollWidth.
- Service sections have semantic names rather than position-dependent styling.
- Homepage hero uses in-flow text and a separate photo/figure/caption, without
  a fixed-height translucent text overlay. Phone and WhatsApp labels remain
  visible on mobile.
- Quiet warm surfaces, simpler headings, restrained corners, no offset shadows,
  consistent navigation, service and content-page mastheads.
- Mobile/tablet navigation collapses instead of compressing eight links.
- Primary WhatsApp actions retain green with dark readable text.
- Hover/focus contact actions use white on ink; a contrast regression check
  covers the shared desktop contact button after transitions settle.
- Calculator selected values remain visible rather than ellipsised; mobile
  reference prices wrap beneath service names when space is insufficient.

## Verification performed

- Regression test first failed for /guide and /areas at 360px on Chromium.
- After the root-cause fix the same test passed for both routes.
- Homepage and service page captured and visually inspected at 390px and 1440px;
  loaded CMS article/case details, pricing, FAQ and areas also inspected.
- Local TypeScript check passed.
- Local Vitest run: 58 tests passed.
- Local Vite/server build and 59-route prerender passed.
- Final seven-width, 59-route scan with real published CMS responses passed
  in both Chromium and WebKit: 826 route/viewport/engine checks. Widths:
  320, 360, 390, 430, 768, 1024 and 1440px. No detected text/media overflow.
- 200% root-font test passed on home, guide, areas and FAQ at 320/390/768/1440px
  in both Chromium and WebKit, including calculator selection/result/reset,
  area search navigation, expanded FAQs, menu and footer accordion.
- Shared chrome test covers focus trap, Escape, eight tablet-menu destinations,
  header non-overlap and desktop/mobile contact presentation.
- Route metadata/navigation, sitemap/canonical/robots and SEO checks passed.
- Following the final hover-colour-only adjustment, the production build and
  shared-contact contrast test passed; five main routes were rechecked at
  390/1440px in both engines with interactions (20 additional checks).
- git diff --check passed.

Reference/before captures: /tmp/drainbear-brand-review-FWp936.
Final captures: /tmp/drainbear-release-layout, /tmp/drainbear-release-visual,
and /tmp/drainbear-release-large-text.

### Test limitations and safeguards

The first broad local run reached CMS error fallbacks because port 4335 is not
a registered Sanity CORS origin. Its article/case results were discarded.
The final harness relays real public read-only CMS responses on localhost only,
and fails if a content route shows a loading-error/404 heading. No CMS writes
or CORS configuration changes were made. Production checks use direct browser
requests without this relay. Analytics and estimate-record requests are blocked
during interaction tests to avoid fake customer conversions.

WebKit is a browser-engine test, not a physical iPhone test. The 200% test enlarges
the root font; it does not simulate every OS accessibility setting. Intentional
scrollable data tables are allowed only inside a genuinely scrollable wrapper
that stays within the viewport.

## Required before deployment

1. Commit the reviewed scoped files and push to the verified
   GitHub remote named github (origin is a local desktop repository).
2. Verify the deployed HTML/CSS matches the new revision; HTTP 200 alone is
   not proof that a deployment has changed.
