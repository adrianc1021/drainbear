import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { RECORDED_VIDEO_CASES } from "../shared/recordedVideoCases.ts";
import { enableCmsRelay } from "./browser-cms-relay.ts";

const output = process.env.VIDEO_REVIEW_OUTPUT || "/tmp/drainbear-video-review";
await fs.mkdir(output, { recursive: true });
const server = spawn(process.execPath, ["dist/index.js"], {
  env: { ...process.env, NODE_ENV: "production", PORT: "4560" },
  stdio: ["ignore", "pipe", "pipe"],
});
const ready = new Promise((resolve, reject) => {
  const timer = setTimeout(
    () => reject(new Error("Video preview startup timeout")),
    30000
  );
  server.stdout.on("data", chunk => {
    const match = String(chunk).match(
      /Server running on (http:\/\/localhost:\d+)/
    );
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
  server.once("error", reject);
});
let browser;
const checks = [];
try {
  const origin = await ready;
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox"],
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await enableCmsRelay(context, origin);
    const page = await context.newPage();
    const mediaRequests = [];
    page.on("request", request => {
      if (request.url().endsWith(".mp4")) mediaRequests.push(request.url());
    });
    for (const route of ["/", "/cases"]) {
      await page.goto(origin + route);
      await page.waitForFunction(() =>
        document.querySelector("[data-seo-ready='true']")
      );
      if (route === "/cases") {
        await page.waitForFunction(() =>
          document.querySelector('[data-cms-loading="false"]')
        );
      }
      assert.equal(
        mediaRequests.length,
        0,
        "collection pages must not download videos"
      );
      assert.equal(
        await page.locator(".recorded-case-card").count(),
        route === "/" ? 3 : 5
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        )
      );
      const mediaRatios = await page
        .locator(".recorded-case-card__media")
        .evaluateAll(elements =>
          elements.map(element => {
            const box = element.getBoundingClientRect();
            return box.width / box.height;
          })
        );
      assert(
        mediaRatios.every(ratio => Math.abs(ratio - 1.6) < 0.02),
        "thumbnail panels retain the compact 16:10 ratio"
      );
      await page
        .locator(".recorded-case-grid")
        .first()
        .scrollIntoViewIfNeeded();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.querySelectorAll(".recorded-case-card img")).map(
            img => {
              img.loading = "eager";
              return img.decode().catch(() => {});
            }
          )
        );
      });
      if (route === "/cases")
        await page.screenshot({
          path: `${output}/cases-${width}.png`,
          fullPage: true,
        });
      else
        await page
          .locator(".home-recorded-cases")
          .screenshot({ path: `${output}/home-cases-${width}.png` });
    }
    if (![390, 1440].includes(width)) {
      console.log(
        `PASS ${width}px: homepage and case cards, no overflow or eager MP4 downloads`
      );
      await context.close();
      continue;
    }
    for (const study of RECORDED_VIDEO_CASES) {
      const path = `/cases/${study.slug}`;
      const response = await page.goto(origin + path);
      assert.equal(response.status(), 200);
      await page.waitForFunction(() =>
        document.querySelector("[data-seo-ready='true']")
      );
      const video = page.locator("video");
      await video.waitFor({ state: "visible" });
      assert.equal(await video.count(), 1);
      const start = await video.evaluate(v => ({
        preload: v.preload,
        autoplay: v.autoplay,
        paused: v.paused,
        currentSrc: v.currentSrc,
      }));
      assert.equal(start.preload, "none");
      assert.equal(start.autoplay, false);
      assert.equal(start.paused, true);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        )
      );
      await video.scrollIntoViewIfNeeded();
      await video.click();
      await video.evaluate(async v => {
        v.textTracks[0].mode = "hidden";
        await v.play();
      });
      await page.waitForFunction(
        () => document.querySelector("video").currentTime > 0.25
      );
      await page.waitForFunction(
        () => document.querySelector("video").textTracks[0].cues?.length === 2
      );
      const playing = await video.evaluate(v => ({
        duration: v.duration,
        currentTime: v.currentTime,
        width: v.videoWidth,
        height: v.videoHeight,
        error: v.error,
        cues: Array.from(v.textTracks[0].cues).map(c => c.text),
      }));
      assert(Math.abs(playing.duration - study.video.durationSeconds) < 0.1);
      assert.equal(playing.width, 540);
      assert.equal(playing.height, 960);
      assert.equal(playing.error, null);
      assert.deepEqual(
        playing.cues,
        study.video.chapters.map(c => c.text)
      );
      await video.evaluate(v => {
        v.pause();
        v.currentTime = v.duration - 1;
      });
      await page.waitForFunction(() => {
        const v = document.querySelector("video");
        return v.readyState >= 2 && v.currentTime > v.duration - 1.1;
      });
      await video.evaluate(v => v.play());
      await page.waitForFunction(() => document.querySelector("video").ended);
      const contentEvents = await page.evaluate(() =>
        (window.dataLayer || []).filter(item =>
          item.event?.startsWith("case_video_")
        )
      );
      for (const event of [
        "case_video_start",
        "case_video_progress",
        "case_video_complete",
      ]) {
        assert.equal(
          contentEvents.filter(item => item.event === event).length,
          1,
          `${event} must be recorded once per video visit`
        );
      }
      assert(contentEvents.every(item => item.case_slug === study.slug));
      const range = await fetch(origin + study.video.src, {
        headers: { Range: "bytes=0-1023" },
      });
      assert.equal(range.status, 206);
      assert.match(range.headers.get("content-type"), /video\/mp4/);
      assert.equal(
        range.headers.get("content-range"),
        `bytes 0-1023/${study.video.bytes}`
      );
      if (study === RECORDED_VIDEO_CASES[0]) {
        await video.evaluate(v => {
          v.currentTime = 1;
        });
        await page
          .locator(".case-detail-hero")
          .screenshot({ path: `${output}/video-hero-${width}.png` });
      }
      checks.push({
        width,
        path,
        duration: playing.duration,
        playing: true,
        seeking: true,
        captions: true,
        byteRange: 206,
        analyticsMilestonesDeduplicated: true,
      });
      console.log(
        `PASS ${width}px ${path}: playback, seek, captions, range 206`
      );
    }
    await context.close();
  }
  await fs.writeFile(
    `${output}/playback-checks.json`,
    JSON.stringify(checks, null, 2)
  );
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
