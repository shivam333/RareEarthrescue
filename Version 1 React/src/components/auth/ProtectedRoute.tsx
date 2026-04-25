import { useAuth } from "@clerk/react";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DashboardMode } from "../../lib/accountRole";
import { useAccountRole } from "../../hooks/useAccountRole";

export function ProtectedRoute({
  children,
  requiredMode,
}: {
  children: ReactNode;
  requiredMode?: DashboardMode;
}) {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isRoleLoaded, canAccessRecycler, canAccessSupplier } = useAccountRole();

  if (!isLoaded || (isSignedIn && requiredMode && !isRoleLoaded)) {
    return (
      <main className="page">
        <section className="shell page-hero">
          <div className="panel p-8">
            <p className="eyebrow">Loading</p>
            <h1 className="heading-2">Checking secure access</h1>
            <p className="mt-4 body-copy">
              Rare Earth Rescue is verifying your session before opening the dashboard.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!isSignedIn) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace to={`/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`} />;
  }

  if (requiredMode === "recycler" && !canAccessRecycler) {
    return <Navigate replace to="/dashboard" />;
  }

  if (requiredMode === "supplier" && !canAccessSupplier) {
    return <Navigate replace to="/dashboard" />;
  }

  return <>{children}</>;
}
