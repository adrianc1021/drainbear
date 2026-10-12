/** Navigation and image labels only. Full editorial content belongs to lazy route modules. */
export const SERVICE_DIRECTORY = [
  {
    slug: "toilet-unblocking",
    name: "坐廁及馬桶通渠",
    shortName: "坐廁通渠",
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A1_vyqcil.png",
    imageAlt: "香港住宅坐廁及馬桶通渠服務",
  },
  {
    slug: "kitchen-sink-unblocking",
    name: "廚房鋅盤通渠",
    shortName: "廚房鋅盤",
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A1_vyqcil.png",
    imageAlt: "香港廚房鋅盤去水慢及油脂淤塞通渠",
  },
  {
    slug: "grease-trap-cleaning",
    name: "食肆隔油池清理",
    shortName: "隔油池清理",
    image: "/images/home-drain-technician-wide.jpg",
    imageAlt: "食肆隔油池清理服務示意",
  },
  {
    slug: "bathroom-drain-unblocking",
    name: "浴室通渠：企缸、浴缸及地台去水",
    shortName: "浴室／企缸通渠",
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A1_vyqcil.png",
    imageAlt: "香港企缸、浴缸及浴室頭髮塞渠處理服務",
  },
  {
    slug: "sewage-backflow",
    name: "污水渠倒灌處理",
    shortName: "污水倒灌",
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A2_onju5z.png",
    imageAlt: "香港低層單位污水渠及水渠倒灌處理",
  },
  {
    slug: "high-pressure-jetting",
    name: "高壓水槍洗渠",
    shortName: "高壓洗渠",
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A3_fyozug.png",
    imageAlt: "香港高壓水槍洗渠及主渠清洗服務",
  },
  {
    slug: "cctv-drain-inspection",
    name: "CCTV 照渠／照喉檢測",
    shortName: "CCTV 照渠",
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A4_hiufrh.png",
    imageAlt: "香港 CCTV 照喉及排水管道影像檢測",
  },
  {
    slug: "main-drain-manhole",
    name: "大廈主渠及沙井通渠",
    shortName: "主渠／沙井",
    image:
      "https://res.cloudinary.com/pgjztf2p/image/upload/v1785164195/A2_onju5z.png",
    imageAlt: "香港大廈主渠倒灌及沙井滿瀉通渠",
  },
];
export const DISTRICT_DIRECTORY = [
  {
    slug: "kwun-tong",
    name: "觀塘",
  },
  {
    slug: "sha-tin",
    name: "沙田",
  },
  {
    slug: "mong-kok",
    name: "旺角",
  },
  {
    slug: "sham-shui-po",
    name: "深水埗",
  },
  {
    slug: "causeway-bay",
    name: "銅鑼灣",
  },
  {
    slug: "north-point",
    name: "北角",
  },
  {
    slug: "tsuen-wan",
    name: "荃灣",
  },
  {
    slug: "yuen-long",
    name: "元朗",
  },
  {
    slug: "tuen-mun",
    name: "屯門",
  },
  {
    slug: "tseung-kwan-o",
    name: "將軍澳",
  },
  {
    slug: "central-western",
    name: "中西區",
  },
  {
    slug: "southern",
    name: "南區",
  },
  {
    slug: "kowloon-city",
    name: "九龍城",
  },
  {
    slug: "kwai-tsing",
    name: "葵青",
  },
  {
    slug: "wong-tai-sin",
    name: "黃大仙",
  },
  {
    slug: "islands",
    name: "離島",
  },
  {
    slug: "north-district",
    name: "北區",
  },
  {
    slug: "tai-po",
    name: "大埔",
  },
];
export function getServiceDirectoryEntry(slug: string) {
  return SERVICE_DIRECTORY.find(service => service.slug === slug);
}
