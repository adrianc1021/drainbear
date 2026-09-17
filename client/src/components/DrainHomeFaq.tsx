import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";

const FAQ_ITEMS = [
  {
    question: "可以先知道大概收費嗎？",
    answer:
      "可以先參考收費指南或使用估價計算機了解方向。實際收費要視乎現場管道、淤塞程度、時間及所需設備，師傅會在動工前說明及確認。",
  },
  {
    question: "要提供甚麼資料，才可以初步判斷？",
    answer:
      "提供服務地點、受影響的去水位置、出現多久，以及相片或短片即可。若是倒灌或多個位置同時異常，也請一併說明。",
  },
  {
    question: "會不會未報價就直接開工？",
    answer:
      "不會。到場了解情況後，團隊會先說明處理方法及收費，雙方確認後才動工；如需增加工序或特別設備，亦會事前交代。",
  },
  {
    question: "通渠後很快再塞，應該怎樣處理？",
    answer:
      "如果短時間內再次淤塞，應保留現場資料並說明上次處理位置。團隊會按情況評估是否需要檢查較長管段、隔油設施或安排 CCTV 照喉。",
  },
  {
    question: "夜間或假日可以查詢嗎？",
    answer:
      "可以先透過 WhatsApp 或電話提供資料。實際上門時間會按地區、交通、人手及設備供應確認，緊急情況請先說明受影響範圍。",
  },
] as const;

export default function DrainHomeFaq() {
  return (
    <section
      className="db-home-faq"
      aria-labelledby="home-faq-heading"
      data-pr20-section="faq"
    >
      <div className="db-container">
        <div className="db-home-faq__layout">
          <div className="db-home-faq__intro">
            <p className="db-kicker">
              <span className="db-kicker__rule" aria-hidden="true" />
              常見問題
            </p>
            <h2 id="home-faq-heading">
              常見疑問，
              <br />
              先一次了解。
            </h2>
            <p>
              收費、安排及處理方法會因現場而異；以下先整理最常見的查詢方向。
            </p>
            <Link href="/faq" className="db-home-faq__all-link">
              查看全部常見問題
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="db-home-faq__list">
            {FAQ_ITEMS.map(item => (
              <details key={item.question}>
                <summary>
                  <span>{item.question}</span>
                  <ChevronDown aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { FAQ_ITEMS };
