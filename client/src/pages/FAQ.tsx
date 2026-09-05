/**
 * 通渠熊 DrainBear — 常見問題
 * Native details elements keep every answer present in prerendered HTML.
 */
import { ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { WhatsAppButton } from "@/components/Layout";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BUSINESS_ID, SITE_URL, WEBSITE_ID } from "@/config/site";

const FAQ_CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "常見問題", path: "/faq" },
];

const FAQS = [
  {
    q: "請問上門檢查需要收費嗎？",
    a: "如接納報價並進行已確認的工程，上門檢查費將全免。任何獨立檢查或額外工序，團隊都會在安排或動工前說明。",
  },
  {
    q: "通渠一般需要多少費用？",
    a: "費用視乎堵塞位置、樓宇類型、所需設備、施工難度及上門時段而定。網站估價只供初步參考，師傅會在現場檢查後、動工前確認最終總收費。",
  },
  {
    q: "師傅最快多久可以到達？",
    a: "到達時間受地區、交通、當時師傅及設備安排影響，因此不會作未核實的保證。提供地點和現場情況後，團隊會回覆當刻可安排的時段。",
  },
  {
    q: "聯絡通渠公司前要準備甚麼資料？",
    a: "建議提供服務地區、堵塞位置、受影響範圍、開始時間，以及現場相片或短片。如曾使用通渠水、拆喉或出現污水倒灌，亦應先說明。",
  },
  {
    q: "甚麼情況下應立即停止用水？",
    a: "如多個去水位同時倒灌、污水由地台或座廁湧出，或水位持續上升，應先停止使用相關水源，避免繼續沖廁或排水，並盡快安排檢查。",
  },
  {
    q: "通渠過程會弄髒我的家居嗎？",
    a: "施工會按現場情況採取保護措施，完工後整理受影響的工作位置。若涉及污水倒灌或大型設備，團隊會先說明所需工作範圍。",
  },
  {
    q: "倒了「通渠水」依然堵塞怎麼辦？",
    a: "請勿繼續混合或添加其他化學清潔劑，並先告知師傅所用產品和時間。化學劑可能殘留在喉管內，需由師傅評估後以合適方式處理。",
  },
  {
    q: "「不成功不收費」適用於哪些情況？",
    a: "適用範圍會在安排前說明。純疏通未能完成、喉管破損、拆裝、檢測或維修屬不同情況，團隊會在進行額外工序前另行解釋和報價。",
  },
  {
    q: "深夜緊急堵塞收費會大幅提高嗎？",
    a: "深夜時段可能有合理附加費。團隊會先提供初步估價，師傅現場檢查後在動工前說明並確認最終總收費。",
  },
  {
    q: "甚麼情況需要 CCTV 照喉？",
    a: "如同一位置反覆淤塞、懷疑喉管破損或需要確認管內狀況，可考慮 CCTV 照喉。是否適用仍要視乎管徑、入口位置和現場條件。",
  },
  {
    q: "會無故要求客人更換喉管嗎？",
    a: "處理方向應以現場情況和可核實資料為基礎。是堵塞便先評估疏通方式；如懷疑破損，會說明檢測結果及維修原因後再報價。",
  },
  {
    q: "通渠後如何減少再次淤塞？",
    a: "避免把油脂、食物殘渣、濕紙巾、頭髮或大型異物排入去水位，並按使用量定期清理隔氣和隔油設施。如短期內再次去水緩慢，應先檢查原因。",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/faq#webpage`,
  url: `${SITE_URL}/faq`,
  name: "香港通渠常見問題",
  description: "香港通渠收費、緊急處理、通渠水、CCTV 照喉及上門安排的直接解答。",
  inLanguage: "zh-Hant-HK",
  dateModified: "2026-09-06",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": BUSINESS_ID },
  mainEntity: FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const RELATED_GUIDES = [
  {
    href: "/drain-diagnosis",
    title: "渠務問題快速判斷",
    description: "按堵塞位置、症狀及影響範圍整理下一步。",
  },
  {
    href: "/guide",
    title: "通渠收費及即時估價",
    description: "查看常見費用項目，再按三項資料取得初步估價。",
  },
  {
    href: "/service-process",
    title: "上門流程與報價原則",
    description: "了解檢查、動工前確認總價及追加工序界線。",
  },
];

export default function FAQ() {
  return (
    <div>
      <SEO
        title="香港通渠常見問題｜收費、緊急處理及 CCTV 照喉｜通渠熊"
        description="直接解答香港通渠收費、師傅到達時間、污水倒灌、通渠水、CCTV 照喉及不成功不收費等常見問題，並說明安排服務前要準備的資料。"
        path="/faq"
        keywords="香港通渠常見問題, 通渠收費, 緊急通渠, 污水倒灌, CCTV 照喉, 通渠水, 上門檢查費"
        jsonLd={FAQ_JSONLD}
        breadcrumbs={FAQ_CRUMBS}
      />

      <Breadcrumbs items={FAQ_CRUMBS} />

      <EditorialPageHero
        kicker="FAQ / 常見問題"
        title="常見問題"
        description="以直接答案整理收費、緊急處理、上門安排、施工及管道保養問題，方便您快速判斷下一步。"
      />

      <section className="border-b border-border bg-mist/55 py-10">
        <div className="site-editorial-narrow">
          <p className="text-xs font-bold tracking-[0.18em] text-safety">
            緊急情況快速答案
          </p>
          <h2 className="mt-2 font-display text-2xl font-black text-navy">
            水位上升或污水倒灌時，先做三件事
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["01", "停止沖廁及使用相關水源"],
              ["02", "移開附近物品並拍攝現場"],
              ["03", "不要再加入通渠水或其他化學劑"],
            ].map(([step, text]) => (
              <li key={step} className="border-l-2 border-wagreen pl-4">
                <span className="text-xs font-black text-wagreen-dark">{step}</span>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-navy">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-content-section bg-white">
        <div className="site-editorial-narrow">
          <div className="site-editorial-accordion">
            {FAQS.map(faq => (
              <details
                key={faq.q}
                className="site-editorial-accordion__item"
              >
                <summary className="site-editorial-accordion__trigger list-none text-left">
                  <span className="flex items-center gap-3">
                    <HelpCircle
                      className="h-5 w-5 shrink-0 text-safety"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    {faq.q}
                  </span>
                </summary>

                <p className="site-editorial-accordion__answer">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <nav className="mt-14 border-t border-border pt-9" aria-label="相關渠務指南">
            <h2 className="font-display text-2xl font-black text-navy">
              進一步判斷與報價資料
            </h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {RELATED_GUIDES.map(guide => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group flex min-h-24 items-center gap-4 py-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold text-navy">
                      {guide.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {guide.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-wagreen-dark transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </nav>

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
