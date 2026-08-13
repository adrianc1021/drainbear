/**
 * 通渠熊 DrainBear — 常見問題
 * Editorial accordion with accessible single-panel disclosure.
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/Layout";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const FAQ_CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "常見問題", path: "/faq" },
];

const FAQS = [
  {
    q: "請問上門檢查需要收費嗎？",
    a: "如接納報價並進行工程，上門檢查費將全免。",
  },
  {
    q: "通渠過程會弄髒我的家居嗎？",
    a: "絕對不會。施工有保護措施，完工保證還原整潔。",
  },
  {
    q: "倒了「通渠水」依然堵塞怎麼辦？",
    a: "請勿再倒！化學劑會令喉管穿漏，請聯絡我們以物理方式疏通。",
  },
  {
    q: "「不成功不收費」是真的嗎？",
    a: "絕對真確。純異物淤塞打不通絕不收費。需維修換喉則另作報價。",
  },
  {
    q: "深夜緊急堵塞收費會大幅提高嗎？",
    a: "深夜有合理附加費，但保證出發前確認最終總收費，絕不坐地起價。",
  },
  {
    q: "會無故要求客人更換喉管嗎？",
    a: "我們堅持科技斷症，利用 CCTV 看清喉管內部。是堵塞便疏通，破損才維修。",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQ() {
  return (
    <div>
      <SEO
        title="常見問題｜通渠收費・不成功不收費・通渠水處理｜通渠熊 DrainBear"
        description="通渠常見問題解答：上門檢查是否收費？倒了通渠水仍堵塞點算？不成功不收費是否屬實？深夜通渠附加費如何計算？通渠熊白熊師傅為您一一解答，明碼實價絕不坐地起價。"
        path="/faq"
        keywords="通渠常見問題, 通渠收費, 不成功不收費, 通渠水危害, 深夜通渠附加費, 上門檢查費"
        jsonLd={FAQ_JSONLD}
        breadcrumbs={FAQ_CRUMBS}
      />

      <Breadcrumbs items={FAQ_CRUMBS} />

      <EditorialPageHero
        kicker="FAQ / 常見問題"
        title="常見問題"
        description="以下整理有關上門檢查、報價、施工安排及管道保養的常見疑問，協助您在安排服務前掌握所需資料。"
      />

      <section className="site-content-section bg-white">
        <div className="site-editorial-narrow">
          <Accordion
            type="single"
            collapsible
            className="site-editorial-accordion"
          >
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${index}`}
                className="site-editorial-accordion__item"
              >
                <AccordionTrigger className="site-editorial-accordion__trigger text-left hover:no-underline">
                  <span className="flex items-center gap-3">
                    <HelpCircle
                      className="h-5 w-5 shrink-0 text-safety"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    {faq.q}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="site-editorial-accordion__answer">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="site-editorial-callout">
            <h2>仍有其他渠務疑問？</h2>
            <p>
              可透過 WhatsApp
              提供問題位置、去水情況及現場相片，讓團隊先作初步了解。
            </p>

            <div className="mt-7">
              <WhatsAppButton label="WhatsApp 查詢" trackLocation="faq_cta" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
