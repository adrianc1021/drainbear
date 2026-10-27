import { describe, expect, it } from "vitest";
import { SERVICE_PAGES } from "./serviceData";
import { SERVICE_PROBLEM_GUIDES } from "./serviceProblemGuides";

describe("service guidance coverage", () => {
  it("provides a distinct visible guide and enquiry message for every published service", () => {
    const slugs = SERVICE_PAGES.map(service => service.slug).sort();
    expect(Object.keys(SERVICE_PROBLEM_GUIDES).sort()).toEqual(slugs);
    const guides = Object.values(SERVICE_PROBLEM_GUIDES);
    expect(new Set(guides.map(guide => guide.intro)).size).toBe(slugs.length);
    expect(new Set(guides.map(guide => guide.message)).size).toBe(slugs.length);
    for (const guide of guides) {
      expect(guide.firstSteps.length).toBeGreaterThan(0);
      expect(guide.observations.length).toBeGreaterThan(0);
      expect(guide.help.length).toBeGreaterThan(0);
    }
  });
});
