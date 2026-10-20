import ServiceScenePhoto from "./ServiceScenePhoto";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { STARTING_PRICE_LINE } from "../../../shared/pricing";

const TOPICS = [
  ["home-blockage-signs", "塞渠症狀"],
  ["home-customer-needs", "不同場所"],
  ["home-pricing-detail", "收費點計"],
  ["home-visit-preparation", "上門前準備"],
  ["home-drain-care", "日常保養"],
  ["home-service-coverage", "服務地區"],
] as const;

const PROBLEMS = [
  {
    title: "坐廁塞住、水位升高",
    text: "沖水後水位升高、廁紙沖唔走，先停用坐廁，避免連續沖水令污水溢出。查詢時說明有冇濕紙巾、清潔用品或硬物跌入，以及浴室地台、洗手盆有冇同時異常。只有坐廁受影響，與多個去水位一齊倒灌，檢查範圍會不同。",
    detail:
      "處理前要分辨座廁本體、接駁支喉及共用渠道；如有硬物或需要拆裝，應先確認施工範圍。唔好用金屬棒盲目捅入，也不要在已加入通渠藥劑後再用泵加壓，以免液體濺出。",
    href: "/services/toilet-unblocking",
    label: "了解坐廁及馬桶通渠",
  },
  {
    title: "廚房鋅盤去水慢、洗碗時積水",
    text: "鋅盤淤塞可能與食物殘渣、油脂積聚或隔氣、接駁管段有關。若兩個鋅盤一邊放水、另一邊冒水，或者洗衣機排水時鋅盤倒灌，應一併交代，讓團隊了解是否涉及共用支渠。櫃底喉管及接駁位置的相片，比單拍水面更有助了解入口。",
    detail:
      "熱水令部分油脂暫時變軟，唔代表已清走管內積聚物；反覆慢去水亦不宜只靠不斷沖水處理。通渠時會按入口與管段情況選擇工具，再觀察相關去水位是否恢復排水。",
    href: "/services/kitchen-sink-unblocking",
    label: "了解廚房鋅盤通渠",
  },
  {
    title: "企缸、浴缸及地台去水位積水",
    text: "沖涼時積水、去水變慢，可能涉及頭髮、皂垢或支渠淤塞。可以先清理濾網表面容易取出的雜物，無需自行拆開固定管件。若洗衣機排水時地台冒水，或平時無用水仍有污水湧出，就要說明發生時間及其他設備的使用情況。",
    detail:
      "單憑異味未必能判斷係塞渠；隔氣存水、接駁及通氣問題亦可能需要檢查。浴室長時間停用、近期裝修或曾經改喉等資料，都有助縮窄需要檢查的範圍。",
    href: "/services/bathroom-drain-unblocking",
    label: "了解浴室及地台通渠",
  },
  {
    title: "多個去水位倒灌、主渠或沙井異常",
    text: "幾個位置同時排水不暢，甚至不同單位一齊受影響，應及早通知管理處或負責人，確認共用管段及檢查入口。主渠、沙井與單位內支喉的工作範圍不同，安排前要了解誰可批准開蓋、進場及使用相關位置。",
    detail:
      "如污水持續湧出，先減少受影響設備用水，讓人遠離積水及附近電器；不要自行落井或進入密閉空間。現場可能需要疏通、清理或影像檢查，不能只憑倒灌現象就判定一定要更換整段喉管。",
    href: "/services/sewage-backflow",
    label: "了解污水倒灌處理",
  },
] as const;

