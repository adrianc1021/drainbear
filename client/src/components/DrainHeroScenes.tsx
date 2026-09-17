import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useState } from "react";
import { Link } from "wouter";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";

type HeroScene = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  badge: string;
  signal: string;
  detail: string;
  href: string;
  hrefLabel: string;
  image?: string;
  imageAlt?: string;
  visualTone: "water" | "bathroom" | "kitchen" | "backflow" | "inspection";
};

const SCENES: HeroScene[] = [
  {
    id: "slow-drain",
    number: "01",
    label: "去水慢",
    title: "去水慢，先找出受影響的管段。",
    description:
      "企缸、浴缸或地台排水緩慢，未必只是表面積水。先提供相片，讓團隊了解位置、範圍及是否需要進一步檢查。",
    badge: "住宅去水",
    signal: "水位下降速度",
    detail: "由排水口及附近地台開始判斷",
    href: "/services/bathroom-drain-unblocking",
    hrefLabel: "了解浴室去水",
    image: "/images/home-drain-technician-wide.jpg",
    imageAlt: "師傅處理浴室去水口的通渠工程",
    visualTone: "water",
  },
  {
    id: "toilet",
    number: "02",
    label: "座廁淤塞",
    title: "沖水後水位上升，先分辨潔具或支管問題。",
    description:
      "紙張、異物及座廁隔氣問題的處理方法各有不同。確認受影響位置後，才決定使用合適工具。",
    badge: "座廁及馬桶",
    signal: "沖水後水位",
    detail: "留意是否只有一個潔具受影響",
    href: "/services/toilet-unblocking",
    hrefLabel: "了解坐廁通渠",
    image: "/images/home-drain-technician.jpg",
    imageAlt: "師傅處理浴室排水管道的服務示意",
    visualTone: "bathroom",
  },
  {
    id: "kitchen",
    number: "03",
    label: "廚房油脂",
    title: "商用廚房反覆淤塞，應處理管壁沉積。",
    description:
      "油脂及沉積物會附著於管壁。商業廚房需按隔油池、營業時段及管道長度，評估是否使用高壓水槍。",
    badge: "商業渠務",
    signal: "油脂沉積程度",
    detail: "先確認隔油設施及清洗範圍",
    href: "/services/high-pressure-jetting",
    hrefLabel: "了解高壓水槍",
    visualTone: "kitchen",
  },
  {
    id: "backflow",
    number: "04",
    label: "污水倒灌",
    title: "低層污水倒灌，應先停止使用受影響的排水位。",
    description:
      "多個排水位同時倒灌，可能涉及大廈共用主渠。先停止使用相關排水位並提供位置，團隊再確認沙井、抽吸或清洗安排。",
    badge: "主渠及沙井",
    signal: "受影響去水位",
    detail: "多個位置同時異常要優先說明",
    href: "/services/sewage-backflow",
    hrefLabel: "了解倒灌處理",
    visualTone: "backflow",
  },
  {
    id: "inspection",
    number: "05",
    label: "反覆淤塞",
    title: "同一位置反覆淤塞，可透過 CCTV 了解管內狀況。",
    description:
      "若短時間內再次出現問題，單次疏通未必足夠。可按現場情況安排 CCTV 照喉，協助定位沉積、樹根或管道異常。",
    badge: "CCTV 照喉",
    signal: "管道影像檢查",
    detail: "定位後再決定清洗或維修方向",
    href: "/services/cctv-drain-inspection",
    hrefLabel: "了解 CCTV 檢測",
    image: "/images/home-cctv-inspection.jpg",
    imageAlt: "渠務師傅使用 CCTV 設備檢查管道",
    visualTone: "inspection",
  },
] as const;

function SceneBrief({ scene }: { scene: HeroScene }) {
  return (
    <div
      className={`db-scene-hero__visual-brief db-scene-hero__visual-brief--${scene.visualTone}`}
    >
      <div className="db-scene-hero__visual-brief-header">
        <span>現場處理資料</span>
        <span>{scene.number} / 05</span>
      </div>

      <div className="db-scene-hero__visual-brief-content">
        <p>處理重點</p>
        <strong>{scene.signal}</strong>
        <span>{scene.detail}</span>
      </div>

      <p className="db-scene-hero__visual-brief-note">
        到場檢查後確認處理方法及收費。
      </p>
    </div>
  );
}

function SceneMetrics({ scene }: { scene: HeroScene }) {
  const metrics = [
    {
      label: "現場判斷",
      value: scene.signal,
      note: scene.detail,
    },
    {
      label: "服務範圍",
      value: "香港全區",
      note: "時間按地點確認",
    },
    {
      label: "收費原則",
      value: "先報價後動工",
      note: "動工前確認總價",
    },
  ];

  return (
    <div className="db-scene-hero__metrics" aria-label="現場服務摘要">
      {metrics.map(metric => (
        <div className="db-scene-hero__metric" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.note}</small>
        </div>
      ))}
    </div>
  );
}

