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
import { BLOG_POSTS } from "@/lib/blogData";
import SEO from "@/components/SEO";
import { PHONE_DISPLAY, PHONE_TEL, waLink } from "@/lib/contact";
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

const HERO_IMG = "/manus-storage/hero-plumber_aaa576bf.png";
const WHY_IMG = "/manus-storage/why-choose-us_3e335303.png";
const IMG_RESIDENTIAL = "/manus-storage/service-residential_e150660f.png";
const IMG_COMMERCIAL = "/manus-storage/service-commercial_04a25422.png";
const IMG_HYDROJET = "/manus-storage/service-hydrojet_a744b6de.png";
const IMG_CCTV = "/manus-storage/service-cctv_138076b0.png";

const ADVANTAGES = [
  { icon: BadgeCheck, title: "不成功不收費", desc: "明碼實價，絕不隱藏" },
  { icon: Clock, title: "24/7 特快到達", desc: "全天候港九極速救亡" },
  { icon: ScanEye, title: "CCTV 科技斷症", desc: "拒絕盲猜，精準定位" },
  { icon: Sparkles, title: "完工包清現場", desc: "極度注重衛生，企理無手尾" },
];

const WHY_GRID = [
  {
    icon: Droplets,
    title: "德國高壓水槍技術",
    desc: "極限水壓精準擊碎陳年頑固污垢",
  },
  {
    icon: Receipt,
    title: "明碼實價・透明收費",
    desc: "先報價後動工，絕不坐地起價",
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
    title: "上門檢查費全免",
    desc: "接納報價並進行工程，檢查費即時豁免，先斷症後決定。",
  },
  {
    icon: HandCoins,
    title: "報價後才動工",
    desc: "師傅現場精確估價，雙方確認最終收費才開始施工。",
  },
  {
    icon: ShieldCheck,
    title: "絕無隱藏費用",
    desc: "深夜附加費出發前講明，絕不坐地起價，收幾多講幾多。",
  },
];

const HOME_SERVICES = [
  {
    icon: HomeIcon,
    img: IMG_RESIDENTIAL,
    title: "住宅通渠急救",
    sub: "塞廁所 / 企缸 / 廚房去水",
    desc: "24 小時特快上門，極速打通全屋去水位。極度注重衛生，完工包清理現場，絕不留手尾。",
    wa: "你好，我屋企塞渠，想查詢住宅通渠服務報價。",
  },
  {
    icon: Building2,
    img: IMG_COMMERCIAL,
    title: "食肆及商業通渠",
    sub: "隔油池 / 沙井 / 大廈主渠",
    desc: "專為食肆及物業管理提供重型通渠，迅速應對大型淤塞，將對營業的影響減至最低。",
    wa: "你好，我想查詢食肆／商業通渠服務報價。",
  },
  {
    icon: Waves,
    img: IMG_HYDROJET,
    title: "高壓水槍洗渠",
    sub: "極限水壓粉碎陳年污垢",
    desc: "頂級重型高壓水槍車，徹底粉碎管壁硬化豬油膏及水泥沙石，深度清洗杜絕頻繁淤塞。",
    wa: "你好，我想查詢高壓水槍洗渠服務報價。",
  },
  {
    icon: Video,
    img: IMG_CCTV,
    title: "CCTV 照喉檢測",
    sub: "精準斷症，拒絕盲猜",
    desc: "微型高清鏡頭深入喉管內部，精準定位淤塞及暗漏源頭，提供專業報告，絕不屈客換喉。",
    wa: "你好，我想查詢 CCTV 照喉檢測服務報價。",
  },
];

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "通渠熊 DrainBear",
  url: "https://drainbear.manus.space",
  inLanguage: "zh-HK",
};

