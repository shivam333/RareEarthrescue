import { SignIn, UserButton, useAuth, useClerk, useUser } from "@clerk/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { normalizeAccountRole, persistDashboardMode, resolveActiveDashboardMode } from "../lib/accountRole";
import { pageEnter } from "../lib/motion";
import {
  getAuthRedirectTarget,
  getSignInUrl,
  getSignUpUrl,
  normalizeRedirectPath,
  toAbsoluteAppUrl,
} from "../lib/site";

type AuthMode = "sign-in" | "sign-up";
type AuthRole = "supplier" | "recycler" | "both";

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

function getClerkErrorMessage(error: any) {
  return (
    error?.errors?.[0]?.longMessage ||
    error?.errors?.[0]?.message ||
    error?.message ||
    "We could not complete that authentication step."
  );
}

function isExistingAccountError(error: any) {
  return (error?.errors ?? []).some((issue: any) =>
    ["form_identifier_exists", "form_identifier_exists__email_address"].includes(issue?.code)
  );
}

export function AuthPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMode: AuthMode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const stepParam = searchParams.get("step");
  const redirectTarget = getAuthRedirectTarget(searchParams);
  const signUp = isLoaded ? clerk.client?.signUp ?? null : null;
  const isSignUpReady = Boolean(signUp);

  const [activeRole, setActiveRole] = useState<AuthRole | "">("");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [signUpFields, setSignUpFields] = useState({
    emailAddress: searchParams.get("email_address") || "",
    password: "",
    companyName: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpInfo, setSignUpInfo] = useState("");
  const [isSubmittingSignUp, setIsSubmittingSignUp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  useEffect(() => {
    document.body.dataset.authPage = "sign-in";
    document.body.classList.add("home-page", "auth-page-body");

    return () => {
      delete document.body.dataset.authPage;
      document.body.classList.remove("home-page", "auth-page-body");
    };
  }, []);

  useEffect(() => {
    if (stepParam !== "role" || !user) return;

    setActiveRole((currentRole) =>
      currentRole || normalizeAccountRole(user.unsafeMetadata?.accountRole) || "recycler"
    );
  }, [stepParam, user]);

  const setMode = (mode: AuthMode) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    params.delete("step");
    setSearchParams(params, { replace: true });
  };

  const continueWithRole = async () => {
    if (!activeRole || !user) return;

    try {
      setIsSavingRole(true);
      await user.update({
        unsafeMetadata: {
          ...(user.unsafeMetadata ?? {}),
          accountRole: activeRole,
          initialAccountRole:
            user.unsafeMetadata?.initialAccountRole ?? user.unsafeMetadata?.accountRole ?? activeRole,
        },
      });

      persistDashboardMode(resolveActiveDashboardMode(activeRole));

      const nextTarget = normalizeRedirectPath(redirectTarget);
      const nextUrl = new URL(nextTarget, window.location.origin);
      navigate(`${nextUrl.pathname}${nextUrl.search}`, { replace: true });
    } finally {
      setIsSavingRole(false);
    }
  };

  const signInForceRedirectUrl = toAbsoluteAppUrl(redirectTarget);
  const signUpRoleRedirectUrl = toAbsoluteAppUrl(
    `/sign-in?mode=sign-up&step=role&redirect_url=${encodeURIComponent(redirectTarget)}`
  );

  const signInInitialValues = useMemo(() => {
    const email = searchParams.get("email_address") || "";
    return email ? { emailAddress: email } : undefined;
  }, [searchParams]);

  const signInFeedback = useMemo(() => {
    const message = searchParams.get("message");

    if (message === "account-exists") {
      return "That account already exists. Sign in to continue.";
    }

    return "";
  }, [searchParams]);

  const updateSignUpField = (field: "emailAddress" | "password" | "companyName", value: string) => {
    setSignUpFields((current) => ({ ...current, [field]: value }));
  };

  const socialRedirectUrl = toAbsoluteAppUrl(
    `/oauth-callback?redirect=${encodeURIComponent(redirectTarget)}`
  );

  const runSocialSignUp = async (strategy: "oauth_google" | "oauth_microsoft" | "oauth_linkedin_oidc") => {
    if (!signUp) return;

    setSignUpError("");

    await signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: socialRedirectUrl,
      redirectUrlComplete: signUpRoleRedirectUrl,
      continueSignIn: true,
      continueSignUp: true,
    });
  };

  const submitCustomSignUp = async () => {
    if (!signUp) return;

    const emailAddress = signUpFields.emailAddress.trim();
    if (!emailAddress || !signUpFields.password) {
      setSignUpError("Enter your work email and password to create an account.");
      return;
    }

    try {
      setIsSubmittingSignUp(true);
      setSignUpError("");
      setSignUpInfo("");

      const signUpAttempt = await signUp.create({
        emailAddress,
        password: signUpFields.password,
        unsafeMetadata: {
          companyName: signUpFields.companyName.trim() || undefined,
        },
      });

      if (signUpAttempt.status === "complete" && signUpAttempt.createdSessionId) {
        await clerk.setActive({ session: signUpAttempt.createdSessionId });
        navigate(`/sign-in?mode=sign-up&step=role&redirect_url=${encodeURIComponent(redirectTarget)}`, {
          replace: true,
        });
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setSignUpInfo("We sent a verification code to your email. Enter it below to activate the account.");
    } catch (error: any) {
      if (isExistingAccountError(error)) {
        navigate(
          `/sign-in?mode=sign-in&message=account-exists&email_address=${encodeURIComponent(
            emailAddress
          )}&redirect_url=${encodeURIComponent(redirectTarget)}`,
          { replace: true }
        );
        return;
      }

      setSignUpError(getClerkErrorMessage(error));
    } finally {
      setIsSubmittingSignUp(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!signUp) return;

    try {
      setIsVerifyingEmail(true);
      setSignUpError("");

      const verificationAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (verificationAttempt.status !== "complete" || !verificationAttempt.createdSessionId) {
        setSignUpError("We could not verify that code. Please check it and try again.");
        return;
      }

      await clerk.setActive({ session: verificationAttempt.createdSessionId });
      navigate(`/sign-in?mode=sign-up&step=role&redirect_url=${encodeURIComponent(redirectTarget)}`, {
        replace: true,
      });
    } catch (error: any) {
      setSignUpError(getClerkErrorMessage(error));
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!signUp) return;

    try {
      setSignUpError("");
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setSignUpInfo("A fresh verification code has been sent to your email.");
    } catch (error: any) {
      setSignUpError(getClerkErrorMessage(error));
    }
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
                      {signInFeedback ? (
                        <div className="auth-feedback mb-4" data-tone="neutral">
                          {signInFeedback}
                        </div>
                      ) : null}
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
                        Account creation stays lightweight here. Choose supplier, recycler, or both
                        after secure sign-up is complete.
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          { label: "Google", strategy: "oauth_google" as const },
                          { label: "Microsoft", strategy: "oauth_microsoft" as const },
                          { label: "LinkedIn", strategy: "oauth_linkedin_oidc" as const },
                        ].map((provider) => (
                          <button
                            key={provider.label}
                            type="button"
                            onClick={() => runSocialSignUp(provider.strategy)}
                            disabled={!isSignUpReady || isSubmittingSignUp || isVerifyingEmail}
                            className="rounded-[20px] border border-[#ddd4c7] bg-white/86 px-4 py-4 text-[0.96rem] font-semibold text-[#2f3426] transition hover:bg-white disabled:opacity-60"
                          >
                            Continue with {provider.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                        <span className="h-px flex-1 bg-[#e6ddcf]" />
                        <span>or</span>
                        <span className="h-px flex-1 bg-[#e6ddcf]" />
                      </div>

                      {signUpError ? (
                        <div className="auth-feedback" data-tone="error">
                          {signUpError}
                        </div>
                      ) : null}

                      {signUpInfo ? (
                        <div className="auth-feedback" data-tone="success">
                          {signUpInfo}
                        </div>
                      ) : null}

                      {!pendingVerification ? (
                        <div className="grid gap-4">
                          <label className="grid gap-2 text-left">
                            <span className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#8a7b65]">
                              Work email
                            </span>
                            <input
                              type="email"
                              value={signUpFields.emailAddress}
                              onChange={(event) => updateSignUpField("emailAddress", event.target.value)}
                              placeholder="name@company.com"
                              className="min-h-[3.7rem] rounded-[20px] border border-[#ddd4c7] bg-white/88 px-4 text-[1rem] font-medium text-[#2f3426] outline-none"
                            />
                          </label>

                          <label className="grid gap-2 text-left">
                            <span className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#8a7b65]">
                              Password
                            </span>
                            <input
                              type="password"
                              value={signUpFields.password}
                              onChange={(event) => updateSignUpField("password", event.target.value)}
                              placeholder="Create a secure password"
                              className="min-h-[3.7rem] rounded-[20px] border border-[#ddd4c7] bg-white/88 px-4 text-[1rem] font-medium text-[#2f3426] outline-none"
                            />
                          </label>

                          <label className="grid gap-2 text-left">
                            <span className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#8a7b65]">
                              Company name
                            </span>
                            <input
                              type="text"
                              value={signUpFields.companyName}
                              onChange={(event) => updateSignUpField("companyName", event.target.value)}
                              placeholder="Optional"
                              className="min-h-[3.7rem] rounded-[20px] border border-[#ddd4c7] bg-white/88 px-4 text-[1rem] font-medium text-[#2f3426] outline-none"
                            />
                          </label>

                          <button
                            className={`button button-primary ${isSubmittingSignUp ? "is-disabled" : ""}`}
                            type="button"
                            onClick={submitCustomSignUp}
                            disabled={isSubmittingSignUp}
                          >
                            {isSubmittingSignUp ? "Creating account..." : "Create Account"}
                          </button>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          <label className="grid gap-2 text-left">
                            <span className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-[#8a7b65]">
                              Email verification code
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={verificationCode}
                              onChange={(event) => setVerificationCode(event.target.value)}
                              placeholder="Enter the code from your inbox"
                              className="min-h-[3.7rem] rounded-[20px] border border-[#ddd4c7] bg-white/88 px-4 text-[1rem] font-medium text-[#2f3426] outline-none"
                            />
                          </label>

                          <div className="auth-secondary-actions">
                            <button
                              className={`button button-primary ${isVerifyingEmail ? "is-disabled" : ""}`}
                              type="button"
                              onClick={verifyEmailCode}
                              disabled={isVerifyingEmail}
                            >
                              {isVerifyingEmail ? "Verifying..." : "Verify Email"}
                            </button>
                            <button className="button button-secondary" type="button" onClick={resendVerificationCode}>
                              Resend code
                            </button>
                          </div>
                        </div>
                      )}

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
                  {([
                    { id: "supplier", title: "Supplier", copy: "List and sell feedstock." },
                    { id: "recycler", title: "Recycler", copy: "Discover and source materials." },
                    { id: "both", title: "Both", copy: "Operate on both sides of the network." },
                  ] as { id: AuthRole; title: string; copy: string }[]).map((role) => (
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
                    className={`button button-primary ${!activeRole || isSavingRole ? "is-disabled" : ""}`}
                    type="button"
                    onClick={continueWithRole}
                    disabled={!activeRole || isSavingRole}
                  >
                    {isSavingRole ? "Saving..." : "Continue"}
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
