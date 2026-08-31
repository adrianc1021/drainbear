import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const robotsPath = path.join(root, "client", "public", "robots.txt");
const llmsPath = path.join(root, "client", "public", "llms.txt");
const vercelPath = path.join(root, "vercel.json");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const robots = read(robotsPath);
const llms = read(llmsPath);
const vercel = JSON.parse(read(vercelPath));

assert(/User-agent:\s*\*/i.test(robots), "robots.txt is missing the default user-agent");
assert(/Sitemap:\s*https:\/\/drainbearhk\.com\/sitemap\.xml/i.test(robots), "robots.txt has no production sitemap");
for (const crawler of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
  assert(new RegExp(`User-agent:\\s*${crawler}`, "i").test(robots), `${crawler} is not explicitly covered`);
}

for (const route of ["/", "/services", "/guide", "/areas", "/faq", "/blog"]) {
  assert(llms.includes(`https://drainbearhk.com${route}`), `llms.txt is missing ${route}`);
}

assert(llms.includes("+852 9558 8260"), "llms.txt is missing the public contact number");
assert(llms.includes("以確認的現場報價為準"), "llms.txt is missing its pricing qualification");
assert(llms.includes("不代表任何排名、推薦或引用保證"), "llms.txt must not promise AI citations");
assert(vercel.buildCommand === "pnpm build", "Vercel must run the complete build");
assert(vercel.outputDirectory === "dist/public", "Vercel output directory must be dist/public");
assert(vercel.rewrites?.some(rule => rule.source === "/(.*)" && rule.destination === "/index.html"), "Vercel SPA fallback rewrite is missing");

console.log("PASS: SEO discoverability files and Vercel fallback are configured");
