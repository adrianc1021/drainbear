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
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import {
  trackCTA,
  goThanksAfterWhatsApp,
  trackNavClick,
} from "@/lib/analytics";
import { useContactHandoff } from "@/contexts/ContactHandoffContext";
import { useReveal } from "@/hooks/useReveal";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { prefetchRoute } from "@/lib/routePrefetch";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { DISTRICTS } from "@/lib/districtData";
import { SERVICE_PAGES } from "@/lib/serviceData";

const LOGO =
  "https://res.cloudinary.com/pgjztf2p/image/upload/f_auto,q_auto:eco,c_fill,w_96,h_96/v1785147037/LOGO_dmyalo.png";

const NAV_ITEMS = [
  { label: "首頁", href: "/" },
  { label: "通渠服務", href: "/services" },
  { label: "問題判斷", href: "/drain-diagnosis" },
  { label: "收費指南", href: "/guide" },
  { label: "服務地區", href: "/areas" },
  { label: "工程案例", href: "/cases" },
  { label: "通渠小知識", href: "/blog" },
  { label: "常見問題", href: "/faq" },
];

function isNavItemActive(location: string, href: string) {
  return location === href || (href !== "/" && location.startsWith(`${href}/`));
}

const FOOTER_NAV_ITEMS = [
  ...NAV_ITEMS,
  { label: "服務流程", href: "/service-process" },
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
      <span>{label}</span>
    </a>
  );
}

/**
 * 行動裝置底部固定 CTA：
 * - WhatsApp 為主 CTA（約 75% 闊度）
 * - 電話為精簡次要 CTA
 * - 支援 iPhone safe area
 * - 全程固定顯示，讓緊急服務 CTA 在任何閱讀位置都可見
 */
