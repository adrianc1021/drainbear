# 文章

Mode: Read

## Article illustrations extension — 2026-10-16

User request:「啲文章要多啲插圖，圖文並存」, with `/blog/choosing-professional-drain-company` as the current article. This extends the existing article world: white/pale-blue dimensional paper-art scenes, the white bear in blue workwear, incumbent inner-page typography and reading surface. It does not establish a new identity, palette, type voice or approved pixel comp. Homepage B and its surface brief remain separate.

The reading pattern is section text → relevant figure → short caption → next section. Exact heading anchors place figures after the complete matching section; explicit text anchors keep real photographs beside the corresponding case paragraph. Missing or renamed anchors receive no guessed append. The mapping preserves source text, marks, links, keys, slugs, titles, SEO metadata, original publication dates, covers and existing enquiry behavior. It copies only when adding an image, avoids existing images and each page's cover, and is idempotent. It is a view-layer adaptation, not a CMS content write.

## Implemented figures

All 39 published articles now have at least two body images: 38 have two and the selection guide has four, for 80 in total. The prior inventory had five across four articles; 75 positions were added across 38 articles. The article already containing two body images was retained. These are dated inventory outcomes, not a fixed image quota for every future article.

The selection guide adds quote-review and service-scene AI illustrations plus two existing real photographs beside the home-basin and school-rainwater case descriptions. Other pages reuse relevant incumbent topic illustrations without repeating their own cover. Three new generated scenes cover service settings, quote review and CCTV inspection; each has 640/960/1200px WebP variants. `docs/article-visual-assets-2026-10-16.json` records the exact generation prompt, original output, dimensions, byte size and hash for all nine shipping variants. AI images are clearly illustrative; the original case photographs and source links remain the engineering evidence.

Shared `client/src/components/ArticleFigure.tsx` renders both CMS and static bodies through `client/src/pages/BlogPost.tsx`. It supplies real image width/height, responsive sources, `loading="lazy"` and `decoding="async"`. Landscape images follow the reading column with natural height; declared sizes are `(min-width: 768px) 736px, calc(100vw - 32px)`. Portraits use contain, natural width, a 28rem maximum height and full-width containment; the existing 3:4 case images render at 336×448px on desktop. Their sizes are `(min-width: 368px) 336px, calc(100vw - 32px)`. The portrait remains centered while the short caption aligns with the article's left edge. Figures have an existing 8px corner, no decorative border, 2rem top margin and 0.75rem caption gap. These do not replace unrelated inner-page container styles.

Short captions distinguish「AI 示意｜…」from「工程原相｜…」and describe the relevant purpose; alt describes image content. No generated scene is presented as a real diagnosis, customer job or completion result. No new colors, fonts, tokens or interaction controls were introduced.

## Source and date contract

`client/src/lib/articleImages.ts` holds image metadata; `articleIllustrationPlan.ts` holds explicit editorial placements; `articleIllustrations.ts` adapts static sections and Portable Text without mutating them. `blogRepository.ts` applies the shared mapping and advances the editorial modification date to 2026-10-16 only when figures are added, respecting later dates. The original publication date remains intact. `scripts/prerender.ts` uses the matching editorial revision for sitemap lastmod; rendered dateModified and the visible update date follow the adapted article metadata.

## Evidence and limits

Evidence packet: `/workspace/drainbear-article-visuals-2026-10-16/`. `inventory-before.json` and `inventory-after.json` establish counts and unchanged headings/covers/publication dates. `qa/results.json` reports 39 articles, 55 layouts across 320/390/768/1024/1440px, 80 body images, preserved text, nine variants, no-JavaScript coverage, no collected errors and empty axe findings for the recorded layouts. These are supplied Chromium results, not Safari or physical-device coverage.

The documenter opened `qa/quote-390.png`, `qa/real-basin-1440.png` and `qa/cctv-390.png`: the quote/CCTV scenes remain readable within mobile text flow, short captions clearly name AI illustration, and the desktop basin photograph keeps its full portrait frame with an original-photo caption at the article left edge. The captures show preserved case text/link and incumbent navigation/contact surfaces.

`tests.log` records 26 passing files / 142 passing tests, including nonmutation, preserved text/marks/links, cover avoidance, missing-anchor behavior, idempotence and case-adjacent placement. `check.log` records successful TypeScript checking. `build.log` records a successful full build with 216 prerendered routes and passing AEO, sitemap, SEO and answer checks (214 indexable sitemap URLs). `provenance.log` reports nine rasters and zero missing records. `detector.json` contains only the pre-existing advisory about an 11px BlogPost size; it is not adopted as a new type token.

Final finish-review disposition is owned by the independent reviewer. This documentation records the implemented pattern and supplied checks; it does not itself approve shipping, certify deployment, resolve the historical homepage strict-comp gate, or claim Safari/physical-device testing.
