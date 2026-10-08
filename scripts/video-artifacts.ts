import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { RECORDED_VIDEO_CASES } from "../shared/recordedVideoCases";
import { graphNodes } from "./aeo-artifacts";

const SITE = "https://drainbearhk.com";
function xml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function writeVideoSitemap(root: string) {
  const entries = RECORDED_VIDEO_CASES.map(
    study => `  <url>
    <loc>${SITE}/cases/${study.slug}</loc>
    <video:video>
      <video:thumbnail_loc>${SITE}${study.video.poster}</video:thumbnail_loc>
      <video:title>${xml(study.title)}</video:title>
      <video:description>${xml(study.summary)}</video:description>
      <video:content_loc>${SITE}${study.video.src}</video:content_loc>
      <video:duration>${Math.round(study.video.durationSeconds)}</video:duration>
      <video:publication_date>${study.publishedAt}</video:publication_date>
    </video:video>
  </url>`
  );
  await fs.writeFile(
    path.join(root, "video-sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join("\n")}
</urlset>\n`
  );
}

export async function verifyVideoArtifacts(
  root: string,
  pages: { url: string; text: string; structuredData: unknown[] }[]
) {
  const sitemap = await fs.readFile(
    path.join(root, "video-sitemap.xml"),
    "utf8"
  );
  assert.equal(
    (sitemap.match(/<video:video>/g) || []).length,
    RECORDED_VIDEO_CASES.length
  );
  for (const study of RECORDED_VIDEO_CASES) {
    const url = `${SITE}/cases/${study.slug}`;
    const page = pages.find(page => page.url === url);
    assert(page, "video page must be canonical and present in AEO knowledge");
    const node = graphNodes(page.structuredData).find(
      node => node["@type"] === "VideoObject"
    );
    assert(node, "published video needs a VideoObject");
    assert.equal(node.contentUrl, `${SITE}${study.video.src}`);
    assert.equal(node.thumbnailUrl, `${SITE}${study.video.poster}`);
    assert.equal(node.uploadDate, study.publishedAt);
    assert.equal(node.duration, `PT${study.video.durationSeconds}S`);
    assert.equal(node.name, study.title);
    assert(sitemap.includes(url));
    assert(sitemap.includes(String(node.contentUrl)));
    const html = await fs.readFile(
      path.join(root, `cases/${study.slug}.html`),
      "utf8"
    );
    assert(
      html.includes("<video") && html.includes('preload="none"'),
      "visible player without eager downloads"
    );
    assert(html.includes(`src="${study.video.src}"`));
    assert(html.includes(`poster="${study.video.poster}"`));
    assert(html.includes(`src="${study.video.captions}"`));
    const [movie, poster, captions] = await Promise.all(
      [study.video.src, study.video.poster, study.video.captions].map(file =>
        fs.readFile(path.join(root, file.slice(1)))
      )
    );
    assert.equal(movie.length, study.video.bytes);
    assert.equal(
      createHash("sha256").update(movie).digest("hex"),
      study.video.sha256
    );
    assert.equal(poster.toString("ascii", 8, 12), "WEBP");
    assert(captions.toString().startsWith("WEBVTT"));
    const atoms: string[] = [];
    for (let offset = 0; offset < movie.length; ) {
      const size = movie.readUInt32BE(offset);
      assert(
        size >= 8 && offset + size <= movie.length,
        "valid MP4 top-level atom"
      );
      atoms.push(movie.toString("ascii", offset + 4, offset + 8));
      offset += size;
    }
    assert(atoms.includes("moov") && atoms.includes("mdat"));
    assert(
      atoms.indexOf("moov") < atoms.indexOf("mdat"),
      "faststart metadata precedes media"
    );
    for (const chapter of study.video.chapters) {
      assert(
        page.text.includes(chapter.text),
        "caption is available in public text"
      );
      assert(
        captions.toString().includes(chapter.text),
        "caption matches published track"
      );
      assert(
        chapter.end <= study.video.durationSeconds + 0.05,
        "caption timing fits actual video duration"
      );
    }
  }
  console.log(
    `PASS: ${RECORDED_VIDEO_CASES.length} real videos, media checksums, faststart, captions, VideoObject and video sitemap`
  );
}
