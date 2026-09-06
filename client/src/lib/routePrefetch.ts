type RouteLoader = () => Promise<unknown>;

export const ROUTE_LOADERS: Record<string, RouteLoader> = {
  "/services": () => import("@/pages/Services"),
  "/services/:slug": () => import("@/pages/ServiceDetail"),
  "/drain-diagnosis": () => import("@/pages/DrainDiagnosis"),
  "/service-process": () => import("@/pages/ServiceProcess"),
  "/guide": () => import("@/pages/GuideRoute"),
  "/areas": () => import("@/pages/Areas"),
  "/areas/:slug": () => import("@/pages/District"),
  "/blog": () => import("@/pages/Blog"),
  "/blog/:slug": () => import("@/pages/BlogPost"),
  "/cases": () => import("@/pages/CaseStudies"),
  "/cases/:slug": () => import("@/pages/CaseStudyDetail"),
  "/faq": () => import("@/pages/FAQ"),
  "/thanks": () => import("@/pages/Thanks"),
};

const prefetchedRoutes = new Set<string>();

/** Start downloading a likely next route without blocking the current page. */
export function prefetchRoute(href: string) {
  const path = href.split(/[?#]/)[0] || "/";
  const key = path.startsWith("/services/")
    ? "/services/:slug"
    : path.startsWith("/areas/")
      ? "/areas/:slug"
      : path.startsWith("/blog/")
        ? "/blog/:slug"
        : path.startsWith("/cases/")
          ? "/cases/:slug"
          : path;
  const loader = ROUTE_LOADERS[key];

  if (!loader || prefetchedRoutes.has(key)) return;

  prefetchedRoutes.add(key);
  void loader().catch(() => {
    prefetchedRoutes.delete(key);
  });
}

export function loadServices() {
  return import("@/pages/Services");
}

export function loadServiceDetail() {
  return import("@/pages/ServiceDetail");
}

export function loadDrainDiagnosis() {
  return import("@/pages/DrainDiagnosis");
}

export function loadServiceProcess() {
  return import("@/pages/ServiceProcess");
}

export function loadAreas() {
  return import("@/pages/Areas");
}

export function loadDistrict() {
  return import("@/pages/District");
}

export function loadFAQ() {
  return import("@/pages/FAQ");
}

export function loadBlog() {
  return import("@/pages/Blog");
}

export function loadBlogPost() {
  return import("@/pages/BlogPost");
}

export function loadCaseStudies() {
  return import("@/pages/CaseStudies");
}

export function loadCaseStudyDetail() {
  return import("@/pages/CaseStudyDetail");
}

export function loadGuide() {
  return import("@/pages/GuideRoute");
}

export function loadThanks() {
  return import("@/pages/Thanks");
}

export function loadNotFound() {
  return import("@/pages/NotFound");
}
