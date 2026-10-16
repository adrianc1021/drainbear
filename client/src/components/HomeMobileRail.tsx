import {
  Children,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** 21st Snap Carousel's peek/navigation pattern, adapted to native CSS scrolling.
 * No autoplay, drag interception or motion runtime; links work without JavaScript.
 */
export default function HomeMobileRail({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const items = Children.toArray(children);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const left = rail.getBoundingClientRect().left;
        const slides = Array.from(rail.children);
        const nearest = slides.reduce(
          (best, slide, i) =>
            Math.abs(slide.getBoundingClientRect().left - left) <
            Math.abs(slides[best].getBoundingClientRect().left - left)
              ? i
              : best,
          0
        );
        setIndex(nearest);
        // A film left outside the viewport must not keep playing in the background.
        slides.forEach(slide => {
          const box = slide.getBoundingClientRect();
          const visibleWidth = Math.max(
            0,
            Math.min(box.right, rail.getBoundingClientRect().right) -
              Math.max(box.left, left)
          );
          if (visibleWidth < box.width / 2)
            slide.querySelectorAll("video").forEach(video => video.pause());
        });
      });
    };
    setEnhanced(true);
    rail.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail.removeEventListener("scroll", update);
    };
  }, []);

  function goTo(next: number) {
    const rail = ref.current;
    const slide = rail?.children[Math.max(0, Math.min(items.length - 1, next))];
    if (!rail || !slide) return;
    rail.scrollTo({
      left:
        rail.scrollLeft +
        slide.getBoundingClientRect().left -
        rail.getBoundingClientRect().left,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div className={`home-mobile-rail ${className}`} data-enhanced={enhanced}>
      <div className="home-mobile-rail__controls">
        <span id={`${id}-hint`} className="sr-only">
          左右掃動，或使用前後按鈕查看更多
        </span>
        <div
          className="home-mobile-rail__buttons"
          role="group"
          aria-label={`${label}切換`}
        >
          <button
            type="button"
            aria-label={`上一項${label}`}
            aria-controls={id}
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <span
            className="home-mobile-rail__count"
            aria-live="polite"
            aria-atomic="true"
          >
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            aria-label={`下一項${label}`}
            aria-controls={id}
            disabled={index === items.length - 1}
            onClick={() => goTo(index + 1)}
          >
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        id={id}
        ref={ref}
        className="home-mobile-rail__track"
        role="group"
        aria-label={label}
        tabIndex={0}
        aria-describedby={`${id}-hint`}
        onKeyDown={event => {
          // Do not steal arrows/Home/End from video controls or descendant links.
          if (
            event.target !== event.currentTarget ||
            !matchMedia("(max-width: 767px)").matches
          )
            return;
          const target = {
            ArrowLeft: index - 1,
            ArrowRight: index + 1,
            Home: 0,
            End: items.length - 1,
          }[event.key];
          if (target === undefined) return;
          event.preventDefault();
          goTo(target);
        }}
      >
        {items}
      </div>
    </div>
  );
}
