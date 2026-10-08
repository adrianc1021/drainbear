/** WhatsApp navigation guidance; an external handoff is not a received message. */
import { useEffect } from "react";
import { Link } from "wouter";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import { trackCTA, trackWhatsAppHandoff } from "@/lib/analytics";
import { consumeWhatsAppHandoff } from "@/lib/trackingSession";

export default function Thanks() {
  const { phoneDisplay, phoneHref, whatsappDefaultHref } = useContactSettings();
  useEffect(() => {
    const handoff = consumeWhatsAppHandoff();
    if (handoff)
      trackWhatsAppHandoff(handoff.cta_location, handoff.attribution);
  }, []);
  return (
    <div className="handoff-page">
      <SEO
        title="請在 WhatsApp 傳送現場資料｜通渠熊"
        description="請在 WhatsApp 補充地區、問題位置及相片，並按傳送。未能開啟時可重試或直接致電。"
        path="/thanks"
        noindex
        nofollow
      />
      <section className="brand-section brand-status-page">
        <div className="container brand-narrow handoff-card">
          <span className="handoff-card__icon">
            <MessageCircle aria-hidden="true" />
          </span>
          <p className="brand-eyebrow">完成查詢的下一步</p>
          <h1>
            請在 WhatsApp
            <br />
            傳送現場資料
          </h1>
          <p>
            開啟對話後，補充地區、堵塞位置及相片，再按「傳送」。團隊收到訊息後會按資料跟進。
          </p>
          <p className="handoff-card__note">
            如未開啟 WhatsApp，請使用下方入口重試，或直接致電。
          </p>
          <div className="handoff-card__actions">
            <a
              href={whatsappDefaultHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA("whatsapp", "thanks_retry")}
            >
              <MessageCircle aria-hidden="true" />
              再次開啟 WhatsApp<span className="sr-only">（另開視窗）</span>
            </a>
            <a
              href={phoneHref}
              onClick={() => trackCTA("phone", "thanks_fallback")}
            >
              <Phone aria-hidden="true" />
              致電 {phoneDisplay}
            </a>
          </div>
          <nav className="related-inline" aria-label="返回網站內容">
            <Link href="/">
              返回首頁 <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/service-process">了解服務流程</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
