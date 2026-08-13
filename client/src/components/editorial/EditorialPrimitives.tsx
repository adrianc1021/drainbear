import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

function joinClassNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function EditorialKicker({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "light" | "safety";
  className?: string;
}) {
  return (
    <p
      className={joinClassNames(
        "db-kicker",
        tone === "light" && "db-kicker--light",
        tone === "safety" && "db-kicker--safety",
        className
      )}
    >
      <span className="db-kicker__rule" aria-hidden="true" />
      {children}
    </p>
  );
}

export function EditorialHeading({
  children,
  as: Element = "h2",
  className,
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <Element
      id={id}
      className={joinClassNames("db-editorial-heading", className)}
    >
      {children}
    </Element>
  );
}

export function EditorialArrowLink({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a className={joinClassNames("db-arrow-link", className)} {...props}>
      <span>{children}</span>
      <ArrowRight
        className="db-arrow-link__icon"
        strokeWidth={2}
        aria-hidden="true"
      />
    </a>
  );
}

export function EditorialIndex({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={joinClassNames("db-editorial-index", className)}>
      {children}
    </span>
  );
}

export function EditorialRule({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "light";
}) {
  return (
    <span
      aria-hidden="true"
      className={joinClassNames(
        "db-editorial-rule",
        tone === "light" && "db-editorial-rule--light",
        className
      )}
    />
  );
}
