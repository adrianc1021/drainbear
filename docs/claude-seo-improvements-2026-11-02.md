# Claude SEO applied review — 2026-11-02 (Hong Kong)

## Scope and source

Applied AgriciDaniel/claude-seo's seo-content, seo-local and seo-schema guidance to DrainBear's existing company/service content. Source checkout: `/workspace/claude-seo`, commit `6be93f45064ffbadced572b5d5c95f55fd263af0` (MIT). Read skill files directly and adapted checks to existing TypeScript/Playwright tooling; Claude commands, agents and Python runtime were not installed or executed. This is a focused review, not the plugin's complete multi-agent audit.

References:
- https://github.com/AgriciDaniel/claude-seo/blob/main/skills/seo-content/SKILL.md
- https://github.com/AgriciDaniel/claude-seo/blob/main/skills/seo-local/SKILL.md
- https://github.com/AgriciDaniel/claude-seo/blob/main/skills/seo-schema/SKILL.md
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/ai-features

## Findings and implementation

1. **Content authorship was disconnected.** BlogPost rendered the editorial team as plain text; Article.author pointed to the homepage without a stable editorial identifier. Added an About section identifying corporate authorship, the distinction between method guidance and case evidence, publication/update dates and how readers can send corrections. Links and structured data now use `/about#editorial-team`. Only the exact existing editorial-team byline receives this identity; other authors remain unchanged. No invented people, qualifications or professional review.
2. **Recent company guides lacked relevant service entry points.** Existing RelatedDrainArticles did not reference the two 29 October guides. Added eight distinct short commissioning prompts alongside each service's process, linking to the appropriate existing quotation or property commissioning guide. They are visible without opening a disclosure and remain in raw HTML. No new competing landing pages.
3. **Existing local identity is substantially present.** Stable Plumber entity, phone, Hong Kong service area, existing official profile links, starting-price data and 24-hour inquiry ContactPoint already exist. Kept them; did not invent an address, coordinates, star rating, branch offices or all-day on-site availability.
4. **Existing content already has direct answers and real case destinations.** Kept titles, URLs, canonical, FAQ answers, case assets and publication dates. About and all eight service sitemap modification dates reflect this revision. Article byline template updates do not pretend the substantive articles were rewritten.

## Why not blindly follow all plugin heuristics

Its English word-count thresholds and readability scores are not suitable acceptance criteria for Hong Kong Chinese. Numeric E-E-A-T/GEO scores are tool heuristics, not Google scores; no invented aggregate score is issued. US directories, geographic precision, minimum review counts and external visibility percentages are not treated as requirements for this Hong Kong service-area business. A lack of public shop address does not justify inventing one. FAQ markup is not a promise of a Google display feature.

## Verification

- TypeScript and 180 tests passed.
- Full CMS build, SEO/AEO/Sitemap and answer-library checks passed: 217 canonical URLs, 216 child pages, 128 complete answer-library pages.
- Browser coverage passed: 30 layouts across all eight services, About, one representative blog page at 320/390/1440px. Checks include one H1, title/description, canonical, robots, no overflow, intended new links, author entity identity and mobile axe.
- JavaScript-disabled checks: all eight service guide links, About editorial section and article byline destination.
- Artifacts: `/workspace/drainbear-claude-seo-2026-11-02/`; logs `/tmp/claude-seo-{check,test,build}.log`.

## Remaining evidence / measurement

No fresh Search Console, live AI citation tracking, GBP account analytics or backlink index was accessed. This review cannot determine current Google indexation or AI recommendation frequency. Do not present deployment as ranking improvement. Future full 28-day Hong Kong comparisons should separate query/page/device and track company-related terms, clicks, impressions and CTR. Customer inquiry outcomes require separate measurement.

Owner-supplied named reviewer credentials and verified case records could strengthen evidence later. Genuine external profiles, voluntary customer reviews and relevant partner references remain external work; no contacts, submissions or fabricated citations were made.
