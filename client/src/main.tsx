import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/brand-system.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Unable to find #root element");
}

createRoot(root).render(<App />);
