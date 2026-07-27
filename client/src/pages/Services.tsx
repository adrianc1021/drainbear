/**
 * 通渠熊 DrainBear — 專業服務
 * 區塊 1：Z-Pattern 交替圖文（四大服務）
 * 區塊 2：4 步解除危機（橫向流程圖）
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
} from "lucide-react";
import { WhatsAppButton } from "@/components/Layout";

const SERVICES = [
  {
    icon: HomeIcon,
    tag: "RESIDENTIAL",
    title: "住宅通渠急救",
    desc: "針對一般家庭的廚房星盆、浴室去水位及座廁淤塞，專業手搖泵極速打通，過程注重家居保護，完工包清理，還原企理現場。",
    img: "/manus-storage/service-residential_f3e50e1c.png",
  },
  {
    icon: Building2,
    tag: "COMMERCIAL",
    title: "商業重型通渠",
    desc: "專治食肆隔油池爆滿、大廈主渠倒灌等重型工程。配備工業級設備及大型吸車，將營業損失減至最低，深夜施工亦可安排。",
    img: "/manus-storage/service-commercial_4fc05340.png",
  },
  {
    icon: Waves,
    tag: "HYDRO JETTING",
    title: "高壓水槍洗渠",
    desc: "引進頂級高壓水槍車，以極限水壓將硬化油垢、水泥及陳年污垢徹底粉碎沖走，令喉管回復暢通如新，效果遠勝傳統通渠方法。",
    img: "/manus-storage/service-hydrojet_20c6c68d.png",
  },
  {
    icon: Video,
    tag: "CCTV INSPECTION",
    title: "CCTV 照喉檢測",
    desc: "高清防水鏡頭深入喉管探測，精準定位淤塞物及破損位置，科學斷症、有片有真相，杜絕盲猜式維修及不必要的換喉工程。",
    img: "/manus-storage/service-cctv_595f666d.png",
  },
];

const STEPS = [
  {
    icon: MessageCircle,
    step: "01",
    title: "WhatsApp 報價",
    desc: "即時獲取初步報價",
  },
  {
    icon: Search,
    step: "02",
    title: "特快上門檢查",
    desc: "精準評估確認最終收費",
  },
  {
    icon: Wrench,
    step: "03",
    title: "專業施工",
    desc: "確認報價後立即動工",
  },
  {
    icon: Sparkles,
    step: "04",
    title: "清理現場",
    desc: "完工測試去水，徹底清潔",
  },
];

export default function Services() {
  return (
    <div>
      {/* 頁首 */}
      <section className="bg-gradient-to-b from-mist to-white py-16 md:py-20">
        <div className="container text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">OUR SERVICES</div>
          <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
            專業通渠服務
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            由家居急救到商業重型工程，通渠熊以現代化設備與科學方法，精準解決每一種渠務危機。
          </p>
        </div>
      </section>

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
                  className={`absolute -inset-4 rounded-[20px] blur-xl ${
                    i % 2 === 0
                      ? "bg-gradient-to-br from-navy/8 to-wagreen/10"
                      : "bg-gradient-to-bl from-wagreen/10 to-navy/8"
                  }`}
                />
                <img
                  src={s.img}
                  alt={s.title}
                  className="relative w-full rounded-2xl object-cover shadow-[0_16px_48px_rgba(11,19,43,0.16)]"
                />
              </div>
              {/* 文 */}
              <div className={i % 2 === 1 ? "lg:pr-8" : "lg:pl-8"}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-mist px-4 py-1.5 text-xs font-bold tracking-[0.15em] text-navy/60">
                  <s.icon className="h-3.5 w-3.5 text-wagreen" strokeWidth={2.5} />
                  {s.tag}
                </div>
                <h2 className="font-display text-2xl font-black text-navy md:text-3xl">{s.title}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{s.desc}</p>
                <a
                  href="https://wa.me/85261234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-smooth mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen-dark hover:gap-2.5"
                >
                  立即查詢報價
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 區塊 2：4 步解除危機 */}
      <section className="bg-navy py-20 md:py-24">
        <div className="container">
          <div className="text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-wagreen">HOW IT WORKS</div>
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
            {STEPS.map((st) => (
              <div key={st.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/20 backdrop-blur">
                  <st.icon className="h-7 w-7 text-wagreen" strokeWidth={2} />
                </div>
                <div className="mt-4 font-display text-xs font-extrabold tracking-[0.25em] text-safety">
                  STEP {st.step}
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-white">{st.title}</h3>
                <p className="mt-1.5 text-sm text-white/55">{st.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <WhatsAppButton className="px-8 py-4 text-base" label="立即開始第一步" />
          </div>
        </div>
      </section>
    </div>
  );
}
