import { describe, expect, it } from "vitest";
import { DISTRICTS } from "../../client/src/lib/districtData";
import { SERVICE_PAGES } from "../../client/src/lib/serviceData";
import { DISTRICT_SLUGS, SERVICE_SLUGS } from "../../shared/publicRoutes";
import { isStaticPublicRoute } from "./vite";

describe("public route discovery", () => {
  it("recognizes every published service page without requiring a CMS manifest", () => {
    expect(new Set(SERVICE_SLUGS)).toEqual(
      new Set(SERVICE_PAGES.map(service => service.slug))
    );
    for (const service of SERVICE_PAGES)
      expect(isStaticPublicRoute(`/services/${service.slug}`)).toBe(true);
  });
  it("recognizes the district directory and trailing slash normalization", () => {
    expect(new Set(DISTRICT_SLUGS)).toEqual(
      new Set(DISTRICTS.map(district => district.slug))
    );
    for (const district of DISTRICTS)
      expect(isStaticPublicRoute(`/areas/${district.slug}/`)).toBe(true);
  });
  it("keeps unknown services and districts as real 404 routes", () => {
    expect(isStaticPublicRoute("/services/invented-service")).toBe(false);
    expect(isStaticPublicRoute("/areas/invented-district")).toBe(false);
  });
});
