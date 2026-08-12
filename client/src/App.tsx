import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { EstimateProvider } from "./contexts/EstimateContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initAnalytics, trackPageView } from "./lib/analytics";

const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Areas = lazy(() => import("./pages/Areas"));
const District = lazy(() => import("./pages/District"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Guide = lazy(() => import("./pages/GuideRoute"));
const Thanks = lazy(() => import("./pages/Thanks"));
const NotFound = lazy(() => import("./pages/NotFound"));

initAnalytics();

function PageViewTracker() {
  const [location] = useLocation();

  useEffect(() => {
    // 包括首次載入；gtag config 已設 send_page_view:false。
    // 稍候 SEO effect 寫入 title 後才送出。
    const id = window.setTimeout(() => trackPageView(location), 150);

    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}

function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[55vh] items-center justify-center bg-white"
    >
      <span className="text-sm font-medium text-navy/60">載入中…</span>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/services/:slug" component={ServiceDetail} />
          <Route path="/guide" component={Guide} />
          <Route path="/areas" component={Areas} />
          <Route path="/areas/:slug" component={District} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/faq" component={FAQ} />
          <Route path="/thanks" component={Thanks} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <SiteSettingsProvider>
        <ThemeProvider defaultTheme="light">
          <EstimateProvider>
            <TooltipProvider>
              <Toaster />
              <PageViewTracker />
              <Router />
            </TooltipProvider>
          </EstimateProvider>
        </ThemeProvider>
      </SiteSettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
