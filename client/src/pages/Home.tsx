/**
 * 通渠熊 DrainBear — 首頁
 * 區塊 1：Hero 左文右懸浮圖｜區塊 2：深海軍藍優勢列（4 欄）
 * 區塊 3：透明報價信任區塊｜區塊 4：為什麼選擇我們（左 2x2 網格 + 右大圖）
 * 區塊 5：四大服務卡（每卡獨立 WhatsApp CTA）｜區塊 6：CTA 收尾
 * 風格：Premium SaaS Minimalism，大量留白、8px 圓角、懸浮陰影卡片
 */
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  ScanEye,
  Sparkles,
  Droplets,
  Receipt,
  Timer,
  Brush,
  MessageCircle,
  Star,
  Phone,
  Home as HomeIcon,
  Building2,
  MapPin,
  Waves,
  Video,
  FileCheck,
  HandCoins,
  ShieldCheck,
} from "lucide-react";
import { WhatsAppButton } from "@/components/Layout";
import ServiceQuickSelect from "@/components/ServiceQuickSelect";
import { useBlogPosts } from "@/lib/useBlog";
import CmsPageSEO from "@/components/CmsPageSEO";
import {
  BUSINESS_ID,
  BUSINESS_NAME,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
} from "@/config/site";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { trackCTA, goThanksAfterWhatsApp } from "@/lib/analytics";

/** 真實工程案例（實際工程紀錄，非客戶評論） */
const CASE_STUDIES = [
  {
    area: "觀塘",
    type: "商業工程",
    title: "工廈食堂去水位嚴重淤塞",
    desc: "活化工廈內食堂鋅盤及地台去水完全停滯，高壓水槍沖洗 15 米排水管，徹底清除積聚多年嘅油脂層，即場放水測試回復暢通。",
    arrival: "42 分鐘",
    duration: "約 1.5 小時",
  },
  {
    area: "沙田",
    type: "村屋工程",
    title: "村屋沙井滿瀉緊急抽清",
    desc: "大圍村屋沙井雨後滿瀉倒灌後院，大型吸車即日到場抽清，CCTV 照喉發現樹根入侵，機械切割清除後回復排水。",
    arrival: "55 分鐘",
    duration: "約 2 小時",
  },
  {
    area: "旺角",
    type: "住宅工程",
    title: "唐樓座廁淤塞深夜救援",
    desc: "凌晨接報唐樓座廁淤塞倒灌，師傅 30 分鐘上門，專用通渠器配合高壓疏通，出發前已確認總價，完工清理現場。",
    arrival: "31 分鐘",
    duration: "約 45 分鐘",
  },
];

const HERO_IMG =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_480/v1785149281/copy_of_a_portrait_of_a_young_handsome_asian_male_plumbin-1785149206310_mmq04g.png";
const WHY_IMG =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_480/v1785149473/why_sv7tw9.png";
const IMG_RESIDENTIAL =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_640/v1785149431/home_sdyxhb.png";
const IMG_COMMERCIAL =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_640/v1785149532/bar_nccfy4.png";
const IMG_HYDROJET =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_640/v1785149597/2_edlrhp.png";
const IMG_CCTV =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:good,c_limit,w_640/v1785149606/3_olpvyt.png";
const ADVANTAGES = [
  {
    icon: BadgeCheck,
    title: "收費條款事前說明",
    desc: "明碼實價，收費事前說明",
  },
  { icon: Clock, title: "24 小時接受查詢", desc: "按地點及工作情況安排" },
  { icon: ScanEye, title: "CCTV 科技斷症", desc: "拒絕盲猜，精準定位" },
  { icon: Sparkles, title: "完工包清現場", desc: "極度注重衛生，企理無手尾" },
];

const WHY_GRID = [
  {
    icon: Droplets,
    title: "高壓水槍處理",
    desc: "極限水壓精準擊碎陳年頑固污垢",
  },
  {
    icon: Receipt,
    title: "明碼實價・透明收費",
    desc: "先報價後動工，動工前確認總價",
  },
  {
    icon: Timer,
    title: "24/7 全天候特快候命",
    desc: "港九新界特快到達為您解除危機",
  },
  {
    icon: Brush,
    title: "專業團隊・包清現場",
    desc: "拒絕烏煙瘴氣，承諾完工後徹底清理",
  },
];

