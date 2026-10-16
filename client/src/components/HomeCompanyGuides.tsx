import { trackNavClick } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const GUIDES = [
  {
    slug: "choosing-professional-drain-company",
    title: "香港通渠公司推介",
  },
  {
    slug: "drain-company-reviews-red-flags",
    title: "口碑同報價點核對？",
  },
  {
    slug: "hong-kong-drain-cleaning-price-guide",
    title: "通渠收費點計？",
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
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
