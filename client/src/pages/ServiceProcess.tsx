import { BRAND_SOCIAL_IMAGE, BRAND_SOCIAL_ALT } from "@/lib/brandVisuals";
import AnimatedDisclosure from "@/components/AnimatedDisclosure";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EditorialPageHero } from "@/components/editorial/SiteEditorial";
import InquiryContactPanel from "@/components/InquiryContactPanel";
import ProcessIllustration from "@/components/ProcessIllustration";
import SEO from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const CRUMBS = [
  { name: "首頁", path: "/" },
  { name: "上門服務流程", path: "/service-process" },
];
const PROCESS = [
  {
    title: "傳相片同地區",
    summary: "講低邊度塞、有冇倒灌。",
    detail:
      "提供大概地區、受影響位置、問題開始時間，以及安全情況下拍攝的相片或短片。完整地址留待安排上門時提供。",
  },
  {
    title: "確認上門時間",
    summary: "按現場需要安排工具同人手。",
    detail:
      "按資料了解處理方向，再確認可安排時間。上門時間視乎地區、交通、人手及設備；提供相片不等於已完成預約。",
  },
  {
    title: "檢查後確認方案",
    summary: "現場確認方法及報價才動工。",
    detail:
      "師傅檢查喉口、堵塞位置及施工條件，說明處理方法與個別報價。雙方確認後才動工；如需要額外工序，先與你確認。",
  },
  {
    title: "疏通同測試去水",
    summary: "完成後交代結果及後續建議。",
    detail:
      "完成已確認工序後測試排水、整理施工位置，說明結果及仍需留意的問題。如需要檢查或維修，會交代原因。",
  },
];
const METHODS = [
  {
    title: "機械疏通",
    purpose: "處理較集中的堵塞",
    suitable: "異物、紙巾或頭髮造成的局部堵塞。",
    limitation: "恢復去水，不等於整段管壁已清潔。",
    href: "/services/toilet-unblocking",
  },
  {
    title: "高壓水槍清洗",
    purpose: "清理管壁油脂及沉積物",
    suitable: "油脂、淤泥或長距離喉管反覆積垢。",
    limitation: "施工前要評估管道狀況、入口及排污條件。",
    href: "/services/high-pressure-jetting",
  },
  {
    title: "CCTV 照喉",
    purpose: "檢查問題位置及管內情況",
    suitable: "反覆淤塞、位置不明或懷疑喉管破損。",
    limitation: "屬於檢查工序；視線會受積水、急彎及污物影響。",
    href: "/services/cctv-drain-inspection",
  },
];
export default function ServiceProcess() {
  return (
    <div>
      <SEO
        image={BRAND_SOCIAL_IMAGE}
        imageAlt={BRAND_SOCIAL_ALT}
        title="上門通渠服務流程｜現場檢查、疏通及完工測試｜通渠熊"
        description="由傳相片、確認上門，到現場檢查、疏通及去水測試，了解通渠熊四個服務階段及上門前準備。"
        path="/service-process"
        breadcrumbs={CRUMBS}
      />
      <div className="site-hero-shell">
        <Breadcrumbs items={CRUMBS} tone="dark" />
        <EditorialPageHero
          kicker="上門服務流程"
          title="由查詢到完工，一步步處理。"
          description="傳相片同地區，先了解點處理。"
          contactLocation="serviceprocess_hero"
        />
      </div>
      <section className="brand-section" aria-labelledby="process-heading">
        <div className="container">
          <p className="brand-eyebrow">四個服務階段</p>
          <h2 id="process-heading">上門與處理安排</h2>
          <ol className="process-visual-grid">
            {PROCESS.map((item, index) => (
              <li key={item.title}>
                <ProcessIllustration step={index} />
                <div className="process-visual-grid__copy">
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
              </li>
            ))}
          </ol>
          <AnimatedDisclosure id="process-stage-details" title="了解各階段詳情">
            <ol className="process-detail-list">
              {PROCESS.map(item => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ol>
          </AnimatedDisclosure>
        </div>
      </section>
      <section
        className="brand-section brand-section--soft"
        aria-labelledby="process-prepare-heading"
      >
        <div className="container process-reading-layout">
          <div>
            <p className="brand-eyebrow">上門前準備</p>
            <h2 id="process-prepare-heading">留好喉口位置，講低現場情況。</h2>
            <p className="brand-section-description">
              曾用通渠水、拆過喉，或多個位置同時倒灌，請先告知師傅。
            </p>
            <Link className="process-area-link" href="/areas">
              查看服務地區
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div>
            <AnimatedDisclosure
              id="process-before-visit"
              title="現場要準備甚麼？"
            >
              <ul className="process-checklist">
                <li>拍攝受影響位置，避免直接接觸污水。</li>
                <li>說明問題何時開始、有沒有倒灌。</li>
                <li>告知是否曾使用通渠水或拆喉。</li>
                <li>確認現場聯絡人、進場方式及方便上門的時段。</li>
              </ul>
            </AnimatedDisclosure>
            <AnimatedDisclosure
              id="process-confirmation"
              title="動工前確認哪些安排？"
            >
              <ul className="process-checklist">
                <li>處理方法、施工範圍及個別報價。</li>
                <li>需要使用的喉口、工具及施工時段。</li>
                <li>現場清理、去水測試及完成後交代。</li>
              </ul>
            </AnimatedDisclosure>
            <AnimatedDisclosure
              id="process-methods"
              title="疏通、清洗與照喉有甚麼分別？"
            >
              <div className="process-methods">
                {METHODS.map(method => (
                  <article key={method.title}>
                    <h3>
                      <Link href={method.href}>
                        {method.title}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </h3>
                    <p>
                      <strong>{method.purpose}</strong>
                    </p>
                    <p>{method.suitable}</p>
                    <p>{method.limitation}</p>
                  </article>
                ))}
              </div>
            </AnimatedDisclosure>
          </div>
        </div>
      </section>
      <section className="brand-section">
        <div className="container">
          <InquiryContactPanel
            location="service_process_footer"
            chooseCustomer
            title="想安排上門？先提供現場資料。"
          />
        </div>
      </section>
    </div>
  );
}
