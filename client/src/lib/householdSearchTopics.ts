import { applyBasinConversion } from "./basinConversion";
import type { BlogPostView } from "./blogRepository";
import { STARTING_PRICE_LABEL } from "../../../shared/pricing";

export const HOUSEHOLD_TOPICS_UPDATED = "2026-10-26";
export const HOUSEHOLD_SEARCH_TOPICS = [
  {
    slug: "bathroom-hair-clog-prevention",
    service: "bathroom-drain-unblocking",
    name: "浴室地台去水慢",
    title: "浴室地台去水慢、企缸塞渠點算？成因、清理與倒灌判斷",
    description:
      "浴室地台去水慢，先分清表面積水還是渠口倒灌。了解頭髮清理、隔氣與支渠檢查方向、何時停止用水，以及浴室通渠查詢要準備的資料。",
    keywords: [
      "浴室地台去水慢",
      "浴室去水慢",
      "企缸去水慢",
      "浴室塞渠",
      "地台去水口塞",
      "沖涼去水慢",
      "浴室通渠收費",
    ],
    answer:
      "浴室地台去水慢，先停止會令積水增加的用水，分清水是流向去水口卻排不走，還是由渠口反湧。可安全清走隔網表面可見的頭髮；清理後仍積水、多個去水位異常或有污水湧出，就需要檢查隔氣、支渠及相連管段，不能單憑積水確定堵塞位置。",
    heading: "地台積水、企缸去水慢與倒灌，怎樣分辨？",
    observations: [
      "只在企缸內積水：記錄開始積水的時間、停水後回落情況及可見隔網有沒有雜物。",
      "水在地面流不到渠口：同時留意積水位置和地面排水路徑；通渠未必能處理地面坡度問題。",
      "地台渠口反湧：停止引起冒水的設備；若伴隨沖廁或其他單位用水出現，交代所有受影響位置並聯絡管理處。",
    ],
    links: [
      {
        href: "/answers/bathroom-drain-unblocking-hair-removed",
        label: "頭髮清走仍積水，下一步查甚麼？",
      },
      {
        href: "/answers/bathroom-drain-unblocking-shower-to-floor",
        label: "沖涼時地台冒水，應檢查哪一段？",
      },
      {
        href: "/blog/bathroom-drain-smell-causes-solutions",
        label: "去水慢兼有渠味的檢查方向",
      },
    ],
    faqs: [
      {
        question: "浴室地台去水慢，一定是頭髮塞渠嗎？",
        answer:
          "不一定。頭髮及皂垢可能積聚，但隔氣、支渠、相連管段或地面排水路徑亦會影響積水。先看水能否流到渠口，以及其他設備是否同時去水慢，再決定檢查方向。",
      },
      {
        question: "浴缸去水塞、清走頭髮後仍去水慢，點算？",
        answer:
          "停止持續放水，保留浴缸或地台去水口及全景相片。表面清理不能確認深處暢通；不要強拆隔氣或用硬物深入探喉，可安排浴室支渠檢查。",
      },
      {
        question: "沖涼時地台冒污水，應繼續試水嗎？",
        answer:
          "不要。停止相關用水並避開污水，記錄冒水位置及與哪些設備使用有關。多處或多戶同時異常時，聯絡管理處協調共用渠檢查。",
      },
      {
        question: "浴室通渠收費如何確認？",
        answer: `通渠熊全線通渠服務 ${STARTING_PRICE_LABEL}，浴室工程按受影響範圍、隔氣與支渠入口、工具及拆裝需要確認報價。傳地區、去水口及現場相片，先了解安排；到場確認方法與收費後才動工。`,
      },
    ],
  },
  {
    slug: "slow-basin-drain-causes-solutions",
    service: "bathroom-drain-unblocking",
    name: "洗手盆塞",
    title: `洗手盆塞？通渠 ${STARTING_PRICE_LABEL}｜傳相查詢報價`,
    description: `洗手盆塞、洗手盤去水慢？通渠熊 ${STARTING_PRICE_LABEL}，傳盆口及櫃底相片查詢報價與上門時間。檢查隔氣及支渠，確認收費後動工，完成後試水。`,
    keywords: [
      "洗手盆塞",
      "洗手盤塞",
      "洗手盆去水慢",
      "洗手盆通渠",
      "洗手盆通渠收費",
      "洗手盆通渠報價",
      "洗手盆塞搵師傅",
      "洗手盆塞彈不起",
    ],
    answer:
      "洗手盆塞，先停用，避免積水溢出。傳盆口、櫃底相片及地區，通渠熊幫你了解處理方向、報價及上門安排。",
    heading: "洗手盆塞，而家做呢三步",
    observations: [
      "先停水：積水、漏水時不要繼續開水測試。",
      "影兩張相：盆口一張、櫃底喉管一張，毋須自行拆喉。",
      "傳相格價：附上地區；用過通渠水亦請告知，勿再混加清潔劑。",
    ],
    links: [],
    faqs: [
      {
        question: "洗手盆通渠幾錢？",
        answer: `通渠熊全線通渠服務 ${STARTING_PRICE_LABEL}。傳相先了解報價，實際費用按堵塞、入口及拆裝需要確認，確認後才動工。`,
      },
      {
        question: "想格價，要傳甚麼資料？",
        answer:
          "傳盆口及櫃底相片、所在地區，再說明去水慢、完全塞或漏水。有用過通渠水亦請告知，方便確認工序及報價範圍。",
      },
      {
        question: "洗手盆塞彈不起，是塞渠嗎？",
        answer:
          "未必。按壓式塞頭卡住屬配件問題，與隔氣或支渠淤塞不同。不要用刀撬或強拆；傳塞頭及櫃底相片，先確認處理方向。",
      },
      {
        question: "洗手盤塞，要自己拆隔氣先嗎？",
        answer:
          "不用。先停用並傳相，讓師傅了解入口。尤其已有漏水或用過通渠劑，避免自行拆喉、泵壓或混加清潔劑。",
      },
    ],
  },
  {
    slug: "toilet-clog-emergency-guide",
    service: "toilet-unblocking",
    name: "馬桶塞",
    title: "馬桶塞、坐廁去水慢點算？水位升高、異物與通廁所指南",
    description:
      "馬桶塞先停止沖水。按水位升高、慢慢退水、硬物跌入及地台冒水分辨查詢方向，了解皮碗泵限制、通坐廁收費因素及何時搵師傅。",
    keywords: [
      "馬桶塞",
      "坐廁塞",
      "廁所塞",
      "馬桶去水慢",
      "坐廁水位升高",
      "通馬桶",
      "通廁所方法",
      "通坐廁收費",
    ],
    answer:
      "馬桶塞、水位升高或沖水後慢慢退水，先停止再沖，避免溢出。記錄有沒有紙張或硬物跌入、是否用過通渠劑，以及地台或洗手盆有沒有同時冒水。水退了不代表堵塞已清除；硬物、反覆淤塞或多處倒灌，需要按坐廁及相連管段情況安排檢查。",
    heading: "馬桶塞的四種反應，查詢時要怎樣說明？",
    observations: [
      "水位不退或接近溢出：停用坐廁；不要再沖水拍片，提供已有相片及描述。",
      "水慢慢退：交代多久回落及何時開始；不要因為退水就連續試沖。",
      "有玩具、濕紙巾或硬物跌入：說明物件及時間，勿強行推入更深位置；是否拆坐廁需檢查後確認。",
      "沖廁令地台冒水或其他單位亦異常：可能涉及相連管段，需連同管理處了解共用入口，不能只當作馬桶內堵塞。",
    ],
    links: [
      {
        href: "/blog/toilet-foreign-object-drain-service",
        label: "馬桶跌入異物：工具與拆裝限制",
      },
      {
        href: "/blog/toilet-gurgling-sounds-drain-check",
        label: "坐廁咕嚕聲與冒泡要留意甚麼？",
      },
      {
        href: "/answers/toilet-unblocking-bubbles-other-drain",
        label: "沖廁時地台去水口冒泡的檢查方向",
      },
    ],
    faqs: [
      {
        question: "馬桶塞了怎麼辦？水慢慢退是否已經通了？",
        answer:
          "先停止沖水。退水未能確認已疏通，只代表當時仍能排走部分水，堵塞可能未清除。先停用並記錄情況；反覆出現、水位升高或其他去水位異常時安排檢查。",
      },
      {
        question: "馬桶塞可以用皮碗泵嗎？",
        answer:
          "需先按坐廁情況和工具說明判斷。已有化學通渠劑、懷疑硬物、水接近溢出或多處倒灌時，不應自行加力泵壓。不能確認情況，先停用並查詢，不要混合清潔劑。",
      },
      {
        question: "通馬桶是否一定要拆坐廁？",
        answer:
          "不一定。需要按異物位置、坐廁結構、接駁及可用工具確認；部分情況可由現有入口處理，涉及拆裝時應先說明範圍、報價及復原安排。",
      },
      {
        question: "通坐廁幾錢？可以即時上門嗎？",
        answer: `通渠熊全線通渠服務 ${STARTING_PRICE_LABEL}，坐廁工程按堵塞、異物、工具及拆裝需要報價。電話及 WhatsApp 24 小時接受查詢，到場時間按地區、人手、交通及進場條件確認。`,
      },
    ],
  },
];
export function householdTopic(slug: string) {
  return HOUSEHOLD_SEARCH_TOPICS.find(topic => topic.slug === slug);
}
export function householdTopicDate(slug: string, date?: string) {
  return householdTopic(slug) &&
    (!date || Date.parse(date) < Date.parse(HOUSEHOLD_TOPICS_UPDATED))
    ? HOUSEHOLD_TOPICS_UPDATED
    : date;
}
export function applyHouseholdTopic(post: BlogPostView): BlogPostView {
  const topic = householdTopic(post.slug);
  if (!topic) return post;
  return applyBasinConversion({
    ...post,
    title: topic.title,
    excerpt: topic.description,
    keywords: topic.keywords,
    updatedAt: householdTopicDate(post.slug, post.updatedAt),
    reviewerName: "",
    seo: {
      ...post.seo,
      metaTitle: `${topic.title}｜通渠熊`,
      metaDescription: topic.description,
      focusKeywords: topic.keywords,
    },
    faqs: [
      ...topic.faqs,
      ...(post.faqs ?? []).filter(
        f => !topic.faqs.some(t => t.question === f.question)
      ),
    ],
  });
}

