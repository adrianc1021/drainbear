/**
 * Google tag 延遲載入器。
 *
 * config 命令會先排入 dataLayer；外部 gtag.js 只在首次互動後下載，
 * 沒有互動時則在頁面 load 後保留一段緩衝時間才載入。
 */

const FALLBACK_DELAY_MS = 10_000;

let scheduled = false;
let started = false;
let scheduledId: string | undefined;
let timerId: number | undefined;

function removeInteractionListeners() {
  if (
    typeof window === "undefined" ||
    typeof window.removeEventListener !== "function"
  ) {
    return;
  }

  window.removeEventListener("pointerdown", handleInteraction);
  window.removeEventListener("touchstart", handleInteraction);
  window.removeEventListener("keydown", handleInteraction);
  window.removeEventListener("load", handleWindowLoad);
}

function cleanupSchedule() {
  removeInteractionListeners();

  if (typeof window !== "undefined" && timerId !== undefined) {
    window.clearTimeout(timerId);
  }

  timerId = undefined;
}

function handleInteraction() {
  if (scheduledId) loadGoogleTag(scheduledId);
}

function handleWindowLoad() {
  if (typeof window === "undefined" || !scheduledId || started) return;

  timerId = window.setTimeout(() => {
    if (scheduledId) loadGoogleTag(scheduledId);
  }, FALLBACK_DELAY_MS);
}

/** 立即啟動 gtag.js；重複呼叫只會載入一次。 */
export function loadGoogleTag(destinationId: string) {
  if (
    started ||
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    return;
  }

  const existing = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );

  if (existing) {
    started = true;
    cleanupSchedule();
    return;
  }

  started = true;
  cleanupSchedule();

  const script = document.createElement("script");
  script.async = true;
  script.fetchPriority = "low";
  script.dataset.drainbearGoogleTag = "true";
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(destinationId);

  document.head.appendChild(script);
}

/** 首次互動立即載入；無互動時在 window load 後延遲載入。 */
export function scheduleGoogleTag(destinationId: string) {
  if (
    scheduled ||
    started ||
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    return;
  }

  scheduled = true;
  scheduledId = destinationId;

  window.addEventListener("pointerdown", handleInteraction, {
    once: true,
    passive: true,
  });
  window.addEventListener("touchstart", handleInteraction, {
    once: true,
    passive: true,
  });
  window.addEventListener("keydown", handleInteraction, { once: true });

  if (document.readyState === "complete") {
    handleWindowLoad();
  } else {
    window.addEventListener("load", handleWindowLoad, { once: true });
  }
}

/** 測試用：重設模組狀態。 */
export function __resetGoogleTagLoaderForTests() {
  cleanupSchedule();
  scheduled = false;
  started = false;
  scheduledId = undefined;
}
