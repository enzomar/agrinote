import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setupConfig } from "@ionic/core"; // ✅ correct import
import { defineCustomElements } from "@ionic/pwa-elements/loader"; 
import "@ionic/react/css/core.css";

// Optional Ionic config
setupConfig({
  mode: "md", // or "ios"
});

// Register Ionic PWA Elements (camera, toast, etc.)
defineCustomElements(window);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
