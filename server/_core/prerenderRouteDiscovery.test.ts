import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const io = vi.hoisted(() => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  rm: vi.fn(),
  spawn: vi.fn(),
}));

// Run the actual prerender entrypoint, isolating only external I/O. The sentinel
// stops before a server/browser can run or affect another local preview.
vi.mock("node:fs/promises", () => ({ default: io }));
vi.mock("node:child_process", () => ({ spawn: io.spawn }));
vi.mock("playwright", () => ({ chromium: {} }));

const staleSitemap = `<urlset><url><loc>https://drainbearhk.com/blog/old-post</loc></url><url><loc>https://drainbearhk.com/cases/old-case</loc></url></urlset>`;
const originalExitCode = process.exitCode;

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  io.readFile.mockResolvedValue(staleSitemap);
  io.writeFile.mockResolvedValue(undefined);
  io.mkdir.mockResolvedValue(undefined);
  io.rm.mockResolvedValue(undefined);
  io.spawn.mockImplementation(() => {
    throw new Error("TEST: route discovery reached rendering");
  });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  process.exitCode = undefined;
});

afterEach(() => {
  process.exitCode = originalExitCode;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function runDiscovery(
  responseFor: (kind: "blog" | "case") => Promise<Response> | Response
) {
  vi.stubGlobal("fetch", async (url: URL) => {
    const query = url.searchParams.get("query") || "";
    return responseFor(query.includes('"blogPost"') ? "blog" : "case");
  });
  await import("../../scripts/prerender");
  await vi.waitFor(() => expect(console.error).toHaveBeenCalled());
}

describe("prerender route discovery publication gate", () => {
  it.each(["blog", "case"] as const)(
    "stops on a failed %s route query instead of publishing the old sitemap",
    async failureKind => {
      await runDiscovery(kind =>
        kind === failureKind
          ? new Response("Unavailable", { status: 503 })
          : Response.json({ result: [] })
      );
      expect(process.exitCode).toBe(1);
      expect(io.spawn.mock.calls.length).toBe(0);
      expect(io.writeFile.mock.calls.length).toBe(0);
      expect(io.readFile.mock.calls.length).toBe(0);
      expect(io.rm.mock.calls.length).toBe(0);
    }
  );

  it.each(["blog", "case"] as const)(
    "rejects a successful %s HTTP response without a route result",
    async failureKind => {
      await runDiscovery(kind =>
        Response.json(kind === failureKind ? {} : { result: [] })
      );
      expect(process.exitCode).toBe(1);
      expect(io.spawn.mock.calls.length).toBe(0);
      expect(io.writeFile.mock.calls.length).toBe(0);
    }
  );

  it.each(["blog", "case"] as const)(
    "does not silently drop an invalid published %s slug",
    async failureKind => {
      await runDiscovery(kind =>
        Response.json({ result: kind === failureKind ? [{ slug: "" }] : [] })
      );
      expect(io.spawn.mock.calls.length).toBe(0);
      expect(io.writeFile.mock.calls.length).toBe(0);
    }
  );

  it("includes newly published routes only from successful CMS responses", async () => {
    await runDiscovery(kind =>
      Response.json({
        result:
          kind === "blog"
            ? [
                {
                  slug: "new-published-post",
                  publishedAt: "2026-09-14T00:00:00Z",
                  updatedAt: "2026-09-14T01:00:00Z",
                },
              ]
            : [
                {
                  slug: "new-published-case",
                  projectDate: "2026-09-14",
                  updatedAt: "2026-09-14T01:00:00Z",
                },
              ],
      })
    );
    const manifestWrite = io.writeFile.mock.calls.find(([file]) =>
      String(file).endsWith("routes.json")
    );
    const manifest = JSON.parse(manifestWrite?.[1]);
    expect(manifest.routes).toContain("/blog/new-published-post");
    expect(manifest.routes).toContain("/cases/new-published-case");
    expect(manifest.routes).not.toContain("/blog/old-post");
    expect(manifest.routes).not.toContain("/cases/old-case");
    expect(io.readFile).not.toHaveBeenCalled();
  });
});
