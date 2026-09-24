import type { ReactNode } from "react";
import GhostFibers from "@/components/GhostFibers/GhostFibers";

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
  fibers?: boolean;
}

export function EditorialPageHero({
  kicker,
  title,
  description,
  actions,
  media,
  className = "",
  fibers = true,
}: EditorialPageHeroProps) {
  return (
    <section
      className={`site-page-hero ${media ? "site-page-hero--with-media" : ""} ${className}`.trim()}
      data-site-editorial="page-hero"
    >
      {fibers ? (
        <GhostFibers
          className="site-page-hero__fibers"
          lineColor="#8ed8f4"
          glowColor="#176da5"
          backgroundColor="#003566"
          speed={0.055}
          scale={2.8}
          rotationSpeed={0.035}
          layers={3}
          glowIntensity={0.45}
          brightness={0.72}
          grain={0.008}
          fps={18}
        />
      ) : null}
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
