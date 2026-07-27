/**
 * 通渠熊 DrainBear — 服務地區（SEO 導向，第六輪全面優化版）
 * 風格：Premium SaaS Minimalism，大量留白、8px 圓角、懸浮陰影卡片、無 Emoji
 * 結構：Hero + 覆蓋統計帶 → 專屬著陸頁精選卡 → 地區速查（搜尋過濾）→ 三大分區卡 → 統一收費承諾 CTA
 */
import { useMemo, useState } from "react";
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
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";
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
    eta: "45 分鐘內",
    desc: "熟悉商廈及半山豪宅喉管結構，高效低噪音。",
    seoText:
      "港島區商廈林立，亦有不少樓齡較高的半山豪宅及唐樓，容易出現主渠老化及隔油池滿瀉問題。我們熟悉港島區喉管結構，提供高效、低噪音的專業通渠，絕不影響鄰居及商戶運作。",
    districts: [
      "中環", "上環", "西環", "半山", "山頂", "金鐘", "灣仔", "銅鑼灣", "天后", "大坑",
      "跑馬地", "北角", "鰂魚涌", "太古城", "西灣河", "筲箕灣", "柴灣", "小西灣",
      "香港仔", "鴨脷洲", "黃竹坑", "薄扶林", "赤柱", "淺水灣",
    ],
  },
  {
    icon: Building,
    name: "九龍區",
    en: "KOWLOON",
    eta: "45 分鐘內",
    desc: "專治舊式大廈喉管倒灌及食肆塞廁所，24/7 極速救亡。",
    seoText:
      "九龍區人口極度密集、食肆林立，旺角及深水埗等地的舊式大廈經常發生喉管倒灌及塞廁所的緊急情況。我們的九龍區車隊 24/7 候命，配備高壓水槍，瞬間擊退陳年頑固油垢。",
    districts: [
      "尖沙咀", "佐敦", "油麻地", "旺角", "太子", "大角咀", "深水埗", "長沙灣", "荔枝角",
      "美孚", "石硤尾", "九龍塘", "何文田", "紅磡", "土瓜灣", "九龍城", "啟德", "新蒲崗",
      "黃大仙", "鑽石山", "彩虹", "牛頭角", "九龍灣", "觀塘", "藍田", "油塘",
    ],
  },
  {
    icon: Trees,
    name: "新界及離島",
    en: "NEW TERRITORIES & ISLANDS",
    eta: "60 分鐘內",
    desc: "配備大型吸車，專治村屋沙井滿瀉及戶外樹根纏繞。",
    seoText:
      "新界區涵蓋大型私人屋苑及偏遠村屋。針對村屋常見的化糞池滿瀉、沙井淤塞或戶外樹根纏繞喉管等高難度問題，我們引進大型吸車及重型設備，提供徹底的解決方案。",
    districts: [
      "沙田", "大圍", "火炭", "馬鞍山", "大埔", "太和", "粉嶺", "上水", "荃灣", "葵涌",
      "葵芳", "青衣", "深井", "馬灣", "屯門", "掃管笏", "元朗", "天水圍", "錦田", "洪水橋",
      "將軍澳", "日出康城", "調景嶺", "西貢", "清水灣", "東涌", "愉景灣", "馬灣島",
    ],
  },
];

const ALL_DISTRICTS = REGIONS.flatMap((r) => r.districts.map((d) => ({ district: d, region: r.name })));

const AREAS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "24 小時通渠服務",
  provider: { "@type": "Plumber", name: "通渠熊 DrainBear", telephone: "+85295588260" },
  areaServed: ALL_DISTRICTS.map((d) => ({ "@type": "Place", name: d.district })),
};

const STATS = [
  { icon: MapPin, value: "78+", label: "覆蓋分區" },
  { icon: Clock, value: "1 小時", label: "特快到達承諾" },
  { icon: ShieldCheck, value: "統一價", label: "絕不因地區加價" },
];

function DistrictPill({ name }: { name: string }) {
  const slug = DISTRICT_PAGES[name];
  return slug ? (
    <Link
      href={`/areas/${slug}`}
      className="btn-smooth inline-flex min-h-[44px] items-center gap-1 rounded-full border border-wagreen/40 bg-wagreen/10 px-4 py-2 text-sm font-bold text-wagreen-dark hover:bg-wagreen hover:text-white"
    >
      <MapPin className="h-3 w-3" strokeWidth={2.5} />
      {name}通渠
      <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
    </Link>
  ) : (
    <span className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-border bg-mist px-4 py-2 text-sm font-medium text-navy">
      <MapPin className="h-3 w-3 text-wagreen" strokeWidth={2.5} />
      {name}通渠
    </span>
  );
}

