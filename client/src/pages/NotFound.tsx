import SEO from "@/components/SEO";
import { FileQuestion, Home, Wrench } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function NotFound() {
  const [location] = useLocation();

  const currentPath = location && location.startsWith("/") ? location : "/404";

  return (
    <>
      <SEO
        title="找不到頁面｜通渠熊"
        description="你瀏覽的頁面不存在、已經移除或網址輸入錯誤。"
        path={currentPath}
        noindex
      />

      <main className="stage6a-not-found">
        <section className="stage6a-not-found__hero">
          <div className="stage6a-not-found__inner">
            <div className="stage6a-not-found__marker" aria-hidden="true">
              <FileQuestion />
            </div>
            <p className="site-editorial-kicker">
              <span aria-hidden="true" />
              ERROR 404
            </p>
            <h1>找不到頁面</h1>
            <p className="stage6a-not-found__copy">
              你瀏覽的頁面不存在、已經移除，或網址輸入錯誤。
            </p>
            <nav
              className="stage6a-not-found__actions"
              aria-label="找不到頁面選項"
            >
              <Link
                href="/"
                className="stage6a-not-found__action stage6a-not-found__action--primary"
              >
                <Home aria-hidden="true" />
                返回首頁
              </Link>
              <Link
                href="/services"
                className="stage6a-not-found__action stage6a-not-found__action--secondary"
              >
                <Wrench aria-hidden="true" />
                查看主要服務
              </Link>
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
