import { UserButton, useAuth, useClerk } from "@clerk/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pageEnter } from "../lib/motion";
import { normalizeRedirectPath, toAbsoluteAppUrl } from "../lib/site";

type FeedbackTone = "error" | "success" | "neutral";
type AuthMode = "sign-in" | "sign-up";
type AuthStep = "form" | "verify";
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

function getErrorMessage(error: any, fallback = "Something went wrong. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors[0]) {
    return error.errors[0].longMessage || error.errors[0].message || fallback;
  }

  return error?.message || fallback;
}

function AuthFeedback({
  text,
  tone,
}: {
  text: string;
  tone: FeedbackTone;
}) {
  if (!text) {
    return null;
  }

  return (
    <div className="auth-feedback" data-tone={tone}>
      {text}
    </div>
  );
}

function SocialButton({
  label,
  mark,
  onClick,
  disabled,
}: {
  label: string;
  mark: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="oauth-button" type="button" onClick={onClick} disabled={disabled}>
      <span className="oauth-button-mark">{mark}</span>
      <span>{label}</span>
    </button>
  );
}

export function AuthPage() {
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMode: AuthMode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const stepParam = searchParams.get("step");
  const redirectTarget = normalizeRedirectPath(searchParams.get("redirect"));

  const signInAttemptRef = useRef<any>(null);
  const signUpAttemptRef = useRef<any>(null);

  const [activePlan, setActivePlan] = useState<PlanType>("free");
  const [activeRole, setActiveRole] = useState("");
  const [activeFaq, setActiveFaq] = useState<string>("subscription");
  const [signInStep, setSignInStep] = useState<AuthStep>("form");
  const [signUpStep, setSignUpStep] = useState<AuthStep>("form");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInCode, setSignInCode] = useState("");

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpCompany, setSignUpCompany] = useState("");
  const [signUpCode, setSignUpCode] = useState("");

  const [signInFeedback, setSignInFeedback] = useState<{ text: string; tone: FeedbackTone }>({
    text: "",
    tone: "neutral",
  });
  const [signInVerifyFeedback, setSignInVerifyFeedback] = useState<{
    text: string;
    tone: FeedbackTone;
  }>({
    text: "",
    tone: "neutral",
  });
  const [signUpFeedback, setSignUpFeedback] = useState<{ text: string; tone: FeedbackTone }>({
    text: "",
    tone: "neutral",
  });
  const [signUpVerifyFeedback, setSignUpVerifyFeedback] = useState<{
    text: string;
    tone: FeedbackTone;
  }>({
    text: "",
    tone: "neutral",
  });

  const [signInLoading, setSignInLoading] = useState(false);
  const [signInVerifyLoading, setSignInVerifyLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpVerifyLoading, setSignUpVerifyLoading] = useState(false);
  const [oauthLoadingKey, setOauthLoadingKey] = useState("");

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
    setSignInStep("form");
    setSignUpStep("form");
    setSignInFeedback({ text: "", tone: "neutral" });
    setSignUpFeedback({ text: "", tone: "neutral" });
    setSignInVerifyFeedback({ text: "", tone: "neutral" });
    setSignUpVerifyFeedback({ text: "", tone: "neutral" });
  };

  const focusAccountAccess = () => {
    document.getElementById("account-access")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const handlePlanJump = (plan: PlanType) => {
    setActivePlan(plan);
    setMode("sign-up");
    window.requestAnimationFrame(focusAccountAccess);
  };

  const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    setSignInLoading(true);
    setSignInFeedback({ text: "", tone: "neutral" });

    try {
      const attempt: any = await clerk.client.signIn.create({
        identifier: signInEmail,
        password: signInPassword,
      });

      signInAttemptRef.current = attempt;

      if (attempt.status === "complete") {
        await clerk.setActive({ session: attempt.createdSessionId });
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (
        (attempt.status === "needs_second_factor" || attempt.status === "needs_client_trust") &&
        attempt.mfa?.sendEmailCode
      ) {
        await attempt.mfa.sendEmailCode();
        setSignInStep("verify");
        setSignInVerifyFeedback({
          text: "Enter the code from your email to continue.",
          tone: "neutral",
        });
        return;
      }

      throw new Error("This account needs a verification method that is not yet enabled.");
    } catch (error) {
      setSignInFeedback({ text: getErrorMessage(error), tone: "error" });
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignInVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const attempt = signInAttemptRef.current;
    if (!attempt) return;

    setSignInVerifyLoading(true);
    setSignInVerifyFeedback({ text: "", tone: "neutral" });

    try {
      await attempt.mfa.verifyEmailCode({ code: signInCode });

      if (attempt.status === "complete") {
        await clerk.setActive({ session: attempt.createdSessionId });
        navigate(redirectTarget, { replace: true });
        return;
      }

      throw new Error("Verification is incomplete. Please request a new code.");
    } catch (error) {
      setSignInVerifyFeedback({ text: getErrorMessage(error), tone: "error" });
    } finally {
      setSignInVerifyLoading(false);
    }
  };

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    setSignUpLoading(true);
    setSignUpFeedback({ text: "", tone: "neutral" });

    try {
      const attempt: any = await clerk.client.signUp.create({
        emailAddress: signUpEmail,
        password: signUpPassword,
        unsafeMetadata: {
          plan: activePlan,
          companyName: signUpCompany,
        },
      });

      signUpAttemptRef.current = attempt;
      await attempt.prepareEmailAddressVerification({ strategy: "email_code" });
      setSignUpStep("verify");
      setSignUpVerifyFeedback({
        text: "Enter the code from your email to activate the account.",
        tone: "neutral",
      });
    } catch (error) {
      setSignUpFeedback({ text: getErrorMessage(error), tone: "error" });
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleSignUpVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const attempt = signUpAttemptRef.current;
    if (!attempt) return;

    setSignUpVerifyLoading(true);
    setSignUpVerifyFeedback({ text: "", tone: "neutral" });

    try {
      const result: any = await attempt.attemptEmailAddressVerification({ code: signUpCode });

      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        navigate(
          `/sign-in?mode=sign-up&step=role&redirect=${encodeURIComponent(redirectTarget)}`,
          { replace: true }
        );
        return;
      }

      throw new Error("Verification is incomplete. Please request a new code.");
    } catch (error) {
      setSignUpVerifyFeedback({ text: getErrorMessage(error), tone: "error" });
    } finally {
      setSignUpVerifyLoading(false);
    }
  };

  const resendSignInCode = async () => {
    try {
      await signInAttemptRef.current?.mfa?.sendEmailCode?.();
      setSignInVerifyFeedback({ text: "A new verification code has been sent.", tone: "success" });
    } catch (error) {
      setSignInVerifyFeedback({ text: getErrorMessage(error), tone: "error" });
    }
  };

  const resendSignUpCode = async () => {
    try {
      await signUpAttemptRef.current?.prepareEmailAddressVerification?.({ strategy: "email_code" });
      setSignUpVerifyFeedback({ text: "A new verification code has been sent.", tone: "success" });
    } catch (error) {
      setSignUpVerifyFeedback({ text: getErrorMessage(error), tone: "error" });
    }
  };

  const resetSignIn = () => {
    signInAttemptRef.current = null;
    setSignInCode("");
    setSignInStep("form");
    setSignInVerifyFeedback({ text: "", tone: "neutral" });
  };

  const resetSignUp = () => {
    signUpAttemptRef.current = null;
    setSignUpCode("");
    setSignUpStep("form");
    setSignUpVerifyFeedback({ text: "", tone: "neutral" });
  };

  const startOAuth = async (flow: AuthMode, strategy: string) => {
    const loadingKey = `${flow}:${strategy}`;
    setOauthLoadingKey(loadingKey);

    const callbackUrl = toAbsoluteAppUrl(
      `/oauth-callback?redirect=${encodeURIComponent(redirectTarget)}&mode=${flow}`
    );
    const completeUrl =
      flow === "sign-up"
        ? toAbsoluteAppUrl(`/sign-in?mode=sign-up&step=role&redirect=${encodeURIComponent(redirectTarget)}`)
        : toAbsoluteAppUrl(redirectTarget);
    const resource: any = flow === "sign-up" ? clerk.client.signUp : clerk.client.signIn;

    try {
      if (resource?.authenticateWithRedirect) {
        await resource.authenticateWithRedirect({
          strategy,
          redirectUrl: callbackUrl,
          redirectUrlComplete: completeUrl,
        });
        return;
      }

      if (resource?.sso) {
        await resource.sso({
          strategy,
          redirectCallbackUrl: callbackUrl,
          redirectUrl: completeUrl,
        });
        return;
      }

      throw new Error("Social sign-in is not available for this configuration.");
    } catch (error) {
      const nextFeedback = { text: getErrorMessage(error), tone: "error" as FeedbackTone };
      if (flow === "sign-up") {
        setSignUpFeedback(nextFeedback);
      } else {
        setSignInFeedback(nextFeedback);
      }
      setOauthLoadingKey("");
    }
  };

  const continueWithRole = () => {
    if (!activeRole) return;

    const nextUrl = new URL(redirectTarget, window.location.origin);
    nextUrl.searchParams.set("role", activeRole);
    navigate(`${nextUrl.pathname}${nextUrl.search}`, { replace: true });
  };

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
            {!isSignedIn ? (
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

                  {signInStep === "form" ? (
                    <div className="custom-auth-step active">
                      <div className="custom-social-stack">
                        <SocialButton
                          label="Continue with Google"
                          mark="G"
                          onClick={() => startOAuth("sign-in", "oauth_google")}
                          disabled={oauthLoadingKey === "sign-in:oauth_google"}
                        />
                        <SocialButton
                          label="Continue with Microsoft"
                          mark="M"
                          onClick={() => startOAuth("sign-in", "oauth_microsoft")}
                          disabled={oauthLoadingKey === "sign-in:oauth_microsoft"}
                        />
                        <SocialButton
                          label="Continue with LinkedIn"
                          mark="in"
                          onClick={() => startOAuth("sign-in", "oauth_linkedin_oidc")}
                          disabled={oauthLoadingKey === "sign-in:oauth_linkedin_oidc"}
                        />
                      </div>

                      <div className="auth-divider">
                        <span>or use your work email</span>
                      </div>

                      <form className="auth-form" onSubmit={handleSignInSubmit}>
                        <label className="auth-label" htmlFor="sign-in-email">
                          Work email
                        </label>
                        <input
                          id="sign-in-email"
                          className="auth-input"
                          type="email"
                          autoComplete="email"
                          placeholder="name@company.com"
                          value={signInEmail}
                          onChange={(event) => setSignInEmail(event.target.value)}
                        />

                        <label className="auth-label" htmlFor="sign-in-password">
                          Password
                        </label>
                        <input
                          id="sign-in-password"
                          className="auth-input"
                          type="password"
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={signInPassword}
                          onChange={(event) => setSignInPassword(event.target.value)}
                        />

                        <button className="button button-primary button-block auth-submit" type="submit" disabled={signInLoading}>
                          {signInLoading ? "Continuing..." : "Continue"}
                        </button>
                      </form>

                      <AuthFeedback {...signInFeedback} />
                      <p className="auth-helper-text">
                        Use the email and password configured for your Rare Earth Rescue account.
                      </p>
                    </div>
                  ) : (
                    <div className="custom-auth-step active">
                      <div className="verify-panel-copy">
                        <span className="plan-badge">Verification required</span>
                        <h3>Check your inbox</h3>
                        <p>
                          Enter the security code sent to {signInEmail || "your email"} to finish
                          signing in.
                        </p>
                      </div>

                      <form className="auth-form" onSubmit={handleSignInVerify}>
                        <label className="auth-label" htmlFor="sign-in-code">
                          Verification code
                        </label>
                        <input
                          id="sign-in-code"
                          className="auth-input auth-code-input"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="123456"
                          value={signInCode}
                          onChange={(event) => setSignInCode(event.target.value)}
                        />

                        <button className="button button-primary button-block auth-submit" type="submit" disabled={signInVerifyLoading}>
                          {signInVerifyLoading ? "Verifying..." : "Verify and continue"}
                        </button>
                      </form>

                      <div className="auth-secondary-actions">
                        <button className="button button-secondary" type="button" onClick={resendSignInCode}>
                          Resend code
                        </button>
                        <button className="button button-ghost" type="button" onClick={resetSignIn}>
                          Start over
                        </button>
                      </div>

                      <AuthFeedback {...signInVerifyFeedback} />
                    </div>
                  )}
                </div>

                <div className={`auth-mode-panel ${currentMode === "sign-up" ? "active" : ""}`}>
                  <div className="auth-panel-copy">
                    <h2 className="auth-panel-title">Create your account</h2>
                    <p className="auth-panel-subtext">
                      Start with secure account creation, then compare one-time and subscription
                      access below.
                    </p>
                  </div>

                  {signUpStep === "form" ? (
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

                      <form className="auth-form" onSubmit={handleSignUpSubmit}>
                        <label className="auth-label" htmlFor="sign-up-email">
                          Work email
                        </label>
                        <input
                          id="sign-up-email"
                          className="auth-input"
                          type="email"
                          autoComplete="email"
                          placeholder="name@company.com"
                          value={signUpEmail}
                          onChange={(event) => setSignUpEmail(event.target.value)}
                        />

                        <label className="auth-label" htmlFor="sign-up-password">
                          Create password
                        </label>
                        <input
                          id="sign-up-password"
                          className="auth-input"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Create a secure password"
                          value={signUpPassword}
                          onChange={(event) => setSignUpPassword(event.target.value)}
                        />

                        <label className="auth-label" htmlFor="sign-up-company">
                          Company name
                        </label>
                        <input
                          id="sign-up-company"
                          className="auth-input"
                          type="text"
                          autoComplete="organization"
                          placeholder="Your company or operating entity"
                          value={signUpCompany}
                          onChange={(event) => setSignUpCompany(event.target.value)}
                        />

                        <button className="button button-primary button-block auth-submit" type="submit" disabled={signUpLoading}>
                          {signUpLoading ? "Creating account..." : "Create account"}
                        </button>
                      </form>

                      <div className="auth-divider">
                        <span>or continue with a connected account</span>
                      </div>

                      <div className="custom-social-stack">
                        <SocialButton
                          label="Sign up with Google"
                          mark="G"
                          onClick={() => startOAuth("sign-up", "oauth_google")}
                          disabled={oauthLoadingKey === "sign-up:oauth_google"}
                        />
                        <SocialButton
                          label="Sign up with Microsoft"
                          mark="M"
                          onClick={() => startOAuth("sign-up", "oauth_microsoft")}
                          disabled={oauthLoadingKey === "sign-up:oauth_microsoft"}
                        />
                        <SocialButton
                          label="Sign up with LinkedIn"
                          mark="in"
                          onClick={() => startOAuth("sign-up", "oauth_linkedin_oidc")}
                          disabled={oauthLoadingKey === "sign-up:oauth_linkedin_oidc"}
                        />
                      </div>

                      <AuthFeedback {...signUpFeedback} />

                      <div className="auth-signup-links">
                        <a className="ghost-link" href="#plan-comparison">
                          Compare one-time vs subscription
                        </a>
                        <a className="ghost-link" href="#subscription-plan">
                          Know more about subscription
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="custom-auth-step active">
                      <div className="verify-panel-copy">
                        <span className="plan-badge">Email verification</span>
                        <h3>Verify your work email</h3>
                        <p>
                          Enter the one-time code sent to {signUpEmail || "your inbox"} to activate
                          the account.
                        </p>
                      </div>

                      <form className="auth-form" onSubmit={handleSignUpVerify}>
                        <label className="auth-label" htmlFor="sign-up-code">
                          Verification code
                        </label>
                        <input
                          id="sign-up-code"
                          className="auth-input auth-code-input"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="123456"
                          value={signUpCode}
                          onChange={(event) => setSignUpCode(event.target.value)}
                        />

                        <button className="button button-primary button-block auth-submit" type="submit" disabled={signUpVerifyLoading}>
                          {signUpVerifyLoading ? "Verifying..." : "Verify and continue"}
                        </button>
                      </form>

                      <div className="auth-secondary-actions">
                        <button className="button button-secondary" type="button" onClick={resendSignUpCode}>
                          Resend code
                        </button>
                        <button className="button button-ghost" type="button" onClick={resetSignUp}>
                          Start over
                        </button>
                      </div>

                      <AuthFeedback {...signUpVerifyFeedback} />

                      <div className="auth-signup-links">
                        <a className="ghost-link" href="#plan-comparison">
                          Compare plans while you wait
                        </a>
                      </div>
                    </div>
                  )}
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
                    Role selection still happens after sign-up, so this section is here to clarify
                    the commercial path, not slow down account creation.
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
                  ongoing pricing visibility, and a cleaner workflow for repeated buying or selling.
                </p>
                <div className="subscription-signal-row">
                  <span>Repeat sourcing</span>
                  <span>Recurring supply</span>
                  <span>Shared team access</span>
                </div>
                <div className="workflow-links">
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => handlePlanJump("subscription")}
                  >
                    Continue with Subscription
                  </button>
                  <button className="button button-secondary" type="button" onClick={() => navigate("/contact")}>
                    Talk to Our Team
                  </button>
                </div>
              </div>

              <div className="subscription-grid">
                <article className="mini-card float-hover">
                  <strong>Always-on discovery</strong>
                  <p>Stay close to live supplier activity, buyer demand, and recurring opportunities.</p>
                </article>
                <article className="mini-card float-hover">
                  <strong>Stronger market context</strong>
                  <p>Track bid spreads, category demand, and buyer interest across magnets, motors, and HDD assemblies.</p>
                </article>
                <article className="mini-card float-hover">
                  <strong>Team workflows</strong>
                  <p>Support procurement, sales, and operations teams through one shared marketplace layer.</p>
                </article>
                <article className="mini-card float-hover">
                  <strong>Better continuity</strong>
                  <p>Best when supply resilience, repeat orders, and long-term buyer discovery matter more than a single trade.</p>
                </article>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </motion.main>
  );
}
