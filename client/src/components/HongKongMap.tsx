/**
 * 通渠熊 DrainBear — 互動式香港十八區地圖
 * 桌面：hover 高亮 + tooltip；點擊區域 → 右側資訊卡（有專頁 → 直接入口；無專頁 → 覆蓋確認 + CTA）
 * 手機：點擊區域 → 下方資訊卡（兩段式，避免誤觸）
 * 資料：client/src/lib/hkDistrictPaths.ts（Paulkit/HKMap GeoJSON 簡化而成）
 */
import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Clock, MapPin, MessageCircle, X } from "lucide-react";
import { MAP_DISTRICTS, MAP_VIEWBOX, type MapDistrict } from "@/lib/hkDistrictPaths";
import { getDistrict } from "@/lib/districtData";
import { waLink } from "@/lib/contact";
import { trackCTA, goThanksAfterWhatsApp } from "@/lib/analytics";

const REGION_LABEL: Record<MapDistrict["region"], string> = {
  hki: "港島",
  kln: "九龍",
  nt: "新界及離島",
};

const REGION_ETA: Record<MapDistrict["region"], string> = {
  hki: "45 分鐘內",
  kln: "45 分鐘內",
  nt: "60 分鐘內",
};

/** 無專頁地區的覆蓋範圍簡述（點擊資訊卡顯示） */
const COVERAGE_HINT: Record<string, string> = {
  "central-western": "中環・上環・西環・半山・山頂",
  southern: "香港仔・鴨脷洲・黃竹坑・薄扶林・赤柱・淺水灣",
  "kowloon-city": "九龍城・紅磡・土瓜灣・何文田・啟德",
  "wong-tai-sin": "黃大仙・鑽石山・新蒲崗・彩虹・慈雲山",
  "north-d": "粉嶺・上水・打鼓嶺・沙頭角",
  "tai-po": "大埔・太和・大埔墟・船灣",
  "kwai-tsing": "葵涌・葵芳・青衣",
  islands: "東涌・愉景灣・馬灣・長洲・大嶼山",
};

/** 有專頁地區顯示的入口文案（十八區 → 對應專頁名） */
const PAGE_HINT: Record<string, string> = {
  "wan-chai": "灣仔・銅鑼灣・跑馬地一帶",
  eastern: "北角・鰂魚涌・太古城・柴灣一帶",
  "yau-tsim-mong": "旺角・油麻地・尖沙咀・太子一帶",
  "sham-shui-po-d": "深水埗・長沙灣・荔枝角・美孚一帶",
  "kwun-tong-d": "觀塘・藍田・油塘・九龍灣一帶",
  "tsuen-wan-d": "荃灣・深井・馬灣一帶",
  "tuen-mun-d": "屯門・掃管笏一帶",
  "yuen-long-d": "元朗・天水圍・錦田・洪水橋一帶",
  "sha-tin-d": "沙田・大圍・火炭・馬鞍山一帶",
  "sai-kung": "將軍澳・西貢・清水灣一帶",
};

const REGION_FILL: Record<MapDistrict["region"], string> = {
  hki: "fill-navy/85",
  kln: "fill-wagreen/75",
  nt: "fill-[#7d9bc1]/70",
};

