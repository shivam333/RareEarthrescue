import { useAuth, useClerk, UserButton } from "@clerk/react";
import { motion } from "framer-motion";
import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { pageEnter } from "../lib/motion";
import { normalizeRedirectPath, toAbsoluteAppUrl } from "../lib/site";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const compareRows = [
  {
    label: "Best for",
    oneTime: "Single lot execution and first-time participation",
    subscription: "Recurring sourcing, repeat listings, and active buyer programs",
    services: "High-touch supply programs, managed support, and tailored workflows",
  },
  {
    label: "Marketplace access",
    oneTime: "Focused access to complete one transaction",
    subscription: "Ongoing access to verified marketplace opportunities",
    services: "Coordinated access shaped around your operating model",
  },
  {
    label: "Visibility and discovery",
    oneTime: "Basic listing visibility and direct matching support",
    subscription: "Broader listing exposure, saved workflows, and recurring discovery",
    services: "Priority routing, service-led support, and structured engagement paths",
  },
  {
    label: "Commercial intelligence",
    oneTime: "High-level context around demand and counterparties",
    subscription: "Expanded signals, alerts, and procurement-facing intelligence layers",
    services: "Custom reporting, tailored oversight, and strategic planning support",
  },
  {
    label: "Operations support",
    oneTime: "Standard coordination for transaction completion",
    subscription: "Ongoing operational support for repeat marketplace activity",
    services: "White-glove coordination across sourcing, logistics, and account workflows",
  },
];

type AuthMode = "sign-in" | "sign-up";
type PlanType = "free" | "subscription";
type FeedbackTone = "error" | "success" | "neutral";

