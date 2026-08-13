/**
 * 通渠熊 DrainBear — Hong Kong Industrial Editorial
 * Header：清晰品牌導覽 + 克制的 WhatsApp 行動入口
 * Footer：服務資訊、主要地區與公司資料
 */
import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  MessageCircle,
  Phone,
  Clock,
  Star,
  Award,
  ShieldCheck,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import {
  trackCTA,
  goThanksAfterWhatsApp,
  trackNavClick,
} from "@/lib/analytics";
import { useEstimate } from "@/contexts/EstimateContext";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useReveal } from "@/hooks/useReveal";
import { useContactSettings } from "@/contexts/SiteSettingsContext";

const LOGO =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:eco,c_fill,w_96,h_96/v1785147037/LOGO_dmyalo.png";

const NAV_ITEMS = [
  { label: "首頁", href: "/" },
  { label: "通渠服務", href: "/services" },
  { label: "收費指南", href: "/guide" },
  { label: "服務地區", href: "/areas" },
  { label: "通渠小知識", href: "/blog" },
  { label: "常見問題", href: "/faq" },
];

export function WhatsAppButton({
  className = "",
  label = "WhatsApp 查詢",
  trackLocation = "shared_button",
}: {
  className?: string;
  label?: string;
  trackLocation?: string;
}) {
  const { whatsappDefaultHref } = useContactSettings();

  return (
    <a
      href={whatsappDefaultHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackCTA("whatsapp", trackLocation);
        goThanksAfterWhatsApp(trackLocation);
      }}
      className={`btn-smooth inline-flex min-h-12 items-center justify-center gap-2 border border-navy bg-wagreen px-5 py-2.5 text-sm font-black tracking-[-0.01em] text-navy transition-colors hover:bg-navy hover:text-white ${className}`}
    >
      <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
      {label}
    </a>
  );
}

/**
 * 行動裝置底部固定 CTA：
 * - WhatsApp 為主 CTA（約 75% 闊度）
 * - 電話為精簡次要 CTA
 * - 支援 iPhone safe area
 * - 向下捲動時收起，向上捲動或接近頁底時重現
 */
function MobileCTABar() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { estimate } = useEstimate();
  const { phoneDisplay, phoneHref, whatsappDefaultHref, whatsappHref } =
    useContactSettings();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom =
        window.innerHeight + y >= document.body.scrollHeight - 160;
      // 向下捲超過 12px 才收起，向上捲、頁頂或近頁底即重現
      if (nearBottom || y < 80 || y < lastY.current - 4) {
        setHidden(false);
      } else if (y > lastY.current + 12) {
        setHidden(true);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waHref = estimate
    ? whatsappHref(estimate.waMessage)
    : whatsappDefaultHref;
  const waTitle = estimate ? "發送估價詳情" : "WhatsApp 報價";
  const waSub = estimate
    ? `已附上估價 HK$${estimate.low.toLocaleString()}–${estimate.high.toLocaleString()}`
    : "提供問題資料・方便跟進";

  return (
    <div
      data-mobile-cta="true"
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-navy/15 bg-white/96 backdrop-blur-xl transition-transform duration-200 md:hidden ${
        hidden ? "pointer-events-none translate-y-full" : "translate-y-0"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 18px rgba(11,19,43,0.09)",
      }}
    >
      <div className="flex items-stretch gap-2 px-3 py-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackCTA(
              "whatsapp",
              "mobile_bar",
              estimate ? `estimate_${estimate.low}-${estimate.high}` : undefined
            );
            goThanksAfterWhatsApp("mobile_bar");
          }}
          className="btn-smooth flex min-h-[54px] flex-[3] items-center justify-center gap-2.5 border border-navy bg-wagreen px-3 py-2 text-navy active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2.4} />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[15px] font-bold">{waTitle}</span>
            <span className="max-w-[16rem] truncate text-[10.5px] font-medium text-navy/75">
              {waSub}
            </span>
          </span>
        </a>
        <a
          href={phoneHref}
          onClick={() => trackCTA("phone", "mobile_bar")}
          className="btn-smooth flex min-h-[54px] flex-1 items-center justify-center gap-1.5 border border-navy bg-navy px-2 py-2 text-white active:scale-[0.98]"
        >
          <Phone className="h-[18px] w-[18px] shrink-0" strokeWidth={2.4} />
          <span className="text-[15px] font-bold">致電</span>
        </a>
      </div>
    </div>
  );
}

/**
 * 回到頂部懸浮按鈕：
 * - 捲動超過 600px 後淡入，點擊平滑捲回頂部
 * - 手機版位置避開底部 CTA 列與 WhatsApp 懸浮鈕
 * - 桌面版置於 WhatsApp 懸浮鈕上方
 */
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="回到頂部"
      className={`btn-smooth fixed right-4 z-40 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white/95 text-navy shadow-[0_4px_14px_rgba(11,19,43,0.11)] backdrop-blur transition-all duration-300 hover:bg-mist active:scale-[0.94] md:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      } bottom-[150px] md:bottom-[104px]`}
      style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}

