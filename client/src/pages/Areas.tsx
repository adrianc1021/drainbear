/**
 * 通渠熊 DrainBear — 服務地區（SEO 導向，第六輪全面優化版）
 * 風格：Premium SaaS Minimalism，大量留白、8px 圓角、懸浮陰影卡片、無 Emoji
 * 結構：Hero + 地區速查 + 動態統計帶 → 互動香港地圖 → 專屬著陸頁精選卡 → 三大分區（分頁籤式）→ 收費流程 CTA
 * 第十輪：新增互動式十八區地圖（HongKongMap）；三大分區改為分頁籤 + 分組排版，減少 pill 牆壓迫感
 * 第十一輪：搜尋列即時篩選 + 鍵盤導航 + 直接跳轉（有專頁 → 專頁；無專頁 → 捲至分區籤並高亮該地區）
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Building,
  Clock,
  Landmark,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Trees,
} from "lucide-react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { WhatsAppButton } from "@/components/Layout";
import HongKongMap from "@/components/HongKongMap";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  useContactSettings,
  useSiteSettings,
} from "@/contexts/SiteSettingsContext";
import { trackCTA } from "@/lib/analytics";
import { DISTRICTS, DISTRICT_SLUGS } from "@/lib/districtData";

const AREAS_CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "服務地區", path: "/areas" },
];

/** 已有專屬著陸頁的地區 → slug 對照（自動由 districtData 生成） */
const DISTRICT_PAGES: Record<string, string> = DISTRICT_SLUGS;

const REGIONS = [
  {
    icon: Landmark,
    name: "港島區",
    en: "HONG KONG ISLAND",
    eta: "上門時間按安排確認",
    desc: "熟悉商廈、住宅及樓齡較高樓宇的常見渠務情況。",
    seoText:
      "港島區商廈林立，亦有不少樓齡較高的半山豪宅及唐樓，容易出現主渠老化及隔油池滿瀉問題。我們熟悉港島區喉管結構，我們會按現場環境安排合適的處理方式，並盡量減少對鄰居及商戶運作的影響。",
    groups: [
      {
        label: "中西區",
        items: [
          "中環",
          "上環",
          "西營盤",
          "石塘咀",
          "堅尼地城",
          "半山",
          "山頂",
          "金鐘",
        ],
      },
      {
        label: "灣仔區",
        items: ["灣仔", "銅鑼灣", "天后", "大坑", "跑馬地", "渣甸山"],
      },
      {
        label: "東區",
        items: [
          "北角",
          "炮台山",
          "鰂魚涌",
          "太古城",
          "西灣河",
          "筲箕灣",
          "杏花邨",
          "柴灣",
          "小西灣",
        ],
      },
      {
        label: "南區",
        items: [
          "香港仔",
          "田灣",
          "華富",
          "鴨脷洲",
          "黃竹坑",
          "薄扶林",
          "數碼港",
          "赤柱",
          "淺水灣",
          "石澳",
        ],
      },
    ],
  },
  {
    icon: Building,
    name: "九龍區",
    en: "KOWLOON",
    eta: "上門時間按安排確認",
    desc: "處理舊式大廈、住宅及食肆常見渠務問題。",
    seoText:
      "九龍區人口密集、食肆林立，旺角及深水埗等地的舊式大廈較常出現喉管倒灌及座廁淤塞。師傅會先了解現場情況，再按需要安排合適工具及處理方式。",
    groups: [
      {
        label: "油尖旺區",
        items: [
          "尖沙咀",
          "尖沙咀東",
          "佐敦",
          "油麻地",
          "旺角",
          "太子",
          "大角咀",
          "奧運",
        ],
      },
      {
        label: "深水埗區",
        items: ["深水埗", "長沙灣", "荔枝角", "美孚", "石硤尾", "又一村"],
      },
      {
        label: "九龍城區",
        items: [
          "九龍塘",
          "何文田",
          "紅磡",
          "黃埔",
          "土瓜灣",
          "馬頭圍",
          "九龍城",
          "啟德",
        ],
      },
      {
        label: "黃大仙區",
        items: ["新蒲崗", "黃大仙", "樂富", "鑽石山", "慈雲山", "彩虹"],
      },
      {
        label: "觀塘區",
        items: ["牛頭角", "九龍灣", "觀塘", "秀茂坪", "藍田", "油塘", "茶果嶺"],
      },
    ],
  },
  {
    icon: Trees,
    name: "新界及離島",
    en: "NEW TERRITORIES & ISLANDS",
    eta: "按交通及工具運送安排確認",
    desc: "村屋、屋苑及離島服務按地點與所需設備確認安排。",
    seoText:
      "新界及離島涵蓋大型屋苑、村屋及交通安排各異的地點。遇到化糞池、沙井淤塞或戶外渠管問題，可先提供位置及現場資料，再確認所需設備與服務安排。",
    groups: [
      {
        label: "沙田區",
        items: ["沙田", "大圍", "火炭", "石門", "小瀝源", "馬鞍山", "烏溪沙"],
      },
      {
        label: "大埔／北區",
        items: [
          "大埔",
          "太和",
          "大埔墟",
          "林村",
          "粉嶺",
          "聯和墟",
          "上水",
          "古洞",
          "打鼓嶺",
        ],
      },
      {
        label: "荃灣／葵青區",
        items: [
          "荃灣",
          "荃景圍",
          "葵涌",
          "葵芳",
          "葵興",
          "青衣",
          "深井",
          "汀九",
          "馬灣",
        ],
      },
      {
        label: "屯門／元朗區",
        items: [
          "屯門",
          "屯門碼頭",
          "掃管笏",
          "黃金海岸",
          "藍地",
          "兆康",
          "元朗",
          "天水圍",
          "錦田",
          "八鄉",
          "洪水橋",
          "流浮山",
        ],
      },
      {
        label: "西貢區",
        items: [
          "將軍澳",
          "寶琳",
          "坑口",
          "調景嶺",
          "日出康城",
          "西貢",
          "清水灣",
          "白沙灣",
        ],
      },
      {
        label: "離島區",
        items: [
          "東涌",
          "欣澳",
          "愉景灣",
          "梅窩",
          "大澳",
          "長洲",
          "南丫島",
          "坪洲",
        ],
      },
    ],
  },
];

