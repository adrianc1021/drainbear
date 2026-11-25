import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { STARTING_PRICE_LINE } from "../../../shared/pricing";
import { getServiceVisual } from "@/lib/serviceVisuals";

const problems = [
  {
    label: "鋅盤積水，洗碗後去水慢",
    service: "鋅盤通渠",
    slug: "kitchen-sink-unblocking",
  },
  {
    label: "洗手盆去水慢，浴室地渠積水",
    service: "浴室通渠",
    slug: "bathroom-drain-unblocking",
  },
  {
    label: "食肆隔油池積油，排水變慢",
    service: "隔油池清理",
    slug: "grease-trap-cleaning",
  },
  { label: "幾個去水位一齊湧水", service: "污水倒灌", slug: "sewage-backflow" },
] as const;

const workPhoto = getServiceVisual("kitchen-sink-unblocking");

export default function HomeCompanyIntro() {
  return (
    <section
      className="home-company-intro"
      id="home-company"
      aria-labelledby="home-company-heading"
    >
      <div className="container">
        <div className="home-company-intro__layout">
          <div>
            <h2 id="home-company-heading">邊個位置塞咗？</h2>
            <p className="home-company-intro__lead" id="company-home-services">
              通渠熊為香港住宅、食肆同物業處理坐廁、鋅盤、地渠同主渠淤塞。報價前可以先講邊度去水慢、其他去水位有冇一齊受影響，方便師傅收窄要檢查嘅範圍。
            </p>
            <nav
              aria-label="按淤塞位置查看通渠服務"
              className="home-company-intro__index"
            >
              {problems.map(problem => (
                <Link key={problem.slug} href={`/services/${problem.slug}`}>
                  <span>{problem.label}</span>
                  <span className="home-company-intro__destination">
                    {problem.service} <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </nav>
            <Link href="/services" className="home-company-intro__text-link">
              查看全部通渠服務
            </Link>
          </div>
          <figure
            className="home-company-intro__record"
            id="company-home-records"
          >
            <img
              src={workPhoto.src}
              alt={workPhoto.alt}
              width={540}
              height={960}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <h3>櫃底去水喉點樣處理？</h3>
              <p>呢段現場片影到師傅喺櫃底操作線材，下面放咗容器接水。</p>
              <Link href="/cases/under-sink-drain-line-operation">
                睇 7 秒施工片段 <ArrowRight aria-hidden="true" />
              </Link>
            </figcaption>
          </figure>
        </div>
        <div className="home-company-intro__notes">
          <section id="company-home-process">
            <h3>揀通渠公司，上門前點樣格價？</h3>
            <p>
              {STARTING_PRICE_LINE}
              。先問清上門檢查、拆裝同試水包唔包括在內。師傅到場確認入口同堵塞範圍後，會講明工序同收費，等你確認先動工。
            </p>
            <Link href="/blog/choosing-professional-drain-company">
              揀通渠公司：報價同施工紀錄點比較
            </Link>
          </section>
          <section id="company-home-coverage">
            <h3>屋苑、食肆點安排上門？</h3>
            <p>
              港島、九龍、新界及離島均接受查詢。傳相時一併講低地區、入口位置、管理處准許施工嘅時段，方便確認人手、設備同到場時間。
            </p>
            <Link href="/areas">查看服務地區</Link>
          </section>
        </div>
        <nav
          className="home-company-intro__sources"
          aria-label="公司資料及完工紀錄"
        >
          <Link href="/about#company-facts">公司背景與聯絡資料</Link>
          <Link href="/cases/home-basin-grease-buildup-cleaning">
            洗手盆拆喉清理與試水紀錄
          </Link>
          <Link href="/cases/school-rainwater-drain-high-pressure-cleaning">
            學校雨水渠高壓清洗紀錄
          </Link>
          <Link href="/cases">按工程紀錄比較處理方法</Link>
        </nav>
      </div>
    </section>
  );
}
