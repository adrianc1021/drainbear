import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  MessageCircle,
  RotateCcw,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";
import { Link } from "wouter";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { useEstimate } from "@/contexts/EstimateContext";
import {
  buildDiagnosisResult,
  DIAGNOSIS_LOCATIONS,
  DIAGNOSIS_RISKS,
  DIAGNOSIS_SCOPES,
  DIAGNOSIS_SYMPTOMS,
  type DiagnosisLocation,
  type DiagnosisRisk,
  type DiagnosisScope,
  type DiagnosisSymptom,
} from "@/lib/drainDiagnosis";
import {
  goThanksAfterWhatsApp,
  sendEvent,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "渠務問題快速判斷", path: "/drain-diagnosis" },
];

const STEPS = [
  { label: "位置", shortLabel: "位置" },
  { label: "主要情況", shortLabel: "情況" },
  { label: "影響範圍", shortLabel: "範圍" },
  { label: "現場風險", shortLabel: "風險" },
] as const;

const SERVICE_AREAS = [
  "港島",
  "九龍",
  "新界東",
  "新界西",
  "離島",
  "暫時未能確認",
] as const;

interface ChoiceGridProps<T extends string> {
  legend: string;
  options: readonly { id: T; label: string }[];
  value?: T;
  onChange: (value: T) => void;
}