export default function DrainHeroScenes({ imageSrc }: { imageSrc?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { phoneDisplay, phoneHref, whatsappDefaultHref } = useContactSettings();
  const scene = SCENES[activeIndex];
  const activeImage =
    scene.image || (scene.id === "slow-drain" ? imageSrc : undefined);

  const goToScene = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + SCENES.length) % SCENES.length;
    setActiveIndex(normalizedIndex);
  };

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      goToScene(activeIndex + 1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      goToScene(activeIndex - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      goToScene(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      goToScene(SCENES.length - 1);
    }
  };

  return (
    <section
      aria-labelledby="home-editorial-heading"
      className="brand-hero db-scene-hero"
      data-pr20-section="hero"
    >
      <div className="db-scene-hero__shell">
        <div
          className={`db-scene-hero__backdrop db-scene-hero__backdrop--${scene.visualTone}`}
          aria-hidden="true"
        >
          {activeImage ? (
            <img
              src={activeImage}
              alt=""
              width="1600"
              height="1000"
              fetchPriority="high"
              decoding="async"
            />
          ) : null}
          <span className="db-scene-hero__backdrop-wash" />
        </div>

        <div className="db-scene-hero__content db-container">
          <div className="db-scene-hero__topline">
            <span className="db-scene-hero__brandline">通渠熊／現場處理</span>
            <span className="db-scene-hero__availability">
              <span
                className="db-scene-hero__availability-dot"
                aria-hidden="true"
              />
              香港全區・接受 24 小時查詢
            </span>
          </div>

          <div className="db-scene-hero__layout">
            <div className="db-scene-hero__copy">
              <p className="brand-hero__service-label">
                通渠服務／{scene.number}－{scene.label}
              </p>
              <h1 id="home-editorial-heading">
                香港通渠，
                <br />
                先報價後動工。
              </h1>

              <div
                key={scene.id}
                className="db-scene-hero__scene-copy"
                aria-live="polite"
                id="hero-scene-panel"
                role="tabpanel"
                aria-labelledby={`hero-scene-tab-${scene.id}`}
              >
                <p className="db-scene-hero__scene-label">{scene.badge}</p>
                <h2>{scene.title}</h2>
                <p>{scene.description}</p>
              </div>

              <div className="brand-hero__actions">
                <a
                  href={whatsappDefaultHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCTA("whatsapp", "home_hero");
                    goThanksAfterWhatsApp("home_hero");
                  }}
                  className="db-primary-action"
                >
                  <MessageCircle
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>WhatsApp 提供相片</span>
                </a>
                <a
                  href={phoneHref}
                  onClick={() => trackCTA("phone", "home_hero")}
                  className="db-secondary-action"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{phoneDisplay}</span>
                </a>
              </div>

              <div className="db-scene-hero__proofs" aria-label="服務原則">
                <span>
                  <Check aria-hidden="true" /> 先了解現場狀況
                </span>
                <span>
                  <Check aria-hidden="true" /> 動工前確認總價
                </span>
              </div>
            </div>

            <div
              key={`${scene.id}-visual`}
              className="db-scene-hero__visual db-media brand-hero__media"
              aria-label={`${scene.label}服務資訊`}
            >
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={scene.imageAlt || `${scene.label}服務示意`}
                  width="1280"
                  height="960"
                  decoding="async"
                  sizes="(min-width: 1024px) 48vw, 100vw"
                />
              ) : (
                <SceneBrief scene={scene} />
              )}

              <SceneMetrics scene={scene} />
              {activeImage ? (
                <div
                  className="db-scene-hero__gradient-blur gradient-blur"
                  aria-hidden="true"
                >
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              ) : null}
              {activeImage ? (
                <div className="db-scene-hero__visual-caption">
                  <span>服務示意圖片</span>
                  <span>{scene.number} / 05</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="db-scene-hero__controls">
            <div
              className="db-scene-hero__tabs"
              role="tablist"
              aria-label="常見通渠情況"
              onKeyDown={event => {
                const target = event.target as HTMLElement;
                if (target.matches("button")) {
                  handleTabKeyDown(
                    event as unknown as ReactKeyboardEvent<HTMLButtonElement>
                  );
                }
              }}
            >
              {SCENES.map((item, index) => (
                <button
                  key={item.id}
                  id={`hero-scene-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-controls="hero-scene-panel"
                  tabIndex={activeIndex === index ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  className={activeIndex === index ? "is-active" : ""}
                  aria-label={`查看${item.label}情況`}
                >
                  <span>{item.number}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="db-scene-hero__navigation">
              <button
                type="button"
                aria-label="上一個通渠情況"
                onClick={() => goToScene(activeIndex - 1)}
              >
                <ArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="下一個通渠情況"
                onClick={() => goToScene(activeIndex + 1)}
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </div>

            <Link
              href={scene.href}
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "home_hero_scene",
                  cta_label: scene.hrefLabel,
                  service_name: scene.label,
                  destination_url: scene.href,
                })
              }
              className="db-scene-hero__scene-link"
            >
              <span>{scene.hrefLabel}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <a
            className="db-scene-hero__scroll-cue"
            href="#home-diagnosis-heading"
          >
            <span>向下查看判斷流程</span>
            <ChevronDown aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export { SCENES };
