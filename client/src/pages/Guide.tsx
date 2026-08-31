/**
 * 通渠熊 DrainBear — 通渠收費及服務指南（SEO 著陸頁）
 * 長內容頁：收費參考表、服務×地區關鍵字矩陣、揀選通渠公司貼士、HowTo 流程、精選 FAQ
 * 風格：Premium SaaS Minimalism（navy/wagreen/mist，8px 圓角，卡片懸浮陰影，無 Emoji）
 */
import { Link } from "wouter";
import {
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Banknote,
  ClipboardList,
  MapPin,
  Lightbulb,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import PriceCalculator from "@/components/PriceCalculator";
import { WhatsAppButton } from "@/components/Layout";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { trackCTA, goThanksAfterWhatsApp } from "@/lib/analytics";
import { DISTRICT_SLUGS } from "@/lib/districtData";
import { BUSINESS_ID, SITE_URL } from "@/config/site";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "通渠收費及服務指南", path: "/guide" },
];

/* 收費參考表（明碼實價，實際以現場報價為準） */
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
    note: "需重型設備，按現場情況報價",
  },
  {
    service: "食肆隔油池清理",
    range: "HK$2,500 起",
    price: 2500,
    href: "/services",
    note: "可安排定期保養計劃",
  },
  {
    service: "高壓水槍洗渠（全屋 / 全舖）",
    range: "HK$2,800 起",
    price: 2800,
    href: "/services/high-pressure-jetting",
    note: "按喉管長度及淤塞程度報價",
  },
  {
    service: "CCTV 照喉檢測連報告",
    range: "HK$1,500 起",
    price: 1500,
    href: "/services/cctv-drain-inspection",
    note: "接納工程報價可豁免檢測費",
  },
];

const CHOOSE_TIPS = [
  {
    title: "先報價、後動工",
    desc: "正規通渠公司必定在動工前確認總收費。凡是「通完先講價」的服務一律拒絕，避免被坐地起價。",
  },
  {
    title: "問清楚收費包含甚麼",
    desc: "報價應列明是否包括上門檢查、夜間附加費、特殊工具及完工清潔；師傅現場檢查後，應在動工前確認最終總收費。",
  },
  {
    title: "選擇有科技斷症的公司",
    desc: "配備 CCTV 照喉的公司可以影像證明喉管狀況，是堵塞便疏通、破損才維修，杜絕無故推銷換喉工程。",
  },
  {
    title: "留意「不成功不收費」條款",
    desc: "如服務設有「不成功不收費」，應先問清適用範圍。喉管破損、拆裝或檢測可能屬另一項工程，事前要確認條款。",
  },
];

const AREA_SERVICE_LINKS = [
  {
    area: "港島區",
    keywords: [
      "中環通渠",
      "灣仔通渠",
      "銅鑼灣通渠",
      "北角通渠",
      "太古城通渠",
      "香港仔通渠",
    ],
    focus: "唐樓及商業大廈高層去水問題",
  },
  {
    area: "九龍區",
    keywords: [
      "旺角通渠",
      "尖沙咀通渠",
      "深水埗通渠",
      "觀塘通渠",
      "九龍城通渠",
      "黃大仙通渠",
    ],
    focus: "舊式大廈喉管倒灌及食肆塞渠",
  },
  {
    area: "新界及離島",
    keywords: [
      "沙田通渠",
      "荃灣通渠",
      "屯門通渠",
      "元朗通渠",
      "將軍澳通渠",
      "東涌通渠",
    ],
    focus: "村屋沙井滿瀉及戶外樹根纏繞",
  },
];

function areaKeywordHref(keyword: string) {
  const district = keyword.replace(/通渠$/, "");
  const slug = DISTRICT_SLUGS[district];

  return slug ? `/areas/${slug}` : "/areas#coverage";
}

const HOWTO_STEPS = [
  {
    step: "1",
    title: "WhatsApp 影相報價",
    desc: "拍下塞渠位置相片或影片，傳送至 WhatsApp，客服即時初步評估並報價。",
  },
  {
    step: "2",
    title: "確認價錢及時間",
    desc: "出發前先提供初步估價及預計到達時間；師傅現場檢查後、動工前確認最終總收費，深夜附加費亦會事先講明。",
  },
  {
    step: "3",
    title: "師傅上門疏通",
    desc: "施工前鋪設保護墊，按淤塞性質選用手搖泵、電動通渠機或高壓水槍。",
  },
  {
    step: "4",
    title: "測試及清理現場",
    desc: "完工後即場測試去水，徹底清潔施工範圍，滿意後才收費。",
  },
];

