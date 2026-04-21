import { SignIn, SignUp, UserButton, useAuth } from "@clerk/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { pageEnter } from "../lib/motion";
import {
  AuthPlanType,
  AuthRole,
  comparisonHelperItems,
  getPlanDetailPath,
  planCards,
  PlanSlug,
  planRouteMap,
  roleLabels,
} from "../data/authPlansData";
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

function isRoleDrivenPlan(planId: string): planId is PlanSlug {
  return planId === "one-time-order" || planId === "subscription";
}

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

function PlanComparison({
  handlePlanJump,
  navigate,
}: {
  handlePlanJump: (plan: AuthPlanType) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [selectedRoles, setSelectedRoles] = useState<Record<PlanSlug, AuthRole>>({
    "one-time-order": "recycler",
    subscription: "recycler",
  });
  const [activeHelper, setActiveHelper] = useState("subscription");

  const accessStory = [
    "Start fast with a one-time transaction",
    "Scale into subscription when recovery activity becomes repeatable",
    "Move into enterprise services when operational complexity increases",
  ];

  return (
    <section id="plan-comparison" className="section shell auth-secondary-section">
      <div className="section-header auth-secondary-header">
        <p className="eyebrow">Access Paths</p>
        <h2>Choose the operating depth that matches how you buy, sell, and scale recovery activity.</h2>
        <p className="section-copy">
          Keep account creation light, then move from a first transaction into recurring access or
          tailored enterprise support as your workflow becomes more complex.
        </p>
      </div>

      <div className="mt-8 rounded-[30px] border border-[rgba(104,90,59,0.12)] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(247,239,227,0.84))] p-5 shadow-[0_18px_50px_rgba(87,68,35,0.08)]">
        <div className="grid gap-3 lg:grid-cols-3">
          {accessStory.map((item, index) => (
            <div
              key={item}
              className="rounded-[22px] border border-[rgba(104,90,59,0.08)] bg-[rgba(255,255,255,0.56)] px-4 py-4"
            >
              <span className="text-[0.74rem] font-bold uppercase tracking-[0.18em] text-[#8d6d39]">
                0{index + 1}
              </span>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#44505b]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        {planCards.map((plan, index) => {
          const rolePlanId: PlanSlug | null = isRoleDrivenPlan(plan.id) ? plan.id : null;
          const currentRole = rolePlanId ? selectedRoles[rolePlanId] : undefined;
          const planVariant = rolePlanId ? plan.variants?.[selectedRoles[rolePlanId]] : undefined;

          return (
            <motion.article
              key={plan.id}
              className={`panel float-hover relative overflow-hidden rounded-[30px] border p-6 shadow-[0_20px_60px_rgba(87,68,35,0.08)] ${
                plan.featured
                  ? "border-[rgba(111,138,85,0.22)] bg-[linear-gradient(180deg,rgba(255,252,247,1),rgba(242,238,226,0.96))]"
                  : "border-[rgba(104,90,59,0.14)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(246,239,227,0.94))]"
              }`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <div
                className={`absolute right-[-3rem] top-[-3rem] h-36 w-36 rounded-full blur-3xl ${
                  plan.featured ? "bg-[rgba(111,138,85,0.14)]" : "bg-[rgba(184,139,60,0.12)]"
                }`}
                aria-hidden="true"
              />

              <div className="relative z-10 flex min-h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${
                        plan.featured
                          ? "bg-[rgba(111,138,85,0.14)] text-[#526946]"
                          : "bg-[rgba(184,139,60,0.14)] text-[#9f742c]"
                      }`}
                    >
                      {plan.shortLabel}
                    </span>
                    <h3 className="mt-4 text-[1.42rem] tracking-[-0.05em] text-[#2f3426]">
                      {plan.title}
                    </h3>
                    <p className="mt-2 text-[0.98rem] leading-7 text-[#6f6b57]">
                      {plan.summary}
                    </p>
                  </div>

                  {plan.featured ? (
                    <span className="rounded-full border border-[rgba(111,138,85,0.2)] bg-[rgba(111,138,85,0.1)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#526946]">
                      Recommended
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[#8a7b65]">
                  {plan.progression}
                </p>

                {planVariant ? (
                  <>
                    <div className="mt-5 inline-flex rounded-full border border-[rgba(104,90,59,0.12)] bg-[rgba(255,255,255,0.7)] p-1">
                      {(["recycler", "supplier"] as const).map((role) => {
                        const isActive = currentRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              if (!rolePlanId) return;
                              setSelectedRoles((current) => ({
                                ...current,
                                [rolePlanId]: role,
                              }));
                            }}
                            className={`rounded-full px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] transition ${
                              isActive
                                ? "bg-[linear-gradient(145deg,#b88b3c,#9f742c)] text-white shadow-[0_10px_24px_rgba(184,139,60,0.2)]"
                                : "text-[#6f6b57] hover:text-[#2f3426]"
                            }`}
                          >
                            {roleLabels[role]}
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${plan.id}-${currentRole}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-5"
                      >
                        <p className="text-[0.98rem] leading-7 text-[#44505b]">
                          {planVariant.summary}
                        </p>

                        <div className="mt-5 grid gap-3">
                          {planVariant.bullets.slice(0, 6).map((bullet: string) => (
                            <div key={bullet} className="flex items-start gap-3">
                              <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-[rgba(111,138,85,0.14)] text-[0.82rem] font-bold text-[#526946]">
                                ✓
                              </span>
                              <span className="text-[0.95rem] leading-7 text-[#44505b]">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="mt-5">
                    <div className="grid gap-3">
                      {plan.bullets?.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3">
                          <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-[rgba(184,139,60,0.14)] text-[0.82rem] font-bold text-[#9f742c]">
                            ✓
                          </span>
                          <span className="text-[0.95rem] leading-7 text-[#44505b]">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    className={`button ${plan.featured ? "button-primary" : "button-secondary"} button-block`}
                    type="button"
                    onClick={() => {
                      if (plan.planType) {
                        handlePlanJump(plan.planType);
                        return;
                      }

                      navigate("/contact");
                    }}
                  >
                    {plan.cta}
                  </button>

                  {planVariant && rolePlanId ? (
                    <Link
                      className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#8d6d39] transition hover:text-[#2f3426]"
                      to={getPlanDetailPath(rolePlanId, selectedRoles[rolePlanId])}
                    >
                      Know more
                    </Link>
                  ) : (
                    <button
                      className="w-fit border-0 bg-transparent px-0 text-left text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#8d6d39] transition hover:text-[#2f3426]"
                      type="button"
                      onClick={() => navigate("/contact")}
                    >
                      Know more
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-6 rounded-[30px] border border-[rgba(104,90,59,0.12)] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(247,239,227,0.92))] p-6 shadow-[0_18px_50px_rgba(87,68,35,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[rgba(104,90,59,0.1)] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="plan-visual-label">Comparison helper</span>
            <h3 className="mt-3 text-[1.5rem] tracking-[-0.04em] text-[#2f3426]">
              A simple progression from first transaction to scaled operating model.
            </h3>
          </div>
          <p className="max-w-[38rem] text-[0.96rem] leading-7 text-[#6f6b57]">
            Use one-time access to start, move into subscription when activity becomes repeatable,
            and step into enterprise support when the workflow needs tailored coordination.
          </p>
        </div>

        <div className="mt-2 grid">
          {comparisonHelperItems.map((item) => {
            const isOpen = activeHelper === item.id;

            return (
              <motion.article
                key={item.id}
                className="border-b border-[rgba(104,90,59,0.1)] last:border-b-0"
              >
                <button
                  className="flex w-full items-center justify-between gap-4 border-0 bg-transparent py-5 text-left"
                  type="button"
                  onClick={() => setActiveHelper(isOpen ? "" : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#2f3426]">
                    {item.question}
                  </span>
                  <span className="text-[1.4rem] leading-none text-[#8d6d39]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[64rem] pb-5 text-[0.96rem] leading-7 text-[#6f6b57]">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AuthPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMode: AuthMode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const stepParam = searchParams.get("step");
  const redirectTarget = getAuthRedirectTarget(searchParams);

  const [activePlan, setActivePlan] = useState<AuthPlanType>("free");
  const [activeRole, setActiveRole] = useState("");

  useEffect(() => {
    document.body.dataset.authPage = "sign-in";
    document.body.classList.add("home-page", "auth-page-body");

    return () => {
      delete document.body.dataset.authPage;
      document.body.classList.remove("home-page", "auth-page-body");
    };
  }, []);

  useEffect(() => {
    const queryPlan = searchParams.get("plan");
    if (queryPlan && queryPlan in planRouteMap) {
      setActivePlan(planRouteMap[queryPlan as PlanSlug]);
    }
  }, [searchParams]);

  const setMode = (mode: AuthMode) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    params.delete("step");
    setSearchParams(params, { replace: true });
  };

  const focusAccountAccess = () => {
    document.getElementById("account-access")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlanJump = (plan: AuthPlanType) => {
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
                          <span className="plan-badge">One-time</span>
                          <strong>One-Time Order</strong>
                          <p>Single transaction, guided execution, and a low-friction start.</p>
                        </button>
                        <button
                          className={`plan-card ${activePlan === "subscription" ? "active" : ""}`}
                          type="button"
                          onClick={() => setActivePlan("subscription")}
                        >
                          <span className="plan-badge plan-badge-subscription">Recommended</span>
                          <strong>Subscription</strong>
                          <p>Recurring access, stronger intelligence, and deeper workflow support.</p>
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
                          signInUrl={getSignInUrl()}
                          fallbackRedirectUrl={signUpRoleRedirectUrl}
                          forceRedirectUrl={signUpRoleRedirectUrl}
                          unsafeMetadata={{ plan: activePlan }}
                          oauthFlow="redirect"
                        />
                      </div>

                      <div className="auth-signup-links">
                        <a className="ghost-link" href="#plan-comparison">
                          Compare access paths
                        </a>
                        <Link className="ghost-link" to={getPlanDetailPath("subscription", "recycler")}>
                          Know more about subscription
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

      {!isSignedIn ? (
        <PlanComparison handlePlanJump={handlePlanJump} navigate={navigate} />
      ) : null}
    </motion.main>
  );
}
