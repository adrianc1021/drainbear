import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { graphNodes } from "./aeo-artifacts";
import { verifyVideoArtifacts } from "./video-artifacts";

async function verifyAeo() {
  const root = path.resolve("dist/public");
  const [knowledgeText, index, full, sitemap] = await Promise.all(
    ["knowledge.json", "llms.txt", "llms-full.txt", "sitemap.xml"].map(file =>
      fs.readFile(path.join(root, file), "utf8")
    )
  );
  const knowledge = JSON.parse(knowledgeText);
  const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
    .map(match => match[1])
    .sort();
  assert.equal(knowledge.format, "drainbear-public-knowledge/1");
  assert.deepEqual(
    knowledge.pages.map((page: { url: string }) => page.url).sort(),
    sitemapUrls,
    "AEO coverage must exactly match indexable sitemap pages"
  );
  assert.equal(knowledge.coverage.indexablePages, sitemapUrls.length);
  assert.equal(
    knowledge.organization["@id"],
    "https://drainbearhk.com/#organization"
  );
  assert(knowledge.organization.telephone, "resolved public telephone");
  assert(index.includes(knowledge.organization.name));
  assert(full.includes(knowledge.organization.name));
  assert(!index.includes("https://drainbearhk.com/thanks"));
  assert(!index.includes("https://drainbearhk.com/404"));

  let answers = 0;
  for (const page of knowledge.pages) {
    const url = new URL(page.url);
    const file =
      url.pathname === "/" ? "index.html" : url.pathname.slice(1) + ".html";
    const html = await fs.readFile(path.join(root, file), "utf8");
    assert(html.includes(page.url), "canonical URL present in built HTML");
    assert(!/<meta[^>]*name="robots"[^>]*content="noindex/i.test(html));
    assert(index.includes(page.url), "index source link");
    assert(full.includes(page.text), "full public text");
    const nodes = graphNodes(page.structuredData);
    for (const node of nodes.filter(node =>
      ["Service", "Article"].includes(String(node["@type"]))
    )) {
      assert(node["@id"], "service and article IDs must be stable");
      assert(
        node.provider || node.publisher,
        "service or article must connect to business"
      );
    }
    for (const answer of page.answers) {
      answers++;
      assert(full.includes(answer.answer));
      assert.equal(new URL(answer.source).pathname, url.pathname);
      const hash = new URL(answer.source).hash.slice(1);
      if (hash)
        assert(
          html.includes(`id="${hash}"`),
          "answer source fragment resolves"
        );
      for (const citation of answer.citations)
        assert(
          sitemapUrls.includes(citation),
          "answer citation points to an indexable public page"
        );
    }
  }
  assert.equal(knowledge.coverage.answers, answers);
  assert(answers >= 15, "public answers exist");
  await verifyVideoArtifacts(root, knowledge.pages);
  console.log(
    `PASS: AEO coverage, ${sitemapUrls.length} canonical pages, ${answers} visible answers, sources and stable entity relationships`
  );
}

verifyAeo().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
