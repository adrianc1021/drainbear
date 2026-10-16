# Public consumer-record collection

Mode: Read.

Route: `/consumer-alerts` · Canonical: `https://drainbearhk.com/consumer-alerts`.

Primary target: Find a relevant public consumer-dispute record, distinguish its source and status, then read the original. Search and filters support this reading task inside the existing DrainBear world.

## Direction contract

THESIS: A source-led open register of Hong Kong drain-service consumer disputes, independently addressable from blog articles. People find an incident, distinguish the source/status, then open its original report. No company guilt scores, anonymous accusations published as findings, or repeated marketing cards.

OWN-WORLD: Existing navy ink, white/paper ground, DrainBear display headings and established body typography. Thin rules separate open record rows. Existing forms, native disclosures, focus treatment and footer remain familiar. No new image assets or imitation news photos.

STORY: State scope once. Search words, source category and dispute topic. Scan dated titles, attributed summaries and status. Expand response/identity limits and citations. Visit originals or link to a particular record. Methodology and official complaint resources follow the register.

FIRST VIEWPORT: Breadcrumbs, left-aligned title and two concise lines on a pale ground. A compact provenance/count line precedes the labelled search/filter bar. The first record and date start within the first desktop viewport; mobile controls stack and preserve readable titles and 44px targets. No inquiry hero dominates research.

FORM: Precisely specified collection task extending established Blog/directory conventions, code-led; no open visual-world choice or comp tournament. Stable hash navigation, URL-backed filters, search empty/reset/back states and native no-JavaScript reading are signature interactions. Scope is one collection URL /consumer-alerts, with curated deduplicated records rather than new doorway articles.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Review bar

Independent route, real source variety beyond three articles, attributed current-source summaries, original dates, no guessing identities, no merging people by surname, source-specific responses, unique record anchors, deduplicated event groups, working search/filter/direct-link/reset/history, accessible readable rows at 320/390/768/1024/1440, all record text and sources in default HTML, fixed canonical and accurate CollectionPage/ItemList, sitemap/server discovery and incoming links. Historical homepage strict-comp remains unpassed and outside this task. No new rasters.

## Implemented surface — 2026-10-16

Open, rule-separated record rows extend the established inner-page navy, pale ground, display headings, body typography, labelled controls and native disclosures. Desktop places the first dated record in the first viewport; mobile uses a two-line title, stacked keyword field and paired selectors. Search submission focuses and scrolls to the results heading. Existing navigation, footer and contact controls remain shared.

Committed keyword, source-category, dispute-topic and date-order values live in URL parameters; draft values apply on submit. Quick topic links, result count, empty-state recovery, clear and browser-back states work together. Sorting changes DOM order. Stable `#record-…` links open the record disclosure, clearing conflicting filters when needed. Each row offers a native original-source link and its own permalink; the disclosure separates reported identity, event details, response, verification limits and all citations.

All eight records, details and sources are present in default prerendered HTML. Without JavaScript, enhanced search/quick filters are hidden while native disclosures and source links remain usable. CollectionPage/ItemList metadata represents the full collection; canonical stays fixed when filters change. Shared public-route discovery connects Express, prerendering and sitemap; the footer and two existing advice articles provide incoming links.

## Collection scope and maintenance

Eight record groups cite nine unique sources from six publishers: police material, Consumer Council complaint cases and media reporting. Same-event reporting and follow-ups are grouped; three separate Consumer Council cases share one counted source. Original publication dates retain month precision where that is all the source establishes. Counts describe records and publications, not proven offending merchants or victims.

Allegations, interviewee denials, merchant responses and unidentified parties remain attributed and separate. A surname does not connect the 2026 report to the 2021 arrests; neither complaints nor arrests become convictions. Three official consumer-resource links follow the register. Manual curation, corrections and source-backed responses use the existing contact channels; submissions are not published automatically. This is a curated public collection, with no SQL backend, automatic refresh or claim of exhaustive merchant/court coverage.

Data and search logic: `client/src/lib/consumerAlerts.ts`; page: `client/src/pages/ConsumerAlerts.tsx`; local styles: the `.consumer-database` section of `client/src/styles/brand-system.css`. Factual scope and source snapshot provenance: `docs/public-database-2026-10-16.md` and `docs/public-database-2026-10-16/sources.json`.

## Recorded evidence and remaining limits

Final captures opened for documentation: `/workspace/drainbear-public-database-2026-10-16/qa/database-390.png`, `database-1440.png`, `search-390.png` and `expanded-390.png` (the latter three share the same `qa/` directory). They show default mobile/desktop, a one-record search result and expanded identity/response/source reading respectively.

`/workspace/drainbear-public-database-2026-10-16/qa/results.json` records passing search, combined filters, DOM-order sorting, history, empty/reset and hash checks at 320/390/768/1024/1440, no horizontal overflow or reported axe violations, three source-link jumps and no-JavaScript reading. The coordinating validation also reports native keyboard disclosure reading, 146 tests across 27 files, typecheck, full build (217 prerenders, 215 sitemap URLs, 292 AEO answers) and compact-footer verification passing. These are local browser/build checks; physical devices were not tested.

The single detector run at `/workspace/drainbear-public-database-2026-10-16/detector.json` contains 128 advisory findings and no hard findings, including pre-existing shared-stylesheet drift. It does not authorize global token changes. DESIGN.md and `.impeccable/design.json` remain unchanged; no shipping raster was added. Independent review/verdict and production-domain publication verification remain separate pending steps. Historical homepage strict-comp remains unpassed and outside this surface.
