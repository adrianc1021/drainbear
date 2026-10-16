import featured from "../../../shared/featuredDrainAnswers.json";
import { describe, expect, it } from "vitest";
import { ANSWER_ROUTES, SERVICE_SLUGS } from "../../../shared/publicRoutes";
import { DRAIN_ANSWERS, getDrainAnswer } from "../../../shared/drainAnswers";

describe("published drain answer inventory", () => {
  it("has independent, complete questions for every actual service", () => {
    expect(DRAIN_ANSWERS).toHaveLength(128);
    for (const field of [
      "slug",
      "question",
      "answer",
      "observation",
      "nextStep",
    ] as const) {
      expect(new Set(DRAIN_ANSWERS.map(item => item[field])).size, field).toBe(
        DRAIN_ANSWERS.length
      );
    }
    for (const serviceSlug of SERVICE_SLUGS) {
      expect(
        DRAIN_ANSWERS.filter(item => item.serviceSlug === serviceSlug)
      ).toHaveLength(16);
    }
    for (const answer of DRAIN_ANSWERS) {
      expect(SERVICE_SLUGS).toContain(answer.serviceSlug);
      expect(answer.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getDrainAnswer(answer.slug)).toBe(answer);
    }
    expect(getDrainAnswer("missing-answer")).toBeUndefined();
    for (const [serviceSlug, slug] of Object.entries(featured))
      expect(getDrainAnswer(slug)?.serviceSlug).toBe(serviceSlug);
  });
  it("discovers every published answer and no nonexistent URL", () => {
    expect(ANSWER_ROUTES).toEqual([
      "/answers",
      ...DRAIN_ANSWERS.map(answer => `/answers/${answer.slug}`),
    ]);
    expect(new Set(ANSWER_ROUTES).size).toBe(129);
  });
});
