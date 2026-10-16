import featuredAnswers from "../../../shared/featuredDrainAnswers.json";
import { DRAIN_ANSWERS } from "../../../shared/drainAnswers";
import { Link } from "wouter";

export default function ServiceAnswerLinks({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const featured = (featuredAnswers as Record<string, string>)[serviceSlug];
  const matches = DRAIN_ANSWERS.filter(
    item => item.serviceSlug === serviceSlug
  );
  const answers = [
    ...matches.filter(item => item.slug === featured),
    ...matches.filter(item => item.slug !== featured),
  ].slice(0, 4);
  if (!answers.length) return null;
  return (
    <section
      className="service-answer-links"
      aria-labelledby="service-answer-links-heading"
    >
      <h2 id="service-answer-links-heading">遇到這些問題？</h2>
      <ul>
        {answers.map(answer => (
          <li key={answer.slug}>
            <Link href={`/answers/${answer.slug}`}>{answer.question}</Link>
          </li>
        ))}
      </ul>
      <Link href={`/answers#${serviceSlug}`}>查看相關通渠解答</Link>
    </section>
  );
}
