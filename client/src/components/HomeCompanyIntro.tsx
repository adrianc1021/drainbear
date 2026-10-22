import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function HomeCompanyIntro() {
  return (
    <section
      className="home-company-intro"
      aria-labelledby="home-company-heading"
      id="home-company"
    >
      <div className="container home-company-intro__layout">
        <div className="home-company-intro__art" aria-hidden="true">
          <div className="home-company-intro__pipe" />
          <img
            src="/images/drainbear-logo-192.webp"
            width={192}
            height={192}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="home-company-intro__wordmark">
            DRAIN
            <br />
            BEAR<span>香港渠務</span>
          </span>
          <span className="home-company-intro__art-footer">
            住宅 ／ 食肆 ／ 物業
          </span>
        </div>
        <div className="home-company-intro__copy">
          <p className="home-company-intro__eyebrow">認識通渠熊 DrainBear</p>
          <h2 id="home-company-heading">
            由家居去水，
            <br />
            到物業渠務。
          </h2>
          <p className="home-company-intro__lead">
            通渠熊為香港住宅、食肆及物業提供渠務服務。坐廁、鋅盤、浴室以至主渠沙井，都由現場情況出發，安排合適處理。
          </p>
          <p>
            我們先了解堵塞位置與施工入口，說明方法及收費，確認後才動工。完成後按工作範圍測試去水，將處理過程交代清楚。
          </p>
          <div
            className="home-company-intro__principles"
            aria-label="服務流程重點"
          >
            <span>了解問題</span>
            <span>確認報價</span>
            <span>施工試水</span>
          </div>
          <nav aria-label="通渠熊公司與施工資料">
            <Link
              href="/about#company-facts"
              className="home-company-intro__primary"
            >
              公司背景與聯絡資料 <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/cases">
              睇施工紀錄 <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/service-process">
              了解工序 <ArrowUpRight aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
