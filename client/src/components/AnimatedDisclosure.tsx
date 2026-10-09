import { ChevronDown } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

function setContentInert(details: HTMLDetailsElement, inert: boolean) {
  const body = details.lastElementChild;
  if (body instanceof HTMLElement) body.inert = inert;
}

/** Native disclosure keeps links available in HTML and works without JavaScript. */
export default function AnimatedDisclosure({
  id,
  title,
  description,
  className = "",
  children,
}: {
  id: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const revealAnchor = () => {
      let anchor: string;
      try {
        anchor = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const details = ref.current;
      const target = anchor ? document.getElementById(anchor) : null;
      if (!details || !target || !details.contains(target)) return;
      details.open = true;
      setContentInert(details, false);
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "instant", block: "start" })
      );
    };
    revealAnchor();
    window.addEventListener("hashchange", revealAnchor);
    return () => window.removeEventListener("hashchange", revealAnchor);
  }, [id]);
  return (
    <details
      ref={ref}
      id={id}
      className={`brand-disclosure ${className}`}
      onToggle={event => {
        // Closing transitions keep the body painted briefly. Remove its links
        // from interaction immediately, and restore them on native opening.
        setContentInert(event.currentTarget, !event.currentTarget.open);
      }}
    >
      <summary
        aria-controls={`${id}-content`}
        onClick={event => {
          // Keyboard activation also clicks summary. Run before the native
          // toggle: its toggle event may arrive after a visitor's next Tab.
          const details = event.currentTarget.parentElement;
          if (details instanceof HTMLDetailsElement)
            setContentInert(details, details.open);
        }}
      >
        <span className="brand-disclosure__heading">
          <span className="brand-disclosure__title">{title}</span>
          {description ? (
            <span className="brand-disclosure__description">{description}</span>
          ) : null}
        </span>
        <ChevronDown className="brand-disclosure__chevron" aria-hidden="true" />
      </summary>
      <div id={`${id}-content`} className="brand-disclosure__body">
        {children}
      </div>
    </details>
  );
}
