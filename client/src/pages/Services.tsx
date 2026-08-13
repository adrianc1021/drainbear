/**
 * 通渠熊 DrainBear — 專業服務
 * 區塊 1：Z-Pattern 交替圖文（四大服務）
 * 區塊 2：細分服務範疇（SEO 關鍵字覆蓋）｜區塊 3：4 步解除危機（橫向流程圖）
 */
import {
  Home as HomeIcon,
  Building2,
  Waves,
  Video,
  MessageCircle,
  Search,
  Wrench,
  Sparkles,
  ArrowRight,
  Droplets,
  Bath,
  UtensilsCrossed,
  CircleAlert,
} from "lucide-react";
import { Link } from "wouter";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  trackCTA,
  goThanksAfterWhatsApp,
  trackNavClick,
} from "@/lib/analytics";
import { SERVICE_PAGES } from "@/lib/serviceData";

const SERVICES_CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "通渠服務", path: "/services" },
];

const SERVICES = [
  {
    icon: HomeIcon,
    tag: "RESIDENTIAL",
    title: "住宅通渠急救",
    desc: "針對一般家庭的廚房星盆、浴室去水位及座廁淤塞，專業手搖泵極速打通，過程注重家居保護，完工包清理，還原企理現場。",
    img: "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A1_vyqcil.png",
    wa: "你好，我想查詢住宅通渠服務報價。",
  },
  {
    icon: Building2,
    tag: "COMMERCIAL",
    title: "商業重型通渠",
    desc: "專治食肆隔油池爆滿、大廈主渠倒灌等重型工程。配備工業級設備及大型吸車，將營業損失減至最低，深夜施工亦可安排。",
    img: "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A2_onju5z.png",
    wa: "你好，我想查詢商業重型通渠服務報價。",
  },
  {
    icon: Waves,
    tag: "HYDRO JETTING",
    title: "高壓水槍洗渠",
    desc: "引進頂級高壓水槍車，以極限水壓將硬化油垢、水泥及陳年污垢徹底粉碎沖走，令喉管回復暢通如新，效果遠勝傳統通渠方法。",
    img: "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A3_fyozug.png",
    wa: "你好，我想查詢高壓水槍洗渠服務報價。",
  },
  {
    icon: Video,
    tag: "CCTV INSPECTION",
    title: "CCTV 照喉檢測",
    desc: "高清防水鏡頭深入喉管探測，精準定位淤塞物及破損位置，科學斷症、有片有真相，杜絕盲猜式維修及不必要的換喉工程。",
    img: "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A4_hiufrh.png",
    wa: "你好，我想查詢 CCTV 照喉檢測服務報價。",
  },
];

const DETAIL_GROUPS = [
  {
    heading: "住宅特急通渠",
    intro:
      "廁所水倒灌？企缸去水慢？我們深知家居塞渠的煩惱，專注各類住宅通渠及屋苑水管維修，承諾絕不弄髒您的家居。",
    items: [
      {
        icon: CircleAlert,
        title: "坐廁及馬桶淤塞",
        desc: "專治硬物掉入或紙巾淤塞，高壓氣泵極速疏通，免拆馬桶。",
      },
      {
        icon: UtensilsCrossed,
        title: "廚房鋅盤去水慢",
        desc: "針對 U 型喉管內的陳年豬油膏及廚餘殘渣，徹底清除油脂。",
      },
      {
        icon: Bath,
        title: "企缸及浴缸通渠",
        desc: "解決頭髮及番梘垢導致的水浸問題，回復爽快去水速度。",
      },
      {
        icon: Droplets,
        title: "隔氣及喉管漏水",
        desc: "精準檢查隔氣老化或接駁位滴水，提供即時防漏維修。",
      },
    ],
  },
  {
    heading: "商業重型通渠",
    intro:
      "營業場所塞渠等同停業！專為食肆、商場及物業提供高強度商業通渠，配備工業級設備，將對營業的影響減至最低。",
    items: [
      {
        icon: UtensilsCrossed,
        title: "食肆隔油池清理",
        desc: "應付大量高濃度油污，提供定期抽油及清洗服務。",
      },
      {
        icon: Waves,
        title: "德國高壓洗渠車",
        desc: "極限水壓粉碎管壁硬化水泥及油塊，深度清洗管道。",
      },
      {
        icon: Building2,
        title: "大廈沙井及主渠",
        desc: "重型設備應對沙井滿瀉、樹根纏繞及主渠倒灌。",
      },
      {
        icon: Video,
        title: "CCTV 管道探測報告",
        desc: "微型鏡頭深入探測暗漏及破損，提供影像分析作工程依據。",
      },
    ],
  },
];

