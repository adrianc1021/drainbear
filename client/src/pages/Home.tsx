/**
 * 通渠熊 DrainBear — 首頁
 * 區塊 1：Hero 左文右懸浮圖｜區塊 2：深海軍藍優勢列（4 欄）
 * 區塊 3：為什麼選擇我們（左 2x2 網格 + 右大圖）
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
} from "lucide-react";
import { WhatsAppButton } from "@/components/Layout";

const HERO_IMG = "/manus-storage/hero-plumber_aaa576bf.png";
const WHY_IMG = "/manus-storage/why-choose-us_3e335303.png";

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

export default function Home() {
  return (
    <div>
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
              水管急救，
              <br />
              <span className="bg-gradient-to-r from-wagreen to-emerald-500 bg-clip-text text-transparent">
                科技賦能。
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              全港最專業的現代化通渠團隊。引進外國頂級高壓設備與 CCTV
              探測，為住宅及商業客戶提供精準、無痛的喉管疏通體驗。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/85261234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-smooth inline-flex items-center gap-2 rounded-lg bg-navy px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(11,19,43,0.25)] hover:bg-navy-light hover:shadow-[0_12px_32px_rgba(11,19,43,0.3)]"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
                立即預約白熊師傅
              </a>
              <Link
                href="/services"
                className="btn-smooth inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-6 py-3.5 text-base font-semibold text-navy hover:border-navy/30 hover:bg-mist"
              >
                了解服務
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              先報價・後動工・不成功不收費
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

      {/* ===== 區塊 3：為什麼選擇我們 ===== */}
      <section className="bg-mist py-20 md:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* 左：標題 + 2x2 網格 */}
          <div>
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
                  className="card-float rounded-lg bg-white p-6"
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
          <div className="relative">
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

      {/* ===== CTA 收尾 ===== */}
      <section className="bg-white py-20 md:py-24">
        <div className="container text-center">
          <h2 className="text-balance font-display text-3xl font-black text-navy md:text-4xl">
            渠道告急？白熊師傅隨時候命。
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            即時 WhatsApp 獲取初步報價，24 小時全天候特快上門，1 小時內到達現場解除危機。
          </p>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton className="px-8 py-4 text-base" label="WhatsApp 即時報價" />
          </div>
        </div>
      </section>
    </div>
  );
}
