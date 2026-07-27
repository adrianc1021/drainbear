/**
 * 通渠熊 DrainBear — 服務地區（SEO 導向）
 * 3 欄式網格，每個地區名稱為獨立標籤 Pill UI
 */
import { MapPin, Building, Landmark, Trees } from "lucide-react";
import { WhatsAppButton } from "@/components/Layout";

const REGIONS = [
  {
    icon: Landmark,
    name: "港島區",
    en: "HONG KONG ISLAND",
    desc: "熟悉商廈及半山豪宅喉管結構，高效低噪音。",
    districts: ["中環", "半山", "灣仔", "銅鑼灣", "北角", "鰂魚涌", "太古城", "柴灣", "香港仔", "跑馬地"],
  },
  {
    icon: Building,
    name: "九龍區",
    en: "KOWLOON",
    desc: "專治舊式大廈喉管倒灌及食肆塞廁所，24/7 極速救亡。",
    districts: ["尖沙咀", "旺角", "油麻地", "深水埗", "長沙灣", "九龍城", "土瓜灣", "黃大仙", "觀塘", "九龍灣"],
  },
  {
    icon: Trees,
    name: "新界及離島",
    en: "NEW TERRITORIES & ISLANDS",
    desc: "配備大型吸車，專治村屋沙井滿瀉及戶外樹根纏繞。",
    districts: ["沙田", "大圍", "大埔", "粉嶺", "上水", "荃灣", "葵涌", "屯門", "元朗", "將軍澳", "西貢", "東涌"],
  },
];

export default function Areas() {
  return (
    <div>
      <section className="bg-gradient-to-b from-mist to-white py-16 md:py-20">
        <div className="container text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">SERVICE AREAS</div>
          <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
            全港服務地區
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            港島、九龍、新界及離島全區覆蓋，各區駐點師傅 24 小時候命，1 小時特快到達。
          </p>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-24">
        <div className="container grid gap-8 md:grid-cols-3">
          {REGIONS.map((r) => (
            <div key={r.name} className="card-float flex flex-col rounded-lg border border-border bg-white p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-wagreen">
                <r.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">{r.en}</div>
              <h2 className="mt-1 font-display text-2xl font-black text-navy">{r.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {r.districts.map((d) => (
                  <span
                    key={d}
                    className="btn-smooth inline-flex items-center gap-1 rounded-full border border-border bg-mist px-3.5 py-1.5 text-sm font-medium text-navy hover:border-wagreen/50 hover:bg-wagreen/10 hover:text-wagreen-dark"
                  >
                    <MapPin className="h-3 w-3 text-wagreen" strokeWidth={2.5} />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="container mt-16 text-center">
          <p className="text-muted-foreground">您的地區未有列出？歡迎直接查詢，我們或可特別安排。</p>
          <div className="mt-6 flex justify-center">
            <WhatsAppButton className="px-8 py-4 text-base" label="查詢我的地區" />
          </div>
        </div>
      </section>
    </div>
  );
}