/** Correct unsupported numerical/diagnostic claims in the existing hair-clog guide. */
export function reviseHouseholdText(slug: string, text: string): string {
  if (slug !== "bathroom-hair-clog-prevention") return text;
  return text
    .replace(
      "浴室去水慢，企缸沖涼沖到「浸腳眼」，九成同頭髮有關。",
      "浴室去水慢，企缸沖涼時積水，可能與頭髮、皂垢或其他管道問題有關。"
    )
    .replace(
      "人每日平均甩 50 至 100 條頭髮，大部分喺洗頭時流入去水口，纏住隔氣位嘅十字架位，再黐上番梘垢同皮脂，形成又韌又臭嘅毛髮氈。",
      "頭髮和皂垢可能在去水口或管內積聚；清走表面雜物後仍去水慢，需再了解隔氣與相連管段。"
    )
    .replace(
      "矽膠或不鏽鋼嘅毛髮過濾器，十幾蚊就有交易，能攔截絕大部分頭髮。每次沖完涼順手清理，係性價比最高嘅防塞投資。",
      "可按去水口尺寸選用合適隔網，並定期清走表面毛髮。隔網有助攔截可見雜物，但需要清理，亦不能代替已堵塞管段的檢查。"
    )
    .replace("第二招：每兩星期清一次隔氣", "第二招：按設備說明保養隔氣")
    .replace(
      "企缸同面盆下方嘅樽型隔氣多數可以徒手扭開，倒走積聚嘅頭髮同雜物再裝返，全程五分鐘。記得放定一桶水喺下面接漏。",
      "企缸與面盆的隔氣設計可能不同，不能一概當作可徒手拆裝。按設備維護說明處理；不熟悉、接駁老化、滲漏或曾倒化學劑時，先交由人員檢查，避免拆裝後漏水。"
    )
    .replace(
      "如果去水變慢同時傳出陣陣臭味，代表毛髮氈已經喺喉管深處腐化，DIY 好難搞得掂。愈早搵師傅用彈弓機處理，愈唔使搞到拆喉咁大陣仗。",
      "去水慢兼有異味，應同時了解隔氣存水、積聚物及相連管段。氣味不能確認堵塞位置或原因；可傳相查詢，再按現場條件選擇工具及處理方法。"
    )
    .replace(
      "白熊師傅貼士：長髮家庭建議洗頭前先梳頭，將鬆脫嘅頭髮預先梳走，落到去水口嘅頭髮即刻少一半。",
      "日常保養：清走可見鬆脫毛髮，放入垃圾桶，避免沖入去水口。反覆積水時記錄發生情況，再安排檢查。"
    );
}
