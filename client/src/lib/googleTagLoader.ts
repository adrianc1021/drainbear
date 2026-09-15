/** Google tag 載入器。首次瀏覽亦必須可量測，不能等待互動。 */

let started = false;

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
    return;
  }

  started = true;

  const script = document.createElement("script");
  script.async = true;
  script.dataset.drainbearGoogleTag = "true";
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(destinationId);

  document.head.appendChild(script);
}

/**
 * 保留既有呼叫介面，但不能延後第一個 page_view 的量測。
 */
export function scheduleGoogleTag(destinationId: string) {
  loadGoogleTag(destinationId);
}

/** 測試用：重設模組狀態。 */
export function __resetGoogleTagLoaderForTests() {
  started = false;
}
