import { ArrowRight, Bath, CookingPot, Droplets, Waves } from "lucide-react";
import { Link } from "wouter";
import { trackNavClick } from "@/lib/analytics";
import { prefetchRoute } from "@/lib/routePrefetch";

const QUICK_SERVICES = [
  {
    id: "toilet",
    icon: Droplets,
    label: "座廁淤塞",
    description: "排水緩慢、倒灌或完全淤塞",
    href: "/services/toilet-unblocking",
  },
  {
    id: "bathroom",
    icon: Bath,
    label: "浴室排水淤塞",
    description: "淋浴間、浴缸、頭髮或地台排水淤塞",
    href: "/services/bathroom-drain-unblocking",
  },
  {
    id: "kitchen",
    icon: CookingPot,
    label: "廚房鋅盤淤塞",
    description: "鋅盤排水緩慢、油脂積聚或倒灌",
    href: "/services/kitchen-sink-unblocking",
  },
  {
    id: "backflow",
    icon: Waves,
    label: "污水渠倒灌",
    description: "低層排水位湧水、污水渠或主渠倒灌",
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
            <h2 id="quick-service-heading" className="db-editorial-heading">
              哪一個位置出現淤塞？
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-[var(--db-copy)] lg:justify-self-end lg:text-lg">
            選擇最接近的情況，查看處理方法、收費因素與應注意的事項。
          </p>
        </div>

        <div className="home-choice-grid border-b border-[var(--db-rule)]">
          {QUICK_SERVICES.map(service => (
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
              className="home-choice-card"
              data-service-id={service.id}
            >
              <service.icon className="home-choice-icon" aria-hidden="true" />

              <span className="min-w-0">
                <span className="block text-xl font-black tracking-[-0.025em] sm:text-2xl md:text-3xl">
                  {service.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[var(--db-copy)] md:text-base">
                  {service.description}
                </span>
              </span>

              <span className="home-choice-arrow">
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
            onMouseEnter={() => prefetchRoute("/guide#calculator")}
            onFocus={() => prefetchRoute("/guide#calculator")}
            onTouchStart={() => prefetchRoute("/guide#calculator")}
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
