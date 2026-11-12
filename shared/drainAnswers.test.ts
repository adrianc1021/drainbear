import { describe, expect, it } from "vitest";
import {
  ANSWER_ROUTES,
  ANSWERS_PUBLISHED_AT,
  ANSWERS_UPDATED_AT,
  DRAIN_ANSWERS,
} from "./drainAnswers";
import { SERVICE_SLUGS } from "./publicRoutes";

describe("public answer indexability metadata", () => {
  it("uses real chronological publication and editorial review dates", () => {
    expect(ANSWERS_PUBLISHED_AT).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(ANSWERS_UPDATED_AT).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(ANSWERS_UPDATED_AT).getTime()).toBeGreaterThanOrEqual(
      new Date(ANSWERS_PUBLISHED_AT).getTime()
    );
  });

  it("keeps every answer route unique and attached to a published service", () => {
    expect(new Set(ANSWER_ROUTES).size).toBe(ANSWER_ROUTES.length);
    expect(ANSWER_ROUTES).toHaveLength(DRAIN_ANSWERS.length + 1);
    for (const answer of DRAIN_ANSWERS) {
      expect(ANSWER_ROUTES).toContain("/answers/" + answer.slug);
      expect(SERVICE_SLUGS).toContain(answer.serviceSlug);
      expect(answer.question.length).toBeGreaterThan(4);
      expect(answer.answer.length).toBeGreaterThan(25);
    }
  });
});