const ALL_DISTRICTS = REGIONS.flatMap(r =>
  r.groups.flatMap(g =>
    g.items.map(d => ({
      district: d,
      region: r.name,
      regionIdx: REGIONS.indexOf(r),
    }))
  )
);

const COVERAGE_COUNT = new Set(ALL_DISTRICTS.map(item => item.district)).size;

const AREAS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "24 小時通渠服務",
  areaServed: ALL_DISTRICTS.map(d => ({ "@type": "Place", name: d.district })),
};

const STATS = [
  {
    icon: MapPin,
    numericValue: COVERAGE_COUNT,
    label: "主要服務地點",
  },
  {
    icon: Building,
    numericValue: DISTRICTS.length,
    label: "專屬地區頁",
  },
  {
    icon: ShieldCheck,
    textValue: "先報價",
    label: "動工前確認收費",
  },
];

function CountUpNumber({
  value,
  label,
  duration = 1000,
}: {
  value: number;
  label: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || hasAnimatedRef.current) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setDisplayValue(value);
      hasAnimatedRef.current = true;
      return;
    }

    let frameId = 0;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];

        if (!entry?.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        observer.disconnect();
        setDisplayValue(0);

        const startedAt = performance.now();

        const update = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setDisplayValue(Math.round(value * easedProgress));

          if (progress < 1) {
            frameId = requestAnimationFrame(update);
          } else {
            setDisplayValue(value);
          }
        };

        frameId = requestAnimationFrame(update);
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [duration, value]);

  return (
    <>
      <span
        ref={elementRef}
        data-count-up-value={value}
        data-count-up-current={displayValue}
        aria-hidden="true"
        className="tabular-nums"
      >
        {displayValue.toLocaleString("zh-HK")}
      </span>
      <span className="sr-only">
        {value.toLocaleString("zh-HK")} 個{label}
      </span>
    </>
  );
}

