/** Curated public reports. Source publication is not a finding of merchant liability. */
export const CONSUMER_ALERTS_UPDATED = "2026-10-16";
export const CONSUMER_ALERTS_PATH = "/consumer-alerts";
export const CONSUMER_ALERTS_TITLE = "通渠黑店相關公開資料庫";
export const CONSUMER_ALERTS_DESCRIPTION =
  "查閱通渠消費爭議的警方紀錄、消委會個案及傳媒報道。按關鍵字、資料來源及爭議類型搜尋，每筆附原文、報道日期、當事人回應及核對範圍。";

export const ALERT_KINDS = ["官方紀錄", "消委會個案", "傳媒報道"] as const;
export const ALERT_TOPICS = [
  "臨場加價",
  "售後跟進",
  "身份疑問",
  "威嚇指控",
  "錄音爭議",
  "施工損毀",
] as const;
export type AlertKind = (typeof ALERT_KINDS)[number];
export type AlertTopic = (typeof ALERT_TOPICS)[number];
export interface AlertSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  published: string;
  publishedLabel: string;
}
export const ALERT_SOURCES: AlertSource[] = [
  {
    id: "police-1194",
    publisher: "香港警務處《警聲》",
    title: "商罪科與消委會攜手打擊騙案",
    url: "https://www.police.gov.hk/offbeat/1194/chi/9010.html",
    published: "2021-10-13",
    publishedLabel: "2021年10月13日，第1194期",
  },
  {
    id: "consumer-513",
    publisher: "消費者委員會",
    title: "浴室通水渠服務參差 看清消費貼示以防中伏",
    url: "https://www.consumer.org.hk/tc/article/513-plumbing-service",
    published: "2019-07",
    publishedLabel: "2019年7月，《選擇》513期",
  },
  {
    id: "hk01-arrests",
    publisher: "香港01",
    title: "兩名通渠男子被捕：消委會曾揭收費陷阱",
    url: "https://www.hk01.com/突發/659813",
    published: "2021-08-05",
    publishedLabel: "2021年8月5日",
  },
  {
    id: "hk01-anchor",
    publisher: "香港01",
    title: "柳俊江通渠報價經歷：$750 變 $7,500",
    url: "https://www.hk01.com/食玩買/854079",
    published: "2023-01-06",
    publishedLabel: "2023年1月6日",
  },
  {
    id: "hk01-phones",
    publisher: "香港01",
    title: "市民指致電不同通渠公司，疑似同一人接聽",
    url: "https://www.hk01.com/熱爆話題/256527",
    published: "2018-11-08",
    publishedLabel: "2018年11月8日",
  },
  {
    id: "hk01-kitchen",
    publisher: "香港01",
    title: "網民講述廚房通渠 $700 變 $7,500",
    url: "https://www.hk01.com/教煮/894828",
    published: "2023-05-16",
    publishedLabel: "2023年5月16日",
  },
  {
    id: "tvb-2026",
    publisher: "東張+／東張西望",
    title: "通渠加價及被要求錄音的消費爭議報道",
    url: "https://www.mytvsuper.com/tc/scoopplus/scoop/catch-up/17909420430657/東張西望-東張西望-呂姓通渠師傅坐地起價10倍劏客-眾苦主怒爆被逼錄音滿意服務--報東張曝光黑店手法",
    published: "2026-10-02",
    publishedLabel: "2026年10月2日",
  },
  {
    id: "uhk-2026",
    publisher: "UHK 港生活",
    title: "夜半通渠收費及錄音爭議：多名當事人講述經歷",
    url: "https://hk.ulifestyle.com.hk/topic/detail/20112395",
    published: "2026-10-03",
    publishedLabel: "2026年10月3日",
  },
  {
    id: "decoman-2026",
    publisher: "裝修佬",
    title: "通渠收費由千五至萬八及錄音爭議整理",
    url: "https://hkdecoman.com/article/57912",
    published: "2026-10-14",
    publishedLabel: "2026年10月14日",
  },
];
export interface ConsumerAlert {
  id: string;
  title: string;
  kind: AlertKind;
  status: string;
  published: string;
  dateLabel: string;
  topics: AlertTopic[];
  identity: string;
  summary: string;
  details: string;
  response: string;
  scope: string;
  sourceIds: string[];
}
export const CONSUMER_ALERTS: ConsumerAlert[] = [
  {
    id: "tvb-night-service-2026",
    title: "夜間通渠報價 $1,500，當事人指最後收費 $18,000",
    kind: "傳媒報道",
    status: "當事人指控；受訪師傅否認身份",
    published: "2026-10-02",
    dateLabel: "2026年10月2日首刊",
    topics: ["臨場加價", "錄音爭議", "身份疑問", "威嚇指控"],
    identity: "節目稱「呂姓師傅」；受訪者否認姓呂，完整商戶身份未核實。",
    summary:
      "《東張西望》訪問多名當事人，講述上門後大幅加價及被要求錄音確認服務的經歷；其中一人稱報價由 $1,500 升至 $18,000。",
    details:
      "報道另有當事人講述 $680 報價後被索價 $6,800 至 $10,000，以及 $600 報價後最終 $7,000 的安排。這些經歷在同一節目出現，本庫合為一組紀錄；UHK 及裝修佬的後續整理列為同組來源。",
    response:
      "節目追訪的師傅否認自己姓呂，表示奉公守法，並反駁收費爭議。身份與指控存在爭議，本庫保留其回應。",
    scope:
      "屬當事人說法及傳媒採訪，收錄來源沒有附法院裁決。不可只憑姓氏，把此人與其他年份案件或同名商戶連在一起。",
    sourceIds: ["tvb-2026", "uhk-2026", "decoman-2026"],
  },
  {
    id: "kitchen-quote-dispute-2023",
    title: "廚房通渠 $700 至 $7,500：網民質疑照片及報價改動",
    kind: "傳媒報道",
    status: "傳媒轉述網民陳述",
    published: "2023-05-16",
    dateLabel: "2023年5月16日",
    topics: ["臨場加價", "身份疑問"],
    identity: "原文沒有可供核對的完整商戶名稱。",
    summary:
      "香港01引述網民帖文，指通話報價 $700，上門後再提出外牆及機器工序，最終收費 $7,500；事主亦質疑收到的渠管照片與現場看過的不同。",
    details:
      "網民稱曾與不同師傅通話，後來有三人到場，令其懷疑接單關係。這是帖文中的疑問，不能據此確認公司股權、師傅身份或所有電話屬同一集團。",
    response: "所讀原文沒有載明可核對的涉事公司正式回應。",
    scope:
      "資料性質是傳媒轉述網民經歷，不是警方調查結論或裁決；保留匿名性，不從照片或地址推斷商戶身份。",
    sourceIds: ["hk01-kitchen"],
  },
  {
    id: "anchor-quote-dispute-2023",
    title: "柳俊江講述通渠報價由 $750 升至 $7,500",
    kind: "傳媒報道",
    status: "當事人公開經歷",
    published: "2023-01-06",
    dateLabel: "2023年1月6日",
    topics: ["臨場加價"],
    identity: "報道使用「渠王」稱呼，並非已核實的公司全名。",
    summary:
      "香港01引述柳俊江帖文，指廚房去水倒流後找人上門，報價隨所稱工具升級而上調；他最終沒有接受 $7,500 報價，支付 $1,500 結束當次安排。",
    details:
      "本紀錄以報道引述的當事人經歷為範圍，不採用評論區對其他師傅的猜測。首次報道日期是2023年1月6日，並非本庫核對日期。",
    response: "所讀原文沒有載明可核對的涉事公司正式回應。",
    scope:
      "不把「渠王」稱呼對應至任何同名公司；收錄來源沒有附裁決或完整商戶身份。",
    sourceIds: ["hk01-anchor"],
  },
  {
    id: "police-referral-arrests-2021",
    title: "警方通渠拘捕行動：商罪科跟進消委會轉介",
    kind: "官方紀錄",
    status: "警方公布拘捕；未附裁決",
    published: "2021-08-05",
    dateLabel: "2021年8月5日報道；10月警方回顧",
    topics: ["臨場加價", "威嚇指控"],
    identity: "收錄紀錄未公開完整公司名稱；不由姓氏辨認其他商戶。",
    summary:
      "警方《警聲》確認，商罪科跟進消委會轉介的通渠個案，搜證後於2021年8月拘捕兩名涉案師傅。香港01同期報道涉嫌欺詐及刑事恐嚇。",
    details:
      "同期新聞指兩人當時獲准保釋候查。《警聲》第1194期於2021年10月回顧警方與消委會合作及八月拘捕行動；官方回顧與同期新聞歸於同一組，沒有重複計作兩宗事件。",
    response: "收錄的官方回顧及同期報道沒有載明可核對的商戶回應或法院結果。",
    scope:
      "拘捕不等於定罪。本庫記錄來源當時狀態，未宣稱已完成此案件的所有後續裁決查冊。",
    sourceIds: ["police-1194", "hk01-arrests"],
  },
  {
    id: "consumer-a-price-2019",
    title: "消委會 A 公司個案：$1,500 報價，最終收費 $58,000",
    kind: "消委會個案",
    status: "消費投訴；商戶拒絕退款",
    published: "2019-07",
    dateLabel: "2019年7月，《選擇》513期個案一",
    topics: ["臨場加價"],
    identity: "消委會以 A 公司代稱，沒有公開完整商戶名稱。",
    summary:
      "消委會記錄住戶接受 $1,500 檢查連通渠報價，上門後被建議拆坐廁及額外清洗，最終支付 $58,000，事後要求協助退回部分款項。",
    details:
      "原文記錄拆卸費及不同清洗報價，住戶稱現場污水與對管道風險的擔心影響其決定。這是消委會整理的投訴經過，不是本庫判定工程應收多少。",
    response:
      "A 公司表示施工已獲住戶同意、費用包括三年保養，並稱高壓處理有賠償風險，拒絕退款。消委會亦記錄住戶對這些說法的質疑。",
    scope:
      "保留雙方說法及 A 公司匿名性，不把歷史收費當作當前市場價格或法律裁決。",
    sourceIds: ["consumer-513"],
  },
  {
    id: "consumer-b-leak-2019",
    title: "消委會 B 公司個案：通渠後漏水，售後跟進未果",
    kind: "消委會個案",
    status: "消費投訴；消委會記錄跟進",
    published: "2019-07",
    dateLabel: "2019年7月，《選擇》513期個案二",
    topics: ["施工損毀", "售後跟進"],
    identity: "消委會以 B 公司代稱，沒有公開完整商戶名稱。",
    summary:
      "住戶投訴接受 $900 高壓氣槍服務後浴缸邊漏水，另付 $3,000 找人維修，並質疑原公司沒有履行跟進承諾。",
    details:
      "消委會記錄另聘師傅對喉管受壓的判斷，以及住戶多次聯絡未果的經過。這些是個案資料，不推廣為所有使用同類工具的工程都會損壞。",
    response:
      "原文稱消委會致電聯絡到師傅及職員，但對方沒有完成跟進；投訴人其後要求把個案轉交海關調查。",
    scope: "轉交調查的要求不等於已立案、違法或定罪；收錄來源未附調查結果。",
    sourceIds: ["consumer-513"],
  },
  {
    id: "consumer-c-followup-2019",
    title: "消委會 C 公司個案：付 $8,300，一個月後再塞渠",
    kind: "消委會個案",
    status: "消費投訴；聯絡及單據爭議",
    published: "2019-07",
    dateLabel: "2019年7月，《選擇》513期個案三",
    topics: ["售後跟進", "身份疑問"],
    identity: "消委會以 C 公司及單據上的公司描述，沒有公開完整名稱。",
    summary:
      "住戶投訴支付 $8,300 清洗後，一個月再度淤塞，聯絡單據電話無人接聽；網站接線員表示單據不是其公司發出，不提供協助。",
    details:
      "消委會記錄曾向兩邊查詢，但未獲有效跟進，按單據地址寄出的信件亦被退回。紀錄反映收款、網站及售後聯絡身份值得預先核對。",
    response:
      "單據電話接聽職員以施工三小時解釋使用專業技術，對復發後如何處理沒有回應；網站接線員則不承認單據所屬。",
    scope:
      "本庫不由地址、電話猜測實際商戶或公司關係，也不把原文的效果承諾當作已證實結果。",
    sourceIds: ["consumer-513"],
  },
  {
    id: "phone-network-claims-2018",
    title: "不同通渠名稱，網民稱疑似同一人接聽電話",
    kind: "傳媒報道",
    status: "傳媒轉述網民陳述",
    published: "2018-11-08",
    dateLabel: "2018年11月8日",
    topics: ["身份疑問", "臨場加價"],
    identity: "原文有部分遮蔽名稱；本庫不補全名稱或電話。",
    summary:
      "香港01引述討論區帖文，指市民致電不同通渠名稱時，懷疑由同一人接聽；另有網民分享報價及上門收費出現差異的經歷。",
    details:
      "這組內容來自傳媒轉述的網上討論，未確認各個電話、公司或師傅之間的法律或營運關係。",
    response: "所讀原文沒有載明可核對的涉事公司正式回應。",
    scope:
      "聲線相似或網民猜測不足以確認同一人、同一集團或違法；匿名帖文不作商戶定性依據。",
    sourceIds: ["hk01-phones"],
  },
];

