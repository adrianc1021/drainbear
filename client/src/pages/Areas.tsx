/**
 * 通渠熊 DrainBear — 服務地區（SEO 導向）
 * 3 欄式網格 + 分區 SEO 描述文案 + 統一透明收費承諾
 */
import { MapPin, Building, Landmark, Trees, ShieldCheck, Phone } from "lucide-react";
import { Link } from "wouter";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

const AREAS_CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "服務地區", path: "/areas" },
];

/** 已有專屬著陸頁的地區 → slug 對照 */
const DISTRICT_PAGES: Record<string, string> = {
  觀塘: "kwun-tong",
  沙田: "sha-tin",
};

const REGIONS = [
  {
    icon: Landmark,
    name: "港島區",
    en: "HONG KONG ISLAND",
    desc: "熟悉商廈及半山豪宅喉管結構，高效低噪音。",
    seoText:
      "港島區商廈林立，亦有不少樓齡較高的半山豪宅及唐樓，容易出現主渠老化及隔油池滿瀉問題。我們熟悉港島區喉管結構，提供高效、低噪音的專業通渠，絕不影響鄰居及商戶運作。",
    districts: ["中環", "半山", "灣仔", "銅鑼灣", "北角", "鰂魚涌", "太古城", "柴灣", "香港仔", "跑馬地"],
  },
  {
    icon: Building,
    name: "九龍區",
    en: "KOWLOON",
    desc: "專治舊式大廈喉管倒灌及食肆塞廁所，24/7 極速救亡。",
    seoText:
      "九龍區人口極度密集、食肆林立，旺角及深水埗等地的舊式大廈經常發生喉管倒灌及塞廁所的緊急情況。我們的九龍區車隊 24/7 候命，配備高壓水槍，瞬間擊退陳年頑固油垢。",
    districts: ["尖沙咀", "旺角", "油麻地", "深水埗", "長沙灣", "九龍城", "土瓜灣", "黃大仙", "觀塘", "九龍灣"],
  },
  {
    icon: Trees,
    name: "新界及離島",
    en: "NEW TERRITORIES & ISLANDS",
    desc: "配備大型吸車，專治村屋沙井滿瀉及戶外樹根纏繞。",
    seoText:
      "新界區涵蓋大型私人屋苑及偏遠村屋。針對村屋常見的化糞池滿瀉、沙井淤塞或戶外樹根纏繞喉管等高難度問題，我們引進大型吸車及重型設備，提供徹底的解決方案。",
    districts: ["沙田", "大圍", "大埔", "粉嶺", "上水", "荃灣", "葵涌", "屯門", "元朗", "將軍澳", "西貢", "東涌"],
  },
];

const AREAS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "24 小時通渠服務",
  provider: { "@type": "Plumber", name: "通渠熊 DrainBear", telephone: "+85295588260" },
  areaServed: REGIONS.flatMap((r) => r.districts).map((d) => ({ "@type": "Place", name: d })),
};

export default function Areas() {
  return (
    <div>
      <SEO
        title="服務地區｜港島・九龍・新界離島 24 小時通渠・1 小時特快到達｜通渠熊 DrainBear"
        description="通渠熊服務覆蓋全港：中環、灣仔、銅鑼灣、尖沙咀、旺角、深水埗、觀塘、沙田、荃灣、屯門、元朗、將軍澳等。各區師傅 24 小時候命，1 小時特快到達，統一透明收費，不成功不收費。"
        path="/areas"
        keywords="通渠服務地區, 港島通渠, 九龍通渠, 新界通渠, 中環通渠, 旺角通渠, 沙田通渠, 元朗通渠, 24小時通渠"
        jsonLd={AREAS_JSONLD}
        breadcrumbs={AREAS_CRUMBS}
      />
      <Breadcrumbs items={AREAS_CRUMBS} />
      <section className="bg-gradient-to-b from-mist to-white py-16 md:py-20">
        <div className="container text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">SERVICE AREAS</div>
          <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
            全港九新界 24 小時特快通渠
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            無論您身處港島半山豪宅、九龍鬧市舊樓，還是新界偏遠村屋，駐區師傅都能在 1
            小時內極速到達，為您解決水管危機。
          </p>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-24">
        <div className="container grid gap-8 md:grid-cols-3">
          {REGIONS.map((r, i) => (
            <article
              key={r.name}
              className="card-float card-accent reveal flex flex-col rounded-lg border border-border bg-white p-8"
              data-reveal-delay={i * 70}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-wagreen">
                <r.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">{r.en}</div>
              <h2 className="mt-1 font-display text-2xl font-black text-navy">{r.name}通渠服務</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.seoText}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {r.districts.map((d) =>
                  DISTRICT_PAGES[d] ? (
                    <Link
                      key={d}
                      href={`/areas/${DISTRICT_PAGES[d]}`}
                      className="btn-smooth inline-flex items-center gap-1 rounded-full border border-wagreen/40 bg-wagreen/10 px-3.5 py-1.5 text-sm font-bold text-wagreen-dark hover:bg-wagreen hover:text-white"
                    >
                      <MapPin className="h-3 w-3" strokeWidth={2.5} />
                      {d}通渠
                    </Link>
                  ) : (
                    <span
                      key={d}
                      className="btn-smooth inline-flex items-center gap-1 rounded-full border border-border bg-mist px-3.5 py-1.5 text-sm font-medium text-navy hover:border-wagreen/50 hover:bg-wagreen/10 hover:text-wagreen-dark"
                    >
                      <MapPin className="h-3 w-3 text-wagreen" strokeWidth={2.5} />
                      {d}通渠
                    </span>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>

        {/* 統一透明收費承諾 */}
        <div className="container mt-16">
          <div className="rounded-lg bg-navy px-8 py-12 text-center md:px-16">
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
              <WhatsAppButton className="px-8 py-4 text-base" label="查詢我的地區" />
              <a
                href={PHONE_TEL}
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
