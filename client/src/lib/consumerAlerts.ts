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
  sourceType: "報道" | "官方資料" | "轉載" | "專欄整理" | "節目整理";
  summary?: string;
  note?: string;
}
export const ALERT_SOURCES: AlertSource[] = [
  {
    id: "police-1194",
    publisher: "香港警務處《警聲》",
    title: "商罪科與消委會攜手打擊騙案",
    url: "https://www.police.gov.hk/offbeat/1194/chi/9010.html",
    published: "2021-10-13",
    publishedLabel: "2021年10月13日，第1194期",
    sourceType: "官方資料",
  },
  {
    id: "consumer-513",
    publisher: "消費者委員會",
    title: "浴室通水渠服務參差 看清消費貼示以防中伏",
    url: "https://www.consumer.org.hk/tc/article/513-plumbing-service",
    published: "2019-07",
    publishedLabel: "2019年7月，《選擇》513期",
    sourceType: "官方資料",
  },
  {
    id: "hk01-arrests",
    publisher: "香港01",
    title: "兩名通渠男子被捕：消委會曾揭收費陷阱",
    url: "https://www.hk01.com/突發/659813",
    published: "2021-08-05",
    publishedLabel: "2021年8月5日",
    sourceType: "報道",
  },
  {
    id: "hk01-anchor",
    publisher: "香港01",
    title: "柳俊江通渠報價經歷：$750 變 $7,500",
    url: "https://www.hk01.com/食玩買/854079",
    published: "2023-01-06",
    publishedLabel: "2023年1月6日",
    sourceType: "報道",
  },
  {
    id: "hk01-phones",
    publisher: "香港01",
    title: "市民指致電不同通渠公司，疑似同一人接聽",
    url: "https://www.hk01.com/熱爆話題/256527",
    published: "2018-11-08",
    publishedLabel: "2018年11月8日",
    sourceType: "報道",
  },
  {
    id: "hk01-kitchen",
    publisher: "香港01",
    title: "網民講述廚房通渠 $700 變 $7,500",
    url: "https://www.hk01.com/教煮/894828",
    published: "2023-05-16",
    publishedLabel: "2023年5月16日",
    sourceType: "報道",
  },
  {
    id: "tvb-2026",
    publisher: "東張+／東張西望",
    title: "通渠加價及被要求錄音的消費爭議報道",
    url: "https://www.mytvsuper.com/tc/scoopplus/scoop/catch-up/17909420430657/東張西望-東張西望-呂姓通渠師傅坐地起價10倍劏客-眾苦主怒爆被逼錄音滿意服務--報東張曝光黑店手法",
    published: "2026-10-02",
    publishedLabel: "2026年10月2日",
    sourceType: "報道",
  },
  {
    id: "uhk-2026",
    publisher: "UHK 港生活",
    title: "夜半通渠收費及錄音爭議：多名當事人講述經歷",
    url: "https://hk.ulifestyle.com.hk/topic/detail/20112395",
    published: "2026-10-03",
    publishedLabel: "2026年10月3日",
    sourceType: "報道",
  },
  {
    id: "decoman-2026",
    publisher: "裝修佬",
    title: "通渠收費由千五至萬八及錄音爭議整理",
    url: "https://hkdecoman.com/article/57912",
    published: "2026-10-14",
    publishedLabel: "2026年10月14日",
    sourceType: "報道",
  },
  {
    id: "weekend-night-2026",
    publisher: "新假期",
    title: "東張西望通渠加價及錄音爭議：多名當事人接受訪問",
    url: "https://www.weekendhk.com/entertainment/tvb-東張西望-通渠黑店-坐地起價-3516726/",
    published: "2026-10-02",
    publishedLabel: "2026年10月02日",
    sourceType: "節目整理",
    summary: "整理節目中夜間通渠收費及錄音爭議，並載有受訪師傅否認姓呂的回應。",
    note: "同集《東張西望》的整理，與東張原報道歸為同組。",
  },
  {
    id: "orientalsunday-night-2026",
    publisher: "東方新地",
    title: "東張西望通渠爭議：當事人講述加價及錄音經過",
    url: "https://www.orientalsunday.hk/最新娛聞/tvb-東張西望-通渠黑店-坐地起價-1718089/",
    published: "2026-10-02",
    publishedLabel: "2026年10月02日",
    sourceType: "轉載",
    summary: "刊載同一節目的加價及錄音爭議內容，保留受訪者否認身份的段落。",
    note: "頁面註明原文刊於新假期；屬同稿轉載，不是獨立調查。",
  },
  {
    id: "hothk-night-2026",
    publisher: "香港頭條",
    title: "電話報價 $1,500 至 $18,000：通渠錄音爭議整理",
    url: "https://www.hothk.com/article/11490",
    published: "2026-10-03",
    publishedLabel: "2026年10月03日",
    sourceType: "節目整理",
    summary: "以節目提及的加價及錄音爭議整理消費提示。",
    note: "屬節目題材整理；身份及回應以原節目及同組資料為準。",
  },
  {
    id: "hk01-council-2019",
    publisher: "香港01",
    title: "消委會：通渠收費 $1,500 變 $58,000，另有維修後再淤塞個案",
    url: "https://www.hk01.com/社會新聞/351926",
    published: "2019-07-15",
    publishedLabel: "2019年07月15日",
    sourceType: "報道",
    summary: "報道消委會三個通渠投訴個案，包括臨場加價、漏水及單據／售後爭議。",
  },
  {
    id: "decoman-anchor-2023",
    publisher: "裝修佬／晴報專欄",
    title: "柳俊江廚房塞渠：「渠王」上門報價由 $750 升至 $7,500",
    url: "https://hkdecoman.com/article/56527",
    published: "2023-01-04",
    publishedLabel: "2023年01月04日",
    sourceType: "轉載",
    summary:
      "刊載柳俊江公開帖文中工具升級、報價變動及支付 $1,500 結束安排的經歷。",
    note: "頁面署名晴報；屬同一公開帖文的轉述，不是另一宗個案。",
  },
  {
    id: "bastille-anchor-2023",
    publisher: "巴士的報",
    title: "柳俊江分享「渠王初體驗」：半小時報價多次上調",
    url: "https://www.bastillepost.com/hongkong/article/12027071",
    published: "2023-01-07",
    publishedLabel: "2023年01月07日",
    sourceType: "報道",
    summary:
      "引述當事人帖文，交代由 $750 至 $7,500 的報價，以及最終沒有接受該報價。",
  },
  {
    id: "headline-anchor-2023",
    publisher: "星島頭條",
    title: "Juicy叮：柳俊江分享疑中伏的通渠經歷",
    url: "https://www.stheadline.com/world-topics/3185378/Juicy叮分享疑中伏渠王初體驗-柳俊江報價似炒緊必理痛",
    published: "2023-01-07",
    publishedLabel: "2023年01月07日",
    sourceType: "報道",
    summary:
      "引述柳俊江公開經歷及網民留言，並回顧2021年警方行動；兩件事不作身份連結。",
  },
  {
    id: "deco-council-2020",
    publisher: "裝修學院",
    title: "消委會三個通渠投訴個案及報價、單據、售後提示",
    url: "https://deco-academy.com/blog/85",
    published: "2020-11-27",
    publishedLabel: "2020年11月27日",
    sourceType: "專欄整理",
    summary:
      "整理2019年消委會 A、B、C 公司個案及消費提示，並非2020年新增三宗投訴。",
  },
  {
    id: "deco-anchor-2023",
    publisher: "裝修學院",
    title: "柳俊江廚房塞渠：報價由 $750 至 $7,500 的公開經歷",
    url: "https://deco-academy.com/blog/369",
    published: "2023-01-04",
    publishedLabel: "2023年01月04日",
    sourceType: "轉載",
    summary: "刊載同一柳俊江帖文及家居通渠相關內容。",
    note: "與裝修佬頁面同題、同稿，列作轉載來源，不當作新增個案。",
  },
  {
    id: "headline-price-2024",
    publisher: "星島頭條",
    title: "上門通渠報價爭議：網民稱 $800 最後收 $8,000",
    url: "https://www.stheadline.com/renovation/3384572/%E4%B8%8A%E9%96%80%E9%80%9A%E6%B8%A0%E9%81%AD%E5%9D%90%E5%9C%B0%E8%B5%B7%E5%83%B9%E8%B2%B410%E5%80%8D-%E5%9F%8B%E5%96%AE%E7%95%808000-%E5%B0%88%E5%AE%B6%E6%95%993%E5%A4%A7%E8%87%AA%E6%95%91%E6%96%B9%E6%B3%95",
    published: "2024-09-21",
    publishedLabel: "2024年09月21日",
    sourceType: "報道",
    summary:
      "引述 Facebook 帖文及留言，有人稱 $1,500 加至 $3,500，另有人稱 $800 最後收 $8,000。",
  },
  {
    id: "hk01-price-2025",
    publisher: "香港01",
    title: "港漂講述天價通渠：報價 $700 最後收 $18,000",
    url: "https://www.hk01.com/%E9%96%8B%E7%BD%90/60240757/%E6%B8%AF%E6%BC%82%E5%91%BB%E8%A2%AB%E5%9D%91%E5%A4%A9%E5%83%B9%E9%80%9A%E6%B8%A0-%E5%A0%B1%E5%83%B9-700%E5%9F%8B%E5%96%AE%E8%AE%8A-18-000-%E5%B0%88%E5%AE%B6%E6%95%991%E6%8B%9Bdiy%E9%80%9A%E6%B8%A0",
    published: "2025-05-22",
    publishedLabel: "2025年05月22日",
    sourceType: "報道",
    summary: "轉述小紅書住戶的鋅盤通渠經歷，報價經 $4,800 再升至 $18,000。",
    note: "原發布日為5月22日；5月23日是更新日期。",
  },
  {
    id: "mreferral-column-2025",
    publisher: "經絡按揭轉介 mReferral",
    title: "裝修佬專欄：通渠 $700 至 $7,500，整理格價及加價爭議",
    url: "https://www.mreferral.com/blog/%E8%A3%9D%E4%BF%AE%E4%BD%AC%E5%B0%88%E6%AC%84-%E9%80%9A%E6%B8%A0%E9%A8%99%E6%A1%88-%E4%B8%8A%E7%B6%B2%E6%90%B5%E9%80%9A%E6%B8%A0%E4%BD%AC%E4%B8%AD%E4%BC%8F-700%E8%9A%8A%E8%AE%8A7500%E8%9A%8A-%E6%8F%AD%E6%85%A3%E5%B8%B8%E6%89%8B%E6%B3%952%E5%A4%A7%E7%89%B9%E5%BE%B5/",
    published: "2025-02-21",
    publishedLabel: "2025年02月21日",
    sourceType: "專欄整理",
    summary: "刊載裝修佬提供的案例整理，討論多名接單師傅及逐項加價。",
    note: "採用原頁正文標示的2025年2月21日，不把文中的2024年12月28日節目日期當作刊出日。",
  },
  {
    id: "headline-price-2025",
    publisher: "星島頭條",
    title: "港漂稱通渠報價逐級跳：$700 至 $18,000",
    url: "https://www.stheadline.com/lifetips/3457198/%E5%A4%A9%E5%83%B9%E9%80%9A%E6%B8%A0%E6%B8%AF%E6%BC%82%E5%91%BB%E4%B8%AD%E4%BC%8F%E5%A0%B1%E5%83%B9700%E4%B8%8A%E9%96%80%E6%AA%A2%E6%9F%A5%E9%80%90%E7%B4%9A%E8%B7%B3-%E6%9C%80%E7%B5%82%E5%9F%8B%E5%96%AE%E8%AE%8A18000%E9%99%84%E5%B0%88%E5%AE%B6%E6%95%994%E6%8B%9B%E8%87%AA%E8%A1%8C%E9%80%9A%E6%B8%A0",
    published: "2025-05-20",
    publishedLabel: "2025年05月20日",
    sourceType: "報道",
    summary:
      "引述入住新屋四年的住戶帖文，交代鋅盤堵塞、兩名師傅先後到場及收費變動。",
  },
  {
    id: "am730-column-2025",
    publisher: "am730",
    title: "好裝修：網上找通渠師傅，$700 變 $7,500 的案例整理",
    url: "https://www.am730.com.hk/article/523278",
    published: "2025-01-11",
    publishedLabel: "2025年01月11日",
    sourceType: "專欄整理",
    summary: "裝修佬專欄整理格價、多人到場及外牆工序加價的說法。",
    note: "內容由裝修佬提供；同專欄跨平台刊出，不當作多宗獨立個案。",
  },
  {
    id: "midland-column-2025",
    publisher: "美聯物業",
    title: "裝修佬專欄：通渠 $700 至 $7,500 及兩類常見爭議",
    url: "https://www.midland.com.hk/zh-hk/property-news/%E6%A5%AD%E4%B8%BB%E8%B2%BC%E5%A3%AB/%E5%AE%B6%E5%B1%85%E7%94%9F%E6%B4%BB/%E3%80%90%E9%80%9A%E6%B8%A0%E9%A8%99%E6%A1%88%E3%80%91%E4%B8%8A%E7%B6%B2%E6%90%B5%E9%80%9A%E6%B8%A0%E4%BD%AC%E4%B8%AD%E4%BC%8F-700%E8%9A%8A%E8%AE%8A7500%E8%9A%8A-%E6%8F%AD%E6%85%A3%E5%B8%B8%E6%89%8B/",
    published: "2025-02-07",
    publishedLabel: "2025年02月07日",
    sourceType: "專欄整理",
    summary: "刊載裝修佬對接單身份與施工期間加價的整理及消費提示。",
    note: "頁面標示由裝修佬提供；與同組專欄來源分別列刊出日期。",
  },
  {
    id: "tvb-toilet-2025",
    publisher: "東張+／東張西望",
    title: "廁所倒灌通渠收費 $55,000：住戶向東張反映爭議",
    url: "https://www.mytvsuper.com/tc/scoopplus/scoop/catch-up/15954004837582/%E6%9D%B1%E5%BC%B5%E8%A5%BF%E6%9C%9B-%E6%9D%B1%E5%BC%B5%E8%A5%BF%E6%9C%9B-%E7%96%8F%E9%80%9A%E5%BB%81%E6%89%80%E5%A0%B5%E5%A1%9E%E8%A2%AB%E9%96%8B%E5%A4%A9%E6%AE%BA%E5%83%B9%E6%94%B65-5%E8%90%AC%E5%85%83--%E8%8B%A6%E4%B8%BB%E5%A0%B1%E6%9D%B1%E5%BC%B5%E6%96%A5%E7%84%A1%E8%89%AF%E9%80%9A%E6%B8%A0%E5%B8%AB%E7%88%B6%E6%AC%BA%E8%A9%90",
    published: "2025-09-20",
    publishedLabel: "2025年09月20日",
    sourceType: "報道",
    summary:
      "訪問墊支 $55,000 通渠費的李小姐，涉及收費及由業主還是立案法團承擔的爭議。",
  },
  {
    id: "uhk-price-2025",
    publisher: "UHK 港生活",
    title: "港漂通渠報價 $700 變 $18,000：住戶質疑逐級加價",
    url: "https://hk.ulifestyle.com.hk/topic/detail/20065275/%E6%B8%AF%E6%BC%82%E9%80%9A%E6%B8%A0%E8%A2%AB%E5%8A%8F%E5%91%BB%E4%B8%AD%E4%BC%8F-%E9%80%9A%E6%B8%A0%E8%B2%BB%E7%AB%9F%E8%AE%8A-%E6%B6%88%E5%A7%94%E6%9C%83%E6%95%99-%E6%8B%9B%E8%87%AA%E4%BF%9D",
    published: "2025-05-22",
    publishedLabel: "2025年05月22日",
    sourceType: "報道",
    summary: "轉述同一小紅書帖文，並整理消委會的單據、保養及商戶身份提示。",
  },
  {
    id: "sundaykiss-column-2025",
    publisher: "SundayKiss",
    title: "貨比三家仍遇通渠加價？$700 至 $7,500 的專欄整理",
    url: "https://www.sundaykiss.com/%E5%AE%B6%E4%BA%8B%E9%81%94%E4%BA%BA/%E5%AE%B6%E5%B1%85%E6%B8%85%E6%BD%94-%E5%BB%9A%E6%88%BF%E6%B8%85%E6%BD%94-%E9%80%9A%E6%B8%A0%E4%BD%AC-%E4%B8%AD%E4%BC%8F-%E8%A3%9D%E4%BF%AE%E4%BD%AC-sk25-2039250/",
    published: "2025-02-13",
    publishedLabel: "2025年02月13日",
    sourceType: "專欄整理",
    summary: "刊載裝修佬提供的多人接單及臨場加價案例。",
    note: "原頁註明內容及圖片由裝修佬提供，不視為另一宗已核實事件。",
  },
  {
    id: "nmplus-night-2026",
    publisher: "New Monday",
    title: "東張西望：通渠加價及錄音爭議的跨平台整理",
    url: "https://www.nmplus.hk/entertainment/tvb-%E6%9D%B1%E5%BC%B5%E8%A5%BF%E6%9C%9B-%E9%80%9A%E6%B8%A0%E9%BB%91%E5%BA%97-%E5%9D%90%E5%9C%B0%E8%B5%B7%E5%83%B9-1657565/",
    published: "2026-10-02",
    publishedLabel: "2026年10月02日",
    sourceType: "轉載",
    summary:
      "刊載同一《東張西望》加價及錄音事件內容，亦保留受訪者否認身份的描述。",
    note: "與新假期／東方新地同題同稿，並非獨立調查。",
  },
  {
    id: "oncc-arrests-2021",
    publisher: "on.cc 東網",
    title: "消委會三年接逾70宗通渠投訴，警方跟進拘捕兩人",
    url: "https://hk.on.cc/hk/bkn/cnt/news/20210805/bkn-20210805125032310-0805_00822_001.html",
    published: "2021-08-05",
    publishedLabel: "2021年08月05日",
    sourceType: "報道",
    summary: "報道警方跟進轉介、兩人被捕及獲准保釋候查的當時狀態。",
  },
  {
    id: "hk01-arrests-detail-2021",
    publisher: "香港01",
    title: "通渠收費及威嚇指控：兩男涉欺詐及刑事恐嚇被捕",
    url: "https://www.hk01.com/%E7%AA%81%E7%99%BC/659803/%E9%80%9A%E6%B8%A0%E6%BF%AB%E6%94%B6%E8%B2%BB%E5%8F%88%E5%A8%81%E5%9A%87-%E5%A0%B1%E5%83%B9%E6%95%B8%E7%99%BE%E5%9F%8B%E5%96%AE%E9%81%8E%E8%90%AC-%E6%8B%982%E7%94%B7%E5%AD%90%E6%B6%89%E6%AC%BA%E8%A9%90%E5%8F%8A%E5%88%91%E4%BA%8B%E6%81%90%E5%9A%87",
    published: "2021-08-05",
    publishedLabel: "2021年08月05日",
    sourceType: "報道",
    summary: "報道警方調查及拘捕兩名分屬不同公司的男子；未附法院裁決。",
    note: "與同日659813號消委會背景文章是不同報道，歸於同一拘捕事件。",
  },
  {
    id: "oncc-council-2019",
    publisher: "on.cc 東網",
    title: "消委會通渠投訴：$1,500 至 $58,000 及售後跟進爭議",
    url: "https://hk.on.cc/hk/bkn/cnt/news/20190715/bkn-20190715100109949-0715_00822_001.html",
    published: "2019-07-15",
    publishedLabel: "2019年07月15日",
    sourceType: "報道",
    summary:
      "報道消委會三個投訴個案，並載有 A 公司以風險及同意施工解釋收費的回應。",
  },
  {
    id: "headline-council-2019",
    publisher: "星島頭條",
    title: "消委會：座廁拆卸後報價由 $1,500 升至 $58,000",
    url: "https://www.stheadline.com/article/1950811/%E6%B6%88%E5%A7%94%E6%9C%83%E5%BA%A7%E5%BB%81%E8%A2%AB%E6%8B%86%E5%BE%8C%E5%9D%90%E5%9C%B0%E8%B5%B7%E5%83%B9-1500%E5%85%83%E8%AE%8A58000%E5%85%83",
    published: "2019-07-15",
    publishedLabel: "2019年07月15日",
    sourceType: "報道",
    summary: "報道 A 公司的加價投訴，亦提及 C 公司再次淤塞及單據聯絡爭議。",
  },
  {
    id: "orientaldaily-arrests-2021",
    publisher: "東方日報",
    title: "通渠高額維修費及威嚇指控：兩名男子被捕",
    url: "https://orientaldaily.on.cc/content/%E8%A6%81%E8%81%9E%E6%B8%AF%E8%81%9E/odn-20210806-0806_00176_241/%E9%80%BC%E5%AE%A2%E4%BB%98%E5%A4%A9%E5%83%B9%E7%B6%AD%E4%BF%AE%E8%B2%BB--%E5%85%A9%E8%A0%B1%E6%83%91%E9%80%9A%E6%B8%A0%E4%BD%AC%E5%B0%B1%E9%80%AE",
    published: "2021-08-06",
    publishedLabel: "2021年08月06日",
    sourceType: "報道",
    summary: "翌日報道同一警方行動，記錄涉案男子當時獲准保釋候查。",
  },
  {
    id: "dotdot-price-2025",
    publisher: "點新聞",
    title: "港漂反映天價通渠：報價 $700，檢查後收 $18,000",
    url: "https://www.dotdotnews.com/s/202505/21/AP682d93dee4b0a242bf01b40f.html",
    published: "2025-05-21",
    publishedLabel: "2025年05月21日",
    sourceType: "報道",
    summary:
      "正文轉述同一小紅書帖文的加價過程，與星島、香港01及 UHK 歸為同組。",
    note: "核對新聞正文，不以頁面的 AI 摘要作事實依據。",
  },
];

