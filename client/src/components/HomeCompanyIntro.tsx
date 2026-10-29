import SectionIllustration from "@/components/SectionIllustration";
import { STARTING_PRICE_LINE } from "../../../shared/pricing";
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
            香港通渠公司，
            <br />
            由家居到物業。
          </h2>
          <p className="home-company-intro__lead">
            通渠熊 DrainBear
            提供香港通渠服務，處理住宅坐廁塞、洗手盆及鋅盤去水慢、浴室積水，以及食肆排水、物業主渠與沙井淤塞。
          </p>
          <p>
            想搵通渠公司格價，先傳地區、受影響位置及相片。我們會了解堵塞範圍與施工入口，確認方法及收費後才動工，完成後按工作範圍測試去水。
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
      <div className="container home-company-intro__details">
        <section aria-labelledby="company-home-services">
          <span className="home-company-intro__number" aria-hidden="true">
            01 ／ 服務範圍
          </span>
          <h3 id="company-home-services">家居、食肆、物業，各有處理重點。</h3>
          <SectionIllustration scene="services" />
          <p>
            通渠熊 DrainBear
            是提供香港渠務服務的品牌。家居常見的坐廁淤塞、廚房鋅盤去水慢、浴室地台積水，以至污水倒灌，都可以向我們查詢。食肆及物業方面，服務包括隔油池清理、主渠沙井處理、高壓洗渠及
            CCTV 照渠檢測。
          </p>
          <p>
            我們會先了解是一個去水位出問題，還是多個位置同時受影響，再按管道、入口及現場條件選擇工具。機械疏通處理局部淤塞，高壓清洗用於適合清理的管段；CCTV
            則協助查看鏡頭可到達位置的管內情況，找出值得進一步檢查的地方。
          </p>
          <Link href="/services">
            查看各項通渠服務 <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
        <section aria-labelledby="company-home-coverage">
          <span className="home-company-intro__number" aria-hidden="true">
            02 ／ 地區與查詢
          </span>
          <h3 id="company-home-coverage">服務香港，24 小時接受查詢。</h3>
          <SectionIllustration scene="village" />
          <p>
            我們接受港島、九龍、新界及離島的通渠查詢，服務對象包括住宅住戶、食肆、商舖及物業管理。透過電話或
            WhatsApp
            提供所在地區、受影響位置及現場相片，就可以先交代問題；有倒灌或去水異常的短片，亦可一併傳送。
          </p>
          <p>
            團隊會按交通、人手、所需設備及進場條件確認上門時間。村屋、離島、商場或需要管理處協調的地方，查詢時一併提供入口、搬運及可進場時段，方便安排工序。
          </p>
          <Link href="/areas">
            查看服務地區 <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
        <section aria-labelledby="company-home-process">
          <span className="home-company-intro__number" aria-hidden="true">
            03 ／ 收費與工序
          </span>
          <h3 id="company-home-process">
            {STARTING_PRICE_LINE}，確認後才動工。
          </h3>
          <SectionIllustration scene="quote" />
          <p>
            收費按堵塞範圍、施工入口、是否需要拆裝及使用的工具確認。到場了解情況後，我們會說明處理方法與報價，雙方確認後才開始施工，讓客人知道今次會處理哪些位置和工序。
          </p>
          <p>
            完成後按工作範圍進行試水或排水測試，交代處理情況。如涉及隱藏管段、共用主渠或需要額外檢查的位置，亦會說明後續安排，方便住戶、業主或管理處跟進。
          </p>
          <Link href="/service-process">
            查看完整上門流程 <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
        <section aria-labelledby="company-home-records">
          <span className="home-company-intro__number" aria-hidden="true">
            04 ／ 施工紀錄
          </span>
          <h3 id="company-home-records">由現場問題，到處理與試水。</h3>
          <SectionIllustration scene="waterTest" />
          <p>
            了解一間通渠公司，可以由實際工序開始。通渠熊網站公開現場施工影片及案例，讓客人查詢前了解不同堵塞情況，以及清理、檢查和測試的做法。
          </p>
          <p>
            例如
            <Link href="/cases/home-basin-grease-buildup-cleaning">
              洗手盆油垢清理紀錄
            </Link>
            ，展示積聚物處理及試水；
            <Link href="/cases/school-rainwater-drain-high-pressure-cleaning">
              學校雨水渠高壓清洗紀錄
            </Link>
            則交代清洗與排水測試。各項紀錄按實際工程內容呈現，方便你了解與自己情況相關的服務。
          </p>
          <Link href="/cases">
            查看施工案例與影片 <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
      </div>
    </section>
  );
}
