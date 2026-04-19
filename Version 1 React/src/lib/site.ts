export const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZW5vdWdoLXNxdWlycmVsLTM2LmNsZXJrLmFjY291bnRzLmRldiQ";

export function normalizeRedirectPath(input?: string | null) {
  if (!input) {
    return "/dashboard";
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
