import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DevTools from "./pages/DevTools";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DevTools />
  </StrictMode>
);
