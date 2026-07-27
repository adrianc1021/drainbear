/**
 * useReveal — 捲動進場動畫 hook
 * 設計風格：Modern Utility（極簡科技）
 * 配合 index.css 的 .reveal / .reveal-in，用 IntersectionObserver 觸發。
 * 尊重 prefers-reduced-motion（CSS 端已 gate，無動畫時元素直接可見）。
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export function useReveal() {
  const [location] = useLocation();
  useEffect(() => {
    let disposed = false;
    let io: IntersectionObserver | null = null;

    // 等待路由切換後的 DOM 渲染完成
    const raf = requestAnimationFrame(() => {
      if (disposed) return;
      const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.reveal-in)"));
      if (els.length === 0) return;

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const delay = Number(el.dataset.revealDelay || 0);
              if (delay > 0) {
                el.style.transitionDelay = `${delay}ms`;
              }
              el.classList.add("reveal-in");
              io?.unobserve(el);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );

      els.forEach((el) => io?.observe(el));
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [location]);
}
