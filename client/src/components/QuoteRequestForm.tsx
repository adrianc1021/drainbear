import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { useContactSettings } from "@/contexts/SiteSettingsContext";
import TrpcProvider, {
  useHasTrpcProvider,
} from "@/components/TrpcProvider";
import {
  trackContactFormError,
  trackContactFormStart,
  trackContactFormSubmit,
} from "@/lib/analytics";
import { DISTRICTS } from "@/lib/districtData";
import { trpc } from "@/lib/trpc";
import { getSessionAttribution, getSessionClickId } from "@/lib/trackingSession";

declare global {
  interface Window {
    grecaptcha?: { ready: (callback: () => void) => void; execute: (siteKey: string, options: { action: string }) => Promise<string> };
  }
}

async function requestRecaptchaToken(siteKey: string): Promise<string | undefined> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 6000) {
    if (window.grecaptcha) {
      return new Promise(resolve => {
        window.grecaptcha?.ready(() => {
          window.grecaptcha
            ?.execute(siteKey, { action: "inquiry_submit" })
            .then(resolve)
            .catch(() => resolve(undefined));
        });
      });
    }
    await new Promise(resolve => window.setTimeout(resolve, 100));
  }
  return undefined;
}

export type InquiryServiceType =
  | "residential"
  | "commercial"
  | "hydrojet"
  | "cctv"
  | "other";

export interface QuoteRequestFormProps {
  location: string;
  title?: string;
  description?: string;
  defaultServiceType?: InquiryServiceType | "";
  defaultMessage?: string;
  className?: string;
}

const SERVICE_OPTIONS: Array<{ value: InquiryServiceType; label: string }> = [
  { value: "residential", label: "住宅／屋苑通渠" },
  { value: "commercial", label: "商舖／食肆／物業渠務" },
  { value: "hydrojet", label: "高壓水槍洗渠" },
  { value: "cctv", label: "CCTV 照喉檢測" },
  { value: "other", label: "其他或未確定" },
];

const INPUT_CLASS_NAME =
  "mt-2 min-h-12 w-full rounded-md border border-[var(--db-rule)] bg-white px-3.5 py-3 text-sm text-[var(--db-ink)] outline-none transition focus:border-[var(--db-ink)] focus:ring-2 focus:ring-[var(--db-safety)]/25";

function getErrorType(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "data" in error
      ? (error as { data?: { code?: string } }).data?.code
      : undefined;

  return code === "BAD_REQUEST" ? "validation" : "server";
}

