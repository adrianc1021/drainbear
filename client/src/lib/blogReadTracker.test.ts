import { beforeEach, describe, expect, it } from "vitest";
import {
  createBlogReadTracker,
  type BlogReadTrackerDeps,
} from "./blogReadTracker";

/** 假環境:手動控制 scroll、timer、visibility */
function createFakeEnv() {
  const reports: Array<{ slug: string; readPercent?: number }> = [];
  let scrollPercent: number | null = 0;
  let visible = true;
  const scrollListeners = new Set<() => void>();
  const timers = new Map<number, () => void>();
  let nextTimerId = 1;

  const deps: BlogReadTrackerDeps = {
    report: (slug, readPercent) => reports.push({ slug, readPercent }),
    getScrollPercent: () => scrollPercent,
    isVisible: () => visible,
    addScrollListener: (fn) => scrollListeners.add(fn),
    removeScrollListener: (fn) => scrollListeners.delete(fn),
    setTimer: (fn, _ms) => {
      const id = nextTimerId++;
      timers.set(id, fn);
      return id;
    },
    clearTimer: (id) => timers.delete(id),
  };

  return {
    deps,
    reports,
    setScrollPercent(v: number | null) {
      scrollPercent = v;
    },
    setVisible(v: boolean) {
      visible = v;
    },
    fireScroll() {
      for (const fn of [...scrollListeners]) fn();
    },
    /** 觸發所有仍存在的 timer(模擬 45 秒到期) */
    fireTimers() {
      for (const [id, fn] of [...timers]) {
        timers.delete(id);
        fn();
      }
    },
    get activeTimerCount() {
      return timers.size;
    },
    get scrollListenerCount() {
      return scrollListeners.size;
    },
  };
}

describe("createBlogReadTracker", () => {
  let env: ReturnType<typeof createFakeEnv>;

  beforeEach(() => {
    env = createFakeEnv();
  });

  it("捲動達 60% 時記錄 blog_read 一次", () => {
    const tracker = createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(65);
    env.fireScroll();
    expect(env.reports).toEqual([{ slug: "post-a", readPercent: 65 }]);
    expect(tracker.hasReported()).toBe(true);
  });

  it("捲動未達 60% 時不記錄", () => {
    createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(59);
    env.fireScroll();
    expect(env.reports).toHaveLength(0);
  });

  it("Scroll 成功後立即清除 Timer,Timer 不會造成第二次事件", () => {
    createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(80);
    env.fireScroll();
    expect(env.reports).toHaveLength(1);
    // 成功記錄後 timer 應已被 clear
    expect(env.activeTimerCount).toBe(0);
    // 即使強行觸發殘留 timer(模擬 race),也不會有第二次事件
    env.fireTimers();
    expect(env.reports).toHaveLength(1);
  });

  it("Scroll 成功後 Scroll Listener 亦已移除", () => {
    createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(70);
    env.fireScroll();
    expect(env.scrollListenerCount).toBe(0);
    env.fireScroll();
    expect(env.reports).toHaveLength(1);
  });

  it("45 秒 Timer 到期且分頁可見時記錄(不帶 readPercent)", () => {
    createBlogReadTracker("post-a", env.deps);
    env.fireTimers();
    expect(env.reports).toEqual([{ slug: "post-a", readPercent: undefined }]);
  });

  it("45 秒 Timer 到期但分頁不可見時不記錄", () => {
    createBlogReadTracker("post-a", env.deps);
    env.setVisible(false);
    env.fireTimers();
    expect(env.reports).toHaveLength(0);
    // 返回前景後捲動仍可觸發(listener 未被移除)
    env.setVisible(true);
    env.setScrollPercent(90);
    env.fireScroll();
    expect(env.reports).toHaveLength(1);
  });

  it("同一次文章瀏覽(同一實例)只記錄一次", () => {
    createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(70);
    env.fireScroll();
    env.setScrollPercent(95);
    env.fireScroll();
    env.fireTimers();
    expect(env.reports).toHaveLength(1);
  });

  it("新一次文章瀏覽(新實例)可以重新記錄", () => {
    const first = createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(70);
    env.fireScroll();
    expect(env.reports).toHaveLength(1);

    first.dispose(); // 模擬 unmount
    const second = createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(70);
    env.fireScroll();
    expect(env.reports).toHaveLength(2);
    expect(second.hasReported()).toBe(true);
  });

  it("dispose() 清除 Timer 及 Scroll Listener,之後不會再記錄", () => {
    const tracker = createBlogReadTracker("post-a", env.deps);
    expect(env.activeTimerCount).toBe(1);
    expect(env.scrollListenerCount).toBe(1);

    tracker.dispose();
    expect(env.activeTimerCount).toBe(0);
    expect(env.scrollListenerCount).toBe(0);

    env.setScrollPercent(100);
    env.fireScroll();
    env.fireTimers();
    expect(env.reports).toHaveLength(0);
  });

  it("dispose() 冪等,重複呼叫不拋錯", () => {
    const tracker = createBlogReadTracker("post-a", env.deps);
    tracker.dispose();
    expect(() => tracker.dispose()).not.toThrow();
  });

  it("getScrollPercent 回傳 null(頁面不可捲動)時不記錄", () => {
    createBlogReadTracker("post-a", env.deps);
    env.setScrollPercent(null);
    env.fireScroll();
    expect(env.reports).toHaveLength(0);
  });
});
