import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { goThanksAfterWhatsApp, trackCTA } from "@/lib/analytics";
import { MessageCircle, Phone } from "lucide-react";

/** Shared contact details and attribution for every service entrance. */
export default function ContactActions({
  location,
  message,
  topic,
  prominent = false,
}: {
  location: string;
  message?: string;
  topic?: string;
  prominent?: boolean;
}) {
  const { phoneDisplay, phoneHref, whatsappDefaultHref, whatsappHref } =
    useContactSettings();
  return (
    <div
      className={`contact-actions ${prominent ? "contact-actions--prominent" : ""}`}
    >
      <a
        className="contact-action contact-action--phone"
        href={phoneHref}
        onClick={() => trackCTA("phone", location, topic)}
      >
        <Phone aria-hidden="true" />
        <span>
          <span className="contact-action__label">24小時特快通渠熱線</span>
          <strong>{phoneDisplay}</strong>
        </span>
      </a>
      <a
        className="contact-action contact-action--whatsapp"
        href={message ? whatsappHref(message) : whatsappDefaultHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackCTA("whatsapp", location, topic);
          goThanksAfterWhatsApp(location);
        }}
      >
        <MessageCircle aria-hidden="true" />
        <span>
          <span className="contact-action__label">WhatsApp 查詢報價</span>
          <strong>傳相片，先了解點處理</strong>
        </span>
        <span className="sr-only">（另開視窗）</span>
      </a>
    </div>
  );
}
