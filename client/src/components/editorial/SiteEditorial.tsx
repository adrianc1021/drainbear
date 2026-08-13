import type { ReactNode } from "react";

interface EditorialPageHeroProps {
  kicker: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function EditorialPageHero({
  kicker,
  title,
  description,
  actions,
  className = "",
}: EditorialPageHeroProps) {
  return (
    <section
      className={`site-page-hero ${className}`.trim()}
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
        </div>
      </div>
    </section>
  );
}
