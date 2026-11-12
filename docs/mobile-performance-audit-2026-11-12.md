# DrainBear mobile first-viewport performance audit (2026-11-12)

## Baseline (external tool)
Ubersuggest PageSpeed Audit for `https://drainbearhk.com/` reported:
- Mobile: LCP **7.8s**, FCP **2.4s**, TTI **7.9s**, TBT **124ms**, CLS **0**.
- Desktop: LCP **805ms**, FCP **414ms**, TTI **1.8s**, TBT **104ms**, CLS **0.001**.
- Suggested unused JS 269KB and redirects ~601ms (mobile). These are tool estimates, not identified causes.
Google PSI API returned HTTP 429 quota exhausted. A separate isolated Chromium lab could not launch in the Vercel Sandbox; **no independent Lighthouse score or before/after LCP measurement is claimed**.

## Source audit and confirmed opportunities
- The home hero uses a `<picture>` with a 640/960 mobile WebP source, a high-priority image, but had **no early mobile preload hint** in prerendered HTML.
- Existing mobile hero assets: 640 = **80,104 bytes**, 960 = **124,706 bytes**.
- Desktop-only WhatsAppWidget was imported/rendered from the shared layout even though CSS hides it on mobile.
- A decorative animated water texture (24,632 bytes) and a blur/slide hero headline animation were enabled on mobile.
- Initial Vite entry bundle baseline: **536.80 KB / 170.61 KB gzip**; CSS: **244.86 KB / 40.04 KB gzip**. The entry bundle includes more than the WhatsApp widget; do not claim all unused JS has been removed.

## Optimizations in this PR
1. Compress mobile art variants as separate assets (`-perf.webp`); preserve same pixel dimensions and originals:
   - 640: **60,138 bytes** (−24.9%, PSNR ~34.63 dB vs original).
   - 960: **90,552 bytes** (−27.4%, PSNR ~35.66 dB vs original).
2. Add responsive, high-priority preload hints **only to prerendered homepage HTML** for the matching mobile art sources, keeping other landing pages free of accidental image downloads.
3. Lazy-load the **desktop-only** floating WhatsApp panel when the viewport meets `min-width: 768px`. Header/contact/mobile bar buttons stay immediately available.
4. Disable mobile hero parallax, decorative water request/animation, and hero text entrance animation to limit early rendering activity; retain desktop visual behavior.
5. Apply `content-visibility:auto` to clearly below-fold mobile homepage sections to reduce first-viewport paint work while keeping semantic HTML and internal links present.
6. Tighten the sitemap/build verification so homepage mobile preloads and optimized source assets must exist and match file-size budgets; service/blog pages must not preload homepage assets.

## Initial asset/bundle checks
- The preliminary Vite build after desktop-widget splitting measured entry JS **532.47 KB / 169.51 KB gzip**, vs baseline **536.80 KB / 170.61 KB gzip**; widget is now a separate **4.87 KB / 2.09 KB gzip** chunk.
- These numbers are bundle **size reductions**, not a measured user-facing time improvement. They should not be advertised as LCP improvement until an independent mobile lab or CrUX comparison validates it.

## Release criteria
- [ ] `pnpm check` and `pnpm test` pass on the final branch.
- [ ] Full Vercel `pnpm build` passes: SEO, AEO, answer library and sitemap checks.
- [ ] Preview homepage HTML has exactly two mobile preloads, with correct media sizes, and service/blog HTML has zero.
- [ ] Mobile hero image URLs serve 200 with WebP type and reduced sizes.
- [ ] Home navigation/WhatsApp call-to-action and desktop floating chat continue working.
- [ ] Production verification before declaring release complete.
- [ ] After release, re-run the same Ubersuggest mobile audit and (when quota allows) Google's PSI 3–5 runs in a consistent environment; use CrUX for field CWV after enough traffic/data.

**Important:** Success in a synthetic test does not guarantee Google ranking changes or LCP=2.5s. No paid ads or SEO ranking changes are made here.
