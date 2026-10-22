import {
  SERVICE_READING_LINKS,
  SERVICE_TOPIC_ARTICLES,
} from "@/lib/contentConnections";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import { SEO_ARTICLES } from "@/lib/seoArticles";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function RelatedDrainArticles({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const articles = [
    ...(SERVICE_READING_LINKS[serviceSlug] ?? []),
    ...SERVICE_TOPIC_ARTICLES.filter(article =>
      (article.services as readonly string[]).includes(serviceSlug)
    ),
    ...SEO_ARTICLES.filter(article =>
      article.serviceSlugs?.includes(serviceSlug)
    ),
  ].filter(
    (article, index, all) =>
      all.findIndex(item => item.slug === article.slug) === index
  );
  if (!articles.length) return null;
  return (
    <AnimatedDisclosure
      id={`service-reading-${serviceSlug}`}
      title="相關通渠文章"
      className="reading-disclosure"
    >
      <nav className="article-resource-links" aria-label="服務相關實用文章">
        {articles.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`}>
            {article.title}
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </AnimatedDisclosure>
  );
}
