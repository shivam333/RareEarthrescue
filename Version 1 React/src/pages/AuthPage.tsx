import { SignIn, SignUp, UserButton, useAuth } from "@clerk/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { pageEnter } from "../lib/motion";
import {
  getAuthRedirectTarget,
  getSignInUrl,
  getSignUpUrl,
  normalizeRedirectPath,
  toAbsoluteAppUrl,
} from "../lib/site";

type AuthMode = "sign-in" | "sign-up";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#a77b2f",
    colorText: "#2f3426",
    colorTextSecondary: "#6f6b57",
    colorBackground: "#fffaf2",
    colorInputBackground: "#fffdf9",
    colorInputText: "#2f3426",
    borderRadius: "18px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "shadow-none border-0 bg-transparent p-0",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "!min-h-[3.6rem] !rounded-[20px] !border !border-[#ddd4c7] !bg-white/86 !text-[#2f3426] !shadow-none hover:!bg-white",
    socialButtonsBlockButtonText: "!text-[1rem] !font-semibold !tracking-[-0.01em]",
    socialButtonsProviderIcon__google: "!grayscale-0",
    socialButtonsProviderIcon__microsoft: "!grayscale-0",
    socialButtonsProviderIcon__linkedin_oidc: "!grayscale-0",
    dividerLine: "!bg-[#e6ddcf]",
    dividerText: "!text-[0.72rem] !font-extrabold !uppercase !tracking-[0.18em] !text-[#8a7b65]",
    formFieldLabel: "!text-[0.95rem] !text-[#6f6b57] !font-semibold",
    formFieldInput:
      "!min-h-[3.7rem] !rounded-[20px] !border !border-[#ddd4c7] !bg-white/88 !px-4 !text-[1rem] !font-medium !text-[#2f3426] !shadow-none focus:!border-[#b38a4e] focus:!ring-0",
    formButtonPrimary:
      "!mt-1 !min-h-[3.6rem] !rounded-full !bg-[#a77b2f] !text-[1rem] !font-semibold !text-white !shadow-[0_16px_40px_rgba(167,123,47,0.18)] hover:!bg-[#946a27]",
    footer: "!hidden",
    footerAction: "!hidden",
    identityPreviewText: "!text-[0.98rem] !text-[#6f6b57]",
    formFieldSuccessText: "!text-[#526946]",
    alertText: "!text-[#8c473c]",
    formResendCodeLink: "!text-[#8d6d39] hover:!text-[#2f3426]",
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: false,
    shimmer: false,
    animations: true,
  },
};

