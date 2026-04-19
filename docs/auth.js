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

  const currentRelativeUrl = `${window.location.pathname.split("/").pop() || "index.html"}${window.location.search}${window.location.hash}`;
  const signInPage = config.signInPage || "sign-in.html";
  const defaultSignedInRedirect = config.signedInRedirect || "dashboard.html";
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
  if (authPage === "sign-in") {
    const authRoot = document.getElementById("clerk-auth-root");
    const signedInPanel = document.getElementById("signed-in-panel");
    const redirectParam = new URLSearchParams(window.location.search).get("redirect");
    const fallbackRedirectUrl = getRelativePath(redirectParam || defaultSignedInRedirect);

    if (!authRoot) {
      return;
    }

    if (window.Clerk.isSignedIn) {
      authRoot.hidden = true;
      if (signedInPanel) {
        signedInPanel.hidden = false;
      }

      const signedInUserButton = document.getElementById("signed-in-user-button");
      if (signedInUserButton) {
        window.Clerk.mountUserButton(signedInUserButton);
      }
    } else {
      window.Clerk.mountSignIn(authRoot, {
        fallbackRedirectUrl,
      });
    }
  }
})();