function ChoiceGrid<T extends string>({
  legend,
  options,
  value,
  onChange,
}: ChoiceGridProps<T>) {
  return (
    <fieldset>
      <legend className="font-display text-2xl font-black text-navy md:text-3xl">
        {legend}
      </legend>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {options.map(option => {
          const selected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`flex min-h-[60px] items-center justify-between gap-4 rounded-lg border px-5 py-4 text-left text-base font-bold transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-safety ${
                selected
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white text-navy hover:border-navy/45 hover:bg-mist"
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                  selected
                    ? "border-wagreen bg-wagreen text-navy"
                    : "border-navy/20 text-transparent"
                }`}
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function DrainDiagnosis() {
  const { whatsappHref } = useContactSettings();
  const { setDiagnosis } = useEstimate();
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState<DiagnosisLocation>();
  const [symptom, setSymptom] = useState<DiagnosisSymptom>();
  const [scope, setScope] = useState<DiagnosisScope>();
  const [risk, setRisk] = useState<DiagnosisRisk>();
  const [serviceArea, setServiceArea] = useState("");
  const startedRef = useRef(false);
  const completedResultRef = useRef<string | undefined>(undefined);

  const result = useMemo(() => {
    if (!location || !symptom || !scope || !risk) return null;

    return buildDiagnosisResult({ location, symptom, scope, risk });
  }, [location, risk, scope, symptom]);

  useEffect(() => {
    if (!result || completedResultRef.current === result.trackingTopic) return;

    completedResultRef.current = result.trackingTopic;
    sendEvent("drain_diagnosis_complete", {
      cta_location: "drain_diagnosis",
      topic: result.trackingTopic,
    });
  }, [result]);

  const handoffMessage = useMemo(() => {
    if (!result) return "";

    return [
      result.whatsappMessage,
      serviceArea
        ? `大概服務地區：${serviceArea}`
        : "大概服務地區：稍後在 WhatsApp 補充",
    ].join("\n");
  }, [result, serviceArea]);

  useEffect(() => {
    if (!result) return;

    setDiagnosis({
      topic: `diagnosis_${result.trackingTopic}`,
      summary: serviceArea
        ? `${serviceArea}・已整理症狀`
        : "已整理症狀・補充地區及相片",
      waMessage: handoffMessage,
    });
  }, [handoffMessage, result, serviceArea, setDiagnosis]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    sendEvent("drain_diagnosis_start", {
      cta_location: "drain_diagnosis",
    });
  };

  const reset = () => {
    setLocation(undefined);
    setSymptom(undefined);
    setScope(undefined);
    setRisk(undefined);
    setServiceArea("");
    setDiagnosis(null);
    setStep(0);
    completedResultRef.current = undefined;
  };

  const progress = result ? 100 : ((step + 1) / STEPS.length) * 100;

  return (
    <div className="bg-white">
      <SEO
        title="渠務問題快速判斷｜去水慢、淤塞及倒灌處理方向｜通渠熊"
        description="按堵塞位置、症狀、影響範圍及現場風險，整理渠務問題的初步處理方向、即時安全措施及相關服務。結果只供初步判斷，最終以現場檢查為準。"
        path="/drain-diagnosis"
        keywords="渠務問題判斷, 去水慢原因, 通渠診斷, 污水倒灌, 塞廁所, 企缸塞, 鋅盤去水慢"
        breadcrumbs={CRUMBS}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "渠務問題快速判斷",
          description:
            "根據堵塞位置、症狀、影響範圍及現場風險提供初步處理方向。",
          url: "https://drainbearhk.com/drain-diagnosis",
        }}
      />
      <Breadcrumbs items={CRUMBS} />

      <main>
        <section className="border-b border-border bg-mist py-12 md:py-16">
          <div className="container grid items-end gap-8 lg:grid-cols-[1fr_0.7fr]">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.18em] text-safety">
                DRAIN CHECK / 問題判斷
              </p>
              <h1 className="mt-3 text-balance font-display text-4xl font-black text-navy md:text-5xl">
                先看症狀，再決定下一步
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                選擇現場情況後，取得安全措施、可能涉及的範圍及相關服務方向。網上結果不能取代現場檢查。
              </p>
            </div>
            <div className="border-l-4 border-safety bg-white px-5 py-4 text-sm leading-relaxed text-navy">
              如有污水外溢、水位持續上升或附近滲漏，先停止用水並避免直接接觸污水。
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
            <aside
              aria-label="判斷進度"
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <div className="h-1.5 overflow-hidden rounded-full bg-navy/10">
                <div
                  className="h-full bg-safety transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ol className="mt-5 grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-1">
                {STEPS.map((item, index) => (
                  <li
                    key={item.label}
                    className={`flex min-h-11 items-center gap-3 text-xs font-bold lg:text-sm ${
                      index <= step || result ? "text-navy" : "text-navy/40"
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                        index < step || result
                          ? "bg-wagreen text-navy"
                          : index === step
                            ? "bg-navy text-white"
                            : "bg-mist text-navy/45"
                      }`}
                    >
                      {index < step || result ? (
                        <Check className="h-4 w-4" strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="lg:hidden">{item.shortLabel}</span>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="min-h-[430px]">
              {!result && step === 0 ? (
                <ChoiceGrid
                  legend="哪個位置最先出現問題？"
                  options={DIAGNOSIS_LOCATIONS}
                  value={location}
                  onChange={value => {
                    markStarted();
                    setLocation(value);
                    setStep(1);
                  }}
                />
              ) : null}

              {!result && step === 1 ? (
                <ChoiceGrid
                  legend="現時最明顯的是哪種情況？"
                  options={DIAGNOSIS_SYMPTOMS}
                  value={symptom}
                  onChange={value => {
                    setSymptom(value);
                    setStep(2);
                  }}
                />
              ) : null}

              {!result && step === 2 ? (
                <ChoiceGrid
                  legend="問題影響多少個位置？"
                  options={DIAGNOSIS_SCOPES}
                  value={scope}
                  onChange={value => {
                    setScope(value);
                    setStep(3);
                  }}
                />
              ) : null}

              {!result && step === 3 ? (
                <ChoiceGrid
                  legend="現場有沒有以下風險？"
                  options={DIAGNOSIS_RISKS}
                  value={risk}
                  onChange={setRisk}
                />
              ) : null}

              {!result && step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(current => current - 1)}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-navy/65 hover:text-navy"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回上一題
                </button>
              ) : null}

              {result ? (
                <section aria-live="polite" aria-labelledby="diagnosis-result">
                  <div
                    className={`border-l-4 px-6 py-5 ${
                      result.isUrgent
                        ? "border-safety bg-safety/10"
                        : "border-wagreen-dark bg-wagreen/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.isUrgent ? (
                        <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-safety" />
                      ) : (
                        <SearchCheck className="mt-1 h-6 w-6 shrink-0 text-wagreen-dark" />
                      )}
                      <div>
                        <p className="text-xs font-bold tracking-[0.15em] text-navy/55">
                          初步方向
                        </p>
                        <h2
                          id="diagnosis-result"
                          className="mt-2 font-display text-2xl font-black text-navy md:text-3xl"
                        >
                          {result.title}
                        </h2>
                        <p className="mt-4 leading-relaxed text-navy/75">
                          {result.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-9 grid gap-9 md:grid-cols-2">
                    <div>
                      <h3 className="flex items-center gap-2 font-display text-xl font-black text-navy">
                        <CircleAlert className="h-5 w-5 text-safety" />
                        現在先做
                      </h3>
                      <ol className="mt-5 space-y-4">
                        {result.immediateActions.map((action, index) => (
                          <li
                            key={action}
                            className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy text-xs font-black text-white">
                              {index + 1}
                            </span>
                            {action}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="border border-border bg-mist/55 p-6">
                      <p className="text-xs font-bold tracking-[0.14em] text-navy/50">
                        相關服務方向
                      </p>
                      <Link
                        href={`/services/${result.serviceSlug}`}
                        onClick={() =>
                          trackNavClick("service", {
                            cta_location: "drain_diagnosis_result",
                            cta_label: result.serviceLabel,
                            service_name: result.serviceSlug,
                            destination_url: `/services/${result.serviceSlug}`,
                          })
                        }
                        className="mt-3 inline-flex min-h-11 items-center gap-2 font-display text-lg font-black text-navy hover:text-wagreen-dark"
                      >
                        {result.serviceLabel}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      {result.secondaryServiceSlug ? (
                        <Link
                          href={`/services/${result.secondaryServiceSlug}`}
                          className="mt-2 flex min-h-11 items-center gap-2 text-sm font-bold text-navy/65 hover:text-navy"
                        >
                          {result.secondaryServiceLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : null}
                      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                        處理方法、是否需要拆裝或檢測，以及最終收費均要在現場檢查後、動工前確認。
                      </p>
                      <label
                        htmlFor="diagnosis-service-area"
                        className="mt-5 block text-sm font-bold text-navy"
                      >
                        大概服務地區（可稍後補充）
                      </label>
                      <select
                        id="diagnosis-service-area"
                        value={serviceArea}
                        onChange={event => setServiceArea(event.target.value)}
                        className="mt-2 min-h-12 w-full rounded-lg border border-navy/25 bg-white px-3 text-base text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-safety/50"
                      >
                        <option value="">選擇地區</option>
                        {SERVICE_AREAS.map(area => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={whatsappHref(handoffMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackCTA(
                          "whatsapp",
                          "drain_diagnosis_result",
                          result.trackingTopic
                        );
                        goThanksAfterWhatsApp("drain_diagnosis_result");
                      }}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-navy bg-wagreen px-6 py-3 font-black text-navy hover:bg-wagreen-dark hover:text-white"
                    >
                      <MessageCircle className="h-5 w-5" />
                      將判斷結果傳給師傅
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-navy px-6 py-3 font-bold text-navy hover:bg-mist"
                    >
                      <RotateCcw className="h-4 w-4" />
                      重新判斷
                    </button>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
