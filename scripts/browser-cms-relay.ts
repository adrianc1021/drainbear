import type { BrowserContext, Route } from "playwright";

const SANITY_PROJECT_ID = "oyph9zy1";
const SANITY_DATASET = "production";

/** Sanity 查詢端點（api 同 apicdn 兩個 host 都可能出現）。 */
const SANITY_QUERY_PATTERN = new RegExp(
  `^https://${SANITY_PROJECT_ID}\\.api(?:cdn)?\\.sanity\\.io/v[^/]+/data/query/${SANITY_DATASET}\\?`
);

/** 判斷 prerender 目標是否本機 server（而非正式網域）。 */
export function isLocalOrigin(url: string): boolean {
  try {
    return ["127.0.0.1", "localhost", "::1"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * 只有 localhost 需要中繼：Sanity 專案的 CORS 允許清單只列 drainbearhk.com，
 * 瀏覽器由 http://localhost:<port> 直接打 Sanity 會 403 → 頁面設
 * data-cms-error="true" → assessPrerenderSnapshot() 拒絕發佈 fallback HTML，
 * 整個 build 由第一條路由就中斷。
 *
 * 呢個中繼只改寫 access-control-allow-origin，查詢本身同回應 body 完全照抄
 * 上游，所以把關強度不變：Sanity 真正失敗時，錯誤照樣傳回頁面，關卡照樣攔。
 * 只適用於 localhost 建置；正式網域（drainbearhk.com）本來就獲 CORS 放行。
 */
export async function enableCmsRelay(context: BrowserContext, origin: string) {
  const cache = new Map<
    string,
    { status: number; contentType: string; body: string }
  >();

  await context.route(SANITY_QUERY_PATTERN, async (route: Route) => {
    const url = route.request().url();
    const cached = cache.get(url);

    if (cached) {
      await fulfillRelayedCms(route, cached, origin);
      return;
    }

    // 由 Node 代發：Node 唔受 CORS 限制，build log 已證實查詢本身會成功。
    // 剔除瀏覽器帶嘅 origin／referer，避免上游以 CORS 為由拒收。
    const headers = { ...route.request().headers() };
    delete headers.origin;
    delete headers.referer;

    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(30_000),
      });
      const body = await response.text();
      const contentType =
        response.headers.get("content-type") ?? "application/json";

      const relayed = { status: response.status, contentType, body };
      // 快取包括錯誤回應：同一個失敗查詢重試 64 次只會拖慢 build，
      // 唔會改變結果，而且錯誤本身必須原樣傳回頁面。
      cache.set(url, relayed);
      await fulfillRelayedCms(route, relayed, origin);
    } catch (error) {
      // 連線層失敗：明確地令查詢失敗，讓關卡照常攔截，
      // 切勿在這裡回傳假資料。
      console.warn(`Sanity 中繼失敗（${url}）：${String(error)}`);
      await route.abort("failed");
    }
  });

  console.log(
    `CMS 中繼已啟用：${origin} 的 Sanity 查詢會經 Node 代發（唯讀）。`
  );
}

async function fulfillRelayedCms(
  route: Route,
  relayed: { status: number; contentType: string; body: string },
  origin: string
) {
  await route.fulfill({
    status: relayed.status,
    contentType: relayed.contentType,
    headers: { "access-control-allow-origin": origin },
    body: relayed.body,
  });
}