export interface AlertFilters {
  q?: string;
  kind?: string;
  topic?: string;
  order?: string;
}
export function filterConsumerAlerts(
  filters: AlertFilters,
  records = CONSUMER_ALERTS
) {
  const normalize = (value: string) =>
    value
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[,，$]/g, "");
  const terms = normalize(filters.q?.trim() || "")
    .split(/\s+/)
    .filter(Boolean);
  return records
    .filter(record => {
      const sources = ALERT_SOURCES.filter(source =>
        record.sourceIds.includes(source.id)
      );
      const haystack = normalize(
        [
          record.title,
          record.summary,
          record.details,
          record.identity,
          record.response,
          record.status,
          record.dateLabel,
          ...record.topics,
          ...sources.map(s => s.publisher),
        ].join(" ")
      );
      return (
        (!filters.kind || record.kind === filters.kind) &&
        (!filters.topic ||
          record.topics.includes(filters.topic as AlertTopic)) &&
        terms.every(term => haystack.includes(term))
      );
    })
    .sort(
      (a, b) =>
        (filters.order === "oldest" ? 1 : -1) *
          a.published.localeCompare(b.published) || a.id.localeCompare(b.id)
    );
}
export const OFFICIAL_CONSUMER_RESOURCES = [
  {
    label: "消委會：投訴及查詢途徑",
    url: "https://www.consumer.org.hk/tc/complaints-and-services/complaint-and-enquiry-channels",
    description: "查看官方受理範圍及聯絡方法。",
  },
  {
    label: "消委會：被點名的商號",
    url: "https://www.consumer.org.hk/tc/complaints-and-services/named-firms",
    description: "官方點名內容以消委會原頁及日期為準，不表示所有商號涉及通渠。",
  },
  {
    label: "消委會：不良商戶名單",
    url: "https://www.consumer.org.hk/tc/complaints-and-services/sanctioned-traders",
    description:
      "官方名單有其適用範圍；本庫沒有把此處的其他行業商號列作通渠公司。",
  },
];
