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
    copy: "坐廁淤塞、沖水不去或水位異常，先了解受影響範圍。",
    icon: ToiletIcon,
    image: "toilet",
  },
  {
    slug: "kitchen-sink-unblocking",
    title: "鋅盤通渠",
    copy: "廚房鋅盤去水慢、隔氣及支渠淤塞，按入口評估處理。",
    icon: CookingPot,
    image: "sink",
  },
  {
    slug: "bathroom-drain-unblocking",
    title: "浴室淤塞",
    copy: "浴缸、淋浴及地台去水異常，核對共用支渠情況。",
    icon: ShowerHead,
    image: "bathroom",
  },
  {
    slug: "sewage-backflow",
    title: "主渠倒灌",
    copy: "多個位置冒水或污水倒灌，先停用相關水源並傳相查詢。",
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
