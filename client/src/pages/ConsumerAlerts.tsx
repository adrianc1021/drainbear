import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ArrowUpRight, Search, Link2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import SEO from "@/components/SEO";
import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import { SITE_URL, BUSINESS_ID } from "@/config/site";
import {
  ALERT_KINDS,
  ALERT_TOPICS,
  ALERT_SOURCES,
  ALERT_REPORT_COUNT,
  ALERT_OFFICIAL_COUNT,
  CONSUMER_ALERTS,
  CONSUMER_ALERTS_UPDATED,
  CONSUMER_ALERTS_PATH as PATH,
  CONSUMER_ALERTS_TITLE as TITLE,
  CONSUMER_ALERTS_DESCRIPTION,
  OFFICIAL_CONSUMER_RESOURCES,
  filterConsumerAlerts,
} from "@/lib/consumerAlerts";

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "通渠公開資料庫", path: PATH },
];
const chronologicalSources = [...ALERT_SOURCES].sort(
  (a, b) => b.published.localeCompare(a.published) || a.id.localeCompare(b.id)
);
function filterHref(values: {
  q: string;
  kind: string;
  topic: string;
  order: string;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values))
    if (value && !(key === "order" && value === "newest"))
      params.set(key, value);
  return PATH + (params.size ? "?" + params.toString() : "");
}
export default function ConsumerAlerts() {
  const search = useSearch(),
    [, navigate] = useLocation();
  const params = new URLSearchParams(search);
  const filters = {
    q: params.get("q")?.trim() || "",
    kind: ALERT_KINDS.find(value => value === params.get("kind")) || "",
    topic: ALERT_TOPICS.find(value => value === params.get("topic")) || "",
    order: params.get("order") === "oldest" ? "oldest" : "newest",
  };
  const [draft, setDraft] = useState(filters);
  const heading = useRef<HTMLHeadingElement>(null),
    previousSearch = useRef(search);
  const records = filterConsumerAlerts(filters);
  useEffect(() => {
    setDraft(filters);
    if (previousSearch.current !== search) {
      previousSearch.current = search;
      requestAnimationFrame(() => {
        heading.current?.focus({ preventScroll: true });
        heading.current?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      });
    }
    const reveal = () => {
      const hash = window.location.hash.slice(1);
      const record = CONSUMER_ALERTS.find(item => "record-" + item.id === hash);
      if (!record) return;
      if (!records.some(item => item.id === record.id)) {
        navigate(PATH + "#" + hash, { replace: true });
        return;
      }
      requestAnimationFrame(() => {
        const target = document.getElementById(hash);
        if (target instanceof HTMLDetailsElement) {
          target.open = true;
          const content = target.lastElementChild;
          if (content instanceof HTMLElement) content.inert = false;
          target.scrollIntoView({ behavior: "instant", block: "start" });
        }
      });
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
    // URL parameters are the committed filter state; drafts apply on submit.
  }, [search, navigate]);
  function submit(event: FormEvent) {
    event.preventDefault();
    navigate(filterHref(draft));
  }
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": SITE_URL + PATH + "#collection",
    url: SITE_URL + PATH,
    name: TITLE,
    description: CONSUMER_ALERTS_DESCRIPTION,
    inLanguage: "zh-Hant-HK",
    dateModified: CONSUMER_ALERTS_UPDATED,
    publisher: { "@id": BUSINESS_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: CONSUMER_ALERTS.length,
      itemListElement: CONSUMER_ALERTS.map((record, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: record.title,
          url: SITE_URL + PATH + "#record-" + record.id,
          description: record.summary,
          citation: record.sourceIds.map(
            id => ALERT_SOURCES.find(source => source.id === id)!.url
          ),
        },
      })),
    },
  };
  return (
    <div className="consumer-database">
      <SEO
        title={TITLE + "｜通渠熊"}
        description={CONSUMER_ALERTS_DESCRIPTION}
        path={PATH}
        breadcrumbs={crumbs}
        jsonLd={collection}
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
      />
      <div className="consumer-database__intro">
        <Breadcrumbs items={crumbs} />
        <header className="container">
          <h1>
            <span>通渠黑店相關</span>
            <span>公開資料庫</span>
          </h1>
          <p>搜尋事件、核對來源，集中查閱通渠收費及服務爭議。</p>
          <p className="consumer-database__scope">
            <span>通渠熊編輯整理，非官方黑名單。</span>
            <a href="#collection-method">收錄方法</a>
          </p>
        </header>
      </div>
      <section
        className="container consumer-database__register"
        aria-labelledby="records-heading"
      >
        <p className="consumer-database__provenance">
          {ALERT_REPORT_COUNT} 篇相關報道 · {ALERT_OFFICIAL_COUNT} 篇官方資料 ·{" "}
          {CONSUMER_ALERTS.length} 組紀錄 · 核對{" "}
          <time dateTime={CONSUMER_ALERTS_UPDATED}>
            {CONSUMER_ALERTS_UPDATED}
          </time>
        </p>
        <AnimatedDisclosure
          id="report-sources"
          title={`逐篇查閱報道及官方資料（${ALERT_SOURCES.length} 篇）`}
          description="報道、專欄與轉載分別標示；每篇可閱讀原文及查看相關紀錄。"
        >
          <ol className="consumer-database__sources">
            {chronologicalSources.map(source => (
              <li
                key={source.id}
                id={`source-${source.id}`}
                data-consumer-source={source.id}
              >
                <a href={source.url}>
                  {source.title}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <p>
                  {source.publisher} · {source.sourceType} ·{" "}
                  <time dateTime={source.published}>
                    {source.publishedLabel}
                  </time>
                </p>
                {source.summary ? <p>{source.summary}</p> : null}
                {source.note ? <p>{source.note}</p> : null}
                {CONSUMER_ALERTS.filter(record =>
                  record.sourceIds.includes(source.id)
                ).map(record => (
                  <p key={record.id}>
                    <a href={PATH + "#record-" + record.id}>
                      相關紀錄：{record.title}
                    </a>
                  </p>
                ))}
              </li>
            ))}
          </ol>
        </AnimatedDisclosure>
        <form
          className="consumer-database__filters"
          onSubmit={submit}
          role="search"
          aria-label="搜尋通渠公開紀錄"
        >
          <label className="consumer-database__query">
            關鍵字
            <span>
              <Search aria-hidden="true" size={18} />
              <input
                type="search"
                name="q"
                value={draft.q}
                onChange={event =>
                  setDraft({ ...draft, q: event.target.value })
                }
                placeholder="例如：18000、東張、售後"
                maxLength={120}
              />
            </span>
          </label>
          <label>
            資料分類
            <select
              name="kind"
              value={draft.kind}
              onChange={event =>
                setDraft({ ...draft, kind: event.target.value })
              }
            >
              <option value="">全部分類</option>
              {ALERT_KINDS.map(kind => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
          </label>
          <label>
            爭議類型
            <select
              name="topic"
              value={draft.topic}
              onChange={event =>
                setDraft({ ...draft, topic: event.target.value })
              }
            >
              <option value="">全部類型</option>
              {ALERT_TOPICS.map(topic => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </label>
          <label>
            排列
            <select
              name="order"
              value={draft.order}
              onChange={event =>
                setDraft({ ...draft, order: event.target.value })
              }
            >
              <option value="newest">較新在前</option>
              <option value="oldest">較舊在前</option>
            </select>
          </label>
          <button type="submit">搜尋資料</button>
        </form>

        <nav className="consumer-database__quick" aria-label="常用爭議篩選">
          {(["臨場加價", "售後跟進", "身份疑問"] as const).map(topic => (
            <Link
              key={topic}
              href={filterHref({ q: "", kind: "", topic, order: "newest" })}
            >
              {topic}
            </Link>
          ))}
          <Link href={PATH}>清除篩選</Link>
        </nav>
        <div className="consumer-database__result-bar">
          <h2 id="records-heading" ref={heading} tabIndex={-1}>
            公開紀錄
          </h2>
          <p role="status" aria-live="polite">
            顯示 {records.length}／{CONSUMER_ALERTS.length} 組
          </p>
        </div>
        {!records.length ? (
          <div className="consumer-database__empty">
            <h3>未找到相符紀錄</h3>
            <p>
              試試其他字眼，或清除分類與類型。未收錄不代表商戶沒有爭議；收錄亦不等於違法。
            </p>
            <Link href={PATH}>查看全部紀錄</Link>
          </div>
        ) : null}
        <div className="consumer-database__records">
          {records.map(record => {
            const sources = record.sourceIds.map(
              id => ALERT_SOURCES.find(source => source.id === id)!
            );
            return (
              <article key={record.id} data-consumer-record={record.id}>
                <div className="consumer-database__record-meta">
                  <span>{record.kind}</span>
                  <time dateTime={record.published}>{record.dateLabel}</time>
                </div>
                <h3>{record.title}</h3>
                <p className="consumer-database__status">
                  資料性質：{record.status}
                </p>
                <p className="consumer-database__summary">{record.summary}</p>
                <ul className="consumer-database__topics" aria-label="爭議類型">
                  {record.topics.map(topic => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <div className="consumer-database__record-actions">
                  <a href={sources[0].url}>
                    閱讀{sources[0].publisher}原文{" "}
                    <ArrowUpRight aria-hidden="true" size={17} />
                  </a>
                  <a href={PATH + "#record-" + record.id}>
                    <Link2 aria-hidden="true" size={16} />
                    此筆連結
                  </a>
                </div>
                <AnimatedDisclosure
                  id={"record-" + record.id}
                  title={`資料、回應及來源（${sources.length}）`}
                >
                  <dl>
                    <div>
                      <dt>報道中的身份</dt>
                      <dd>{record.identity}</dd>
                    </div>
                    <div>
                      <dt>事件資料</dt>
                      <dd>{record.details}</dd>
                    </div>
                    <div>
                      <dt>回應及後續</dt>
                      <dd>{record.response}</dd>
                    </div>
                    <div>
                      <dt>核對範圍</dt>
                      <dd>{record.scope}</dd>
                    </div>
                  </dl>
                  <h4>原始及相關來源</h4>
                  <ul className="consumer-database__sources">
                    {sources.map(source => (
                      <li key={source.id}>
                        <a href={source.url}>
                          {source.title}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                        <p>
                          {source.publisher} · {source.sourceType} ·{" "}
                          <time dateTime={source.published}>
                            {source.publishedLabel}
                          </time>
                        </p>
                        {source.summary ? <p>{source.summary}</p> : null}
                        {source.note ? <p>{source.note}</p> : null}
                      </li>
                    ))}
                  </ul>
                </AnimatedDisclosure>
              </article>
            );
          })}
        </div>
      </section>
      <section
        id="collection-method"
        className="consumer-database__method"
        aria-labelledby="collection-method-heading"
      >
        <div className="container">
          <h2 id="collection-method-heading">資料點樣收錄？</h2>
          <ul>
            <li>
              先閱讀可開啟的原文，再寫摘要；區分官方紀錄、消委會投訴與傳媒轉述。
            </li>
            <li>
              報道篇數包含不同平台的專欄及轉載，並非全部獨立採訪。同一事件歸組，相關專欄另標資料性質；紀錄數不等於商戶、受害人或罪成個案數。
            </li>
            <li>
              保留原發布日期及當事人回應。匿名、暱稱或部分遮蔽名稱不補全，不因同姓就合併身份。
            </li>
            <li>金額屬歷史個案；沒有公開裁決的紀錄，不寫成已證實違法。</li>
          </ul>
          <p>
            本庫由通渠熊編輯人工核對，並非即時或完整的全港名單。補充來源、更正或當事人回應，可附此筆連結及原始文件，透過
            <Link href="/about#company-facts">網站聯絡方式</Link>
            交予編輯核對；來稿不會自動公開。
          </p>
          <h2>官方資料與求助</h2>
          <ul className="consumer-database__official">
            {OFFICIAL_CONSUMER_RESOURCES.map(resource => (
              <li key={resource.url}>
                <a href={resource.url}>
                  {resource.label}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <p>{resource.description}</p>
              </li>
            ))}
          </ul>
          <p className="consumer-database__further">
            <Link href="/blog/drain-company-reviews-red-flags">
              閱讀通渠防騙與報價核對清單
            </Link>
            <Link href="/blog/choosing-professional-drain-company">
              了解如何比較通渠公司
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
