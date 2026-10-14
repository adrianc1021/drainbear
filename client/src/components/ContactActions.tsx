import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { goThanksAfterWhatsApp, trackCTA } from "@/lib/analytics";
import { ArrowUpRight, Phone } from "lucide-react";

/** Shared contact details and attribution for every service entrance. */
export default function ContactActions({
  location,
  message,
  topic,
  prominent = false,
  whatsappFirst = false,
}: {
  location: string;
  message?: string;
  topic?: string;
  prominent?: boolean;
  whatsappFirst?: boolean;
}) {
  const { phoneDisplay, phoneHref, whatsappDefaultHref, whatsappHref } =
    useContactSettings();
  const phone = (
    <a
      className="contact-action contact-action--phone"
      href={phoneHref}
      aria-label={`致電 ${phoneDisplay}`}
      onClick={() => trackCTA("phone", location, topic)}
    >
      <span className="contact-action__icon" aria-hidden="true">
        <Phone />
      </span>
      <span className="contact-action__copy">
        <span className="contact-action__label">24小時通渠查詢</span>
        <strong>{phoneDisplay}</strong>
      </span>
      <ArrowUpRight className="contact-action__arrow" aria-hidden="true" />
    </a>
  );
  const whatsapp = (
    <a
      className="contact-action contact-action--whatsapp"
      href={message ? whatsappHref(message) : whatsappDefaultHref}
      aria-label="WhatsApp 傳相查詢報價（另開視窗）"
      target="_blank"
      rel="noopener noreferrer"
      onClick={event => {
        trackCTA("whatsapp", location, topic);
        goThanksAfterWhatsApp(location, event.currentTarget.href);
      }}
    >
      <span className="contact-action__icon" aria-hidden="true">
        <WhatsAppIcon />
      </span>
      <span className="contact-action__copy">
        <span className="contact-action__label">WhatsApp 查詢報價</span>
        <strong>傳相片，問報價</strong>
      </span>
      <ArrowUpRight className="contact-action__arrow" aria-hidden="true" />
      <span className="sr-only">（另開視窗）</span>
    </a>
  );
  return (
    <div
      className={`contact-actions ${prominent ? "contact-actions--prominent" : ""}`}
    >
      {whatsappFirst ? (
        <>
          {whatsapp}
          {phone}
        </>
      ) : (
        <>
          {phone}
          {whatsapp}
        </>
      )}
    </div>
  );
}
