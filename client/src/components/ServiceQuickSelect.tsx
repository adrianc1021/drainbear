import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { trackNavClick } from "@/lib/analytics";
import {
  EditorialIndex,
  EditorialKicker,
} from "@/components/editorial/EditorialPrimitives";

const QUICK_SERVICES = [
  {
    id: "toilet",
    label: "廁所／座廁淤塞",
    description: "去水慢、倒灌或完全淤塞",
    href: "/services/toilet-unblocking",
  },
  {
    id: "bathroom",
    label: "企缸／浴室去水",
    description: "企缸、浴缸、頭髮或地台去水淤塞",
    href: "/services/bathroom-drain-unblocking",
  },
  {
    id: "kitchen",
    label: "廚房鋅盤淤塞",
    description: "鋅盤去水慢、油脂積聚或倒灌",
    href: "/services/kitchen-sink-unblocking",
  },
  {
    id: "backflow",
    label: "污水渠倒灌",
    description: "低層去水口湧水、屎渠或主渠倒灌",
    href: "/services/sewage-backflow",
  },
] as const;

export default function ServiceQuickSelect() {
  return (
    <section
      aria-labelledby="quick-service-heading"
      className="bg-white"
      data-pr20-section="quick-service"
    >
      <div className="db-container py-16 md:py-24">
        <div className="home-section-head grid gap-10 border-b border-[var(--db-rule)] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <EditorialKicker>Start here / 問題分類</EditorialKicker>
            <h2
              id="quick-service-heading"
              className="db-editorial-heading mt-5"
            >
              請選擇
              <br />
              渠務問題類型
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-[var(--db-copy)] lg:justify-self-end lg:text-lg">
            請選擇最接近的渠務問題，系統會提供相應的查詢內容。如未能確定原因，
            可先提供現場相片或影片，讓團隊作初步評估。
          </p>
        </div>

        <div className="home-choice-grid border-b border-[var(--db-rule)]">
          {QUICK_SERVICES.map((service, index) => (
            <Link
              key={service.id}
              href={service.href}
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "home_quick_select",
                  cta_label: service.label,
                  destination_url: service.href,
                })
              }
              className="home-choice-card group grid min-h-28 items-center gap-4 border-t border-[var(--db-rule)] py-6 text-[var(--db-ink)] transition-colors duration-200 hover:bg-[var(--db-paper)] focus-visible:bg-[var(--db-paper)] sm:grid-cols-[4rem_1fr_auto] sm:px-4 md:min-h-32 md:px-6"
              data-service-id={service.id}
            >
              <EditorialIndex>
                {String(index + 1).padStart(2, "0")}
              </EditorialIndex>

              <span className="min-w-0">
                <span className="block text-xl font-black tracking-[-0.025em] sm:text-2xl md:text-3xl">
                  {service.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[var(--db-copy)] md:text-base">
                  {service.description}
                </span>
              </span>

              <span className="flex h-11 w-11 items-center justify-center border border-[var(--db-rule-strong)] transition-all duration-200 group-hover:border-[var(--db-ink)] group-hover:bg-[var(--db-ink)] group-hover:text-white">
                <ArrowRight
                  className="h-5 w-5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm leading-6 text-[var(--db-copy)]">
            如需初步了解服務預算，可使用估價計算機；最終收費以現場報價為準。
          </p>

          <Link
            href="/guide#calculator"
            onClick={() =>
              trackNavClick("pricing", {
                cta_location: "home_quick_select",
                cta_label: "使用即時估價計算機",
                destination_url: "/guide#calculator",
              })
            }
            className="group inline-flex min-h-11 items-center gap-2 border-b border-[var(--db-ink)] text-sm font-black text-[var(--db-ink)]"
          >
            使用即時估價計算機
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
