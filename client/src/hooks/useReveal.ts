/**
 * useReveal — 捲動進場動畫 hook
 *
 * 支援 React.lazy / Suspense：
 * - IntersectionObserver 處理進入 viewport 的動畫。
 * - MutationObserver 處理 route chunk 載入後才加入 DOM 的 .reveal 元素。
 * - 只有 observer 成功初始化後，才在 <html> 加上 reveal-ready。
 *   因此 JavaScript 或 observer 失效時，內容預設可見（fail-open）。
 */
import { useLayoutEffect } from "react";
import { useLocation } from "wouter";

export function useReveal() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;

    // Fail-open：缺少任何必要 observer 時，不啟用隱藏動畫。
    if (
      typeof IntersectionObserver === "undefined" ||
      typeof MutationObserver === "undefined"
    ) {
      root.classList.remove("reveal-ready");
      return;
    }

    let disposed = false;
    const observed = new WeakSet<HTMLElement>();

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const element = entry.target as HTMLElement;
          const delay = Number(element.dataset.revealDelay || 0);

          if (Number.isFinite(delay) && delay > 0) {
            element.style.transitionDelay = `${delay}ms`;
          }

          element.classList.add("reveal-in");
          io.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    const observeElement = (element: HTMLElement) => {
      if (
        disposed ||
        observed.has(element) ||
        element.classList.contains("reveal-in")
      ) {
        return;
      }

      observed.add(element);
      io.observe(element);
    };

    const scanNode = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;

      if (node.matches(".reveal:not(.reveal-in)")) {
        observeElement(node);
      }

      node
        .querySelectorAll<HTMLElement>(".reveal:not(.reveal-in)")
        .forEach(observeElement);
    };

    // 先登記目前已存在的元素，再啟用隱藏動畫，避免無 observer 的透明內容。
    document
      .querySelectorAll<HTMLElement>(".reveal:not(.reveal-in)")
      .forEach(observeElement);

    const mutationObserver = new MutationObserver(records => {
      for (const record of records) {
        record.addedNodes.forEach(scanNode);
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    root.classList.add("reveal-ready");

    return () => {
      disposed = true;
      mutationObserver.disconnect();
      io.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, [location]);
}