const SERVICE_SCHEMA_IDS = [
  "residential-drain-unblocking",
  "commercial-drain-cleaning",
  "high-pressure-water-jetting",
  "cctv-drain-inspection",
];

const SERVICES_JSONLD = SERVICES.map((service, index) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/services#${SERVICE_SCHEMA_IDS[index]}`,
  name: service.title,
  serviceType: service.title,
  description: service.desc,
  url: `${SITE_URL}/services`,
  provider: {
    "@id": BUSINESS_ID,
  },
  areaServed: ["香港島", "九龍", "新界", "離島"],
}));

const STEPS = [
  {
    icon: MessageCircle,
    step: "01",
    title: "WhatsApp 報價",
    desc: "影相或拍片描述情況，即時獲取初步報價",
  },
  {
    icon: Search,
    step: "02",
    title: "特快上門檢查",
    desc: "師傅到達現場，精準評估並確認最終收費",
  },
  {
    icon: Wrench,
    step: "03",
    title: "專業施工",
    desc: "確認報價後立即動工，不成功不收費",
  },
  {
    icon: Sparkles,
    step: "04",
    title: "清理現場",
    desc: "完工後測試去水，徹底清潔施工位置",
  },
];

export default function Services() {
  const { whatsappHref } = useContactSettings();
  return (
    <div className="phase4-services" data-phase4-page="services">
      <SEO
        title="通渠服務｜住宅通渠・食肆隔油池・高壓水槍洗渠・CCTV 照喉｜通渠熊 DrainBear"
        description="通渠熊提供全方位通渠服務：塞廁所、企缸、廚房鋅盤去水慢、食肆隔油池清理、大廈沙井主渠疏通、德國高壓水槍洗渠及 CCTV 照喉檢測。24 小時特快上門，先報價後動工，不成功不收費。"
        path="/services"
        keywords="通渠服務, 塞廁所, 企缸塞, 廚房去水慢, 隔油池清理, 高壓水槍洗渠, CCTV照喉, 沙井疏通, 24小時通渠"
        jsonLd={SERVICES_JSONLD}
        breadcrumbs={SERVICES_CRUMBS}
      />
      <Breadcrumbs items={SERVICES_CRUMBS} />
      {/* 頁首 */}
      <EditorialPageHero
        kicker="Our services / 專業服務"
        title={
          <>
            全方位通渠服務，
            <br />
            因應現場選擇方案
          </>
        }
        description="由一般住宅淤塞到商業主渠工程，團隊會先了解管道結構、淤塞程度及現場環境，再建議合適設備與處理方向。"
        actions={
          <WhatsAppButton
            className="phase4-primary-action"
            label="WhatsApp 查詢報價"
            trackLocation="services_hero"
          />
        }
        className="phase4-services__hero"
      />

      {/* 區塊 1：Z-Pattern 交替圖文 */}
      <section className="bg-white pb-8">
        <div className="container flex flex-col gap-20 py-10 md:gap-28">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* 圖 */}
              <div className="relative">
                <div
                  className={`pointer-events-none absolute -inset-4 rounded-[20px] blur-xl ${
                    i % 2 === 0
                      ? "bg-gradient-to-br from-navy/8 to-wagreen/10"
                      : "bg-gradient-to-bl from-wagreen/10 to-navy/8"
                  }`}
                />
                <img
                  src={s.img}
                  alt={s.title}
                  width="1200"
                  height="800"
                  loading="lazy"
                  decoding="async"
                  className="relative w-full rounded-2xl object-cover shadow-[0_16px_48px_rgba(11,19,43,0.16)]"
                />
              </div>
              {/* 文 */}
              <div className={i % 2 === 1 ? "lg:pr-8" : "lg:pl-8"}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-mist px-4 py-1.5 text-xs font-bold tracking-[0.15em] text-navy/60">
                  <s.icon
                    className="h-3.5 w-3.5 text-wagreen"
                    strokeWidth={2.5}
                  />
                  {s.tag}
                </div>
                <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <a
                  href={whatsappHref(s.wa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCTA("whatsapp", "services_section", s.title);
                    goThanksAfterWhatsApp("services_section");
                  }}
                  className="btn-smooth mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen-dark hover:gap-2.5"
                >
                  WhatsApp 查詢報價
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-white py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              SERVICE GUIDES
            </div>
            <h2 className="font-display text-3xl font-black text-navy md:text-4xl">
              按問題查看處理方法
            </h2>
            <p className="mt-4 text-muted-foreground">
              了解常見症狀、處理流程及影響收費的因素，再決定下一步。
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICE_PAGES.map(service => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                onClick={() =>
                  trackNavClick("service", {
                    cta_location: "services_guides",
                    cta_label: service.shortName,
                    service_name: service.slug,
                    destination_url: `/services/${service.slug}`,
                  })
                }
                className="group rounded-xl border border-border bg-mist/45 p-5 transition hover:-translate-y-1 hover:border-wagreen/50 hover:bg-white hover:shadow-lg"
              >
                <span className="text-[10px] font-bold tracking-[0.13em] text-safety">
                  {service.eyebrow}
                </span>
                <h3 className="mt-2 font-display text-base font-black text-navy">
                  {service.name}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-wagreen-dark">
                  查看詳情
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 區塊 2：細分服務範疇 */}
      <section className="bg-mist py-20 md:py-24">
        <div className="container">
          <div className="text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              SERVICE SCOPE
            </div>
            <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
              服務範疇一覽
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              專業排水工程與物業維護，由家居小問題到大廈主渠工程，一一涵蓋。
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {DETAIL_GROUPS.map(g => (
              <div
                key={g.heading}
                className="card-float rounded-lg bg-white p-8"
              >
                <h3 className="font-display text-xl font-black text-navy">
                  {g.heading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {g.intro}
                </p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {g.items.map(it => (
                    <div key={it.title} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-wagreen/10 text-wagreen-dark">
                        <it.icon
                          className="h-4.5 w-4.5 h-[18px] w-[18px]"
                          strokeWidth={2.2}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy">
                          {it.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {it.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 區塊 3：4 步解除危機 */}
      <section className="bg-navy py-20 md:py-24">
        <div className="container">
          <div className="text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-wagreen">
              HOW IT WORKS
            </div>
            <h2 className="text-balance font-display text-3xl font-black text-white md:text-4xl">
              4 步解除危機
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/55">
              流程簡單透明，由報價到完工清潔，每一步都清晰明確。
            </p>
          </div>
          <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            {/* 連接線 */}
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-wagreen/60 via-white/25 to-wagreen/60 md:block" />
            {STEPS.map(st => (
              <div
                key={st.step}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/20 backdrop-blur">
                  <st.icon className="h-7 w-7 text-wagreen" strokeWidth={2} />
                </div>
                <div className="mt-4 font-display text-xs font-extrabold tracking-[0.25em] text-safety">
                  STEP {st.step}
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-white">
                  {st.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/55">{st.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <WhatsAppButton
              className="px-8 py-4 text-base"
              label="立即開始第一步"
              trackLocation="services_footer_cta"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
