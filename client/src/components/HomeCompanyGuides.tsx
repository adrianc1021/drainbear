import { trackNavClick } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const GUIDES = [
  {
    slug: "choosing-professional-drain-company",
    title: "通渠邊間好？",
    description: "比較公司與師傅推介，核對處理範圍及上門安排。",
  },
  {
    slug: "drain-company-reviews-red-flags",
    title: "口碑同報價點核對？",
    description: "了解收費含糊、臨場加項及網上評價的核對方法。",
  },
  {
    slug: "hong-kong-drain-cleaning-price-guide",
    title: "通渠收費點計？",
    description: "按現場與工序比較價錢，了解討論區分享的限制。",
  },
] as const;

export default function HomeCompanyGuides() {
  return (
    <section
      className="brand-section"
      aria-labelledby="home-company-guides-heading"
    >
      <div className="container">
        <p className="brand-eyebrow">選公司與師傅</p>
        <h2
          id="home-company-guides-heading"
          className="font-display text-2xl font-black text-navy md:text-3xl"
        >
          搵香港通渠公司，先了解這幾點。
        </h2>
        <nav
          aria-label="通渠公司與收費指南"
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          {GUIDES.map(guide => (
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
              className="card-float flex min-h-44 flex-col rounded-xl border border-border bg-white p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
            >
              <h3 className="text-lg font-bold text-navy">{guide.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {guide.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-wagreen-dark">
                閱讀指南 <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