function Header({
  hideConversionCTA = false,
}: {
  hideConversionCTA?: boolean;
}) {
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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      data-site-header="true"
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? "border-navy/15 bg-white/96 shadow-[0_8px_30px_rgba(11,19,43,0.06)] backdrop-blur-xl"
          : "border-navy/10 bg-white/90 backdrop-blur-lg"
      }`}
    >
      <div className="container flex h-16 items-center justify-between md:h-[72px]">
        <Link
          href="/"
          aria-label="通渠熊 DrainBear 首頁"
          className="flex items-center gap-2.5"
        >
          <img
            src={LOGO}
            alt="通渠熊 DrainBear Logo"
            className="h-10 w-10 md:h-11 md:w-11"
          />
          <span className="font-display text-lg font-black tracking-[-0.025em] text-navy md:text-xl">
            通渠熊 <span className="text-navy/55">DrainBear</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() =>
                trackNavClick("navigation", {
                  cta_location: "header",
                  cta_label: item.label,
                  destination_url: item.href,
                })
              }
              className={`btn-smooth relative inline-flex min-h-11 items-center px-3 text-sm font-bold transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:transition-transform ${
                location === item.href
                  ? "text-navy after:scale-x-100 after:bg-safety"
                  : "text-navy/65 after:scale-x-0 after:bg-navy hover:text-navy hover:after:scale-x-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {!hideConversionCTA ? (
          <div data-header-whatsapp="true" className="hidden md:block">
            <WhatsAppButton className="rounded-none" trackLocation="header" />
          </div>
        ) : null}

        <button
          className="btn-smooth -mr-2 flex h-12 w-12 items-center justify-center rounded-lg text-navy hover:bg-mist md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border/80 bg-white px-5 pb-5 pt-3 shadow-[0_12px_28px_rgba(11,19,43,0.09)] md:hidden"
        >
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() =>
                trackNavClick("navigation", {
                  cta_location: "mobile_menu",
                  cta_label: item.label,
                  destination_url: item.href,
                })
              }
              className={`flex min-h-12 items-center rounded-lg px-4 py-3 text-base font-medium ${
                location === item.href
                  ? "bg-mist font-bold text-navy"
                  : "text-navy/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {!hideConversionCTA ? (
            <div data-mobile-menu-whatsapp="true" className="mt-3 px-4">
              <WhatsAppButton
                className="w-full justify-center rounded-none"
                trackLocation="mobile_menu"
              />
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
}

const FOOTER_STATS = [
  { icon: Award, value: "先報價", label: "動工前確認收費" },
  { icon: Clock, value: "按安排", label: "確認上門時間" },
  { icon: Star, value: "專業設備", label: "按實際情況選用" },
  { icon: Phone, value: "24 小時", label: "接受渠務查詢" },
];

const FOOTER_AREAS = [
  {
    name: "港島主要服務地區",
    districts:
      "中環・上環・西營盤・石塘咀・堅尼地城・半山・山頂・金鐘・灣仔・銅鑼灣・天后・大坑・跑馬地・北角・炮台山・鰂魚涌・太古城・西灣河・筲箕灣・柴灣・小西灣・香港仔・田灣・華富・鴨脷洲・黃竹坑・薄扶林・赤柱・淺水灣",
  },
  {
    name: "九龍主要服務地區",
    districts:
      "尖沙咀・佐敦・油麻地・旺角・太子・大角咀・深水埗・長沙灣・荔枝角・美孚・石硤尾・九龍塘・何文田・紅磡・黃埔・土瓜灣・九龍城・啟德・新蒲崗・黃大仙・樂富・鑽石山・慈雲山・彩虹・牛頭角・九龍灣・觀塘・秀茂坪・藍田・油塘",
  },
  {
    name: "新界及離島主要服務地區",
    districts:
      "沙田・大圍・火炭・石門・馬鞍山・大埔・太和・粉嶺・上水・荃灣・葵涌・葵芳・青衣・深井・馬灣・屯門・掃管笏・元朗・天水圍・錦田・洪水橋・將軍澳・寶琳・坑口・調景嶺・日出康城・西貢・清水灣・東涌・愉景灣・梅窩・長洲・南丫島・坪洲",
  },
];

function FooterAreaAccordion({
  area,
  index,
}: {
  area: (typeof FOOTER_AREAS)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `footer-area-panel-${index}`;

  return (
    <section className="border-b border-white/10 py-1 last:border-b-0 md:border-0 md:py-0">
      <button
        type="button"
        className="flex min-h-[52px] w-full items-center justify-between gap-4 py-2 text-left font-display text-sm font-bold text-white md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(current => !current)}
      >
        <span>{area.name}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-wagreen transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <Link
        href="/areas"
        className="btn-smooth hidden min-h-[44px] items-center font-display text-sm font-bold text-white hover:text-wagreen md:inline-flex"
      >
        {area.name}
      </Link>

      <div
        id={panelId}
        className={`${open ? "block" : "hidden"} pb-4 md:block md:pb-0`}
      >
        <p className="text-xs leading-relaxed text-white/70 md:mt-2">
          {area.districts}
        </p>

        <Link
          href="/areas"
          className="mt-3 inline-flex min-h-[44px] items-center text-xs font-bold text-wagreen hover:text-white md:hidden"
        >
          查看完整服務地區
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  const { phoneDisplay, phoneHref } = useContactSettings();

  return (
    <footer data-site-footer="true" className="bg-[#080f22] text-white">
      {/* 數據列 */}
      <div className="dot-grid border-b border-white/10">
        <div className="container grid grid-cols-2 gap-x-4 gap-y-10 py-12 md:grid-cols-4 md:gap-8 md:py-14">
          {FOOTER_STATS.map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center"
            >
              <span className="mb-3 inline-flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.03]">
                <s.icon className="h-5 w-5 text-wagreen" strokeWidth={2} />
              </span>
              <div className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO 地區連結區 */}
      <div className="border-b border-white/10">
        <div className="container py-2 md:grid md:grid-cols-3 md:gap-8 md:py-10">
          {FOOTER_AREAS.map((area, index) => (
            <FooterAreaAccordion key={area.name} area={area} index={index} />
          ))}
        </div>
      </div>

      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex items-center gap-2.5">
          <img
            src={LOGO}
            alt="通渠熊 DrainBear"
            className="h-9 w-9 brightness-0 invert opacity-90"
          />
          <span className="font-display text-lg font-extrabold">
            通渠熊 DrainBear
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="btn-smooth inline-flex min-h-[44px] items-center px-1 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <ShieldCheck className="h-4 w-4 text-wagreen" />
          先報價・動工前確認總價
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/70">
        <a
          href={phoneHref}
          onClick={() => trackCTA("phone", "footer")}
          className="btn-smooth inline-flex min-h-[44px] items-center px-2 hover:text-white"
        >
          24 小時查詢：{phoneDisplay}
        </a>
        <span className="mx-2">|</span>© {new Date().getFullYear()} 通渠熊
        DrainBear Limited.
        版權所有。提供港島、九龍、新界及離島渠務查詢；服務安排按所在地點、交通及工具運送情況確認。
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <p className="shrink-0 text-xs font-bold tracking-[0.14em] text-white/55">
              熱門地區
            </p>
            <nav
              aria-label="熱門通渠服務地區"
              className="flex flex-wrap gap-x-4 gap-y-2"
            >
              {[
                { label: "觀塘通渠", href: "/areas/kwun-tong" },
                { label: "沙田通渠", href: "/areas/sha-tin" },
                { label: "旺角通渠", href: "/areas/mong-kok" },
                { label: "深水埗通渠", href: "/areas/sham-shui-po" },
                { label: "銅鑼灣通渠", href: "/areas/causeway-bay" },
                { label: "北角通渠", href: "/areas/north-point" },
                { label: "荃灣通渠", href: "/areas/tsuen-wan" },
                { label: "屯門通渠", href: "/areas/tuen-mun" },
                { label: "元朗通渠", href: "/areas/yuen-long" },
                { label: "將軍澳通渠", href: "/areas/tseung-kwan-o" },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    trackNavClick("area", {
                      cta_location: "footer_popular_areas",
                      cta_label: item.label,
                      area_name: item.label.replace("通渠", ""),
                      destination_url: item.href,
                    })
                  }
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const pathname = location.split(/[?#]/)[0] || "/";
  const suppressConversionChrome = pathname === "/thanks";

  useReveal();

  useEffect(() => {
    // 支援 hash 錨點（如 /guide#calculator）：有錨點時捲至該區塊，否則回頁頂
    const hash = window.location.hash;
    if (hash) {
      // 等待目標頁面渲染完成後再捲動
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header hideConversionCTA={suppressConversionChrome} />
      <main id="main-content" className="flex-1 pt-16 md:pt-[72px]">
        {children}
      </main>
      <Footer />
      {!suppressConversionChrome ? (
        <>
          {/* 避免內容及 Footer 被固定 CTA 列遮蓋（含 safe-area） */}
          <div
            className="pointer-events-none h-[68px] md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            aria-hidden="true"
          />
          <MobileCTABar />
          <WhatsAppWidget />
          <BackToTop />
        </>
      ) : null}
    </div>
  );
}
