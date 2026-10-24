import SectionIllustration from "@/components/SectionIllustration";
import { BASIN_SLUG, BASIN_MESSAGE } from "@/lib/basinConversion";
import { WhatsAppButton } from "@/components/Layout";
import { Link } from "wouter";
import {
  householdTopic,
  HOUSEHOLD_SEARCH_TOPICS,
} from "@/lib/householdSearchTopics";

export function HouseholdTopicGuide({ slug }: { slug: string }) {
  const topic = householdTopic(slug);
  if (!topic) return null;
  if (slug === BASIN_SLUG)
    return (
      <section
        className="household-topic-guide basin-action-guide"
        aria-labelledby="household-topic-heading"
      >
        <h2 id="household-topic-heading">{topic.heading}</h2>
        <SectionIllustration scene="handoff" />
        <ol>
          {topic.observations.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <WhatsAppButton
          label="傳相片，查詢洗手盆報價"
          message={BASIN_MESSAGE}
          trackLocation="basin_quick_quote"
        />
      </section>
    );
  return (
    <section
      className="household-topic-guide"
      aria-labelledby="household-topic-heading"
    >
      <h2 id="household-topic-heading">{topic.heading}</h2>
      <SectionIllustration scene="observe" />
      <p>{topic.answer}</p>
      <ul>
        {topic.observations.map(text => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <p>
        需要檢查或疏通？
        <Link href={`/services/${topic.service}`}>
          {topic.name}：了解處理服務與報價安排
        </Link>
        。
      </p>
      <h3>按你的情況繼續閱讀</h3>
      <SectionIllustration scene="prepare" />
      <ul>
        {topic.links.map(link => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <nav aria-label="家居去水問題系列">
        {HOUSEHOLD_SEARCH_TOPICS.filter(t => t.slug !== slug).map(t => (
          <Link key={t.slug} href={`/blog/${t.slug}`}>
            {t.name}指南
          </Link>
        ))}
      </nav>
    </section>
  );
}
export function HouseholdServiceTopics({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const topics = HOUSEHOLD_SEARCH_TOPICS.filter(t => t.service === serviceSlug);
  if (!topics.length) return null;
  return (
    <section
      className="household-topic-guide"
      aria-labelledby="household-service-topics"
    >
      <h2 id="household-service-topics">先按去水位置了解處理方向</h2>
      {topics.map(t => (
        <div key={t.slug}>
          <h3>{t.name}</h3>
          <p>{t.answer}</p>
          <Link href={`/blog/${t.slug}`}>閱讀{t.name}完整指南</Link>
        </div>
      ))}
    </section>
  );
}
