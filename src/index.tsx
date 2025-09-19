import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/* Ionic styles */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
