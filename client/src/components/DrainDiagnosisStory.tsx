import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";
import { trackNavClick } from "@/lib/analytics";

type DiagnosisStep = {
  number: string;
  title: string;
  description: string;
  signal: string;
  facts: Array<{
    label: string;
    value: string;
    status: string;
  }>;
  icon: LucideIcon;
  visualLabel: string;
  href?: string;
  hrefLabel?: string;
};

const STEPS: DiagnosisStep[] = [
  {
    number: "01",
    title: "先描述現場症狀",
    description:
      "位置、去水速度、是否有異味或倒灌，都是判斷管段的重要線索。相片或短片可以讓初步溝通更直接。",
    signal: "位置 + 症狀",
    facts: [
      { label: "位置", value: "受影響排水位", status: "待提供" },
      { label: "症狀", value: "去水速度及異常", status: "待說明" },
      { label: "影像", value: "相片或短片", status: "可補充" },
    ],
    icon: MessageCircle,
    visualLabel: "傳送資料",
  },
  {
    number: "02",
    title: "再看受影響範圍",
    description:
      "只有一個潔具異常，和多個去水位同時湧水，處理方向不同。先分辨單位支渠還是共用主渠。",
    signal: "一個位置 / 多個位置",
    facts: [
      { label: "範圍", value: "一個或多個位置", status: "逐一核對" },
      { label: "用途", value: "住宅或商業場所", status: "需要說明" },
      { label: "倒灌", value: "有否污水湧出", status: "優先確認" },
    ],
    icon: MapPin,
    visualLabel: "判斷範圍",
  },
  {
    number: "03",
    title: "按管道狀況選工具",
    description:
      "手動疏通、高壓水槍或 CCTV 照喉各有適用情況。現場了解後，才提出相應處理方案。",
    signal: "工具配合問題",
    facts: [
      { label: "管道", value: "入口及受影響管段", status: "現場檢查" },
      { label: "工具", value: "手動／高壓／CCTV", status: "按情況選擇" },
      { label: "方向", value: "疏通或進一步檢測", status: "先作說明" },
    ],
    icon: Camera,
    visualLabel: "選擇方法",
    href: "/services/cctv-drain-inspection",
    hrefLabel: "了解 CCTV 照喉",
  },
  {
    number: "04",
    title: "確認收費後才動工",
    description:
      "到場檢查後說明處理方法及收費，雙方確認後才施工。新增工序或特殊設備亦會事前交代。",
    signal: "確認方案 + 價錢",
    facts: [
      { label: "方案", value: "處理方法及工序", status: "事前說明" },
      { label: "收費", value: "確認最終總價", status: "確認後施工" },
      { label: "完工", value: "測試去水及整理", status: "施工後確認" },
    ],
    icon: ShieldCheck,
    visualLabel: "先報價",
    href: "/guide",
    hrefLabel: "查看收費指南",
  },
] as const;

function DiagnosisConsole({
  step,
  index,
}: {
  step: DiagnosisStep;
  index: number;
}) {
  const Icon = step.icon;

  return (
    <div className="db-diagnosis-console" aria-live="polite">
      <div className="db-diagnosis-console__head">
        <span>現場判斷</span>
        <span>{step.number} / 04</span>
      </div>

      <div className="db-diagnosis-console__screen">
        <div className="db-diagnosis-console__screen-label">
          <span>問題判斷</span>
          <span className="db-diagnosis-console__live">
            <span aria-hidden="true" /> 即時更新
          </span>
        </div>

        <div className={`db-diagnosis-console__signal is-step-${index + 1}`}>
          <div className="db-diagnosis-console__icon">
            <Icon aria-hidden="true" />
          </div>
          <div className="db-diagnosis-console__signal-summary">
            <strong>{step.visualLabel}</strong>
            <span>{step.signal}</span>
          </div>
        </div>

        <div className="db-diagnosis-console__facts" aria-label="目前判斷資料">
          {step.facts.map(fact => (
            <div className="db-diagnosis-console__fact" key={fact.label}>
              <span
                className="db-diagnosis-console__fact-marker"
                aria-hidden="true"
              />
              <span className="db-diagnosis-console__fact-copy">
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </span>
              <small>{fact.status}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="db-diagnosis-console__footer">
        <span>
          <Check aria-hidden="true" /> 資料足夠再判斷
        </span>
        <span>DB-{String(index + 1).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

export default function DrainDiagnosisStory() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          const nextStep = Number(
            (visibleEntry.target as HTMLElement).dataset.diagnosisStep
          );
          if (Number.isInteger(nextStep)) setActiveStep(nextStep);
        }
      },
      { rootMargin: "-35% 0px -48% 0px", threshold: [0.1, 0.4, 0.8] }
    );

    stepRefs.current.forEach(element => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const step = STEPS[activeStep];

  const selectStep = (index: number) => {
    setActiveStep(index);
    stepRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section
      className="db-diagnosis-story"
      aria-labelledby="home-diagnosis-heading"
      data-pr20-section="diagnosis-story"
    >
      <div className="db-container">
        <div className="db-diagnosis-story__intro">
          <div>
            <p className="db-kicker db-kicker--light">
              <span className="db-kicker__rule" aria-hidden="true" />
              現場判斷流程
            </p>
            <h2 id="home-diagnosis-heading">
              由症狀開始，
              <br />
              找到可執行的方案。
            </h2>
          </div>
          <p>
            通渠不只是恢復排水。先確認受影響的範圍，才能減少重複嘗試不同工具，讓現場溝通、報價及施工安排更清晰。
          </p>
        </div>

        <div className="db-diagnosis-story__layout">
          <div className="db-diagnosis-story__visual-wrap">
            <div className="db-diagnosis-story__visual">
              <DiagnosisConsole step={step} index={activeStep} />
              <div className="db-diagnosis-story__visual-note">
                <Search aria-hidden="true" />
                <span>每個現場都先從資料開始</span>
              </div>
            </div>
          </div>

          <div className="db-diagnosis-story__steps">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeStep;

              return (
                <article
                  key={item.number}
                  ref={element => {
                    stepRefs.current[index] = element;
                  }}
                  data-diagnosis-step={index}
                  className={isActive ? "is-active" : ""}
                >
                  <button
                    type="button"
                    className="db-diagnosis-story__step-button"
                    aria-pressed={isActive}
                    onClick={() => selectStep(index)}
                  >
                    <span className="db-diagnosis-story__step-number">
                      {item.number}
                    </span>
                    <span className="db-diagnosis-story__step-main">
                      <span className="db-diagnosis-story__step-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="db-diagnosis-story__step-arrow"
                    />
                  </button>

                  {isActive && item.href && item.hrefLabel ? (
                    <Link
                      href={item.href}
                      className="db-diagnosis-story__step-link"
                      onClick={() =>
                        trackNavClick("navigation", {
                          cta_location: "home_diagnosis_story",
                          cta_label: item.hrefLabel || item.title,
                          destination_url: item.href || "/",
                        })
                      }
                    >
                      {item.hrefLabel}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <div className="db-diagnosis-story__footer">
          <span>
            <ClipboardCheck aria-hidden="true" /> 不確定時，可先傳相片及位置
          </span>
          <Link href="/drain-diagnosis" className="db-diagnosis-cta">
            開始問題判斷
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export { STEPS };
