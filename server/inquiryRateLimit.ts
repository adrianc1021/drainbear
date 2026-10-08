/** Bounded, request-driven cleanup; no timer needs to survive hot reloads. */
export class InquiryRateLimit {
  private attempts = new Map<string, number[]>();
  private nextCleanupAt = 0;

  constructor(
    private windowMs = 10 * 60 * 1000,
    private limit = 5,
    private maxSources = 10_000
  ) {}

  consume(source: string, now = Date.now()): boolean {
    if (now >= this.nextCleanupAt) {
      this.attempts.forEach((times, key) => {
        if (times[times.length - 1] <= now - this.windowMs)
          this.attempts.delete(key);
      });
      this.nextCleanupAt = now + Math.min(this.windowMs, 60_000);
    }
    const recent = (this.attempts.get(source) ?? []).filter(
      time => time > now - this.windowMs
    );
    if (recent.length >= this.limit) return false;
    // Refuse new sources at capacity instead of evicting active rate limits.
    if (!this.attempts.has(source) && this.attempts.size >= this.maxSources)
      return false;
    recent.push(now);
    this.attempts.set(source, recent);
    return true;
  }
}
