/**
 * 通渠熊 DrainBear — 互動式估價計算機
 * 三步選擇：堵塞位置 × 樓宇類型 × 時段 → 即時估價範圍 + WhatsApp 預填報價
 * 風格：服務報價工作紙（現場相片、清晰選項、即時報價摘要）
 */
import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { toast } from "sonner";
import {
  Bath,
  Building2,
  Check,
  CookingPot,
  Droplets,
  Home,
  MessageCircle,
  Moon,
  ShowerHead,
  Store,
  Sun,
  Trees,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  trackCTA,
  goThanksAfterWhatsApp,
  trackQuoteCalculatorStart,
  trackQuoteCalculatorComplete,
} from "@/lib/analytics";
import { useEstimate } from "@/contexts/EstimateContext";
import { trpc } from "@/lib/trpc";
import { createPerViewDedup, type PerViewDedup } from "@/lib/perViewDedup";

interface Option {
  id: string;
  label: string;
  icon: typeof Home;
  /** 基準價範圍 HK$ */
  base?: [number, number];
  /** 倍率 */
  factor?: number;
  note?: string;
}

const LOCATIONS: Option[] = [
  { id: "toilet", label: "坐廁 / 馬桶", icon: Bath, base: [600, 1200] },
  { id: "sink", label: "廚房鋅盤", icon: CookingPot, base: [500, 1000] },
  {
    id: "shower",
    label: "企缸 / 地台去水",
    icon: ShowerHead,
    base: [500, 1000],
  },
  { id: "mainpipe", label: "大廈主渠 / 沙井", icon: Waves, base: [1800, 3500] },
  {
    id: "grease",
    label: "食肆隔油池",
    icon: UtensilsCrossed,
    base: [2500, 4500],
  },
];

const BUILDINGS: Option[] = [
  { id: "apartment", label: "私樓 / 屋苑", icon: Building2, factor: 1 },
  {
    id: "oldbuilding",
    label: "唐樓 / 舊式大廈",
    icon: Home,
    factor: 1.15,
    note: "喉管老化，或需較長工時",
  },
  {
    id: "village",
    label: "村屋 / 獨立屋",
    icon: Trees,
    factor: 1.25,
    note: "或需吸車及戶外施工",
  },
  {
    id: "shop",
    label: "商舖 / 食肆",
    icon: Store,
    factor: 1.2,
    note: "商用喉管管徑較大",
  },
];

const TIMES: Option[] = [
  { id: "day", label: "日間（07:00–23:00）", icon: Sun, factor: 1 },
  {
    id: "night",
    label: "深夜（23:00–07:00）",
    icon: Moon,
    factor: 1.3,
    note: "深夜合理附加費",
  },
];

function roundTo50(n: number) {
  return Math.round(n / 50) * 50;
}

