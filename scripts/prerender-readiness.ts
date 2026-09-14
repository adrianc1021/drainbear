export interface PrerenderSnapshot {
  title: string;
  canonicalHref: string | null;
  rootText: string | null;
  heading: string | null;
  seoReady: string | null;
  seoCmsError: string | null;
  cmsLoadingCount: number;
  cmsErrorCount: number;
  robots: string | null;
  googlebot: string | null;
}

export function assessPrerenderSnapshot(
  state: PrerenderSnapshot,
  route: string,
  siteUrl = "https://drainbearhk.com"
): { ready: boolean; error?: string } {
  const expectedPath = route.replace(/\/+$/, "") || "/";
  let canonical: URL;
  try {
    canonical = new URL(state.canonicalHref || "");
  } catch {
    return { ready: false };
  }
  const canonicalPath = canonical.pathname.replace(/\/+$/, "") || "/";
  if (canonicalPath !== expectedPath) return { ready: false };
  if (canonical.origin !== new URL(siteUrl).origin) {
    return {
      ready: false,
      error: `Canonical points outside the production site: ${canonical.href}`,
    };
  }
  if (state.seoCmsError === "true" || state.cmsErrorCount > 0) {
    return {
      ready: false,
      error:
        "CMS content or metadata failed to load; refusing to publish fallback HTML.",
    };
  }
  if (
    /^(?:暫時無法載入文章|文章暫時未能載入|找不到(?:頁面|文章|工程案例)|404|(?:page )?not found)$/i.test(
      state.heading?.trim() || ""
    )
  ) {
    return {
      ready: false,
      error: "The page contains an error/not-found heading.",
    };
  }
  if (
    !state.title ||
    !state.rootText?.trim() ||
    !state.heading?.trim() ||
    state.seoReady !== "true" ||
    state.cmsLoadingCount > 0
  ) {
    return { ready: false };
  }
  const robotsNoindex = /(?:^|[\s,])noindex(?:$|[\s,])/i.test(
    state.robots || ""
  );
  const googlebotNoindex = /(?:^|[\s,])noindex(?:$|[\s,])/i.test(
    state.googlebot || ""
  );
  if (expectedPath === "/thanks")
    return { ready: robotsNoindex && googlebotNoindex };
  if (robotsNoindex || googlebotNoindex) {
    return {
      ready: false,
      error: "An indexable sitemap route is marked noindex.",
    };
  }
  return { ready: true };
}
