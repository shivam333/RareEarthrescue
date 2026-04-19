(async function initializeClerkAuth() {
  const config = window.CLERK_CONFIG || {};
  const publishableKey = config.publishableKey;

  if (!publishableKey || publishableKey.includes("replace_with_your_clerk_publishable_key")) {
    return;
  }

  const loadScript = (src, attributes = {}) =>
    new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);

      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }

        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";

      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });

      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );

      script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
        once: true,
      });

      document.head.appendChild(script);
    });

  const getClerkDomain = (key) => {
    try {
      return window.atob(key.split("_")[2]).slice(0, -1);
    } catch (error) {
      console.error("Could not derive Clerk domain from publishable key.", error);
      return null;
    }
  };

  const getRelativePath = (url) => {
    const absoluteUrl = new URL(url, window.location.href);
    return `${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`;
  };

  const getSearchParam = (name) => new URLSearchParams(window.location.search).get(name);
  const signInPage = config.signInPage || "sign-in.html";
  const defaultSignedInRedirect = config.signedInRedirect || "dashboard.html";
  const currentRelativeUrl = `${window.location.pathname.split("/").pop() || "index.html"}${window.location.search}${window.location.hash}`;
  const clerkDomain = getClerkDomain(publishableKey);

  if (!clerkDomain) {
    return;
  }

  try {
    await loadScript(`https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`);
    await loadScript(`https://${clerkDomain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, {
      "data-clerk-publishable-key": publishableKey,
    });

    await window.Clerk.load({
      ui: { ClerkUI: window.__internal_ClerkUICtor },
      appearance: {
        captcha: {
          theme: "light",
          size: "flexible",
        },
      },
    });
  } catch (error) {
    console.error("Clerk failed to initialize.", error);
    return;
  }

  const clerk = window.Clerk;
  const authPage = document.body.dataset.authPage;
  const redirectParam = getSearchParam("redirect");
  const fallbackRedirectUrl = getRelativePath(redirectParam || defaultSignedInRedirect);
  const roleRedirectUrl = `${signInPage}?step=role&redirect=${encodeURIComponent(fallbackRedirectUrl)}`;

  const getSignInResource = () => clerk.client?.signIn || clerk.signIn || null;
  const getSignUpResource = () => clerk.client?.signUp || clerk.signUp || null;

  const isFutureSignIn = (resource) =>
    Boolean(resource && typeof resource.password === "function" && typeof resource.finalize === "function");
  const isFutureSignUp = (resource) =>
    Boolean(resource && typeof resource.password === "function" && typeof resource.finalize === "function");

  const getErrorMessage = (error, fallbackMessage = "Something went wrong. Please try again.") => {
    if (!error) {
      return fallbackMessage;
    }

    if (typeof error === "string") {
      return error;
    }

    if (Array.isArray(error)) {
      const firstMessage = error.find((entry) => entry?.message)?.message;
      return firstMessage || fallbackMessage;
    }

    if (Array.isArray(error.errors) && error.errors.length > 0) {
      return error.errors[0]?.longMessage || error.errors[0]?.message || fallbackMessage;
    }

    if (error.message) {
      return error.message;
    }

    return fallbackMessage;
  };

  const setFeedback = (node, message = "", tone = "neutral") => {
    if (!node) {
      return;
    }

    if (!message) {
      node.hidden = true;
      node.textContent = "";
      node.dataset.tone = "";
      return;
    }

    node.hidden = false;
    node.textContent = message;
    node.dataset.tone = tone;
  };

  const setButtonLoading = (button, isLoading, loadingLabel) => {
    if (!button) {
      return;
    }

    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent || "";
    }

    button.disabled = isLoading;
    button.textContent = isLoading ? loadingLabel : button.dataset.defaultLabel;
  };

  const absoluteUrlFor = (relativePath) => new URL(relativePath, window.location.href).toString();

  document.body.classList.toggle("is-signed-in", clerk.isSignedIn);
  document.body.classList.toggle("is-signed-out", !clerk.isSignedIn);

  const authSlots = document.querySelectorAll("[data-auth-slot]");
  authSlots.forEach((slot) => {
    const link = slot.querySelector("[data-auth-link]");
    const fallbackTarget = link?.dataset.redirect || defaultSignedInRedirect;

    if (clerk.isSignedIn) {
      slot.innerHTML = '<div class="user-button-slot" aria-label="User account"></div>';
      const userButtonNode = slot.querySelector(".user-button-slot");

      if (userButtonNode) {
        clerk.mountUserButton(userButtonNode, {
          appearance: {
            elements: {
              userButtonAvatarBox: {
                width: "42px",
                height: "42px",
              },
            },
          },
        });
      }
    } else if (link) {
      link.href = `${signInPage}?redirect=${encodeURIComponent(getRelativePath(fallbackTarget))}`;
    }
  });

  const protectedPage = document.body.dataset.authProtected === "true";
  if (protectedPage && !clerk.isSignedIn) {
    const redirectTarget = encodeURIComponent(currentRelativeUrl);
    window.location.href = `${signInPage}?redirect=${redirectTarget}`;
    return;
  }

  if (authPage === "oauth-callback") {
    const callbackFeedback = document.getElementById("oauth-callback-feedback");

    try {
      await clerk.handleRedirectCallback({
        continueSignUpUrl: roleRedirectUrl,
        signInUrl: signInPage,
        signUpUrl: `${signInPage}?mode=sign-up`,
        signInFallbackRedirectUrl: fallbackRedirectUrl,
        signInForceRedirectUrl: fallbackRedirectUrl,
        signUpFallbackRedirectUrl: roleRedirectUrl,
        signUpForceRedirectUrl: roleRedirectUrl,
      });
    } catch (error) {
      console.error("OAuth callback failed.", error);
      setFeedback(
        callbackFeedback,
        `${getErrorMessage(error, "We could not complete the social sign-in flow.")} Return to the access page and try again.`,
        "error"
      );
    }

    return;
  }

  if (authPage !== "sign-in") {
    return;
  }

  const authModePanels = document.querySelectorAll("[data-auth-panel]");
  const authTabButtons = document.querySelectorAll("[data-auth-mode]");
  const planCards = document.querySelectorAll("[data-plan]");
  const planJumpButtons = document.querySelectorAll("[data-plan-jump]");
  const roleCards = document.querySelectorAll("[data-role]");
  const roleContinueButton = document.getElementById("role-continue-button");
  const signedInPanel = document.getElementById("signed-in-panel");
  const roleSelectionPanel = document.getElementById("role-selection-panel");
  const currentMode = getSearchParam("mode") || "sign-in";
  const stepParam = getSearchParam("step");
  const roleStorageKey = "rer-selected-role";
  const planStorageKey = "rer-selected-plan";
  const companyStorageKey = "rer-company-name";

  const signInFormStep = document.getElementById("sign-in-form-step");
  const signInVerifyStep = document.getElementById("sign-in-verify-step");
  const signUpFormStep = document.getElementById("sign-up-form-step");
  const signUpVerifyStep = document.getElementById("sign-up-verify-step");

  const signInForm = document.getElementById("custom-sign-in-form");
  const signInVerifyForm = document.getElementById("custom-sign-in-verify-form");
  const signUpForm = document.getElementById("custom-sign-up-form");
  const signUpVerifyForm = document.getElementById("custom-sign-up-verify-form");

  const signInEmailInput = document.getElementById("sign-in-email");
  const signInPasswordInput = document.getElementById("sign-in-password");
  const signInCodeInput = document.getElementById("sign-in-code");
  const signUpEmailInput = document.getElementById("sign-up-email");
  const signUpPasswordInput = document.getElementById("sign-up-password");
  const signUpCompanyInput = document.getElementById("sign-up-company");
  const signUpCodeInput = document.getElementById("sign-up-code");

  const signInFeedback = document.getElementById("sign-in-feedback");
  const signInVerifyFeedback = document.getElementById("sign-in-verify-feedback");
  const signUpFeedback = document.getElementById("sign-up-feedback");
  const signUpVerifyFeedback = document.getElementById("sign-up-verify-feedback");

  const signInSubmitButton = document.getElementById("sign-in-submit");
  const signInVerifyButton = document.getElementById("sign-in-verify-submit");
  const signUpSubmitButton = document.getElementById("sign-up-submit");
  const signUpVerifyButton = document.getElementById("sign-up-verify-submit");

  const signInVerifyCopy = document.getElementById("sign-in-verify-copy");
  const signUpVerifyCopy = document.getElementById("sign-up-verify-copy");
  const signInResend = document.getElementById("sign-in-resend");
  const signInReset = document.getElementById("sign-in-reset");
  const signUpResend = document.getElementById("sign-up-resend");
  const signUpReset = document.getElementById("sign-up-reset");

  const oauthButtons = document.querySelectorAll("[data-oauth-flow][data-strategy]");
  const signedInUserButton = document.getElementById("signed-in-user-button");

  let activePlan = localStorage.getItem(planStorageKey) || "free";
  let activeRole = localStorage.getItem(roleStorageKey) || "";
  let currentSignInAttempt = null;
  let currentSignUpAttempt = null;
  let currentSignInIdentifier = "";
  let currentSignUpIdentifier = "";

  const showPanel = (panelName) => {
    authModePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.authPanel === panelName);
    });

    authTabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.authMode === panelName);
    });
  };

  const setStepVisibility = (stepNode, isVisible) => {
    if (!stepNode) {
      return;
    }

    stepNode.hidden = !isVisible;
    stepNode.classList.toggle("active", isVisible);
  };

  const showSignInForm = () => {
    setStepVisibility(signInFormStep, true);
    setStepVisibility(signInVerifyStep, false);
    setFeedback(signInVerifyFeedback);
  };

  const showSignInVerify = (identifier) => {
    currentSignInIdentifier = identifier || currentSignInIdentifier;
    if (signInVerifyCopy && currentSignInIdentifier) {
      signInVerifyCopy.textContent = `Enter the security code sent to ${currentSignInIdentifier} to finish signing in.`;
    }

    setStepVisibility(signInFormStep, false);
    setStepVisibility(signInVerifyStep, true);
    setFeedback(signInFeedback);
    signInCodeInput?.focus();
  };

  const showSignUpForm = () => {
    setStepVisibility(signUpFormStep, true);
    setStepVisibility(signUpVerifyStep, false);
    setFeedback(signUpVerifyFeedback);
  };

  const showSignUpVerify = (identifier) => {
    currentSignUpIdentifier = identifier || currentSignUpIdentifier;
    if (signUpVerifyCopy && currentSignUpIdentifier) {
      signUpVerifyCopy.textContent = `We sent a one-time code to ${currentSignUpIdentifier}. Enter it below to activate your account.`;
    }

    setStepVisibility(signUpFormStep, false);
    setStepVisibility(signUpVerifyStep, true);
    setFeedback(signUpFeedback);
    signUpCodeInput?.focus();
  };

  const updateRoleContinue = () => {
    if (!roleContinueButton) {
      return;
    }

    const hasRole = Boolean(activeRole);
    roleContinueButton.classList.toggle("is-disabled", !hasRole);
    roleContinueButton.setAttribute("aria-disabled", String(!hasRole));

    if (hasRole) {
      roleContinueButton.href = `${fallbackRedirectUrl}${fallbackRedirectUrl.includes("?") ? "&" : "?"}role=${encodeURIComponent(activeRole)}`;
    } else {
      roleContinueButton.href = "#";
    }
  };

  const syncPlanCards = () => {
    planCards.forEach((card) => {
      card.classList.toggle("active", card.dataset.plan === activePlan);
    });
  };

  const setActivePlan = (planValue) => {
    activePlan = planValue || "free";
    localStorage.setItem(planStorageKey, activePlan);
    syncPlanCards();
  };

  const syncRoleCards = () => {
    roleCards.forEach((card) => {
      card.classList.toggle("active", card.dataset.role === activeRole);
    });
    updateRoleContinue();
  };

  const finalizeSignedInRedirect = async (targetUrl) => {
    window.location.href = targetUrl;
  };

  const finalizeWithFutureResource = async (resource, redirectTarget) => {
    const finalizeResult = await resource.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.log("Clerk session task pending:", session.currentTask);
        }

        const nextUrl = typeof decorateUrl === "function" ? decorateUrl(redirectTarget) : redirectTarget;
        await finalizeSignedInRedirect(nextUrl);
      },
    });

    if (finalizeResult?.error) {
      throw finalizeResult.error;
    }
  };

  const finalizeWithLegacyResource = async (resource, redirectTarget) => {
    if (!resource?.createdSessionId) {
      throw new Error("Clerk did not return a session for this authentication attempt.");
    }

    await clerk.setActive({ session: resource.createdSessionId });
    await finalizeSignedInRedirect(redirectTarget);
  };

  const signInWithPassword = async (emailAddress, password) => {
    const signInResource = getSignInResource();

    if (!signInResource) {
      throw new Error("Clerk sign-in is unavailable.");
    }

    if (isFutureSignIn(signInResource)) {
      const result = await signInResource.password({ emailAddress, password });

      if (result?.error) {
        throw result.error;
      }

      currentSignInAttempt = signInResource;

      if (signInResource.status === "complete") {
        await finalizeWithFutureResource(signInResource, fallbackRedirectUrl);
        return;
      }

      if (signInResource.status === "needs_client_trust") {
        const hasEmailCode = signInResource.supportedSecondFactors?.some(
          (factor) => factor.strategy === "email_code"
        );

        if (!hasEmailCode || !signInResource.mfa?.sendEmailCode) {
          throw new Error("This account requires an unsupported second factor. Please use a supported method in Clerk.");
        }

        await signInResource.mfa.sendEmailCode();
        showSignInVerify(emailAddress);
        return;
      }

      if (signInResource.status === "needs_second_factor") {
        throw new Error("This account requires multi-factor authentication that is not yet enabled in this custom flow.");
      }

      throw new Error("Sign-in could not be completed. Please check your credentials and try again.");
    }

    const signInAttempt = await clerk.client.signIn.create({
      identifier: emailAddress,
      password,
    });

    currentSignInAttempt = signInAttempt;

    if (signInAttempt.status === "complete") {
      await finalizeWithLegacyResource(signInAttempt, fallbackRedirectUrl);
      return;
    }

    if (
      (signInAttempt.status === "needs_second_factor" || signInAttempt.status === "needs_client_trust") &&
      signInAttempt.mfa?.sendEmailCode
    ) {
      await signInAttempt.mfa.sendEmailCode();
      showSignInVerify(emailAddress);
      return;
    }

    throw new Error("This account requires an additional verification step that is not available in the current custom flow.");
  };

  const verifySignInCode = async (code) => {
    const signInAttempt = currentSignInAttempt || getSignInResource();

    if (!signInAttempt) {
      throw new Error("No sign-in verification is in progress.");
    }

    if (signInAttempt.mfa?.verifyEmailCode) {
      await signInAttempt.mfa.verifyEmailCode({ code });

      if (signInAttempt.status === "complete") {
        if (typeof signInAttempt.finalize === "function") {
          await finalizeWithFutureResource(signInAttempt, fallbackRedirectUrl);
        } else {
          await finalizeWithLegacyResource(signInAttempt, fallbackRedirectUrl);
        }
        return;
      }
    }

    throw new Error("The verification code could not be accepted. Please request a new code and try again.");
  };

  const resendSignInCode = async () => {
    const signInAttempt = currentSignInAttempt || getSignInResource();

    if (!signInAttempt?.mfa?.sendEmailCode) {
      throw new Error("We could not resend a code for this sign-in attempt.");
    }

    await signInAttempt.mfa.sendEmailCode();
  };

  const signUpWithPassword = async (emailAddress, password, companyName) => {
    const signUpResource = getSignUpResource();
    const unsafeMetadata = {
      plan: activePlan,
      companyName: companyName || "",
    };

    localStorage.setItem(companyStorageKey, companyName || "");

    if (!signUpResource) {
      throw new Error("Clerk sign-up is unavailable.");
    }

    if (isFutureSignUp(signUpResource)) {
      const result = await signUpResource.password({
        emailAddress,
        password,
        unsafeMetadata,
      });

      if (result?.error) {
        throw result.error;
      }

      currentSignUpAttempt = signUpResource;

      const sendResult = await signUpResource.verifications.sendEmailCode();
      if (sendResult?.error) {
        throw sendResult.error;
      }

      showSignUpVerify(emailAddress);
      return;
    }

    const signUpAttempt = await clerk.client.signUp.create({
      emailAddress,
      password,
      unsafeMetadata,
    });

    currentSignUpAttempt = signUpAttempt;
    await signUpAttempt.prepareEmailAddressVerification({ strategy: "email_code" });
    showSignUpVerify(emailAddress);
  };

  const verifySignUpCode = async (code) => {
    const signUpAttempt = currentSignUpAttempt || getSignUpResource();

    if (!signUpAttempt) {
      throw new Error("No sign-up verification is in progress.");
    }

    if (isFutureSignUp(signUpAttempt)) {
      const result = await signUpAttempt.verifications.verifyEmailCode({ code });
      if (result?.error) {
        throw result.error;
      }

      if (signUpAttempt.status === "complete") {
        await finalizeWithFutureResource(signUpAttempt, roleRedirectUrl);
        return;
      }
    } else {
      const nextAttempt = await signUpAttempt.attemptEmailAddressVerification({ code });
      currentSignUpAttempt = nextAttempt;

      if (nextAttempt.status === "complete") {
        await finalizeWithLegacyResource(nextAttempt, roleRedirectUrl);
        return;
      }
    }

    throw new Error("The verification code could not be accepted. Please request a new code and try again.");
  };

  const resendSignUpCode = async () => {
    const signUpAttempt = currentSignUpAttempt || getSignUpResource();

    if (!signUpAttempt) {
      throw new Error("We could not resend a code for this sign-up attempt.");
    }

    if (isFutureSignUp(signUpAttempt)) {
      const result = await signUpAttempt.verifications.sendEmailCode();
      if (result?.error) {
        throw result.error;
      }
      return;
    }

    await signUpAttempt.prepareEmailAddressVerification({ strategy: "email_code" });
  };

  const startOAuthFlow = async (flow, strategy, buttonNode) => {
    const callbackUrl = absoluteUrlFor(`oauth-callback.html?redirect=${encodeURIComponent(fallbackRedirectUrl)}`);
    const completeUrl = absoluteUrlFor(flow === "sign-up" ? roleRedirectUrl : fallbackRedirectUrl);
    const resource = flow === "sign-up" ? getSignUpResource() : getSignInResource();
    const feedbackNode = flow === "sign-up" ? signUpFeedback : signInFeedback;

    setFeedback(feedbackNode);
    setButtonLoading(buttonNode, true, "Redirecting...");

    try {
      if (!resource) {
        throw new Error("Clerk social authentication is unavailable.");
      }

      if (typeof resource.sso === "function") {
        const result = await resource.sso({
          strategy,
          redirectCallbackUrl: callbackUrl,
          redirectUrl: completeUrl,
          unsafeMetadata:
            flow === "sign-up"
              ? {
                  plan: activePlan,
                  companyName: signUpCompanyInput?.value?.trim() || localStorage.getItem(companyStorageKey) || "",
                }
              : undefined,
        });

        if (result?.error) {
          throw result.error;
        }

        return;
      }

      if (typeof resource.authenticateWithRedirect === "function") {
        await resource.authenticateWithRedirect({
          strategy,
          redirectUrl: callbackUrl,
          redirectUrlComplete: completeUrl,
        });
        return;
      }

      throw new Error("This Clerk configuration does not support the current social sign-in method.");
    } catch (error) {
      console.error("OAuth flow failed.", error);
      setFeedback(feedbackNode, getErrorMessage(error, "We could not start the social sign-in flow."), "error");
      setButtonLoading(buttonNode, false);
    }
  };

  authTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.authMode;
      if (!mode) {
        return;
      }

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("mode", mode);
      nextUrl.searchParams.delete("step");
      window.history.replaceState({}, "", nextUrl);
      showPanel(mode);
    });
  });

  planCards.forEach((card) => {
    card.addEventListener("click", () => {
      setActivePlan(card.dataset.plan || "free");
    });
  });

  planJumpButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextPlan = button.dataset.planJump || "free";
      setActivePlan(nextPlan);
      showPanel("sign-up");

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("mode", "sign-up");
      nextUrl.searchParams.delete("step");
      window.history.replaceState({}, "", nextUrl);
    });
  });

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      activeRole = card.dataset.role || "";
      localStorage.setItem(roleStorageKey, activeRole);
      syncRoleCards();
    });
  });

  roleContinueButton?.addEventListener("click", (event) => {
    if (!activeRole) {
      event.preventDefault();
    }
  });

  signInForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback(signInFeedback);
    setButtonLoading(signInSubmitButton, true, "Continuing...");

    try {
      const emailAddress = signInEmailInput?.value?.trim() || "";
      const password = signInPasswordInput?.value || "";

      if (!emailAddress || !password) {
        throw new Error("Enter your work email and password to continue.");
      }

      await signInWithPassword(emailAddress, password);
    } catch (error) {
      setFeedback(signInFeedback, getErrorMessage(error), "error");
    } finally {
      setButtonLoading(signInSubmitButton, false);
    }
  });

  signInVerifyForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback(signInVerifyFeedback);
    setButtonLoading(signInVerifyButton, true, "Verifying...");

    try {
      const code = signInCodeInput?.value?.trim() || "";
      if (!code) {
        throw new Error("Enter the verification code from your email.");
      }

      await verifySignInCode(code);
    } catch (error) {
      setFeedback(signInVerifyFeedback, getErrorMessage(error), "error");
    } finally {
      setButtonLoading(signInVerifyButton, false);
    }
  });

  signUpForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback(signUpFeedback);
    setButtonLoading(signUpSubmitButton, true, "Creating account...");

    try {
      const emailAddress = signUpEmailInput?.value?.trim() || "";
      const password = signUpPasswordInput?.value || "";
      const companyName = signUpCompanyInput?.value?.trim() || "";

      if (!emailAddress || !password) {
        throw new Error("Enter your work email and create a password to continue.");
      }

      await signUpWithPassword(emailAddress, password, companyName);
    } catch (error) {
      setFeedback(signUpFeedback, getErrorMessage(error), "error");
    } finally {
      setButtonLoading(signUpSubmitButton, false);
    }
  });

  signUpVerifyForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback(signUpVerifyFeedback);
    setButtonLoading(signUpVerifyButton, true, "Verifying...");

    try {
      const code = signUpCodeInput?.value?.trim() || "";
      if (!code) {
        throw new Error("Enter the verification code from your email.");
      }

      await verifySignUpCode(code);
    } catch (error) {
      setFeedback(signUpVerifyFeedback, getErrorMessage(error), "error");
    } finally {
      setButtonLoading(signUpVerifyButton, false);
    }
  });

  signInResend?.addEventListener("click", async () => {
    setFeedback(signInVerifyFeedback);
    try {
      await resendSignInCode();
      setFeedback(signInVerifyFeedback, "A new verification code has been sent.", "success");
    } catch (error) {
      setFeedback(signInVerifyFeedback, getErrorMessage(error), "error");
    }
  });

  signUpResend?.addEventListener("click", async () => {
    setFeedback(signUpVerifyFeedback);
    try {
      await resendSignUpCode();
      setFeedback(signUpVerifyFeedback, "A new verification code has been sent.", "success");
    } catch (error) {
      setFeedback(signUpVerifyFeedback, getErrorMessage(error), "error");
    }
  });

  signInReset?.addEventListener("click", () => {
    currentSignInAttempt = null;
    if (signInCodeInput) {
      signInCodeInput.value = "";
    }
    showSignInForm();
  });

  signUpReset?.addEventListener("click", () => {
    currentSignUpAttempt = null;
    if (signUpCodeInput) {
      signUpCodeInput.value = "";
    }
    showSignUpForm();
  });

  oauthButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const flow = button.dataset.oauthFlow;
      const strategy = button.dataset.strategy;

      if (!flow || !strategy) {
        return;
      }

      if (flow === "sign-up") {
        const companyName = signUpCompanyInput?.value?.trim() || "";
        localStorage.setItem(companyStorageKey, companyName);
      }

      startOAuthFlow(flow, strategy, button);
    });
  });

  syncPlanCards();
  syncRoleCards();
  showSignInForm();
  showSignUpForm();

  if (signUpCompanyInput && localStorage.getItem(companyStorageKey)) {
    signUpCompanyInput.value = localStorage.getItem(companyStorageKey) || "";
  }

  if (clerk.isSignedIn) {
    if (stepParam === "role") {
      showPanel("role-selection");
      roleSelectionPanel?.removeAttribute("hidden");
      signedInPanel?.setAttribute("hidden", "hidden");
      signedInPanel?.classList.remove("active");
      syncRoleCards();
    } else {
      authModePanels.forEach((panel) => panel.classList.remove("active"));
      authTabButtons.forEach((button) => button.classList.remove("active"));
      signedInPanel?.removeAttribute("hidden");
      signedInPanel?.classList.add("active");

      if (signedInUserButton) {
        clerk.mountUserButton(signedInUserButton);
      }
    }

    return;
  }

  if (currentMode === "sign-up") {
    showPanel("sign-up");
  } else {
    showPanel("sign-in");
  }
})();
