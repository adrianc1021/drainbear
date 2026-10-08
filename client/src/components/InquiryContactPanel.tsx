import ContactActions from "@/components/ContactActions";
import { CUSTOMER_JOURNEYS, type CustomerSlug } from "@shared/customerJourneys";
import { Check, MessageSquareText } from "lucide-react";

export type InquiryServiceType =
  | "residential"
  | "commercial"
  | "hydrojet"
  | "cctv"
  | "other";

export function InquiryChecklist({
  customer = "residential",
}: {
  customer?: CustomerSlug;
}) {
  const journey = CUSTOMER_JOURNEYS.find(item => item.slug === customer)!;
  return (
    <ul className="inquiry-checklist">
      {journey.checklist.map(item => (
        <li key={item}>
          <Check aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A working contact entrance; no fake form, receipt or application status. */
export default function InquiryContactPanel({
  location,
  title = "傳送現場資料，先了解點處理",
  description = "說明地區和受影響位置，配合相片或短片，方便團隊了解情況。",
  defaultServiceType = "residential",
  defaultMessage,
  customer,
  className = "",
}: {
  location: string;
  title?: string;
  description?: string;
  defaultServiceType?: InquiryServiceType | "";
  defaultMessage?: string;
  customer?: CustomerSlug;
  className?: string;
}) {
  const selected =
    customer ??
    (defaultServiceType === "commercial"
      ? "restaurants"
      : ["hydrojet", "cctv"].includes(defaultServiceType)
        ? "property-management"
        : "residential");
  const journey = CUSTOMER_JOURNEYS.find(item => item.slug === selected)!;
  return (
    <div
      className={`inquiry-contact-panel ${className}`}
      data-contact-panel="true"
    >
      <div>
        <p className="brand-eyebrow">
          <MessageSquareText aria-hidden="true" />
          現場查詢
        </p>
        <h2>{title}</h2>
        <p>{description}</p>
        <InquiryChecklist customer={selected} />
      </div>
      <div>
        <ContactActions
          location={location}
          message={
            defaultMessage
              ? `${defaultMessage}\n請提供：${journey.checklist.join("；")}`
              : journey.message
          }
          topic={selected}
        />
        <p className="contact-note">
          24 小時接受查詢；上門安排由團隊按現場情況確認。
        </p>
      </div>
    </div>
  );
}
