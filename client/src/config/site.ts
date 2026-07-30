export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://drainbearhk.com"
).replace(/\/+$/, "");

export const SITE_NAME = "通渠熊";
export const BUSINESS_NAME = "通渠熊 DrainBear";
export const BUSINESS_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const PHONE_DISPLAY = "+852 9558 8260";
export const PHONE_E164 = "+85295588260";

export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/pgjztf2p/image/upload/v1785314740/A_pure_black_and_white_vector_mascot_logo_of_a_con-1785146902762_k8ruvx.jpg";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, `${SITE_URL}/`).toString();
}