function MobileCTABar() {
  const { diagnosis } = useContactHandoff();
  const { phoneDisplay, phoneHref, whatsappDefaultHref, whatsappHref } =
    useContactSettings();

  const waHref = diagnosis
    ? whatsappHref(diagnosis.waMessage)
    : whatsappDefaultHref;
  const waTitle = diagnosis ? "發送判斷結果" : "WhatsApp 報價";
  const waSub = diagnosis
    ? diagnosis.summary
    : "傳送位置及相片・加快初步判斷";

  return (
    <>
      <div
        className="mobile-cta-spacer pointer-events-none md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-hidden="true"
      />
      <div
        data-mobile-cta="true"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/15 bg-white/96 backdrop-blur-xl md:hidden"
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
            aria-label={`${waTitle}：${waSub}`}
            onClick={() => {
              trackCTA(
                "whatsapp",
                "mobile_bar",
                diagnosis?.topic
              );
              goThanksAfterWhatsApp("mobile_bar");
            }}
            className="btn-smooth flex min-h-[56px] min-w-0 flex-[3] items-center justify-center gap-2.5 border border-navy bg-wagreen px-3 py-2 text-navy active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2.4} />
            <span className="min-w-0 flex flex-col items-start leading-tight">
              <span className="text-[15px] font-bold">{waTitle}</span>
              <span className="max-w-full truncate text-[10.5px] font-medium text-navy/75">
                {waSub}
              </span>
            </span>
          </a>
          <a
            href={phoneHref}
            aria-label={`致電 ${phoneDisplay}`}
            onClick={() => trackCTA("phone", "mobile_bar")}
            className="btn-smooth flex min-h-[56px] flex-1 items-center justify-center gap-1.5 border border-navy bg-navy px-2 py-2 text-white active:scale-[0.98]"
          >
            <Phone className="h-[18px] w-[18px] shrink-0" strokeWidth={2.4} />
            <span className="text-[15px] font-bold">致電</span>
          </a>
        </div>
      </div>
    </>
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
      } bottom-[calc(4.75rem+1rem+env(safe-area-inset-bottom))] md:bottom-[104px]`}
      style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}

function DeferredDesktopWhatsAppWidget() {
  return <WhatsAppWidget />;
}

function Header({
  hideConversionCTA = false,
}: {
  hideConversionCTA?: boolean;
}) {
  const [location] = useLocation();
  const isHome = location === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuWasOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) {
      if (mobileMenuWasOpenRef.current) {
        menuButtonRef.current?.focus();
      }

      mobileMenuWasOpenRef.current = false;
      return;
    }

    mobileMenuWasOpenRef.current = true;

    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      firstMobileLinkRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        mobileNavigationRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter(element => {
        const style = window.getComputedStyle(element);

        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          !element.hasAttribute("inert")
        );
      });

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      data-site-header="true"
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
        "site-header--shared"
      } ${isHome && scrolled ? "site-header--home-scrolled" : ""} ${
        scrolled
          ? "border-navy/15 bg-white/96 shadow-[0_8px_30px_rgba(11,19,43,0.06)] backdrop-blur-xl"
          : "border-navy/10 bg-white/90 backdrop-blur-lg"
      }`}
    >
      <div className="site-header__row container flex h-16 items-center justify-between md:h-[72px]">
        <Link
          href="/"
          aria-label="通渠熊 DrainBear 首頁"
          data-site-brand="header"
          className="site-header__brand flex min-h-11 min-w-0 items-center gap-2.5"
        >
          <img
            src={LOGO}
            alt="通渠熊 DrainBear Logo"
            width="96"
            height="96"
            className="h-10 w-10 md:h-11 md:w-11"
          />
          <span className="site-header__brand-text font-display text-lg font-black tracking-[-0.025em] text-navy md:text-xl">
            通渠熊{" "}
            <span className="site-header__brand-en text-navy/55">
              DrainBear
            </span>
          </span>
        </Link>

        <nav
          aria-label="主要導覽"
          className="site-header__desktop-nav hidden min-w-0 items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => prefetchRoute(item.href)}
              onFocus={() => prefetchRoute(item.href)}
              onTouchStart={() => prefetchRoute(item.href)}
              onClick={() =>
                trackNavClick("navigation", {
                  cta_location: "header",
                  cta_label: item.label,
                  destination_url: item.href,
                })
              }
              aria-current={
                isNavItemActive(location, item.href) ? "page" : undefined
              }
              className={`site-header__nav-link btn-smooth relative inline-flex min-h-11 items-center px-3 text-sm font-bold transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:transition-transform ${
                isNavItemActive(location, item.href)
                  ? "text-navy after:scale-x-100 after:bg-safety"
                  : "text-navy/65 after:scale-x-0 after:bg-navy hover:text-navy hover:after:scale-x-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {!hideConversionCTA ? (
          <div
            data-header-whatsapp="true"
            className="site-header__whatsapp hidden md:block"
          >
            <WhatsAppButton className="rounded-none" trackLocation="header" />
          </div>
        ) : null}

        <button
          ref={menuButtonRef}
          data-mobile-menu-trigger="true"
          className="btn-smooth -mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-navy hover:bg-mist md:hidden"
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
          ref={mobileNavigationRef}
          id="mobile-navigation"
          data-mobile-navigation="true"
          role="dialog"
          aria-modal="true"
          aria-label="手機導覽選單"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border/80 bg-white px-5 pb-5 pt-3 shadow-[0_12px_28px_rgba(11,19,43,0.09)] md:hidden"
        >
          {NAV_ITEMS.map((item, index) => (
            <Link
              ref={index === 0 ? firstMobileLinkRef : undefined}
              data-mobile-nav-link="true"
              key={item.href}
              href={item.href}
              aria-current={
                isNavItemActive(location, item.href) ? "page" : undefined
              }
              onClick={() =>
                trackNavClick("navigation", {
                  cta_location: "mobile_menu",
                  cta_label: item.label,
                  destination_url: item.href,
                })
              }
              className={`flex min-h-12 items-center rounded-lg px-4 py-3 text-base font-medium ${
                isNavItemActive(location, item.href)
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

function Footer({ compact = false }: { compact?: boolean }) {
  const { phoneDisplay, phoneHref, whatsappDefaultHref } = useContactSettings();

  return (
    <footer data-site-footer="true" className="db-site-footer text-white">
      {!compact ? (
        <section
          className="db-site-footer__action"
          aria-labelledby="footer-action-heading"
        >
          <div className="db-container">
            <div className="db-site-footer__brandline">
              <div className="db-site-footer__brand">
                <img
                  src={LOGO}
                  alt="通渠熊 DrainBear"
                  width="96"
                  height="96"
                  loading="lazy"
                />
                <span>通渠熊 DrainBear</span>
              </div>
              <span className="db-site-footer__brand-context">
                香港住宅及商業渠務
              </span>
            </div>

            <div className="db-site-footer__action-grid">
              <div>
                <p className="db-site-footer__eyebrow">現場資料先行</p>
                <h2 id="footer-action-heading">
                  先說明問題，
                  <br />
                  再安排合適處理。
                </h2>
                <p className="db-site-footer__action-copy">
                  提供所在地區、受影響位置及相片或短片，團隊先了解情況，再確認可安排的服務時間及後續方案。
                </p>
              </div>

              <div className="db-site-footer__action-controls">
                <a
                  href={whatsappDefaultHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCTA("whatsapp", "footer_action");
                    goThanksAfterWhatsApp("footer_action");
                  }}
                  className="db-site-footer__primary-action"
                >
                  <MessageCircle aria-hidden="true" />
                  <span>WhatsApp 查詢報價</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <a
                  href={phoneHref}
                  onClick={() => trackCTA("phone", "footer_action")}
                  className="db-site-footer__secondary-action"
                >
                  <Phone aria-hidden="true" />
                  <span>24 小時查詢：{phoneDisplay}</span>
                </a>
                <p className="db-site-footer__action-note">
                  <ShieldCheck aria-hidden="true" />
                  動工前確認處理方法及收費
                </p>
              </div>
            </div>

            <div className="db-site-footer__signals" aria-label="服務安排原則">
              {FOOTER_STATS.map(s => (
                <div key={s.label} className="db-site-footer__signal">
                  <s.icon aria-hidden="true" />
                  <span>
                    <strong>{s.value}</strong>
                    <small>{s.label}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="db-site-footer__directory" aria-label="網站導覽">
        <div className="db-container db-site-footer__directory-grid">
          <div className="db-site-footer__directory-intro">
            <p className="db-site-footer__eyebrow">DrainBear / 服務目錄</p>
            <h2>
              由問題判斷，
              <br />
              到現場安排。
            </h2>
            <p>
              探索通渠服務、收費指南、問題判斷及各區服務資料，先整理需要，再提出查詢。
            </p>
          </div>

          <div className="db-site-footer__nav-group">
            <p className="db-site-footer__nav-label">服務及工具</p>
            <nav aria-label="服務及查詢工具">
              <Link href="/services">
                全部通渠服務
                <ArrowUpRight aria-hidden="true" />
              </Link>
              {SERVICE_PAGES.map(service => (
                <Link key={service.slug} href={`/services/${service.slug}`}>
                  {service.shortName}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
              {FOOTER_NAV_ITEMS.slice(2, 4).map(item => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="db-site-footer__nav-group">
            <p className="db-site-footer__nav-label">網站及資料</p>
            <nav aria-label="網站內容及資料">
              {FOOTER_NAV_ITEMS.slice(4).map(item => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
              <Link href="/drain-diagnosis">
                問題判斷工具
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </div>
      </section>

      {!compact ? (
        <section
          className="db-site-footer__areas"
          aria-labelledby="footer-areas-heading"
        >
          <div className="db-container">
            <div className="db-site-footer__areas-heading">
              <div>
                <p className="db-site-footer__eyebrow">服務地區</p>
                <h2 id="footer-areas-heading">
                  港九新界及離島，按位置確認安排。
                </h2>
              </div>
              <Link href="/areas" className="db-site-footer__text-link">
                查看完整地區資料
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="db-site-footer__area-grid">
              {FOOTER_AREAS.map((area, index) => (
                <FooterAreaAccordion
                  key={area.name}
                  area={area}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!compact ? (
        <section
          className="db-site-footer__popular"
          aria-labelledby="footer-popular-heading"
        >
          <div className="db-container">
            <div className="db-site-footer__popular-heading">
              <p id="footer-popular-heading">熱門地區</p>
              <nav aria-label="熱門通渠服務地區">
                {DISTRICTS.map(district => {
                  const item = {
                    label: `${district.name}通渠`,
                    href: `/areas/${district.slug}`,
                  };

                  return (
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
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </section>
      ) : null}

      <section className="db-site-footer__legal">
        <div className="db-container">
          <p>
            服務說明：優先安排為目標安排，實際時間受地區、交通、人員及設備供應影響；「不成功不收費」適用於事前確認的合資格疏通項目，適用範圍及條款會在安排服務前說明。
          </p>
          <div>
            <span>
              © {new Date().getFullYear()} 通渠熊 DrainBear Limited. 版權所有。
            </span>
            <span>提供港島、九龍、新界及離島渠務查詢。</span>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const routerPathname = location.split(/[?#]/)[0] || "/";
  const browserPathname =
    typeof window === "undefined" ? routerPathname : window.location.pathname;
  const pathname = browserPathname.replace(/\/+$/, "") || "/";
  const isHome = pathname === "/";
  const suppressConversionChrome = pathname === "/thanks";

  useReveal();

  useEffect(() => {
    // 支援頁面 hash 錨點：有錨點時捲至該區塊，否則回頁頂
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
      <a href="#main-content" className="site-skip-link">
        跳到主要內容
      </a>
      <Header hideConversionCTA={suppressConversionChrome} />
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 outline-none ${isHome ? "home-main" : "pt-16 md:pt-[72px]"}`}
      >
        {children}
      </main>
      <Footer compact={isHome} />
      {!suppressConversionChrome ? (
        <>
          {/* 避免內容及 Footer 被固定 CTA 列遮蓋（含 safe-area） */}
          <MobileCTABar />
          <DeferredDesktopWhatsAppWidget />
          <BackToTop />
        </>
      ) : null}
    </div>
  );
}
