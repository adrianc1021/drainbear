import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BUSINESS_NAME,
  DEFAULT_OG_IMAGE,
  SITE_URL,
} from "@/config/site";
import {
  PHONE_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/contact";
import type {SiteSettings} from "@/lib/sanity/types";

const FALLBACK_SITE_SETTINGS: SiteSettings = {
  businessName: BUSINESS_NAME,
  siteUrl: SITE_URL,
  businessDescription:
    "通渠熊 DrainBear 提供香港住宅、商舖及辦公室通渠服務，處理廚房、浴室、座廁及渠管淤塞問題，提供清晰報價、快速聯絡及實用渠務保養資訊。",
  phoneDisplay: PHONE_DISPLAY,
  phoneE164: "+85295588260",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDefaultMessage: "你好，我想查詢通渠服務及報價。",
  googleBusinessUrl:
    "https://www.google.com/maps/search/%E9%80%9A%E6%B8%A0%E7%86%8A+DrainBear",
  featuredBlogCount: 3,
  featuredCaseCount: 3,
  defaultOgImage: {
    url: DEFAULT_OG_IMAGE,
    alt: "通渠熊 DrainBear 香港24小時專業通渠服務",
  },
  defaultSeo: {
    metaTitle:
      "通渠熊 DrainBear｜24小時通渠公司・全港特快上門・不成功不收費",
    metaDescription:
      "香港通渠救星！通渠熊提供24小時緊急通渠服務，配備高壓水槍洗渠及CCTV照喉技術，處理塞廁所、廚房去水、企缸淤塞、食肆隔油池及大廈沙井，全港九新界特快上門，報價後動工。",
    canonicalUrl: `${SITE_URL}/`,
    noIndex: false,
  },
};

interface SiteSettingsContextValue {
  settings: SiteSettings;
  isLoading: boolean;
  isCmsAvailable: boolean;
}

const SiteSettingsContext =
  createContext<SiteSettingsContextValue | null>(null);

export function buildWhatsAppUrl(number: string, message?: string) {
  const normalizedNumber = number.replace(/\D/g, "");
  const baseUrl = `https://wa.me/${normalizedNumber}`;

  return message
    ? `${baseUrl}?text=${encodeURIComponent(message)}`
    : baseUrl;
}

export function SiteSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      void import("@/lib/sanity/queries")
        .then(({ getSiteSettings }) => getSiteSettings())
        .then(result => {
          if (active) setData(result);
        })
        .catch(() => {
          // Contact and SEO fallbacks keep the site fully usable without the CMS.
        });
    };

    const idleId = window.requestIdleCallback?.(load, { timeout: 1500 });
    const timeoutId =
      idleId === undefined ? window.setTimeout(load, 1500) : null;

    return () => {
      active = false;
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

  const settings = useMemo<SiteSettings>(
    () => ({
      ...FALLBACK_SITE_SETTINGS,
      ...(data ?? {}),
      defaultOgImage: data?.defaultOgImage?.url
        ? data.defaultOgImage
        : FALLBACK_SITE_SETTINGS.defaultOgImage,
      defaultSeo: {
        ...FALLBACK_SITE_SETTINGS.defaultSeo,
        ...(data?.defaultSeo ?? {}),
      },
    }),
    [data]
  );

  const value = useMemo<SiteSettingsContextValue>(
    () => ({
      settings,
      isLoading: false,
      isCmsAvailable: Boolean(data),
    }),
    [settings, data]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error(
      "useSiteSettings must be used inside SiteSettingsProvider"
    );
  }

  return context;
}

export function useContactSettings() {
  const {settings} = useSiteSettings();

  return useMemo(
    () => ({
      phoneDisplay: settings.phoneDisplay,
      phoneHref: `tel:${settings.phoneE164.replace(/[^\d+]/g, "")}`,
      whatsappDefaultHref: buildWhatsAppUrl(
        settings.whatsappNumber,
        settings.whatsappDefaultMessage
      ),
      whatsappHref: (message?: string) =>
        buildWhatsAppUrl(settings.whatsappNumber, message),
    }),
    [
      settings.phoneDisplay,
      settings.phoneE164,
      settings.whatsappNumber,
      settings.whatsappDefaultMessage,
    ]
  );
}
