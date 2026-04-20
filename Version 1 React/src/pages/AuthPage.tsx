import { SignIn, SignUp, UserButton, useAuth } from "@clerk/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pageEnter } from "../lib/motion";
import { getAuthRedirectTarget, normalizeRedirectPath } from "../lib/site";

type AuthMode = "sign-in" | "sign-up";
type PlanType = "free" | "subscription";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const planComparisonCards = [
  {
    id: "free",
    kicker: "Start free",
    title: "One-Time Order",
    value: "Single lot",
    featured: false,
    meta: "For a first transaction, a targeted sell-side mandate, or a single procurement need.",
    features: [
      { label: "Guided onboarding for one transaction", included: true },
      { label: "Targeted buyer or seller matching", included: true },
      { label: "Transaction-level logistics coordination", included: true },
      { label: "Light market context and support", included: true },
      { label: "Ongoing marketplace workflow depth", included: false },
    ],
    cta: "Create free account",
    detailAction: "one-time",
    detailLabel: "Know more about one-time orders",
  },
  {
    id: "subscription",
    kicker: "Preferred for repeat operators",
    title: "Marketplace Access",
    value: "Subscription",
    meta: "Built for recurring discovery, repeat listings, and stronger internal procurement workflows.",
    features: [
      { label: "Always-on listing and sourcing visibility", included: true },
      { label: "Saved searches and recurring workflows", included: true },
      { label: "Pricing signals and bid awareness", included: true },
      { label: "Shared access for active teams", included: true },
      { label: "Dedicated managed sourcing desk", included: false },
    ],
    cta: "Request subscription access",
    featured: true,
    detailAction: "subscription",
    detailLabel: "Know more about subscription",
  },
  {
    id: "services",
    kicker: "Custom programs",
    title: "Strategic Services",
    value: "Request services",
    featured: false,
    meta: "For high-touch sourcing, tailored operating models, and managed execution support.",
    features: [
      { label: "Managed procurement and sourcing support", included: true },
      { label: "Custom commercial and workflow design", included: true },
      { label: "Batch consolidation and logistics planning", included: true },
      { label: "High-touch onboarding and advisory", included: true },
      { label: "Enterprise coordination across regions", included: true },
    ],
    cta: "Talk to our team",
    detailAction: "services",
    detailLabel: "Know more about custom services",
  },
] as const;

const planFaqItems = [
  {
    id: "one-time",
    question: "What is included in a one-time order?",
    answer:
      "A one-time order is designed for teams testing the network or moving a specific lot. You get secure account creation, focused matching, and guided transaction support without committing to an ongoing subscription.",
  },
  {
    id: "subscription",
    question: "When should I choose subscription?",
    answer:
      "Choose subscription when rare-earth-bearing scrap is part of your ongoing operating rhythm. It is the better fit for repeat sourcing, recurring listings, team visibility, and stronger commercial intelligence.",
  },
  {
    id: "services",
    question: "How do strategic services work?",
    answer:
      "Strategic services are tailored around your workflow. We scope the supply challenge with your team, then design a support model around sourcing, logistics, commercial structure, or managed execution.",
  },
] as const;

