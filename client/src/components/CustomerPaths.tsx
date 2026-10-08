import { ArrowRight, Building2, Home, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";

const CUSTOMERS = [
  {
    icon: Home,
    title: "住宅住戶",
    description: "坐廁塞、鋅盤去水慢、浴室積水，先按位置查看處理方法。",
    href: "/customers/residential",
    label: "查看家居通渠",
  },
  {
    icon: UtensilsCrossed,
    title: "食肆及商舖",
    description: "隔油池滿瀉或營業時段去水不暢，查詢清理及保養安排。",
    href: "/customers/restaurants",
    label: "查看商業渠務",
  },
  {
    icon: Building2,
    title: "業主及物業管理",
    description: "多個單位倒灌、主渠淤塞或反覆塞渠，先確認受影響範圍。",
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
