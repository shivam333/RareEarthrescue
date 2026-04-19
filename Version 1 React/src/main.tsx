import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import "./index.css";
import { clerkPublishableKey } from "./lib/site";

const routerBase =
  import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/"
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : undefined;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <BrowserRouter basename={routerBase}>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
