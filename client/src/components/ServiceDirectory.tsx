import { trackNavClick } from "@/lib/analytics";
import { SERVICE_PAGES } from "@/lib/serviceData";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ServiceDirectory({
  location,
  compact = false,
}: {
  location: string;
  compact?: boolean;
}) {
  return (
    <nav
      className={`service-directory${compact ? " service-directory--compact" : ""}`}
      aria-label="按問題選擇通渠服務"
    >
      {SERVICE_PAGES.map((service, index) => (
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
            <span className="service-directory__index" aria-hidden="true">
              0{index + 1}
            </span>
          )}
          <span>
            <strong>{service.shortName}</strong>
            {!compact && <span>{service.answerSummary.handles}</span>}
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>
      ))}
    </nav>
  );
}
