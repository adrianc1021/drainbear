/**
 * PerViewDedup 測試 — 對應 PriceCalculator 的 GA4 去重規格:
 * - 同一次頁面瀏覽(同一實例)同一組合只記一次
 * - A → B → A 時 A 不得再次記錄
 * - 新一次頁面 Mount(新實例)可以重新記錄
 */
import { describe, expect, it } from "vitest";
import { createPerViewDedup } from "./perViewDedup";

describe("createPerViewDedup", () => {
  it("同一 key 第一次 once 回傳 true,之後回傳 false", () => {
    const d = createPerViewDedup();
    expect(d.once("start")).toBe(true);
    expect(d.once("start")).toBe(false);
    expect(d.once("start")).toBe(false);
  });

  it("同一次瀏覽:A → B → A 時 A 不得再次記錄", () => {
    const d = createPerViewDedup();
    expect(d.once("complete:toilet_apartment_day")).toBe(true); // A
    expect(d.once("complete:sink_village_night")).toBe(true); // B
    expect(d.once("complete:toilet_apartment_day")).toBe(false); // A 再現 → 拒絕
  });

  it("不同 key 互不影響", () => {
    const d = createPerViewDedup();
    expect(d.once("start")).toBe(true);
    expect(d.once("complete:a")).toBe(true);
    expect(d.once("complete:b")).toBe(true);
  });

  it("新一次頁面 Mount(新實例)可以重新記錄", () => {
    const view1 = createPerViewDedup();
    expect(view1.once("start")).toBe(true);
    expect(view1.once("complete:toilet_apartment_day")).toBe(true);

    // 離開頁面再返回 = 新實例
    const view2 = createPerViewDedup();
    expect(view2.once("start")).toBe(true); // 可重新記錄
    expect(view2.once("complete:toilet_apartment_day")).toBe(true); // 可重新記錄
  });

  it("has 查詢不改變狀態", () => {
    const d = createPerViewDedup();
    expect(d.has("start")).toBe(false);
    expect(d.once("start")).toBe(true); // has 未消耗掉首次
    expect(d.has("start")).toBe(true);
  });
});
