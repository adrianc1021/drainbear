/**
 * 通渠熊 DrainBear — 通渠小知識文章內頁
 * 正文排版 + Article JSON-LD + 相關文章 + WhatsApp CTA
 */
import { Link, useParams, useLocation } from "wouter";
import { useEffect } from "react";
import { CalendarDays, Clock, ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blogData";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const post = getPostBySlug(slug ?? "");

  useEffect(() => {
    if (!post) navigate("/blog", { replace: true });
    window.scrollTo({ top: 0 });
  }, [post, navigate, slug]);

  if (!post) return null;

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    keywords: post.keywords.join(","),
    author: { "@type": "Organization", name: "通渠熊 DrainBear" },
    publisher: { "@type": "Plumber", name: "通渠熊 DrainBear", telephone: "+85295588260" },
    mainEntityOfPage: `https://drainbear.manus.space/blog/${post.slug}`,
  };

  return (
    <div>
      <SEO
        title={`${post.title}｜通渠小知識｜通渠熊 DrainBear`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        keywords={post.keywords.join(", ")}
        jsonLd={jsonLd}
        breadcrumbs={[
          { name: "首頁", path: "/" },
          { name: "通渠小知識", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      {/* 文章頭部 */}
      <section className="bg-gradient-to-b from-mist to-white py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href="/blog"
            className="btn-smooth inline-flex items-center gap-1.5 text-sm font-bold text-navy/60 hover:gap-2.5 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> 返回通渠小知識
          </Link>
          <div className="mt-6 inline-flex items-center rounded-full bg-navy px-3.5 py-1 text-xs font-bold text-wagreen">
            {post.category}
          </div>
          <h1 className="mt-4 text-balance font-display text-3xl font-black leading-tight text-navy md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readMins} 分鐘閱讀
            </span>
          </div>
        </div>
      </section>

      {/* 正文 */}
      <section className="bg-white pb-20 md:pb-24">
        <article className="mx-auto max-w-3xl px-4">
          {post.sections.map((s, i) => {
            if (s.type === "h2")
              return (
                <h2 key={i} className="mt-10 font-display text-xl font-black text-navy md:text-2xl">
                  {s.text}
                </h2>
              );
            if (s.type === "tip")
              return (
                <div
                  key={i}
                  className="mt-10 flex gap-4 rounded-lg border border-wagreen/30 bg-wagreen/5 p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-wagreen text-white">
                    <Lightbulb className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <p className="leading-relaxed text-navy">{s.text}</p>
                </div>
              );
            return (
              <p key={i} className="mt-5 leading-[1.9] text-navy/75">
                {s.text}
              </p>
            );
          })}

          {/* 文末 CTA */}
          <div className="mt-14 rounded-lg bg-navy p-8 text-center md:p-10">
            <h2 className="font-display text-xl font-black text-white md:text-2xl">
              渠道問題揮之不去？
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/60 md:text-base">
              WhatsApp 白熊師傅，影相或拍片描述情況，即時免費初步報價，24 小時候命。
            </p>
            <div className="mt-6 flex justify-center">
              <WhatsAppButton label="WhatsApp 免費報價" />
            </div>
          </div>

          {/* 相關文章 */}
          <div className="mt-16">
            <h2 className="font-display text-lg font-black text-navy md:text-xl">延伸閱讀</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card-float group flex flex-col rounded-lg border border-border bg-white p-5"
                >
                  <div className="text-[11px] font-bold tracking-wide text-wagreen-dark">{p.category}</div>
                  <h3 className="mt-2 flex-1 text-balance font-display text-sm font-bold leading-snug text-navy group-hover:text-wagreen-dark">
                    {p.title}
                  </h3>
                  <span className="btn-smooth mt-3 inline-flex items-center gap-1 text-xs font-bold text-navy/50 group-hover:gap-2 group-hover:text-navy">
                    閱讀 <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
