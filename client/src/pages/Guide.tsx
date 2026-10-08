import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { Link } from "wouter";
const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "收費指南", path: "/guide" },
];
const PRICE_TABLE = [
  {
    service: "坐廁 / 馬桶淤塞疏通",
    range: "HK$600 起",
    price: 600,
    href: "/services/toilet-unblocking",
    note: "視乎淤塞物性質，硬物需用專業工具",
  },
  {
    service: "廚房鋅盤 / 星盆去水慢",
    range: "HK$500 起",
    price: 500,
    href: "/services/kitchen-sink-unblocking",
    note: "陳年豬油膏或需高壓處理",
  },
  {
    service: "企缸 / 浴缸 / 地台去水位",
    range: "HK$500 起",
    price: 500,
    href: "/services/bathroom-drain-unblocking",
    note: "頭髮番梘垢淤塞為主",
  },
  {
    service: "大廈主渠 / 沙井疏通",
    range: "HK$1,800 起",
    price: 1800,
    href: "/services/main-drain-manhole",
    note: "處理主渠及沙井淤塞",
  },
  {
    service: "食肆隔油池清理",
    range: "HK$2,500 起",
    price: 2500,
    href: "/services/grease-trap-cleaning",
    note: "可安排定期保養計劃",
  },
  {
    service: "高壓水槍洗渠（全屋 / 全舖）",
    range: "HK$2,800 起",
    price: 2800,
    href: "/services/high-pressure-jetting",
    note: "清理管壁油垢及沉積物",
  },
  {
    service: "CCTV 照喉檢測連報告",
    range: "HK$1,500 起",
    price: 1500,
    href: "/services/cctv-drain-inspection",
    note: "檢查入口及管道條件，確認報告範圍",
  },
];

const GUIDE_FAQS = [
  {
    q: "通渠收費一般是多少？",
    a: "常見通渠服務參考價：坐廁淤塞約 HK$600 起，廚房鋅盤約 HK$500 起，大廈主渠或沙井工程約 HK$1,800 起。師傅現場檢查後會在動工前確認最終總價。",
  },
  {
    q: "通渠公司何時可以到場？",
    a: "可安排時間會受所在地點、交通、人員及設備調配影響。提供地區、淤塞位置與現場短片後，團隊會確認可安排的上門時段。",
  },
  {
    q: "可以自行使用化學通渠劑嗎？",
    a: "不建議自行使用。市面化學通渠劑的腐蝕性較強，對豬油膏及頭髮的效果有限，亦可能增加喉管受損及後續施工的風險。應按現場情況評估手動工具、通渠機或高壓水槍等處理方法。",
  },
  {
    q: "如何判斷喉管是否需要更換？",
    a: "CCTV 照喉可在入口及管道條件合適時協助查看內部狀況；影像結果仍須配合現場檢查，才可判斷應採用疏通、檢測或維修方案。",
  },
];

const PRICING_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/guide#pricing`,
  name: "香港通渠服務收費參考",
  url: `${SITE_URL}/guide`,
  provider: { "@id": BUSINESS_ID },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "通渠起始收費參考",
    itemListElement: PRICE_TABLE.map(item => ({
      "@type": "Offer",
      name: item.service,
      url: `${SITE_URL}${item.href}`,
      itemOffered: {
        "@type": "Service",
        "@id": `${SITE_URL}${item.href}#service`,
        name: item.service,
      },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "HKD",
        minPrice: item.price,
      },
      description: `${item.range}；${item.note}。實際總收費在現場檢查後、動工前確認。`,
    })),
  },
};
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GUIDE_FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
export default function Guide() {
  return (
    <div className="guide-page">
      <SEO
        title="香港通渠價錢｜收費、費用及報價參考｜通渠熊"
        description="鋅盤及浴室疏通HK$500起、坐廁HK$600起。查看不同通渠服務的起始收費、影響報價的因素及動工前要確認的項目。實際總收費以現場報價為準。"
        path="/guide"
        breadcrumbs={CRUMBS}
        jsonLd={[PRICING_JSONLD, FAQ_JSONLD]}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          kicker="收費指南"
          title="香港通渠價錢及收費"
          description="鋅盤及浴室 HK$500 起，坐廁 HK$600 起。堵塞範圍、工具及施工條件會影響總收費，動工前確認報價。"
          contactLocation="guide_hero"
        />
      </div>
      <section className="brand-section" aria-labelledby="pricing-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">起始收費，不等於總價</p>
              <h2 id="pricing-heading">常見通渠收費參考</h2>
            </div>
          </div>
          <div
            className="pricing-table-scroll"
            role="region"
            aria-label="通渠起始收費表"
            tabIndex={0}
          >
            <table className="pricing-table">
              <caption>
                以下為網站現有起始收費；新增工序須先說明並確認。
              </caption>
              <thead>
                <tr>
                  <th scope="col">服務</th>
                  <th scope="col">起始收費</th>
                  <th scope="col">報價注意事項</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE.map(item => (
                  <tr key={item.href}>
                    <th scope="row">
                      <Link href={item.href}>{item.service}</Link>
                    </th>
                    <td>{item.range}</td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="section-footnote">
            相片可協助初步估價；師傅到場檢查後，雙方確認處理方法及最終總收費才動工。
          </p>
        </div>
      </section>
      <section
        className="brand-section brand-section--soft"
        aria-labelledby="price-factors"
      >
        <div className="container answer-panel">
          <div>
            <p className="brand-eyebrow">報價前先問清楚</p>
            <h2 id="price-factors">點解同樣塞渠，價錢會不同？</h2>
          </div>
          <div>
            <p>
              室內隔氣淤塞與大廈主渠堵塞，需要的工具及工序不同。報價前應確認受影響管段、是否需要拆裝、工具、施工時段，以及測試和整理是否包含在內。
            </p>
            <ul className="plain-checklist">
              <li>處理哪個位置，以及需要哪些工序</li>
              <li>總收費包含甚麼，有沒有另計項目</li>
              <li>若發現新問題，如何確認追加工序及收費</li>
            </ul>
            <Link href="/service-process">查看上門檢查及報價流程</Link>
          </div>
        </div>
      </section>
      <section className="brand-section" aria-labelledby="pricing-faq">
        <div className="container brand-narrow">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">直接解答</p>
              <h2 id="pricing-faq">通渠收費常見問題</h2>
            </div>
          </div>
          <div className="brand-faq">
            {GUIDE_FAQS.map(f => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <nav className="related-inline" aria-label="收費相關資料">
            <Link href="/services">按問題找服務</Link>
            <Link href="/areas">確認服務地區</Link>
            <Link href="/faq">其他常見問題</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
