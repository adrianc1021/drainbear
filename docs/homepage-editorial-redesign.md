# DrainBear Homepage — Hong Kong Utility Editorial

## Status

PR #20 design contract.

This document freezes the scope and acceptance criteria for the homepage
editorial redesign. It does not change analytics taxonomy, attribution,
WhatsApp handoff behaviour, SEO metadata, routing, pricing logic, or CMS data.

## Brand direction

**Hong Kong Utility Editorial**

The visual language should feel like a disciplined Hong Kong engineering
service: direct, documented, practical, local, and trustworthy.

It should not resemble:

- a generic SaaS landing page;
- an ecommerce card grid;
- a cartoon plumbing website;
- a luxury interior-design studio;
- a dashboard composed entirely of floating cards.

## Core principles

1. Build hierarchy with typography, spacing, rules, imagery, and contrast.
2. Use cards only when a contained interactive unit is genuinely necessary.
3. Reserve WhatsApp green for conversion actions and live-status details.
4. Use safety orange only for indexes, labels, and operational emphasis.
5. Prefer square or restrained corners; shadows are reserved for overlays.
6. Use real service language and existing verified engineering records.
7. Keep mobile WhatsApp and phone access visible without overlapping widgets.
8. Preserve all PR #19 conversion and attribution behaviour.

## Homepage information architecture

1. Editorial hero
2. Problem-led quick diagnosis
3. Operational trust strip
4. Transparent pricing promise
5. Equipment and service capability
6. Indexed service directory
7. Featured engineering case
8. Four-step service timeline
9. Google review gateway
10. Drain Care Journal
11. Full-width contact close

## Visual tokens

- Paper: `#F3F0E8`
- White: `#FFFFFF`
- Navy: `#091226`
- Deep navy: `#071020`
- WhatsApp: `#25D366`
- Safety orange: `#FF6B00`
- Editorial rule: `rgba(9, 18, 38, 0.16)`
- General radius: `0–6px`
- Overlay radius: `8–12px`

The foundation must initially be scoped to the homepage so that service,
district, guide, blog, and CMS pages are not unintentionally redesigned.

## Conversion requirements

The following tracking locations must continue to work:

- `home_hero`
- `home_quick_select`
- `mobile_bar`
- `header`
- `floating_widget`
- final homepage CTA location

Required behaviour:

- WhatsApp click creates one handoff token.
- `/thanks` consumes the token once.
- Refreshing `/thanks` must not duplicate `whatsapp_handoff`.
- Localhost and Vercel Preview must not send production GA4 traffic.
- Phone links continue to emit `phone_click`.
- No PII is added to analytics parameters.

## SEO and content requirements

- Exactly one visible `h1`.
- Existing homepage title, description, keywords, canonical URL and JSON-LD
  remain intact unless separately approved.
- Important service and district copy remains server-prerenderable.
- Images retain meaningful alternative text.
- Internal service, guide, area and blog links remain crawlable.
- No review quote or business statistic may be invented.

## Responsive requirements

Test widths:

- 390 × 844
- 768 × 1024
- 1440 × 1000

At every width:

- no horizontal overflow;
- hero CTA remains visible;
- body text remains readable;
- focus state remains visible;
- mobile bottom CTA does not overlap the WhatsApp widget;
- reduced-motion users receive a non-animated experience.

## Card reduction target

The homepage should contain no generic `.card-float` or `.card-accent` layout
inside the redesigned editorial root.

Interactive overlays, the mobile menu, and the WhatsApp dialog may remain
contained surfaces because they are genuine floating interface elements.

## PR #20 stages

1. Baseline and design contract
2. Scoped editorial design foundation
3. Core homepage service experience
4. Supporting editorial content
5. Responsive conversion interface
6. Browser and tracking acceptance
7. Vercel Preview acceptance

Production merge is outside these implementation stages and requires explicit
approval.