function DistrictPill({
  name,
  highlighted,
}: {
  name: string;
  highlighted?: boolean;
}) {
  const slug = DISTRICT_PAGES[name];
  const hl = highlighted
    ? " ring-2 ring-safety ring-offset-2 animate-[pulse_1.2s_ease-in-out_2]"
    : "";
  return slug ? (
    <Link
      href={`/areas/${slug}`}
      data-district={name}
      className={`btn-smooth inline-flex min-h-[44px] items-center gap-1 rounded-full border border-wagreen/40 bg-wagreen/10 min-h-11 px-4 py-2 text-sm font-bold text-wagreen-dark hover:bg-wagreen hover:text-white${hl}`}
    >
      <MapPin className="h-3 w-3" strokeWidth={2.5} />
      {name}通渠
      <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
    </Link>
  ) : (
    <span
      data-district={name}
      className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border border-border bg-mist min-h-11 px-4 py-2 text-sm font-medium text-navy${hl}`}
    >
      <MapPin className="h-3 w-3 text-wagreen" strokeWidth={2.5} />
      {name}通渠
    </span>
  );
}

export default function Areas() {
  const { phoneDisplay, phoneHref } = useContactSettings();
  const { settings } = useSiteSettings();

  const areasJsonLd = {
    ...AREAS_JSONLD,
    provider: {
      "@type": "Plumber",
      name: settings.businessName,
      telephone: settings.phoneE164,
    },
  };
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const [highlightedDistrict, setHighlightedDistrict] = useState<string | null>(
    null
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const coverageRef = useRef<HTMLElement>(null);
  const [, navigate] = useLocation();
  const matches = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return ALL_DISTRICTS.filter(d => d.district.includes(q));
  }, [query]);
  const visible = useMemo(
    () => (matches ? matches.slice(0, 6) : []),
    [matches]
  );
  const region = REGIONS[activeRegion];

  // 點擊搜尋框以外區域時關閉建議
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /** 選定一個建議：有專頁 → 跳轉專頁；無專頁 → 切換分區籤、捲動至覆蓋清單並高亮該地區 pill */
  const goToDistrict = (m: (typeof ALL_DISTRICTS)[number]) => {
    trackCTA("map", "areas_search", m.district);
    setOpen(false);
    const slug = DISTRICT_PAGES[m.district];
    if (slug) {
      navigate(`/areas/${slug}`);
      return;
    }
    setActiveRegion(m.regionIdx);
    setQuery("");
    setHighlightedDistrict(m.district);
    // 待分區籤內容切換後再捲動至該地區 pill
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = coverageRef.current?.querySelector(
          `[data-district="${m.district}"]`
        );
        (el ?? coverageRef.current)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 60);
    });
    window.setTimeout(() => setHighlightedDistrict(null), 3200);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || visible.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => (i + 1) % visible.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => (i <= 0 ? visible.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goToDistrict(visible[activeIdx >= 0 ? activeIdx : 0]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  return (
    <div>
      <SEO
        title="服務地區覆蓋｜港九新界及離島通渠查詢｜通渠熊 DrainBear"
        description="通渠熊 DrainBear 提供港島、九龍、新界及離島主要地區渠務查詢。可按地區搜尋服務資料，並透過 WhatsApp 提供位置及問題詳情，確認上門安排與初步估價。"
        path="/areas"
        keywords="通渠服務地區, 港島通渠, 九龍通渠, 新界通渠, 中環通渠, 旺角通渠, 深水埗通渠, 銅鑼灣通渠, 北角通渠, 荃灣通渠, 元朗通渠, 屯門通渠, 將軍澳通渠, 沙田通渠, 觀塘通渠, 24小時通渠"
        jsonLd={areasJsonLd}
        breadcrumbs={AREAS_CRUMBS}
      />
      <Breadcrumbs items={AREAS_CRUMBS} />

      {/* Hero + 地區速查 */}
      <section
        className="bg-gradient-to-b from-mist to-white py-14 md:py-20"
        data-visual-section="areas-hero"
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              SERVICE AREAS
            </div>
            <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
              港九新界及離島通渠服務
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              無論您身處港島、九龍、新界或離島，可先提供所在地點及渠務情況，
              我們會按交通、工具運送及工作安排確認服務方式與上門時間。
            </p>
            {/* 地區速查 */}
            <div ref={searchRef} className="relative mx-auto mt-8 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setOpen(true);
                  setActiveIdx(-1);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onSearchKeyDown}
                placeholder="輸入你的地區，如：旺角、沙田…"
                className="h-13 w-full rounded-lg border border-border bg-white py-3.5 pl-12 pr-4 text-base text-navy shadow-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-wagreen focus:ring-2 focus:ring-wagreen/25"
                aria-label="搜尋服務地區"
                role="combobox"
                aria-expanded={open && !!matches}
                aria-autocomplete="list"
                aria-controls="areas-search-listbox"
              />
              {open && matches && (
                <div
                  id="areas-search-listbox"
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-border bg-white text-left shadow-xl"
                >
                  {matches.length > 0 ? (
                    visible.map((m, idx) => {
                      const slug = DISTRICT_PAGES[m.district];
                      const inner = (
                        <>
                          <span className="flex items-center gap-2.5">
                            <MapPin
                              className="h-4 w-4 text-wagreen"
                              strokeWidth={2.4}
                            />
                            <span className="font-bold text-navy">
                              {m.district}通渠
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {m.region}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-wagreen-dark">
                            {slug ? "專屬地區頁" : "查看覆蓋詳情"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </>
                      );
                      return (
                        <button
                          key={m.district}
                          type="button"
                          role="option"
                          aria-selected={activeIdx === idx}
                          onClick={() => goToDistrict(m)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                            activeIdx === idx ? "bg-mist" : "hover:bg-mist"
                          }`}
                        >
                          {inner}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-4 text-sm text-muted-foreground">
                      未找到「{query}」？請直接致電 {phoneDisplay} 確認。
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 覆蓋統計帶 */}
          <div className="reveal mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4">
            {STATS.map(s => (
              <div
                key={s.label}
                className="card-float rounded-lg border border-border bg-white px-4 py-5 text-center"
              >
                <s.icon
                  className="mx-auto h-5 w-5 text-wagreen"
                  strokeWidth={2.2}
                />
                <div className="mt-2 font-display text-xl font-black text-navy md:text-2xl">
                  {typeof s.numericValue === "number" ? (
                    <CountUpNumber value={s.numericValue} label={s.label} />
                  ) : (
                    s.textValue
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 專屬地區著陸頁精選卡 */}
      <section className="bg-white py-4 md:py-6">
        <div className="container">
          {/* 互動式香港地圖 */}
          <div className="reveal mb-12 md:mb-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">
                  INTERACTIVE MAP
                </div>
                <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                  點擊地圖，找到你的地區
                </h2>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                港九新界及離島主要地區均可查詢。點擊所在地區，即可查看服務資料及專屬服務頁入口。
              </p>
            </div>
            <HongKongMap />
          </div>

          <div className="reveal mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">
                FEATURED DISTRICTS
              </div>
              <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                {DISTRICTS.length} 個熱門地區專屬服務頁
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              現有專屬頁涵蓋港九新界多個熱門地區，可查看當區常見渠務情況、服務流程及查詢方式。
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DISTRICTS.map((d, i) => (
              <Link
                key={d.slug}
                href={`/areas/${d.slug}`}
                className="card-float card-accent reveal group flex flex-col justify-between rounded-lg border border-border bg-gradient-to-br from-mist/70 to-white p-6"
                data-reveal-delay={(i % 3) * 70}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 text-xs font-bold text-wagreen">
                      <MapPin className="h-3 w-3" strokeWidth={2.5} />
                      {d.region}
                    </span>
                    <span className="text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
                      {d.en.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-black text-navy md:text-2xl">
                    {d.name}通渠專頁
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    查看{d.name}常見渠務情況、服務流程、附近服務範圍及查詢方式。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {d.landmarks.slice(0, 3).map(l => (
                      <span
                        key={l}
                        className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-navy/70"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="btn-smooth mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen-dark group-hover:gap-2.5">
                  查看{d.name}通渠詳情 <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 港九新界及離島服務範圍（分頁籤式） */}
      <section ref={coverageRef} className="bg-white py-12 md:py-16">
        <div className="container">
          <div className="reveal mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">
                FULL COVERAGE
              </div>
              <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                三大分區完整覆蓋
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              按行政區及主要地點分組排列。綠色地區設有專屬服務頁，其他地區可先提供位置查詢安排。
            </p>
          </div>

          {/* 分區切換籤 */}
          <div
            className="reveal grid grid-cols-3 gap-2 rounded-lg border border-border bg-mist p-1.5 md:gap-2.5"
            role="tablist"
            aria-label="選擇分區"
          >
            {REGIONS.map((r, i) => (
              <button
                key={r.name}
                type="button"
                role="tab"
                aria-selected={activeRegion === i}
                onClick={() => setActiveRegion(i)}
                className={`btn-smooth flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2.5 text-sm font-bold transition-colors md:flex-row md:gap-2.5 md:text-base ${
                  activeRegion === i
                    ? "bg-navy text-white shadow-[0_4px_16px_rgba(11,19,43,0.25)]"
                    : "text-navy/60 hover:bg-white hover:text-navy"
                }`}
              >
                <r.icon
                  className={`h-4 w-4 md:h-5 md:w-5 ${activeRegion === i ? "text-wagreen" : ""}`}
                  strokeWidth={2.2}
                />
                {r.name}
              </button>
            ))}
          </div>

          {/* 當前分區內容 */}
          <div
            key={region.name}
            className="fade-up mt-6 rounded-lg border border-border bg-white p-6 md:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">
                  {region.en}
                </div>
                <h3 className="mt-1 font-display text-2xl font-black text-navy">
                  {region.name}通渠服務
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {region.seoText}
                </p>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-wagreen/10 min-h-11 px-4 py-2 text-sm font-bold text-wagreen-dark">
                <Clock className="h-4 w-4" strokeWidth={2.5} />
                {region.eta}
              </span>
            </div>

            <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {region.groups.map(g => (
                <div key={g.label}>
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <MapPin
                      className="h-3.5 w-3.5 text-wagreen"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm font-black text-navy">
                      {g.label}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {g.items.length} 區
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.items.map(d => (
                      <DistrictPill
                        key={d}
                        name={d}
                        highlighted={highlightedDistrict === d}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 估價及收費流程 */}
        <div className="container mt-16">
          <div className="dot-grid rounded-lg bg-navy px-8 py-12 text-center md:px-16">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6 text-wagreen" strokeWidth={2} />
            </div>
            <h2 className="text-balance font-display text-2xl font-black text-white md:text-3xl">
              按地區及工程情況確認收費
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              先透過 WhatsApp
              提供位置、渠務問題及現場資料，我們會說明初步估價；師傅現場檢查後，動工前確認處理方式及總價。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <WhatsAppButton
                className="px-8 py-4 text-base"
                label="查詢我的地區"
                trackLocation="areas_footer_cta"
              />
              <a
                href={phoneHref}
                onClick={() => trackCTA("phone", "areas_footer_cta")}
                className="btn-smooth inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white hover:bg-white hover:text-navy"
              >
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} />
                {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
