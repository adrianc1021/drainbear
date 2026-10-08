import { describe, expect, it } from "vitest";
import {
  buildAeoArtifacts,
  type AeoSnapshot,
} from "../../scripts/aeo-artifacts";

const origin = "https://drainbearhk.com";
const home: AeoSnapshot = {
  route: "/",
  url: origin + "/",
  title: "通渠熊",
  description: "香港通渠查詢",
  language: "zh-Hant-HK",
  robots: "index, follow",
  text: "香港通渠查詢",
  ids: [],
  links: [],
  phoneDisplay: "+852 9558 8260",
  structuredData: [
    {
      "@graph": [
        {
          "@type": "Plumber",
          "@id": origin + "/#organization",
          name: "通渠熊",
          telephone: "+85295588260",
        },
      ],
    },
  ],
};
const faq: AeoSnapshot = {
  ...home,
  route: "/faq",
  url: origin + "/faq",
  title: "常見問題",
  text: "可以先報價嗎？ 現場確認總收費後才動工。",
  ids: ["pricing"],
  links: [origin + "/guide"],
  structuredData: [
    {
      "@type": "FAQPage",
      dateModified: "2026-10-08",
      mainEntity: [
        {
          "@type": "Question",
          name: "可以先報價嗎？",
          url: origin + "/faq#pricing",
          acceptedAnswer: {
            text: "現場確認總收費後才動工。",
            citation: origin + "/guide",
          },
        },
      ],
    },
  ],
};

describe("public AEO artifacts", () => {
  it("excludes noindex and noncanonical content without assigning generated dates to pages", () => {
    const result = buildAeoArtifacts(
      [
        home,
        faq,
        {
          ...faq,
          route: "/thanks",
          url: origin + "/thanks",
          robots: "noindex",
        },
        { ...faq, url: "https://example.com/faq" },
      ],
      origin,
      "2026-10-09T00:00:00Z"
    );
    expect(result.knowledge.pages.map(page => page.url)).toEqual([
      origin + "/",
      origin + "/faq",
    ]);
    expect(result.knowledge.pages[0]).not.toHaveProperty("modifiedAt");
    expect(result.knowledge.pages[1].modifiedAt).toBe("2026-10-08");
    expect(result.knowledge.pages[1].answers[0].source).toBe(
      origin + "/faq#pricing"
    );
    expect(result.full).toContain(origin + "/guide");
    expect(result.index).not.toContain("/thanks");
  });
  it("rejects stale answers, fabricated source fragments and hidden citations", () => {
    expect(() =>
      buildAeoArtifacts([home, { ...faq, text: "different content" }], origin)
    ).toThrow("absent from visible HTML");
    expect(() =>
      buildAeoArtifacts([home, { ...faq, ids: [] }], origin)
    ).toThrow("invalid source anchor");
    expect(() =>
      buildAeoArtifacts([home, { ...faq, links: [] }], origin)
    ).toThrow("absent from visible links");
  });
  it("rejects conflicting business contacts and duplicate canonical sources", () => {
    expect(() =>
      buildAeoArtifacts([{ ...home, phoneDisplay: "+852 0000 0000" }], origin)
    ).toThrow("telephone differs");
    expect(() => buildAeoArtifacts([home, home], origin)).toThrow(
      "duplicate canonical"
    );
  });
});
