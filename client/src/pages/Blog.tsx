/**
 * 通渠熊 DrainBear — 通渠小知識（網誌列表頁）
 * Premium SaaS Minimalism：卡片網格、懸浮陰影、8px 圓角
 */
import { Link } from "wouter";
import { CalendarDays, Clock, ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";
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
  description: "通渠熊 DrainBear 專業渠務知識庫：日常防塞喉管實用建議、通渠迷思拆解及緊急應對指南。",
  url: "https://drainbear.manus.space/blog",
  publisher: { "@type": "Plumber", name: "通渠熊 DrainBear" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default function Blog() {
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <div>
      <SEO
        title="通渠小知識｜防塞喉管實用建議・通渠迷思拆解｜通渠熊 DrainBear"
        description="白熊師傅教你日常防塞喉管：廚房防豬油膏、企缸防頭髮淤塞、點解唔好倒通渠水、坐廁塞咗點自救、食肆隔油池保養及村屋沙井雨季檢查。實用渠務知識，慳返通渠費。"
        path="/blog"
        keywords="通渠小知識, 防塞喉管, 通渠水迷思, 坐廁塞自救, 隔油池保養, 沙井檢查, 渠務保養"
        jsonLd={BLOG_JSONLD}
        breadcrumbs={BLOG_CRUMBS}
      />
      <Breadcrumbs items={BLOG_CRUMBS} />
      <section className="bg-gradient-to-b from-mist to-white py-16 md:py-20">
        <div className="container text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-safety">DRAIN CARE TIPS</div>
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
          {/* 精選文章 */}
          <Link
            href={`/blog/${featured.slug}`}
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
              <p className="mt-4 leading-relaxed text-white/60">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-5 text-xs text-white/45">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDate(featured.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {featured.readMins} 分鐘閱讀
                </span>
              </div>
              <span className="btn-smooth mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-wagreen group-hover:gap-2.5">
                閱讀全文 <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="hidden items-center justify-center bg-gradient-to-br from-navy via-navy to-[#16224d] p-10 md:col-span-2 md:flex">
              <img
                src="/manus-storage/drainbear-logo_3d941447.png"
                alt="通渠熊 DrainBear"
                className="h-40 w-40 opacity-90 drop-shadow-[0_12px_36px_rgba(37,211,102,0.25)] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* 文章網格 */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card-float card-accent reveal group flex flex-col rounded-lg border border-border bg-white p-7"
                data-reveal-delay={i * 60}
              >
                <div className="mb-4 inline-flex w-fit items-center rounded-full bg-mist px-3 py-1 text-[11px] font-bold tracking-wide text-navy/60">
                  {p.category}
                </div>
                <h3 className="text-balance font-display text-lg font-black leading-snug text-navy transition-colors duration-200 group-hover:text-wagreen-dark">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(p.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {p.readMins} 分鐘
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-lg bg-mist p-8 text-center md:p-12">
            <h2 className="font-display text-xl font-black text-navy md:text-2xl">
              睇完都搞唔掂？交俾白熊師傅。
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
              DIY 有極限，反覆淤塞多數係喉管深處出事。WhatsApp 影相俾我哋，免費初步判症。
            </p>
            <div className="mt-6 flex justify-center">
              <WhatsAppButton label="WhatsApp 免費判症" trackLocation="blog_cta" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
