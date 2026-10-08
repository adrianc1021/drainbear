import WhatsAppIcon from "@/components/WhatsAppIcon";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { DISTRICTS, DISTRICT_SLUGS } from "@/lib/districtData";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { goThanksAfterWhatsApp, trackCTA } from "@/lib/analytics";

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

function districtsForRegion(region: (typeof REGIONS)[number]) {
  return DISTRICTS.filter(district =>
    region.name === "新界及離島"
      ? ["新界區", "離島區"].includes(district.region)
      : district.region === region.name
  );
}

const LOCALITIES = REGIONS.flatMap(region => {
  const places = region.groups.flatMap(group =>
    group.items.map(name => ({ name, region: region.name, group: group.label }))
  );
  for (const district of districtsForRegion(region)) {
    if (!places.some(place => place.name === district.name))
      places.push({
        name: district.name,
        region: region.name,
        group: district.name,
      });
  }
  return places;
});
const RESULT_BATCH = 12;
const normalizeSearch = (value: string) =>
  value.replace(/\s+/g, "").toLocaleLowerCase();

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
  const { whatsappHref } = useContactSettings();
  const [query, setQuery] = useState("");
  const [resultLimit, setResultLimit] = useState(RESULT_BATCH);
  const searchRef = useRef<HTMLInputElement>(null);
  const hasQuery = query.trim().length > 0;
  const results = useMemo(() => {
    const value = normalizeSearch(query);
    return LOCALITIES.filter(item => {
      const district = DISTRICTS.find(
        d => d.slug === DISTRICT_SLUGS[item.name]
      );
      return [item.name, item.region, item.group, district?.en || ""].some(
        text => normalizeSearch(text).includes(value)
      );
    });
  }, [query]);

  // Existing coverage bookmarks still open their region after hydration.
  useEffect(() => {
    const openHashRegion = () => {
      if (!/^#coverage-[0-2]$/.test(window.location.hash)) return;
      const details = document.getElementById(window.location.hash.slice(1));
      if (details instanceof HTMLDetailsElement) {
        details.open = true;
        details.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
      }
    };
    openHashRegion();
    window.addEventListener("hashchange", openHashRegion);
    return () => window.removeEventListener("hashchange", openHashRegion);
  }, []);

  const updateQuery = (value: string) => {
    setQuery(value);
    setResultLimit(RESULT_BATCH);
  };
  const inquiryLink = (name: string, location: string) => (
    <a
      href={whatsappHref(
        `您好，我想查詢通渠服務。\n所在地點：${name}\n受影響位置：\n現場情況：`
      )}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackCTA("whatsapp", location);
        goThanksAfterWhatsApp(location);
      }}
      className="area-locality-link area-locality-link--inquiry"
    >
      <span>{name}</span>
      <WhatsAppIcon aria-hidden="true" />
      <span className="sr-only">（WhatsApp 查詢，另開視窗）</span>
    </a>
  );
  const localityLink = (name: string) =>
    DISTRICT_SLUGS[name] ? (
      <Link
        className="area-locality-link"
        href={`/areas/${DISTRICT_SLUGS[name]}`}
      >
        <span>{name}通渠</span>
        <ArrowRight aria-hidden="true" />
      </Link>
    ) : (
      inquiryLink(name, "area_locality")
    );

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
          title={
            <>
              <span className="area-hero-title-part">港九新界及離島</span>
              <span className="area-hero-title-part">通渠服務</span>
            </>
          }
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
                ref={searchRef}
                id="area-search"
                type="search"
                value={query}
                onChange={event => updateQuery(event.target.value)}
                placeholder="例如：觀塘、荃灣、東涌"
                aria-controls="area-search-results"
              />
              {query ? (
                <button
                  type="button"
                  className="area-search__clear"
                  aria-label="清除地區搜尋"
                  onClick={() => {
                    updateQuery("");
                    searchRef.current?.focus();
                  }}
                >
                  <X aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
          <p role="status" className="section-footnote">
            {hasQuery
              ? `找到 ${results.length} 個相關地點，顯示 ${Math.min(resultLimit, results.length)} 個。`
              : "展開所在區域，或直接搜尋地點。上門安排按具體位置確認。"}
          </p>
          <div id="area-search-results">
            {hasQuery ? (
              <>
                <ul className="area-results">
                  {results.slice(0, resultLimit).map(item => (
                    <li key={item.name}>{localityLink(item.name)}</li>
                  ))}
                </ul>
                {results.length > resultLimit ? (
                  <button
                    type="button"
                    className="area-load-more"
                    onClick={() =>
                      setResultLimit(limit => limit + RESULT_BATCH)
                    }
                  >
                    顯示更多地點（餘 {results.length - resultLimit} 個）
                    <ArrowRight aria-hidden="true" />
                  </button>
                ) : null}
                {results.length === 0 ? (
                  <div className="area-search__empty">
                    <p>未找到地點？傳送位置及相片，我們再確認安排。</p>
                    {inquiryLink(query.trim(), "area_search_fallback")}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="area-directory" id="coverage">
                {REGIONS.map((region, index) => {
                  const districts = districtsForRegion(region);
                  return (
                    <AnimatedDisclosure
                      key={region.name}
                      id={`coverage-${index}`}
                      className="area-region"
                      title={region.name}
                      description={`${districts.length} 個地區專頁 · 展開選擇地點`}
                    >
                      <p className="area-region__description">{region.desc}</p>
                      <nav
                        className="area-region-pages"
                        aria-label={`${region.name}地區專頁`}
                      >
                        {districts.map(district => (
                          <Link
                            className="area-locality-link"
                            key={district.slug}
                            href={`/areas/${district.slug}`}
                          >
                            <span>{district.name}通渠</span>
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        ))}
                      </nav>
                      <p className="area-region__hint">
                        鄰近地點亦可查詢；WhatsApp 入口會帶入你選擇的位置。
                      </p>
                      <div className="area-neighbourhoods">
                        {region.groups.map(group => {
                          const nearby = group.items.filter(
                            name => !districts.some(d => d.name === name)
                          );
                          if (!nearby.length) return null;
                          return (
                            <section
                              className="area-locality-group"
                              key={group.label}
                            >
                              <h3>{group.label}</h3>
                              <nav aria-label={`${group.label}鄰近地點`}>
                                {nearby.map(name => (
                                  <div key={name}>{localityLink(name)}</div>
                                ))}
                              </nav>
                            </section>
                          );
                        })}
                      </div>
                      <p className="section-footnote">{region.eta}。</p>
                    </AnimatedDisclosure>
                  );
                })}
              </div>
            )}
          </div>
          <p className="section-footnote">
            離島及偏遠地點請一併說明交通、入口及工具運送條件。
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
