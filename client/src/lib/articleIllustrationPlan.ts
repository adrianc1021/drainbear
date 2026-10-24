import sectionPlacements from "./articleSectionIllustrations.json";
import { ARTICLE_IMAGES } from "./articleImages";

export const ARTICLE_ILLUSTRATION_DATE = "2026-10-24";
type Placement =
  | { afterHeading: string; image: keyof typeof ARTICLE_IMAGES }
  | { afterText: string; image: keyof typeof ARTICLE_IMAGES };

/** Explicit editorial positions; missing/renamed headings never receive random images. */
export const ARTICLE_ILLUSTRATIONS: Record<string, Placement[]> = {
  "toilet-gurgling-sounds-drain-check": [
    { afterHeading: "有咕嚕聲就要通渠，或者一定要照渠嗎？", image: "camera" },
  ],
  "tenant-blocked-drain-landlord-arrangements": [
    { afterHeading: "第二步：把可處理範圍和報價確認人問清楚", image: "quote" },
  ],
  "home-drain-service-preparation-protection": [
    { afterHeading: "完工後試水，要按實際處理位置核對", image: "waterTest" },
  ],
  "choosing-professional-drain-company": [
    { afterHeading: "揀通渠公司，先比較這五項", image: "quote" },
    { afterHeading: "通渠熊適合處理哪些問題？", image: "services" },
    { afterText: "家居洗手盆長期去水慢：", image: "basinCase" },
    { afterText: "學校戶外雨水渠積水：", image: "schoolCase" },
  ],
  "24-hour-drain-help-night": [
    { afterHeading: "先睇三個訊號，決定怎樣交代情況", image: "observe" },
    { afterHeading: "聯絡時不用寫長篇，先提供這些資料", image: "handoff" },
  ],
  "drain-service-completion-checklist": [
    { afterHeading: "坐廁、鋅盤與公共渠，要分開測試", image: "observe" },
    { afterHeading: "四項完成交代，值得記錄下來", image: "quote" },
  ],
  "sink-drain-access-disassembly": [
    { afterHeading: "為甚麼師傅會查看櫃底？", image: "prepare" },
    { afterHeading: "清出空間，但不要自行鬆開喉件", image: "waterTest" },
  ],
  "toilet-foreign-object-drain-service": [
    { afterHeading: "記低甚麼物件，不要再加力推進", image: "observe" },
    { afterHeading: "有異物，就一定要拆坐廁嗎？", image: "prepare" },
  ],
  "24-hour-restaurant-drain-emergency": [
    { afterHeading: "先列受影響設備，別只拍一個水面", image: "services" },
    { afterHeading: "營業中可否施工，要看現場分隔條件", image: "quote" },
  ],
  "property-drain-maintenance-plan": [
    { afterHeading: "巡查、清洗與照喉，目的不同", image: "camera" },
    { afterHeading: "每次處理後，留下可交接的紀錄", image: "handoff" },
  ],
  "village-house-drain-access-planning": [
    { afterHeading: "從落車位置開始，交代工具搬運路線", image: "services" },
    { afterHeading: "沙井安全：住戶不用入井確認", image: "property" },
  ],
  "moving-home-drain-inspection": [
    { afterHeading: "先取得同意，逐個位置觀察", image: "observe" },
    { afterHeading: "基本試水與管內檢查，回答不同問題", image: "camera" },
  ],
  "24-hour-shared-drain-backflow-coordination": [
    { afterHeading: "住戶先做甚麼，管理處協調甚麼？", image: "handoff" },
    { afterHeading: "公共道路與私人管道，不宜靠相片判責任", image: "property" },
  ],
  "slow-basin-drain-causes-solutions": [
    { afterHeading: "如何判斷問題位於哪裏？", image: "sink" },
    { afterHeading: "查詢前可以準備甚麼？", image: "prepare" },
  ],
  "drain-gurgling-sound-causes": [
    { afterHeading: "4種常見情況", image: "observe" },
    { afterHeading: "何時需要安排檢查？", image: "camera" },
  ],
  "drain-company-reviews-red-flags": [
    { afterHeading: "確認前，先核對四項資料", image: "quote" },
    { afterHeading: "施工完成，留下可核對的結果", image: "waterTest" },
  ],
  "ceiling-water-seepage-drainage-causes": [
    { afterHeading: "可以先記錄甚麼？", image: "handoff" },
    { afterHeading: "發現滲水時應怎樣處理？", image: "quote" },
  ],
  "tree-roots-in-underground-drain": [
    { afterHeading: "如何確認是否真的有樹根？", image: "camera" },
    { afterHeading: "何時應安排進一步檢查？", image: "village" },
  ],
  "whatsapp-drain-quote-checklist": [
    { afterHeading: "第二項：拍一段連續去水影片", image: "handoff" },
    { afterHeading: "第五項：確認現場聯絡人和可處理時段", image: "quote" },
  ],
  "drain-tool-selection-guide": [
    { afterHeading: "局部軟性淤塞：先評估手動工具或彈弓機", image: "sink" },
    { afterHeading: "原因不明或反覆復發：用 CCTV 收集證據", image: "camera" },
  ],
  "read-cctv-drain-inspection-report": [
    { afterHeading: "把畫面異常描述成可核對的現象", image: "camera" },
    { afterHeading: "比較處理前後，而不是只看片段", image: "quote" },
  ],
  "drain-blocked-after-renovation": [
    { afterHeading: "先判斷是淤塞還是安裝問題", image: "prepare" },
    { afterHeading: "何時值得安排CCTV照渠？", image: "camera" },
  ],
  "drain-blocked-again-after-cleaning-root-causes": [
    { afterHeading: "反覆塞渠的 6 個常見原因", image: "sink" },
    { afterHeading: "何時值得考慮 CCTV 照渠？", image: "camera" },
  ],
  "rainstorm-typhoon-drain-checklist-hong-kong": [
    { afterHeading: "雨前 24 至 48 小時檢查", image: "village" },
    { afterHeading: "雨後復查清單", image: "property" },
  ],
  "drain-flies-causes-removal-prevention": [
    { afterHeading: "簡單確認是否來自去水口", image: "sink" },
    { afterHeading: "何時需要進一步檢查？", image: "prepare" },
  ],
  "washing-machine-drain-backflow-causes-fixes": [
    { afterHeading: "倒灌時先做甚麼？", image: "prepare" },
    { afterHeading: "常見成因", image: "observe" },
  ],
  "high-pressure-drain-cleaning-vs-spring-machine": [
    { afterHeading: "兩種方法有甚麼分別？", image: "services" },
    { afterHeading: "哪些情況較適合高壓水槍？", image: "property" },
  ],
  "building-main-drain-vs-unit-branch-pipe": [
    { afterHeading: "甚麼是單位支渠和大廈主渠？", image: "shared" },
    { afterHeading: "安排檢查前要保存哪些資料？", image: "handoff" },
  ],
  "bathroom-drain-smell-causes-solutions": [
    { afterHeading: "浴室渠味的六個常見來源", image: "observe" },
    { afterHeading: "何時需要專業檢查？", image: "camera" },
  ],
  "cctv-drain-inspection-hong-kong-guide": [
    { afterHeading: "甚麼情況值得安排 CCTV 照渠？", image: "camera" },
    { afterHeading: "照渠報告應包含甚麼？", image: "quote" },
  ],
  "hong-kong-drain-cleaning-price-guide": [
    { afterHeading: "哪些現場資料會影響報價？", image: "quote" },
    { afterHeading: "用機器，是否一定比其他方法合適？", image: "services" },
  ],
  "prevent-kitchen-sink-clog": [
    { afterHeading: "習慣一：洗碗前抹走煮食油", image: "sink" },
    { afterHeading: "習慣五：去水變慢，記錄範圍再查詢", image: "prepare" },
  ],
  "why-not-drain-cleaner": [
    { afterHeading: "限制一：產品未必適合現有喉管", image: "sink" },
    { afterHeading: "需要師傅時，先檢查再選擇通渠方法", image: "camera" },
  ],
  "toilet-clog-emergency-guide": [
    { afterHeading: "第一步：即刻閂水掣，唔好再沖", image: "observe" },
    { afterHeading: "第三步：呢啲情況請直接搵師傅", image: "prepare" },
  ],
  "bathroom-hair-clog-prevention": [
    { afterHeading: "第一招：去水口毛髮過濾器", image: "observe" },
    { afterHeading: "第三招：留意「去水慢+臭味」組合訊號", image: "prepare" },
  ],
  "restaurant-grease-trap-guide": [
    { afterHeading: "幾耐要清一次先夠？", image: "restaurant" },
    { afterHeading: "慳錢秘訣：定期保養合約", image: "quote" },
  ],
  "village-house-manhole-rainy-season": [
    { afterHeading: "檢查二：留意樹根入侵跡象", image: "camera" },
    { afterHeading: "檢查四：清理天台同明渠落葉", image: "village" },
  ],
  "old-building-backflow-signs": [
    { afterHeading: "先兆二：多個去水位同時變慢", image: "observe" },
    { afterHeading: "先兆四：雨天時去水明顯轉差", image: "property" },
  ],
};

// Existing authored positions win; new entries require an exact reviewed heading.
for (const [slug, additions] of Object.entries(sectionPlacements)) {
  const existing = ARTICLE_ILLUSTRATIONS[slug] ?? [];
  ARTICLE_ILLUSTRATIONS[slug] = [
    ...existing,
    ...additions
      .filter(
        add =>
          !existing.some(
            p => "afterHeading" in p && p.afterHeading === add.afterHeading
          )
      )
      .map(add => ({
        afterHeading: add.afterHeading,
        image: add.image as keyof typeof ARTICLE_IMAGES,
      })),
  ];
}

export function hasArticleIllustrations(slug: string) {
  return Boolean(ARTICLE_ILLUSTRATIONS[slug]?.length);
}
