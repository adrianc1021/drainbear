import WhatsAppIcon from "@/components/WhatsAppIcon";
/**
 * 通渠熊 DrainBear — Hong Kong Industrial Editorial
 * Header：清晰品牌導覽 + 克制的 WhatsApp 行動入口
 * Footer：服務資訊、主要地區與公司資料
 */
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import ContactActions from "@/components/ContactActions";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useContactHandoff } from "@/contexts/ContactHandoffContext";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { useReveal } from "@/hooks/useReveal";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import { DISTRICTS } from "@/lib/districtData";
import { prefetchRoute } from "@/lib/routePrefetch";
import { SERVICE_PAGES } from "@/lib/serviceData";
import { ArrowUp, Menu, Phone, X } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

const LOGO = "/favicon-192x192.png";

const NAV_ITEMS = [
  { label: "通渠服務", href: "/services" },
  { label: "施工案例", href: "/cases" },
  { label: "查詢指南", href: "/guide" },
  { label: "服務地區", href: "/areas" },
  { label: "關於通渠熊", href: "/about" },
];

function isNavItemActive(location: string, href: string) {
  if (
    href === "/services" &&
    (location.startsWith("/customers/") || location === "/drain-diagnosis")
  )
    return true;
  if (href === "/guide" && ["/faq", "/service-process"].includes(location))
    return true;
  return location === href || (href !== "/" && location.startsWith(`${href}/`));
}

const FOOTER_NAV_ITEMS = [
  ...NAV_ITEMS,
  { label: "問題判斷", href: "/drain-diagnosis" },
  { label: "服務流程", href: "/service-process" },
  { label: "常見問題", href: "/faq" },
  { label: "通渠小知識", href: "/blog" },
  { label: "住宅通渠", href: "/customers/residential" },
  { label: "食肆及商舖", href: "/customers/restaurants" },
  { label: "物業渠務", href: "/customers/property-management" },
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
      <WhatsAppIcon className="h-4 w-4" />
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
  const waSub = diagnosis ? diagnosis.summary : "傳送位置及相片・加快初步判斷";

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
              trackCTA("whatsapp", "mobile_bar", diagnosis?.topic);
              goThanksAfterWhatsApp("mobile_bar");
            }}
            className="btn-smooth flex min-h-[56px] min-w-0 flex-[3] items-center justify-center gap-2.5 border border-navy bg-wagreen px-3 py-2 text-navy active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
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
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = location === "/" && !scrolled && !open;
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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 site-header--shared ${
        overHero
          ? "site-header--over-hero border-transparent bg-transparent"
          : scrolled
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
            <span className="site-header__brand-en text-muted-foreground">
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

function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="brand-footer" data-site-footer="true">
      <div className="container brand-footer__top">
        <div>
          <Link href="/" className="brand-footer__brand">
            <img src={LOGO} width="48" height="48" alt="" loading="lazy" />
            通渠熊 DrainBear
          </Link>
          <p>香港住宅、食肆及物業渠務。</p>
        </div>
        {!compact ? <ContactActions location="footer" /> : null}
      </div>
      <div className="container brand-footer__directory">
        <AnimatedDisclosure id="footer-information" title="服務與資料">
          <nav aria-label="頁尾服務資料" className="brand-footer__links">
            {FOOTER_NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </AnimatedDisclosure>
        <AnimatedDisclosure id="footer-services" title="按問題找服務">
          <nav aria-label="頁尾通渠服務" className="brand-footer__links">
            {SERVICE_PAGES.map(service => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.shortName}
              </Link>
            ))}
          </nav>
        </AnimatedDisclosure>
        <AnimatedDisclosure id="footer-areas" title="服務地區">
          <nav aria-label="頁尾服務地區" className="brand-footer__links">
            {DISTRICTS.map(district => (
              <Link key={district.slug} href={`/areas/${district.slug}`}>
                {district.name}通渠
              </Link>
            ))}
            <Link href="/areas">查看完整服務地區</Link>
          </nav>
        </AnimatedDisclosure>
      </div>
      <div className="container brand-footer__legal">
        <p>24 小時接受查詢；上門時間按地區、人手及設備確認。</p>
        <p>© {new Date().getFullYear()} 通渠熊 DrainBear. 版權所有。</p>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const routerPathname = location.split(/[?#]/)[0] || "/";
  const browserPathname =
    typeof window === "undefined" ? routerPathname : window.location.pathname;
  const pathname = browserPathname.replace(/\/+$/, "") || "/";
  const suppressConversionChrome = pathname === "/thanks";

  useReveal();

  useEffect(() => {
    // 支援頁面 hash 錨點：有錨點時捲至該區塊，否則回頁頂
    const hash = window.location.hash;
    if (hash) {
      // 等待目標頁面渲染完成後再捲動
      requestAnimationFrame(() => {
        let targetId = hash.slice(1);
        try {
          targetId = decodeURIComponent(targetId);
        } catch {}
        const el = document.getElementById(targetId);
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
    <div
      className={`site-shell ${location === "/" ? "site-shell--home" : ""} flex min-h-screen flex-col bg-white`}
    >
      <a href="#main-content" className="site-skip-link">
        跳到主要內容
      </a>
      <Header hideConversionCTA={suppressConversionChrome} />
      <main
        id="main-content"
        tabIndex={-1}
        className="site-main flex-1 outline-none"
      >
        {children}
      </main>
      <Footer key={pathname} compact={suppressConversionChrome} />
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