const TRUST_POINTS = [
  {
    icon: FileCheck,
    title: "接納工程免檢查費",
    desc: "師傅先到場檢查；接納報價並進行工程，可豁免檢查費。",
  },
  {
    icon: HandCoins,
    title: "報價後才動工",
    desc: "師傅現場精確估價，雙方確認最終收費才開始施工。",
  },
  {
    icon: ShieldCheck,
    title: "費用事前說明",
    desc: "深夜附加費及其他費用會於動工前講明，確認最終總價才施工。",
  },
];

const HOME_SERVICES = [
  {
    icon: HomeIcon,
    img: IMG_RESIDENTIAL,
    title: "住宅通渠急救",
    sub: "塞廁所 / 企缸 / 廚房去水",
    desc: "24小時特快上門通渠，專治公屋、居屋及私人屋苑各類水管淤塞。採用專業手搖泵按情況疏通全屋去水位。極度注重衛生，完工包清理現場，絕不留手尾。",
    wa: "你好，我屋企塞渠，想查詢住宅通渠服務報價。",
  },
  {
    icon: Building2,
    img: IMG_COMMERCIAL,
    title: "食肆及商業通渠",
    sub: "隔油池 / 沙井 / 大廈主渠",
    desc: "專為香港食肆、商舖及物業管理提供重型通渠服務。配備大型吸車及工業級設備，迅速應對大型淤塞，深夜施工亦可，將對營業的影響減至最低。",
    wa: "你好，我想查詢食肆／商業通渠服務報價。",
  },
  {
    icon: Waves,
    img: IMG_HYDROJET,
    title: "高壓水槍洗渠",
    sub: "極限水壓粉碎陳年污垢",
    desc: "引入專業重型高壓水槍通渠車，以極限水壓徹底粉碎管壁硬化豬油膏、樹根及水泥沙石，深度清洗喉管處理管壁積聚污垢，按現場情況配合合適工具使用。",
    wa: "你好，我想查詢高壓水槍洗渠服務報價。",
  },
  {
    icon: Video,
    img: IMG_CCTV,
    title: "CCTV 照喉檢測",
    sub: "精準斷症，拒絕盲猜",
    desc: "微型高清防水鏡頭深入喉管內部，精準定位淤塞物及暗漏源頭。科學斷症，提供專業檢測報告，絕不屈客換喉，節省不必要開支。",
    wa: "你好，我想查詢 CCTV 照喉檢測服務報價。",
  },
];

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  alternateName: [BUSINESS_NAME, "DrainBear", "drainbearhk.com"],
  inLanguage: "zh-Hant-HK",
  publisher: {
    "@id": BUSINESS_ID,
  },
};

