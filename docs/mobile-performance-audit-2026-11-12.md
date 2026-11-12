# DrainBear Mobile Performance Audit — 2026-11-12

## Baseline and limitations
Ubersuggest PageSpeed Audit on `https://drainbearhk.com/` reported:
- **Mobile:** LCP 7.8 s, FCP 2.4 s, TTI 7.9 s, TBT 124 ms, CLS 0.
- **Desktop:** LCP 805 ms, FCP 414 ms, TTI 1.8 s, TBT 104 ms, CLS 0.001.
- Suggested *unused JavaScript* 269 KB and *redirect opportunities* estimated 601 ms (mobile). Those are heuristic lab results, not verified root causes.

Google PageSpeed Insights API returned HTTP 429 (quota exceeded). Chromium-based standalone field reproduction could not start in the isolated sandbox, so no independent Lighthouse numeric score or guaranteed LCP delta is claimed.

## Confirmed source issues and implemented fixes
1. **Image request discovery:** The homepage's responsive hero image already used `fetchPriority="high"` but lacked a prerendered `<head>` preload. Prerender now injects matching early preload hints for `max-width:479px` and `480–767px` **only on the homepage**. Other routes do not download these hero hints.
2. **Unneeded mobile JavaScript:** `WhatsAppWidget` was statically bundled and rendered despite being desktop-only via CSS. It is now lazy-loaded only for `min-width:768px`, including viewport resize handling; mobile fixed CTA and hero contact buttons remain immediately available.
3. **Mobile visual work:** Disabled the mobile parallax effect, blur/translation entrance animation and decorative animated water-background image on mobile. The latter removes a potential **24,632-byte** decorative request from the mobile first viewport without changing desktop design.
4. **Offscreen painting:** Applied `content-visibility:auto` to homepage sections that are beyond the hero and company intro, preserving their SEO HTML and internal links.
5. **Regression protections:** Enhanced sitemap verifier asserts exactly two appropriate responsive home-only hints, the presence of original full WebP assets within size bounds, and no hint leakage to other indexable routes. Existing SEO/canonical/AEO guards remain active.

## Quantified build observations
| Item | Before | After early widget split | Notes |
| --- | ---: | ---: | --- |
| Initial Vite JS bundle | 536.80 KB | 532.47 KB | Minified, not compressed transfer |
| Initial Vite JS gzip | 170.61 KB | 169.51 KB | Desktop panel moved to lazy chunk |
| Desktop WhatsApp chunk | bundled | 4.87 KB (2.09 KB gzip) | Loaded only at desktop breakpoint |
| Mobile hero 640 | 80,104 bytes | 80,104 bytes | Existing verified asset retained |
| Mobile hero 960 | 124,706 bytes | 124,706 bytes | Existing verified asset retained |

An experimental recompression of these assets achieved 25–27% smaller test files, but the first binary GitHub upload was truncated by its transfer path. **Those experimental files were removed from the PR and are NOT shipped**. The build verifier now checks minimum size as well as maximum size to reject this failure class.

## Release checklist
- [ ] Final branch `pnpm check` and `pnpm test` green.
- [ ] Final Vercel `pnpm build` passes prerender, sitemap, SEO, AEO and answer tests.
- [ ] Preview root HTML includes home-only responsive preloads; inner pages have none.
- [ ] Mobile hero and WhatsApp/contact CTAs remain functional; desktop floating widget loads correctly.
- [ ] Official production domain verified after merge (if released).
- [ ] Compare future Ubersuggest mobile audits and field CWV/CrUX. Do not assert LCP improvement based only on implementation or test results.

**This release is an initial mobile first-viewport optimization, not proof of a particular LCP score or increased search rank.**
