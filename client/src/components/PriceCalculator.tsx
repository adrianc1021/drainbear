/**
 * 通渠熊 DrainBear — 互動式估價計算機
 * 三步選擇：堵塞位置 × 樓宇類型 × 時段 → 即時估價範圍 + WhatsApp 預填報價
 * 風格：Premium SaaS Minimalism（navy/wagreen/mist，8px 圓角，無 Emoji）
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
  { id: "shower", label: "企缸 / 地台去水", icon: ShowerHead, base: [500, 1000] },
  { id: "mainpipe", label: "大廈主渠 / 沙井", icon: Waves, base: [1800, 3500] },
  { id: "grease", label: "食肆隔油池", icon: UtensilsCrossed, base: [2500, 4500] },
];

const BUILDINGS: Option[] = [
  { id: "apartment", label: "私樓 / 屋苑", icon: Building2, factor: 1 },
  { id: "oldbuilding", label: "唐樓 / 舊式大廈", icon: Home, factor: 1.15, note: "喉管老化，或需較長工時" },
  { id: "village", label: "村屋 / 獨立屋", icon: Trees, factor: 1.25, note: "或需吸車及戶外施工" },
  { id: "shop", label: "商舖 / 食肆", icon: Store, factor: 1.2, note: "商用喉管管徑較大" },
];

const TIMES: Option[] = [
  { id: "day", label: "日間（07:00–23:00）", icon: Sun, factor: 1 },
  { id: "night", label: "深夜（23:00–07:00）", icon: Moon, factor: 1.3, note: "深夜合理附加費" },
];

function roundTo50(n: number) {
  return Math.round(n / 50) * 50;
}

export default function PriceCalculator() {
  const {whatsappHref} = useContactSettings();
  const [loc, setLoc] = useState<string | null>(() => {
    const value = new URLSearchParams(window.location.search).get("location");
    return LOCATIONS.some(option => option.id === value) ? value : null;
  });
  const [bld, setBld] = useState<string | null>(() => {
    const value = new URLSearchParams(window.location.search).get("building");
    return BUILDINGS.some(option => option.id === value) ? value : null;
  });
  const [time, setTime] = useState<string>(() => {
    const value = new URLSearchParams(window.location.search).get("time");
    return TIMES.some(option => option.id === value) ? value! : "day";
  });
  const { setEstimate } = useEstimate();
  const recordEstimate = trpc.estimate.record.useMutation();

  const result = useMemo(() => {
    const l = LOCATIONS.find((o) => o.id === loc);
    const b = BUILDINGS.find((o) => o.id === bld);
    const t = TIMES.find((o) => o.id === time);
    if (!l?.base || !b?.factor || !t?.factor) return null;
    const low = roundTo50(l.base[0] * b.factor * t.factor);
    const high = roundTo50(l.base[1] * b.factor * t.factor);
    return { low, high, l, b, t };
  }, [loc, bld, time]);

  const completedSteps = Number(Boolean(loc)) + Number(Boolean(bld)) + 1;
  const selectedLocation = LOCATIONS.find(option => option.id === loc);
  const selectedBuilding = BUILDINGS.find(option => option.id === bld);
  const selectedTime = TIMES.find(option => option.id === time);
  const resetCalculator = () => {
    setLoc(null);
    setBld(null);
    setTime("day");
    window.history.replaceState(null, "", `${window.location.pathname}#calculator`);
  };

  const waMsg = result
    ? `你好，我想查詢通渠報價：${result.l.label}淤塞，樓宇類型係${result.b.label}，${result.t.label}上門。網上估價約 HK$${result.low}–${result.high}，請確認實際報價。`
    : undefined;

  // 估價結果同步至全域 Context：底部 CTA 列即時改用預填估價詳情
  const toastShown = useRef(false);
  // 防止同一組合重覆寫入資料庫
  const lastRecorded = useRef<string | null>(null);
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
      // 估價完成時匿名記錄到資料庫（同一組合只記錄一次）
      const key = `${result.l.id}_${result.b.id}_${result.t.id}`;
      // GA4：估價完成事件（同一次頁面瀏覽同一組合只記一次，含 A→B→A）
      if (ga4Dedup.once(`complete:${key}`)) {
        trackQuoteCalculatorComplete(`${result.l.label}_${result.b.label}_${result.t.id}`);
      }
      if (lastRecorded.current !== key) {
        lastRecorded.current = key;
        recordEstimate.mutate({
          location: result.l.label,
          building: result.b.label,
          timeSlot: result.t.id,
          priceLow: result.low,
          priceHigh: result.high,
          sourcePage: window.location.pathname,
        });
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
    <div className="calculator-step-title mb-3 flex items-center justify-between gap-3" data-calculator-step={n}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="calculator-step-number flex h-7 w-7 items-center justify-center rounded-full bg-navy font-display text-xs font-black text-wagreen">
          {n}
        </span>
        <h3 className="font-display text-base font-bold text-navy">{text}</h3>
      </div>
      <span className={`calculator-step-value truncate text-xs font-semibold ${
        (n === 1 ? selectedLocation : n === 2 ? selectedBuilding : selectedTime)
          ? "text-navy"
          : "text-muted-foreground/60"
      }`}>
        {n === 1 ? selectedLocation?.label || "尚未選擇" : n === 2 ? selectedBuilding?.label || "尚未選擇" : selectedTime?.label.split("（")[0] || "尚未選擇"}
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
        active
          ? "border-wagreen bg-wagreen/10 text-wagreen-dark shadow-[0_2px_12px_rgba(37,211,102,0.18)]"
          : "border-border bg-white text-navy/75 hover:border-navy/30 hover:text-navy"
      }`}
    >
      <span className={`calculator-option-icon flex h-8 w-8 shrink-0 items-center justify-center ${active ? "bg-wagreen text-white" : "bg-mist text-navy/45"}`}>
        <o.icon className="h-[17px] w-[17px]" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1 leading-snug">{o.label}</span>
      {active && <Check className="calculator-option-check h-4 w-4 shrink-0 text-wagreen-dark" strokeWidth={2.8} aria-hidden="true" />}
    </button>
  );

  return (
    <div className="calculator-shell card-float overflow-hidden rounded-lg border border-border bg-white">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左：三步選擇 */}
        <div className="calculator-inputs p-6 md:p-10">
          <div className="calculator-intro mb-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-safety">QUICK ESTIMATE</p>
                <h2 className="mt-2 font-display text-2xl font-black text-navy md:text-3xl">先了解大概預算</h2>
              </div>
              <span className="shrink-0 border border-navy/15 px-2.5 py-1.5 text-[11px] font-bold text-navy/60">約 10 秒</span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">按實際情況選擇三項資料，即時取得通渠初步價格範圍。</p>
          </div>
          <div className="calculator-progress mb-7 border-b border-border pb-5">
            <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-safety">
                即時估價流程
              </p>
              <p className="mt-1 text-sm font-semibold text-navy">
                已完成 {completedSteps} / 3 步
              </p>
            </div>
            {(loc || bld || time !== "day") && (
              <button
                type="button"
                onClick={resetCalculator}
                className="min-h-11 px-2 text-xs font-bold text-muted-foreground underline underline-offset-4 hover:text-navy"
              >
                重新選擇
              </button>
            )}
            </div>
            <div className="mt-4 h-1.5 overflow-hidden bg-navy/10" aria-hidden="true">
              <div className="h-full bg-wagreen transition-[width] duration-500" style={{ width: `${(completedSteps / 3) * 100}%` }} />
            </div>
          </div>
          <StepTitle n={1} text="邊度塞咗？" />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {LOCATIONS.map((o) => (
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

          <div className="mt-7">
            <StepTitle n={2} text="乜嘢樓宇類型？" />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {BUILDINGS.map((o) => (
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

          <div className="mt-7">
            <StepTitle n={3} text="幾時要上門？" />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {TIMES.map((o) => (
                <OptionBtn
                  key={o.id}
                  o={o}
                  active={time === o.id}
                  onClick={() => {
                    handleCalculatorStart();
                    setTime(o.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 右：估價結果 */}
        <div
          className="calculator-result dot-grid flex flex-col justify-center bg-navy p-6 text-white md:p-10"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="calculator-result-kicker text-xs font-bold tracking-[0.2em] text-wagreen">你的初步估價</div>
          {result ? (
            <>
              <div className="calculator-price mt-3 font-display font-black tracking-tight">
                <span className="calculator-price-currency">HK$</span>{result.low.toLocaleString()}
                <span className="calculator-price-divider">–</span>
                {result.high.toLocaleString()}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-white/65">
                <span className="border border-white/15 px-2.5 py-1">{result.l.label}</span>
                <span className="border border-white/15 px-2.5 py-1">{result.b.label}</span>
                <span className="border border-white/15 px-2.5 py-1">{result.t.label.split("（")[0]}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {result.l.label}・{result.b.label}・{result.t.id === "night" ? "深夜時段" : "日間時段"}
                {result.b.note ? `（${result.b.note}）` : ""}
                {result.t.note ? `（${result.t.note}）` : ""}
              </p>
              <a
                href={whatsappHref(waMsg!)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA("whatsapp", "price_calculator", `${result.l.label}_${result.b.label}_${result.t.id}`);
                  goThanksAfterWhatsApp("price_calculator");
                }}
                className="calculator-result-cta btn-smooth mt-6 inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-wagreen px-6 py-4 text-sm font-bold text-white shadow-[0_4px_18px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark"
              >
                <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.4} />
                WhatsApp 確認實際報價
              </a>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-wagreen">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-wagreen" />
                估價已同步至頁底 WhatsApp 按鈕，一按即可發送
              </p>
              <p className="mt-4 text-[11px] leading-relaxed text-white/40">
                以上為初步估算，僅供參考。實際收費以師傅上門評估後、動工前確認為準。純異物淤塞打不通，分毫不收。
              </p>
            </>
          ) : (
            <>
              <div className="calculator-price calculator-price--empty mt-3 font-display font-black tracking-tight text-white/25">
                HK$ ——
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                完成左邊 3 個選項，即刻睇到你嘅初步估價範圍。唔使留電話，唔會有人 sell 你。
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-white/40">
                <Droplets className="h-4 w-4 text-wagreen/60" strokeWidth={2} />
                估價完全免費・報價即最終價
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
