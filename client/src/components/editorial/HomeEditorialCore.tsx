import { ArrowRight, Check, MessageCircle, Phone } from "lucide-react";
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
    title: "住宅通渠服務",
    description: "座廁、企缸、浴缸、廚房鋅盤及地台去水淤塞。",
    href: "/services/toilet-unblocking",
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
      className="relative bg-[var(--db-paper)]"
      data-pr20-section="hero"
    >
      <div className="home-hero-grid db-container grid min-h-[calc(100svh-4rem)] gap-8 py-10 md:min-h-[720px] md:grid-cols-[1.02fr_0.98fr] md:items-stretch md:py-14 lg:min-h-[760px]">
        <div className="flex flex-col justify-between py-4 md:py-8">
          <div>
            <EditorialKicker>Hong Kong / Drain service / 24H</EditorialKicker>

            <h1 id="home-editorial-heading" className="db-display mt-8">
              渠管淤塞，
              <br />
              <span className="text-[var(--db-safety)]">專業評估。</span>
            </h1>

            <p className="db-lead mt-8 max-w-xl">
              先了解現場情況，再按需要安排設備。報價及收費條款確認後才動工，
              完成後測試去水並整理現場。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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
                <MessageCircle
                  className="h-5 w-5"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                WhatsApp 查詢報價
              </a>

              <a
                href={phoneHref}
                onClick={() => trackCTA("phone", "home_hero")}
                className="db-secondary-action"
              >
                <Phone
                  className="h-4 w-4"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                {phoneDisplay}
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 border-y border-[var(--db-rule)] text-xs font-black tracking-[0.08em] sm:grid-cols-4">
            {["住宅通渠", "商業工程", "高壓洗渠", "CCTV 檢測"].map(
              (label, index) => (
                <span
                  key={label}
                  className="flex min-h-14 items-center gap-2 border-[var(--db-rule)] py-3 pr-2 even:border-l sm:border-l sm:first:border-l-0 sm:px-3"
                >
                  <EditorialIndex>
                    {String(index + 1).padStart(2, "0")}
                  </EditorialIndex>
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        <div className="db-media min-h-[420px] md:min-h-0">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="通渠熊團隊進行專業渠務工程"
              width="1024"
              height="1280"
              fetchPriority="high"
              decoding="async"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="db-operational-grid flex h-full min-h-[420px] items-center justify-center bg-[var(--db-paper-deep)] p-12">
              <img
                src="/favicon-512x512.png"
                alt=""
                aria-hidden="true"
                className="h-44 w-44 object-contain opacity-15"
              />
            </div>
          )}

          <span className="db-image-label">Field operation / DB–01</span>
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
          <EditorialKicker>Our promise / 收費原則</EditorialKicker>
          <h2
            id="editorial-promise-heading"
            className="db-editorial-heading mt-6"
          >
            收費透明，
            <br />
            確認後才動工。
          </h2>

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

        <ol className="border-b border-[var(--db-rule)]">
          {PROMISES.map((promise, index) => (
            <li
              key={promise.title}
              className="grid gap-4 border-t border-[var(--db-rule)] py-7 sm:grid-cols-[4rem_0.8fr_1.2fr] sm:gap-7 md:py-9"
            >
              <EditorialIndex>
                {String(index + 1).padStart(2, "0")}
              </EditorialIndex>

              <h3 className="text-lg font-black tracking-[-0.02em] md:text-xl">
                {promise.title}
              </h3>

              <p className="text-sm leading-7 text-[var(--db-copy)] md:text-base">
                {promise.description}
              </p>
            </li>
          ))}
        </ol>
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
            <EditorialKicker tone="light">Equipment / 現場判斷</EditorialKicker>
            <h2
              id="editorial-capability-heading"
              className="db-editorial-heading mt-6 text-white"
            >
              專業檢測，
              <br />
              準確判斷。
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
                alt="通渠熊團隊使用渠務檢測設備"
                width="1024"
                height="1024"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 46vw, 100vw"
              />
            ) : (
              <div className="db-operational-grid h-full min-h-[360px] opacity-30 lg:min-h-[560px]" />
            )}
            <span className="db-image-label">Equipment check / DB–02</span>
          </div>

          <div className="border-b border-white/20">
            {CAPABILITIES.map((capability, index) => (
              <article
                key={capability.code}
                className="grid gap-4 border-t border-white/20 py-7 sm:grid-cols-[5.5rem_0.9fr_1.1fr] sm:gap-6"
              >
                <span className="font-mono text-sm font-black tracking-[0.08em] text-[var(--db-safety)]">
                  {capability.code}
                </span>

                <h3 className="text-lg font-black text-white">
                  {capability.title}
                </h3>

                <p className="text-sm leading-7 text-white/75">
                  {capability.description}
                </p>
              </article>
            ))}
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
