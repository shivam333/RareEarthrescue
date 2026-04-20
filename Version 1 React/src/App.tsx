import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { AboutPage } from "./pages/AboutPage";
import { AuthPage } from "./pages/AuthPage";
import { ContactPage } from "./pages/ContactPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { NewsPage } from "./pages/NewsPage";
import { OAuthCallbackPage } from "./pages/OAuthCallbackPage";
import { RecyclerOnboardingPage } from "./pages/RecyclerOnboardingPage";
import { SupplierOnboardingPage } from "./pages/SupplierOnboardingPage";

export default function App() {
  const location = useLocation();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/supplier-onboarding" element={<SupplierOnboardingPage />} />
          <Route path="/recycler-onboarding" element={<RecyclerOnboardingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}
