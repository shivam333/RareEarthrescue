import { useUser } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";
import {
  AccountRole,
  canAccessDashboardMode,
  DashboardMode,
  persistDashboardMode,
  readAccountRoleFromUser,
  readInitialAccountRoleFromUser,
  readStoredDashboardMode,
  resolveActiveDashboardMode,
  subscribeDashboardModeSync,
} from "../lib/accountRole";

export function useAccountRole() {
  const { isLoaded, isSignedIn, user } = useUser();
  const accountRole = useMemo(() => readAccountRoleFromUser(user), [user]);
  const initialAccountRole = useMemo(() => readInitialAccountRoleFromUser(user), [user]);
  const [activeMode, setActiveModeState] = useState<DashboardMode>("recycler");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const nextMode = resolveActiveDashboardMode(accountRole, readStoredDashboardMode());
    setActiveModeState(nextMode);
    setIsHydrated(true);
  }, [accountRole, isLoaded]);

  useEffect(() => {
    if (!isHydrated) return;

    const nextMode = resolveActiveDashboardMode(accountRole, activeMode);
    if (nextMode !== activeMode) {
      setActiveModeState(nextMode);
      return;
    }

    persistDashboardMode(nextMode);
  }, [accountRole, activeMode, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    return subscribeDashboardModeSync(() => {
      const syncedMode = resolveActiveDashboardMode(accountRole, readStoredDashboardMode());
      setActiveModeState((current) => (current === syncedMode ? current : syncedMode));
    });
  }, [accountRole, isHydrated]);

  async function updateAccountRole(nextRole: AccountRole) {
    if (!user) return;

    const currentUnsafeMetadata = user.unsafeMetadata ?? {};
    const nextMode = resolveActiveDashboardMode(nextRole, activeMode);

    await user.update({
      unsafeMetadata: {
        ...currentUnsafeMetadata,
        accountRole: nextRole,
        initialAccountRole:
          currentUnsafeMetadata.initialAccountRole ?? currentUnsafeMetadata.accountRole ?? accountRole,
      },
    });

    setActiveModeState(nextMode);
    persistDashboardMode(nextMode);
  }

  function setActiveMode(nextMode: DashboardMode) {
    const resolvedMode = resolveActiveDashboardMode(accountRole, nextMode);
    setActiveModeState(resolvedMode);
    persistDashboardMode(resolvedMode);
  }

  return {
    isLoaded,
    isSignedIn,
    user,
    accountRole,
    initialAccountRole,
    activeMode,
    setActiveMode,
    updateAccountRole,
    canAccessSupplier: canAccessDashboardMode(accountRole, "supplier"),
    canAccessRecycler: canAccessDashboardMode(accountRole, "recycler"),
  };
}
