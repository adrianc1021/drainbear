import {
  ArrowRight,
  Check,
  Camera,
  Droplets,
  MessageCircle,
  Phone,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Link } from "wouter";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import {
  EditorialIndex,
  EditorialKicker,
} from "@/components/editorial/EditorialPrimitives";

const PROMISES = [
  {
    title: "接納工程免檢查費",
    description: "師傅先到場檢查；接納報價並進行工程，可豁免檢查費。",
  },
  {
    title: "報價後才動工",
    description: "現場了解實際情況，雙方確認最終收費後才開始施工。",
  },
  {
    title: "額外費用事前說明",
    description: "深夜及特殊工具等安排會在動工前說明，確保收費安排清晰透明。",
  },
] as const;

const CAPABILITIES = [
  {
    code: "CCTV",
    title: "管道影像檢測",
    description: "按情況以鏡頭深入喉管，協助定位淤塞或破損位置。",
  },
  {
    code: "24H",
    title: "全天候接受查詢",
    description: "港九新界及離島可先提供位置，再確認上門時間。",
  },
  {
    code: "JET",
    title: "高壓水槍處理",
    description: "針對頑固油脂、沉積物及重型管道問題評估使用。",
  },
  {
    code: "CLEAN",
    title: "完工測試及清理",
    description: "施工後測試去水，並整理受影響的工作位置。",
  },
] as const;

const SERVICES = [
  {
    number: "01",
    eyebrow: "Residential",
    title: "浴室及企缸通渠",
    description: "處理企缸塞、浴缸去水慢、頭髮及番梘垢淤塞。",
    href: "/services/bathroom-drain-unblocking",
  },
  {
    number: "02",
    eyebrow: "Commercial",
    title: "食肆及商業通渠",
    description: "隔油池、商舖去水、大廈主渠及沙井渠務問題。",
    href: "/services/main-drain-manhole",
  },
  {
    number: "03",
    eyebrow: "Hydro jetting",
    title: "高壓水槍洗渠",
    description: "處理頑固油垢、沉積物及需要深層沖洗的管道。",
    href: "/services/high-pressure-jetting",
  },
  {
    number: "04",
    eyebrow: "Inspection",
    title: "CCTV 照喉檢測",
    description: "協助判斷淤塞位置、管道狀態及後續處理方向。",
    href: "/services/cctv-drain-inspection",
  },
] as const;

export function EditorialHero({ imageSrc }: { imageSrc?: string }) {
  const { phoneDisplay, phoneHref, whatsappDefaultHref } = useContactSettings();

  return (
    <section
      aria-labelledby="home-editorial-heading"
      className="brand-hero"
      data-pr20-section="hero"
    >
      <div className="db-container brand-hero__grid">
        <div className="brand-hero__copy">
          <p className="brand-hero__service-label">
            <span aria-hidden="true" />
            港九新界・住宅及商業渠務
          </p>
          <h1 id="home-editorial-heading">
            香港通渠，24 小時
            <br />
            緊急服務
          </h1>
          <p className="brand-hero__intro">
            先了解情況及報價，確認後才動工。
          </p>
          <p className="brand-hero__description">
            塞廁所、企缸去水、廚房鋅盤淤塞或污水倒灌？傳送地點及現場相片，讓團隊作初步評估。
          </p>
          <div className="brand-hero__actions">
            <a
              href={whatsappDefaultHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackCTA("whatsapp", "home_hero");
                goThanksAfterWhatsApp("home_hero");
              }}
              className="db-primary-action"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>WhatsApp 查詢報價</span>
            </a>
            <a
              href={phoneHref}
              onClick={() => trackCTA("phone", "home_hero")}
              className="db-secondary-action"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{phoneDisplay}</span>
            </a>
          </div>
        </div>
        {imageSrc ? (
          <figure className="brand-hero__media">
            <img
              src={imageSrc}
              alt="通渠機處理浴室去水口的服務示意"
              width="1280"
              height="960"
              fetchPriority="high"
              decoding="async"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <figcaption>
              <span>由家居去水，到大廈主渠。</span>
              <span>服務示意圖片</span>
            </figcaption>
            <p className="brand-hero__note">
              服務時間按地區、交通及所需設備確認。
            </p>
          </figure>
        ) : null}
      </div>
      <ul className="brand-hero__proofs db-container" aria-label="服務承諾">
        <li><ShieldCheck aria-hidden="true" /><span>確認收費後才動工</span></li>
        <li><Timer aria-hidden="true" /><span>24 小時接受查詢</span></li>
        <li><Check aria-hidden="true" /><span>完工後測試去水</span></li>
      </ul>
      <div className="brand-hero__directory">
        <div className="db-container">
          <p>想先了解？</p>
          <nav aria-label="首頁快速入口">
            <Link href="/services">
              通渠服務 <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/guide#calculator">
              估價計算機 <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/areas">
              查看服務地區 <ArrowRight aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}

