/**
 * 通渠熊 DrainBear — Premium SaaS Minimalism
 * Header：Logo + 首頁/通渠服務/服務地區/常見問題 + 綠色「24hr 緊急報價」懸浮按鈕
 * Footer：橫向 4 組數據 + 公司資訊
 */
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MessageCircle, Phone, Clock, Star, Award, ShieldCheck } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, WA_DEFAULT } from "@/lib/contact";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useReveal } from "@/hooks/useReveal";

const LOGO = "/manus-storage/drainbear-logo_3d941447.png";

const NAV_ITEMS = [
  { label: "首頁", href: "/" },
  { label: "通渠服務", href: "/services" },
  { label: "收費指南", href: "/guide" },
  { label: "服務地區", href: "/areas" },
  { label: "通渠小知識", href: "/blog" },
  { label: "常見問題", href: "/faq" },
];

export function WhatsAppButton({ className = "", label = "24hr 緊急報價" }: { className?: string; label?: string }) {
  return (
    <a
      href={WA_DEFAULT}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-smooth inline-flex items-center gap-2 rounded-lg bg-wagreen px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:bg-wagreen-dark hover:shadow-[0_6px_24px_rgba(37,211,102,0.45)] ${className}`}
    >
      <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
      {label}
    </a>
  );
}

/** 行動裝置底部固定 CTA 列：WhatsApp + 電話直撥 */
function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-border bg-white shadow-[0_-4px_20px_rgba(11,19,43,0.12)] md:hidden">
      <a
        href={WA_DEFAULT}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-smooth flex items-center justify-center gap-2 bg-wagreen py-3.5 text-sm font-bold text-white"
      >
        <MessageCircle className="h-4.5 w-4.5 h-[18px] w-[18px]" strokeWidth={2.4} />
        WhatsApp 報價
      </a>
      <a
        href={PHONE_TEL}
        className="btn-smooth flex items-center justify-center gap-2 bg-navy py-3.5 text-sm font-bold text-white"
      >
        <Phone className="h-[18px] w-[18px]" strokeWidth={2.4} />
        致電師傅
      </a>
    </div>
  );
}

function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-[0_2px_16px_rgba(11,19,43,0.08)] backdrop-blur-xl" : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <div className="container flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5">
          <img src={LOGO} alt="通渠熊 DrainBear Logo" className="h-10 w-10 md:h-11 md:w-11" />
          <span className="font-display text-lg font-extrabold tracking-tight text-navy md:text-xl">
            通渠熊 <span className="text-wagreen">DrainBear</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`btn-smooth rounded-lg px-4 py-2 text-sm font-medium ${
                location === item.href
                  ? "bg-mist text-navy font-bold"
                  : "text-navy/70 hover:bg-mist hover:text-navy"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton />
        </div>

        <button
          className="btn-smooth rounded-lg p-2 text-navy md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="開啟選單"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 pb-5 pt-2 shadow-lg md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 text-base font-medium ${
                location === item.href ? "bg-mist font-bold text-navy" : "text-navy/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 px-4">
            <WhatsAppButton className="w-full justify-center" />
          </div>
        </div>
      )}
    </header>
  );
}

const FOOTER_STATS = [
  { icon: Award, value: "1000+", label: "成功案例" },
  { icon: Clock, value: "1 小時", label: "特快到達承諾" },
  { icon: Star, value: "98%", label: "客戶五星好評" },
  { icon: Phone, value: "24/7", label: "全天候緊急熱線" },
];

const FOOTER_AREAS = [
  {
    name: "港島區通渠",
    districts: "中環・半山・灣仔・銅鑼灣・北角・鰂魚涌・太古城・柴灣・香港仔・跑馬地",
  },
  {
    name: "九龍區通渠",
    districts: "尖沙咀・旺角・油麻地・深水埗・長沙灣・九龍城・土瓜灣・黃大仙・觀塘・九龍灣",
  },
  {
    name: "新界及離島通渠",
    districts: "沙田・大圍・大埔・粉嶺・上水・荃灣・葵涌・屯門・元朗・將軍澳・西貢・東涌",
  },
];

function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* 數據列 */}
      <div className="dot-grid border-b border-white/10">
        <div className="container grid grid-cols-2 gap-x-4 gap-y-10 py-12 md:grid-cols-4 md:gap-8 md:py-14">
          {FOOTER_STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                <s.icon className="h-5 w-5 text-wagreen" strokeWidth={2} />
              </span>
              <div className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO 地區連結區 */}
      <div className="border-b border-white/10">
        <div className="container grid gap-8 py-10 md:grid-cols-3">
          {FOOTER_AREAS.map((a) => (
            <div key={a.name}>
              <Link
                href="/areas"
                className="btn-smooth font-display text-sm font-bold text-white hover:text-wagreen"
              >
                {a.name}
              </Link>
              <p className="mt-2 text-xs leading-relaxed text-white/45">{a.districts}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex items-center gap-2.5">
          <img src={LOGO} alt="通渠熊 DrainBear" className="h-9 w-9 brightness-0 invert opacity-90" />
          <span className="font-display text-lg font-extrabold">通渠熊 DrainBear</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="btn-smooth hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <ShieldCheck className="h-4 w-4 text-wagreen" />
          不成功不收費・明碼實價
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        <a href={PHONE_TEL} className="btn-smooth hover:text-white">
          24 小時熱線：{PHONE_DISPLAY}
        </a>
        <span className="mx-2">|</span>© {new Date().getFullYear()} 通渠熊 DrainBear Limited.
        版權所有。專業排水工程團隊，香港島、九龍、新界全天候服務。
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 pb-14 pt-16 md:pb-0 md:pt-[72px]">{children}</main>
      <Footer />
      <MobileCTABar />
      <WhatsAppWidget />
    </div>
  );
}