export function AuthPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMode: AuthMode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const stepParam = searchParams.get("step");
  const redirectTarget = getAuthRedirectTarget(searchParams);

  const [activeRole, setActiveRole] = useState("");

  useEffect(() => {
    document.body.dataset.authPage = "sign-in";
    document.body.classList.add("home-page", "auth-page-body");

    return () => {
      delete document.body.dataset.authPage;
      document.body.classList.remove("home-page", "auth-page-body");
    };
  }, []);

  const setMode = (mode: AuthMode) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    params.delete("step");
    setSearchParams(params, { replace: true });
  };

  const continueWithRole = () => {
    if (!activeRole) return;

    const nextTarget = normalizeRedirectPath(redirectTarget);
    const nextUrl = new URL(nextTarget, window.location.origin);
    nextUrl.searchParams.set("role", activeRole);
    navigate(`${nextUrl.pathname}${nextUrl.search}`, { replace: true });
  };

  const signInForceRedirectUrl = toAbsoluteAppUrl(redirectTarget);
  const signUpRoleRedirectUrl = toAbsoluteAppUrl(
    `/sign-in?mode=sign-up&step=role&redirect_url=${encodeURIComponent(redirectTarget)}`
  );

  const signInInitialValues = useMemo(() => {
    const email = searchParams.get("email_address") || "";
    return email ? { emailAddress: email } : undefined;
  }, [searchParams]);

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section id="account-access" className="section shell auth-shell auth-shell-centered">
        <div className="auth-background-authors" aria-hidden="true">
          <span className="auth-node auth-node-a"></span>
          <span className="auth-node auth-node-b"></span>
          <span className="auth-grid-ornament"></span>
        </div>

        <div className="auth-page-layout auth-page-layout-centered">
          <div className="auth-copy auth-copy-centered">
            <p className="eyebrow">Buyer and Supplier Access</p>
            <h1 className="auth-title">Access the rare earth recovery network</h1>
            <p className="auth-subcopy">
              Built for suppliers, recyclers, and procurement teams operating across fragmented
              supply chains.
            </p>
          </div>

          <div className="auth-card auth-card-centered panel">
            {!isLoaded ? (
              <div className="auth-mode-panel active">
                <div className="auth-panel-copy">
                  <h2 className="auth-panel-title">Loading secure access</h2>
                  <p className="auth-panel-subtext">
                    Rare Earth Rescue is preparing the authentication workspace.
                  </p>
                </div>
              </div>
            ) : !isSignedIn ? (
              <>
                <div className="auth-tabs" role="tablist" aria-label="Authentication">
                  <button
                    className={`auth-tab-button ${currentMode === "sign-in" ? "active" : ""}`}
                    type="button"
                    onClick={() => setMode("sign-in")}
                  >
                    Sign In
                  </button>
                  <button
                    className={`auth-tab-button ${currentMode === "sign-up" ? "active" : ""}`}
                    type="button"
                    onClick={() => setMode("sign-up")}
                  >
                    Create Account
                  </button>
                </div>

                <div className={`auth-mode-panel ${currentMode === "sign-in" ? "active" : ""}`}>
                  <div className="auth-panel-copy">
                    <h2 className="auth-panel-title">Welcome back</h2>
                    <p className="auth-panel-subtext">
                      Manage listings, orders, and supply relationships.
                    </p>
                  </div>

                  {currentMode === "sign-in" ? (
                    <div className="clerk-auth-root clerk-auth-root-compact">
                      <SignIn
                        routing="hash"
                        appearance={clerkAppearance}
                        signUpUrl={getSignUpUrl()}
                        fallbackRedirectUrl={signInForceRedirectUrl}
                        forceRedirectUrl={signInForceRedirectUrl}
                        initialValues={signInInitialValues}
                        oauthFlow="redirect"
                      />
                    </div>
                  ) : null}
                </div>

                <div className={`auth-mode-panel ${currentMode === "sign-up" ? "active" : ""}`}>
                  <div className="auth-panel-copy">
                    <h2 className="auth-panel-title">Create your account</h2>
                    <p className="auth-panel-subtext">
                      Create your account first. We will tailor your access path once sign-up is complete.
                    </p>
                  </div>

                  {currentMode === "sign-up" ? (
                    <div className="custom-auth-step active">
                      <div className="rounded-[22px] border border-[#e3dacd] bg-white/58 px-4 py-3 text-sm leading-7 text-[#5d6c79]">
                        Account setup stays lightweight here. Role selection and access-path choices
                        happen after secure account creation so users can get through sign-up with less friction.
                      </div>

                      <div className="clerk-auth-root clerk-auth-root-compact">
                        <SignUp
                          routing="hash"
                          appearance={clerkAppearance}
                          signInUrl={getSignInUrl()}
                          fallbackRedirectUrl={signUpRoleRedirectUrl}
                          forceRedirectUrl={signUpRoleRedirectUrl}
                          oauthFlow="redirect"
                        />
                      </div>

                      <div className="auth-signup-links">
                        <Link className="ghost-link" to="/get-started">
                          Compare access paths
                        </Link>
                        <Link className="ghost-link" to="/contact">
                          Talk to our team
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : stepParam === "role" ? (
              <div className="auth-mode-panel active">
                <div className="auth-panel-copy">
                  <h2 className="auth-panel-title">How will you use Rare Earth Rescue?</h2>
                  <p className="auth-panel-subtext">We’ll tailor your experience.</p>
                </div>

                <div className="role-selector">
                  {[
                    { id: "supplier", title: "Supplier", copy: "List and sell feedstock." },
                    { id: "recycler", title: "Recycler", copy: "Discover and source materials." },
                    { id: "both", title: "Both", copy: "Operate on both sides of the network." },
                  ].map((role) => (
                    <button
                      key={role.id}
                      className={`role-card ${activeRole === role.id ? "active" : ""}`}
                      type="button"
                      onClick={() => setActiveRole(role.id)}
                    >
                      <strong>{role.title}</strong>
                      <p>{role.copy}</p>
                    </button>
                  ))}
                </div>

                <div className="auth-role-actions">
                  <button
                    className={`button button-primary ${!activeRole ? "is-disabled" : ""}`}
                    type="button"
                    onClick={continueWithRole}
                    disabled={!activeRole}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-mode-panel active">
                <span className="badge">Signed in</span>
                <h3 style={{ marginTop: 14 }}>Your account is active.</h3>
                <p className="section-copy" style={{ marginTop: 10 }}>
                  Open your user menu to manage your account, then continue into the dashboard.
                </p>
                <div className="mt-5 flex justify-center">
                  <UserButton />
                </div>
                <div className="hero-actions" style={{ marginTop: 22, justifyContent: "center" }}>
                  <button className="button button-primary" type="button" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </button>
                  <button className="button button-secondary" type="button" onClick={() => navigate("/")}>
                    Back to Homepage
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="auth-trust">
            <p>Secure access for verified industrial participants</p>
            <p>Trusted by suppliers, recyclers, and procurement teams</p>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
