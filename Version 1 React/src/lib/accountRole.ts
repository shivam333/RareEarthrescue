export type AccountRole = "supplier" | "recycler" | "both";
export type DashboardMode = "supplier" | "recycler";

const ACTIVE_DASHBOARD_MODE_STORAGE_KEY = "rer-active-dashboard-mode";
const ACCOUNT_ROLE_SYNC_EVENT = "rer-account-role-sync";

function isAccountRole(value: unknown): value is AccountRole {
  return value === "supplier" || value === "recycler" || value === "both";
}

function isDashboardMode(value: unknown): value is DashboardMode {
  return value === "supplier" || value === "recycler";
}

type MetadataCarrier =
  | {
      unsafeMetadata?: Record<string, unknown> | null;
      publicMetadata?: Record<string, unknown> | null;
    }
  | null
  | undefined;

export function normalizeAccountRole(value: unknown, fallback: AccountRole = "recycler"): AccountRole {
  return isAccountRole(value) ? value : fallback;
}

export function readAccountRoleFromUser(user: MetadataCarrier): AccountRole {
  return normalizeAccountRole(
    user?.unsafeMetadata?.accountRole ?? user?.publicMetadata?.accountRole ?? "recycler"
  );
}

export function readInitialAccountRoleFromUser(user: MetadataCarrier): AccountRole {
  return normalizeAccountRole(
    user?.unsafeMetadata?.initialAccountRole ??
      user?.publicMetadata?.initialAccountRole ??
      user?.unsafeMetadata?.accountRole ??
      user?.publicMetadata?.accountRole ??
      "recycler"
  );
}

export function canAccessDashboardMode(role: AccountRole, mode: DashboardMode) {
  return role === "both" || role === mode;
}

export function resolveActiveDashboardMode(role: AccountRole, preferred?: unknown): DashboardMode {
  if (role === "supplier") return "supplier";
  if (role === "recycler") return "recycler";
  return isDashboardMode(preferred) ? preferred : "recycler";
}

export function readStoredDashboardMode() {
  if (typeof window === "undefined") return undefined;

  try {
    const stored = window.localStorage.getItem(ACTIVE_DASHBOARD_MODE_STORAGE_KEY);
    return isDashboardMode(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}

export function persistDashboardMode(mode: DashboardMode) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ACTIVE_DASHBOARD_MODE_STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent(ACCOUNT_ROLE_SYNC_EVENT));
  } catch {
    // Ignore storage sync failures.
  }
}

export function subscribeDashboardModeSync(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(ACCOUNT_ROLE_SYNC_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ACCOUNT_ROLE_SYNC_EVENT, callback);
  };
}
