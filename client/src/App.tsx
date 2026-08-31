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
import {
  loadAreas,
  loadBlog,
  loadBlogPost,
  loadDrainDiagnosis,
  loadDistrict,
  loadFAQ,
  loadGuide,
  loadNotFound,
  loadServiceDetail,
  loadServices,
  loadServiceProcess,
  loadThanks,
} from "./lib/routePrefetch";

const Services = lazy(loadServices);
const ServiceDetail = lazy(loadServiceDetail);
const DrainDiagnosis = lazy(loadDrainDiagnosis);
const ServiceProcess = lazy(loadServiceProcess);
const Areas = lazy(loadAreas);
const District = lazy(loadDistrict);
const FAQ = lazy(loadFAQ);
const Blog = lazy(loadBlog);
const BlogPost = lazy(loadBlogPost);
const Guide = lazy(loadGuide);
const Thanks = lazy(loadThanks);
const NotFound = lazy(loadNotFound);

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
          <Route path="/drain-diagnosis" component={DrainDiagnosis} />
          <Route path="/service-process" component={ServiceProcess} />
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
