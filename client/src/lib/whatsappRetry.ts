/** Short-lived retry context stays in this tab and never enters analytics. */
const KEY = "drainbear_whatsapp_retry_v1";
const MAX_AGE_MS = 15 * 60 * 1000;

function whatsappUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (
      value.length > 8000 ||
      url.origin !== "https://wa.me" ||
      !/^\/[1-9]\d{7,14}$/.test(url.pathname) ||
      url.username ||
      url.password ||
      url.hash ||
      Array.from(url.searchParams.keys()).some(key => key !== "text")
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export function rememberWhatsAppRetry(destination?: string) {
  if (typeof window === "undefined") return;
  try {
    const url = destination ? whatsappUrl(destination) : null;
    if (!url) {
      window.sessionStorage.removeItem(KEY);
      return;
    }
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ url: url.href, createdAt: Date.now() })
    );
  } catch {
    /* Storage can be unavailable; the normal contact entrance remains. */
  }
}

export function getWhatsAppRetryHref(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(KEY) || "null");
    const url =
      value && typeof value.url === "string" ? whatsappUrl(value.url) : null;
    const contact = whatsappUrl(fallback);
    const age = Date.now() - value?.createdAt;
    if (
      url &&
      contact &&
      url.pathname === contact.pathname &&
      typeof value.createdAt === "number" &&
      Number.isFinite(age) &&
      age >= 0 &&
      age <= MAX_AGE_MS
    )
      return url.href;
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* Missing or invalid retry context falls back to the current contact. */
  }
  return fallback;
}
