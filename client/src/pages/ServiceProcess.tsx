import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "上門服務流程與報價原則", path: "/service-process" },
];

const PROCESS = [
  {
    icon: MessageCircle,
    title: "提供基本資料",
    description:
      "先提供大概地區、受影響位置、去水或倒灌情況，以及安全情況下拍攝的相片或短片。毋須在網站公開完整地址。",
  },
  {
    icon: Search,
    title: "初步了解及安排",
    description:
      "按現有資料說明可能方向、初步估價及所需設備；上門時間視乎地區、交通、師傅與設備供應確認。",
  },
  {
    icon: FileCheck2,
    title: "現場檢查及確認總價",
    description:
      "師傅檢查堵塞位置、管道入口及施工條件；如實際情況不同，會先解釋方案及最終總收費，由客戶確認後才動工。",
  },
  {
    icon: Wrench,
    title: "施工、測試及交代",
    description:
      "完成已確認工序後測試排水、整理施工位置，並說明結果、限制及是否需要後續檢測或維修。",
  },
] as const;

const QUOTE_INCLUDES = [
  "建議處理方法及已確認工序",
  "上門檢查或基本施工費是否包括在內",
  "夜間、拆裝、特殊設備或額外清理會否另收費",
  "完成標準、測試方式及不成功不收費的適用條件",
] as const;

const REQUOTE_CASES = [
  "現場發現問題不在原先描述的位置或涉及共用主渠",
  "需要拆裝潔具、清理危險物、使用特殊設備或增加施工範圍",
  "發現喉管破損、變形、錯位或其他需要維修的結構問題",
  "原先工序完成後，客戶另行要求影像檢測、維修或其他獨立工作",
] as const;

const PAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "通渠熊上門服務流程與報價原則",
  description:
    "說明通渠熊作為上門服務商家的聯絡、檢查、報價、施工及完工交代流程。",
  url: "https://drainbearhk.com/service-process",
};

export default function ServiceProcess() {
  return (
    <div className="bg-white">
      <SEO
        title="上門通渠服務流程｜報價、追加工序及收費原則｜通渠熊"
        description="了解通渠熊上門服務的聯絡、初步估價、現場檢查、動工前確認總價、追加工序及完工測試原則。通渠熊為上門服務商家，不設門市接待。"
        path="/service-process"
        keywords="上門通渠流程, 通渠報價, 通渠收費原則, 通渠追加收費, 通渠檢查"
        breadcrumbs={CRUMBS}
        jsonLd={PAGE_JSON_LD}
      />
      <Breadcrumbs items={CRUMBS} />

      <main>
        <section className="border-b border-border bg-navy py-14 text-white md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-wagreen">
                SERVICE STANDARD / 服務說明
              </p>
              <h1 className="mt-3 max-w-4xl text-balance font-display text-4xl font-black md:text-5xl">
                上門服務如何安排，報價如何確認
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                通渠熊是上門服務商家，不設門市接待。由初步了解、現場檢查到動工前確認總價，每一步都應有清楚界線。
              </p>
            </div>
            <div className="border-l-4 border-safety bg-white/8 px-5 py-4 text-sm leading-relaxed text-white/75">
              相片或短片只能協助初步判斷。管內堵塞位置、喉管狀況及實際施工條件，仍要在現場確認。
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-safety">
                FROM ENQUIRY TO COMPLETION
              </p>
              <h2 className="mt-3 font-display text-3xl font-black text-navy md:text-4xl">
                四個服務階段
              </h2>
            </div>
            <ol className="mt-10 grid gap-0 border-y border-border md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((item, index) => (
                <li
                  key={item.title}
                  className="border-b border-border px-0 py-7 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:last:border-r-0 lg:px-7"
                >
                  <div className="flex items-center justify-between">
                    <item.icon className="h-6 w-6 text-wagreen-dark" />
                    <span className="font-display text-xs font-black tracking-[0.16em] text-navy/35">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-black text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-border bg-mist py-16 md:py-20">
          <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
            <article>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-wagreen-dark" />
                <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                  動工前應確認甚麼？
                </h2>
              </div>
              <ul className="mt-7 space-y-4">
                {QUOTE_INCLUDES.map(item => (
                  <li
                    key={item}
                    className="flex gap-3 leading-relaxed text-muted-foreground"
                  >
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-wagreen-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-safety" />
                <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                  哪些情況需要重新確認？
                </h2>
              </div>
              <ul className="mt-7 space-y-4">
                {REQUOTE_CASES.map(item => (
                  <li
                    key={item}
                    className="flex gap-3 leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-safety" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <MapPinned className="h-6 w-6 text-wagreen-dark" />
                <h2 className="font-display text-2xl font-black text-navy md:text-3xl">
                  上門服務，不設門市
                </h2>
              </div>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                查詢及預約經電話或 WhatsApp
                安排，服務地點為客戶提供的住宅、商舖、屋苑或其他現場。網站不會把住宅地址包裝成可供到訪的門市。
              </p>
              <Link
                href="/areas"
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-navy hover:text-wagreen-dark"
              >
                查看服務地區
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-navy px-7 py-9 text-white md:px-10">
              <h2 className="font-display text-2xl font-black md:text-3xl">
                「特快」及「不成功不收費」如何理解
              </h2>
              <p className="mt-5 leading-relaxed text-white/70">
                特快／一小時到達是目標安排，實際時間視乎地區、交通、師傅及設備供應。「不成功不收費」只適用於事前確認的合資格疏通項目；檢測、拆裝、維修、特殊設備或已完成的獨立工序可另行報價。任何新增費用都應在相關工序開始前確認。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/drain-diagnosis"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-navy hover:bg-mist"
                >
                  先判斷問題
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <WhatsAppButton
                  className="rounded-lg border-white px-5"
                  label="WhatsApp 查詢"
                  trackLocation="service_process_footer"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
