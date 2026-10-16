import { describe, it, expect } from "vitest";
import {
  ALERT_SOURCES,
  CONSUMER_ALERTS,
  ALERT_REPORT_COUNT,
  ALERT_OFFICIAL_COUNT,
  filterConsumerAlerts,
} from "./consumerAlerts";
describe("curated public consumer records", () => {
  it("keeps unique records and resolves every HTTPS source with original dates", () => {
    expect(new Set(CONSUMER_ALERTS.map(r => r.id)).size).toBe(
      CONSUMER_ALERTS.length
    );
    expect(new Set(ALERT_SOURCES.map(s => s.id)).size).toBe(
      ALERT_SOURCES.length
    );
    expect(new Set(ALERT_SOURCES.map(s => s.url)).size).toBe(
      ALERT_SOURCES.length
    );
    for (const record of CONSUMER_ALERTS) {
      expect(record.id).toMatch(/^[a-z0-9-]+$/);
      expect(record.sourceIds.length).toBeGreaterThan(0);
      expect(record.identity && record.response && record.scope).toBeTruthy();
      for (const id of record.sourceIds)
        expect(ALERT_SOURCES.find(s => s.id === id)).toBeDefined();
    }
    for (const source of ALERT_SOURCES) {
      expect(new URL(source.url).protocol).toBe("https:");
      expect(source.published).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
      expect(
        CONSUMER_ALERTS.some(record => record.sourceIds.includes(source.id))
      ).toBe(true);
    }
  });
  it("counts at least thirty reports separately from official documents and event groups", () => {
    expect(ALERT_REPORT_COUNT).toBeGreaterThanOrEqual(30);
    expect(ALERT_OFFICIAL_COUNT).toBe(2);
    expect(ALERT_REPORT_COUNT + ALERT_OFFICIAL_COUNT).toBe(
      ALERT_SOURCES.length
    );
    expect(
      ALERT_SOURCES.filter(source => source.sourceType === "轉載").every(
        source => source.note
      )
    ).toBe(true);
    const group = CONSUMER_ALERTS.find(
      record => record.id === "kitchen-fee-dispute-2025"
    )!;
    expect(group.sourceIds).toHaveLength(4);
    expect(new Set(group.sourceIds).size).toBe(4);
  });
  it("finds newly added publishers, report titles and original publication dates", () => {
    expect(
      filterConsumerAlerts({ q: "am730 7500" }).map(record => record.id)
    ).toEqual(["quotation-columns-2025"]);
    expect(
      filterConsumerAlerts({ q: "柳俊江 晴報" }).map(record => record.id)
    ).toEqual(["anchor-quote-dispute-2023"]);
    expect(
      filterConsumerAlerts({ q: "2025-02-21 經絡" }).map(record => record.id)
    ).toEqual(["quotation-columns-2025"]);
    expect(
      filterConsumerAlerts({ q: "墊支 55000" }).map(record => record.id)
    ).toEqual(["toilet-fee-dispute-2025"]);
  });
  it("searches source and amount together without treating citations as new incidents", () => {
    expect(filterConsumerAlerts({ q: "東張 18000" }).map(r => r.id)).toEqual([
      "tvb-night-service-2026",
    ]);
    expect(
      filterConsumerAlerts({ q: "$58,000", kind: "消委會個案" }).map(r => r.id)
    ).toEqual(["consumer-a-price-2019"]);
    expect(filterConsumerAlerts({ kind: "官方紀錄" })).toHaveLength(1);
    expect(filterConsumerAlerts({ q: "呂" }).map(r => r.id)).toEqual([
      "tvb-night-service-2026",
    ]);
  });
  it("combines filters, returns genuine empty results, and sorts without mutation", () => {
    const ids = CONSUMER_ALERTS.map(r => r.id);
    expect(
      filterConsumerAlerts({ kind: "消委會個案", topic: "售後跟進" })
    ).toHaveLength(2);
    expect(filterConsumerAlerts({ q: "不存在的公司" })).toEqual([]);
    expect(filterConsumerAlerts({ order: "oldest" })[0].id).toBe(
      "phone-network-claims-2018"
    );
    expect(CONSUMER_ALERTS.map(r => r.id)).toEqual(ids);
  });
});
