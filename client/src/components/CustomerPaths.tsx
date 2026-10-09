import ServicePhoto from "@/components/ServicePhoto";
import { ArrowRight, Building2, Home, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";

const CUSTOMERS = [
  {
    icon: Home,
    slug: "kitchen-sink-unblocking",
    title: "住宅住戶",
    description: "坐廁、鋅盤、浴室去水。",
    href: "/customers/residential",
    label: "查看家居通渠",
  },
  {
    icon: UtensilsCrossed,
    slug: "grease-trap-cleaning",
    title: "食肆及商舖",
    description: "隔油池、廚房去水及保養。",
    href: "/customers/restaurants",
    label: "查看商業渠務",
  },
  {
    icon: Building2,
    slug: "main-drain-manhole",
    title: "業主及物業管理",
    description: "大廈主渠、沙井及公共喉管。",
    href: "/customers/property-management",
    label: "查看主渠及沙井",
  },
] as const;

export default function CustomerPaths({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`customer-paths${compact ? " customer-paths--compact" : ""}`}
    >
      {CUSTOMERS.map(item => (
        <article className="customer-path" key={item.title}>
          <ServicePhoto slug={item.slug} />
          <item.icon aria-hidden="true" />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <Link href={item.href}>
            {item.label}
            <ArrowRight aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
}