export default function Home() {
  return (
    <div>
      <SEO
        title="通渠熊 DrainBear｜24小時通渠公司・全港特快上門・不成功不收費"
        description="塞渠爆喉？搵通渠熊！香港 24 小時現代化通渠公司，德國高壓水槍配 CCTV 照喉，專治塞廁所、企缸、廚房去水、隔油池及沙井淤塞。明碼實價、1 小時特快到達、不成功不收費，服務覆蓋港九新界。"
        path="/"
        jsonLd={HOME_JSONLD}
      />
      {/* ===== 區塊 1：Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mist via-white to-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 30%, rgba(37,211,102,0.10) 0%, transparent 45%), radial-gradient(circle at 15% 75%, rgba(11,19,43,0.05) 0%, transparent 40%)",
          }}
        />
        <div className="container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
          {/* 左側文案 */}
          <div className="fade-up max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-wagreen/30 bg-wagreen/10 px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-wagreen-dark">
              <Star className="h-3.5 w-3.5" strokeWidth={2.5} />
              NEXT-GEN PLUMBING SOLUTIONS
            </div>
            <h1 className="text-balance font-display text-4xl font-black leading-[1.12] text-navy md:text-5xl lg:text-6xl">
              塞渠爆喉？
              <br />
              <span className="bg-gradient-to-r from-wagreen to-emerald-500 bg-clip-text text-transparent">
                一 Call 即到。
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              香港頂尖水管急救團隊，24 小時全天候候命。引進外國頂級高壓設備與 CCTV
              探測，明碼實價、極速到達、不成功不收費，服務覆蓋全港九新界。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <a
                href={waLink("你好，我想立即獲取通渠報價。")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCTA("whatsapp", "home_hero");
                  goThanksAfterWhatsApp("home_hero");
                }}
                className="btn-smooth inline-flex items-center justify-center gap-2 rounded-lg bg-wagreen px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)]"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
                WhatsApp 免費報價
              </a>
              <a
                href={PHONE_TEL}
                onClick={() => trackCTA("phone", "home_hero")}
                className="btn-smooth inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(11,19,43,0.25)] hover:bg-navy-light hover:shadow-[0_12px_32px_rgba(11,19,43,0.3)]"
              >
                <Phone className="h-4.5 w-4.5 h-[18px] w-[18px]" strokeWidth={2.2} />
                {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              先報價・後動工・不成功不收費・上門檢查費全免
            </p>
          </div>

          {/* 右側懸浮主圖 */}
          <div className="relative fade-up" style={{ animationDelay: "120ms" }}>
            <div className="absolute -inset-6 rounded-[24px] bg-gradient-to-tr from-wagreen/15 via-transparent to-navy/10 blur-2xl" />
            <div className="float-anim relative">
              <img
                src={HERO_IMG}
                alt="通渠熊專業師傅配備高壓通渠設備"
                className="w-full rounded-2xl object-cover shadow-[0_24px_64px_rgba(11,19,43,0.22)]"
              />
              <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-[0_12px_32px_rgba(11,19,43,0.15)] md:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-wagreen/12 text-wagreen">
                  <Clock className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="font-display text-sm font-extrabold text-navy">1 小時特快到達</div>
                  <div className="text-xs text-muted-foreground">全港 24 小時候命</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <h3 className="font-display text-base font-bold text-white">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/55">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 區塊 3：透明報價信任區塊 ===== */}
      <section className="dot-grid-light bg-white py-20 md:py-24">
        <div className="container">
          <div className="reveal mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">OUR PROMISE</div>
            <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
              透明報價，安心動工
            </h2>
            <p className="mt-4 text-muted-foreground">
              我們堅持「上門檢查費全免」及「報價後才動工」的承諾，讓每一次通渠服務都建立在絕對的信任與透明之上。
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
                <h3 className="font-display text-lg font-bold text-navy">{t.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
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
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">WHY DRAINBEAR</div>
            <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              為什麼選擇通渠熊？
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              我們以科技與誠信重新定義通渠行業，每一次上門都是專業、透明、乾淨的服務體驗。
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {WHY_GRID.map((g) => (
                <div
                  key={g.title}
                  className="card-float card-accent rounded-lg bg-white p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-wagreen">
                    <g.icon className="h-5.5 w-5.5 h-[22px] w-[22px]" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 右：大圖 */}
          <div className="reveal relative" data-reveal-delay={120}>
            <div className="absolute -inset-4 rounded-[20px] bg-gradient-to-br from-navy/8 to-wagreen/10 blur-xl" />
            <img
              src={WHY_IMG}
              alt="通渠熊團隊使用 CCTV 檢測設備"
              className="relative w-full rounded-2xl object-cover shadow-[0_20px_56px_rgba(11,19,43,0.18)]"
            />
            <div className="absolute -bottom-6 left-6 right-6 flex items-center justify-between rounded-lg bg-white/95 px-6 py-4 shadow-[0_12px_32px_rgba(11,19,43,0.15)] backdrop-blur md:left-10 md:right-auto md:gap-10">
              <div>
                <div className="font-display text-2xl font-black text-navy">98%</div>
                <div className="text-xs text-muted-foreground">客戶五星好評</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="font-display text-2xl font-black text-navy">1000+</div>
                <div className="text-xs text-muted-foreground">成功案例</div>
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
              <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">OUR SERVICES</div>
              <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
                專業通渠服務
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                無論塞得幾嚴重，我們都有計。四大核心服務，覆蓋住宅至商業所有喉管危機。
              </p>
            </div>
            <Link
              href="/services"
              className="btn-smooth inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:border-navy/30 hover:bg-mist"
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
                    className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-wagreen">
                    <s.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">{s.title}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-safety">{s.sub}</p>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  <a
                    href={waLink(s.wa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackCTA("whatsapp", "home_service_card", s.title);
                      goThanksAfterWhatsApp("home_service_card");
                    }}
                    className="btn-smooth mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-wagreen/10 px-4 py-2.5 text-sm font-bold text-wagreen-dark hover:bg-wagreen hover:text-white"
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
      <section className="bg-mist py-20 md:py-24">
        <div className="container">
          <div className="reveal max-w-xl">
            <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">CASE STUDIES</div>
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
                    <MapPin className="h-3 w-3 text-wagreen" strokeWidth={2.5} />
                    {c.area}
                  </span>
                  <span className="text-[11px] font-bold tracking-wide text-muted-foreground">
                    {c.type}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-black leading-snug text-navy">
                  {c.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <dt className="text-[11px] font-bold tracking-wide text-muted-foreground">到達時間</dt>
                    <dd className="mt-0.5 text-sm font-black text-navy">{c.arrival}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold tracking-wide text-muted-foreground">完工時間</dt>
                    <dd className="mt-0.5 text-sm font-black text-navy">{c.duration}</dd>
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
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-black text-navy">Google 商家評價</span>
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-safety text-safety" strokeWidth={0} />
                    ))}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  唔使聽我哋自賣自誇——直接去 Google 睇下街坊客戶嘅真實評價，或者幫襯完留低你嘅意見。
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
      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-xs font-bold tracking-[0.2em] text-safety">DRAIN CARE TIPS</div>
              <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
                通渠小知識
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                預防勝於治療。白熊師傅嘅實戰貼士，教你日常保養喉管，慳返通渠費。
              </p>
            </div>
            <Link
              href="/blog"
              className="btn-smooth inline-flex items-center gap-1.5 rounded-lg border border-navy/15 px-5 py-2.5 text-sm font-bold text-navy hover:border-navy/35 hover:bg-navy hover:text-white"
            >
              查看全部文章 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BLOG_POSTS.slice(0, 3).map((p, i) => (
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
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <span className="btn-smooth mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen-dark group-hover:gap-2.5">
                  閱讀全文 <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA 收尾 ===== */}
      <section className="dot-grid bg-navy py-20 md:py-24">
        <div className="container reveal text-center">
          <h2 className="text-balance font-display text-3xl font-black text-white md:text-4xl">
            渠道告急？白熊師傅隨時候命。
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            即時 WhatsApp 獲取初步報價，24 小時全天候特快上門，1 小時內到達現場解除危機。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <WhatsAppButton className="px-8 py-4 text-base" label="WhatsApp 即時報價" trackLocation="home_footer_cta" />
            <a
              href={PHONE_TEL}
              onClick={() => trackCTA("phone", "home_footer_cta")}
              className="btn-smooth inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-4 text-base font-bold text-white hover:border-white/45 hover:bg-white hover:text-navy"
            >
              <Phone className="h-4.5 w-4.5 h-[18px] w-[18px]" strokeWidth={2.2} />
              {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-5 text-xs text-white/45">
            24 小時全港到達・不成功不收費・德國專業設備
          </p>
        </div>
      </section>
    </div>
  );
}
