import { trackNavClick } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const GUIDES = [
  {
    slug: "choosing-professional-drain-company",
    title: "香港通渠公司推介",
    description: "比較處理範圍、施工紀錄與跟進安排。",
  },
  {
    slug: "drain-company-reviews-red-flags",
    title: "口碑同報價點核對？",
    description: "分清廣告承諾、顧客說法與可核對資料。",
  },
  {
    slug: "hong-kong-drain-cleaning-price-guide",
    title: "通渠收費點計？",
    description: "了解入口、拆裝及工具如何影響報價。",
  },
] as const;

export default function HomeCompanyGuides() {
  return (
    <section
      className="brand-section home-company-guides"
      aria-labelledby="home-company-guides-heading"
    >
      <div className="container">
        <h2
          id="home-company-guides-heading"
          className="font-display text-2xl font-black text-navy md:text-3xl"
        >
          搵香港通渠公司，先了解這幾點。
        </h2>
        <nav
          aria-label="通渠公司與收費指南"
          className="home-company-guides__links"
        >
          {GUIDES.map((guide, index) => (
            <Link
              key={guide.slug}
              href={`/blog/${guide.slug}`}
              onClick={() =>
                trackNavClick("blog_post", {
                  article_slug: guide.slug,
                  cta_location: "home_company_guides",
                  destination_url: `/blog/${guide.slug}`,
                })
              }
              className="home-company-guides__link"
            >
              <img
                src={`/images/home/knowledge-${index}.webp`}
                width="788"
                height="292"
                alt="通渠服務示意插圖"
                loading="lazy"
                decoding="async"
              />
              <h3 className="text-lg font-bold text-navy">
                {guide.title} <ArrowRight aria-hidden="true" />
              </h3>
              <p className="mt-2 text-base leading-relaxed text-navy/75">
                {guide.description}
              </p>
            </Link>
          ))}
        </nav>
        <nav
          aria-label="通渠公司委託準備"
          className="mt-6 flex flex-wrap gap-x-8 gap-y-3"
        >
          <Link
            href="/blog/drain-company-quotation-receipt-warranty"
            className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
          >
            收到通渠報價？核對加項、收據與保養{" "}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <Link
            href="/blog/hong-kong-drain-company-property-commissioning"
            className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
          >
            物業搵通渠公司：工程範圍與交接清單{" "}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </section>
  );
}
