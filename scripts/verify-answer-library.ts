/** Release guard for the authored answer library and owner-confirmed starting quote. */
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { DRAIN_ANSWERS, ANSWER_ROUTES } from "../shared/drainAnswers";
import { SERVICE_SLUGS } from "../shared/publicRoutes";
import { STARTING_PRICE_HKD, STARTING_PRICE_LINE } from "../shared/pricing";

function walk(value: unknown): Record<string, unknown>[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(walk);
  const object = value as Record<string, unknown>;
  return [object, ...Object.values(object).flatMap(walk)];
}
async function main() {
  const sitemap = await fs.readFile("dist/public/sitemap.xml", "utf8");
  const urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
    match => match[1]
  );
  const childUrls = urls.filter(url => new URL(url).pathname !== "/");
  assert(
    childUrls.length > 200,
    `Only ${childUrls.length} indexable child pages`
  );
  const manifest = JSON.parse(
    await fs.readFile("dist/prerender/routes.json", "utf8")
  );
  const routes = new Set<string>(manifest.routes);
  const titles = new Set<string>();
  for (const route of ANSWER_ROUTES) {
    const html = await fs.readFile(
      path.join("dist/public", `${route.slice(1)}.html`),
      "utf8"
    );
    assert(
      urls.includes(`https://drainbearhk.com${route}`),
      `${route}: missing sitemap entry`
    );
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: H1 count`);
    assert(
      html.includes(`href="https://drainbearhk.com${route}"`),
      `${route}: canonical`
    );
    assert(
      !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html),
      `${route}: noindex`
    );
    assert(
      html.includes(STARTING_PRICE_LINE),
      `${route}: visible starting price`
    );
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    assert(title && !titles.has(title), `${route}: duplicate or absent title`);
    titles.add(title);
    const answer = DRAIN_ANSWERS.find(
      item => `/answers/${item.slug}` === route
    );
    if (answer) {
      for (const text of [
        answer.question,
        answer.answer,
        answer.observation,
        answer.nextStep,
      ])
        assert(html.includes(text), `${route}: missing authored content`);
      assert(
        html.includes(`href="/services/${answer.serviceSlug}"`),
        `${route}: service link`
      );
      assert(html.includes('href="/"'), `${route}: homepage link`);
      assert(
        html.includes('id="direct-answer"'),
        `${route}: missing direct answer anchor`
      );
    }
    for (const match of Array.from(
      html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)
    )) {
      const url = new URL(
        match[1].replaceAll("&amp;", "&"),
        "https://drainbearhk.com" + route
      );
      if (url.origin === "https://drainbearhk.com")
        assert(
          routes.has(url.pathname),
          `${route}: missing destination ${url.pathname}`
        );
    }
  }
  for (const route of [
    "/",
    "/services",
    "/guide",
    "/faq",
    "/blog/hong-kong-drain-cleaning-price-guide",
    ...SERVICE_SLUGS.map(slug => `/services/${slug}`),
  ]) {
    const html = await fs.readFile(
      route === "/" ? "dist/public/index.html" : `dist/public${route}.html`,
      "utf8"
    );
    assert(html.includes(STARTING_PRICE_LINE), `${route}: price not visible`);
    const nodes = Array.from(
      html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
      )
    ).flatMap(match => walk(JSON.parse(match[1])));
    const offers = nodes.filter(node => node["@type"] === "Offer");
    assert(offers.length, `${route}: missing business offers`);
    for (const offer of offers) {
      const spec = offer.priceSpecification as Record<string, unknown>;
      assert.equal(
        spec?.minPrice,
        STARTING_PRICE_HKD,
        `${route}: incorrect minimum`
      );
      assert.equal(spec?.priceCurrency, "HKD", `${route}: incorrect currency`);
      assert(
        !("price" in offer),
        `${route}: starting quote became fixed total`
      );
    }
  }
  console.log(
    `PASS: ${childUrls.length} indexable child pages; ${DRAIN_ANSWERS.length} complete answers; self-canonicals, unique titles, valid route targets and HK$300 minimum offers`
  );
}
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
