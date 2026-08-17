import { readFileSync } from "node:fs";

const areasSource = readFileSync("client/src/pages/Areas.tsx", "utf8");
const regionSource =
  areasSource.match(
    /const REGIONS = \[([\s\S]*?)\n\];\n\nconst ALL_DISTRICTS/
  )?.[1] ?? "";
const coverageNames = Array.from(
  regionSource.matchAll(/items:\s*\[([\s\S]*?)\]/g)
).flatMap(match =>
  Array.from(match[1].matchAll(/"([^"]+)"/g), item => item[1])
);
const uniqueCoverageNames = new Set(coverageNames);

if (uniqueCoverageNames.size === 0) {
  throw new Error("未能從 Areas.tsx 讀取服務地區清單");
}

console.log("REGIONS 地區總數:", uniqueCoverageNames.size);

const districtSource =
  readFileSync("client/src/lib/districtData.ts", "utf8") +
  readFileSync("client/src/lib/districtData2.ts", "utf8");
const districtPages = Array.from(
  districtSource.matchAll(/\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g),
  match => ({ slug: match[1], name: match[2] })
);

if (districtPages.length === 0) {
  throw new Error("未能讀取地區著陸頁資料");
}

console.log("著陸頁地區:", districtPages.map(page => page.name).join(","));

const missingCoverage = districtPages.filter(
  page => !uniqueCoverageNames.has(page.name)
);

if (missingCoverage.length > 0) {
  throw new Error(
    `著陸頁地區未列於分區清單: ${missingCoverage
      .map(page => page.name)
      .join(",")}`
  );
}

const sitemap = readFileSync("client/public/sitemap.xml", "utf8");
const missingSitemap = districtPages.filter(
  page =>
    !sitemap.includes(`https://drainbearhk.com/areas/${page.slug}</loc>`)
);

if (missingSitemap.length > 0) {
  throw new Error(
    `地區著陸頁未列於 sitemap: ${missingSitemap
      .map(page => page.slug)
      .join(",")}`
  );
}

if (
  !districtSource.includes(
    "Object.fromEntries(\n  DISTRICTS.map((d) => [d.name, d.slug])"
  )
) {
  throw new Error("DISTRICT_SLUGS 未由 DISTRICTS 自動生成");
}

console.log("PASS：全部地區著陸頁可被搜尋，並已加入 sitemap");
