import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import {
  goThanksAfterWhatsApp,
  trackCTA,
  trackNavClick,
} from "@/lib/analytics";
import { DISTRICTS } from "@/lib/districtData";
import { getServicePage } from "@/lib/serviceData";
import { CUSTOMER_JOURNEYS } from "@shared/customerJourneys";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Home,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const ICONS = [Home, UtensilsCrossed, Building2];

/** A single problem entrance for three customer groups, with optional district context. */
export default function HomeServiceFinder() {
  const [group, setGroup] = useState(0);
  const [districtSlug, setDistrictSlug] = useState("");
  const { whatsappHref } = useContactSettings();
  const selected = CUSTOMER_JOURNEYS[group];
  const district = DISTRICTS.find(item => item.slug === districtSlug);
  const message = `${selected.message}${district ? `\n所在地區：${district.name}` : ""}`;
  return (
    <section
      className="brand-section home-problems"
      aria-labelledby="home-services-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="brand-eyebrow">由眼前嘅問題開始</p>
            <h2 id="home-services-heading">塞邊度？搵啱處理方法。</h2>
          </div>
          <Link href="/drain-diagnosis">
            未確定？先做問題判斷 <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="home-service-finder__panel">
          <div
            className="home-service-finder__types"
            role="group"
            aria-label="場所類型"
          >
            {CUSTOMER_JOURNEYS.map((customer, i) => {
              const Icon = ICONS[i];
              return (
                <button
                  key={customer.slug}
                  type="button"
                  aria-label={customer.name}
                  aria-pressed={group === i}
                  aria-controls={`home-finder-${customer.slug}`}
                  onClick={() => setGroup(i)}
                >
                  <Icon aria-hidden="true" />
                  {customer.shortName}
                </button>
              );
            })}
          </div>
          {CUSTOMER_JOURNEYS.map((customer, i) => (
            <div
              className="home-finder-content"
              id={`home-finder-${customer.slug}`}
              key={customer.slug}
              hidden={i !== group}
            >
              <div className="home-finder-content__intro">
                <p>{customer.description}</p>
                <Link href={`/customers/${customer.slug}`}>
                  查看查詢資料 <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              <nav
                className="home-finder-services"
                aria-label={`${customer.name}相關服務`}
              >
                {customer.serviceSlugs.map(slug => {
                  const service = getServicePage(slug)!;
                  return (
                    <Link
                      key={slug}
                      href={`/services/${slug}`}
                      onClick={() =>
                        trackNavClick("service", {
                          cta_location: "home_customer_finder",
                          service_name: slug,
                          cta_label: service.shortName,
                          destination_url: `/services/${slug}`,
                        })
                      }
                    >
                      <span>
                        <strong>{service.shortName}</strong>
                        <span>{service.answerSummary.handles}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
          <div className="home-service-finder__fields">
            <div>
              <label htmlFor="home-district">所在地區（可稍後提供）</label>
              <select
                id="home-district"
                value={districtSlug}
                onChange={event => setDistrictSlug(event.target.value)}
              >
                <option value="">先了解處理方法</option>
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
                trackCTA("whatsapp", "home_service_finder", selected.slug);
                goThanksAfterWhatsApp("home_service_finder");
              }}
            >
              <WhatsAppIcon aria-hidden="true" />
              傳送現場資料 <ArrowUpRight aria-hidden="true" />
              <span className="sr-only">（另開視窗）</span>
            </a>
          </div>
        </div>
        <aside
          className="home-safety-note"
          aria-labelledby="home-safety-heading"
        >
          <ShieldCheck aria-hidden="true" />
          <div>
            <h3 id="home-safety-heading">污水倒灌？先停用相關水源。</h3>
            <p>停止沖廁，避免接觸污水；不要加入或混合通渠水。</p>
          </div>
          <Link href="/services/sewage-backflow">
            查看處理建議 <ArrowRight aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
