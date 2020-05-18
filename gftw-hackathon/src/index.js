import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import NewsPage from "./pages/landing-page/NewsPage";

ReactDOM.render(
  <React.StrictMode>
    <NewsPage />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
