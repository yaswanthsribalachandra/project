import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