const GUIDE_FAQS = [
  {
    q: "通渠收費一般是多少？",
    a: "香港通渠收費視乎淤塞位置及嚴重程度：坐廁淤塞約 HK$600 起，廚房鋅盤約 HK$500 起，大廈主渠或沙井工程約 HK$1,800 起。師傅現場檢查後會在動工前確認最終總價。",
  },
  {
    q: "通渠公司幾耐可以到？",
    a: "可安排時間會受所在地點、交通、師傅及設備調配影響。提供地區、堵塞位置與現場影片後，團隊會確認可安排的上門時間；深夜服務的附加費亦會事先說明。",
  },
  {
    q: "自己倒通渠水得唔得？",
    a: "強烈不建議。市面通渠水屬強酸強鹼，對付豬油膏及頭髮效果有限，反而會腐蝕喉管造成穿漏，令維修費用大增。物理疏通（通渠機、高壓水槍）才是治本方法。",
  },
  {
    q: "點樣先知道喉管需唔需要更換？",
    a: "CCTV 照喉可在合適入口及管道條件下協助查看內部狀況；影像結果仍要配合現場檢查，才可判斷疏通、檢測或維修方向。",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GUIDE_FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const HOWTO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "香港通渠服務流程：由報價到完工 4 步",
  description:
    "通渠熊 DrainBear 標準服務流程：WhatsApp 影相報價、確認價錢、師傅上門疏通、測試及清理現場。",
  step: HOWTO_STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.desc,
  })),
};

const PRICING_SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/guide#drain-service-pricing`,
  name: "香港通渠服務及收費參考",
  serviceType: "通渠服務",
  url: `${SITE_URL}/guide`,
  provider: { "@id": BUSINESS_ID },
  areaServed: "Hong Kong",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "通渠收費參考",
    itemListElement: PRICE_TABLE.map(item => ({
      "@type": "Offer",
      name: item.service,
      url: `${SITE_URL}${item.href}`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "HKD",
        minPrice: item.price,
      },
      description: `${item.range}；${item.note}。最終收費於現場檢查後、動工前確認。`,
    })),
  },
};

const GUIDE_WEBPAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/guide#webpage`,
  url: `${SITE_URL}/guide`,
  name: "香港通渠價錢、費用及收費指南",
  dateModified: "2026-08-19",
  mainEntity: { "@id": `${SITE_URL}/guide#drain-service-pricing` },
};

