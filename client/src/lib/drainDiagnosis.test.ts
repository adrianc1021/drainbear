import { describe, expect, it } from "vitest";
import { buildDiagnosisResult } from "./drainDiagnosis";

describe("buildDiagnosisResult", () => {
  it("directs a contained single toilet blockage to the toilet service", () => {
    const result = buildDiagnosisResult({
      location: "toilet",
      symptom: "blocked",
      scope: "single",
      risk: "contained",
    });

    expect(result.serviceSlug).toBe("toilet-unblocking");
    expect(result.isUrgent).toBe(false);
    expect(result.whatsappMessage).toContain("坐廁／馬桶");
  });

  it("prioritises backflow safety and the backflow service", () => {
    const result = buildDiagnosisResult({
      location: "bathroom",
      symptom: "backflow",
      scope: "several",
      risk: "sewage",
    });

    expect(result.serviceSlug).toBe("sewage-backflow");
    expect(result.isUrgent).toBe(true);
    expect(result.immediateActions[0]).toContain("停止使用");
  });

  it("suggests CCTV information for recurring blockages", () => {
    const result = buildDiagnosisResult({
      location: "kitchen",
      symptom: "recurring",
      scope: "single",
      risk: "contained",
    });

    expect(result.serviceSlug).toBe("kitchen-sink-unblocking");
    expect(result.secondaryServiceSlug).toBe("cctv-drain-inspection");
  });

  it("directs a shared main drain issue to the main drain service", () => {
    const result = buildDiagnosisResult({
      location: "main",
      symptom: "slow",
      scope: "shared",
      risk: "contained",
    });

    expect(result.serviceSlug).toBe("main-drain-manhole");
    expect(result.title).toContain("不只是一個去水位");
  });
});
