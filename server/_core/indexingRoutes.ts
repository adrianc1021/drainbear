/** Retire obsolete guide filters without turning arbitrary missing URLs into redirects. */
const LEGACY_GUIDE_TARGETS: Record<string, string> = {
  toilet: "/services/toilet-unblocking",
  shower: "/services/bathroom-drain-unblocking",
  mainpipe: "/services/main-drain-manhole",
};
export function legacyGuideRedirect(originalUrl: string): string | null {
  const url = new URL(originalUrl, "https://drainbearhk.com");
  if (!/^\/guide\/?$/.test(url.pathname) || !url.searchParams.has("location"))
    return null;
  const locations = url.searchParams.getAll("location");
  if (locations.length !== 1) return null;
  const location = locations[0];
  const destination =
    location === ""
      ? "/guide"
      : Object.hasOwn(LEGACY_GUIDE_TARGETS, location)
        ? LEGACY_GUIDE_TARGETS[location]
        : null;
  if (!destination) return null;
  url.searchParams.delete("location");
  const search = url.searchParams.toString();
  return destination + (search ? `?${search}` : "");
}
export function publicDocumentStatus(
  pathname: string,
  known: boolean
): 200 | 404 {
  return !known || /^\/404(?:\.html)?\/?$/.test(pathname) ? 404 : 200;
}
