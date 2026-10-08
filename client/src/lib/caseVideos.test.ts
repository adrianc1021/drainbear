import { describe, expect, it, vi } from "vitest";
import {
  combineCaseStudies,
  fetchCaseStudyBySlug,
  recordedCaseStudies,
} from "./caseRepository";
import { caseVideoSchema } from "./caseVideoSeo";
import type { SanityCaseStudy } from "./sanity/types";

vi.mock("./sanity/queries", () => ({ getPublishedCaseStudyBySlug: vi.fn() }));

describe("reviewed construction video records", () => {
  it("resolves an uploaded video record without a CMS request or invented project facts", async () => {
    const study = await fetchCaseStudyBySlug(
      ` ${recordedCaseStudies[0].slug} `
    );
    const { getPublishedCaseStudyBySlug } = await import("./sanity/queries");
    expect(study?.video).toBeDefined();
    expect(study?.projectDate).toBeUndefined();
    expect(study?.district).toBeUndefined();
    expect(study?.arrivalMinutes).toBeUndefined();
    expect(getPublishedCaseStudyBySlug).not.toHaveBeenCalled();
  });

  it("preserves existing CMS records and refuses competing content at a video URL", () => {
    const cmsStudy = {
      _id: "cms-existing",
      slug: "existing-project",
      title: "原有工程",
      serviceType: "residential",
      district: "觀塘",
      projectDate: "2026-09-01",
    } as SanityCaseStudy;
    const combined = combineCaseStudies([cmsStudy]);
    expect(combined).toHaveLength(recordedCaseStudies.length + 1);
    expect(combined.at(-1)?.district).toBe("觀塘");
    expect(combined.at(-1)?.projectDate).toBe("2026-09-01");
    expect(() =>
      combineCaseStudies([{ ...cmsStudy, slug: recordedCaseStudies[0].slug }])
    ).toThrow("網址重複");
  });

  it("connects the real media, actual duration and visible captions to the business", () => {
    for (const study of recordedCaseStudies) {
      const schema = caseVideoSchema(study)!;
      expect(schema["@type"]).toBe("VideoObject");
      expect(schema.contentUrl).toBe(
        `https://drainbearhk.com${study.video!.src}`
      );
      expect(schema.thumbnailUrl).toBe(
        `https://drainbearhk.com${study.video!.poster}`
      );
      expect(schema.duration).toBe(`PT${study.video!.durationSeconds}S`);
      expect(schema.uploadDate).toBe(study.publishedAt);
      expect(schema.transcript).toBe(
        study.video!.chapters.map(c => c.text).join("。")
      );
      expect(schema.publisher["@id"]).toBe(
        "https://drainbearhk.com/#organization"
      );
      expect(schema.mainEntityOfPage["@id"]).toBe(
        `https://drainbearhk.com/cases/${study.slug}#webpage`
      );
    }
  });
});
