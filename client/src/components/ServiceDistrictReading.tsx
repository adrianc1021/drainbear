import { Link } from "wouter";

/** Contextual preparation links, not claims of projects completed in these areas. */
const READING: Record<string, { href: string; label: string }[]> = {
  "toilet-unblocking": [
    {
      href: "/areas/north-point#north-point-toilet-water",
      label: "北角、炮台山坐廁塞：查詢前記錄水位與其他去水情況",
    },
  ],
  "bathroom-drain-unblocking": [
    {
      href: "/areas/causeway-bay#tai-hang-drain-arrangements",
      label: "大坑住宅浴室積水：入口與相連去水位",
    },
    {
      href: "/areas/sha-tin#sha-tin-bathroom-sequence",
      label: "大圍屋苑地台冒水：單位與共用渠的查詢安排",
    },
  ],
  "grease-trap-cleaning": [
    {
      href: "/areas/kwun-tong#kwun-tong-kitchen-route",
      label: "觀塘工廈食堂：隔油池與下游喉管分開檢查",
    },
    {
      href: "/areas/causeway-bay#causeway-bay-restaurant-access",
      label: "銅鑼灣食肆：營業與可停用設備的安排",
    },
  ],
  "main-drain-manhole": [
    {
      href: "/areas/tai-po#tai-po-village-rain",
      label: "大埔村屋戶外積水：日常排水與雨天情況分開交代",
    },
  ],
};
export default function ServiceDistrictReading({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const links = READING[serviceSlug];
  if (!links) return null;
  return (
    <aside
      className="service-answer-links"
      aria-labelledby="service-district-reading"
    >
      <h2 id="service-district-reading">不同場所，上門前點準備？</h2>
      <ul>
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
