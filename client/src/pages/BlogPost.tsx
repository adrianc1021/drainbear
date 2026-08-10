/**
 * 通渠熊 DrainBear — Blog文章內頁
 * 支援Sanity Portable Text及原有靜態文章。
 */
import { Link, useParams } from "wouter";
import { useEffect } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { trackBlogRead, trackNavClick } from "@/lib/analytics";
import {
  browserBlogReadDeps,
  createBlogReadTracker,
} from "@/lib/blogReadTracker";
import { useBlogPost, useBlogPosts } from "@/lib/useBlog";
import type { SanityArticleImage, SanityExpertTip } from "@/lib/sanity/types";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

function formatDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()} 年 ${
    date.getMonth() + 1
  } 月 ${date.getDate()} 日`;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 leading-[1.9] text-navy/75">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 font-display text-xl font-black text-navy md:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-lg font-black text-navy md:text-xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-4 border-wagreen bg-mist px-6 py-5 leading-relaxed text-navy/75">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-6 leading-[1.8] text-navy/75">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 leading-[1.8] text-navy/75">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-navy">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => (
      <span className="underline decoration-wagreen decoration-2 underline-offset-2">
        {children}
      </span>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const openInNewTab = Boolean(value?.openInNewTab);
      const isExternal = /^https?:\/\//i.test(href);

      return (
        <a
          href={href}
          target={openInNewTab || isExternal ? "_blank" : undefined}
          rel={openInNewTab || isExternal ? "noopener noreferrer" : undefined}
          className="font-semibold text-wagreen-dark underline decoration-wagreen/50 underline-offset-2 hover:text-navy"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    articleImage: ({ value }) => {
      const image = value as SanityArticleImage;

      if (!image.url) return null;

      return (
        <figure className="mt-10">
          <img
            src={image.url}
            alt={image.alt ?? ""}
            width={image.width}
            height={image.height}
            className="h-auto w-full rounded-lg border border-border object-cover"
            loading="lazy"
          />

          {image.caption && (
            <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
              {image.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    expertTip: ({ value }) => {
      const tip = value as SanityExpertTip;

      return (
        <aside className="mt-10 flex gap-4 rounded-lg border border-wagreen/30 bg-wagreen/5 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-wagreen text-white">
            <Lightbulb className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div>
            <h3 className="font-display font-black text-navy">
              {tip.title || "白熊師傅貼士"}
            </h3>
            <p className="mt-1 leading-relaxed text-navy/75">{tip.text}</p>
          </div>
        </aside>
      );
    },
  },

  unknownType: ({ value }) => {
    if (import.meta.env.DEV) {
      console.warn("未支援的Portable Text類型：", value?._type);
    }

    return null;
  },
};

export default function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { settings } = useSiteSettings();

  const { post, isLoading, isNotFound, error } = useBlogPost(slug);

  const { posts } = useBlogPosts();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const postSlug = post?.slug;

  useEffect(() => {
    if (!postSlug) return;

    const tracker = createBlogReadTracker(
      postSlug,
      browserBlogReadDeps(trackBlogRead)
    );

    return () => tracker.dispose();
  }, [postSlug]);

  if (isLoading && !post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div
          className="flex items-center gap-3 text-sm text-navy/60"
          role="status"
        >
          <LoaderCircle className="h-5 w-5 animate-spin" />
          正在載入文章……
        </div>
      </div>
    );
  }

  if (!post && error && !isLoading) {
    return (
      <div className="bg-white py-24">
        <SEO
          title="文章暫時未能載入｜通渠熊 DrainBear"
          description="文章暫時未能載入，請稍後再試或返回通渠小知識。"
          path={`/blog/${slug}`}
          noindex
        />

        <div className="container max-w-xl text-center">
          <TriangleAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-5 font-display text-2xl font-black text-navy">
            文章暫時未能載入
          </h1>
          <p className="mt-3 text-muted-foreground">
            請稍後再試，或者返回通渠小知識查看其他文章。
          </p>
          <Link
            href="/blog"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回通渠小知識
          </Link>
        </div>
      </div>
    );
  }

  if (isNotFound || !post) {
    return (
      <div className="bg-white py-24">
        <SEO
          title="找不到文章｜通渠熊 DrainBear"
          description="你所尋找的文章不存在或尚未發布。"
          path={`/blog/${slug}`}
          noindex
        />

        <div className="container max-w-xl text-center">
          <h1 className="font-display text-3xl font-black text-navy">
            找不到文章
          </h1>
          <p className="mt-3 text-muted-foreground">
            文章可能尚未發布、已經移除，或者網址不正確。
          </p>
          <Link
            href="/blog"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回通渠小知識
          </Link>
        </div>
      </div>
    );
  }

  const related = posts
    .filter(candidate => candidate.slug !== post.slug)
    .slice(0, 3);

  const seoTitle =
    post.seo?.metaTitle || `${post.title}｜通渠小知識｜通渠熊 DrainBear`;

  const seoDescription = post.seo?.metaDescription || post.excerpt;

  const seoImage = post.seo?.ogImage?.url || post.coverImage?.url;

  const seoImageAlt =
    post.seo?.ogImage?.alt || post.coverImage?.alt || post.title;

  const canonicalUrl = post.seo?.canonicalUrl || `/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: seoDescription,
    image: seoImage ? [seoImage] : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    keywords: post.keywords.join(", "),
    author: {
      "@type": "Organization",
      name: settings.businessName,
      url: settings.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: settings.businessName,
      url: settings.siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${settings.siteUrl.replace(/\/+$/, "")}/blog/${post.slug}`,
    },
  };

  return (
    <div>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/blog/${post.slug}`}
        canonicalUrl={canonicalUrl}
        ogTitle={post.seo?.ogTitle}
        ogDescription={post.seo?.ogDescription}
        image={seoImage}
        imageAlt={seoImageAlt}
        type="article"
        keywords={post.keywords.join(", ")}
        jsonLd={jsonLd}
        noindex={Boolean(post.seo?.noIndex)}
        breadcrumbs={[
          { name: "首頁", path: "/" },
          { name: "通渠小知識", path: "/blog" },
          {
            name: post.title,
            path: `/blog/${post.slug}`,
          },
        ]}
      />

      <section className="bg-gradient-to-b from-mist to-white py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href="/blog"
            className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-navy/60 hover:gap-2.5 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            返回通渠小知識
          </Link>

          <div className="mt-6 inline-flex items-center rounded-full bg-navy px-3.5 py-1 text-xs font-bold text-wagreen">
            {post.category}
          </div>

          <h1 className="mt-4 text-balance font-display text-3xl font-black leading-tight text-navy md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.date)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readMins} 分鐘閱讀
            </span>
          </div>

          {post.coverImage?.url && (
            <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-white">
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                width={post.coverImage.width}
                height={post.coverImage.height}
                className="aspect-[1.91/1] h-auto w-full object-cover"
                loading="eager"
              />

              {post.coverImage.caption && (
                <figcaption className="px-5 py-3 text-center text-sm text-muted-foreground">
                  {post.coverImage.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-24">
        <article className="mx-auto max-w-3xl px-4">
          {post.source === "sanity" && post.body && (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          )}

          {post.source === "static" &&
            post.sections?.map((section, index) => {
              if (section.type === "h2") {
                return (
                  <h2
                    key={index}
                    className="mt-10 font-display text-xl font-black text-navy md:text-2xl"
                  >
                    {section.text}
                  </h2>
                );
              }

              if (section.type === "tip") {
                return (
                  <aside
                    key={index}
                    className="mt-10 flex gap-4 rounded-lg border border-wagreen/30 bg-wagreen/5 p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-wagreen text-white">
                      <Lightbulb className="h-5 w-5" strokeWidth={2.2} />
                    </div>

                    <p className="leading-relaxed text-navy">{section.text}</p>
                  </aside>
                );
              }

              return (
                <p key={index} className="mt-5 leading-[1.9] text-navy/75">
                  {section.text}
                </p>
              );
            })}

          <div className="mt-14 rounded-lg bg-navy p-8 text-center md:p-10">
            <h2 className="font-display text-xl font-black text-white md:text-2xl">
              渠道問題揮之不去？
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-white/60 md:text-base">
              WhatsApp 白熊師傅，影相或拍片描述情況，即時免費初步報價，24
              小時候命。
            </p>

            <div className="mt-6 flex justify-center">
              <WhatsAppButton
                label="WhatsApp 免費報價"
                trackLocation="blogpost_cta"
              />
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-lg font-black text-navy md:text-xl">
                延伸閱讀
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {related.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    onClick={() =>
                      trackNavClick("blog_post", {
                        article_slug: relatedPost.slug,
                        cta_location: "blogpost_related",
                        destination_url: `/blog/${relatedPost.slug}`,
                      })
                    }
                    className="card-float group flex flex-col rounded-lg border border-border bg-white p-5"
                  >
                    <div className="text-[11px] font-bold tracking-wide text-wagreen-dark">
                      {relatedPost.category}
                    </div>

                    <h3 className="mt-2 flex-1 text-balance font-display text-sm font-bold leading-snug text-navy group-hover:text-wagreen-dark">
                      {relatedPost.title}
                    </h3>

                    <span className="btn-smooth mt-3 inline-flex items-center gap-1 text-xs font-bold text-navy/50 group-hover:gap-2 group-hover:text-navy">
                      閱讀
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
