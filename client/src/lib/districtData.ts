import { DISTRICT_SEARCH_CONTENT } from "./districtSearchContent";
/**
 * 通渠熊 DrainBear — 地區著陸頁資料
 * 每區獨立長內容：當區特色、常見問題場景、鄰近地點、FAQ（SEO 長尾關鍵字覆蓋）
 * 第一批：觀塘、沙田；第二批：八個熱門地區；第三批：補齊八個主要行政區專頁
 */
export interface DistrictInfo {
  slug: string;
  name: string;
  en: string;
  region: string;
  heroTitle: string;
  heroDesc: string;
  intro: string[];
  painPoints: { title: string; desc: string }[];
  landmarks: string[];
  nearby: string[];
  faqs: { q: string; a: string }[];
  keywords: string;
  metaDescription: string;
}

const DISTRICTS_BATCH1: DistrictInfo[] = [
  {
    slug: "kwun-tong",
    name: "觀塘",
    en: "KWUN TONG",
    region: "九龍區",
    heroTitle: "觀塘通渠｜工廈、食肆及舊樓渠務",
    heroDesc:
      "觀塘工廈、食肆及舊樓通渠，24 小時接受查詢。提供地址、樓層及淤塞情況，先確認設備與到場時間；現場確認總價才動工。",
    intro: [
      "觀塘的住宅、工廈與食肆需要不同的渠務安排。工廈食堂或樓上商舖查詢時，請說明樓層、排水用途及其他去水位是否受影響，方便先了解所需工具和施工入口。",
      "裕民坊、觀塘工業區及翠屏邨等位置，可能涉及室內支喉或大廈公共渠管。若有多個單位或去水位同時倒灌，請一併告知，並先聯絡物業管理了解公共渠管情況。師傅會在檢查後確認處理方法。",
    ],
    painPoints: [
      {
        title: "工廈食堂去水位淤塞",
        desc: "食堂去水慢或有油脂積聚，先檢查堵塞範圍及入口，再評估通渠機或高壓水槍是否合適。",
      },
      {
        title: "舊樓廁所倒灌",
        desc: "裕民坊、物華街一帶舊樓主渠老化，低層倒灌。CCTV 照喉找出淤塞點，對症疏通。",
      },
      {
        title: "食肆隔油池滿瀉",
        desc: "觀塘食肆密集，隔油池欠保養易發臭滿瀉。提供定期清理及緊急抽吸服務。",
      },
      {
        title: "屋邨座廁淤塞",
        desc: "翠屏、順利、秀茂坪等屋邨單位座廁淤塞，先提供水位及其他去水位情況，再確認上門安排。",
      },
    ],
    landmarks: [
      "apm",
      "裕民坊",
      "觀塘工業區",
      "翠屏邨",
      "順利邨",
      "秀茂坪",
      "藍田",
      "油塘",
    ],
    nearby: ["九龍灣", "牛頭角", "藍田", "油塘", "秀茂坪"],
    faqs: [
      {
        q: "觀塘通渠幾快可以到？",
        a: "觀塘工業區、裕民坊、藍田及油塘一帶均可查詢。請先提供具體位置、樓宇進場要求及渠況，我們會按交通、人員與設備供應確認到場時間。",
      },
      {
        q: "觀塘工廈單位可以安排通渠嗎？",
        a: "可以。工廈查詢請說明場所用途、淤塞位置與進場要求，方便團隊安排上門服務。先報價，確認後才動工。",
      },
      {
        q: "觀塘食肆隔油池可以定期保養嗎？",
        a: "可以。我們為觀塘區食肆提供隔油池定期清理計劃，避免突發滿瀉影響營業，歡迎 WhatsApp 查詢報價。",
      },
    ],
    keywords:
      "觀塘通渠, 觀塘通渠公司, 觀塘塞渠, 觀塘廁所塞, 觀塘工廈通渠, 觀塘食肆通渠, 觀塘隔油池, 藍田通渠, 油塘通渠, 24小時通渠觀塘",
    metaDescription:
      "觀塘通渠服務｜24 小時接受觀塘、藍田、油塘查詢。處理工廈食堂去水、舊樓倒灌及食肆隔油池問題。按交通與設備確認到場時間，現場確認總價才動工。",
  },
  {
    slug: "sha-tin",
    name: "沙田",
    en: "SHA TIN",
    region: "新界區",
    heroTitle: "沙田通渠｜屋苑、村屋及食肆渠務",
    heroDesc:
      "沙田屋苑、村屋及商場食肆通渠，24 小時接受查詢。先了解位置、沙井及車輛通道，再確認所需設備與到場時間。",
    intro: [
      "沙田是新界東最大的住宅社區，由第一城、沙田中心等大型私人屋苑，到禾輋邨、瀝源邨等成熟公共屋邨，再到火炭工業區及大圍、小瀝源一帶村屋，樓宇類型極為多元。不同樓型的渠務問題各有特點：屋苑單位常見浴室去水慢及座廁淤塞，村屋則多為沙井滿瀉及化糞池問題。",
      "新城市廣場周邊食肆的隔油池保養，與排頭村、作壆坑村屋的沙井淤塞，需要先確認清理範圍和設備通道。通渠熊會按現場條件評估高壓清洗、CCTV 照喉或抽吸設備，再確認上門安排。雨季來臨前的村屋沙井檢查，亦有助及早發現樹根入侵及淤塞隱患。",
    ],
    painPoints: [
      {
        title: "屋苑浴室去水慢",
        desc: "第一城、沙田中心等屋苑的去水位如有頭髮或油垢積聚，師傅會按位置選用工具，完成後測試去水。",
      },
      {
        title: "村屋沙井滿瀉",
        desc: "大圍、小瀝源、火炭村屋沙井淤塞滿瀉，先確認水位、車輛通道及化糞池狀況，再安排合適抽吸設備。",
      },
      {
        title: "樹根纏繞喉管",
        desc: "村屋戶外排水管被樹根入侵，CCTV 照喉定位後以機械切割清除，回復排水。",
      },
      {
        title: "商場食肆隔油池",
        desc: "新城市廣場、石門商廈食肆隔油池保養及緊急抽吸，避免臭味投訴影響營業。",
      },
    ],
    landmarks: [
      "新城市廣場",
      "沙田第一城",
      "禾輋邨",
      "瀝源邨",
      "火炭",
      "石門",
      "大圍",
      "馬鞍山",
    ],
    nearby: ["大圍", "火炭", "石門", "馬鞍山", "大埔"],
    faqs: [
      {
        q: "沙田村屋沙井滿瀉可以即日處理嗎？",
        a: "需要先確認。請提供大圍、小瀝源或火炭的具體位置、沙井相片及車輛入口資料，我們會按交通、人員與抽吸設備供應確認可行時間和處理安排。",
      },
      {
        q: "馬鞍山及大圍都屬於服務範圍嗎？",
        a: "大圍、火炭、石門及馬鞍山均可查詢。請提供具體位置與渠況，先確認交通、進場及設備條件；收費會先作初步估算，現場檢查後確認總價才動工。",
      },
      {
        q: "屋苑單位通渠會弄髒家居嗎？",
        a: "施工前會鋪設保護墊及採取防污措施，完工後清理工作範圍。請先說明家居佈置或需要特別保護的位置，方便安排施工。",
      },
    ],
    keywords:
      "沙田通渠, 沙田通渠公司, 沙田塞渠, 沙田村屋通渠, 沙田沙井, 大圍通渠, 火炭通渠, 馬鞍山通渠, 沙田第一城通渠, 24小時通渠沙田",
    metaDescription:
      "沙田通渠服務｜24 小時接受沙田、大圍、火炭、馬鞍山查詢。處理屋苑去水慢、村屋沙井滿瀉及樹根問題。按交通、車輛通道與設備確認安排，現場確認總價才動工。",
  },
];

import { DISTRICTS_BATCH2 } from "./districtData2";
import { DISTRICTS_BATCH3 } from "./districtData3";

/** 全部已有專屬著陸頁的地區（18 頁） */
export const DISTRICTS: DistrictInfo[] = [
  ...DISTRICTS_BATCH1,
  ...DISTRICTS_BATCH2,
  ...DISTRICTS_BATCH3,
].map(district => ({ ...district, ...DISTRICT_SEARCH_CONTENT[district.slug] }));

/** 地區名 → slug 對照（供 pill 連結使用） */
export const DISTRICT_SLUGS: Record<string, string> = Object.fromEntries(
  DISTRICTS.map(d => [d.name, d.slug])
);

// 四個既有熱門地區頁同時承接所屬行政區的地圖入口，避免重複薄內容頁。
Object.assign(DISTRICT_SLUGS, {
  油尖旺: "mong-kok",
  灣仔: "causeway-bay",
  東區: "north-point",
  西貢: "tseung-kwan-o",
});

export function getDistrict(slug: string) {
  return DISTRICTS.find(d => d.slug === slug);
}
