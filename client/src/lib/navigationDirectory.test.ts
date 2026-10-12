import { describe, expect, it } from "vitest";
import { DISTRICTS } from "./districtData";
import { SERVICE_PAGES } from "./serviceData";
import { DISTRICT_SLUGS, SERVICE_SLUGS } from "@shared/publicRoutes";
import { DISTRICT_DIRECTORY, SERVICE_DIRECTORY } from "./navigationDirectory";

describe("lightweight navigation directory", () => {
  it("retains every published service name, image and route without loading its editorial body", () => {
    expect(SERVICE_DIRECTORY).toEqual(
      SERVICE_PAGES.map(({ slug, name, shortName, image, imageAlt }) => ({
        slug,
        name,
        shortName,
        image,
        imageAlt,
      }))
    );
    expect(SERVICE_DIRECTORY.map(item => item.slug).sort()).toEqual(
      [...SERVICE_SLUGS].sort()
    );
  });
  it("retains every district label and sitemap route", () => {
    expect(DISTRICT_DIRECTORY).toEqual(
      DISTRICTS.map(({ slug, name }) => ({ slug, name }))
    );
    expect(DISTRICT_DIRECTORY.map(item => item.slug)).toEqual([
      ...DISTRICT_SLUGS,
    ]);
  });
});
