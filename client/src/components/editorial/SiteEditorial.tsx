import ContactActions from "@/components/ContactActions";
import type { ReactNode } from "react";

interface EditorialPageHeroProps {
  kicker: string;
  title: ReactNode;
  description: ReactNode;
  contactLocation?: string;
  message?: string;
  topic?: string;
  media?: { src: string; alt: string; caption?: ReactNode };
  className?: string;
}

export function EditorialPageHero({
  kicker,
  title,
  description,
  contactLocation = "page_hero",
  message,
  topic,
  media,
  className = "",
}: EditorialPageHeroProps) {
  return (
    <section
      className={`site-page-hero ${media ? "site-page-hero--with-media" : ""} ${className}`.trim()}
      data-site-editorial="page-hero"
    >
      <div className="site-page-hero__inner">
        <div className="site-page-hero__copy">
          <p className="brand-eyebrow">{kicker}</p>
          <h1 className="site-page-hero__title">{title}</h1>
          <p className="site-page-hero__description">{description}</p>
          <ContactActions
            location={contactLocation}
            message={message}
            topic={topic}
          />
          <p className="contact-note">
            24 小時接受查詢；上門時間及收費按現場情況確認。
          </p>
        </div>
        {media ? (
          <figure className="site-page-hero__media">
            <img
              src={media.src}
              alt={media.alt}
              width="1280"
              height="960"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            {media.caption ? <figcaption>{media.caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </section>
  );
}