export default function HomeServiceGuide() {
  return (
    <article
      className="brand-section home-service-guide"
      aria-labelledby="home-guide-heading"
    >
      <div className="container">
        <header className="home-service-guide__header">
          <p className="home-service-guide__eyebrow">通渠服務詳解</p>
          <h2 id="home-guide-heading">由塞渠症狀，到處理安排，逐項講清楚。</h2>
          <p>
            通渠熊為香港住宅、食肆及物業提供通渠服務，處理坐廁淤塞、鋅盤去水慢、浴室積水及主渠倒灌。以下整理常見情況、施工安排及收費因素，方便你揀啱服務，查詢時亦更容易講清楚問題。
          </p>
        </header>
        <div className="home-service-guide__layout">
          <nav
            className="home-service-guide__toc"
            aria-label="通渠服務詳解目錄"
          >
            <span>按問題閱讀</span>
            {TOPICS.map(([id, title], index) => (
              <a key={id} href={`#${id}`}>
                <span aria-hidden="true">0{index + 1}</span>
                {title}
              </a>
            ))}
          </nav>
          <div className="home-service-guide__body">
            <ServiceScenePhoto scene="drain-inspection-guide" />
            <section
              id="home-blockage-signs"
              aria-labelledby="home-blockage-heading"
            >
              <h2 id="home-blockage-heading">邊種塞渠情況，應該搵邊類服務？</h2>
              <p>
                先分清楚「邊個位置出問題」同「幾多個位置受影響」。相似的積水現象，可以來自不同管段；以下係查詢線索，實際原因仍要按現場檢查確認。
              </p>
              {PROBLEMS.map(problem => (
                <div className="home-service-guide__topic" key={problem.href}>
                  <h3>{problem.title}</h3>
                  <p>{problem.text}</p>
                  <p>{problem.detail}</p>
                  <Link
                    href={problem.href}
                    className="home-service-guide__link"
                  >
                    {problem.label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </section>
            <section
              id="home-customer-needs"
              aria-labelledby="home-customers-heading"
            >
              <h2 id="home-customers-heading">
                住宅、食肆同物業，通渠安排有咩分別？
              </h2>
              <h3>住宅住戶：先確認室內設備與支渠</h3>
              <p>
                屋苑、唐樓或村屋的施工入口未必一樣。住戶可先整理坐廁、鋅盤或浴室受影響的次序，說明是否租住單位、有冇管理處，以及櫃底或喉管位置可否接近。涉及公共渠道或需要拆裝時，先與業主或管理處確認，有助減少到場後才發現未能施工的情況。
              </p>
              <p>
                可先閱讀<Link href="/services/toilet-unblocking">坐廁服務</Link>
                及<Link href="/services/kitchen-sink-unblocking">鋅盤服務</Link>
                ，按實際問題選擇；未確定堵塞位置亦可以先提供相片查詢。
              </p>
              <ServiceScenePhoto scene="restaurant-drains" />
              <h3>食肆及商舖：連同隔油設施與營業安排考慮</h3>
              <p>
                廚房去水、地台渠及隔油設施可能互相接駁，單一去水口恢復排水，未必代表整條管線已清理。查詢時說明出水位置、最近清理紀錄、繁忙時段，以及可暫停使用哪部分設備。安排
                <Link href="/services/grease-trap-cleaning">隔油池清理</Link>
                或高壓洗渠前，也要確認工作位置、污水處理及進場路線。
              </p>
              <h3>業主及物業管理：協調公共範圍與測試位置</h3>
              <p>
                大廈、商場及工廈的共用管段，需要負責人協調進場、開啟檢查口及通知受影響使用者。提供管線圖、曾經處理的位置或現場紀錄，有助了解檢查範圍。可按需要查詢
                <Link href="/services/main-drain-manhole">主渠及沙井工程</Link>
                ，並在動工前確認施工後測試哪些去水位及如何記錄結果。
              </p>
            </section>
            <section
              id="home-pricing-detail"
              aria-labelledby="home-pricing-heading"
            >
              <h2 id="home-pricing-heading">
                通渠收費點計？報價前要睇哪些因素？
              </h2>
              <p>
                <strong>{STARTING_PRICE_LINE}。</strong>
                查詢時可先傳相片，了解安排及初步報價方向。最終工程範圍與收費按現場確認；同樣係「塞鋅盤」，只需處理隔氣與需要檢查較長支渠，工作內容可以不同。
              </p>
              <ul>
                <li>
                  <strong>堵塞範圍：</strong>
                  一個設備、較長支喉，還是多個單位共用的管段。
                </li>
                <li>
                  <strong>施工入口：</strong>
                  有冇合適檢查口，工具能否接近，是否需要拆裝設備。
                </li>
                <li>
                  <strong>所需方法：</strong>
                  機械疏通、高壓清洗或影像檢查的用途及工作量不同。
                </li>
                <li>
                  <strong>進場條件：</strong>
                  工作空間、樓梯搬運、管理處安排及可施工時段。
                </li>
                <li>
                  <strong>額外發現：</strong>
                  如發現損壞或其他管段問題，應另行說明建議及費用，再確認是否處理。
                </li>
              </ul>
              <p>
                比較報價時，問清楚總額對應哪段渠道、是否包括拆裝及清理、完成後如何測試，以及未能完成原定處理時如何收費。清楚的工作範圍，比只比較一個起步價更有用。
              </p>
              <Link
                href="/blog/hong-kong-drain-cleaning-price-guide"
                className="home-service-guide__link"
              >
                查看完整通渠收費指南
                <ArrowRight aria-hidden="true" />
              </Link>
            </section>
            <section
              id="home-visit-preparation"
              aria-labelledby="home-preparation-heading"
            >
              <ServiceScenePhoto scene="bathroom-preparation" />
              <h2 id="home-preparation-heading">
                等師傅上門前，可以準備甚麼？
              </h2>
              <p>
                拍攝受影響去水位、附近喉管及入口，記下何時開始、會否自行退水，以及其他設備使用時有冇倒灌。可安全移走櫃底雜物及附近物品，預留通道；不用為了拍攝而拆開管件、搬動重物或打開沙井。
              </p>
              <p>
                如曾倒入通渠水或其他清潔劑，保留產品包裝資料，主動告知師傅使用時間及位置。不要再混入漂白水、酸性清潔劑或其他藥劑。遇到污水持續外溢，先停用相關設備；相片只需在安全位置拍攝，無需再次放水重現問題。
              </p>
              <p>
                到場後會先了解問題及確認方法和收費，完成處理再按現場條件測試去水。你可以對照
                <Link href="/service-process">通渠上門流程</Link>
                ，了解每一步要確認的事項。
              </p>
            </section>
            <section id="home-drain-care" aria-labelledby="home-care-heading">
              <h2 id="home-care-heading">平日點樣減少塞渠同反覆倒灌？</h2>
              <p>
                廚房先將食物殘渣放入垃圾桶，油脂另行收集，避免直接倒入鋅盤。濾網可攔截較大雜物，但不能擋住所有油脂；如果清理濾網後仍然去水慢，就要留意下游管段，而唔係不停加清潔劑。
              </p>
              <p>
                浴室定期清走隔網表面的頭髮，濕紙巾、棉花棒及衛生用品不要沖入坐廁。日常清潔與疏通已堵塞的管段是不同工作，梳打粉、白醋或熱水不能保證處理深處堵塞、硬物或喉管損壞。
              </p>
              <p>
                食肆及物業可記錄每次出現問題的位置、使用情況及處理結果，再按負荷、設施狀況與檢查結果安排清理。若短時間內同一位置再塞，保留上次紀錄，評估是否需要
                <Link href="/services/cctv-drain-inspection">
                  CCTV 照渠檢查
                </Link>
                ；不宜只因今次水流恢復，就推斷整條管線已沒有其他問題。
              </p>
              <Link
                href="/blog/why-not-drain-cleaner"
                className="home-service-guide__link"
              >
                了解通渠水的限制與注意事項
                <ArrowRight aria-hidden="true" />
              </Link>
            </section>
            <section
              id="home-service-coverage"
              aria-labelledby="home-coverage-heading"
            >
              <h2 id="home-coverage-heading">香港通渠服務，先按所在地區安排</h2>
              <p>
                通渠熊接受港島、九龍、新界及離島的渠務查詢。提供地區、屋苑或大廈名稱、樓層及問題位置，方便確認交通、工具搬運與進場安排。離島或較難直達的工作位置，亦請說明船程及可接應地點；實際上門時間按人手、設備及現場條件確認。
              </p>
              <p>
                不同地區頁已整理相應的查詢準備，例如
                <Link href="/areas/kwun-tong">觀塘住宅與工廈通渠</Link>、
                <Link href="/areas/sha-tin">沙田屋苑與村屋去水問題</Link>及
                <Link href="/areas/causeway-bay">銅鑼灣與大坑通渠安排</Link>
                。其餘地點可由<Link href="/areas">服務地區目錄</Link>查看。
              </p>
              <p>
                想先了解團隊點樣做事，可以查看
                <Link href="/cases">真實施工紀錄</Link>及
                <Link href="/about#company-facts">公司與聯絡資料</Link>
                。施工片段、已記錄的完工測試與示意圖片會分開呈現，方便你按實際資料作選擇。
              </p>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
