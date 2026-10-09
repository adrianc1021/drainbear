import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import ContactActions from "@/components/ContactActions";
import { CUSTOMER_JOURNEYS, type CustomerSlug } from "@shared/customerJourneys";
import { useState } from "react";
import {
  Camera,
  Check,
  MapPin,
  MessageSquareText,
  Droplets,
} from "lucide-react";

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
  description = "傳相片同地區，先了解點處理。",
  defaultServiceType = "residential",
  defaultMessage,
  customer,
  chooseCustomer = false,
  className = "",
}: {
  location: string;
  title?: string;
  description?: string;
  defaultServiceType?: InquiryServiceType | "";
  defaultMessage?: string;
  customer?: CustomerSlug;
  chooseCustomer?: boolean;
  className?: string;
}) {
  const [choice, setChoice] = useState<CustomerSlug | null>(null);
  const selected =
    (chooseCustomer ? choice : null) ??
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
        {chooseCustomer ? (
          <div className="inquiry-customer-choice">
            <label htmlFor={`${location}-customer`}>你的場所</label>
            <select
              id={`${location}-customer`}
              value={selected}
              onChange={event => setChoice(event.target.value as CustomerSlug)}
            >
              {CUSTOMER_JOURNEYS.map(item => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <ul className="inquiry-prompts" aria-label="查詢所需資料">
          <li>
            <MapPin aria-hidden="true" />
            <span>所在地區</span>
          </li>
          <li>
            <Droplets aria-hidden="true" />
            <span>堵塞位置</span>
          </li>
          <li>
            <Camera aria-hidden="true" />
            <span>相片／短片</span>
          </li>
        </ul>
        <AnimatedDisclosure
          id={`${location}-preparation`}
          title="查看資料清單"
          className="reading-disclosure"
        >
          <p>{description}</p>
          <InquiryChecklist customer={selected} />
        </AnimatedDisclosure>
      </div>
      <div>
        <ContactActions
          location={location}
          message={
            defaultMessage
              ? `${defaultMessage}\n場所：${journey.name}\n請提供：${journey.checklist.join("；")}`
              : journey.message
          }
          topic={selected}
        />
        <p className="contact-note">24 小時查詢 · 上門時間另行確認。</p>
      </div>
    </div>
  );
}
