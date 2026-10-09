import ServicePhoto from "@/components/ServicePhoto";
import { getServiceVisual } from "@/lib/serviceVisuals";
import { trackNavClick } from "@/lib/analytics";
import { SERVICE_PAGES } from "@/lib/serviceData";
import {
  ArrowRight,
  CookingPot,
  Droplets,
  Network,
  ScanLine,
  ShieldCheck,
  Waves,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";

const SERVICE_VISUALS = {
  "toilet-unblocking": { icon: Wrench, summary: "水位升高、沖水唔順" },
  "kitchen-sink-unblocking": { icon: CookingPot, summary: "鋅盤積水、去水慢" },
  "bathroom-drain-unblocking": {
    icon: Droplets,
    summary: "企缸積水、地台去水慢",
  },
  "sewage-backflow": { icon: ShieldCheck, summary: "污水湧出、多處倒灌" },
  "grease-trap-cleaning": { icon: Wrench, summary: "食肆油垢、隔油池清理" },
  "high-pressure-jetting": { icon: Waves, summary: "較長管段、積垢清洗" },
  "cctv-drain-inspection": { icon: ScanLine, summary: "反覆塞渠、檢查管內" },
  "main-drain-manhole": { icon: Network, summary: "大廈主渠、沙井淤塞" },
};

export default function ServiceDirectory({
  location,
  compact = false,
}: {
  location: string;
  compact?: boolean;
}) {
  return (
    <nav
      className={`service-directory${compact ? " service-directory--compact" : " service-directory--visual"}`}
      aria-label="按問題選擇通渠服務"
    >
      {SERVICE_PAGES.map(service => {
        const visual =
          SERVICE_VISUALS[service.slug as keyof typeof SERVICE_VISUALS];
        const Icon = visual?.icon || Wrench;
        return (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="service-directory__item"
            onClick={() =>
              trackNavClick("service", {
                cta_location: location,
                cta_label: service.shortName,
                destination_url: `/services/${service.slug}`,
              })
            }
          >
            {compact && (
              <span className="service-directory__icon" aria-hidden="true">
                <Icon />
              </span>
            )}
            {!compact ? <ServicePhoto slug={service.slug} /> : null}
            <span className="service-directory__copy">
              <strong>{service.shortName}</strong>
              <span>
                {compact
                  ? visual?.summary || service.answerSummary.handles
                  : getServiceVisual(service.slug).summary}
              </span>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}
