export const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZW5vdWdoLXNxdWlycmVsLTM2LmNsZXJrLmFjY291bnRzLmRldiQ";

export function normalizeRedirectPath(input?: string | null) {
  if (!input) {
    return "/dashboard";
  }

  try {
    const url = new URL(input, window.location.origin);
    if (url.origin === window.location.origin) {
      const combinedPath = `${url.pathname}${url.search}${url.hash}`;
      if (combinedPath && combinedPath !== "/index.html") {
        return combinedPath.replace(/\.html(?=($|[?#]))/, "") || "/";
      }
    }
  } catch {
    // Fall through to string normalization.
  }

  if (input === "/" || input === "index.html" || input === "/index.html") {
    return "/";
  }

  const normalized = input.replace(/\.html$/, "");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function toAbsoluteAppUrl(path: string) {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin);
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalizedPath, base).toString();
}

export function toAppRelativeUrl(path: string) {
  const absolute = new URL(toAbsoluteAppUrl(path));
  return `${absolute.pathname}${absolute.search}${absolute.hash}`;
}

export function getAuthRedirectTarget(searchParams: URLSearchParams) {
  return normalizeRedirectPath(searchParams.get("redirect_url") || searchParams.get("redirect"));
}

export function getSignInUrl() {
  return toAbsoluteAppUrl("/sign-in");
}

export function getSignUpUrl() {
  return toAbsoluteAppUrl("/sign-in?mode=sign-up");
}
