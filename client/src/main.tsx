import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/home-editorial-phase3.css";
import "./styles/services-guide-phase4.css";
import "./styles/site-chrome-phase5.css";
import "./styles/secondary-pages-stage6a.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Unable to find #root element");
}

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
