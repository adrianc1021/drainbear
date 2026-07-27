/**
 * 通渠熊 DrainBear — 常見問題
 * Accordion 折疊面板，預設隱藏答案
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/Layout";

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

export default function FAQ() {
  return (
    <div>
      <section className="bg-gradient-to-b from-mist to-white py-16 md:py-20">
        <div className="container text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">FAQ</div>
          <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
            常見問題
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            關於收費、施工及保養的疑問，白熊師傅在此一一解答。
          </p>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-24">
        <div className="mx-auto max-w-3xl px-4">
          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="card-float rounded-lg border border-border bg-white px-6 data-[state=open]:border-wagreen/40"
              >
                <AccordionTrigger className="py-5 text-left font-display text-base font-bold text-navy hover:no-underline md:text-lg">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 shrink-0 text-wagreen" strokeWidth={2.2} />
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-8 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-14 rounded-lg bg-mist p-8 text-center md:p-10">
            <h2 className="font-display text-xl font-black text-navy md:text-2xl">仍有其他疑問？</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              直接 WhatsApp 白熊師傅，即時解答並獲取免費初步報價。
            </p>
            <div className="mt-6 flex justify-center">
              <WhatsAppButton label="WhatsApp 即時查詢" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