function QuoteRequestFormContent({
  location,
  title = "先留下資料，團隊再回覆您",
  description = "請提供堵塞位置及所在地區，方便團隊初步了解情況，再確認服務安排及報價。",
  defaultServiceType = "",
  defaultMessage = "",
  className = "",
}: QuoteRequestFormProps) {
  const formId = useId().replaceAll(":", "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<InquiryServiceType | "">(
    defaultServiceType
  );
  const [district, setDistrict] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [clientError, setClientError] = useState("");
  const [website, setWebsite] = useState("");
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  useEffect(() => {
    if (!recaptchaSiteKey || document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]')) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`;
    script.async = true;
    document.head.appendChild(script);
  }, [recaptchaSiteKey]);
  const startedRef = useRef(false);
  const { phoneDisplay, phoneHref } = useContactSettings();
  const mutation = trpc.inquiry.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      trackContactFormSubmit("inquiry_form", location);
    },
    onError: error => {
      setSubmitted(false);
      trackContactFormError("inquiry_form", getErrorType(error), location);
    },
  });

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackContactFormStart("inquiry_form", location);
  };

  const clearSubmissionState = () => {
    setClientError("");
    if (submitted || mutation.error) {
      setSubmitted(false);
      mutation.reset();
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markStarted();

    if (!name.trim() || !phone.trim() || !serviceType || !privacyAccepted) {
      setClientError("請填寫稱呼、電話、服務類型，並同意資料使用說明。");
      trackContactFormError("inquiry_form", "validation", location);
      return;
    }

    setClientError("");

    let recaptchaToken: string | undefined;
    if (recaptchaSiteKey) {
      recaptchaToken = await requestRecaptchaToken(recaptchaSiteKey);
      if (!recaptchaToken) {
        setClientError("安全驗證尚未完成，請稍候再按一次提交。\n如持續出現此訊息，請重新整理頁面。");
        trackContactFormError("inquiry_form", "recaptcha", location);
        return;
      }
    }

    mutation.mutate({
      name: name.trim(),
      phone: phone.trim(),
      serviceType,
      district: district || undefined,
      message: message.trim() || undefined,
      landingPage: typeof window !== "undefined" ? window.location.href.slice(0, 500) : undefined,
      clickIdType: getSessionAttribution().click_id_type,
      gclid: getSessionClickId(),
      website,
      recaptchaToken,
    });
  };

  return (
    <section
      id={
        location === "home_quote_form"
          ? "quote-form"
          : `quote-form-${location}`
      }
      data-quote-request-form="true"
      data-form-location={location}
      className={`quote-request-form border border-[var(--db-rule)] bg-white p-5 md:p-8 ${className}`}
    >
      <div className="max-w-2xl">
        <p className="text-xs font-black tracking-[0.14em] text-[var(--db-safety)]">
          報價查詢
        </p>
        <h2 className="mt-3 text-2xl font-black text-[var(--db-ink)] md:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--db-copy)]">
          {description}
        </p>
      </div>

      {submitted ? (
        <div
          role="status"
          data-form-status="success"
          className="mt-7 border border-[var(--db-safety)]/35 bg-[var(--db-safety)]/10 p-5"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--db-safety)]" />
            <div>
              <h3 className="font-black text-[var(--db-ink)]">查詢已收到</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--db-copy)]">
                團隊會按您提供的資料回覆。如情況需要即時處理，可直接致電 {phoneDisplay}。
              </p>
              <a
                href={phoneHref}
                className="mt-3 inline-flex min-h-11 items-center gap-2 font-black text-[var(--db-ink)] underline underline-offset-4"
              >
                直接致電查詢
              </a>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="mt-7 grid gap-5"
          onSubmit={submit}
          onFocus={markStarted}
          noValidate
        >
          <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            網站（請留空）
            <input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label htmlFor={`${formId}-name`} className="text-sm font-bold text-[var(--db-ink)]">
              稱呼<span className="ml-1 text-[var(--db-safety)]">*</span>
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
                value={name}
                onChange={event => {
                  clearSubmissionState();
                  setName(event.target.value);
                }}
                className={INPUT_CLASS_NAME}
                placeholder="例如：陳先生"
              />
            </label>
            <label htmlFor={`${formId}-phone`} className="text-sm font-bold text-[var(--db-ink)]">
              聯絡電話<span className="ml-1 text-[var(--db-safety)]">*</span>
              <input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={30}
                required
                value={phone}
                onChange={event => {
                  clearSubmissionState();
                  setPhone(event.target.value);
                }}
                className={INPUT_CLASS_NAME}
                placeholder="例如：9558 8260"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label htmlFor={`${formId}-service`} className="text-sm font-bold text-[var(--db-ink)]">
              服務類型<span className="ml-1 text-[var(--db-safety)]">*</span>
              <select
                id={`${formId}-service`}
                name="serviceType"
                required
                value={serviceType}
                onChange={event => {
                  clearSubmissionState();
                  setServiceType(event.target.value as InquiryServiceType | "");
                }}
                className={INPUT_CLASS_NAME}
              >
                <option value="">請選擇最接近的類型</option>
                {SERVICE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor={`${formId}-district`} className="text-sm font-bold text-[var(--db-ink)]">
              所在地區
              <select
                id={`${formId}-district`}
                name="district"
                value={district}
                onChange={event => {
                  clearSubmissionState();
                  setDistrict(event.target.value);
                }}
                className={INPUT_CLASS_NAME}
              >
                <option value="">請選擇地區（可稍後補充）</option>
                {DISTRICTS.map(item => (
                  <option key={item.slug} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label htmlFor={`${formId}-message`} className="text-sm font-bold text-[var(--db-ink)]">
            問題描述
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={4}
              maxLength={2000}
              value={message}
              onChange={event => {
                clearSubmissionState();
                setMessage(event.target.value);
              }}
              className={`${INPUT_CLASS_NAME} resize-y`}
              placeholder="例如：坐廁完全塞住多久、是否有倒灌、其他去水位是否同時變慢。"
            />
          </label>

          <label className="flex items-start gap-3 text-xs leading-6 text-[var(--db-copy)]">
            <input
              type="checkbox"
              required
              checked={privacyAccepted}
              onChange={event => {
                clearSubmissionState();
                setPrivacyAccepted(event.target.checked);
              }}
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--db-safety)]"
            />
            <span>
              我同意通渠熊使用上述資料回覆本次服務查詢。姓名、電話及完整描述只會交給跟進團隊，不會放入分析追蹤事件。
            </span>
          </label>

          {clientError ? (
            <p role="alert" data-form-status="validation" className="text-sm font-bold text-red-700">
              {clientError}
            </p>
          ) : null}

          {mutation.error ? (
            <p role="alert" data-form-status="error" className="text-sm font-bold text-red-700">
              暫時未能送出查詢，請檢查必填資料後再試；如仍有問題，請直接致電 {phoneDisplay}。
            </p>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--db-ink)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--db-safety)] disabled:cursor-wait disabled:opacity-60 md:w-fit"
          >
            {mutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            {mutation.isPending ? "正在送出…" : "提交報價查詢"}
          </button>
        </form>
      )}
    </section>
  );
}

export default function QuoteRequestForm(props: QuoteRequestFormProps) {
  const hasTrpcProvider = useHasTrpcProvider();

  if (!hasTrpcProvider) {
    return (
      <TrpcProvider>
        <QuoteRequestFormContent {...props} />
      </TrpcProvider>
    );
  }

  return <QuoteRequestFormContent {...props} />;
}
