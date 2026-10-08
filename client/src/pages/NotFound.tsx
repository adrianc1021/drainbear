import SEO from "@/components/SEO";
import { FileQuestion, Home, Wrench } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <SEO
        title="找不到頁面｜通渠熊"
        description="您瀏覽的頁面不存在、已經移除或網址輸入錯誤。"
        path="/404"
        noindex
      />

      <div className="brand-status-page">
        <section className="brand-status-page__inner">
          <div className="brand-status-page__card">
            <div className="brand-status-page__marker" aria-hidden="true">
              <FileQuestion />
            </div>
            <p className="brand-eyebrow">ERROR 404</p>
            <h1>找不到頁面</h1>
            <p className="brand-status-page__copy">
              您瀏覽的頁面不存在、已經移除，或網址輸入錯誤。
            </p>
            <nav
              className="brand-status-page__actions"
              aria-label="找不到頁面選項"
            >
              <Link
                href="/"
                className="brand-status-page__action brand-status-page__action--primary"
              >
                <Home aria-hidden="true" />
                返回首頁
              </Link>
              <Link href="/services" className="brand-status-page__action">
                <Wrench aria-hidden="true" />
                查看主要服務
              </Link>
            </nav>
          </div>
        </section>
      </div>
    </>
  );
}
