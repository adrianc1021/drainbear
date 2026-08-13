import { ArrowRight, MessageCircle } from "lucide-react";
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

const QUICK_SERVICES = [
  {
    id: "toilet",
    label: "廁所／座廁淤塞",
    description: "去水慢、倒灌或完全淤塞",
    message:
      "你好，我想查詢塞廁所通渠服務。請問可否先提供初步估價及預計到達時間？",
  },
  {
    id: "kitchen-bathroom",
    label: "廚房／浴室去水",
    description: "鋅盤、企缸、浴缸或地台去水",
    message:
      "你好，我想查詢廚房鋅盤或浴室去水通渠服務。請問可否先提供初步估價及預計到達時間？",
  },
  {
    id: "commercial",
    label: "食肆／商業渠務",
    description: "隔油池、商舖去水或大廈主渠",
    message:
      "你好，我想查詢食肆或商業場所通渠服務。請問可否先提供初步估價及預計到達時間？",
  },
  {
    id: "diagnosis",
    label: "未能確定問題",
    description: "需要高壓水槍或 CCTV 檢測建議",
    message: "你好，我未能確定渠務問題原因，想提供相片或影片作初步了解及報價。",
  },
] as const;

export default function ServiceQuickSelect() {
  const { whatsappHref } = useContactSettings();

  return (
    <section
      aria-labelledby="quick-service-heading"
      className="bg-white"
      data-pr20-section="quick-service"
    >
      <div className="db-container py-16 md:py-24">
        <div className="grid gap-10 border-b border-[var(--db-rule)] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <EditorialKicker>Start here / 先講情況</EditorialKicker>
            <h2
              id="quick-service-heading"
              className="mt-5 text-[clamp(2.3rem,5vw,4.75rem)] font-black leading-[0.96] tracking-[-0.055em] text-[var(--db-ink)]"
            >
              你遇到
              <br />
              甚麼問題？
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-[var(--db-copy)] lg:justify-self-end lg:text-lg">
            選擇最接近的情況，直接傳送預設查詢內容。未肯定原因亦唔緊要，
            可先提供相片或影片，讓團隊初步了解。
          </p>
        </div>

        <div className="border-b border-[var(--db-rule)]">
          {QUICK_SERVICES.map((service, index) => (
            <a
              key={service.id}
              href={whatsappHref(service.message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackCTA("whatsapp", "home_quick_select", service.id);
                goThanksAfterWhatsApp("home_quick_select");
              }}
              className="group grid min-h-28 items-center gap-4 border-t border-[var(--db-rule)] py-6 text-[var(--db-ink)] transition-colors duration-200 hover:bg-[var(--db-paper)] focus-visible:bg-[var(--db-paper)] sm:grid-cols-[4rem_1fr_auto] sm:px-4 md:min-h-32 md:px-6"
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
                <MessageCircle
                  className="h-5 w-5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm leading-6 text-[var(--db-copy)]">
            想先了解大概收費？計算機只作初步參考，最終以現場報價為準。
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