export default function Home() {
  const { posts: blogPosts } = useBlogPosts();
  const { phoneDisplay, phoneHref, whatsappHref } = useContactSettings();
  return (
    <div>
      <CmsPageSEO
        title="通渠熊 DrainBear｜24小時通渠公司・全港特快上門・收費條款事前說明"
        description="香港通渠救星！通渠熊專營24小時緊急通渠服務。配備德國高壓水槍洗渠及CCTV照喉技術，專治塞廁所、廚房星盆去水慢、企缸淤塞、食肆隔油池及大廈沙井。全港九新界特快上門，報價後動工，收費條款事前說明。"
        path="/"
        keywords="香港通渠, 24小時通渠, 通渠公司推薦, 塞廁所, 廚房通渠, 高壓水槍洗渠, CCTV照喉, 隔油池清理, 收費條款事前說明, 通渠收費"
        jsonLd={HOME_JSONLD}
      />
      {/* ===== 區塊 1：Hero ===== */}
      {/* PR18_MOBILE_HERO */}
      <section
        data-visual-section="home-hero"
        className="relative isolate overflow-hidden border-b border-border/70 bg-white"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 92% 12%, rgba(37,211,102,0.12), transparent 34%), linear-gradient(180deg, rgba(244,247,246,0.78), rgba(255,255,255,0) 68%)",
          }}
        />

        <div className="container grid items-center gap-9 pb-10 pt-9 sm:pt-12 md:gap-12 md:pb-16 md:pt-16 lg:min-h-[680px] lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="h-px w-8 bg-wagreen sm:w-10"
                aria-hidden="true"
              />
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-navy/65 sm:text-xs">
                香港專業通渠及喉管急救
              </span>
            </div>

            <h1 className="text-balance font-display text-[2.35rem] font-black leading-[1.05] tracking-[-0.035em] text-navy sm:text-5xl md:text-[3.45rem] lg:text-[4rem]">
              塞渠爆喉，
              <span className="mt-1 block text-wagreen-dark">唔使靠估。</span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground sm:text-base md:mt-6 md:text-lg md:leading-8">
              先了解現場情況，再安排合適師傅及設備。提供住宅、商業、高壓水槍洗渠及
              CCTV 照喉服務，報價確認後才動工。
            </p>

            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap sm:items-center md:mt-8">
              <a
                href={whatsappHref("你好，我想查詢通渠服務及初步報價。")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA("whatsapp", "home_hero");
                  goThanksAfterWhatsApp("home_hero");
                }}
                className="btn-smooth inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-wagreen px-6 py-3 text-sm font-black text-navy shadow-[0_8px_24px_rgba(37,211,102,0.2)] hover:bg-wagreen-dark sm:text-base"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.3} />
                WhatsApp 查詢報價
              </a>

              <a
                href={phoneHref}
                onClick={() => trackCTA("phone", "home_hero")}
                className="btn-smooth inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-navy/15 bg-white px-6 py-3 text-sm font-black text-navy hover:border-navy/35 hover:bg-mist sm:text-base"
              >
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.3} />
                致電 {phoneDisplay}
              </a>
            </div>

            <ul
              className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/80 pt-5 text-xs font-bold text-navy/70 sm:flex sm:flex-wrap sm:gap-x-6"
              aria-label="服務承諾"
            >
              <li className="flex items-center gap-2">
                <BadgeCheck
                  className="h-4 w-4 shrink-0 text-wagreen-dark"
                  aria-hidden="true"
                />
                報價後動工
              </li>
              <li className="flex items-center gap-2">
                <Clock
                  className="h-4 w-4 shrink-0 text-wagreen-dark"
                  aria-hidden="true"
                />
                24 小時可查詢
              </li>
              <li className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <MapPin
                  className="h-4 w-4 shrink-0 text-wagreen-dark"
                  aria-hidden="true"
                />
                覆蓋港九新界及離島
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none">
            <div
              className="absolute -inset-3 -z-10 rounded-[2rem] bg-wagreen/10 blur-2xl md:-inset-6"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-mist shadow-[0_22px_60px_rgba(11,19,43,0.14)] md:rounded-[2rem]">
              <img
                src={HERO_IMG}
                alt="通渠熊專業師傅準備通渠及喉管檢測設備"
                width={768}
                height={768}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/3] w-full object-cover object-top sm:aspect-[5/4] lg:aspect-[4/5]"
              />

              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/70 bg-white/92 p-4 shadow-[0_10px_30px_rgba(11,19,43,0.12)] backdrop-blur-md sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[250px]">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-wagreen">
                    <ScanEye
                      className="h-5 w-5"
                      strokeWidth={2.1}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-display text-sm font-black text-navy">
                      先判斷，再處理
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      按淤塞情況選用合適工具，減少不必要工程。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-3 -top-3 hidden h-20 w-20 rounded-full border border-wagreen/30 lg:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
      <ServiceQuickSelect />
      {/* ===== 區塊 2：暗色優勢列 ===== */}
      <section className="bg-navy">
        <div className="container grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-4">
          {ADVANTAGES.map((a, i) => (
            <div
              key={a.title}
              className="fade-up flex items-start gap-4"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/15">
                <a.icon className="h-6 w-6 text-wagreen" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display text-base font-bold text-white">
                  {a.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/55">
                  {a.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ===== 區塊 3：透明報價信任區塊 ===== */}
      <section className="dot-grid-light bg-white section-shell">
        <div className="container">
          <div className="reveal mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              OUR PROMISE
            </div>
            <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
              透明報價，安心動工
            </h2>
            <p className="mt-4 text-muted-foreground">
              我們堅持「接納工程免檢查費」及「報價後才動工」的承諾，讓每一次通渠服務都建立在清晰的收費與施工安排之上。
            </p>
            <Link
              href="/guide"
              className="btn-smooth mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen-dark hover:gap-2.5"
            >
              查看 2026 通渠收費指南 <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="mx-2 hidden text-border sm:inline">|</span>
            <Link
              href="/guide#calculator"
              className="btn-smooth mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-navy/70 hover:gap-2.5 hover:text-navy sm:mt-5"
            >
              試用即時估價計算機 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TRUST_POINTS.map((t, i) => (
              <div
                key={t.title}
                className="card-float card-accent reveal rounded-lg border border-border bg-white p-7 text-center"
                data-reveal-delay={i * 70}
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-wagreen/10 text-wagreen-dark">
                  <t.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="font-display text-lg font-bold text-navy">
                  {t.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== 區塊 4：為什麼選擇我們 ===== */}
      <section className="bg-mist py-20 md:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* 左：標題 + 2x2 網格 */}
          <div className="reveal">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
              WHY DRAINBEAR
            </div>
            <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              為什麼選擇通渠熊？
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              我們以科技與誠信重新定義通渠行業，每一次上門都是專業、透明、乾淨的服務體驗。
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {WHY_GRID.map(g => (
                <div
                  key={g.title}
                  className="card-float card-accent rounded-lg bg-white p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-wagreen">
                    <g.icon
                      className="h-5.5 w-5.5 h-[22px] w-[22px]"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 右：大圖 */}
          <div className="reveal relative" data-reveal-delay={120}>
            <div className="pointer-events-none absolute -inset-4 rounded-[20px] bg-gradient-to-br from-navy/8 to-wagreen/10 blur-xl" />
            <img
              src={WHY_IMG}
              alt="通渠熊團隊使用 CCTV 檢測設備"
              width={1200}
              height={896}
              loading="lazy"
              decoding="async"
              className="relative w-full rounded-2xl object-cover shadow-[0_20px_56px_rgba(11,19,43,0.18)]"
            />
            <div className="absolute -bottom-6 left-6 right-6 flex items-center justify-between rounded-lg bg-white/95 px-6 py-4 shadow-[0_12px_32px_rgba(11,19,43,0.15)] backdrop-blur md:left-10 md:right-auto md:gap-10">
              <div>
                <div className="font-display text-2xl font-black text-navy">
                  真實評價
                </div>
                <div className="text-xs text-muted-foreground">
                  Google 商家評價
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="font-display text-2xl font-black text-navy">
                  工程紀錄
                </div>
                <div className="text-xs text-muted-foreground">
                  實際工程紀錄
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== 區塊 5：四大服務卡（每卡獨立 WhatsApp CTA）===== */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="reveal flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
                OUR SERVICES
              </div>
              <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
                專業通渠服務
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                無論塞得幾嚴重，我們都有計。四大核心服務，覆蓋住宅至商業所有喉管危機。
              </p>
            </div>
            <Link
              href="/services"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:border-navy/30 hover:bg-mist"
            >
              查看全部服務
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_SERVICES.map((s, i) => (
              <article
                key={s.title}
                className="card-float card-accent reveal flex flex-col overflow-hidden rounded-lg border border-border bg-white"
                data-reveal-delay={i * 70}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={s.img}
                    alt={`${s.title}｜${s.sub}`}
                    width={1376}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-wagreen">
                    <s.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">
                    {s.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-safety">
                    {s.sub}
                  </p>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  <a
                    href={whatsappHref(s.wa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackCTA("whatsapp", "home_service_card", s.title);
                      goThanksAfterWhatsApp("home_service_card");
                    }}
                    className="btn-smooth mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-wagreen/10 px-4 py-2.5 text-sm font-bold text-wagreen-dark hover:bg-wagreen hover:text-navy"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
                    WhatsApp 查詢
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* ===== 區塊 5.5：真實工程案例 + Google 評價入口 ===== */}
      <section className="bg-mist section-shell">
        <div className="container">
          <div className="reveal max-w-xl">
            <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">
              CASE STUDIES
            </div>
            <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
              真實工程案例
            </h2>
            <p className="mt-3 text-muted-foreground">
              每一單都係白熊師傅親自落場。以下是近期完成的實際工程紀錄，收費全部出發前確認。
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CASE_STUDIES.map((c, i) => (
              <article
                key={c.title}
                className="card-float card-accent reveal flex flex-col rounded-lg border border-border bg-white p-7"
                data-reveal-delay={i * 70}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 text-[11px] font-bold text-white">
                    <MapPin
                      className="h-3 w-3 text-wagreen"
                      strokeWidth={2.5}
                    />
                    {c.area}
                  </span>
                  <span className="text-[11px] font-bold tracking-wide text-muted-foreground">
                    {c.type}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-black leading-snug text-navy">
                  {c.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <dt className="text-[11px] font-bold tracking-wide text-muted-foreground">
                      到達時間
                    </dt>
                    <dd className="mt-0.5 text-sm font-black text-navy">
                      {c.arrival}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold tracking-wide text-muted-foreground">
                      完工時間
                    </dt>
                    <dd className="mt-0.5 text-sm font-black text-navy">
                      {c.duration}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          {/* Google 評價入口（連結真實評價，不展示虛構評論） */}
          <div className="reveal mt-12 flex flex-col items-center justify-between gap-6 rounded-lg border border-border bg-white p-8 shadow-[0_4px_24px_rgba(11,19,43,0.06)] md:flex-row md:p-10">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-mist ring-1 ring-border">
                <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-black text-navy">
                    Google 商家評價
                  </span>
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-safety text-safety"
                        strokeWidth={0}
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  唔使聽我哋自賣自誇——直接去 Google
                  睇下街坊客戶嘅真實評價，或者幫襯完留低你嘅意見。
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href="https://www.google.com/maps/search/%E9%80%9A%E6%B8%A0%E7%86%8A+DrainBear"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-smooth inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-light"
              >
                查看 Google 評價 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ===== 區塊 6：通渠小知識精選 ===== */}
      <section className="bg-white section-shell">
        <div className="container">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">
                DRAIN CARE TIPS
              </div>
              <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
                通渠小知識
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                預防勝於治療。白熊師傅嘅實戰貼士，教你日常保養喉管，慳返通渠費。
              </p>
            </div>
            <Link
              href="/blog"
              className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-navy/15 px-5 py-2.5 text-sm font-bold text-navy hover:border-navy/35 hover:bg-navy hover:text-white"
            >
              查看全部文章 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card-float card-accent reveal group flex flex-col rounded-lg border border-border bg-white p-7"
                data-reveal-delay={i * 70}
              >
                <div className="inline-flex w-fit items-center rounded-full bg-mist px-3 py-1 text-[11px] font-bold tracking-wide text-navy/60">
                  {p.category}
                </div>
                <h3 className="mt-4 text-balance font-display text-lg font-black leading-snug text-navy transition-colors duration-200 group-hover:text-wagreen-dark">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.excerpt}
                </p>
                <span className="btn-smooth mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen-dark group-hover:gap-2.5">
                  閱讀全文 <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ===== CTA 收尾 ===== */}
      <section className="dot-grid bg-navy section-shell">
        <div className="container reveal text-center">
          <h2 className="text-balance font-display text-3xl font-black text-white md:text-4xl">
            渠道告急？白熊師傅隨時候命。
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            即時 WhatsApp 獲取初步報價，24 小時全天候特快上門，1
            小時內到達現場解除危機。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <WhatsAppButton
              className="px-8 py-4 text-base"
              label="WhatsApp 即時報價"
              trackLocation="home_footer_cta"
            />
            <a
              href={phoneHref}
              onClick={() => trackCTA("phone", "home_footer_cta")}
              className="btn-smooth inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-4 text-base font-bold text-white hover:border-white/45 hover:bg-white hover:text-navy"
            >
              <Phone
                className="h-4.5 w-4.5 h-[18px] w-[18px]"
                strokeWidth={2.2}
              />
              {phoneDisplay}
            </a>
          </div>
          <p className="mt-5 text-xs text-white/70">
            24 小時接受查詢・收費條款事前說明・按情況選用設備
          </p>
        </div>
      </section>
    </div>
  );
}