export default function Guide() {
  const { phoneDisplay, phoneHref, whatsappHref } = useContactSettings();
  return (
    <div className="phase4-guide bg-white" data-phase4-page="guide">
      <SEO
        title="2026 香港通渠價錢｜通渠收費、費用及報價參考｜通渠熊"
        description="想知香港通渠幾錢？查看坐廁、廚房鋅盤、企缸浴缸、大廈主渠、高壓洗渠及 CCTV 照喉的通渠價錢與費用參考，並了解影響最終報價的因素。"
        path="/guide"
        keywords="通渠價錢, 通渠價格, 通渠費用, 通渠收費, 通渠報價, 通渠幾錢, 塞廁所收費, 高壓通渠收費, CCTV照喉價錢"
        jsonLd={[
          GUIDE_WEBPAGE_JSONLD,
          PRICING_SERVICE_JSONLD,
          FAQ_JSONLD,
          HOWTO_JSONLD,
        ]}
        breadcrumbs={CRUMBS}
      />
      <Breadcrumbs items={CRUMBS} />

      {/* 頁首 */}
      <EditorialPageHero
        kicker="Pricing & guide / 收費指南"
        title={
          <>
            香港通渠價錢及收費，
            <br />
            動工前確認報價
          </>
        }
        description="整理常見通渠價格、費用和起始收費，並說明影響最終報價的因素。想知通渠幾錢，可先按堵塞位置查看參考，再提供現場資料作初步估價。"
        actions={
          <>
            <WhatsAppButton
              label="WhatsApp 免費報價"
              className="phase4-primary-action"
              trackLocation="guide_hero"
            />
            <a
              href={phoneHref}
              onClick={() => trackCTA("phone", "guide_hero")}
              className="phase4-secondary-action"
            >
              致電 {phoneDisplay}
            </a>
          </>
        }
        className="phase4-guide__hero"
      />

      {/* 收費參考表 */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mb-8 flex items-start gap-4 md:mb-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-wagreen/10 text-wagreen-dark">
              <Banknote className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                2026 香港通渠價錢及費用參考表
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                以下為常見通渠服務的起始價錢，最終收費會於師傅上門評估後、動工前一次過確認。
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                最後更新：2026 年 8 月 19 日
              </p>
            </div>
          </div>
          <div className="card-float overflow-hidden rounded-lg border border-border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="px-5 py-4 font-display font-bold">
                      服務項目
                    </th>
                    <th className="px-5 py-4 font-display font-bold">
                      收費參考
                    </th>
                    <th className="px-5 py-4 font-display font-bold">備註</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICE_TABLE.map((r, i) => (
                    <tr
                      key={r.service}
                      className={i % 2 === 1 ? "bg-mist/60" : "bg-white"}
                    >
                      <td className="px-5 py-4 font-semibold text-navy">
                        <Link
                          href={r.href}
                          className="underline decoration-navy/25 underline-offset-4 hover:decoration-navy"
                        >
                          {r.service}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-display font-extrabold text-wagreen-dark">
                        {r.range}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {r.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-start gap-2.5 border-t border-border bg-mist/40 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-safety"
                strokeWidth={2.2}
              />
              以上價錢僅供參考，實際收費視乎現場淤塞程度、樓層及施工難度而定。深夜時段（23:00–07:00）設合理附加費，
              出發前先提供初步估價；師傅現場檢查後、動工前確認最終總收費。不同問題所需設備及施工範圍並不相同。
            </div>
          </div>
        </div>
      </section>

      {/* 互動式估價計算機 */}
      <section id="calculator" className="scroll-mt-24 pb-14 md:pb-20">
        <div className="container">
          <div className="reveal mb-8 max-w-xl">
            <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">
              PRICE ESTIMATOR
            </div>
            <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
              即時估價計算機
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              揀好堵塞位置、樓宇類型同上門時段，即刻睇到初步估價範圍，一撳即可用
              WhatsApp 確認實際報價。
            </p>
          </div>
          <div className="reveal">
            <PriceCalculator />
          </div>
        </div>
      </section>

      {/* 揀選通渠公司貼士 */}
      <section className="bg-mist py-14 md:py-20">
        <div className="container">
          <div className="mb-8 flex items-start gap-4 md:mb-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-wagreen/10 text-wagreen-dark">
              <Lightbulb className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                揀選通渠公司 4 大貼士
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                坊間通渠服務質素參差，記住以下四點，就能避開絕大部分陷阱。
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {CHOOSE_TIPS.map((t, i) => (
              <div
                key={t.title}
                className="card-float rounded-lg bg-white p-6 md:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-black text-wagreen">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy">
                    {t.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 服務流程 HowTo */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mb-8 flex items-start gap-4 md:mb-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-wagreen/10 text-wagreen-dark">
              <ClipboardList className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                服務流程：4 步由報價到完工
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                每一步都清晰透明，你隨時知道下一步會發生甚麼、需要付多少。
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOWTO_STEPS.map(s => (
              <div
                key={s.step}
                className="card-float relative rounded-lg border border-border bg-white p-6"
              >
                <div className="absolute -top-3 left-5 rounded-full bg-navy px-3 py-1 font-display text-xs font-extrabold text-wagreen">
                  STEP {s.step}
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-navy">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href={whatsappHref("你好，我想影相俾師傅估價，麻煩晒。")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackCTA("whatsapp", "guide_howto", "影相估價");
                goThanksAfterWhatsApp("guide_howto");
              }}
              className="btn-smooth inline-flex items-center gap-2 rounded-lg bg-wagreen px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
              立即影相免費估價
            </a>
          </div>
        </div>
      </section>

      {/* 地區覆蓋 + 內部連結 */}
      <section className="bg-navy py-14 text-white md:py-20">
        <div className="container">
          <div className="mb-8 flex items-start gap-4 md:mb-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-wagreen">
              <MapPin className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black md:text-3xl">
                全港 18 區通渠服務覆蓋
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/60 md:text-base">
                港島、九龍、新界及離島均可先提供地點查詢，再按交通、師傅及設備安排確認上門時間。
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {AREA_SERVICE_LINKS.map(a => (
              <div
                key={a.area}
                className="rounded-lg bg-white/5 p-6 ring-1 ring-white/10"
              >
                <h3 className="font-display text-lg font-bold text-white">
                  {a.area}
                </h3>
                <p className="mt-1.5 text-xs text-white/55">{a.focus}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.keywords.map(k => (
                    <Link
                      key={k}
                      href={areaKeywordHref(k)}
                      className="btn-smooth inline-flex min-h-[40px] items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-white/80 hover:bg-wagreen hover:text-white"
                    >
                      {k}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/areas"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-wagreen hover:gap-2.5"
            >
              查看完整服務地區
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 精選 FAQ */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mb-8 flex items-start gap-4 md:mb-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-wagreen/10 text-wagreen-dark">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                通渠收費常見問題
              </h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {GUIDE_FAQS.map(f => (
              <div
                key={f.q}
                className="card-float rounded-lg border border-border bg-white p-6 md:p-7"
              >
                <h3 className="flex items-start gap-2.5 font-display text-base font-bold text-navy">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-wagreen"
                    strokeWidth={2.2}
                  />
                  {f.q}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-wagreen-dark hover:gap-2.5"
            >
              查看全部常見問題
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 收尾 */}
      <section className="bg-gradient-to-b from-white to-mist pb-16 pt-4 md:pb-20">
        <div className="container">
          <div className="card-float rounded-lg bg-navy px-6 py-10 text-center text-white md:px-12 md:py-14">
            <h2 className="text-balance font-display text-2xl font-black md:text-3xl">
              仲喺度格價？直接攞個實價最快。
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/60 md:text-base">
              影低塞渠位置，透過 WhatsApp 傳送地點、相片或影片，
              團隊會先了解情況；師傅現場檢查後、動工前確認最終收費。
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <WhatsAppButton
                label="WhatsApp 免費報價"
                className="px-7 py-3.5"
                trackLocation="guide_footer_cta"
              />
              <a
                href={phoneHref}
                onClick={() => trackCTA("phone", "guide_footer_cta")}
                className="btn-smooth inline-flex items-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10"
              >
                致電 {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
