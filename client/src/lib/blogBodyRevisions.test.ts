import { describe, expect, it } from "vitest";
import {
  reviseBlogBody,
  latestEditorialDate,
  WASHING_MACHINE_MESSAGE,
} from "./blogBodyRevisions";
import {
  mapSanityBlogPost,
  getStaticBlogPostBySlug,
  mergeBlogPosts,
} from "./blogRepository";
import type { SanityBlogBodyBlock, SanityBlogPost } from "./sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

const original: SanityBlogBodyBlock[] = [
  {
    _type: "articleImage",
    _key: "real-image",
    url: "https://cdn.sanity.io/images/example.webp",
    alt: "原有圖片",
    width: 800,
    height: 600,
  },
  {
    _type: "block",
    _key: "3ab44544e05f",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "original-span",
        text: "洗衣機、洗手盆和地台去水有時共用一段支渠。",
        marks: ["strong"],
      },
    ],
  },
  {
    _type: "block",
    _key: "2d7b58d33605",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "another-span",
        text: "若多個去水位同時咕嚕作響，便要協調檢查。",
        marks: [],
      },
    ],
  },
];

describe("published article service entrances", () => {
  it("preserves CMS text, formatting and images without mutation or duplicate service links", () => {
    const saved = structuredClone(original);
    const revised = reviseBlogBody(
      "washing-machine-drain-backflow-causes-fixes",
      original
    );
    expect(original).toEqual(saved);
    expect(revised[0]).toEqual(saved[0]);
    expect((revised[1] as PortableTextBlock).children[0]).toEqual(
      (saved[1] as PortableTextBlock).children[0]
    );
    expect(JSON.stringify(revised)).toContain(
      "/services/bathroom-drain-unblocking"
    );
    expect(JSON.stringify(revised)).toContain("/services/sewage-backflow");
    expect(JSON.stringify(revised)).toContain('"href":"/"');
    expect(
      reviseBlogBody("washing-machine-drain-backflow-causes-fixes", revised)
    ).toEqual(revised);
    expect(reviseBlogBody("unrelated-post", original)).toBe(original);
  });
  it("keeps an entrance when CMS paragraph keys change and retains newer CMS dates", () => {
    const moved = reviseBlogBody("cctv-drain-inspection-hong-kong-guide", [
      original[0],
    ]);
    expect(moved[0]).toEqual(original[0]);
    expect(JSON.stringify(moved)).toContain("/services/cctv-drain-inspection");
    expect(latestEditorialDate("2026-10-15T12:00:00Z", "2026-10-12")).toBe(
      "2026-10-15T12:00:00Z"
    );
  });
  it("uses the same prevention advice in CMS lists, detail and static fallback, preserving publication and cover", () => {
    const cms: SanityBlogPost = {
      _id: "published",
      slug: "prevent-kitchen-sink-clog",
      title: "舊標題",
      category: "home-prevention",
      publishedAt: "2026-07-20T12:00:00Z",
      updatedAt: "2026-08-19",
      excerpt: "熱水可以沖走油垢",
      readMins: 4,
      coverImage: { url: "https://cdn.sanity.io/images/original.webp" },
      seo: { metaTitle: "舊標題", metaDescription: "舊描述" },
      body: original,
    };
    const fallback = getStaticBlogPostBySlug(cms.slug)!;
    const detail = mapSanityBlogPost(cms);
    expect(detail.sections).toEqual(fallback.sections);
    expect(
      mergeBlogPosts([cms]).find(post => post.slug === cms.slug)?.sections
    ).toEqual(detail.sections);
    expect(detail.date).toBe(cms.publishedAt);
    expect(detail.coverImage).toEqual(cms.coverImage);
    expect(detail.reviewerName).toBe("");
    expect(
      detail.resourceLinks?.some(
        link => link.href === "/services/kitchen-sink-unblocking"
      )
    ).toBe(false);
    expect(
      detail.sections?.filter(
        section =>
          section.type === "p" &&
          section.link?.href === "/services/kitchen-sink-unblocking"
      )
    ).toHaveLength(1);
    const washer = mapSanityBlogPost({
      ...cms,
      slug: "washing-machine-drain-backflow-causes-fixes",
    });
    expect(washer.body?.[0]).toEqual(original[0]);
    expect(washer.whatsappMessage).toBe(WASHING_MACHINE_MESSAGE);
    expect(washer.date).toBe(cms.publishedAt);
  });
});
