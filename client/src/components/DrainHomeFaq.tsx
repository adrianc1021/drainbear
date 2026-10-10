import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";

const FAQ_ITEMS = [
  {
    question: "可以先知道大概收費嗎？",
    answer:
      "可以透過 WhatsApp 提供地區、堵塞位置及現場相片，先了解處理方向。每宗工程的管道及施工條件不同，團隊會按實際情況說明報價。",
  },
  {
    question: "要提供甚麼資料，才可以初步判斷？",
    answer:
      "提供服務地點、受影響的去水位置、出現多久，以及相片或短片即可。若是倒灌或多個位置同時異常，也請一併說明。",
  },
  {
    question: "會不會未報價就直接開工？",
    answer:
      "不會。到場了解情況後，團隊會先說明處理方法及收費，雙方確認後才動工。",
  },
  {
    question: "通渠後很快再塞，應該怎樣處理？",
    answer:
      "如果短時間內再次淤塞，應保留現場資料並說明上次處理位置。團隊會按情況評估是否需要檢查較長管段、隔油設施或安排 CCTV 照喉。",
  },
  {
    question: "24小時通渠，可以夜間或假日查詢嗎？",
    answer:
      "可以。通渠熊的電話及 WhatsApp 24 小時接受通渠查詢，包括夜間及假日。實際上門時間會按地區、交通、人手及設備供應確認，緊急情況請先說明受影響範圍。",
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
              查詢前先了解
            </p>
            <h2 id="home-faq-heading">通渠常見問題</h2>
            <p>現場資料、上門安排及反覆塞渠，這裏直接解答。</p>
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