export default function HongKongMap() {
  const [, navigate] = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<MapDistrict | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const hoveredDistrict = useMemo(
    () => MAP_DISTRICTS.find((d) => d.id === hovered) ?? null,
    [hovered],
  );

  const selectedPage = selected?.slug ? getDistrict(selected.slug) : undefined;

  const handleMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleSelect = (d: MapDistrict) => {
    trackCTA("map", "areas_map", d.name);
    // 有專頁地區：桌面（可 hover 的指標裝置）點擊直接跳轉專頁；
    // 手機／觸控裝置保留兩段式（先顯示資訊卡）以避免誤觸。
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
    if (d.slug && canHover) {
      navigate(`/areas/${d.slug}`);
      return;
    }
    setSelected((prev) => (prev?.id === d.id ? prev : d));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
      {/* 地圖本體 */}
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-b from-[#eaf2f9] to-[#f4f8fc] p-3 md:p-5"
        onMouseMove={handleMove}
        onMouseLeave={() => {
          setHovered(null);
          setTip(null);
        }}
      >
        <svg
          viewBox={MAP_VIEWBOX}
          className="h-auto w-full"
          role="group"
          aria-label="香港十八區服務地圖，點擊分區查看當區通渠服務"
        >
          {MAP_DISTRICTS.map((d) => {
            const active = hovered === d.id || selected?.id === d.id;
            return (
              <path
                key={d.id}
                d={d.d}
                role="button"
                tabIndex={0}
                aria-label={`${d.name}${d.slug ? "（設有專屬服務頁）" : ""}`}
                className={`cursor-pointer stroke-white transition-[fill-opacity,stroke-width] duration-150 focus:outline-none ${REGION_FILL[d.region]}`}
                style={{
                  fillOpacity: active ? 1 : 0.62,
                  strokeWidth: active ? 2.2 : 1,
                }}
                onMouseEnter={() => setHovered(d.id)}
                onClick={() => handleSelect(d)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(d);
                  }
                }}
              />
            );
          })}
          {/* 有專頁地區的標記點 */}
          {MAP_DISTRICTS.filter((d) => d.slug).map((d) => (
            <g key={`dot-${d.id}`} className="pointer-events-none">
              <circle cx={d.cx} cy={d.cy} r={9} className="fill-white" opacity={0.9} />
              <circle cx={d.cx} cy={d.cy} r={5.5} className="fill-safety" />
            </g>
          ))}
        </svg>

        {/* Hover tooltip（桌面） */}
        {hoveredDistrict && tip && (
          <div
            className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-full rounded-md bg-navy px-3 py-1.5 text-xs font-bold text-white shadow-lg md:block"
            style={{ left: tip.x, top: tip.y - 10 }}
          >
            {hoveredDistrict.name}
            {hoveredDistrict.slug && <span className="ml-1.5 text-wagreen">設有專頁</span>}
          </div>
        )}

        {/* 圖例 */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 text-[11px] font-semibold text-navy/70 md:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-navy/85" /> 港島
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-wagreen/80" /> 九龍
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#7d9bc1]" /> 新界及離島
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full bg-white ring-1 ring-border">
              <span className="h-1.5 w-1.5 rounded-full bg-safety" />
            </span>
            設有專屬服務頁
          </span>
        </div>
      </div>

      {/* 選區資訊卡 */}
      <div className="flex flex-col">
        {selected ? (
          <div className="card-float flex flex-1 flex-col rounded-lg border border-border bg-white p-6 md:p-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">
                  {selected.nameEn.toUpperCase()}・{REGION_LABEL[selected.region]}
                </div>
                <h3 className="mt-1 font-display text-2xl font-black text-navy">
                  {selected.name}通渠服務
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="關閉選區資訊"
                className="btn-smooth flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-mist"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-wagreen/10 px-3 py-1 text-xs font-bold text-wagreen-dark">
              <Clock className="h-3 w-3" strokeWidth={2.5} />
              {REGION_ETA[selected.region]}特快到達
            </div>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {selected.slug ? (
                <>
                  覆蓋{PAGE_HINT[selected.id] ?? `${selected.name}全區`}
                  。此區設有專屬服務頁，可了解當區常見渠務問題、真實案例與駐區師傅承諾。
                </>
              ) : (
                <>
                  覆蓋{COVERAGE_HINT[selected.id] ?? `${selected.name}全區`}
                  。駐區師傅 24 小時候命，收費與市區統一，絕不因地區加價。
                </>
              )}
            </p>

            {selected.slug ? (
              <button
                type="button"
                onClick={() => navigate(`/areas/${selected.slug}`)}
                className="btn-smooth mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-light"
              >
                進入{selectedPage?.name ?? selected.name}專屬服務頁
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <a
                href={waLink(`你好，我喺${selected.name}，想查詢通渠服務報價。`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA("whatsapp", "areas_map_card", selected.name);
                  goThanksAfterWhatsApp("areas_map_card");
                }}
                className="btn-smooth mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-wagreen px-6 py-3 text-sm font-bold text-white hover:bg-wagreen-dark"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
                WhatsApp 查詢{selected.name}服務
              </a>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-mist/50 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
              <MapPin className="h-6 w-6 text-wagreen" strokeWidth={2} />
            </div>
            <h3 className="mt-4 font-display text-lg font-black text-navy">點擊地圖選擇你的地區</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              十八區全覆蓋。橙點地區設有專屬服務頁，一按直達；其他地區可即時 WhatsApp 查詢，統一收費。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
