import path from "node:path";
import fs from "node:fs";
import { ServerResponse, IncomingMessage } from "node:http";
import { Socket } from "node:net";
import express from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { serveStatic } from "./vite";

vi.mock("../../vite.config", () => ({ default: {} }));

afterEach(() => vi.restoreAllMocks());

function responseHeadersFor(relativeFile: string) {
  // Exercise our registered static-file header policy without opening a port.
  // Filesystem availability is unrelated to the cache policy under test.
  vi.spyOn(fs, "existsSync").mockReturnValue(true);
  vi.spyOn(fs, "readFileSync").mockReturnValue('{"routes":["/"]}');
  const staticMiddleware = vi.spyOn(express, "static");
  serveStatic(express());
  const [root, options] = staticMiddleware.mock.calls[0];
  const request = new IncomingMessage(new Socket());
  const response = new ServerResponse(request);
  options?.setHeaders?.(
    response,
    path.join(root, relativeFile),
    {} as fs.Stats
  );
  return response;
}

describe("production static asset caching", () => {
  it.each([
    "assets/index-BbsAZmRt.css",
    "assets/Guide-De1x_9aZ.js",
    "assets/font-BbsAZmRt.woff2",
  ])("reuses fingerprinted %s without a repeat network request", file => {
    expect(responseHeadersFor(file).getHeader("Cache-Control")).toBe(
      "public, max-age=31536000, immutable"
    );
  });

  it.each([
    "index.html",
    "guide.html",
    "assets/index.js",
    "images/home-drain-technician-wide.jpg",
    "robots.txt",
    "sitemap.xml",
  ])("never makes replaceable %s immutable", file => {
    expect(responseHeadersFor(file).getHeader("Cache-Control")).toBe(
      "public, max-age=0, must-revalidate"
    );
  });
});
