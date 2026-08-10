/**
 * 通渠熊 DrainBear — 通渠小知識（網誌列表頁）
 * Sanity已發布文章優先，原有靜態文章作後備。
 */
import { Link } from "wouter";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  BookOpen,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { trackNavClick } from "@/lib/analytics";
import { useBlogPosts } from "@/lib/useBlog";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const BLOG_CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "通渠小知識", path: "/blog" },
];

const BLOG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "通渠小知識",
  description:
    "通渠熊 DrainBear 專業渠務知識庫：日常防塞喉管實用建議、通渠迷思拆解及緊急應對指南。",
  url: "https://drainbearhk.com/blog",
  publisher: {
    "@type": "Organization",
    name: "通渠熊 DrainBear",
  },
};

const FALLBACK_FEATURED_IMAGE =
  "https://res.cloudinary.com/pgjztf2p/image/upload/v1785147037/LOGO_dmyalo.png";

function formatDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()} 年 ${
    date.getMonth() + 1
  } 月 ${date.getDate()} 日`;
}

export default function Blog() {
  const { posts, isLoading, isFallback, error } = useBlogPosts();

  const [featured, ...rest] = posts;

  return (
    <div>
      <SEO
        title="通渠小知識｜防塞喉管實用建議・通渠迷思拆解｜通渠熊 DrainBear"
        description="白熊師傅分享香港家居及商業渠務知識：防塞喉管、通渠收費、緊急處理、CCTV照渠及日常保養實用指南。"
        path="/blog"
        keywords="通渠小知識, 通渠收費, 防塞喉管, 坐廁塞, 高壓通渠, CCTV照渠, 渠務保養"
        jsonLd={BLOG_JSONLD}
        breadcrumbs={BLOG_CRUMBS}
        contentReady={!isLoading}
      />

      <Breadcrumbs items={BLOG_CRUMBS} />

      <section className="bg-gradient-to-b from-mist to-white py-16 md:py-20">
        <div className="container text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">
            DRAIN CARE TIPS
          </div>

          <h1 className="text-balance font-display text-4xl font-black text-navy md:text-5xl">
            通渠小知識
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            預防勝於治療。白熊師傅將多年實戰經驗寫成實用指南，教你日常保養喉管、拆解通渠迷思，慳返冤枉錢。
          </p>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-24">
        <div className="container">
          {isLoading && (
            <div
              className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-border bg-mist p-4 text-sm text-navy/65"
              role="status"
              aria-live="polite"
            >
              <LoaderCircle className="h-4 w-4 animate-spin" />
              正在載入最新文章……
            </div>
          )}

          {!isLoading && isFallback && error && (
            <div
              className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
              role="status"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>最新文章暫時未能載入，目前顯示既有精選文章。請稍後再試。</p>
            </div>
          )}

          {!featured && !isLoading && (
            <div className="rounded-lg border border-border bg-mist p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-navy/40" />
              <h2 className="mt-4 font-display text-xl font-black text-navy">
                暫時未有文章
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                新文章正在準備中，請稍後再來。
              </p>
            </div>
          )}

          {featured && (
            <>
              <Link
                href={`/blog/${featured.slug}`}
                onClick={() =>
                  trackNavClick("blog_post", {
                    article_slug: featured.slug,
                    cta_location: "blog_featured",
                    destination_url: `/blog/${featured.slug}`,
                  })
                }
                className="card-float group grid overflow-hidden rounded-lg border border-border bg-navy md:grid-cols-5"
              >
                <div className="flex flex-col justify-center p-8 md:col-span-3 md:p-12">
                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-wagreen/15 px-3.5 py-1 text-xs font-bold text-wagreen">
                    <BookOpen className="h-3.5 w-3.5" strokeWidth={2.5} />
                    最新文章・{featured.category}
                  </div>

                  <h2 className="text-balance font-display text-2xl font-black text-white transition-colors duration-200 group-hover:text-wagreen md:text-3xl">
                    {featured.title}
                  </h2>

                  <p className="mt-4 leading-relaxed text-white/60">
                    {featured.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-white/45">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(featured.date)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readMins} 分鐘閱讀
                    </span>
                  </div>

                  <span className="btn-smooth mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen group-hover:gap-2.5">
                    閱讀全文
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="relative min-h-64 overflow-hidden bg-gradient-to-br from-navy via-navy to-[#16224d] md:col-span-2">
                  <img
                    src={featured.coverImage?.url ?? FALLBACK_FEATURED_IMAGE}
                    alt={featured.coverImage?.alt ?? "通渠熊 DrainBear"}
                    className={
                      featured.coverImage?.url
                        ? "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        : "absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-90 drop-shadow-[0_12px_36px_rgba(37,211,102,0.25)] transition-transform duration-300 group-hover:scale-105"
                    }
                    loading="eager"
                  />

                  {featured.coverImage?.url && (
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/35 to-transparent" />
                  )}
                </div>
              </Link>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    onClick={() =>
                      trackNavClick("blog_post", {
                        article_slug: post.slug,
                        cta_location: "blog_grid",
                        destination_url: `/blog/${post.slug}`,
                      })
                    }
                    className="card-float card-accent reveal group flex flex-col overflow-hidden rounded-lg border border-border bg-white"
                    data-reveal-delay={index * 60}
                  >
                    {post.coverImage?.url && (
                      <div className="aspect-[1.91/1] overflow-hidden bg-mist">
                        <img
                          src={post.coverImage.url}
                          alt={post.coverImage.alt ?? post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-7">
                      <div className="mb-4 inline-flex w-fit items-center rounded-full bg-mist px-3 py-1 text-[11px] font-bold tracking-wide text-navy/60">
                        {post.category}
                      </div>

                      <h3 className="text-balance font-display text-lg font-black leading-snug text-navy transition-colors duration-200 group-hover:text-wagreen-dark">
                        {post.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(post.date)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readMins} 分鐘
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="mt-16 rounded-lg bg-mist p-8 text-center md:p-12">
            <h2 className="font-display text-xl font-black text-navy md:text-2xl">
              睇完都搞唔掂？交俾白熊師傅。
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
              DIY 有極限，反覆淤塞多數係喉管深處出事。WhatsApp
              影相俾我哋，免費初步判症。
            </p>

            <div className="mt-6 flex justify-center">
              <WhatsAppButton
                label="WhatsApp 免費判症"
                trackLocation="blog_cta"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