export function EditorialPromise() {
  return (
    <section
      aria-labelledby="editorial-promise-heading"
      className="db-section db-section--paper"
      data-pr20-section="promise"
    >
      <div className="home-promise-grid db-container grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-20">
        <div>
          <EditorialKicker>收費原則</EditorialKicker>
          <h2
            id="editorial-promise-heading"
            className="db-editorial-heading mt-6"
          >
            先問清楚，才安心。
          </h2>
          <p className="home-pricing-summary">
            一般鋅盤、企缸疏通 HK$500 起；座廁 HK$600
            起。起步價並非所有情況的總價，實際收費需先檢查。
          </p>

          <div className="mt-8 flex flex-wrap gap-5">
            <Link
              href="/guide"
              onClick={() =>
                trackNavClick("pricing", {
                  cta_location: "home_promise",
                  cta_label: "查看收費指南",
                  destination_url: "/guide",
                })
              }
              className="db-arrow-link"
            >
              查看收費指南
              <ArrowRight
                className="db-arrow-link__icon"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <ul className="home-promise-list">
          {PROMISES.map(promise => (
            <li key={promise.title} className="home-promise-item">
              <Check aria-hidden="true" />
              <div>
                <h3 className="text-lg font-black tracking-[-0.02em] md:text-xl">
                  {promise.title}
                </h3>

                <p className="text-sm leading-7 text-[var(--db-copy)] md:text-base">
                  {promise.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function EditorialCapability({ imageSrc }: { imageSrc?: string }) {
  return (
    <section
      aria-labelledby="editorial-capability-heading"
      className="db-section db-section--ink"
      data-pr20-section="capability"
    >
      <div className="db-container">
        <div className="grid gap-8 border-b border-white/20 pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <EditorialKicker tone="light">現場判斷</EditorialKicker>
            <h2
              id="editorial-capability-heading"
              className="db-editorial-heading mt-6 text-white"
            >
              看清問題，才選工具。
            </h2>
          </div>

          <p className="db-copy--light max-w-xl text-base leading-8 lg:justify-self-end lg:text-lg">
            每個淤塞位置、喉管結構及現場環境都不同。團隊按實際情況評估，
            再決定使用手動工具、高壓水槍、CCTV 或其他合適設備。
          </p>
        </div>

        <div className="home-capability-layout mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="db-media min-h-[360px] bg-white/5 lg:min-h-[560px]">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="渠務檢測設備的服務示意"
                width="960"
                height="1280"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 46vw, 100vw"
              />
            ) : (
              <div className="db-operational-grid h-full min-h-[360px] opacity-30 lg:min-h-[560px]" />
            )}
            <span className="db-image-label">設備應用示意</span>
          </div>

          <div className="border-b border-white/20">
            {CAPABILITIES.map(capability => (
              <article key={capability.code} className="home-capability-item">
                <h3 className="text-lg font-black text-white">
                  {capability.title}
                </h3>

                <p className="text-sm leading-7 text-white/75">
                  {capability.description}
                </p>
              </article>
            ))}
            <nav
              className="home-equipment-links"
              aria-label="商業渠務及檢測服務"
            >
              <Link href="/services/main-drain-manhole">
                大廈主渠與沙井 <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/services/high-pressure-jetting">
                <Droplets aria-hidden="true" />
                高壓水槍洗渠
              </Link>
              <Link href="/services/cctv-drain-inspection">
                <Camera aria-hidden="true" />
                CCTV 照喉檢測
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EditorialServices() {
  return (
    <section
      aria-labelledby="editorial-services-heading"
      className="db-section db-section--white"
      data-pr20-section="services"
    >
      <div className="db-container">
        <div className="grid gap-8 border-b border-[var(--db-rule)] pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-end">
          <div>
            <EditorialKicker>Our services / 專業服務</EditorialKicker>
            <h2
              id="editorial-services-heading"
              className="db-editorial-heading mt-6"
            >
              因應實際狀況，
              <br />
              採用合適方案。
            </h2>
          </div>

          <div className="flex max-w-xl flex-col items-start gap-5 lg:justify-self-end">
            <p className="db-section-support">
              由一般家居淤塞至商業渠務工程，團隊會按管道結構、淤塞程度及現場所需設備，建議合適處理方向。
            </p>

            <Link
              href="/services"
              onClick={() =>
                trackNavClick("navigation", {
                  cta_location: "home_services",
                  cta_label: "查看全部服務",
                  destination_url: "/services",
                })
              }
              className="db-arrow-link"
            >
              查看全部服務
              <ArrowRight
                className="db-arrow-link__icon"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <div className="home-service-list border-b border-[var(--db-rule)]">
          {SERVICES.map(service => (
            <Link
              key={service.number}
              href={service.href}
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "home_services",
                  service_name: service.title,
                  destination_url: service.href,
                })
              }
              className="home-service-row group grid gap-5 border-t border-[var(--db-rule)] py-8 text-[var(--db-ink)] transition-colors hover:bg-[var(--db-paper)] md:min-h-40 md:grid-cols-[3rem_7rem_minmax(0,1fr)_3rem] md:items-center md:px-5 lg:grid-cols-[4rem_9rem_minmax(0,1fr)_3rem]"
            >
              <EditorialIndex>{service.number}</EditorialIndex>

              <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[var(--db-copy)]">
                {service.eyebrow}
              </span>

              <span>
                <span className="block text-2xl font-black tracking-[-0.035em] md:text-4xl">
                  {service.title}
                </span>
                <span className="mt-2 block max-w-xl text-sm leading-7 text-[var(--db-copy)] md:text-base">
                  {service.description}
                </span>
              </span>

              <span className="flex h-12 w-12 items-center justify-center border border-[var(--db-rule-strong)] transition-all group-hover:border-[var(--db-ink)] group-hover:bg-[var(--db-ink)] group-hover:text-white">
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-6 border-l-2 border-[var(--db-safety)] pl-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-[var(--db-copy)] md:text-base">
            如未能確定所需設備，可先傳送現場相片或影片，團隊將按實際情況作初步評估。
          </p>

          <div className="flex items-center gap-2 text-sm font-black">
            <Check
              className="h-4 w-4 text-[var(--db-safety)]"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            報價確認後才動工
          </div>
        </div>
      </div>
    </section>
  );
}
