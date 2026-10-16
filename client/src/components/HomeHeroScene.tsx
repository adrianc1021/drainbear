import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Scroll geometry adapted from 21st Parallax Image (pulkitxm, 20023).
 * Native rAF avoids adding a motion runtime to the first viewport.
 */
export default function HomeHeroScene() {
  const scene = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    const update = () => {
      frame = 0;
      const active = !query.matches && !paused && visible && !document.hidden;
      el.dataset.sceneActive = String(active);
      if (!active) {
        el.style.setProperty("--scene-shift", "0px");
        return;
      }
      const rect = el.getBoundingClientRect();
      const intensity = window.innerWidth < 768 ? 8 : 26;
      const progress = Math.max(
        -1,
        Math.min(1, (rect.top + rect.height / 2) / window.innerHeight - 0.5)
      );
      el.style.setProperty("--scene-shift", `${progress * intensity}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const preference = () => {
      setReduced(query.matches);
      schedule();
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            schedule();
          });
    observer?.observe(el);
    query.addEventListener("change", preference);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    preference();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      query.removeEventListener("change", preference);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [paused]);
  return (
    <figure ref={scene} className="home-hero__media">
      <picture>
        <source
          media="(max-width: 479px)"
          srcSet="/images/home/light-water-mobile-640.webp 640w, /images/home/light-water-mobile-960.webp 960w"
          sizes="100vw"
        />
        <img
          src="/images/home/light-water.webp"
          srcSet="/images/home/light-water-960.webp 960w, /images/home/light-water.webp 1685w"
          sizes="100vw"
          width="1685"
          height="933"
          fetchPriority="high"
          decoding="async"
          alt="品牌示意：白熊戴安全帽、手持工具，站在香港夜景與流動渠水前"
        />
      </picture>
      <span className="home-hero__water" aria-hidden="true" />
      {!reduced && (
        <button
          type="button"
          className="home-scene-control"
          onClick={() => setPaused(value => !value)}
          aria-pressed={paused}
          aria-label={paused ? "啟動主視覺動效" : "暫停主視覺動效"}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          <span>{paused ? "啟動動效" : "暫停動效"}</span>
        </button>
      )}
    </figure>
  );
}
