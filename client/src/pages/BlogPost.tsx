import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import ContactActions from "@/components/ContactActions";
/**
 * 通渠熊 DrainBear — Blog文章內頁
 * 支援Sanity Portable Text及原有靜態文章。
 */
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { trackBlogRead, trackNavClick } from "@/lib/analytics";
import {
  browserBlogReadDeps,
  createBlogReadTracker,
} from "@/lib/blogReadTracker";
import { createImageSrcSet, optimizedImageUrl } from "@/lib/imageOptimization";
import type { SanityArticleImage, SanityExpertTip } from "@/lib/sanity/types";
import { useBlogPost, useBlogPosts } from "@/lib/useBlog";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Lightbulb,
  LoaderCircle,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "wouter";

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
            src={optimizedImageUrl(image.url, 1200)}
            srcSet={createImageSrcSet(image.url, [480, 768, 960, 1200])}
            sizes="(min-width: 768px) 768px, 100vw"
            alt={image.alt ?? ""}
            width={image.width}
            height={image.height}
            className="h-auto w-full rounded-lg border border-border object-cover"
            loading="lazy"
            decoding="async"
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

  const {
    posts,
    isLoading: isRelatedLoading,
    error: relatedError,
  } = useBlogPosts();

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
          description="您所尋找的文章不存在或尚未發布。"
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
    .sort((a, b) => {
      const preferred = post.relatedSlugs || [];
      const rank = (slug: string) => {
        const index = preferred.indexOf(slug);
        return index < 0 ? preferred.length : index;
      };
      return rank(a.slug) - rank(b.slug);
    })
    .slice(0, 3);

  const seoTitle = post.seo?.metaTitle || `${post.title}｜通渠熊`;

  const seoDescription = post.seo?.metaDescription || post.excerpt;

  const imageSource = post.seo?.ogImage?.url || post.coverImage?.url;
  const seoImage = imageSource
    ? new URL(imageSource, settings.siteUrl).href
    : undefined;

  const seoImageAlt =
    post.seo?.ogImage?.alt || post.coverImage?.alt || post.title;

  const canonicalUrl = post.seo?.canonicalUrl || `/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${settings.siteUrl.replace(/\/+$/, "")}/blog/${post.slug}#article`,
    url: `${settings.siteUrl.replace(/\/+$/, "")}/blog/${post.slug}`,
    inLanguage: "zh-Hant-HK",
    isPartOf: { "@id": `${settings.siteUrl.replace(/\/+$/, "")}/#website` },
    headline: post.title,
    description: seoDescription,
    image: seoImage ? [seoImage] : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    keywords: post.keywords.join(", "),
    author: {
      "@type": "Organization",
      name: post.authorName,
      url: settings.siteUrl,
    },
    reviewedBy: post.reviewerName
      ? {
          "@type": "Organization",
          name: post.reviewerName,
          url: settings.siteUrl,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      "@id": `${settings.siteUrl.replace(/\/+$/, "")}/#organization`,
      name: settings.businessName,
      url: settings.siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${settings.siteUrl.replace(/\/+$/, "")}/blog/${post.slug}#webpage`,
    },
  };

  return (
    <div
      data-cms-loading={isLoading || isRelatedLoading}
      data-cms-error={Boolean(error || relatedError)}
    >
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
        metadataReady={!isLoading}
        keywords={post.keywords.join(", ")}
        jsonLd={
          post.faqs?.length
            ? [
                jsonLd,
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "@id": `${settings.siteUrl.replace(/\/+$/, "")}/blog/${post.slug}#faq`,
                  mainEntity: post.faqs.map((faq, index) => ({
                    "@type": "Question",
                    url: `${settings.siteUrl.replace(/\/+$/, "")}/blog/${post.slug}#blog-answer-${index + 1}`,
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                  })),
                },
              ]
            : jsonLd
        }
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

      <section className="article-hero text-white">
        <div className="article-hero__inner relative z-10 mx-auto max-w-3xl px-4">
          <Link
            href="/blog"
            className="btn-smooth inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-white/70 hover:gap-2.5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回通渠小知識
          </Link>

          <div className="mt-3 inline-flex items-center rounded-full bg-white/12 px-3.5 py-1 text-xs font-bold text-wagreen">
            {post.category}
          </div>

          <h1 className="mt-4 text-balance font-display text-3xl font-black leading-tight text-white md:text-4xl">
            {post.title}
          </h1>
          <ContactActions location="blog_post_hero" />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              發布 {formatDate(post.date)}
            </span>

            {post.updatedAt && post.updatedAt !== post.date ? (
              <span>更新 {formatDate(post.updatedAt)}</span>
            ) : null}

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readMins} 分鐘閱讀
            </span>

            <span className="inline-flex items-center gap-1.5 sm:border-l sm:border-border sm:pl-5">
              <UserRound className="h-4 w-4" />
              作者：{post.authorName}
            </span>
          </div>

          {post.coverImage?.url && (
            <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-white">
              <img
                src={optimizedImageUrl(post.coverImage.url, 1200)}
                srcSet={
                  post.coverImage.srcSet ||
                  createImageSrcSet(post.coverImage.url, [480, 768, 960, 1200])
                }
                sizes="(min-width: 768px) 768px, 100vw"
                alt={post.coverImage.alt || post.title}
                width={post.coverImage.width}
                height={post.coverImage.height}
                className="h-auto w-full"
                loading="eager"
                fetchPriority="high"
                decoding="async"
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
              if (section.type === "list") {
                const List = section.ordered ? "ol" : "ul";
                return (
                  <List
                    key={index}
                    className={`mt-5 space-y-3 pl-6 leading-[1.8] text-navy/75 ${section.ordered ? "list-decimal" : "list-disc"}`}
                  >
                    {section.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </List>
                );
              }
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

          <AnimatedDisclosure
            id="article-content-details"
            title="文章資料與適用範圍"
            className="mt-10"
          >
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-bold">資料整理與撰寫</dt>
                <dd>{post.authorName}</dd>
              </div>
              {post.reviewerName ? (
                <div>
                  <dt className="font-bold">服務流程及安全資訊審閱</dt>
                  <dd>{post.reviewerName}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-bold">最後更新</dt>
                <dd>{formatDate(post.updatedAt || post.date)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed">
              內容根據服務流程、設備用途及一般渠務安全原則整理。網上資料不能取代現場檢查；管道狀況、處理方法及上門安排須按現場資料確認。
            </p>
          </AnimatedDisclosure>

          {post.resourceLinks?.length ? (
            <section
              className="article-resources"
              aria-labelledby="article-resources-heading"
            >
              <h2 id="article-resources-heading">相關服務與延伸資料</h2>
              <ul>
                {post.resourceLinks.map(resource => (
                  <li key={resource.href}>
                    <Link href={resource.href}>
                      {resource.label}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                    {resource.note ? <p>{resource.note}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {post.faqs?.length ? (
            <section
              className="article-faq"
              aria-labelledby="article-faq-heading"
            >
              <h2 id="article-faq-heading">常見問題</h2>
              <div className="reading-faq">
                {post.faqs.map((faq, index) => (
                  <AnimatedDisclosure
                    key={faq.question}
                    id={`blog-answer-${index + 1}`}
                    title={faq.question}
                  >
                    <p>{faq.answer}</p>
                  </AnimatedDisclosure>
                ))}
              </div>
            </section>
          ) : null}
          <div className="mt-14 rounded-lg bg-navy p-8 text-center md:p-10">
            <h2 className="font-display text-xl font-black text-white md:text-2xl">
              渠務問題仍未解決？
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-white/60 md:text-base">
              請透過 WhatsApp 提供位置、相片或短片，團隊會先了解現場情況，
              再確認可安排的服務及收費。
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {post.resourceLinks?.some(resource => resource.href === "/") ? (
                <Link
                  href="/"
                  onClick={() =>
                    trackNavClick("navigation", {
                      article_slug: post.slug,
                      cta_location: "blogpost_home",
                      destination_url: "/",
                    })
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/60 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  返回首頁，了解通渠服務
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
              <WhatsAppButton
                label="WhatsApp 查詢"
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

                    <span className="btn-smooth mt-3 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground group-hover:gap-2 group-hover:text-navy">
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
