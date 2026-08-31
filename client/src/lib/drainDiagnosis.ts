export const DIAGNOSIS_LOCATIONS = [
  { id: "toilet", label: "坐廁／馬桶" },
  { id: "kitchen", label: "廚房鋅盤" },
  { id: "bathroom", label: "企缸／浴室去水" },
  { id: "multiple", label: "多個去水位" },
  { id: "main", label: "沙井／大廈主渠" },
] as const;

export const DIAGNOSIS_SYMPTOMS = [
  { id: "slow", label: "去水愈來愈慢" },
  { id: "blocked", label: "完全不能去水" },
  { id: "backflow", label: "污水或積水倒灌" },
  { id: "recurring", label: "處理後反覆再塞" },
  { id: "smell", label: "異味或咕嚕聲" },
] as const;

export const DIAGNOSIS_SCOPES = [
  { id: "single", label: "只有一個位置" },
  { id: "several", label: "同一單位多個位置" },
  { id: "shared", label: "其他單位／公共位置也有" },
  { id: "unsure", label: "暫時未能確認" },
] as const;

export const DIAGNOSIS_RISKS = [
  { id: "contained", label: "水位穩定，沒有外溢" },
  { id: "rising", label: "水位仍在上升" },
  { id: "sewage", label: "有污水外溢或倒灌" },
  { id: "leak", label: "附近同時出現滲漏" },
] as const;

type OptionId<T extends readonly { id: string }[]> = T[number]["id"];

export type DiagnosisLocation = OptionId<typeof DIAGNOSIS_LOCATIONS>;
export type DiagnosisSymptom = OptionId<typeof DIAGNOSIS_SYMPTOMS>;
export type DiagnosisScope = OptionId<typeof DIAGNOSIS_SCOPES>;
export type DiagnosisRisk = OptionId<typeof DIAGNOSIS_RISKS>;

export interface DiagnosisAnswers {
  location: DiagnosisLocation;
  symptom: DiagnosisSymptom;
  scope: DiagnosisScope;
  risk: DiagnosisRisk;
}

export interface DiagnosisResult {
  title: string;
  summary: string;
  immediateActions: string[];
  serviceSlug: string;
  serviceLabel: string;
  secondaryServiceSlug?: string;
  secondaryServiceLabel?: string;
  whatsappMessage: string;
  trackingTopic: string;
  isUrgent: boolean;
}

function labelFor<T extends readonly { id: string; label: string }[]>(
  options: T,
  id: OptionId<T>
) {
  return options.find(option => option.id === id)?.label ?? id;
}

function getPrimaryService(answers: DiagnosisAnswers) {
  if (
    answers.symptom === "backflow" ||
    answers.risk === "sewage" ||
    answers.location === "multiple"
  ) {
    return {
      slug: "sewage-backflow",
      label: "污水倒灌處理",
    };
  }

  if (answers.location === "main" || answers.scope === "shared") {
    return {
      slug: "main-drain-manhole",
      label: "大廈主渠及沙井通渠",
    };
  }

  if (answers.location === "kitchen") {
    return {
      slug: "kitchen-sink-unblocking",
      label: "廚房鋅盤通渠",
    };
  }

  if (answers.location === "bathroom") {
    return {
      slug: "bathroom-drain-unblocking",
      label: "企缸及浴室通渠",
    };
  }

  return {
    slug: "toilet-unblocking",
    label: "坐廁及馬桶通渠",
  };
}

export function buildDiagnosisResult(
  answers: DiagnosisAnswers
): DiagnosisResult {
  const primary = getPrimaryService(answers);
  const isUrgent =
    answers.risk === "rising" ||
    answers.risk === "sewage" ||
    answers.symptom === "backflow";
  const mayBeShared =
    answers.scope === "several" ||
    answers.scope === "shared" ||
    answers.location === "multiple" ||
    answers.location === "main";
  const recurring = answers.symptom === "recurring";

  const immediateActions = isUrgent
    ? [
        "停止使用受影響位置及相連的去水設備，避免水位繼續上升。",
        "避免直接接觸污水；如安全可行，在遠處記錄水位及倒灌位置。",
        mayBeShared
          ? "通知同住者或管理處暫停相關範圍用水，並確認公共位置是否受影響。"
          : "不要再加入通渠水或混合清潔劑，以免增加接觸及施工風險。",
      ]
    : [
        "先停止反覆放水測試，記錄受影響位置及退水所需時間。",
        "不要混合或反覆使用化學通渠劑。",
        mayBeShared
          ? "檢查其他去水位及向管理處了解共用喉管有沒有同類情況。"
          : "可拍攝一段短片，顯示放少量水後的水位變化。",
      ];

  const title = isUrgent
    ? "先控制外溢風險，再確認堵塞範圍"
    : recurring
      ? "反覆淤塞，應先找出再次堵塞的原因"
      : mayBeShared
        ? "可能不只是一個去水位的局部問題"
        : "較像單一位置的局部排水問題";

  const summary = recurring
    ? "單靠再次打通未必能解決根本原因。現場可先檢查堵塞位置、管道走向及過往處理方式，再判斷是否需要影像檢測。"
    : mayBeShared
      ? "多個位置或公共範圍同時出現異常，可能涉及匯合後的支喉或共用主渠；最終仍要按現場水流及管道入口確認。"
      : "目前資料較接近局部堵塞，但異物、隔氣、支喉積垢或喉管狀況都可能造成相似症狀，不能只靠網上選項確定原因。";

  const locationLabel = labelFor(DIAGNOSIS_LOCATIONS, answers.location);
  const symptomLabel = labelFor(DIAGNOSIS_SYMPTOMS, answers.symptom);
  const scopeLabel = labelFor(DIAGNOSIS_SCOPES, answers.scope);
  const riskLabel = labelFor(DIAGNOSIS_RISKS, answers.risk);
  const trackingTopic = [
    answers.location,
    answers.symptom,
    answers.scope,
    answers.risk,
  ].join("_");

  return {
    title,
    summary,
    immediateActions,
    serviceSlug: primary.slug,
    serviceLabel: primary.label,
    ...(recurring
      ? {
          secondaryServiceSlug: "cctv-drain-inspection",
          secondaryServiceLabel: "了解 CCTV 照喉檢測",
        }
      : {}),
    whatsappMessage: [
      "你好，我已完成網站的渠務問題快速判斷，想查詢處理方向及初步估價。",
      `位置：${locationLabel}`,
      `情況：${symptomLabel}`,
      `影響範圍：${scopeLabel}`,
      `現場風險：${riskLabel}`,
      "請告訴我還需要拍攝哪些資料；最終方案及收費以現場檢查、動工前確認為準。",
    ].join("\n"),
    trackingTopic,
    isUrgent,
  };
}
