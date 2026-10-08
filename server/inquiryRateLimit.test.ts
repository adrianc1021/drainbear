import { describe, expect, it } from "vitest";
import { InquiryRateLimit } from "./inquiryRateLimit";

describe("inquiry rate limiting", () => {
  it("rejects the sixth attempt and allows requests after the rolling window", () => {
    const limiter = new InquiryRateLimit(1000, 5);
    for (let i = 0; i < 5; i++)
      expect(limiter.consume("customer", 100 + i)).toBe(true);
    expect(limiter.consume("customer", 999)).toBe(false);
    expect(limiter.consume("customer", 1100)).toBe(true);
  });
  it("reclaims expired sources instead of leaking every historical IP", () => {
    const limiter = new InquiryRateLimit(1000, 1, 2);
    expect(limiter.consume("a", 0)).toBe(true);
    expect(limiter.consume("b", 10)).toBe(true);
    expect(limiter.consume("c", 100)).toBe(false);
    expect(limiter.consume("c", 1010)).toBe(true);
  });
  it("does not evict active sources to admit new ones", () => {
    const limiter = new InquiryRateLimit(1000, 1, 1);
    expect(limiter.consume("a", 0)).toBe(true);
    expect(limiter.consume("b", 1)).toBe(false);
    expect(limiter.consume("a", 2)).toBe(false);
  });
});
