import {
  STARTING_PRICE_LINE,
  STARTING_PRICE_ANSWER,
} from "../../../shared/pricing";
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
    question: "通渠幾錢起？如何查詢報價？",
    answer: STARTING_PRICE_ANSWER,
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
        title="通渠報價 HK$300 起｜WhatsApp 傳相查詢｜通渠熊"
        description="通渠熊全線通渠服務 HK$300 起。住宅、食肆及物業，提供地區、堵塞位置及相片，立即 WhatsApp 查詢通渠報價。"
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
          priceLabel={STARTING_PRICE_LINE}
          kicker="查詢與報價"
          title="通渠 HK$300 起，傳相即刻問報價。"
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
            <Link href="/blog/hong-kong-drain-cleaning-price-guide">
              了解報價影響因素
            </Link>
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
