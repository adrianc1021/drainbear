import { useState } from "react";
import {
  ArrowRight,
  Bath,
  Camera,
  Check,
  CookingPot,
  Droplets,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link } from "wouter";
import { trackNavClick } from "@/lib/analytics";

type Method = {
  id: string;
  label: string;
  shortLabel: string;
  title: string;
  description: string;
  suitedFor: string;
  signal: string;
  icon: LucideIcon;
  href: string;
  hrefLabel: string;
  points: string[];
};

const METHODS: Method[] = [
  {
    id: "manual",
    label: "一般疏通",
    shortLabel: "居家短段",
    title: "從潔具及短段開始處理",
    description:
      "適合單一坐廁、鋅盤或企缸出現的初步淤塞。先檢查入口及可接觸位置，再決定工具及工序。",
    suitedFor: "單一潔具・短段去水",
    signal: "先處理明確堵塞點",
    icon: Bath,
    href: "/services/toilet-unblocking",
    hrefLabel: "查看家居通渠服務",
    points: ["確認受影響潔具", "動工前說明處理方案", "完成後測試去水"],
  },
  {
    id: "jetting",
    label: "高壓水槍",
    shortLabel: "油脂沉積",
    title: "沖走管壁油脂及沉積物",
    description:
      "適合較長管段、商業廚房及頑固沉積物。會按管道直徑、入口及現場環境評估能否使用。",
    suitedFor: "食肆・商舖・主渠",
    signal: "處理管壁而非只通入口",
    icon: Droplets,
    href: "/services/high-pressure-jetting",
    hrefLabel: "查看高壓水槍服務",
    points: ["評估管道及接駁位置", "按情況安排設備", "完成後沖洗及測試"],
  },
  {
    id: "cctv",
    label: "CCTV 照喉",
    shortLabel: "反覆再塞",
    title: "看清管內位置及狀態",
    description:
      "當問題反覆出現，或需要定位沉積、樹根及管道異常時，影像資料可以協助下一步判斷。",
    suitedFor: "反覆淤塞・位置不明",
    signal: "先定位再決定工序",
    icon: Camera,
    href: "/services/cctv-drain-inspection",
    hrefLabel: "查看 CCTV 檢測服務",
    points: ["記錄管內影像", "協助確認問題位置", "按結果規劃清洗方向"],
  },
  {
    id: "grease",
    label: "隔油池清理",
    shortLabel: "商業廚房",
    title: "把隔油設施納入整體處理",
    description:
      "商業廚房反覆淤塞，不能只看室內去水位。隔油池、清理週期及污物運走安排都要一併確認。",
    suitedFor: "食肆・工場・管理處",
    signal: "由源頭減少再次積聚",
    icon: CookingPot,
    href: "/services/grease-trap-cleaning",
    hrefLabel: "查看隔油池清理服務",
    points: ["確認隔油池位置及容量", "評估清理及抽吸安排", "建立後續保養週期"],
  },
] as const;

export default function DrainMethodComparison() {
  const [activeId, setActiveId] = useState(METHODS[0].id);
  const activeIndex = METHODS.findIndex(method => method.id === activeId);
  const method = METHODS[activeIndex] || METHODS[0];
  const Icon = method.icon;

  const moveTab = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (
      ![
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
        "ArrowUp",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();
    let nextIndex = activeIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (activeIndex + 1) % METHODS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (activeIndex - 1 + METHODS.length) % METHODS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = METHODS.length - 1;
    }
    setActiveId(METHODS[nextIndex].id);
  };

  return (
    <section
      className="db-method-comparison"
      aria-labelledby="home-methods-heading"
      data-pr20-section="method-comparison"
    >
      <div className="db-container">
        <div className="db-method-comparison__intro">
          <div>
            <p className="db-kicker db-kicker--safety">
              <span className="db-kicker__rule" aria-hidden="true" />
              處理方法比較
            </p>
            <h2 id="home-methods-heading">
              不同問題，
              <br />
              不用同一套方法。
            </h2>
          </div>
          <p>
            這裡只作方向參考；實際安排仍要視乎管道、入口、淤塞程度及現場環境。先看清楚，再決定是否需要特別設備。
          </p>
        </div>

        <div
          className="db-method-comparison__tabs"
          role="tablist"
          aria-label="通渠處理方法"
        >
          {METHODS.map(item => {
            const ItemIcon = item.icon;
            const isActive = item.id === activeId;

            return (
              <button
                key={item.id}
                id={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`method-panel-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                className={isActive ? "is-active" : ""}
                onClick={() => setActiveId(item.id)}
                onKeyDown={moveTab}
              >
                <ItemIcon aria-hidden="true" />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.shortLabel}</small>
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`method-panel-${method.id}`}
          role="tabpanel"
          aria-labelledby={method.id}
          className="db-method-comparison__panel"
          key={method.id}
        >
          <div className="db-method-comparison__panel-copy">
            <div className="db-method-comparison__panel-title">
              <span className="db-method-comparison__panel-icon">
                <Icon aria-hidden="true" />
              </span>
              <span>
                <p>{method.signal}</p>
                <h3>{method.title}</h3>
              </span>
            </div>
            <p className="db-method-comparison__description">
              {method.description}
            </p>
            <Link
              href={method.href}
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "home_method_comparison",
                  cta_label: method.hrefLabel,
                  service_name: method.label,
                  destination_url: method.href,
                })
              }
              className="db-method-comparison__link"
            >
              {method.hrefLabel}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="db-method-comparison__panel-data">
            <div>
              <span>較適合</span>
              <strong>{method.suitedFor}</strong>
            </div>
            <ul>
              {method.points.map(point => (
                <li key={point}>
                  <Check aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="db-method-comparison__note">
          <Gauge aria-hidden="true" />
          <span>
            無法確定要用哪一種？傳送現場相片及影片，先由團隊作初步評估。
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

export { METHODS };
