import { describe, expect, it } from "vitest";
import { DRAIN_COMPANY_SELECTION_GUIDE } from "./drainCompanySelectionGuide";
import { SERVICE_PAGES } from "./serviceData";
import {
  SERVICE_INTENT_FOCUS,
  getServiceIntentFocus,
} from "./searchIntentFocus";

const PRIORITY_INTENTS = [
  ["bathroom-drain-unblocking", "洗手盆通渠"],
  ["toilet-unblocking", "通廁所"],
  ["high-pressure-jetting", "高壓通渠"],
] as const;

describe("commercial search intent coverage", () => {
  it("keeps recommendation intent on the existing company-selection guide", () => {
    expect(DRAIN_COMPANY_SELECTION_GUIDE.slug).toBe(
      "choosing-professional-drain-company"
    );
    expect(DRAIN_COMPANY_SELECTION_GUIDE.title).toContain("通渠推薦");
    expect(DRAIN_COMPANY_SELECTION_GUIDE.keywords).toContain("通渠公司推薦");
    expect(
      DRAIN_COMPANY_SELECTION_GUIDE.sections.some(
        section => section.type === "h2" && section.text.includes("通渠推薦")
      )
    ).toBe(true);
  });

  it.each(PRIORITY_INTENTS)(
    "gives %s its own useful service-focused heading and guide",
    (slug, keyword) => {
      const service = SERVICE_PAGES.find(entry => entry.slug === slug);
      const focus = getServiceIntentFocus(slug);
      expect(service?.title).toContain(keyword);
      expect(focus?.heading).toContain(keyword);
      expect(focus?.summary.length).toBeGreaterThan(35);
      expect(focus?.guidance.length).toBeGreaterThan(35);
      expect(focus?.articleHref.startsWith("/blog/")).toBe(true);
    }
  );

  it("never creates a service-intent entry for an unknown route", () => {
    expect(getServiceIntentFocus("nonexistent-service")).toBeNull();
    expect(Object.keys(SERVICE_INTENT_FOCUS)).toHaveLength(3);
  });
});
