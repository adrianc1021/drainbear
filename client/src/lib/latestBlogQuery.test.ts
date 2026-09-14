import { describe, expect, it, vi } from "vitest";
import { getLatestPublishedBlogPosts } from "./sanity/queries";

const queryClient = vi.hoisted(() => ({
  fetch: vi.fn().mockResolvedValue([]),
}));
vi.mock("./sanity/client", () => ({
  sanityClient: queryClient,
  sanityFreshClient: queryClient,
}));

describe("latest article request", () => {
  it("requests the image fields required by homepage previews, without requesting full article bodies", async () => {
    await getLatestPublishedBlogPosts();
    const [query] = queryClient.fetch.mock.calls[0];
    expect(query).toMatch(/"coverImage":\s*coverImage\s*\{/);
    expect(query).toContain('"url": asset->url');
    expect(query).toContain('"width": asset->metadata.dimensions.width');
    expect(query).toContain('"height": asset->metadata.dimensions.height');
    expect(query).toContain("publishedAt <= now()");
    expect(query).toContain("order(publishedAt desc)[0...3]");
    expect(query).not.toContain("body[]");
  });
});
