import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import { WhatsAppButton } from "@/components/Layout";
import SEO from "@/components/SEO";
import ServiceIllustration from "@/components/ServiceIllustration";
import { trackNavClick } from "@/lib/analytics";
import { useBlogPosts } from "@/lib/useBlog";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "通渠小知識", path: "/blog" },
];
const PAGE_SIZE = 6;
const CATEGORY_ART: Record<string, string> = {
  家居防塞: "kitchen-sink-unblocking",
  緊急應對: "sewage-backflow",
  通渠迷思: "toilet-unblocking",
  商業渠務: "grease-trap-cleaning",
  村屋渠務: "main-drain-manhole",
  大廈渠務: "main-drain-manhole",
  渠務科技: "cctv-drain-inspection",
};
function articleArt(title: string, category: string) {
  const matches: [RegExp, string][] = [
    [/隔油|食肆/, "grease-trap-cleaning"],
    [/CCTV|照喉|內窺/i, "cctv-drain-inspection"],
    [/高壓/, "high-pressure-jetting"],
    [/沙井|主渠|大廈|渠口/, "main-drain-manhole"],
    [/倒灌|污水/, "sewage-backflow"],
    [/浴室|企缸|漏水|滲漏/, "bathroom-drain-unblocking"],
    [/坐廁|廁所/, "toilet-unblocking"],
    [/鋅盤|洗手盆|廚房/, "kitchen-sink-unblocking"],
  ];
  return (
    matches.find(([pattern]) => pattern.test(title))?.[1] ||
    CATEGORY_ART[category] ||
    "cctv-drain-inspection"
  );
}
function excerpt(text: string) {
  const first = text.split(/[。！？]/)[0];
  return first.length > 58 ? first.slice(0, 58) + "…" : first + "。";
}
export default function Blog() {
  const { posts, isLoading, isFallback, error } = useBlogPosts();
  const search = useSearch(),
    [, navigate] = useLocation();
  const params = new URLSearchParams(search),
    q = params.get("q")?.trim() || "",
    category = params.get("category") || "";
  const [draft, setDraft] = useState(q),
    heading = useRef<HTMLHeadingElement>(null),
    previousSearch = useRef(search);
  useEffect(() => {
    setDraft(q);
    if (previousSearch.current !== search) {
      previousSearch.current = search;
      const frame = requestAnimationFrame(() => {
        heading.current?.focus({ preventScroll: true });
        heading.current?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [q, search]);
  const categories = Array.from(new Set(posts.map(p => p.category)));
  const filtered = posts.filter(
    p =>
      (!category || p.category === category) &&
      (!q ||
        `${p.title} ${p.excerpt} ${p.category} ${p.keywords.join(" ")}`
          .toLocaleLowerCase()
          .includes(q.toLocaleLowerCase()))
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const raw = Number(params.get("page") || 1),
    page = Math.min(pages, Number.isSafeInteger(raw) && raw > 0 ? raw : 1);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function href(nextPage: number, nextCategory = category, nextQuery = q) {
    const next = new URLSearchParams();
    if (nextQuery) next.set("q", nextQuery);
    if (nextCategory) next.set("category", nextCategory);
    if (nextPage > 1) next.set("page", String(nextPage));
    return "/blog" + (next.size ? "?" + next.toString() : "");
  }
  return (
    <div
      className="blog-page"
      data-cms-loading={isLoading}
      data-cms-error={Boolean(error)}
    >
      <SEO
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
        title="通渠小知識｜防塞喉管實用建議・通渠迷思拆解｜通渠熊 DrainBear"
        description="按家居防塞、緊急處理、食肆及物業需要，搜尋通渠熊的實用渠務文章與檢查指南。"
        path="/blog"
        breadcrumbs={CRUMBS}
        contentReady={!isLoading}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "通渠小知識",
          url: "https://drainbearhk.com/blog",
          publisher: { "@id": "https://drainbearhk.com/#organization" },
        }}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          kicker="實用文章"
          title="通渠小知識"
          description="搵你遇到嘅問題，睇需要嘅處理方法。"
          contactLocation="blog_hero"
        />
      </div>
      <section className="brand-section" aria-labelledby="blog-results-heading">
        <div className="container">
          <form
            className="blog-search"
            role="search"
            onSubmit={event => {
              event.preventDefault();
              navigate(href(1, category, draft.trim()));
            }}
          >
            <label htmlFor="blog-query">搜尋渠務問題</label>
            <div>
              <input
                id="blog-query"
                type="search"
                value={draft}
                onChange={event => setDraft(event.target.value)}
                placeholder="例如：鋅盤、倒灌、隔油池"
              />
              <button type="submit">
                <Search aria-hidden="true" />
                搜尋
              </button>
            </div>
          </form>
          <div className="blog-categories" role="group" aria-label="文章分類">
            {["", ...categories].map(item => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => navigate(href(1, item))}
              >
                {item || "全部文章"}
              </button>
            ))}
          </div>
          <div className="blog-results-heading">
            <h2 id="blog-results-heading" ref={heading} tabIndex={-1}>
              找到 {filtered.length} 篇文章
            </h2>
            <p role="status">
              第 {page}／{pages} 頁
            </p>
          </div>
          {isLoading ? <p role="status">正在載入文章…</p> : null}
          {isFallback && error ? (
            <p role="status">最新文章暫時未能載入，先顯示既有文章。</p>
          ) : null}
          {shown.length ? (
            <div className="blog-reading-grid">
              {shown.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="blog-reading-card"
                  onClick={() =>
                    trackNavClick("blog_post", {
                      article_slug: post.slug,
                      cta_location: "blog_grid",
                      destination_url: `/blog/${post.slug}`,
                    })
                  }
                >
                  {post.coverImage?.url?.startsWith("/images/blog/") ? (
                    <img
                      className="blog-reading-card__image"
                      src={post.coverImage.url}
                      srcSet={post.coverImage.srcSet}
                      sizes="(max-width: 639px) 96px, (max-width: 1023px) 45vw, 360px"
                      alt={post.coverImage.alt || post.title}
                      width={post.coverImage.width}
                      height={post.coverImage.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <ServiceIllustration
                      slug={articleArt(post.title, post.category)}
                    />
                  )}
                  <div>
                    <p className="brand-eyebrow">{post.category}</p>
                    <h3>{post.title}</h3>
                    <p className="blog-reading-card__summary">
                      {excerpt(post.excerpt)}
                    </p>
                    <span className="blog-reading-card__meta">
                      {post.readMins} 分鐘閱讀 <ArrowRight aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <p>暫時找不到相關文章，試試「去水慢」或其他位置。</p>
              <Link href="/blog">查看全部文章</Link>
            </div>
          )}
          {pages > 1 ? (
            <nav className="blog-pagination" aria-label="文章分頁">
              {Array.from({ length: pages }, (_, i) => (
                <Link
                  key={i}
                  href={href(i + 1)}
                  aria-label={`第 ${i + 1} 頁`}
                  aria-current={page === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </Link>
              ))}
            </nav>
          ) : null}
          <AnimatedDisclosure
            id="blog-article-directory"
            title={`全部文章目錄（${posts.length} 篇）`}
            className="blog-article-directory"
          >
            <nav aria-label="全部渠務文章">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  {post.title}
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </AnimatedDisclosure>
          <div className="site-editorial-callout">
            <h2>問題仍未解決？</h2>
            <p>傳現場相片及地區，先了解點處理。</p>
            <WhatsAppButton label="WhatsApp 查詢" trackLocation="blog_cta" />
          </div>
        </div>
      </section>
    </div>
  );
}
