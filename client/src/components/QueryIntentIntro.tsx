import { Link } from "wouter";
import { QUERY_INTENT_REVISIONS } from "@/lib/queryIntentRevision";

export default function QueryIntentIntro({ slug }: { slug: string }) {
  const revision = QUERY_INTENT_REVISIONS[slug];
  if (!revision) return null;
  return (
    <section
      className="household-topic-guide"
      aria-labelledby="query-intent-heading"
    >
      <h2 id="query-intent-heading">{revision.heading}</h2>
      <p>{revision.answer}</p>
      <p>
        <Link href={revision.href}>{revision.label}</Link>
      </p>
    </section>
  );
}
