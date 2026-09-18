import type { ReactNode } from "react";

interface EditorialPageHeroProps {
  kicker: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  media?: {
    src: string;
    alt: string;
    caption?: ReactNode;
  };
  className?: string;
}

export function EditorialPageHero({
  kicker,
  title,
  description,
  actions,
  media,
  className = "",
}: EditorialPageHeroProps) {
  return (
    <section
      className={`site-page-hero ${media ? "site-page-hero--with-media" : ""} ${className}`.trim()}
      data-site-editorial="page-hero"
    >
      <div className="site-page-hero__inner">
        <div className="site-page-hero__heading">
          <p className="site-editorial-kicker">
            <span aria-hidden="true" />
            {kicker}
          </p>

          <h1 className="site-page-hero__title">{title}</h1>
        </div>

        <div className="site-page-hero__support">
          <p className="site-page-hero__description">{description}</p>
          {actions ? (
            <div className="site-page-hero__actions">{actions}</div>
          ) : null}

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
      </div>
    </section>
  );
}
