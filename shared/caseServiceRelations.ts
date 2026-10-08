/** Reviewed links describe what each record demonstrates, without inventing outcomes. */
export const CASE_SERVICE_RELATIONS = [
  {
    serviceSlug: "toilet-unblocking",
    caseSlug: "toilet-drain-tool-operation",
    note: "坐廁積水位置的疏通工具操作。",
  },
  {
    serviceSlug: "kitchen-sink-unblocking",
    caseSlug: "under-sink-drain-line-operation",
    note: "櫃底去水位置的線材及接水操作。",
  },
  {
    serviceSlug: "kitchen-sink-unblocking",
    caseSlug: "cabinet-drain-access-operation",
    note: "狹窄櫃內喉口的近鏡施工過程。",
  },
  {
    serviceSlug: "bathroom-drain-unblocking",
    caseSlug: "under-sink-drain-line-operation",
    note: "相關去水工具操作；此片段並非浴室工程，浴室處理方法仍需按現場評估。",
  },
  {
    serviceSlug: "sewage-backflow",
    caseSlug: "outdoor-drain-chamber-operation",
    note: "了解戶外渠口檢視的過程；片段未確認倒灌成因或完工結果。",
  },
  {
    serviceSlug: "grease-trap-cleaning",
    caseSlug: "home-basin-grease-buildup-cleaning",
    note: "相關油垢淤塞處理紀錄；家居去水工程不等同隔油池清理。",
  },
  {
    serviceSlug: "high-pressure-jetting",
    caseSlug: "school-rainwater-drain-high-pressure-cleaning",
    note: "學校雨水渠的高壓清洗紀錄。",
  },
  {
    serviceSlug: "cctv-drain-inspection",
    caseSlug: "drain-inspection-line-feed",
    note: "檢查設備與線材操作；片段不包含管內影像診斷。",
  },
  {
    serviceSlug: "main-drain-manhole",
    caseSlug: "outdoor-drain-chamber-operation",
    note: "戶外渠口開蓋與工具操作的現場紀錄。",
  },
] as const;
