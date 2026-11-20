import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  addEventListener("load", async () => {
    const reg = await navigator.serviceWorker.register("/sw.js");
    const worker = reg.active || reg.waiting || reg.installing;
    const assets = performance
      .getEntriesByType("resource")
      .map((x) => x.name)
      .filter((x) => x.startsWith(location.origin));
    worker?.postMessage({ type: "CACHE_ASSETS", assets: [...assets, location.href] });
  });
}
