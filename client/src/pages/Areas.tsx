import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { DISTRICTS, DISTRICT_SLUGS } from "@/lib/districtData";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "服務地區", path: "/areas" },
];
const REGIONS = [
  {
    name: "港島區",
    en: "HONG KONG ISLAND",
    eta: "上門時間按安排確認",
    desc: "熟悉商廈、住宅及樓齡較高樓宇的常見渠務情況。",
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
    name: "九龍區",
    en: "KOWLOON",
    eta: "上門時間按安排確認",
    desc: "處理舊式大廈、住宅及食肆常見渠務問題。",
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
    name: "新界及離島",
    en: "NEW TERRITORIES & ISLANDS",
    eta: "按交通及工具運送安排確認",
    desc: "村屋、屋苑及離島服務按地點與所需設備確認安排。",
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

const LOCALITIES = REGIONS.flatMap(region =>
  region.groups.flatMap(group =>
    group.items.map(name => ({ name, region: region.name }))
  )
);
const JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/areas#service`,
  name: "香港通渠服務地區",
  url: `${SITE_URL}/areas`,
  provider: { "@id": BUSINESS_ID },
  areaServed: REGIONS.map(region => ({ "@type": "Place", name: region.name })),
};
export default function Areas() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const value = query.trim().toLocaleLowerCase();
    return LOCALITIES.filter(
      item => !value || item.name.includes(value) || item.region.includes(value)
    );
  }, [query]);
  return (
    <div className="areas-page">
      <SEO
        title="服務地區覆蓋｜港九新界及離島通渠查詢｜通渠熊 DrainBear"
        description="按地區搜尋香港通渠服務資料。港島、九龍、新界及離島可先提供位置及現場情況，確認上門時間、所需設備及報價安排。"
        path="/areas"
        breadcrumbs={CRUMBS}
        jsonLd={JSONLD}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          kicker="服務地區"
          title="港九新界及離島通渠服務"
          description="提供地區、樓層及現場相片，先確認上門安排。村屋及離島請說明入口和交通情況。"
          contactLocation="areas_hero"
        />
      </div>
      <section className="brand-section" aria-labelledby="area-search-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">按位置查詢</p>
              <h2 id="area-search-heading">搵你所在的地區</h2>
            </div>
          </div>
          <div className="area-search">
            <label htmlFor="area-search">輸入地區或屋苑附近地點</label>
            <div>
              <Search aria-hidden="true" />
              <input
                id="area-search"
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="例如：觀塘、荃灣、東涌"
                aria-controls="area-search-results"
              />
            </div>
          </div>
          <p role="status" className="section-footnote">
            {query
              ? `找到 ${results.length} 個相關地點。`
              : "以下為地區入口；實際安排按具體地址及當時人手確認。"}
          </p>
          {query ? (
            <ul id="area-search-results" className="area-results">
              {results.map(item => (
                <li key={item.name}>
                  {DISTRICT_SLUGS[item.name] ? (
                    <Link href={`/areas/${DISTRICT_SLUGS[item.name]}`}>
                      {item.name}通渠
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  ) : (
                    <Link
                      href={`/areas#coverage-${REGIONS.findIndex(r => r.name === item.region)}`}
                    >
                      {item.name}
                      <span>{item.region}安排</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div id="area-search-results" className="area-directory">
              {DISTRICTS.map(d => (
                <Link
                  className="area-card"
                  href={`/areas/${d.slug}`}
                  key={d.slug}
                >
                  <span className="brand-eyebrow">{d.region}</span>
                  <h3>{d.name}通渠</h3>
                  <p>{d.painPoints[0]?.title || "按現場情況確認處理方法"}</p>
                  <span>
                    查看當區服務
                    <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          )}
          {query && results.length === 0 ? (
            <p>未找到地點？可直接 WhatsApp 提供地址，我們再確認服務安排。</p>
          ) : null}
        </div>
      </section>
      <section
        id="coverage"
        className="brand-section brand-section--soft"
        aria-labelledby="coverage-heading"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">地區與鄰近位置</p>
              <h2 id="coverage-heading">完整地點資料</h2>
            </div>
          </div>
          <div className="coverage-groups">
            {REGIONS.map((region, index) => (
              <details
                key={region.name}
                id={`coverage-${index}`}
                open={
                  query && results.some(item => item.region === region.name)
                    ? true
                    : undefined
                }
              >
                <summary>{region.name}</summary>
                <p>{region.desc}</p>
                {region.groups.map(group => (
                  <div key={group.label}>
                    <h3>{group.label}</h3>
                    <nav aria-label={`${group.label}服務地點`}>
                      {group.items.map(name =>
                        DISTRICT_SLUGS[name] ? (
                          <Link
                            key={name}
                            href={`/areas/${DISTRICT_SLUGS[name]}`}
                          >
                            {name}通渠
                          </Link>
                        ) : (
                          <span key={name}>{name}</span>
                        )
                      )}
                    </nav>
                  </div>
                ))}
              </details>
            ))}
          </div>
          <p className="section-footnote">
            離島及偏遠地點的上門安排，須先確認交通、入口及工具運送條件。
          </p>
          <nav className="related-inline" aria-label="地區服務相關資料">
            <Link href="/services">選擇通渠服務</Link>
            <Link href="/guide">了解查詢資料</Link>
            <Link href="/service-process">上門安排流程</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
