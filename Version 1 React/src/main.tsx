import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import "./index.css";
import "./legacy.css";
import { clerkPublishableKey, getSignInUrl, getSignUpUrl } from "./lib/site";

const routerBase =
  import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/"
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : undefined;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl={getSignInUrl()}
      signUpUrl={getSignUpUrl()}
      allowedRedirectOrigins={[window.location.origin]}
    >
      <BrowserRouter basename={routerBase}>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
