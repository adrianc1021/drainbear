import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import InquiryContactPanel from "@/components/InquiryContactPanel";
import CustomerPaths from "@/components/CustomerPaths";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { Link } from "wouter";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "通渠查詢與報價指南", path: "/guide" },
];
const ANSWERS = [
  {
    id: "quote-context",
    question: "通渠可以用統一價格報價嗎？",
    answer:
      "每宗工程的堵塞位置、管道狀況、工具及進場條件不同，沒有適用所有情況的統一價格。提供現場資料後，團隊會按實際情況了解處理方向及報價。",
  },
  {
    id: "quote-photos",
    question: "傳相片可以先了解報價嗎？",
    answer:
      "相片或短片有助了解受影響位置和進場條件；隱藏管段及堵塞原因可能仍需現場檢查。請先提供地區、問題描述及安全情況下拍攝的畫面。",
  },
  {
    id: "quote-tools",
    question: "為甚麼不同塞渠情況需要不同工具？",
    answer:
      "局部異物、管壁油垢和多處倒灌的原因不一樣。師傅會按現場評估機械疏通、高壓清洗或影像檢查是否合適。",
  },
];

export default function Guide() {
  return (
    <div className="guide-page">
      <SEO
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
        title="香港通渠報價｜現場資料與查詢指南｜通渠熊"
        description="通渠報價要按堵塞位置、管道及施工條件了解。整理地區、現場相片和受影響範圍，查詢住宅、食肆及物業渠務安排。"
        path="/guide"
        breadcrumbs={CRUMBS}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/guide#webpage`,
            url: `${SITE_URL}/guide`,
            name: "通渠查詢與報價指南",
            about: { "@id": BUSINESS_ID },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ANSWERS.map(item => ({
              "@type": "Question",
              url: `${SITE_URL}/guide#${item.id}`,
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          kicker="查詢與報價"
          title="講清現場情況，先了解點處理。"
          description="同樣係塞渠，位置、管道同所需工具可以好唔同。傳送地區與現場相片，方便團隊了解處理方向。"
          contactLocation="guide_hero"
        />
      </div>
      <section className="brand-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="brand-eyebrow">按你的場所準備</p>
              <h2>查詢要提供甚麼？</h2>
            </div>
          </div>
          <CustomerPaths illustrated compact />
        </div>
      </section>
      <section className="brand-section brand-section--soft">
        <div className="container brand-narrow">
          <h2>關於通渠報價，你可能想問</h2>
          <div className="brand-faq">
            {ANSWERS.map(item => (
              <details key={item.id} id={item.id}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <nav className="related-inline" aria-label="相關處理與服務">
            <Link href="/services">按問題找服務</Link>
            <Link href="/service-process">上門與施工流程</Link>
            <Link href="/cases">查看真實施工紀錄</Link>
          </nav>
        </div>
      </section>
      <section className="brand-section">
        <div className="container">
          <InquiryContactPanel
            location="guide_intake"
            title="傳相片，先了解處理方向"
            chooseCustomer
          />
        </div>
      </section>
    </div>
  );
}
