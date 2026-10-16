import { describe, expect, it } from "vitest";
import {
  illustrateStaticSections,
  illustratePortableBody,
} from "./articleIllustrations";
import { ARTICLE_IMAGES } from "./articleImages";
import type { BlogPost } from "./blogData";
import type { SanityBlogBodyBlock } from "./sanity/types";

describe("editorial image placement", () => {
  it("keeps text and links intact, places the image after its full section and is idempotent", () => {
    const sections: BlogPost["sections"] = [
      { type: "h2", text: "揀通渠公司，先比較這五項" },
      {
        type: "p",
        text: "原有報價說明",
        link: { label: "服務", href: "/services" },
      },
      { type: "list", items: ["原有清單"] },
      { type: "h2", text: "下一節" },
    ];
    const saved = structuredClone(sections);
    const result = illustrateStaticSections(
      "choosing-professional-drain-company",
      sections
    );
    expect(sections).toEqual(saved);
    expect(result.filter(s => s.type !== "image")).toEqual(sections);
    expect(result[3]).toMatchObject({
      type: "image",
      image: { url: ARTICLE_IMAGES.quote.url },
    });
    expect(
      illustrateStaticSections("choosing-professional-drain-company", result)
    ).toBe(result);
  });

  it("does not repeat a cover image or guess a new position when headings change", () => {
    const sections: BlogPost["sections"] = [
      { type: "h2", text: "揀通渠公司，先比較這五項" },
    ];
    expect(
      illustrateStaticSections(
        "choosing-professional-drain-company",
        sections,
        ARTICLE_IMAGES.quote.url
      )
    ).toBe(sections);
    const changed: BlogPost["sections"] = [{ type: "h2", text: "不同的內容" }];
    expect(
      illustrateStaticSections("choosing-professional-drain-company", changed)
    ).toBe(changed);
    expect(illustrateStaticSections("unrelated-guide", sections)).toBe(
      sections
    );
  });

  it("preserves CMS marks, original photos and block keys without mutating or duplicating", () => {
    const body: SanityBlogBodyBlock[] = [
      {
        _type: "block",
        _key: "heading",
        style: "h2",
        children: [
          { _type: "span", _key: "h", text: "CCTV 照渠一般流程", marks: [] },
        ],
        markDefs: [],
      },
      {
        _type: "articleImage",
        _key: "existing",
        url: "https://cdn.sanity.io/original.jpg",
        alt: "原相",
        width: 900,
        height: 600,
      },
      {
        _type: "block",
        _key: "target",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "t",
            text: "照渠報告應包含甚麼？",
            marks: ["strong"],
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "paragraph",
        style: "normal",
        children: [
          { _type: "span", _key: "p", text: "原文及連結", marks: ["link"] },
        ],
        markDefs: [
          {
            _type: "link",
            _key: "link",
            href: "/services/cctv-drain-inspection",
          },
        ],
      },
    ];
    const saved = structuredClone(body);
    const result = illustratePortableBody(
      "cctv-drain-inspection-hong-kong-guide",
      body
    );
    expect(body).toEqual(saved);
    expect(result.slice(0, 4)).toEqual(body);
    expect(result.at(-1)).toMatchObject({
      _type: "articleImage",
      srcSet: expect.stringContaining("640w"),
    });
    expect(
      illustratePortableBody("cctv-drain-inspection-hong-kong-guide", result)
    ).toBe(result);
  });

  it("keeps real case photographs immediately beside their corresponding case text", () => {
    const sections: BlogPost["sections"] = [
      { type: "p", text: "家居洗手盆長期去水慢：原有施工說明" },
      { type: "p", text: "學校戶外雨水渠積水：原有施工說明" },
    ];
    const result = illustrateStaticSections(
      "choosing-professional-drain-company",
      sections
    );
    expect(result[1]).toMatchObject({
      type: "image",
      image: ARTICLE_IMAGES.basinCase,
    });
    expect(result[3]).toMatchObject({
      type: "image",
      image: ARTICLE_IMAGES.schoolCase,
    });
  });
});
