import { useAuth, useClerk } from "@clerk/react";
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";
import staticSignInHtml from "../static-html/sign-in.html?raw";
import { normalizeRedirectPath, toAbsoluteAppUrl } from "../lib/site";

type FeedbackTone = "error" | "success" | "neutral";

function setFeedback(node: HTMLElement | null, text = "", tone: FeedbackTone = "neutral") {
  if (!node) return;

  if (!text) {
    node.hidden = true;
    node.textContent = "";
    node.dataset.tone = "";
    return;
  }

  node.hidden = false;
  node.textContent = text;
  node.dataset.tone = tone;
}

function setButtonLoading(button: HTMLButtonElement | null, isLoading: boolean, label: string) {
  if (!button) return;

  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = button.textContent || "";
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? label : button.dataset.defaultLabel;
}

function getErrorMessage(error: any, fallback = "Something went wrong. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors[0]) {
    return error.errors[0].longMessage || error.errors[0].message || fallback;
  }

  return error?.message || fallback;
}

export function AuthPage() {
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const setupAuthPage = useCallback(
    (container: HTMLDivElement) => {
      const redirectTarget = normalizeRedirectPath(searchParams.get("redirect"));
      const stepParam = searchParams.get("step");
      const initialMode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
      let currentMode: "sign-in" | "sign-up" = initialMode;
      let activePlan: "free" | "subscription" = "free";
      let activeRole = "";
      let signInAttempt: any = null;
      let signUpAttempt: any = null;

      const authModePanels = Array.from(container.querySelectorAll<HTMLElement>("[data-auth-panel]"));
      const authTabButtons = Array.from(container.querySelectorAll<HTMLElement>("[data-auth-mode]"));
      const planCards = Array.from(container.querySelectorAll<HTMLElement>("[data-plan]"));
      const planJumpButtons = Array.from(container.querySelectorAll<HTMLElement>("[data-plan-jump]"));
      const roleCards = Array.from(container.querySelectorAll<HTMLElement>("[data-role]"));
      const roleContinueButton = container.querySelector<HTMLAnchorElement>("#role-continue-button");
      const roleSelectionPanel = container.querySelector<HTMLElement>("#role-selection-panel");
      const signedInPanel = container.querySelector<HTMLElement>("#signed-in-panel");
      const signedInUserButton = container.querySelector<HTMLElement>("#signed-in-user-button");

      const signInFormStep = container.querySelector<HTMLElement>("#sign-in-form-step");
      const signInVerifyStep = container.querySelector<HTMLElement>("#sign-in-verify-step");
      const signUpFormStep = container.querySelector<HTMLElement>("#sign-up-form-step");
      const signUpVerifyStep = container.querySelector<HTMLElement>("#sign-up-verify-step");

      const signInForm = container.querySelector<HTMLFormElement>("#custom-sign-in-form");
      const signInVerifyForm = container.querySelector<HTMLFormElement>("#custom-sign-in-verify-form");
      const signUpForm = container.querySelector<HTMLFormElement>("#custom-sign-up-form");
      const signUpVerifyForm = container.querySelector<HTMLFormElement>("#custom-sign-up-verify-form");

      const signInEmailInput = container.querySelector<HTMLInputElement>("#sign-in-email");
      const signInPasswordInput = container.querySelector<HTMLInputElement>("#sign-in-password");
      const signInCodeInput = container.querySelector<HTMLInputElement>("#sign-in-code");
      const signUpEmailInput = container.querySelector<HTMLInputElement>("#sign-up-email");
      const signUpPasswordInput = container.querySelector<HTMLInputElement>("#sign-up-password");
      const signUpCompanyInput = container.querySelector<HTMLInputElement>("#sign-up-company");
      const signUpCodeInput = container.querySelector<HTMLInputElement>("#sign-up-code");

      const signInFeedback = container.querySelector<HTMLElement>("#sign-in-feedback");
      const signInVerifyFeedback = container.querySelector<HTMLElement>("#sign-in-verify-feedback");
      const signUpFeedback = container.querySelector<HTMLElement>("#sign-up-feedback");
      const signUpVerifyFeedback = container.querySelector<HTMLElement>("#sign-up-verify-feedback");

      const signInSubmitButton = container.querySelector<HTMLButtonElement>("#sign-in-submit");
      const signInVerifyButton = container.querySelector<HTMLButtonElement>("#sign-in-verify-submit");
      const signUpSubmitButton = container.querySelector<HTMLButtonElement>("#sign-up-submit");
      const signUpVerifyButton = container.querySelector<HTMLButtonElement>("#sign-up-verify-submit");

      const signInVerifyCopy = container.querySelector<HTMLElement>("#sign-in-verify-copy");
      const signUpVerifyCopy = container.querySelector<HTMLElement>("#sign-up-verify-copy");
      const signInResend = container.querySelector<HTMLButtonElement>("#sign-in-resend");
      const signInReset = container.querySelector<HTMLButtonElement>("#sign-in-reset");
      const signUpResend = container.querySelector<HTMLButtonElement>("#sign-up-resend");
      const signUpReset = container.querySelector<HTMLButtonElement>("#sign-up-reset");
      const oauthButtons = Array.from(
        container.querySelectorAll<HTMLButtonElement>("[data-oauth-flow][data-strategy]")
      );

      const cleanupFns: Array<() => void> = [];

      const showPanel = (panelName: string) => {
        authModePanels.forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.authPanel === panelName);
        });

        authTabButtons.forEach((button) => {
          button.classList.toggle("active", button.dataset.authMode === panelName);
        });
      };

      const setStepVisible = (stepNode: HTMLElement | null, isVisible: boolean) => {
        if (!stepNode) return;
        stepNode.hidden = !isVisible;
        stepNode.classList.toggle("active", isVisible);
      };

      const syncPlanCards = () => {
        planCards.forEach((card) => {
          card.classList.toggle("active", card.dataset.plan === activePlan);
        });
      };

      const syncRoleCards = () => {
        roleCards.forEach((card) => {
          card.classList.toggle("active", card.dataset.role === activeRole);
        });

        if (roleContinueButton) {
          const hasRole = Boolean(activeRole);
          roleContinueButton.classList.toggle("is-disabled", !hasRole);
          roleContinueButton.setAttribute("aria-disabled", String(!hasRole));
        }
      };

      const showSignInForm = () => {
        setStepVisible(signInFormStep, true);
        setStepVisible(signInVerifyStep, false);
      };

      const showSignUpForm = () => {
        setStepVisible(signUpFormStep, true);
        setStepVisible(signUpVerifyStep, false);
      };

      const showSignInVerify = (email: string) => {
        if (signInVerifyCopy) {
          signInVerifyCopy.textContent = `Enter the security code sent to ${email} to finish signing in.`;
        }
        setStepVisible(signInFormStep, false);
        setStepVisible(signInVerifyStep, true);
      };

      const showSignUpVerify = (email: string) => {
        if (signUpVerifyCopy) {
          signUpVerifyCopy.textContent = `Enter the one-time code sent to ${email} to activate the account.`;
        }
        setStepVisible(signUpFormStep, false);
        setStepVisible(signUpVerifyStep, true);
      };

      const navigateTo = (path: string) => navigate(path, { replace: true });

      const setModeAndUrl = (mode: "sign-in" | "sign-up") => {
        currentMode = mode;
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("mode", mode);
        nextParams.delete("step");
        setSearchParams(nextParams, { replace: true });
        showPanel(mode);
      };

      authTabButtons.forEach((button) => {
        const onClick = () => {
          const nextMode = button.dataset.authMode === "sign-up" ? "sign-up" : "sign-in";
          setModeAndUrl(nextMode);
        };
        button.addEventListener("click", onClick);
        cleanupFns.push(() => button.removeEventListener("click", onClick));
      });

      planCards.forEach((card) => {
        const onClick = () => {
          activePlan = card.dataset.plan === "subscription" ? "subscription" : "free";
          syncPlanCards();
        };
        card.addEventListener("click", onClick);
        cleanupFns.push(() => card.removeEventListener("click", onClick));
      });

      planJumpButtons.forEach((button) => {
        const onClick = () => {
          activePlan = button.dataset.planJump === "subscription" ? "subscription" : "free";
          syncPlanCards();
          setModeAndUrl("sign-up");
        };
        button.addEventListener("click", onClick);
        cleanupFns.push(() => button.removeEventListener("click", onClick));
      });

      roleCards.forEach((card) => {
        const onClick = () => {
          activeRole = card.dataset.role || "";
          syncRoleCards();
        };
        card.addEventListener("click", onClick);
        cleanupFns.push(() => card.removeEventListener("click", onClick));
      });

      if (roleContinueButton) {
        const onClick = (event: MouseEvent) => {
          if (!activeRole) {
            event.preventDefault();
            return;
          }

          event.preventDefault();
          const nextUrl = new URL(redirectTarget, window.location.origin);
          nextUrl.searchParams.set("role", activeRole);
          navigateTo(`${nextUrl.pathname}${nextUrl.search}`);
        };
        roleContinueButton.addEventListener("click", onClick);
        cleanupFns.push(() => roleContinueButton.removeEventListener("click", onClick));
      }

      if (isSignedIn) {
        if (stepParam === "role") {
          showPanel("role-selection");
          roleSelectionPanel?.removeAttribute("hidden");
          signedInPanel?.setAttribute("hidden", "hidden");
        } else {
          authModePanels.forEach((panel) => panel.classList.remove("active"));
          authTabButtons.forEach((button) => button.classList.remove("active"));
          signedInPanel?.removeAttribute("hidden");
          signedInPanel?.classList.add("active");

          if (signedInUserButton && typeof clerk.mountUserButton === "function") {
            try {
              clerk.mountUserButton(signedInUserButton);
            } catch {
              signedInUserButton.innerHTML = "";
            }
          }
        }

        return () => cleanupFns.forEach((fn) => fn());
      }

      showPanel(currentMode);
      showSignInForm();
      showSignUpForm();
      syncPlanCards();
      syncRoleCards();

      const onSignInSubmit = async (event: Event) => {
        event.preventDefault();
        if (!isLoaded) return;
        setFeedback(signInFeedback);
        setButtonLoading(signInSubmitButton, true, "Continuing...");

        try {
          const attempt: any = await clerk.client.signIn.create({
            identifier: signInEmailInput?.value || "",
            password: signInPasswordInput?.value || "",
          });

          signInAttempt = attempt;

          if (attempt.status === "complete") {
            await clerk.setActive({ session: attempt.createdSessionId });
            navigateTo(redirectTarget);
            return;
          }

          if (
            (attempt.status === "needs_second_factor" || attempt.status === "needs_client_trust") &&
            attempt.mfa?.sendEmailCode
          ) {
            await attempt.mfa.sendEmailCode();
            showSignInVerify(signInEmailInput?.value || "");
            setFeedback(signInVerifyFeedback, "Enter the code from your email.", "neutral");
            return;
          }

          throw new Error("This account needs a verification method that is not yet enabled.");
        } catch (error) {
          setFeedback(signInFeedback, getErrorMessage(error), "error");
        } finally {
          setButtonLoading(signInSubmitButton, false, "Continuing...");
        }
      };

      signInForm?.addEventListener("submit", onSignInSubmit);
      cleanupFns.push(() => signInForm?.removeEventListener("submit", onSignInSubmit));

      const onSignInVerify = async (event: Event) => {
        event.preventDefault();
        if (!signInAttempt) return;
        setFeedback(signInVerifyFeedback);
        setButtonLoading(signInVerifyButton, true, "Verifying...");

        try {
          await signInAttempt.mfa.verifyEmailCode({ code: signInCodeInput?.value || "" });

          if (signInAttempt.status === "complete") {
            await clerk.setActive({ session: signInAttempt.createdSessionId });
            navigateTo(redirectTarget);
            return;
          }

          throw new Error("Verification is incomplete. Please request a new code.");
        } catch (error) {
          setFeedback(signInVerifyFeedback, getErrorMessage(error), "error");
        } finally {
          setButtonLoading(signInVerifyButton, false, "Verifying...");
        }
      };

      signInVerifyForm?.addEventListener("submit", onSignInVerify);
      cleanupFns.push(() => signInVerifyForm?.removeEventListener("submit", onSignInVerify));

      const onSignUpSubmit = async (event: Event) => {
        event.preventDefault();
        if (!isLoaded) return;
        setFeedback(signUpFeedback);
        setButtonLoading(signUpSubmitButton, true, "Creating account...");

        try {
          const attempt: any = await clerk.client.signUp.create({
            emailAddress: signUpEmailInput?.value || "",
            password: signUpPasswordInput?.value || "",
            unsafeMetadata: {
              plan: activePlan,
              companyName: signUpCompanyInput?.value || "",
            },
          });

          signUpAttempt = attempt;
          await attempt.prepareEmailAddressVerification({ strategy: "email_code" });
          showSignUpVerify(signUpEmailInput?.value || "");
          setFeedback(signUpVerifyFeedback, "Enter the code from your email.", "neutral");
        } catch (error) {
          setFeedback(signUpFeedback, getErrorMessage(error), "error");
        } finally {
          setButtonLoading(signUpSubmitButton, false, "Creating account...");
        }
      };

      signUpForm?.addEventListener("submit", onSignUpSubmit);
      cleanupFns.push(() => signUpForm?.removeEventListener("submit", onSignUpSubmit));

      const onSignUpVerify = async (event: Event) => {
        event.preventDefault();
        if (!signUpAttempt) return;
        setFeedback(signUpVerifyFeedback);
        setButtonLoading(signUpVerifyButton, true, "Verifying...");

        try {
          const result: any = await signUpAttempt.attemptEmailAddressVerification({
            code: signUpCodeInput?.value || "",
          });

          if (result.status === "complete") {
            await clerk.setActive({ session: result.createdSessionId });
            navigateTo(`/sign-in?mode=sign-up&step=role&redirect=${encodeURIComponent(redirectTarget)}`);
            return;
          }

          throw new Error("Verification is incomplete. Please request a new code.");
        } catch (error) {
          setFeedback(signUpVerifyFeedback, getErrorMessage(error), "error");
        } finally {
          setButtonLoading(signUpVerifyButton, false, "Verifying...");
        }
      };

      signUpVerifyForm?.addEventListener("submit", onSignUpVerify);
      cleanupFns.push(() => signUpVerifyForm?.removeEventListener("submit", onSignUpVerify));

      const resendSignIn = async () => {
        try {
          await signInAttempt?.mfa?.sendEmailCode?.();
          setFeedback(signInVerifyFeedback, "A new verification code has been sent.", "success");
        } catch (error) {
          setFeedback(signInVerifyFeedback, getErrorMessage(error), "error");
        }
      };

      const resendSignUp = async () => {
        try {
          await signUpAttempt?.prepareEmailAddressVerification?.({ strategy: "email_code" });
          setFeedback(signUpVerifyFeedback, "A new verification code has been sent.", "success");
        } catch (error) {
          setFeedback(signUpVerifyFeedback, getErrorMessage(error), "error");
        }
      };

      signInResend?.addEventListener("click", resendSignIn);
      cleanupFns.push(() => signInResend?.removeEventListener("click", resendSignIn));
      signUpResend?.addEventListener("click", resendSignUp);
      cleanupFns.push(() => signUpResend?.removeEventListener("click", resendSignUp));

      const resetSignIn = () => {
        signInAttempt = null;
        if (signInCodeInput) signInCodeInput.value = "";
        showSignInForm();
        setFeedback(signInVerifyFeedback);
      };
      signInReset?.addEventListener("click", resetSignIn);
      cleanupFns.push(() => signInReset?.removeEventListener("click", resetSignIn));

      const resetSignUp = () => {
        signUpAttempt = null;
        if (signUpCodeInput) signUpCodeInput.value = "";
        showSignUpForm();
        setFeedback(signUpVerifyFeedback);
      };
      signUpReset?.addEventListener("click", resetSignUp);
      cleanupFns.push(() => signUpReset?.removeEventListener("click", resetSignUp));

      const startOAuth = async (flow: "sign-in" | "sign-up", strategy: string) => {
        const callbackUrl = toAbsoluteAppUrl(
          `/oauth-callback?redirect=${encodeURIComponent(redirectTarget)}&mode=${flow}`
        );
        const completeUrl =
          flow === "sign-up"
            ? toAbsoluteAppUrl(`/sign-in?mode=sign-up&step=role&redirect=${encodeURIComponent(redirectTarget)}`)
            : toAbsoluteAppUrl(redirectTarget);
        const resource: any = flow === "sign-up" ? clerk.client.signUp : clerk.client.signIn;
        const feedbackNode = flow === "sign-up" ? signUpFeedback : signInFeedback;

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
          setFeedback(feedbackNode, getErrorMessage(error), "error");
        }
      };

      oauthButtons.forEach((button) => {
        const onClick = () => {
          const flow = button.dataset.oauthFlow === "sign-up" ? "sign-up" : "sign-in";
          const strategy = button.dataset.strategy || "";
          startOAuth(flow, strategy);
        };
        button.addEventListener("click", onClick);
        cleanupFns.push(() => button.removeEventListener("click", onClick));
      });

      return () => cleanupFns.forEach((fn) => fn());
    },
    [clerk, isLoaded, isSignedIn, navigate, searchParams, setSearchParams]
  );

  return <StaticHtmlPage onReady={setupAuthPage} rawHtml={staticSignInHtml} />;
}
