import { HOUSEHOLD_ANSWERS } from "./drainAnswers/household";
import { PROPERTY_ANSWERS } from "./drainAnswers/property";

export const ANSWERS_PUBLISHED_AT = "2026-10-16";
export interface DrainAnswer {
  slug: string;
  serviceSlug: string;
  question: string;
  answer: string;
  observation: string;
  nextStep: string;
}
export const DRAIN_ANSWERS: DrainAnswer[] = Object.entries({
  ...HOUSEHOLD_ANSWERS,
  ...PROPERTY_ANSWERS,
}).flatMap(([serviceSlug, rows]) =>
  rows
    .trim()
    .split("\n")
    .map(row => {
      const fields = row.split("|");
      if (fields.length !== 5 || fields.some(field => !field.trim()))
        throw new Error(`Incomplete answer: ${row}`);
      const [key, question, answer, observation, nextStep] = fields;
      return {
        slug: `${serviceSlug}-${key}`,
        serviceSlug,
        question,
        answer,
        observation,
        nextStep,
      };
    })
);
export const ANSWER_ROUTES = [
  "/answers",
  ...DRAIN_ANSWERS.map(answer => `/answers/${answer.slug}`),
];
export function getDrainAnswer(slug: string) {
  return DRAIN_ANSWERS.find(answer => answer.slug === slug);
}
