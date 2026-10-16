import HomeMobileRail from "./HomeMobileRail";
import { ArrowUpRight, CookingPot, ShowerHead, Waves } from "lucide-react";
import { Link } from "wouter";
import { trackNavClick } from "@/lib/analytics";
import type { SVGProps } from "react";

function ToiletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="3" width="6" height="9" rx="1" />
      <path d="M4 12h16a7 7 0 0 1-7 7h-2v3H5v-5M6 7h2" />
    </svg>
  );
}

const SERVICES = [
  {
    slug: "toilet-unblocking",
    title: "坐廁通渠",
    copy: "沖水不去、水位升高。",
    icon: ToiletIcon,
    image: "toilet",
  },
  {
    slug: "kitchen-sink-unblocking",
    title: "鋅盤通渠",
    copy: "鋅盤積水、去水慢。",
    icon: CookingPot,
    image: "sink",
  },
  {
    slug: "bathroom-drain-unblocking",
    title: "浴室淤塞",
    copy: "企缸、浴缸及地台積水。",
    icon: ShowerHead,
    image: "bathroom",
  },
  {
    slug: "sewage-backflow",
    title: "主渠倒灌",
    copy: "多個去水位同時倒灌。",
    icon: Waves,
    image: "main",
  },
] as const;

export default function HomeServiceRows() {
  return (
    <section className="home-service-rows" aria-labelledby="home-range-heading">
      <div className="container">
        <div className="section-heading">
          <h2 id="home-range-heading">塞渠問題，逐個睇清楚。</h2>
          <Link href="/services">
            全部通渠服務 <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <HomeMobileRail label="通渠服務" className="home-service-rail">
          {SERVICES.map(service => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="home-service-row"
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "home_service_rows",
                  service_name: service.slug,
                  destination_url: `/services/${service.slug}`,
                })
              }
            >
              <service.icon
                className="home-service-row__icon"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              <div className="home-service-row__copy">
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </div>
              <ArrowUpRight
                className="home-service-row__arrow"
                aria-hidden="true"
              />
              <img
                src={`/images/home/service-${service.image}.webp`}
                alt=""
                width="570"
                height="172"
                loading="lazy"
                decoding="async"
              />
            </Link>
          ))}
        </HomeMobileRail>
      </div>
    </section>
  );
}
