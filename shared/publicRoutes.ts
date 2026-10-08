/** Source of truth for static service, customer and district route discovery. */
export const CUSTOMER_SLUGS = [
  "residential",
  "restaurants",
  "property-management",
] as const;
export const COMPANY_ROUTES = [
  "/about",
  ...CUSTOMER_SLUGS.map(slug => `/customers/${slug}`),
] as const;
export const SERVICE_SLUGS = [
  "toilet-unblocking",
  "kitchen-sink-unblocking",
  "bathroom-drain-unblocking",
  "sewage-backflow",
  "grease-trap-cleaning",
  "high-pressure-jetting",
  "cctv-drain-inspection",
  "main-drain-manhole",
] as const;

export const DISTRICT_SLUGS = [
  "kwun-tong",
  "sha-tin",
  "mong-kok",
  "sham-shui-po",
  "causeway-bay",
  "north-point",
  "tsuen-wan",
  "yuen-long",
  "tuen-mun",
  "tseung-kwan-o",
  "central-western",
  "southern",
  "kowloon-city",
  "kwai-tsing",
  "wong-tai-sin",
  "islands",
  "north-district",
  "tai-po",
] as const;
