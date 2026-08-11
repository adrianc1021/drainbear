import {
  Bath,
  CookingPot,
  MessageCircle,
  ShowerHead,
  Waves,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";

const QUICK_SERVICES = [
  {
    id: "toilet",
    label: "塞廁所",
    description: "坐廁去水慢、倒灌或完全淤塞",
    icon: Bath,
    message:
      "你好，我想查詢塞廁所通渠服務。請問可否先提供初步估價及預計到達時間？",
  },
  {
    id: "kitchen-sink",
    label: "廚房鋅盤",
    description: "鋅盤去水慢、豬油膏或異味",
    icon: CookingPot,
    message:
      "你好，我想查詢廚房鋅盤通渠服務。請問可否先提供初步估價及預計到達時間？",
  },
  {
    id: "shower-drain",
    label: "企缸去水",
    description: "企缸、浴缸或地台去水淤塞",
    icon: ShowerHead,
    message:
      "你好，我想查詢企缸／浴室地台去水通渠服務。請問可否先提供初步估價及預計到達時間？",
  },
  {
    id: "main-drain",
    label: "主渠／沙井",
    description: "大廈主渠倒灌、沙井滿瀉",
    icon: Waves,
    message:
      "你好，我想查詢大廈主渠／沙井通渠服務。請問可否先提供初步估價及預計到達時間？",
  },
] as const;

export default function ServiceQuickSelect() {
  const { whatsappHref } = useContactSettings();

  return (
    <section
      aria-labelledby="quick-service-heading"
      className="border-y border-border bg-white py-10 md:py-14"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.18em] text-wagreen-dark">
            QUICK DIAGNOSIS
          </p>
          <h2
            id="quick-service-heading"
            className="mt-2 font-display text-2xl font-black text-navy md:text-3xl"
          >
            邊度塞咗？
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            揀選問題位置，WhatsApp
            會自動填好查詢內容，方便師傅快速提供初步估價。
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_SERVICES.map(service => {
            const Icon = service.icon;

            return (
              <a
                key={service.id}
                href={whatsappHref(service.message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackNavClick("service", {
                    cta_location: "home_quick_select",
                    cta_label: service.label,
                    service_name: service.id,
                    destination_url: "whatsapp",
                  });
                  trackCTA("whatsapp", "home_quick_select", service.id);
                  goThanksAfterWhatsApp(`home_quick_select_${service.id}`);
                }}
                className="group flex min-h-[132px] flex-col rounded-lg border border-border bg-mist/45 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-wagreen/50 hover:bg-white hover:shadow-[0_12px_30px_rgba(11,19,43,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wagreen focus-visible:ring-offset-2"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-wagreen/12 text-wagreen-dark transition-colors group-hover:bg-wagreen group-hover:text-navy">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>

                <span className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-base font-black text-navy">
                    {service.label}
                  </span>
                  <MessageCircle
                    className="h-4 w-4 shrink-0 text-wagreen-dark"
                    strokeWidth={2.2}
                  />
                </span>

                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {service.description}
                </span>
              </a>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/guide#calculator"
            onClick={() =>
              trackNavClick("pricing", {
                cta_location: "home_quick_select",
                cta_label: "使用即時估價計算機",
                destination_url: "/guide#calculator",
              })
            }
            className="btn-smooth inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-navy hover:bg-mist"
          >
            未肯定問題？使用即時估價計算機
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
