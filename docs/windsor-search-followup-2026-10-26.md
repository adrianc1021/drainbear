# Windsor Search Console follow-up — 2026-10-26

## Evidence

Source: read the completed analysis in Codex thread `01a1779f-a844-7fc0-a19b-57d4df392626`, produced using Windsor.ai Search Console. Current period 2026-09-27–2026-10-24; previous 2026-08-30–2026-09-26. Hong Kong query × page evidence is distinct from page totals. Connector default search type was not independently verified. Raw data remain in the source thread's local report package; this task uses its recorded report and inspected query calls, not a new connector fetch.

Hong Kong clicks: 141 → 207 (+46.8%); impressions: 33,942 → 37,113 (+9.3%); CTR: 0.42% → 0.56%; average position: 33.45 → 30.20. Mobile supplied 166 of 207 clicks (80.2%). Search clicks are not enquiries or sales.

## Ten-page decisions

| Target | Hong Kong query evidence: impressions / clicks / average position | Current gap and action |
|---|---|---|
| North Point | 北角通渠: 293 / 0 / 10.86 | Existing body already covers Fortress Hill. Add it to the concise description and lead; retain the recently revised title. Add a relevant toilet service backlink. |
| Causeway Bay | 大坑通渠: 256 / 0 / 9.86 | Title and Tai Hang section already exist. Make description/lead service- and quotation-oriented; link from bathroom and grease-trap services to existing section anchors. |
| Kwun Tong | 觀塘通渠: 313 / 0 / 15.73 | Retain industrial-kitchen article; replace general preparation summary with service/price/enquiry summary. Add contextual grease-trap backlink. |
| Tai Po | 大埔通渠: 223 / 0 / 15.68 | Retain residential, market and village distinctions; improve enquiry summary and add main-drain service backlink. |
| Sewage backflow | 污水渠倒灌: 95 / 0 / 10.56 | Existing safety, responsibility and procedures present. Rewrite description and connect an actionable hero lead to the visible rendering path. |
| Sha Tin | 大圍通渠: 263 / 0 / 18.15 | Include Tai Wai in visible H1; replace generic washing-machine paragraph with concise Tai Wai residential action/management guidance. Retain existing section ID and Fo Tan sections. |
| CCTV guide | 照渠: 108 / 0 / 8.02 | Existing definition, process and service link present. Add a short upfront quotation/deliverables answer and matching FAQ. Preserve title and original CMS body. |
| Consumer red flags | 通渠公司黑店: 180 / 0 / 7.37 | Already revised today with sources and direct answer. Inspect but leave content unchanged; historical data cannot evaluate today's revision. |
| Main versus branch drain | 污水渠塞 責任: 65 / 0 / 8.69 | Replace introductory hypothetical enquiry scenario with a direct responsibility answer; align title/description and add matching FAQ. Preserve original explanatory body. |
| Washing-machine backflow | 洗衣機去水倒灌: 109 / 7 / 3.03 | Existing bathroom/backflow links and topic-specific WhatsApp message present. Preserve title, URL and content; verify UI and contact links. |

## Implementation

- `districtSearchContent.ts`: concise unique service summaries, Tai Wai visible heading/answer, actual revision dates for changed districts only.
- `serviceData.ts` / `ServiceDetail.tsx`: sewage enquiry copy and hero rendering; contextual area preparation links.
- `ServiceDistrictReading.tsx`: six relevant links across four service pages, each targeting a real article section; no new area pages or project claims.
- `queryIntentRevision.ts`: two CMS-preserving website revisions, shared metadata/list/detail dates and visible FAQ content. Main-drain responsibility opening replaces the hypothetical scenario; original publication and body retained.
- `queryIntentRevision.test.ts`: preservation and idempotence tests cover both additions.

No new claimed case studies, business qualifications, fixed arrival times or reviews. No Ads settings, tracking IDs, canonical policies or URLs changed. Existing article images remain.

## Validation and follow-up

TypeScript and 179 tests passed. Full build validates CMS-backed pre-rendering, sitemap, SEO, answer library and AEO. Browser verification covers the ten targets at 390/1440px, plus the new contextual links and destination anchors with JavaScript disabled. Detailed execution evidence and before/after metadata are saved in `/workspace/drainbear-windsor-2026-10-26/`.

After deployment, compare a complete subsequent 28-day period using the same Hong Kong, device and query × page definitions. Keep metadata stable during observation. No ranking, AI recommendation or indexing guarantee; Windsor is read-only Search Analytics and cannot submit indexing validation.

Local browser checks passed for all ten targets at both widths, with zero axe WCAG A/AA findings in the tested mobile pages. Six new destination anchors work with JavaScript disabled. An isolated local contact test confirmed one `phone_click` and one `whatsapp_click`, topic-specific WhatsApp text and the thanks handoff; external analytics and WhatsApp requests were blocked. This does not verify GA4 server receipt or real enquiries. Visual review shortened the Sha Tin heading to avoid an orphan character on mobile.
