import { describe, it, expect } from "vitest";
import { legacyGuideRedirect, publicDocumentStatus } from "./indexingRoutes";
describe("indexing route repairs", () => {
  it.each([
    ["/guide?location=toilet", "/services/toilet-unblocking"],
    ["/guide/?location=shower", "/services/bathroom-drain-unblocking"],
    [
      "/guide?location=mainpipe&utm_source=google",
      "/services/main-drain-manhole?utm_source=google",
    ],
    ["/guide?location", "/guide"],
    ["/guide/?location=&gclid=abc", "/guide?gclid=abc"],
  ])("permanently maps %s to its intended content", (url, target) =>
    expect(legacyGuideRedirect(url)).toBe(target)
  );
  it.each([
    "/$",
    "/guide",
    "/guide?utm_source=google",
    "/guide?location=unknown",
    "/guide?location=constructor",
    "/guide?location=__proto__",
    "/guide?location=https://example.com",
    "/guide?location=toilet&location=shower",
  ])("does not invent a redirect for %s", url =>
    expect(legacyGuideRedirect(url)).toBeNull()
  );
  it.each(["/404", "/404.html", "/404/"])(
    "marks %s as a genuine error even if pre-rendered",
    path => expect(publicDocumentStatus(path, true)).toBe(404)
  );
  it("keeps ordinary pages and arbitrary missing URLs distinct", () => {
    expect(publicDocumentStatus("/guide", true)).toBe(200);
    expect(publicDocumentStatus("/$", false)).toBe(404);
  });
});
