import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "playwright";
import { enableCmsRelay } from "./browser-cms-relay.ts";
import { NEW_SERVICE_ARTICLES } from "../client/src/lib/newServiceArticles.ts";

const origin = process.env.QA_ORIGIN || "http://localhost:4450";
const live = !new URL(origin).hostname.match(/localhost|127\.0\.0\.1/);
const out = process.env.QA_OUTPUT || "/tmp/drainbear-new-articles";
await fs.mkdir(out, { recursive: true });
const images = JSON.parse(
  await fs.readFile("docs/new-article-images-2026-10-14.json", "utf8")
);
const observations = [],
  journeys = [],
  destinations = new Set();
const fetchResult = async path => {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  return response;
};
const sitemap = await (await fetchResult("/sitemap.xml")).text();
const knowledge = await (await fetchResult("/knowledge.json")).json();
for (const row of images) {
  for (const asset of row.assets) {
    const response = await fetchResult(asset.url);
    assert.match(
      response.headers.get("content-type"),
      asset.role === "preview" ? /image\/jpeg/ : /image\/webp/
    );
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256
    );
  }
}
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
  headless: true,
});
try {
  for (const width of live ? [390, 1440] : [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    if (!live) await enableCmsRelay(context, origin);
    await context.route(
      /https:\/\/[^/]*(google-analytics\.com|googletagmanager\.com|doubleclick\.net)\//,
      route => route.abort()
    );
    await context.route("https://wa.me/**", route =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>QA intercepted WhatsApp</title>",
      })
    );
    const page = await context.newPage(),
      errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const post of NEW_SERVICE_ARTICLES) {
      const path = `/blog/${post.slug}`,
        url = "https://drainbearhk.com" + path;
      assert(sitemap.includes(url));
      const record = knowledge.pages.find(p => p.url === url);
      assert(record && record.answers.length === post.faqs.length);
      const raw = await (await fetchResult(path)).text();
      assert(raw.includes(post.sections[0].text));
      assert(raw.includes(post.coverImage.caption));
      assert(raw.includes("blog-answer-1"));
      assert.equal(
        (
          await page.goto(origin + path, { waitUntil: "domcontentloaded" })
        ).status(),
        200
      );
      await page.waitForFunction(
        () =>
          document.documentElement.dataset.seoReady === "true" &&
          document.querySelector("main article") &&
          !document.querySelector('[data-cms-loading="true"]')
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.dataset.seoCmsError),
        "false"
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const img of document.querySelectorAll("main img")) {
          img.loading = "eager";
          await img.decode();
        }
      });
      const state = await page.evaluate(() => {
        const flatten = value =>
          Array.isArray(value)
            ? value.flatMap(flatten)
            : value["@graph"]
              ? flatten(value["@graph"])
              : [value];
        const schemas = [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].flatMap(s => flatten(JSON.parse(s.textContent)));
        return {
          title: document.title,
          h1: [...document.querySelectorAll("main h1")].map(h =>
            h.textContent.trim()
          ),
          description: document.querySelector('meta[name="description"]')
            .content,
          canonical: document.querySelector('link[rel="canonical"]').href,
          robots: document.querySelector('meta[name="robots"]').content,
          og: document.querySelector('meta[property="og:image"]').content,
          twitter: document.querySelector('meta[name="twitter:image"]').content,
          article: schemas.find(s => s["@type"] === "Article"),
          faq: schemas.find(s => s["@type"] === "FAQPage"),
          answers: [...document.querySelectorAll(".article-faq details")].map(
            d => ({
              id: d.id,
              question: d.querySelector("summary").textContent.trim(),
              answer: d.querySelector("p").textContent.trim(),
            })
          ),
          images: [...document.querySelectorAll("main figure img")].map(i => ({
            src: new URL(i.getAttribute("src"), location.href).pathname,
            loaded: i.complete && i.naturalWidth > 0,
            width: Number(i.getAttribute("width")),
            height: Number(i.getAttribute("height")),
            naturalWidth: i.naturalWidth,
            naturalHeight: i.naturalHeight,
            srcSet: i.srcset,
            alt: i.alt,
          })),
          links: [...document.querySelectorAll("main a[href^='/']")].map(a =>
            a.getAttribute("href")
          ),
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      assert.equal(state.title, post.seo.metaTitle);
      assert.deepEqual(state.h1, [post.title]);
      assert.equal(state.description, post.excerpt);
      assert.equal(state.canonical, url);
      assert(!state.robots.includes("noindex"));
      assert.equal(state.og, "https://drainbearhk.com" + post.seo.ogImage.url);
      assert.equal(state.twitter, state.og);
      assert.deepEqual(state.article.image, [state.og]);
      assert.equal(state.article.datePublished, post.date);
      assert.equal(state.article.dateModified, post.date);
      assert.equal(state.article.reviewedBy, undefined);
      assert.equal(state.images.length, 2);
      assert(
        state.images.every(
          i =>
            i.loaded &&
            i.alt.startsWith("AI ") &&
            i.srcSet.includes("640w") &&
            i.srcSet.includes("960w")
        )
      );
      assert.deepEqual(
        state.images.map(i => [i.width, i.height]),
        [
          [1600, 1000],
          [1200, 800],
        ]
      );
      assert.equal(state.overflow, false);
      assert.equal(state.answers.length, 3);
      for (const [index, faq] of post.faqs.entries()) {
        assert.equal(state.faq.mainEntity[index].name, faq.question);
        assert.equal(
          state.faq.mainEntity[index].acceptedAnswer.text,
          faq.answer
        );
        assert.equal(state.answers[index].question, faq.question);
        assert.equal(state.answers[index].answer, faq.answer);
        await page.goto(origin + path + "#" + state.answers[index].id);
        await page.waitForFunction(
          id => document.getElementById(id)?.open,
          state.answers[index].id
        );
        assert(
          await page.locator("#" + state.answers[index].id + " p").isVisible()
        );
      }
      assert(state.links.includes("/"));
      state.links.forEach(link =>
        destinations.add(link.split("#")[0].split("?")[0])
      );
      for (const a of await page
        .locator('main a[href^="https://wa.me/"]')
        .all()) {
        const wa = new URL(await a.getAttribute("href"));
        assert.equal(wa.pathname, "/85295588260");
        assert.equal(wa.searchParams.get("text"), post.whatsappMessage);
      }
      assert(await page.locator('main a[href="tel:+85295588260"]').count());
      if (process.env.AXE_SOURCE_PATH) {
        await page.addScriptTag({ path: process.env.AXE_SOURCE_PATH });
        const violations = await page.evaluate(async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
              },
            })
          ).violations.map(v => v.id)
        );
        assert.deepEqual(violations, []);
      }
      if (width === 390 || width === 1440) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.screenshot({
          path: `${out}/${post.slug}-${width}.png`,
          fullPage: true,
        });
        const wa = page
          .locator('.article-hero a[href^="https://wa.me/"]')
          .first();
        const href = await wa.getAttribute("href"),
          popupPromise = context.waitForEvent("page");
        await wa.click();
        const popup = await popupPromise;
        await popup.waitForLoadState("domcontentloaded");
        assert.equal(popup.url(), href);
        await popup.close();
        await page.waitForURL(u => u.pathname === "/thanks");
        await page.waitForFunction(
          href =>
            document.querySelector(".handoff-card__actions a")?.href === href,
          href
        );
        await page.reload();
        await page.waitForFunction(
          href =>
            document.querySelector(".handoff-card__actions a")?.href === href,
          href
        );
        journeys.push({
          slug: post.slug,
          width,
          handoffAndReloadPreserved: true,
          noMessageSent: true,
        });
      }
      assert.deepEqual(errors, []);
      observations.push({
        slug: post.slug,
        width,
        ...state,
        axePassed: Boolean(process.env.AXE_SOURCE_PATH),
      });
    }
    await page.goto(origin + "/blog");
    await page.waitForFunction(
      () =>
        document.querySelector(".blog-page .blog-reading-grid") &&
        !document.querySelector('[data-cms-loading="true"]')
    );
    for (const post of NEW_SERVICE_ARTICLES) {
      const card = page
        .locator(`main a[href='/blog/${post.slug}']`)
        .filter({ has: page.locator("img") });
      assert.equal(await card.count(), 1);
      await card.locator("img").scrollIntoViewIfNeeded();
      await card.locator("img").evaluate(i => i.decode());
    }
    assert(
      !(await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1
      ))
    );
    if (width === 390 || width === 1440)
      await page.screenshot({ path: `${out}/blog-list-${width}.png` });
    await context.close();
  }
  for (const path of destinations) await fetchResult(path);
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await noJs.newPage();
  for (const post of NEW_SERVICE_ARTICLES) {
    await page.goto(origin + "/blog/" + post.slug);
    assert(
      await page.getByText(post.sections[0].text, { exact: true }).isVisible()
    );
    assert(await page.locator('main article a[href="/"]').isVisible());
    if (
      !((await page.locator("#blog-answer-1").getAttribute("open")) !== null)
    ) {
      await page.locator("#blog-answer-1 summary").click();
    }
    await page.locator("#blog-answer-1 p").waitFor({ state: "visible" });
  }
  await noJs.close();
  console.log(
    JSON.stringify({
      origin,
      layouts: observations.length,
      whatsappJourneys: journeys.length,
      checkedLinks: destinations.size,
      imageFiles: 21,
      noJsPassed: true,
      allPassed: true,
    })
  );
} finally {
  await browser.close();
  await fs.writeFile(
    `${out}/verification.json`,
    JSON.stringify(
      { origin, live, observations, journeys, checkedLinks: [...destinations] },
      null,
      2
    ) + "\n"
  );
}
