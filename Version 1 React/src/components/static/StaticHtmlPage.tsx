import { useAuth } from "@clerk/react";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const routeMap: Record<string, string> = {
  "index.html": "/",
  "about.html": "/about",
  "contact.html": "/contact",
  "dashboard.html": "/dashboard",
  "listing-detail.html": "/listing/ndfeb-texas-18mt",
  "marketplace.html": "/marketplace",
  "oauth-callback.html": "/oauth-callback",
  "recycler-onboarding.html": "/recycler-onboarding",
  "sign-in.html": "/sign-in",
  "supplier-onboarding.html": "/supplier-onboarding",
};

function mapStaticValue(value: string) {
  if (!value || value.startsWith("#")) {
    return value;
  }

  try {
    const url = new URL(value, "https://rer.local");
    const fileName = url.pathname.split("/").pop() || "";
    const mappedPath = routeMap[fileName];

    if (!mappedPath) {
      return value;
    }

    url.pathname = mappedPath;

    url.searchParams.forEach((paramValue, key) => {
      const mappedParam = mapStaticValue(paramValue);
      if (mappedParam !== paramValue) {
        url.searchParams.set(key, mappedParam);
      }
    });

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return value;
  }
}

function parseHtmlDocument(rawHtml: string) {
  const titleMatch = rawHtml.match(/<title>(.*?)<\/title>/i);
  const bodyMatch = rawHtml.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  const bodyAttributes = bodyMatch?.[1] || "";
  let content = bodyMatch?.[2] || rawHtml;

  content = content.replace(/<script[\s\S]*?<\/script>/gi, "");
  content = content.replace(/href="([^"]+?)"/gi, (_, hrefValue) => `href="${mapStaticValue(hrefValue)}"`);
  content = content.replace(/\svalue="([^"]*?)"/gi, "");

  const classMatch = bodyAttributes.match(/class="([^"]*?)"/i);
  const authPageMatch = bodyAttributes.match(/data-auth-page="([^"]*?)"/i);
  const authProtectedMatch = bodyAttributes.match(/data-auth-protected="([^"]*?)"/i);

  return {
    title: titleMatch?.[1] || "Rare Earth Rescue",
    bodyClassName: classMatch?.[1] || "",
    authPage: authPageMatch?.[1] || "",
    authProtected: authProtectedMatch?.[1] || "",
    content,
  };
}

function enhanceStaticInteractions(container: HTMLElement) {
  const cleanupFns: Array<() => void> = [];
  const reveals = Array.from(container.querySelectorAll<HTMLElement>(".reveal"));
  const countTargets = Array.from(container.querySelectorAll<HTMLElement>("[data-count]"));
  const tabButtons = Array.from(container.querySelectorAll<HTMLElement>("[data-tab-target]"));
  const chipButtons = Array.from(container.querySelectorAll<HTMLElement>(".chip[data-chip-group]"));
  const modalTriggers = Array.from(container.querySelectorAll<HTMLElement>("[data-open-modal]"));
  const modalClosers = Array.from(container.querySelectorAll<HTMLElement>("[data-close-modal]"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach((element) => revealObserver.observe(element));
  cleanupFns.push(() => revealObserver.disconnect());

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target as HTMLElement;
        const targetValue = Number(element.dataset.count);
        const duration = 1200;
        const start = performance.now();

        const update = (time: number) => {
          const progress = Math.min((time - start) / duration, 1);
          element.textContent = Math.round(progress * targetValue).toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        };

        requestAnimationFrame(update);
        countObserver.unobserve(element);
      });
    },
    { threshold: 0.6 }
  );

  countTargets.forEach((target) => countObserver.observe(target));
  cleanupFns.push(() => countObserver.disconnect());

  tabButtons.forEach((button) => {
    const onClick = () => {
      const group = button.dataset.tabGroup;
      const target = button.dataset.tabTarget;
      if (!group || !target) return;

      container
        .querySelectorAll(`[data-tab-group="${group}"]`)
        .forEach((item) => item.classList.toggle("active", item === button));

      container.querySelectorAll<HTMLElement>(`[data-panel-group="${group}"]`).forEach((panel) => {
        panel.classList.toggle("active", panel.id === target);
      });
    };

    button.addEventListener("click", onClick);
    cleanupFns.push(() => button.removeEventListener("click", onClick));
  });

  chipButtons.forEach((chip) => {
    const onClick = () => {
      const group = chip.dataset.chipGroup;
      if (!group) return;

      container
        .querySelectorAll(`.chip[data-chip-group="${group}"]`)
        .forEach((item) => item.classList.toggle("active", item === chip));
    };

    chip.addEventListener("click", onClick);
    cleanupFns.push(() => chip.removeEventListener("click", onClick));
  });

  modalTriggers.forEach((trigger) => {
    const onClick = () => {
      const modalId = trigger.dataset.openModal;
      const modal = modalId ? container.querySelector<HTMLElement>(`#${modalId}`) : null;

      modal?.classList.add("open");
    };

    trigger.addEventListener("click", onClick);
    cleanupFns.push(() => trigger.removeEventListener("click", onClick));
  });

  modalClosers.forEach((closer) => {
    const onClick = () => closer.closest(".modal")?.classList.remove("open");

    closer.addEventListener("click", onClick);
    cleanupFns.push(() => closer.removeEventListener("click", onClick));
  });

  container.querySelectorAll<HTMLElement>(".modal").forEach((modal) => {
    const onClick = (event: Event) => {
      if (event.target === modal) {
        modal.classList.remove("open");
      }
    };

    modal.addEventListener("click", onClick);
    cleanupFns.push(() => modal.removeEventListener("click", onClick));
  });

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}