export const ALERT_REPORT_COUNT = ALERT_SOURCES.filter(
  source => source.sourceType !== "官方資料"
).length;
export const ALERT_OFFICIAL_COUNT = ALERT_SOURCES.length - ALERT_REPORT_COUNT;

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
    sourceIds: [
      "tvb-2026",
      "uhk-2026",
      "decoman-2026",
      "weekend-night-2026",
      "orientalsunday-night-2026",
      "hothk-night-2026",
      "nmplus-night-2026",
    ],
  },
  {
    id: "toilet-fee-dispute-2025",
    title: "廁所倒灌通渠收費 $55,000，住戶反映墊支及報價爭議",
    kind: "傳媒報道",
    status: "當事人指控；節目未聯絡到涉事師傅",
    published: "2025-09-20",
    dateLabel: "2025年9月20日",
    topics: ["臨場加價", "售後跟進"],
    identity: "節目稱「陳師父」，未提供可核對的完整公司名稱。",
    summary:
      "《東張西望》訪問李小姐，指廁所污水倒灌後找師傅處理，被收取 $55,000；她稱自己先墊支費用，事後與業主對款項承擔未有解決。",
    details:
      "報道指先後有兩名師傅到場，第二人稱被石屎堵塞。節目另訪問裝修學院鄧世民評論收費；該意見是受訪者針對報道情況的判斷，並非本庫訂立的市場統一價目。",
    response:
      "節目表示曾致電涉事陳師父但無人接聽。沒有把未接聽寫成承認指控；來源未載業主完整回應或裁決。",
    scope:
      "是否由業主、租客或立案法團承擔，須按實際管段與安排確認。原文提及的商議及指控不等於已證實欺詐，也不以姓氏辨認其他公司。",
    sourceIds: ["tvb-toilet-2025"],
  },
  {
    id: "kitchen-fee-dispute-2025",
    title: "港漂講述鋅盤通渠 $700 變 $18,000，多家傳媒轉述同一帖文",
    kind: "傳媒報道",
    status: "傳媒轉述小紅書住戶陳述",
    published: "2025-05-20",
    dateLabel: "2025年5月20日起多家報道",
    topics: ["臨場加價"],
    identity: "報道沒有可核對的完整涉事商戶名稱。",
    summary:
      "住戶稱鋅盤去水慢及倒流，聯絡師傅後獲報價 $700；到場後先升至 $4,800，再以管內碎石及高壓處理為由報價 $18,000。",
    details:
      "星島頭條、點新聞、香港01及 UHK 引述同一住戶帖文，均提及入住新屋四年、兩名師傅及逐次加價。當事人稱最終完成通渠，但質疑收費。四篇報道歸為一組，沒有當作四宗投訴。",
    response:
      "所讀報道未載可核對的涉事商戶正式回應或警方／法院結論。網民對收費的評論不代表本庫核實的工程估價。",
    scope:
      "這是同一社交帖文的傳媒轉述，不是四家傳媒各自驗證了同一違法事實。原文提及的屋苑是師傅舉例，不能據此認定施工地區或涉事商戶。",
    sourceIds: [
      "headline-price-2025",
      "dotdot-price-2025",
      "hk01-price-2025",
      "uhk-price-2025",
    ],
  },
  {
    id: "quotation-columns-2025",
    title: "專欄整理：網上格價、多名師傅接單與 $700 至 $7,500 加價爭議",
    kind: "傳媒報道",
    status: "同一供稿專欄的跨平台刊載",
    published: "2025-01-11",
    dateLabel: "2025年1月至2月各平台刊載",
    topics: ["身份疑問", "臨場加價"],
    identity: "供稿以「事主A」及師傅描述，未確認完整商戶身份。",
    summary:
      "am730、SundayKiss、美聯物業及經絡刊載裝修佬提供的專欄，整理多名師傅曾與同一住戶通話，以及上門後逐項加價的說法。",
    details:
      "專欄提及2024年12月28日《東張西望》訪問，並以 $700、另加 $800、外牆工序 $5,500／$7,500 等例子說明爭議。節目日期與各平台刊出日期分開保存，經絡頁面正文標示2025年2月21日。",
    response:
      "專欄包含裝修學院代表的意見及預防爭議提示，未載可核對的涉事公司正式回應。",
    scope:
      "這組是相關專欄資料，不額外認定新受害人或新商戶。其描述與既有案例相似，不因金額及做法相同就確認為同一人、同一公司或另一宗事件。",
    sourceIds: [
      "am730-column-2025",
      "midland-column-2025",
      "sundaykiss-column-2025",
      "mreferral-column-2025",
    ],
  },
  {
    id: "price-accounts-2024",
    title: "網民講述上門通渠加價：$1,500 至 $3,500，另有人稱 $800 至 $8,000",
    kind: "傳媒報道",
    status: "傳媒轉述 Facebook 帖文及留言",
    published: "2024-09-21",
    dateLabel: "2024年9月21日",
    topics: ["臨場加價"],
    identity: "報道沒有可核對的完整涉事工程公司名稱。",
    summary:
      "星島頭條引述網民發文稱通渠由 $1,500 加至 $3,500；評論區另有人稱最初報價 $800，最後收費 $8,000。",
    details:
      "同一文章亦訪問驗樓師，討論淤塞徵兆及通渠處理。主帖與留言的兩個金額分別註明，不拼成同一住戶經歷，也不以評論數推算投訴宗數。",
    response:
      "所讀報道沒有載明可核對的涉事公司正式回應。受訪者對合理收費的意見不等於本庫獨立完成現場估價。",
    scope:
      "資料來自傳媒轉述的社交帖文及留言，未附裁決。只整理消費爭議部分，沒有把文內所有自行通渠方法轉作本庫建議。",
    sourceIds: ["headline-price-2024"],
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
    published: "2023-01-04",
    dateLabel: "2023年1月4日起多家刊載",
    topics: ["臨場加價"],
    identity: "報道使用「渠王」稱呼，並非已核實的公司全名。",
    summary:
      "香港01引述柳俊江帖文，指廚房去水倒流後找人上門，報價隨所稱工具升級而上調；他最終沒有接受 $7,500 報價，支付 $1,500 結束當次安排。",
    details:
      "本紀錄以報道引述的當事人經歷為範圍，不採用評論區對其他師傅的猜測。香港01原刊日期為2023年1月6日；新增裝修佬及裝修學院頁面標示2023年1月4日。同一公開帖文的多篇報道及轉載歸於一組。",
    response: "所讀原文沒有載明可核對的涉事公司正式回應。",
    scope:
      "不把「渠王」稱呼對應至任何同名公司；收錄來源沒有附裁決或完整商戶身份。",
    sourceIds: [
      "hk01-anchor",
      "decoman-anchor-2023",
      "bastille-anchor-2023",
      "headline-anchor-2023",
      "deco-anchor-2023",
    ],
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
    sourceIds: [
      "police-1194",
      "hk01-arrests",
      "oncc-arrests-2021",
      "hk01-arrests-detail-2021",
      "orientaldaily-arrests-2021",
    ],
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
    sourceIds: [
      "consumer-513",
      "hk01-council-2019",
      "deco-council-2020",
      "oncc-council-2019",
      "headline-council-2019",
    ],
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
    sourceIds: [
      "consumer-513",
      "hk01-council-2019",
      "deco-council-2020",
      "oncc-council-2019",
    ],
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
    sourceIds: [
      "consumer-513",
      "hk01-council-2019",
      "deco-council-2020",
      "oncc-council-2019",
      "headline-council-2019",
    ],
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
      const recordText = normalize(
        [
          record.title,
          record.summary,
          record.details,
          record.identity,
          record.response,
          record.status,
          record.dateLabel,
          ...record.topics,
        ].join(" ")
      );
      const haystack =
        recordText +
        " " +
        normalize(
          sources
            .flatMap(s => [
              s.publisher,
              s.title,
              s.summary || "",
              s.note || "",
              s.sourceType,
              s.published,
            ])
            .join(" ")
        );
      return (
        (!filters.kind || record.kind === filters.kind) &&
        (!filters.topic ||
          record.topics.includes(filters.topic as AlertTopic)) &&
        // One publication can discuss several cases. An amount in a shared
        // source title must not make every cited case look like that amount.
        terms.every(term =>
          (/^\d+$/.test(term) ? recordText : haystack).includes(term)
        )
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
