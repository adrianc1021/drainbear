import ServiceIllustration from "@/components/ServiceIllustration";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import { getServiceVisual } from "@/lib/serviceVisuals";
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
  CircleHelp,
  Home,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const ICONS = [Home, UtensilsCrossed, Building2];
const COMMON_SERVICES = [
  { slug: "toilet-unblocking", label: "坐廁通渠" },
  { slug: "kitchen-sink-unblocking", label: "鋅盤通渠" },
  { slug: "bathroom-drain-unblocking", label: "浴室通渠" },
  { slug: "grease-trap-cleaning", label: "隔油池清理" },
  { slug: "main-drain-manhole", label: "主渠及沙井通渠" },
];

/** A single problem entrance for three customer groups, with optional district context. */
export default function HomeServiceFinder() {
  const [group, setGroup] = useState(0);
  const [districtSlug, setDistrictSlug] = useState("");
  const [serviceChoices, setServiceChoices] = useState<Record<string, string>>(
    {}
  );
  const { whatsappHref } = useContactSettings();
  const selected = CUSTOMER_JOURNEYS[group];
  const serviceSlug = serviceChoices[selected.slug] || selected.serviceSlugs[0];
  const service = getServicePage(serviceSlug);
  const district = DISTRICTS.find(item => item.slug === districtSlug);
  const intakeMessage = selected.message.replace(
    /地區(?:及店舖類型|及物業類型)?：/,
    label => `${label}${district?.name || ""}`
  );
  const message = `${intakeMessage}\n需要的服務：${service?.shortName || "未確定，想先了解處理方法"}`;
  return (
    <section
      className="brand-section home-problems home-service-finder"
      aria-labelledby="home-services-heading"
      data-home-section="quick-inquiry"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="brand-eyebrow">由眼前嘅問題開始</p>
            <h2 id="home-services-heading">香港通渠服務</h2>
          </div>
          <Link href="/drain-diagnosis">
            未確定？先做問題判斷 <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <p className="section-heading-description">
          為住宅、食肆及物業處理坐廁、鋅盤、浴室淤塞及主渠倒灌；亦可查詢隔油池清理、高壓洗渠及
          CCTV 照喉。
        </p>
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
                  aria-controls={`home-finder-query home-finder-${customer.slug}`}
                  onClick={() => setGroup(i)}
                >
                  <Icon aria-hidden="true" />
                  {customer.shortName}
                </button>
              );
            })}
          </div>
          <div className="home-finder-query" id="home-finder-query">
            <div className="home-service-finder__fields">
              <div>
                <label htmlFor="home-service">需要的服務</label>
                <select
                  id="home-service"
                  value={serviceSlug}
                  onChange={event =>
                    setServiceChoices(choices => ({
                      ...choices,
                      [selected.slug]: event.target.value,
                    }))
                  }
                >
                  {selected.serviceSlugs.map(slug => (
                    <option value={slug} key={slug}>
                      {getServicePage(slug)!.shortName}
                    </option>
                  ))}
                  <option value="unsure">未確定，先查詢</option>
                </select>
              </div>
              <div>
                <label htmlFor="home-district">服務地區（可稍後提供）</label>
                <select
                  id="home-district"
                  value={districtSlug}
                  onChange={event => setDistrictSlug(event.target.value)}
                >
                  <option value="">選擇地區</option>
                  {DISTRICTS.map(item => (
                    <option value={item.slug} key={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="home-finder-query__preview" aria-hidden="true">
              {service ? (
                <ServiceIllustration slug={serviceSlug} compact />
              ) : (
                <CircleHelp />
              )}
            </div>
            <a
              className="home-service-finder__send"
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={event => {
                trackCTA("whatsapp", "home_service_finder", serviceSlug);
                goThanksAfterWhatsApp(
                  "home_service_finder",
                  event.currentTarget.href
                );
              }}
            >
              <WhatsAppIcon aria-hidden="true" />
              WhatsApp 查詢 <ArrowUpRight aria-hidden="true" />
              <span className="sr-only">（另開視窗）</span>
            </a>
            <p className="home-finder-query__hint">
              已選資料會帶入訊息，相片可在 WhatsApp 補充。
            </p>
          </div>
          {CUSTOMER_JOURNEYS.map((customer, i) => (
            <div
              className="home-finder-content"
              id={`home-finder-${customer.slug}`}
              key={customer.slug}
              hidden={i !== group}
            >
              <AnimatedDisclosure
                id={`home-finder-options-${customer.slug}`}
                title="睇圖了解處理方法"
                className="home-finder-options"
              >
                <div className="home-finder-content__intro">
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
                        <ServiceIllustration
                          slug={slug}
                          compact
                          sizes="(max-width: 1023px) 40vw, 96px"
                        />
                        <span className="home-finder-services__copy">
                          <strong>{service.shortName}</strong>
                          <span>{getServiceVisual(slug).summary}</span>
                          <ArrowUpRight aria-hidden="true" />
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </AnimatedDisclosure>
            </div>
          ))}
        </div>
        <nav className="home-service-finder__links" aria-label="常用通渠服務">
          {COMMON_SERVICES.map(item => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              onClick={() =>
                trackNavClick("service", {
                  cta_location: "home_common_services",
                  service_name: item.slug,
                  cta_label: item.label,
                  destination_url: `/services/${item.slug}`,
                })
              }
            >
              {item.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
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
