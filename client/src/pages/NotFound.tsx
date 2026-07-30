import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [location, setLocation] = useLocation();

  const currentPath =
    location && location.startsWith("/") ? location : "/404";

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <>
      <SEO
        title="找不到頁面｜通渠熊"
        description="你瀏覽的頁面不存在、已經移除或網址輸入錯誤。"
        path={currentPath}
        noindex
      />

      <main className="flex min-h-[70vh] w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="mx-4 w-full max-w-lg border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardContent className="pb-8 pt-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-100" />
                <AlertCircle className="relative h-16 w-16 text-red-500" />
              </div>
            </div>

            <h1 className="mb-2 text-4xl font-bold text-slate-900">
              404
            </h1>

            <h2 className="mb-4 text-xl font-semibold text-slate-700">
              找不到頁面
            </h2>

            <p className="mb-8 leading-relaxed text-slate-600">
              你瀏覽的頁面不存在、已經移除，
              <br />
              或者網址輸入錯誤。
            </p>

            <div className="flex justify-center">
              <Button
                onClick={handleGoHome}
                className="rounded-lg bg-navy px-6 py-2.5 text-white shadow-md transition-all duration-200 hover:bg-navy-light hover:shadow-lg"
              >
                <Home className="mr-2 h-4 w-4" />
                返回首頁
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
