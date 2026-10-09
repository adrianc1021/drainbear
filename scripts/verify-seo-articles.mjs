import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "playwright";

const origin = process.argv[2] || "http://localhost:4580";
const output = process.env.ARTICLE_QA_OUTPUT || "/tmp/drainbear-seo-articles";
const images = JSON.parse(
  await fs.readFile("docs/seo-article-images.json", "utf8")
);
const axe = process.env.AXE_SOURCE_PATH
  ? await fs.readFile(process.env.AXE_SOURCE_PATH, "utf8")
  : null;
await fs.mkdir(output, { recursive: true });
const cache = new Map(),
  observations = [],
  errors = [],
  links = new Set();
async function download(url) {
  if (!cache.has(url))
    cache.set(
      url,
      (async () => {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30000),
        });
        return {
          status: response.status,
          contentType: response.headers.get("content-type") || undefined,
          body: Buffer.from(await response.arrayBuffer()),
        };
      })()
    );
  return cache.get(url);
}
async function relay(context) {
  await context.route("**/*", async route => {
    const request = route.request(),
      url = new URL(request.url());
    if (
      request.method() !== "GET" ||
      !(
        url.origin === origin ||
        url.hostname.endsWith(".sanity.io") ||
        url.hostname === "res.cloudinary.com"
      )
    )
      return route.abort();
    try {
      return route.fulfill({
        ...(await download(url.href)),
        headers: { "access-control-allow-origin": origin },
      });
    } catch {
      return route.abort();
    }
  });
}
async function ready(page) {
  await page.waitForFunction(
    () =>
      document.documentElement.dataset.seoReady === "true" &&
      document.querySelector("main h1") &&
      !document.querySelector('[data-cms-loading="true"]')
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.querySelectorAll("main img"), image => {
        image.loading = "eager";
        return image.decode().catch(() => {});
      })
    );
  });
}
const knowledge = JSON.parse(
  (await download(origin + "/knowledge.json")).body.toString()
);
const sitemap = (await download(origin + "/sitemap.xml")).body.toString();
const hashes = new Set();
for (const image of images) {
  const url = "https://drainbearhk.com/blog/" + image.slug;
  assert(sitemap.includes(url), "article is discoverable in sitemap");
  const record = knowledge.pages.find(page => page.url === url);
  assert(
    record && record.answers.length === 3,
    "article has three traceable public answers"
  );
  const html = (await download(origin + "/blog/" + image.slug)).body.toString();
  assert(html.includes('id="blog-answer-1"'), "answer exists in server HTML");
  for (const variant of image.variants) {
    const asset = await download(origin + variant.url);
    assert.equal(asset.status, 200);
    assert.match(asset.contentType, /image\/webp/);
    assert.equal(asset.body.length, variant.bytes);
    const hash = createHash("sha256").update(asset.body).digest("hex");
    assert.equal(hash, variant.sha256);
    hashes.add(hash);
  }
}
assert.equal(
  hashes.size,
  images.length * 2,
  "distinct responsive image assets"
);
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await relay(context);
    const page = await context.newPage();
    page.on("pageerror", error =>
      errors.push({ url: page.url(), width, message: error.message })
    );
    for (const image of images) {
      const path = "/blog/" + image.slug;
      assert.equal(
        (
          await page.goto(origin + path, { waitUntil: "domcontentloaded" })
        ).status(),
        200
      );
      await ready(page);
      const state = await page.evaluate(() => {
        function nodes(value) {
          return Array.isArray(value)
            ? value.flatMap(nodes)
            : value?.["@graph"]
              ? nodes(value["@graph"])
              : [value];
        }
        const schemas = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        ).flatMap(script => nodes(JSON.parse(script.textContent)));
        const article = schemas.find(item => item?.["@type"] === "Article"),
          faq = schemas.find(item => item?.["@type"] === "FAQPage");
        const cover = document.querySelector("main figure img");
        const actions = Array.from(
          document.querySelectorAll(".article-hero a")
        ).filter(a => /^tel:|https:\/\/wa.me\//.test(a.href));
        return {
          title: document.querySelector("main h1").textContent.trim(),
          h1s: document.querySelectorAll("main h1").length,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          canonical: document.querySelector('link[rel="canonical"]').href,
          cover: {
            complete: cover.complete && cover.naturalWidth > 0,
            width: Number(cover.getAttribute("width")),
            height: Number(cover.getAttribute("height")),
            ratio: cover.naturalWidth / cover.naturalHeight,
            top: cover.getBoundingClientRect().top,
            alt: cover.alt,
            srcSet: cover.srcset,
          },
          article,
          faqs: faq.mainEntity,
          answers: Array.from(
            document.querySelectorAll(".article-faq details")
          ).map(details => ({
            id: details.id,
            title: details.querySelector("summary").textContent.trim(),
            answer: details.querySelector("p").textContent.trim(),
          })),
          links: Array.from(document.querySelectorAll("main a[href]"))
            .map(a => a.getAttribute("href"))
            .filter(href => href.startsWith("/")),
          heroActions: actions.length,
          whatsappIcons: actions
            .filter(a => a.href.includes("wa.me"))
            .every(a => a.querySelector("[data-whatsapp-icon]")),
          broken: Array.from(document.querySelectorAll("main img")).filter(
            img => !img.complete || !img.naturalWidth
          ).length,
          resourceHeading: Boolean(
            document.querySelector("#article-resources-heading")
          ),
          informationClosed: !document.querySelector("#article-content-details")
            .open,
        };
      });
      assert.equal(state.h1s, 1);
      assert.equal(state.overflow, false);
      assert.equal(state.broken, 0);
      assert.equal(state.canonical, "https://drainbearhk.com" + path);
      assert(state.cover.complete && state.cover.alt.startsWith("AI "));
      assert.equal(state.cover.width, 1200);
      assert.equal(state.cover.height, 676);
      assert(Math.abs(state.cover.ratio - 16 / 9) < 0.01);
      assert(
        state.cover.srcSet.includes("640w") &&
          state.cover.srcSet.includes("1200w")
      );
      assert.equal(state.article.headline, state.title);
      assert.equal(state.article.datePublished, "2026-10-09");
      assert(!state.article.reviewedBy, "no unverified human review claim");
      assert.equal(
        state.article.image[0],
        "https://drainbearhk.com" +
          image.variants.find(item => item.width === 1200).url
      );
      assert.equal(state.answers.length, 3);
      assert.equal(state.heroActions, 2);
      assert(state.whatsappIcons);
      assert(state.resourceHeading && state.informationClosed);
      for (const [index, answer] of state.answers.entries()) {
        assert.equal(state.faqs[index].name, answer.title);
        assert.equal(state.faqs[index].acceptedAnswer.text, answer.answer);
        assert.equal(new URL(state.faqs[index].url).hash, "#" + answer.id);
      }
      for (const href of state.links) links.add(href);
      const summary = page.locator("#blog-answer-1 > summary");
      await summary.focus();
      await page.keyboard.press("Enter");
      assert(await page.locator("#blog-answer-1").evaluate(node => node.open));
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator("#blog-answer-1").evaluate(node => node.open),
        false
      );
      await page.evaluate(() => {
        location.hash = "blog-answer-2";
      });
      await page.waitForFunction(
        () => document.getElementById("blog-answer-2").open
      );
      if (axe && width !== 320) {
        await page.addScriptTag({ content: axe });
        const result = await page.evaluate(() =>
          axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
            },
          })
        );
        assert.equal(
          result.violations.length,
          0,
          JSON.stringify(
            result.violations.map(v => ({
              id: v.id,
              targets: v.nodes.map(n => n.target),
            }))
          )
        );
      }
      if (image === images[0] && width !== 320) {
        await page.evaluate(() => {
          history.replaceState(null, "", location.pathname);
          window.scrollTo(0, 0);
        });
        await page.screenshot({
          path: `${output}/article-${width}.png`,
          fullPage: true,
        });
      }
      observations.push({
        path,
        width,
        ...state,
        links: state.links.length,
        article: state.article.headline,
        faqs: state.faqs.length,
      });
    }
    await page.goto(origin + "/blog");
    await ready(page);
    for (const image of images)
      assert(
        await page.locator(`a[href="/blog/${image.slug}"]`).count(),
        "blog index includes every article in HTML"
      );
    if (width === 390)
      await page.screenshot({ path: `${output}/blog-390.png`, fullPage: true });
    await context.close();
  }
  for (const href of links) {
    const url = new URL(href, origin),
      response = await download(url.origin + url.pathname);
    assert.equal(response.status, 200, href);
    if (url.hash)
      assert(
        response.body.toString().includes(`id="${url.hash.slice(1)}"`),
        "linked fragment exists: " + href
      );
  }
  const context = await browser.newContext();
  await relay(context);
  const page = await context.newPage();
  for (const href of links)
    if (href.startsWith("/services/")) {
      await page.goto(origin + href);
      await ready(page);
      assert(
        await page
          .locator('[id^="service-reading-"] a[href^="/blog/"]')
          .count(),
        "service has article backlinks"
      );
    }
  await context.close();
  assert.equal(errors.length, 0, JSON.stringify(errors));
  await fs.writeFile(
    `${output}/results.json`,
    JSON.stringify(
      {
        origin,
        articles: images.length,
        layoutChecks: observations.length,
        axeChecks: axe ? images.length * 2 : 0,
        checkedInternalLinks: links.size,
        responsiveAssets: hashes.size,
        observations,
        errors,
      },
      null,
      2
    )
  );
  console.log(
    `PASS: ${images.length} articles, ${observations.length} layouts, ${axe ? images.length * 2 : 0} axe checks, ${hashes.size} image variants, ${links.size} internal links, FAQ anchors, service backlinks and published SEO/AEO metadata.`
  );
} finally {
  await browser.close();
}
