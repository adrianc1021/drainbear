import { STARTING_PRICE_LINE } from "../../../shared/pricing";
import {
  QUOTATION_GUIDE_UPDATED,
  QUOTATION_GUIDE_TITLE,
  QUOTATION_GUIDE_DESCRIPTION,
  QUOTATION_ANSWERS as ANSWERS,
  QUOTATION_SCOPES,
} from "@/lib/quotationGuide";
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

export default function Guide() {
  return (
    <div className="guide-page">
      <SEO
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
        title={QUOTATION_GUIDE_TITLE}
        description={QUOTATION_GUIDE_DESCRIPTION}
        path="/guide"
        breadcrumbs={CRUMBS}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/guide#webpage`,
            url: `${SITE_URL}/guide`,
            name: QUOTATION_GUIDE_TITLE,
            description: QUOTATION_GUIDE_DESCRIPTION,
            dateModified: QUOTATION_GUIDE_UPDATED,
            inLanguage: "zh-Hant-HK",
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
          title="通渠收費 HK$300 起，先問清工序與總額。"
          description="起步價不是每宗工程的固定總價。先傳地區及相片了解處理方向，現場檢查後確認工序與總收費，雙方同意才動工。"
          contactLocation="guide_hero"
        />
      </div>
      <section className="brand-section" aria-labelledby="quote-scope-heading">
        <div className="container brand-narrow">
          <p className="brand-eyebrow">起步價與實際工序</p>
          <h2 id="quote-scope-heading">通渠報價，要看今次處理甚麼。</h2>
          <p className="brand-section-description">
            同樣是去水慢，可能只涉及一個隔氣，也可能要檢查共用管段。 HK$300
            起並非固定套餐；適用工序及最終總收費須按現場確認。
          </p>
          <div className="mt-8 space-y-8">
            {QUOTATION_SCOPES.map(scope => (
              <div key={scope.title}>
                <h3 className="text-lg font-bold text-navy">{scope.title}</h3>
                <p className="mt-3 leading-relaxed text-navy/75">
                  {scope.detail}
                </p>
                <Link
                  href={scope.href}
                  className="mt-2 inline-flex min-h-11 items-center font-bold text-wagreen-dark underline underline-offset-4"
                >
                  {scope.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className="brand-section brand-section--soft"
        aria-labelledby="quote-confirm-heading"
      >
        <div className="container brand-narrow">
          <h2 id="quote-confirm-heading">確認報價前，逐項問清楚。</h2>
          <ul className="mt-6 list-disc space-y-3 pl-5 leading-relaxed text-navy/75">
            <li>預約上門：檢查是否收費、未能疏通時已做工序如何計費。</li>
            <li>
              動工之前：處理位置、方法、拆裝、設備與試水是否包含在總額內。
            </li>
            <li>需要追加：新增哪段管道或工序、加幾多費用，確認後才繼續。</li>
            <li>
              完成之後：今次完成哪些位置、試水結果，以及仍需檢查或跟進的範圍。
            </li>
          </ul>
          <nav className="related-inline" aria-label="報價及施工流程">
            <Link href="/service-process">查看上門、報價與試水流程</Link>
          </nav>
        </div>
      </section>
      <section className="brand-section" aria-labelledby="quote-cases-heading">
        <div className="container brand-narrow">
          <h2 id="quote-cases-heading">從真實工程，了解工序差別。</h2>
          <p className="brand-section-description">
            以下紀錄展示實際處理方法，並非價目表；個別案例不能當成其他工程的報價或結果保證。
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <article>
              <h3 className="text-lg font-bold text-navy">
                家居洗手盆油垢清理
              </h3>
              <p className="mt-3 leading-relaxed text-navy/75">
                紀錄包括拆喉、清理隔氣及接駁後放水測試，了解疏通與拆裝需要如何一併確認。
              </p>
              <Link
                className="mt-2 inline-flex min-h-11 items-center font-bold text-wagreen-dark underline underline-offset-4"
                href="/cases/home-basin-grease-buildup-cleaning"
              >
                查看洗手盆工程紀錄
              </Link>
            </article>
            <article>
              <h3 className="text-lg font-bold text-navy">
                學校雨水渠高壓清洗
              </h3>
              <p className="mt-3 leading-relaxed text-navy/75">
                紀錄展示戶外雨水渠清理及排水測試，工作入口與處理管段跟室內洗手盆不同。
              </p>
              <Link
                className="mt-2 inline-flex min-h-11 items-center font-bold text-wagreen-dark underline underline-offset-4"
                href="/cases/school-rainwater-drain-high-pressure-cleaning"
              >
                查看高壓清洗工程紀錄
              </Link>
            </article>
          </div>
        </div>
      </section>
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