export function AuthPage() {
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const redirectTarget = normalizeRedirectPath(searchParams.get("redirect"));
  const step = searchParams.get("step");
  const modeFromUrl = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const [mode, setMode] = useState<AuthMode>(modeFromUrl);
  const [activePlan, setActivePlan] = useState<PlanType>("free");
  const [activeRole, setActiveRole] = useState("");

  const [signInForm, setSignInForm] = useState({ email: "", password: "", code: "" });
  const [signUpForm, setSignUpForm] = useState({ email: "", password: "", company: "", code: "" });
  const [signInFeedback, setSignInFeedback] = useState<{ tone: FeedbackTone; text: string } | null>(null);
  const [signUpFeedback, setSignUpFeedback] = useState<{ tone: FeedbackTone; text: string } | null>(null);
  const [signInVerifyVisible, setSignInVerifyVisible] = useState(false);
  const [signUpVerifyVisible, setSignUpVerifyVisible] = useState(false);
  const [signInAttempt, setSignInAttempt] = useState<any>(null);
  const [signUpAttempt, setSignUpAttempt] = useState<any>(null);
  const [signInBusy, setSignInBusy] = useState(false);
  const [signUpBusy, setSignUpBusy] = useState(false);

  const normalizedMode = useMemo<AuthMode>(() => (mode === "sign-up" ? "sign-up" : "sign-in"), [mode]);

  const setModeAndUrl = (nextMode: AuthMode) => {
    setMode(nextMode);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("mode", nextMode);
    nextParams.delete("step");
    setSearchParams(nextParams, { replace: true });
  };

  const setFeedback = (
    setter: Dispatch<SetStateAction<{ tone: FeedbackTone; text: string } | null>>,
    tone: FeedbackTone,
    text: string
  ) => setter({ tone, text });

  const clearFeedback = (
    setter: Dispatch<SetStateAction<{ tone: FeedbackTone; text: string } | null>>
  ) => setter(null);

  const getErrorMessage = (error: any, fallback = "Something went wrong. Please try again.") => {
    if (Array.isArray(error?.errors) && error.errors[0]) {
      return error.errors[0].longMessage || error.errors[0].message || fallback;
    }

    return error?.message || fallback;
  };

  const goToDashboard = async () => {
    navigate(redirectTarget, { replace: true });
  };

  const onSignInSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLoaded) return;

    clearFeedback(setSignInFeedback);
    setSignInBusy(true);

    try {
      const attempt: any = await clerk.client.signIn.create({
        identifier: signInForm.email,
        password: signInForm.password,
      });

      setSignInAttempt(attempt);

      if (attempt.status === "complete") {
        await clerk.setActive({ session: attempt.createdSessionId });
        await goToDashboard();
        return;
      }

      if (
        (attempt.status === "needs_second_factor" || attempt.status === "needs_client_trust") &&
        attempt.mfa?.sendEmailCode
      ) {
        await attempt.mfa.sendEmailCode();
        setSignInVerifyVisible(true);
        setFeedback(setSignInFeedback, "neutral", `Enter the verification code sent to ${signInForm.email}.`);
        return;
      }

      throw new Error("This account needs a verification method that is not yet enabled in the React flow.");
    } catch (error) {
      setFeedback(setSignInFeedback, "error", getErrorMessage(error));
    } finally {
      setSignInBusy(false);
    }
  };

  const onSignInVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!signInAttempt) return;

    clearFeedback(setSignInFeedback);
    setSignInBusy(true);

    try {
      await signInAttempt.mfa.verifyEmailCode({ code: signInForm.code });

      if (signInAttempt.status === "complete") {
        await clerk.setActive({ session: signInAttempt.createdSessionId });
        await goToDashboard();
        return;
      }

      throw new Error("Verification is incomplete. Please request a new code.");
    } catch (error) {
      setFeedback(setSignInFeedback, "error", getErrorMessage(error));
    } finally {
      setSignInBusy(false);
    }
  };

  const onSignUpSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLoaded) return;

    clearFeedback(setSignUpFeedback);
    setSignUpBusy(true);

    try {
      const attempt: any = await clerk.client.signUp.create({
        emailAddress: signUpForm.email,
        password: signUpForm.password,
        unsafeMetadata: {
          plan: activePlan,
          companyName: signUpForm.company,
        },
      });

      setSignUpAttempt(attempt);
      await attempt.prepareEmailAddressVerification({ strategy: "email_code" });
      setSignUpVerifyVisible(true);
      setFeedback(setSignUpFeedback, "neutral", `Enter the verification code sent to ${signUpForm.email}.`);
    } catch (error) {
      setFeedback(setSignUpFeedback, "error", getErrorMessage(error));
    } finally {
      setSignUpBusy(false);
    }
  };

  const onSignUpVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!signUpAttempt) return;

    clearFeedback(setSignUpFeedback);
    setSignUpBusy(true);

    try {
      const result: any = await signUpAttempt.attemptEmailAddressVerification({
        code: signUpForm.code,
      });

      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        const nextParams = new URLSearchParams();
        nextParams.set("mode", "sign-up");
        nextParams.set("step", "role");
        nextParams.set("redirect", redirectTarget);
        navigate(`/sign-in?${nextParams.toString()}`, { replace: true });
        return;
      }

      throw new Error("Verification is incomplete. Please request a new code.");
    } catch (error) {
      setFeedback(setSignUpFeedback, "error", getErrorMessage(error));
    } finally {
      setSignUpBusy(false);
    }
  };

  const resendSignInCode = async () => {
    try {
      await signInAttempt?.mfa?.sendEmailCode?.();
      setFeedback(setSignInFeedback, "success", "A new verification code has been sent.");
    } catch (error) {
      setFeedback(setSignInFeedback, "error", getErrorMessage(error));
    }
  };

  const resendSignUpCode = async () => {
    try {
      await signUpAttempt?.prepareEmailAddressVerification?.({ strategy: "email_code" });
      setFeedback(setSignUpFeedback, "success", "A new verification code has been sent.");
    } catch (error) {
      setFeedback(setSignUpFeedback, "error", getErrorMessage(error));
    }
  };

  const startOAuth = async (flow: "sign-in" | "sign-up", strategy: string) => {
    const callbackUrl = toAbsoluteAppUrl(`/oauth-callback?redirect=${encodeURIComponent(redirectTarget)}&mode=${flow}`);
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
          unsafeMetadata:
            flow === "sign-up"
              ? {
                  plan: activePlan,
                  companyName: signUpForm.company,
                }
              : undefined,
        });
        return;
      }

      throw new Error("Social sign-in is not available for this Clerk configuration.");
    } catch (error) {
      const message = getErrorMessage(error, "We could not start the social sign-in flow.");
      if (flow === "sign-up") {
        setFeedback(setSignUpFeedback, "error", message);
      } else {
        setFeedback(setSignInFeedback, "error", message);
      }
    }
  };

  const continueFromRole = () => {
    if (!activeRole) {
      return;
    }

    const nextUrl = new URL(redirectTarget, window.location.origin);
    nextUrl.searchParams.set("role", activeRole);
    navigate(`${nextUrl.pathname}${nextUrl.search}`, { replace: true });
  };

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <MotionItem className="section-header">
            <p className="eyebrow">Buyer and Supplier Access</p>
            <h1 className="heading-1 max-w-[12ch]">Access the rare earth recovery network.</h1>
            <p className="lede">
              Built for suppliers, recyclers, and procurement teams operating across fragmented
              rare earth supply chains.
            </p>
          </MotionItem>

          <MotionItem>
            <div className="panel overflow-hidden p-5 sm:p-7">
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-[#d6cfc2] bg-[rgba(255,255,255,0.6)] p-1.5">
                <button
                  className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                    normalizedMode === "sign-in"
                      ? "bg-[#12293f] text-white"
                      : "text-[#5d6d7d] hover:text-[#12293f]"
                  }`}
                  onClick={() => setModeAndUrl("sign-in")}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                    normalizedMode === "sign-up"
                      ? "bg-[#12293f] text-white"
                      : "text-[#5d6d7d] hover:text-[#12293f]"
                  }`}
                  onClick={() => setModeAndUrl("sign-up")}
                  type="button"
                >
                  Create Account
                </button>
              </div>

              {isSignedIn && step === "role" ? (
                <div className="grid gap-5">
                  <div className="grid gap-3 text-center">
                    <p className="eyebrow mb-0">Role selection</p>
                    <h2 className="heading-3">How will you use Rare Earth Rescue?</h2>
                    <p className="body-copy text-sm sm:text-base">
                      We’ll tailor your workspace and recommendations based on your primary role.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      ["supplier", "Supplier", "List and sell feedstock into the network."],
                      ["recycler", "Recycler", "Discover and source materials from verified suppliers."],
                      ["both", "Both", "Operate on both sides of the marketplace."],
                    ].map(([id, title, copy]) => (
                      <button
                        className={`rounded-[24px] border p-5 text-left transition ${
                          activeRole === id
                            ? "border-[#12293f] bg-[#12293f] text-white"
                            : "border-[#d6cfc2] bg-[rgba(255,252,247,0.82)] text-[#12293f] hover:-translate-y-0.5"
                        }`}
                        key={id}
                        onClick={() => setActiveRole(id)}
                        type="button"
                      >
                        <strong className="block font-display text-xl tracking-[-0.03em]">{title}</strong>
                        <span className="mt-2 block text-sm leading-7 opacity-80">{copy}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <Button className={!activeRole ? "pointer-events-none opacity-50" : ""} onClick={continueFromRole}>
                      Continue
                    </Button>
                  </div>
                </div>
              ) : isSignedIn ? (
                <div className="grid gap-5 text-center">
                  <div className="flex justify-center">
                    <UserButton />
                  </div>
                  <div>
                    <p className="eyebrow">Signed in</p>
                    <h2 className="heading-3">Your account is active.</h2>
                    <p className="body-copy mt-3 text-sm sm:text-base">
                      Continue into the dashboard to manage listings, supplier activity, and procurement workflows.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button href={redirectTarget}>Go to Dashboard</Button>
                    <Button href="/" variant="secondary">
                      Back to Homepage
                    </Button>
                  </div>
                </div>
              ) : normalizedMode === "sign-in" ? (
                <div className="grid gap-5">
                  {!signInVerifyVisible ? (
                    <>
                      <div className="grid gap-3">
                        <h2 className="heading-3">Welcome back</h2>
                        <p className="body-copy text-sm sm:text-base">
                          Manage listings, orders, and supply relationships.
                        </p>
                      </div>

                      <div className="grid gap-3">
                        {[
                          ["oauth_google", "Continue with Google", "G"],
                          ["oauth_microsoft", "Continue with Microsoft", "M"],
                          ["oauth_linkedin_oidc", "Continue with LinkedIn", "in"],
                        ].map(([strategy, label, mark]) => (
                          <button
                            className="flex items-center gap-3 rounded-[22px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.95)] px-4 py-4 text-left font-semibold text-[#12293f] transition hover:-translate-y-0.5"
                            key={strategy}
                            onClick={() => startOAuth("sign-in", strategy)}
                            type="button"
                          >
                            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(145deg,rgba(184,139,60,0.16),rgba(111,138,85,0.14))] font-display text-sm font-extrabold">
                              {mark}
                            </span>
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm text-[#7d7568]">
                        <span className="h-px bg-[#d6cfc2]" />
                        <span>or use your work email</span>
                        <span className="h-px bg-[#d6cfc2]" />
                      </div>

                      <form className="grid gap-3" onSubmit={onSignInSubmit}>
                        <label className="grid gap-2 text-sm font-semibold text-[#12293f]">
                          Work email
                          <input
                            className="rounded-[18px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.96)] px-4 py-3.5 text-[#12293f] outline-none transition focus:border-[#12293f]"
                            onChange={(event) =>
                              setSignInForm((current) => ({ ...current, email: event.target.value }))
                            }
                            placeholder="name@company.com"
                            type="email"
                            value={signInForm.email}
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-[#12293f]">
                          Password
                          <input
                            className="rounded-[18px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.96)] px-4 py-3.5 text-[#12293f] outline-none transition focus:border-[#12293f]"
                            onChange={(event) =>
                              setSignInForm((current) => ({ ...current, password: event.target.value }))
                            }
                            placeholder="Enter your password"
                            type="password"
                            value={signInForm.password}
                          />
                        </label>
                        <Button className="w-full justify-center" type="submit">
                          {signInBusy ? "Continuing..." : "Continue"}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-3">
                        <p className="eyebrow mb-0">Verification required</p>
                        <h2 className="heading-3">Check your inbox</h2>
                        <p className="body-copy text-sm sm:text-base">
                          Enter the code sent to {signInForm.email} to complete the sign-in.
                        </p>
                      </div>
                      <form className="grid gap-3" onSubmit={onSignInVerify}>
                        <label className="grid gap-2 text-sm font-semibold text-[#12293f]">
                          Verification code
                          <input
                            className="rounded-[18px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.96)] px-4 py-3.5 text-[#12293f] outline-none transition focus:border-[#12293f]"
                            onChange={(event) =>
                              setSignInForm((current) => ({ ...current, code: event.target.value }))
                            }
                            placeholder="123456"
                            value={signInForm.code}
                          />
                        </label>
                        <Button className="w-full justify-center" type="submit">
                          {signInBusy ? "Verifying..." : "Verify and continue"}
                        </Button>
                      </form>
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={resendSignInCode} variant="secondary">
                          Resend code
                        </Button>
                        <Button
                          onClick={() => {
                            setSignInVerifyVisible(false);
                            setSignInAttempt(null);
                            clearFeedback(setSignInFeedback);
                          }}
                          variant="ghost"
                        >
                          Start over
                        </Button>
                      </div>
                    </>
                  )}

                  {signInFeedback ? (
                    <div
                      className={`rounded-[18px] border px-4 py-3 text-sm leading-7 ${
                        signInFeedback.tone === "error"
                          ? "border-[rgba(198,120,105,0.28)] bg-[rgba(198,120,105,0.12)] text-[#8c473c]"
                          : signInFeedback.tone === "success"
                            ? "border-[rgba(111,138,85,0.26)] bg-[rgba(111,138,85,0.12)] text-[#50663a]"
                            : "border-[#d6cfc2] bg-[rgba(255,252,247,0.78)] text-[#5d6d7d]"
                      }`}
                    >
                      {signInFeedback.text}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="grid gap-5">
                  {!signUpVerifyVisible ? (
                    <>
                      <div className="grid gap-3">
                        <h2 className="heading-3">Create your account</h2>
                        <p className="body-copy text-sm sm:text-base">
                          Start with secure account creation, then compare access paths below.
                        </p>
                      </div>

                      <form className="grid gap-3" onSubmit={onSignUpSubmit}>
                        <label className="grid gap-2 text-sm font-semibold text-[#12293f]">
                          Work email
                          <input
                            className="rounded-[18px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.96)] px-4 py-3.5 text-[#12293f] outline-none transition focus:border-[#12293f]"
                            onChange={(event) =>
                              setSignUpForm((current) => ({ ...current, email: event.target.value }))
                            }
                            placeholder="name@company.com"
                            type="email"
                            value={signUpForm.email}
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-[#12293f]">
                          Create password
                          <input
                            className="rounded-[18px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.96)] px-4 py-3.5 text-[#12293f] outline-none transition focus:border-[#12293f]"
                            onChange={(event) =>
                              setSignUpForm((current) => ({ ...current, password: event.target.value }))
                            }
                            placeholder="Create a secure password"
                            type="password"
                            value={signUpForm.password}
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-[#12293f]">
                          Company name
                          <input
                            className="rounded-[18px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.96)] px-4 py-3.5 text-[#12293f] outline-none transition focus:border-[#12293f]"
                            onChange={(event) =>
                              setSignUpForm((current) => ({ ...current, company: event.target.value }))
                            }
                            placeholder="Your company or operating entity"
                            value={signUpForm.company}
                          />
                        </label>
                        <Button className="w-full justify-center" type="submit">
                          {signUpBusy ? "Creating account..." : "Create account"}
                        </Button>
                      </form>

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm text-[#7d7568]">
                        <span className="h-px bg-[#d6cfc2]" />
                        <span>or continue with a connected account</span>
                        <span className="h-px bg-[#d6cfc2]" />
                      </div>

                      <div className="grid gap-3">
                        {[
                          ["oauth_google", "Sign up with Google", "G"],
                          ["oauth_microsoft", "Sign up with Microsoft", "M"],
                          ["oauth_linkedin_oidc", "Sign up with LinkedIn", "in"],
                        ].map(([strategy, label, mark]) => (
                          <button
                            className="flex items-center gap-3 rounded-[22px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.95)] px-4 py-4 text-left font-semibold text-[#12293f] transition hover:-translate-y-0.5"
                            key={strategy}
                            onClick={() => startOAuth("sign-up", strategy)}
                            type="button"
                          >
                            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(145deg,rgba(184,139,60,0.16),rgba(111,138,85,0.14))] font-display text-sm font-extrabold">
                              {mark}
                            </span>
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-3">
                        <p className="eyebrow mb-0">Email verification</p>
                        <h2 className="heading-3">Verify your work email</h2>
                        <p className="body-copy text-sm sm:text-base">
                          Enter the code sent to {signUpForm.email} to activate the account.
                        </p>
                      </div>
                      <form className="grid gap-3" onSubmit={onSignUpVerify}>
                        <label className="grid gap-2 text-sm font-semibold text-[#12293f]">
                          Verification code
                          <input
                            className="rounded-[18px] border border-[#d6cfc2] bg-[rgba(255,252,247,0.96)] px-4 py-3.5 text-[#12293f] outline-none transition focus:border-[#12293f]"
                            onChange={(event) =>
                              setSignUpForm((current) => ({ ...current, code: event.target.value }))
                            }
                            placeholder="123456"
                            value={signUpForm.code}
                          />
                        </label>
                        <Button className="w-full justify-center" type="submit">
                          {signUpBusy ? "Verifying..." : "Verify and continue"}
                        </Button>
                      </form>
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={resendSignUpCode} variant="secondary">
                          Resend code
                        </Button>
                        <Button
                          onClick={() => {
                            setSignUpVerifyVisible(false);
                            setSignUpAttempt(null);
                            clearFeedback(setSignUpFeedback);
                          }}
                          variant="ghost"
                        >
                          Start over
                        </Button>
                      </div>
                    </>
                  )}

                  {signUpFeedback ? (
                    <div
                      className={`rounded-[18px] border px-4 py-3 text-sm leading-7 ${
                        signUpFeedback.tone === "error"
                          ? "border-[rgba(198,120,105,0.28)] bg-[rgba(198,120,105,0.12)] text-[#8c473c]"
                          : signUpFeedback.tone === "success"
                            ? "border-[rgba(111,138,85,0.26)] bg-[rgba(111,138,85,0.12)] text-[#50663a]"
                            : "border-[#d6cfc2] bg-[rgba(255,252,247,0.78)] text-[#5d6d7d]"
                      }`}
                    >
                      {signUpFeedback.text}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#5d6d7d]">
                    <a href="#plan-comparison">Compare one-time vs subscription</a>
                    <a href="#subscription-plan">Know more about subscription</a>
                  </div>
                </div>
              )}
            </div>
          </MotionItem>
        </div>
      </section>

      <MotionSection className="section-gap shell" id="plan-comparison">
        <div className="section-header">
          <p className="eyebrow">Compare Access Paths</p>
          <h2 className="heading-2">Choose the right operating model for your recovery workflow.</h2>
          <p className="section-copy body-copy">
            Use this as a working outline for one-off trades, recurring marketplace participation,
            and tailored service-led programs. We’ll refine the exact content and feature differences later.
          </p>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {[
            {
              id: "free" as const,
              badge: "One-time",
              title: "One-Time Order",
              copy: "For a single material movement, fast buyer discovery, and initial platform use.",
              cta: "Start account",
              href: "/sign-in?mode=sign-up",
            },
            {
              id: "subscription" as const,
              badge: "Subscription",
              title: "Marketplace Access",
              copy: "For repeat buying and selling, recurring visibility, alerts, and procurement intelligence.",
              cta: "Request subscription access",
              href: "/sign-in?mode=sign-up",
              featured: true,
            },
            {
              id: "services" as const,
              badge: "Services",
              title: "Strategic Services",
              copy: "For larger operators who need tailored workflows, coordinated sourcing, and managed support.",
              cta: "Request services",
              href: "/contact",
            },
          ].map((plan, index) => (
            <MotionItem key={plan.title}>
              <article
                className={`panel relative grid min-h-[280px] gap-4 overflow-hidden p-6 ${
                  plan.featured ? "border-[#b28d4c] bg-[rgba(255,250,240,0.95)]" : ""
                }`}
              >
                {plan.featured ? (
                  <span className="badge w-fit border-[#e2d6bc] bg-[#f2ead9] text-[#7a5c21]">
                    Preferred ongoing path
                  </span>
                ) : null}
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#d7ccbd] bg-[linear-gradient(145deg,rgba(184,139,60,0.16),rgba(111,138,85,0.12))] font-display text-lg font-extrabold text-[#11283d]">
                  {index + 1}
                </div>
                <span className="badge w-fit">{plan.badge}</span>
                <div className="grid gap-3">
                  <h3 className="heading-3">{plan.title}</h3>
                  <p className="body-copy text-sm sm:text-base">{plan.copy}</p>
                </div>
                {plan.id === "subscription" ? (
                  <button
                    className="button-primary mt-auto"
                    onClick={() => {
                      setActivePlan("subscription");
                      setModeAndUrl("sign-up");
                      window.location.hash = "top";
                    }}
                    type="button"
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Button className="mt-auto" href={plan.href} variant={plan.featured ? "primary" : "secondary"}>
                    {plan.cta}
                  </Button>
                )}
              </article>
            </MotionItem>
          ))}
        </div>

        <MotionItem className="panel mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse">
              <thead>
                <tr className="bg-[rgba(255,251,244,0.82)]">
                  <th className="border-b border-[#d6cfc2] px-5 py-4 text-left font-display text-sm text-[#11283d]">
                    Plans
                  </th>
                  <th className="border-b border-[#d6cfc2] px-5 py-4 text-left font-display text-sm text-[#11283d]">
                    One-Time Order
                  </th>
                  <th className="border-b border-[#d6cfc2] px-5 py-4 text-left font-display text-sm text-[#11283d]">
                    Marketplace Access
                  </th>
                  <th className="border-b border-[#d6cfc2] px-5 py-4 text-left font-display text-sm text-[#11283d]">
                    Strategic Services
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr className="transition hover:bg-[rgba(255,252,247,0.72)]" key={row.label}>
                    <td className="border-b border-[#d6cfc2] px-5 py-4 font-semibold text-[#11283d]">{row.label}</td>
                    <td className="border-b border-[#d6cfc2] px-5 py-4 text-sm leading-7 text-[#5d6d7d]">{row.oneTime}</td>
                    <td className="border-b border-[#d6cfc2] px-5 py-4 text-sm leading-7 text-[#5d6d7d]">{row.subscription}</td>
                    <td className="border-b border-[#d6cfc2] px-5 py-4 text-sm leading-7 text-[#5d6d7d]">{row.services}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionItem>
      </MotionSection>

      <MotionSection className="section-gap shell" id="subscription-plan">
        <div className="panel grid gap-6 p-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            <p className="eyebrow">Know More</p>
            <h2 className="heading-2">Subscription is built for repeat operators across the recovery chain.</h2>
            <p className="body-copy">
              Choose this path when your team needs continuing access to fragmented supply, ongoing
              pricing visibility, and cleaner workflows for repeated buying or selling.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="button-primary"
                onClick={() => {
                  setActivePlan("subscription");
                  setModeAndUrl("sign-up");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                type="button"
              >
                Continue with subscription
              </button>
              <Button href="/contact" variant="secondary">
                Talk to our team
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Marketplace continuity", "Stay visible to verified participants and keep repeat feedstock programs active."],
              ["Commercial intelligence", "Track bid spreads, category demand, and market signals across magnets, motors, and HDD assemblies."],
              ["Team workflows", "Support procurement teams, scrapyards, and recyclers with a shared operating layer for sourcing."],
              ["Strategic support", "Use subscription when supply resilience, recurring orders, and buyer discovery matter more than a single trade."],
            ].map(([title, copy]) => (
              <article className="panel p-5" key={title}>
                <strong className="font-display text-xl tracking-[-0.03em] text-[#11283d]">{title}</strong>
                <p className="mt-3 text-sm leading-7 text-[#5d6d7d]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>
    </motion.main>
  );
}