export function StaticHtmlPage({
  rawHtml,
  onReady,
}: {
  rawHtml: string;
  onReady?: (container: HTMLDivElement) => void | (() => void);
}) {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const parsed = useMemo(() => parseHtmlDocument(rawHtml), [rawHtml]);

  useEffect(() => {
    const body = document.body;
    const previousClassName = body.className;
    const previousAuthPage = body.dataset.authPage;
    const previousAuthProtected = body.dataset.authProtected;
    const previousTitle = document.title;

    body.className = parsed.bodyClassName || "";

    if (parsed.authPage) {
      body.dataset.authPage = parsed.authPage;
    } else {
      delete body.dataset.authPage;
    }

    if (parsed.authProtected) {
      body.dataset.authProtected = parsed.authProtected;
    } else {
      delete body.dataset.authProtected;
    }

    document.title = parsed.title;

    return () => {
      body.className = previousClassName;

      if (previousAuthPage) {
        body.dataset.authPage = previousAuthPage;
      } else {
        delete body.dataset.authPage;
      }

      if (previousAuthProtected) {
        body.dataset.authProtected = previousAuthProtected;
      } else {
        delete body.dataset.authProtected;
      }

      document.title = previousTitle;
    };
  }, [parsed]);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = enhanceStaticInteractions(containerRef.current);
    const customCleanup = onReady?.(containerRef.current);

    return () => {
      cleanup?.();
      if (typeof customCleanup === "function") {
        customCleanup();
      }
    };
  }, [onReady, parsed.content]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const authSlots = container.querySelectorAll<HTMLElement>("[data-auth-slot]");
    authSlots.forEach((slot) => {
      const link = slot.querySelector<HTMLAnchorElement>("[data-auth-link]");
      const fallbackTarget = link?.dataset.redirect || "dashboard.html";
      const mappedRedirect = mapStaticValue(fallbackTarget);

      if (isSignedIn) {
        slot.innerHTML = `<a class="button button-secondary" href="/dashboard">Dashboard</a>`;
      } else if (link) {
        link.setAttribute("href", `/sign-in?redirect=${encodeURIComponent(mappedRedirect)}`);
      }
    });
  }, [isSignedIn, parsed.content]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || target === "_blank" || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
        return;
      }

      event.preventDefault();
      navigate(href);
    };

    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [navigate, parsed.content]);

  return <div dangerouslySetInnerHTML={{ __html: parsed.content }} ref={containerRef} />;
}
