import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EstimateProvider } from "./contexts/EstimateContext";
import { initAnalytics, trackPageView } from "./lib/analytics";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";

initAnalytics();
import Home from "./pages/Home";
import Services from "./pages/Services";
import Areas from "./pages/Areas";
import District from "./pages/District";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Guide from "./pages/Guide";
import Thanks from "./pages/Thanks";

/** SPA 路由變更時上報 GA4 page_view（首次載入由 gtag config 自動處理，這裡跳過） */
function PageViewTracker() {
  const [location] = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // 等 document.title 由 SEO 元件更新後再上報
    const id = window.setTimeout(() => trackPageView(location), 100);
    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/services"} component={Services} />
        <Route path={"/guide"} component={Guide} />
      <Route path={"/areas"} component={Areas} />
      <Route path={"/areas/:slug"} component={District} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/blog/:slug"} component={BlogPost} />
        <Route path={"/faq"} component={FAQ} />
        <Route path={"/thanks"} component={Thanks} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

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