function getInitialQueryParam(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

type CalculatedResult = {
  low: number;
  high: number;
  l: Option;
  b: Option;
  t: Option;
};

/**
 * Keep the anonymous database write behind the browser-only boundary. This
 * lets the homepage render for SEO and tests without a tRPC provider while
 * preserving recording for the interactive application.
 */
function EstimateRecorder({ result }: { result: CalculatedResult }) {
  const recordEstimate = trpc.estimate.record.useMutation();
  const lastRecorded = useRef<string | null>(null);

  useEffect(() => {
    const key = `${result.l.id}_${result.b.id}_${result.t.id}`;
    if (lastRecorded.current === key) return;

    lastRecorded.current = key;
    recordEstimate.mutate({
      location: result.l.label,
      building: result.b.label,
      timeSlot: result.t.id,
      priceLow: result.low,
      priceHigh: result.high,
      sourcePage: window.location.pathname,
    });
  }, [recordEstimate, result]);

  return null;
}

export default function PriceCalculator() {
  const { whatsappHref } = useContactSettings();
  const [loc, setLoc] = useState<string | null>(() => {
    const value = getInitialQueryParam("location");
    return LOCATIONS.some(option => option.id === value) ? value : null;
  });
  const [bld, setBld] = useState<string | null>(() => {
    const value = getInitialQueryParam("building");
    return BUILDINGS.some(option => option.id === value) ? value : null;
  });
  const [time, setTime] = useState<string>(() => {
    const value = getInitialQueryParam("time");
    return TIMES.some(option => option.id === value) ? value! : "day";
  });
  const [timeTouched, setTimeTouched] = useState(() => {
    const value = getInitialQueryParam("time");
    return TIMES.some(option => option.id === value);
  });
  const { setEstimate } = useEstimate();

  const result = useMemo(() => {
    const l = LOCATIONS.find(o => o.id === loc);
    const b = BUILDINGS.find(o => o.id === bld);
    const t = TIMES.find(o => o.id === time);
    if (!l?.base || !b?.factor || !t?.factor || !timeTouched) return null;
    const low = roundTo50(l.base[0] * b.factor * t.factor);
    const high = roundTo50(l.base[1] * b.factor * t.factor);
    return { low, high, l, b, t };
  }, [loc, bld, time, timeTouched]);

  const completedSteps =
    Number(Boolean(loc)) + Number(Boolean(bld)) + Number(timeTouched);
  const selectedLocation = LOCATIONS.find(option => option.id === loc);
  const selectedBuilding = BUILDINGS.find(option => option.id === bld);
  const selectedTime = timeTouched
    ? TIMES.find(option => option.id === time)
    : undefined;
  const nextStepLabel = !loc
    ? "先選擇堵塞位置"
    : !bld
      ? "再選擇樓宇類型"
      : !timeTouched
        ? "最後選擇上門時段"
        : "資料已完成，可即時查詢";
  const resetCalculator = () => {
    setLoc(null);
    setBld(null);
    setTime("day");
    setTimeTouched(false);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}#calculator`
    );
  };

  const waMsg = result
    ? `您好，我想查詢通渠報價：${result.l.label}出現淤塞，樓宇類型為${result.b.label}，需要於${result.t.label}安排上門服務。網上初步估價約為 HK$${result.low}–${result.high}，請協助確認實際報價。`
    : undefined;

  // 估價結果同步至全域 Context：底部 CTA 列即時改用預填估價詳情
  const toastShown = useRef(false);
  // GA4 去重：隨 Component Mount 建立、Unmount 丟棄。
  // 離開頁面再返回（新 Mount）可重新記錄；同一次瀏覽內
  // start 只記一次、同一組合（含 A→B→A 的 A）只記一次。
  const ga4DedupRef = useRef<PerViewDedup | null>(null);
  if (!ga4DedupRef.current) ga4DedupRef.current = createPerViewDedup();
  const ga4Dedup = ga4DedupRef.current;

  const handleCalculatorStart = () => {
    if (ga4Dedup.once("start")) {
      trackQuoteCalculatorStart();
    }
  };
  useEffect(() => {
    if (result && waMsg) {
      setEstimate({
        location: result.l.label,
        building: result.b.label,
        time: result.t.label,
        low: result.low,
        high: result.high,
        waMessage: waMsg,
      });
      // 估價完成時匿名記錄到資料庫（由瀏覽器專用子元件處理）
      const key = `${result.l.id}_${result.b.id}_${result.t.id}`;
      // GA4：估價完成事件（同一次頁面瀏覽同一組合只記一次，含 A→B→A）
      if (ga4Dedup.once(`complete:${key}`)) {
        trackQuoteCalculatorComplete(
          `${result.l.label}_${result.b.label}_${result.t.id}`
        );
      }
      // 首次完成估價時提示：估價已同步至 WhatsApp 按鈕
      if (!toastShown.current) {
        toastShown.current = true;
        toast.success("估價已同步至 WhatsApp 按鈕", {
          description: "一按即可發送估價詳情，師傅會盡快確認實際報價。",
          duration: 3500,
        });
      }
    } else {
      setEstimate(null);
    }
  }, [result, waMsg, setEstimate]);

  const StepTitle = ({ n, text }: { n: number; text: string }) => (
    <div className="calculator-step-title" data-calculator-step={n}>
      <div className="calculator-step-title__label">
        <span className="calculator-step-number">{n}</span>
        <h3>{text}</h3>
      </div>
      <span
        className={`calculator-step-value ${
          (
            n === 1
              ? selectedLocation
              : n === 2
                ? selectedBuilding
                : selectedTime
          )
            ? "text-navy"
            : "text-muted-foreground/60"
        }`}
      >
        {n === 1
          ? selectedLocation?.label || "尚未選擇"
          : n === 2
            ? selectedBuilding?.label || "尚未選擇"
            : selectedTime?.label.split("（")[0] || "尚未選擇"}
      </span>
    </div>
  );

  const OptionBtn = ({
    o,
    active,
    onClick,
  }: {
    o: Option;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`calculator-option btn-smooth flex min-h-[56px] min-w-0 items-center gap-2.5 rounded-lg border px-4 py-3 text-left text-sm font-semibold ${
        active ? "is-selected" : ""
      }`}
    >
      <span className="calculator-option-icon" aria-hidden="true">
        <o.icon className="h-[17px] w-[17px]" strokeWidth={2.2} />
      </span>
      <span className="calculator-option-copy">
        <span>{o.label}</span>
        {o.note ? <small>{o.note}</small> : null}
      </span>
      <span className="calculator-option-indicator" aria-hidden="true">
        {active ? <Check strokeWidth={3} /> : null}
      </span>
    </button>
  );

  return (
    <div className="calculator-shell calculator-shell--quote">
      {typeof window !== "undefined" && result ? (
        <EstimateRecorder result={result} />
      ) : null}
      <div className="calculator-visual" aria-hidden="true">
        <img
          src="/images/home-cctv-inspection.jpg"
          alt=""
          width="960"
          height="1280"
          loading="lazy"
          decoding="async"
        />
        <div className="calculator-visual__caption">
          <span>DrainBear</span>
          <strong>先了解現場，才確認處理方法。</strong>
        </div>
      </div>
      <div className="calculator-body">
        <div className="calculator-inputs">
          <div className="calculator-intro">
            <div>
              <p>網上初步預算</p>
              <h2>選擇您的情況</h2>
            </div>
            <span>3 項資料</span>
          </div>
          <p className="calculator-intro__copy">
            選擇淤塞位置、樓宇類型及上門時段，即可查看通渠初步估價範圍。
          </p>

          <div className="calculator-progress">
            <div>
              <span>估價進度</span>
              <strong>已完成 {completedSteps} / 3</strong>
            </div>
            {loc || bld || timeTouched ? (
              <button type="button" onClick={resetCalculator}>
                重新選擇
              </button>
            ) : null}
            <div className="calculator-progress__track" aria-hidden="true">
              <span style={{ width: `${(completedSteps / 3) * 100}%` }} />
            </div>
          </div>

          <div className="calculator-step">
            <StepTitle n={1} text="淤塞位置" />
            <div className="calculator-options calculator-options--locations">
              {LOCATIONS.map(o => (
                <OptionBtn
                  key={o.id}
                  o={o}
                  active={loc === o.id}
                  onClick={() => {
                    handleCalculatorStart();
                    setLoc(o.id);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="calculator-step">
            <StepTitle n={2} text="樓宇類型" />
            <div className="calculator-options calculator-options--buildings">
              {BUILDINGS.map(o => (
                <OptionBtn
                  key={o.id}
                  o={o}
                  active={bld === o.id}
                  onClick={() => {
                    handleCalculatorStart();
                    setBld(o.id);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="calculator-step">
            <StepTitle n={3} text="上門時段" />
            <div className="calculator-options calculator-options--times">
              {TIMES.map(o => (
                <OptionBtn
                  key={o.id}
                  o={o}
                  active={timeTouched && time === o.id}
                  onClick={() => {
                    handleCalculatorStart();
                    setTime(o.id);
                    setTimeTouched(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="calculator-result"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="calculator-result__head">
            <div>
              <p>初步估價單</p>
              <h3>報價摘要</h3>
            </div>
            <span>HKD</span>
          </div>
          {result ? (
            <>
              <div className="calculator-price">
                <span className="calculator-price-currency">HK$</span>
                <span className="calculator-price-amount">
                  {result.low.toLocaleString()}
                </span>
                <span className="calculator-price-divider">–</span>
                <span className="calculator-price-amount">
                  {result.high.toLocaleString()}
                </span>
              </div>
              <dl className="calculator-result__details">
                <div>
                  <dt>淤塞位置</dt>
                  <dd>{result.l.label}</dd>
                </div>
                <div>
                  <dt>樓宇類型</dt>
                  <dd>{result.b.label}</dd>
                </div>
                <div>
                  <dt>上門時段</dt>
                  <dd>{result.t.label.split("（")[0]}</dd>
                </div>
              </dl>
              <p className="calculator-result__note">
                初步估價已按您選擇的資料計算。實際收費會由師傅到場了解情況後，在動工前確認。
              </p>
              <a
                href={whatsappHref(waMsg!)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA(
                    "whatsapp",
                    "price_calculator",
                    `${result.l.label}_${result.b.label}_${result.t.id}`
                  );
                  goThanksAfterWhatsApp("price_calculator");
                }}
                className="calculator-result-cta"
              >
                <MessageCircle
                  className="h-[18px] w-[18px]"
                  strokeWidth={2.4}
                />
                WhatsApp 確認實際報價
              </a>
              <p className="calculator-result__sync">
                <Check aria-hidden="true" /> 已附上估價資料，可直接發送
              </p>
            </>
          ) : (
            <>
              <div className="calculator-price calculator-price--empty">
                HK$ ——
              </div>
              <p className="calculator-result__note">
                {nextStepLabel}
                ，即可查看初步估價範圍。
              </p>
              <div className="calculator-result__assurance">
                <Droplets aria-hidden="true" />
                <span>毋須先留下電話・現場確認收費後才動工</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
