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
    });
  } catch (error) {
    console.error("Clerk failed to initialize.", error);
    return;
  }

  const buildAppearance = () => ({
    options: {
      logoPlacement: "inside",
      socialButtonsPlacement: "top",
      socialButtonsVariant: "blockButton",
      unsafe_disableDevelopmentModeWarnings: true,
    },
    variables: {
      colorPrimary: "#b88b3c",
      colorForeground: "#2f3426",
      colorInputText: "#2f3426",
      colorText: "#2f3426",
      colorBackground: "#fffaf2",
      borderRadius: "18px",
      fontFamily: '"Manrope", sans-serif',
    },
    elements: {
      rootBox: {
        width: "100%",
      },
      cardBox: {
        boxShadow: "none",
        border: "0",
        background: "transparent",
        padding: "0",
      },
      headerTitle: {
        fontSize: "1.5rem",
        fontWeight: "800",
      },
      headerSubtitle: {
        color: "#6f6b57",
      },
      socialButtonsBlockButton: {
        borderRadius: "14px",
        border: "1px solid rgba(104, 90, 59, 0.16)",
        boxShadow: "none",
        background: "#fffaf2",
        minHeight: "48px",
      },
      socialButtons: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "12px",
      },
      socialButtonsBlockButtonText: {
        fontSize: "0.98rem",
        whiteSpace: "normal",
      },
      formButtonPrimary: {
        borderRadius: "14px",
        background: "linear-gradient(145deg, #b88b3c, #9f742c)",
        boxShadow: "none",
      },
      formFieldInput: {
        borderRadius: "14px",
        borderColor: "rgba(104, 90, 59, 0.18)",
        minHeight: "48px",
      },
      phoneInputBox: {
        borderRadius: "14px",
        borderColor: "rgba(104, 90, 59, 0.18)",
        minHeight: "48px",
      },
      footerActionLink: {
        color: "#b88b3c",
        fontWeight: "700",
      },
      identityPreviewText: {
        color: "#2f3426",
      },
      formFieldLabel: {
        color: "#2f3426",
        fontWeight: "700",
      },
      dividerLine: {
        background: "rgba(104, 90, 59, 0.12)",
      },
      dividerText: {
        color: "#6f6b57",
      },
    },
  });

  document.body.classList.toggle("is-signed-in", window.Clerk.isSignedIn);
  document.body.classList.toggle("is-signed-out", !window.Clerk.isSignedIn);

  const authSlots = document.querySelectorAll("[data-auth-slot]");
  authSlots.forEach((slot) => {
    const link = slot.querySelector("[data-auth-link]");
    const fallbackTarget = link?.dataset.redirect || defaultSignedInRedirect;

    if (window.Clerk.isSignedIn) {
      slot.innerHTML = '<div class="user-button-slot" aria-label="User account"></div>';
      const userButtonNode = slot.querySelector(".user-button-slot");

      if (userButtonNode) {
        window.Clerk.mountUserButton(userButtonNode, {
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
  if (protectedPage && !window.Clerk.isSignedIn) {
    const redirectTarget = encodeURIComponent(currentRelativeUrl);
    window.location.href = `${signInPage}?redirect=${redirectTarget}`;
    return;
  }

  const authPage = document.body.dataset.authPage;
  if (authPage !== "sign-in") {
    return;
  }

  const signInRoot = document.getElementById("clerk-sign-in-root");
  const signUpRoot = document.getElementById("clerk-sign-up-root");
  const signedInPanel = document.getElementById("signed-in-panel");
  const roleSelectionPanel = document.getElementById("role-selection-panel");
  const authModePanels = document.querySelectorAll("[data-auth-panel]");
  const authTabButtons = document.querySelectorAll("[data-auth-mode]");
  const planCards = document.querySelectorAll("[data-plan]");
  const planJumpButtons = document.querySelectorAll("[data-plan-jump]");
  const roleCards = document.querySelectorAll("[data-role]");
  const roleContinueButton = document.getElementById("role-continue-button");

  const redirectParam = getSearchParam("redirect");
  const currentMode = getSearchParam("mode") || "sign-in";
  const stepParam = getSearchParam("step");
  const roleStorageKey = "rer-selected-role";
  const planStorageKey = "rer-selected-plan";

  const fallbackRedirectUrl = getRelativePath(redirectParam || defaultSignedInRedirect);
  const roleRedirectUrl = `${signInPage}?step=role&redirect=${encodeURIComponent(fallbackRedirectUrl)}`;
  let activePlan = localStorage.getItem(planStorageKey) || "free";
  let activeRole = localStorage.getItem(roleStorageKey) || "";

  const showPanel = (panelName) => {
    authModePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.authPanel === panelName);
    });

    authTabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.authMode === panelName);
    });
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

  if (window.Clerk.isSignedIn) {
    if (stepParam === "role") {
      showPanel("role-selection");
      roleSelectionPanel?.removeAttribute("hidden");
      signedInPanel?.setAttribute("hidden", "hidden");
      signedInPanel?.classList.remove("active");
      syncRoleCards();
    } else {
      authModePanels.forEach((panel) => panel.classList.remove("active"));
      authTabButtons.forEach((button) => button.classList.remove("active"));
      signInRoot?.setAttribute("hidden", "hidden");
      signUpRoot?.setAttribute("hidden", "hidden");
      signedInPanel?.removeAttribute("hidden");
      signedInPanel?.classList.add("active");

      const signedInUserButton = document.getElementById("signed-in-user-button");
      if (signedInUserButton) {
        window.Clerk.mountUserButton(signedInUserButton);
      }
    }

    return;
  }

  syncPlanCards();
  syncRoleCards();

  if (signInRoot) {
    window.Clerk.mountSignIn(signInRoot, {
      fallbackRedirectUrl,
      appearance: buildAppearance(),
      initialValues: {
        identifier: getSearchParam("identifier") || "",
      },
    });
  }

  if (signUpRoot) {
    window.Clerk.mountSignUp(signUpRoot, {
      fallbackRedirectUrl: roleRedirectUrl,
      appearance: buildAppearance(),
    });
  }

  if (currentMode === "sign-up") {
    showPanel("sign-up");
  } else {
    showPanel("sign-in");
  }
})();
