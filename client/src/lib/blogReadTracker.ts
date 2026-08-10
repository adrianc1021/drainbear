/**
 * Blog 文章「實際閱讀」追蹤器(可獨立測試的純邏輯,不直接依賴 React)。
 *
 * 規格:
 * - 捲動達 60% → 立即記錄 blog_read 並 clearTimeout(timer)
 * - 45 秒 Timer 觸發時,先檢查 document.visibilityState === "visible",
 *   分頁在背景時不記錄(scroll listener 保留,返回前景捲動仍可觸發)
 * - 同一次文章瀏覽(同一 tracker 實例)只記錄一次
 * - dispose() 清除 Timer 及 Scroll Listener(Component unmount 時呼叫)
 * - 離開文章再返回 = 新 tracker 實例 = 可重新記錄
 */

export interface BlogReadTrackerDeps {
  /** 實際發送事件(注入 trackBlogRead) */
  report: (slug: string, readPercent?: number) => void;
  /** 目前捲動百分比(0–100);無法計算時回傳 null */
  getScrollPercent: () => number | null;
  /** 分頁是否可見 */
  isVisible: () => boolean;
  addScrollListener: (fn: () => void) => void;
  removeScrollListener: (fn: () => void) => void;
  setTimer: (fn: () => void, ms: number) => number;
  clearTimer: (id: number) => void;
  /** 停留門檻,預設 45 秒 */
  dwellMs?: number;
  /** 捲動門檻,預設 60% */
  scrollThreshold?: number;
}

export interface BlogReadTracker {
  /** 清除 Timer 及 Scroll Listener;冪等 */
  dispose(): void;
  /** 是否已記錄(測試/除錯用) */
  hasReported(): boolean;
}

export function createBlogReadTracker(
  slug: string,
  deps: BlogReadTrackerDeps,
): BlogReadTracker {
  const dwellMs = deps.dwellMs ?? 45_000;
  const scrollThreshold = deps.scrollThreshold ?? 60;

  let reported = false;
  let disposed = false;
  let timerId: number | null = null;

  const cleanup = () => {
    if (timerId !== null) {
      deps.clearTimer(timerId);
      timerId = null;
    }
    deps.removeScrollListener(onScroll);
  };

  const report = (percent?: number) => {
    if (reported || disposed) return;
    reported = true;
    deps.report(slug, percent);
    cleanup(); // 成功記錄後立即清 Timer + Listener,杜絕第二次事件
  };

  function onScroll() {
    if (reported || disposed) return;
    const percent = deps.getScrollPercent();
    if (percent !== null && percent >= scrollThreshold) {
      report(percent);
    }
  }

  timerId = deps.setTimer(() => {
    timerId = null;
    if (reported || disposed) return;
    // 分頁在背景時不視為閱讀;scroll listener 保留,返回後捲動仍可觸發
    if (!deps.isVisible()) return;
    report();
  }, dwellMs);

  deps.addScrollListener(onScroll);

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      cleanup();
    },
    hasReported() {
      return reported;
    },
  };
}

/** 瀏覽器環境的預設依賴(BlogPost Component 使用) */
export function browserBlogReadDeps(
  report: (slug: string, readPercent?: number) => void,
): BlogReadTrackerDeps {
  return {
    report,
    getScrollPercent: () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return null;
      return Math.round((window.scrollY / scrollable) * 100);
    },
    isVisible: () => document.visibilityState === "visible",
    addScrollListener: (fn) =>
      window.addEventListener("scroll", fn, { passive: true }),
    removeScrollListener: (fn) => window.removeEventListener("scroll", fn),
    setTimer: (fn, ms) => window.setTimeout(fn, ms),
    clearTimer: (id) => window.clearTimeout(id),
  };
}