export default function Areas() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return ALL_DISTRICTS.filter((d) => d.district.includes(q));
  }, [query]);

  return (
    <div>
      <SEO
        title="服務地區｜港島・九龍・新界離島 24 小時通渠・1 小時特快到達｜通渠熊 DrainBear"
        description="通渠熊服務覆蓋全港 78+ 分區：中環、灣仔、銅鑼灣、北角、尖沙咀、旺角、深水埗、觀塘、沙田、荃灣、屯門、元朗、將軍澳等。10 大熱門地區設專屬服務頁，各區師傅 24 小時候命，1 小時特快到達，統一透明收費，不成功不收費。"
        path="/areas"
        keywords="通渠服務地區, 港島通渠, 九龍通渠, 新界通渠, 中環通渠, 旺角通渠, 深水埗通渠, 銅鑼灣通渠, 北角通渠, 荃灣通渠, 元朗通渠, 屯門通渠, 將軍澳通渠, 沙田通渠, 觀塘通渠, 24小時通渠"
        jsonLd={AREAS_JSONLD}
        breadcrumbs={AREAS_CRUMBS}
      />
      <Breadcrumbs items={AREAS_CRUMBS} />

      {/* Hero + 地區速查 */}
      <section className="bg-gradient-to-b from-mist to-white py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">SERVICE AREAS</div>
            <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
              全港九新界 24 小時特快通渠
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              無論您身處港島半山豪宅、九龍鬧市舊樓，還是新界偏遠村屋，駐區師傅都能在 1
              小時內極速到達，為您解決水管危機。
            </p>
            {/* 地區速查 */}
            <div className="relative mx-auto mt-8 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="輸入你的地區，如：旺角、沙田…"
                className="h-13 w-full rounded-lg border border-border bg-white py-3.5 pl-12 pr-4 text-base text-navy shadow-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-wagreen focus:ring-2 focus:ring-wagreen/25"
                aria-label="搜尋服務地區"
              />
              {matches && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-border bg-white text-left shadow-xl">
                  {matches.length > 0 ? (
                    matches.slice(0, 6).map((m) => {
                      const slug = DISTRICT_PAGES[m.district];
                      const inner = (
                        <>
                          <span className="flex items-center gap-2.5">
                            <MapPin className="h-4 w-4 text-wagreen" strokeWidth={2.4} />
                            <span className="font-bold text-navy">{m.district}通渠</span>
                            <span className="text-xs text-muted-foreground">{m.region}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-wagreen-dark">
                            {slug ? "專屬地區頁" : "1 小時到達"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </>
                      );
                      const cls =
                        "flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-mist";
                      return slug ? (
                        <Link key={m.district} href={`/areas/${slug}`} className={cls}>
                          {inner}
                        </Link>
                      ) : (
                        <a
                          key={m.district}
                          href={PHONE_TEL}
                          onClick={() => trackCTA("phone", "areas_search", m.district)}
                          className={cls}
                        >
                          {inner}
                        </a>
                      );
                    })
                  ) : (
                    <div className="px-4 py-4 text-sm text-muted-foreground">
                      未找到「{query}」？我們仍然覆蓋全港，請直接致電 {PHONE_DISPLAY} 確認。
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 覆蓋統計帶 */}
          <div className="reveal mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="card-float rounded-lg border border-border bg-white px-4 py-5 text-center"
              >
                <s.icon className="mx-auto h-5 w-5 text-wagreen" strokeWidth={2.2} />
                <div className="mt-2 font-display text-xl font-black text-navy md:text-2xl">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 專屬地區著陸頁精選卡 */}
      <section className="bg-white py-4 md:py-6">
        <div className="container">
          <div className="reveal mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">FEATURED DISTRICTS</div>
              <h2 className="font-display text-2xl font-black text-navy md:text-3xl">十大熱門地區專屬服務頁</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              涵蓋港九新界十個熱門地區，深入了解當區渠務特點、常見問題及駐區師傅服務承諾。
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
                  <h3 className="mt-4 font-display text-xl font-black text-navy md:text-2xl">{d.name}通渠專頁</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {d.heroDesc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {d.landmarks.slice(0, 3).map((l) => (
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

      {/* 三大分區卡 */}
      <section className="bg-white py-12 md:py-16">
        <div className="container">
          <div className="reveal mb-8">
            <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">FULL COVERAGE</div>
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">三大分區完整覆蓋</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {REGIONS.map((r, i) => (
              <article
                key={r.name}
                className="card-float card-accent reveal flex flex-col rounded-lg border border-border bg-white p-8"
                data-reveal-delay={i * 70}
              >
                <div className="flex items-start justify-between">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-wagreen">
                    <r.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-wagreen/10 px-3 py-1 text-xs font-bold text-wagreen-dark">
                    <Clock className="h-3 w-3" strokeWidth={2.5} />
                    {r.eta}到達
                  </span>
                </div>
                <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">{r.en}</div>
                <h3 className="mt-1 font-display text-2xl font-black text-navy">{r.name}通渠服務</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.seoText}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {r.districts.map((d) => (
                    <DistrictPill key={d} name={d} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 統一透明收費承諾 */}
        <div className="container mt-16">
          <div className="dot-grid rounded-lg bg-navy px-8 py-12 text-center md:px-16">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6 text-wagreen" strokeWidth={2} />
            </div>
            <h2 className="text-balance font-display text-2xl font-black text-white md:text-3xl">
              超越地區界限，統一透明收費
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              不管您在哪個分區，通渠熊均堅守「明碼實價、先報價後動工」原則，絕不因地區偏遠而坐地起價。不成功，不收費。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <WhatsAppButton className="px-8 py-4 text-base" label="查詢我的地區" trackLocation="areas_footer_cta" />
              <a
                href={PHONE_TEL}
                onClick={() => trackCTA("phone", "areas_footer_cta")}
                className="btn-smooth inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white hover:bg-white hover:text-navy"
              >
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
