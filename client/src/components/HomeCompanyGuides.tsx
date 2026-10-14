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
              className="home-company-guides__link"
            >
              <h3 className="text-lg font-bold text-navy">{guide.title}</h3>
              <p>{guide.description}</p>
              <span>
                閱讀指南 <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
