import SectionIllustration from "@/components/SectionIllustration";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactActions from "@/components/ContactActions";
import SEO from "@/components/SEO";
import { BUSINESS_ID, SITE_URL } from "@/config/site";
import { SERVICE_DIRECTORY } from "@/lib/navigationDirectory";
import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import {
  ANSWERS_PUBLISHED_AT,
  DRAIN_ANSWERS,
  getDrainAnswer,
} from "../../../shared/drainAnswers";
import { STARTING_PRICE_LINE } from "../../../shared/pricing";
import NotFound from "./NotFound";
import { Link, useParams } from "wouter";

export default function DrainAnswers() {
  const { slug } = useParams<{ slug?: string }>();
  const answer = slug ? getDrainAnswer(slug) : undefined;
  if (slug && !answer) return <NotFound />;
  const service = SERVICE_DIRECTORY.find(
    item => item.slug === answer?.serviceSlug
  );
  const path = answer ? `/answers/${answer.slug}` : "/answers";
  const title = answer?.question ?? "通渠問題解答";
  const description = answer
    ? answer.answer
    : "坐廁、鋅盤、浴室、倒灌、隔油池、高壓洗渠、CCTV 照渠及主渠沙井，按你遇到的問題找答案。通渠熊全線通渠服務 HK$300 起，立即傳相查詢。";
  const crumbs = [
    { name: "首頁", path: "/" },
    { name: "通渠問題解答", path: "/answers" },
    ...(answer ? [{ name: title, path }] : []),
  ];
  const related = answer
    ? DRAIN_ANSWERS.filter(
        item =>
          item.serviceSlug === answer.serviceSlug && item.slug !== answer.slug
      )
    : [];
  const topicJsonLd = answer
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${SITE_URL}${path}#article`,
          headline: title,
          description,
          datePublished: ANSWERS_PUBLISHED_AT,
          dateModified: "2026-10-24",
          author: { "@id": BUSINESS_ID },
          publisher: { "@id": BUSINESS_ID },
          inLanguage: "zh-Hant-HK",
          mainEntityOfPage: { "@id": `${SITE_URL}${path}#webpage` },
          about: {
            "@id": `${SITE_URL}/services/${answer.serviceSlug}#service`,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${SITE_URL}${path}#faq`,
          mainEntity: [
            {
              "@type": "Question",
              name: title,
              url: `${SITE_URL}${path}#direct-answer`,
              acceptedAnswer: { "@type": "Answer", text: answer.answer },
            },
          ],
        },
      ]
    : {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/answers#collection`,
        name: title,
        url: `${SITE_URL}/answers`,
        hasPart: DRAIN_ANSWERS.map(item => ({
          "@type": "WebPage",
          name: item.question,
          url: `${SITE_URL}/answers/${item.slug}`,
        })),
      };
  return (
    <div className="answer-library">
      <SEO
        title={`${title}｜通渠熊`}
        description={description}
        path={path}
        breadcrumbs={crumbs}
        jsonLd={topicJsonLd}
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={crumbs} tone="dark" />
        <section className="container answer-library__hero">
          <h1>{title}</h1>
          {answer ? (
            <p className="answer-library__byline">
              通渠熊 · 更新：2026年10月16日
            </p>
          ) : (
            <p>{description}</p>
          )}
          <p className="service-starting-price">{STARTING_PRICE_LINE}</p>
          <ContactActions
            location={answer ? "answer_hero" : "answer_directory_hero"}
            topic={answer?.slug}
            message={
              answer
                ? `你好，我想查詢：${answer.question}\n地區：\n現場情況：\n相片／短片：`
                : undefined
            }
          />
        </section>
      </div>
      {answer ? (
        <>
          <article className="container answer-library__article">
            <section id="direct-answer" aria-labelledby="direct-answer-heading">
              <h2 id="direct-answer-heading">直接解答</h2>
              <SectionIllustration scene="services" />
              <p>{answer.answer}</p>
            </section>
            <section aria-labelledby="observation-heading">
              <h2 id="observation-heading">現場觀察重點</h2>
              <SectionIllustration scene="observe" />
              <p>{answer.observation}</p>
            </section>
            <section aria-labelledby="next-step-heading">
              <h2 id="next-step-heading">下一步點做？</h2>
              <SectionIllustration scene="handoff" />
              <p>{answer.nextStep}</p>
            </section>
            <nav className="answer-library__service" aria-label="相關通渠服務">
              <h2>搵通渠熊處理</h2>
              <p>傳送所在地區、受影響位置及相片，直接查詢報價。</p>
              <Link href={`/services/${answer.serviceSlug}`}>
                了解{service?.name}
              </Link>
              <Link href="/">通渠熊香港通渠服務 · HK$300 起</Link>
              <Link href="/guide">立即準備傳相報價</Link>
            </nav>
          </article>
          <section
            className="container answer-library__related"
            aria-labelledby="related-answers-heading"
          >
            <h2 id="related-answers-heading">相關問題</h2>
            <ul>
              {related.slice(0, 6).map(item => (
                <li key={item.slug}>
                  <Link href={`/answers/${item.slug}`}>{item.question}</Link>
                </li>
              ))}
            </ul>
            <Link href={`/answers#${answer.serviceSlug}`}>
              查看全部{service?.shortName}解答
            </Link>
          </section>
        </>
      ) : (
        <div className="container answer-library__directory">
          <nav
            aria-label="按通渠問題分類"
            className="answer-library__categories"
          >
            {SERVICE_DIRECTORY.map(item => (
              <a key={item.slug} href={`#${item.slug}`}>
                {item.shortName}
              </a>
            ))}
          </nav>
          {SERVICE_DIRECTORY.map(item => (
            <section
              id={item.slug}
              key={item.slug}
              aria-labelledby={`answer-category-${item.slug}`}
            >
              <h2 id={`answer-category-${item.slug}`}>{item.name}</h2>
              <ul>
                {DRAIN_ANSWERS.filter(
                  answer => answer.serviceSlug === item.slug
                ).map(answer => (
                  <li key={answer.slug}>
                    <Link href={`/answers/${answer.slug}`}>
                      {answer.question}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                className="answer-library__service-link"
                href={`/services/${item.slug}`}
              >
                查詢{item.shortName}服務
              </Link>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
