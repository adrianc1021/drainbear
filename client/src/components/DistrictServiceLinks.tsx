import ServiceIllustration from "@/components/ServiceIllustration";
import { getServicePage } from "@/lib/serviceData";
import { trackNavClick } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function DistrictServiceLinks({
  district,
  slug,
}: {
  district: string;
  slug: string;
}) {
  const slugs =
    slug === "causeway-bay"
      ? [
          "kitchen-sink-unblocking",
          "grease-trap-cleaning",
          "toilet-unblocking",
          "main-drain-manhole",
        ]
      : [
          "toilet-unblocking",
          "kitchen-sink-unblocking",
          "bathroom-drain-unblocking",
          "main-drain-manhole",
        ];
  return (
    <aside
      className="district-service-links"
      aria-labelledby="district-service-heading"
    >
      <h3 id="district-service-heading">按問題找處理</h3>
      <nav aria-label={`${district}查詢相關服務`}>
        {slugs.map(serviceSlug => {
          const service = getServicePage(serviceSlug)!;
          return (
            <Link
              key={serviceSlug}
              href={`/services/${serviceSlug}`}
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "district_service_links",
                  area_name: district,
                  service_name: serviceSlug,
                  destination_url: `/services/${serviceSlug}`,
                })
              }
            >
              <ServiceIllustration slug={serviceSlug} />
              <span>
                {service.shortName}
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
