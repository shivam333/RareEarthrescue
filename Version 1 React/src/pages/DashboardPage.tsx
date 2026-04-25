import { useAccountRole } from "../hooks/useAccountRole";
import { RecyclerDashboardPage } from "./RecyclerDashboardPage";
import { SupplierDashboardPage } from "./SupplierDashboardPage";

export function DashboardPage() {
  const { isLoaded, accountRole, activeMode, setActiveMode } = useAccountRole();

  if (!isLoaded) {
    return null;
  }

  const showModeSwitch = accountRole === "both";

  if (activeMode === "supplier") {
    return (
      <SupplierDashboardPage
        showModeSwitch={showModeSwitch}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />
    );
  }

  return (
    <RecyclerDashboardPage
      showModeSwitch={showModeSwitch}
      activeMode={activeMode}
      onModeChange={setActiveMode}
    />
  );
}
