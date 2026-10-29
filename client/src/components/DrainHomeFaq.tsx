import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef } from "react";

import { STARTING_PRICE_ANSWER } from "../../../shared/pricing";

const FAQ_ITEMS = [
  {
    question: "香港通渠公司點報價？通渠熊幾錢起？",
    answer: STARTING_PRICE_ANSWER,
  },
  {
    question: "搵通渠公司報價，要提供甚麼資料？",
    answer:
      "提供服務地點、受影響的去水位置、出現多久，以及相片或短片即可。若是倒灌或多個位置同時異常，也請一併說明。",
  },
  {
    question: "委託通渠公司前，要確認哪些工序及費用？",
    answer:
      "先確認要處理哪個去水位或管段、使用的方法、是否需要拆裝，以及試水與其他項目是否包括在報價內。通渠熊到場了解情況後會說明工序及收費，雙方確認後才動工；有額外工作需要，先確認範圍及費用。",
  },
  {
    question: "通渠後很快再塞，應該怎樣處理？",
    answer:
      "如果短時間內再次淤塞，應保留現場資料並說明上次處理位置。團隊會按情況評估是否需要檢查較長管段、隔油設施或安排 CCTV 照喉。",
  },
  {
    question: "24小時通渠，可以夜間或假日查詢嗎？",
    answer:
      "可以。通渠熊的電話及 WhatsApp 24 小時接受通渠查詢，包括夜間及假日。實際上門時間會按地區、交通、人手及設備供應確認，夜間查詢請先提供地區、積水或倒灌位置及可進場時間；水位上升時先停用，毋須反覆試水拍片。",
  },
  {
    question: "塞渠一定要用高壓洗渠，或者先做 CCTV 照渠嗎？",
    answer:
      "不一定。局部淤塞、較長管段積聚及原因未明的反覆倒灌，所需方法可以不同。團隊會按喉管狀況、入口與問題範圍評估；CCTV 是影像檢查，不能代替疏通，高壓洗渠也不是每個位置都適用。",
  },
  {
    question: "已經用過通渠水，仲可唔可以搵師傅？",
    answer:
      "可以查詢，但請先停止加入其他藥劑，並告知產品名稱、使用時間與倒入位置；可保留包裝相片供了解。不要混入漂白水、酸性清潔劑，亦不要再用泵加壓令液體濺出。師傅需要了解殘留藥劑，才可評估安全處理安排。",
  },
  {
    question: "洗衣機排水時地台冒水，係咪洗衣機壞咗？",
    answer:
      "未必。排水時其他去水口冒水，可能與接駁或共用支渠不暢有關，亦要排查設備本身的問題。先停用受影響設備，記下冒水位置，以及鋅盤或浴室是否同時去水慢；不用為了拍片再次放水，已有相片及情況描述亦可先查詢。",
  },
  {
    question: "通渠通常要做幾耐？會唔會影響營業？",
    answer:
      "時間取決於堵塞範圍、入口、是否需要拆裝及所用方法，未檢查前不能只憑服務名稱定出完工時間。食肆或商舖請提供營業時段及可停用的設備，動工前確認工作區域、用水限制與測試安排。",
  },
  {
    question: "點樣確認通渠完成？",
    answer:
      "應按已確認的工作範圍測試相關去水位，觀察排水、水位及是否仍有倒灌；若涉及拆裝，也要檢查接駁位置。當次測試反映該次觀察到的情況，不等於保證所有隱藏管段或日後使用都不會再有問題。",
  },
] as const;

export default function DrainHomeFaq() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const openAnswer = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (
        !(target instanceof HTMLDetailsElement) ||
        !section.current?.contains(target)
      )
        return;
      target.open = true;
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "instant", block: "start" })
      );
    };
    openAnswer();
    window.addEventListener("hashchange", openAnswer);
    return () => window.removeEventListener("hashchange", openAnswer);
  }, []);
  return (
    <section
      ref={section}
      className="db-home-faq"
      aria-labelledby="home-faq-heading"
      data-pr20-section="faq"
    >
      <div className="db-container">
        <div className="db-home-faq__layout">
          <div className="db-home-faq__intro">
            <h2 id="home-faq-heading">通渠常見問題</h2>
            <Link href="/faq" className="db-home-faq__all-link">
              查看全部常見問題
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="db-home-faq__list">
            {FAQ_ITEMS.map((item, index) => (
              <details key={item.question} id={`home-answer-${index + 1}`}>
                <summary>
                  <span>{item.question}</span>
                  <ChevronDown aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
                {item === FAQ_ITEMS[0] ? (
                  <nav
                    className="home-faq-links"
                    aria-label="通渠收費及安排資料"
                  >
                    <Link href="/blog/hong-kong-drain-cleaning-price-guide">
                      了解通渠收費因素
                    </Link>
                    <Link href="/service-process">查看上門處理流程</Link>
                  </nav>
                ) : null}
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { FAQ_ITEMS };