const clerkAppearance = {
  variables: {
    colorPrimary: "#173550",
    colorText: "#11283d",
    colorTextSecondary: "#5c6b79",
    colorBackground: "#fffaf2",
    colorInputBackground: "#fffdf9",
    colorInputText: "#11283d",
    borderRadius: "18px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "shadow-none border-0 bg-transparent p-0",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "!rounded-[18px] !border !border-[#ddd4c7] !bg-white/86 !text-[#11283d] !shadow-none hover:!bg-white",
    socialButtonsBlockButtonText: "!font-semibold",
    socialButtonsProviderIcon__google: "!grayscale-0",
    socialButtonsProviderIcon__microsoft: "!grayscale-0",
    socialButtonsProviderIcon__linkedin_oidc: "!grayscale-0",
    dividerLine: "!bg-[#e6ddcf]",
    dividerText: "!text-[0.68rem] !font-extrabold !uppercase !tracking-[0.18em] !text-[#8a7b65]",
    formFieldLabel: "!text-[#5b6b79] !font-semibold",
    formFieldInput:
      "!rounded-[18px] !border !border-[#ddd4c7] !bg-white/88 !text-[#11283d] !shadow-none focus:!border-[#b38a4e] focus:!ring-0",
    formButtonPrimary:
      "!rounded-full !bg-[#173550] !text-white !shadow-[0_16px_40px_rgba(23,53,80,0.18)] hover:!bg-[#0f2a40]",
    footer: "!hidden",
    footerAction: "!hidden",
    identityPreviewText: "!text-[#5c6b79]",
    formFieldSuccessText: "!text-[#315e53]",
    alertText: "!text-[#8c473c]",
    formResendCodeLink: "!text-[#8d6d39] hover:!text-[#173550]",
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: false,
    shimmer: false,
    animations: true,
  },
};

function PlanComparison({
  activeFaq,
  setActiveFaq,
  handlePlanJump,
  navigate,
}: {
  activeFaq: string;
  setActiveFaq: (next: string) => void;
  handlePlanJump: (plan: PlanType) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const openPlanDetail = (detailAction: "one-time" | "subscription" | "services") => {
    if (detailAction === "services") {
      navigate("/contact");
      return;
    }

    const nextFaq = detailAction === "one-time" ? "one-time" : "subscription";
    setActiveFaq(nextFaq);

    const nextSection = detailAction === "subscription" ? "subscription-plan" : "plan-comparison";
    window.requestAnimationFrame(() => {
      document.getElementById(nextSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <section id="plan-comparison" className="section shell auth-secondary-section">
        <div className="section-header auth-secondary-header">
          <p className="eyebrow">Compare Access Paths</p>
          <h2>Simple, structured access for every recovery workflow.</h2>
          <p className="section-copy">
            Keep sign-up light, then choose the level of marketplace depth that matches how your
            team buys, sells, and scales rare earth recovery activity.
          </p>
        </div>

        <div className="plan-comparison-shell">
          <div className="plan-pricing-grid">
            {planComparisonCards.map((plan, index) => (
              <motion.article
                key={plan.id}
                className={`pricing-card panel float-hover ${plan.featured ? "pricing-card-featured" : ""}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pricing-card-topline">
                  <span className={`pricing-card-kicker ${plan.featured ? "pricing-card-kicker-featured" : ""}`}>
                    {plan.kicker}
                  </span>
                </div>

                <div className="pricing-card-header">
                  <h3>{plan.title}</h3>
                  <div className="pricing-card-value-block">
                    <strong className="pricing-card-value">{plan.value}</strong>
                    <p className="pricing-card-meta">{plan.meta}</p>
                  </div>
                </div>

                <div className="pricing-card-features">
                  {plan.features.map((feature) => (
                    <div
                      key={feature.label}
                      className={`pricing-card-feature ${feature.included ? "" : "is-muted"}`}
                    >
                      <span className="pricing-card-feature-mark" aria-hidden="true">
                        {feature.included ? "✓" : "−"}
                      </span>
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`button ${plan.featured ? "button-primary" : "button-secondary"}`}
                  type="button"
                  onClick={() => {
                    if (plan.id === "free") {
                      handlePlanJump("free");
                      return;
                    }

                    if (plan.id === "subscription") {
                      handlePlanJump("subscription");
                      return;
                    }

                    navigate("/contact");
                  }}
                >
                  {plan.cta}
                </button>

                <button
                  className={`pricing-card-link ${plan.featured ? "pricing-card-link-featured" : ""}`}
                  type="button"
                  onClick={() => openPlanDetail(plan.detailAction)}
                >
                  {plan.detailLabel}
                </button>
              </motion.article>
            ))}
          </div>

          <div className="plan-faq-shell panel">
            <div className="plan-faq-header">
              <div>
                <span className="plan-visual-label">Visual comparison</span>
                <h3>Keep account creation fast. Choose the depth after that.</h3>
              </div>
              <p>
                Role selection still happens after sign-up, so this section is here to clarify the
                commercial path, not slow down account creation.
              </p>
            </div>

            <div className="plan-faq-list">
              {planFaqItems.map((item) => {
                const isOpen = activeFaq === item.id;

                return (
                  <div key={item.id} className={`plan-faq-item ${isOpen ? "active" : ""}`}>
                    <button
                      className="plan-faq-trigger"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setActiveFaq(isOpen ? "" : item.id)}
                    >
                      <span>{item.question}</span>
                      <span className="plan-faq-icon" aria-hidden="true">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          className="plan-faq-answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p>{item.answer}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="subscription-plan" className="section shell auth-secondary-section">
        <div className="subscription-knowmore panel">
          <div className="subscription-copy">
            <p className="eyebrow">Know More</p>
            <h2>Subscription is built for repeat operators across the rare earth recovery chain.</h2>
            <p className="section-copy">
              Choose subscription if your team needs continuing access to fragmented supply,
              recurring discovery, internal team visibility, and stronger commercial intelligence.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function AuthPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMode: AuthMode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const stepParam = searchParams.get("step");
  const redirectTarget = getAuthRedirectTarget(searchParams);

  const [activePlan, setActivePlan] = useState<PlanType>("free");
  const [activeRole, setActiveRole] = useState("");
  const [activeFaq, setActiveFaq] = useState<string>("subscription");

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

  const focusAccountAccess = () => {
    document.getElementById("account-access")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlanJump = (plan: PlanType) => {
    setActivePlan(plan);
    setMode("sign-up");
    window.requestAnimationFrame(focusAccountAccess);
  };

  const continueWithRole = () => {
    if (!activeRole) return;

    const nextTarget = normalizeRedirectPath(redirectTarget);
    const nextUrl = new URL(nextTarget, window.location.origin);
    nextUrl.searchParams.set("role", activeRole);
    navigate(`${nextUrl.pathname}${nextUrl.search}`, { replace: true });
  };

  const signInForceRedirectUrl = redirectTarget;
  const signUpRoleRedirectUrl = `/sign-in?mode=sign-up&step=role&redirect_url=${encodeURIComponent(
    redirectTarget
  )}`;

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
                        signUpUrl="/sign-in?mode=sign-up"
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
                      Start with secure account creation, then compare one-time and subscription
                      access below.
                    </p>
                  </div>

                  {currentMode === "sign-up" ? (
                    <div className="custom-auth-step active">
                      <div className="plan-selector plan-selector-inline">
                        <button
                          className={`plan-card ${activePlan === "free" ? "active" : ""}`}
                          type="button"
                          onClick={() => setActivePlan("free")}
                        >
                          <span className="plan-badge">Start free</span>
                          <strong>One-Time Order</strong>
                          <p>Single transaction, guided execution, and a lighter start.</p>
                        </button>
                        <button
                          className={`plan-card ${activePlan === "subscription" ? "active" : ""}`}
                          type="button"
                          onClick={() => setActivePlan("subscription")}
                        >
                          <span className="plan-badge plan-badge-subscription">Subscription</span>
                          <strong>Marketplace Access</strong>
                          <p>Repeat sourcing, recurring visibility, and stronger workflow support.</p>
                        </button>
                      </div>

                      <div className="rounded-[22px] border border-[#e3dacd] bg-white/58 px-4 py-3 text-sm leading-7 text-[#5d6c79]">
                        Company details and role selection can be completed after secure account
                        creation, so users can get through sign-up with less friction.
                      </div>

                      <div className="clerk-auth-root clerk-auth-root-compact">
                        <SignUp
                          routing="hash"
                          appearance={clerkAppearance}
                          signInUrl="/sign-in"
                          fallbackRedirectUrl={signUpRoleRedirectUrl}
                          forceRedirectUrl={signUpRoleRedirectUrl}
                          unsafeMetadata={{ plan: activePlan }}
                          oauthFlow="redirect"
                        />
                      </div>

                      <div className="auth-signup-links">
                        <a className="ghost-link" href="#plan-comparison">
                          Compare one-time vs subscription
                        </a>
                        <a className="ghost-link" href="#subscription-plan">
                          Know more about subscription
                        </a>
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

      {!isSignedIn ? (
        <PlanComparison
          activeFaq={activeFaq}
          setActiveFaq={setActiveFaq}
          handlePlanJump={handlePlanJump}
          navigate={navigate}
        />
      ) : null}
    </motion.main>
  );
}
