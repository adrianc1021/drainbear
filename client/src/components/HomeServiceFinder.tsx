import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { goThanksAfterWhatsApp, trackCTA } from "@/lib/analytics";
import { DISTRICTS } from "@/lib/districtData";
import { SERVICE_PAGES } from "@/lib/serviceData";
import { ArrowUpRight, Building2, Home, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

const GROUPS = [
  {
    label: "住宅通渠",
    icon: Home,
    slugs: [
      "toilet-unblocking",
      "kitchen-sink-unblocking",
      "bathroom-drain-unblocking",
      "sewage-backflow",
    ],
  },
  {
    label: "食肆及商舖",
    icon: UtensilsCrossed,
    slugs: [
      "grease-trap-cleaning",
      "high-pressure-jetting",
      "kitchen-sink-unblocking",
    ],
  },
  {
    label: "物業渠務",
    icon: Building2,
    slugs: [
      "main-drain-manhole",
      "cctv-drain-inspection",
      "sewage-backflow",
      "high-pressure-jetting",
    ],
  },
] as const;

/** A WhatsApp handoff using real service and district data; no form submission. */
export default function HomeServiceFinder() {
  const [group, setGroup] = useState(0);
  const [serviceSlug, setServiceSlug] = useState<string>(GROUPS[0].slugs[0]);
  const [districtSlug, setDistrictSlug] = useState("");
  const { whatsappHref } = useContactSettings();
  const services = SERVICE_PAGES.filter(service =>
    (GROUPS[group].slugs as readonly string[]).includes(service.slug)
  );
  const service =
    services.find(item => item.slug === serviceSlug) ?? services[0];
  const district = DISTRICTS.find(item => item.slug === districtSlug);
  const message = `你好，我想查詢${service.name}。${district ? `地區是${district.name}。` : ""}我會提供現場相片，想先了解處理方法及報價。`;

  return (
    <section
      className="container home-service-finder"
      aria-label="選擇服務及地區，透過WhatsApp查詢"
    >
      <div className="home-service-finder__panel">
        <div
          className="home-service-finder__types"
          role="group"
          aria-label="場所類型"
        >
          {GROUPS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={group === index}
              onClick={() => {
                setGroup(index);
                setServiceSlug(item.slugs[0]);
              }}
            >
              <item.icon aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="home-service-finder__fields">
          <div>
            <label htmlFor="home-service">需要的服務</label>
            <select
              id="home-service"
              value={service.slug}
              onChange={event => setServiceSlug(event.target.value)}
            >
              {services.map(item => (
                <option value={item.slug} key={item.slug}>
                  {item.shortName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="home-district">服務地區</label>
            <select
              id="home-district"
              value={districtSlug}
              onChange={event => setDistrictSlug(event.target.value)}
            >
              <option value="">選擇地區（可稍後提供）</option>
              {DISTRICTS.map(item => (
                <option value={item.slug} key={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <a
            className="home-service-finder__send"
            href={whatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackCTA("whatsapp", "home_service_finder", service.slug);
              goThanksAfterWhatsApp("home_service_finder");
            }}
          >
            WhatsApp 查詢
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">（另開視窗）</span>
          </a>
        </div>
      </div>
    </section>
  );
}
