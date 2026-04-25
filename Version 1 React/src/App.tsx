import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { AboutPage } from "./pages/AboutPage";
import { AuthPage } from "./pages/AuthPage";
import { ContactPage } from "./pages/ContactPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FinalizeOrderPage } from "./pages/FinalizeOrderPage";
import { GetStartedPage } from "./pages/GetStartedPage";
import { HomePage } from "./pages/HomePage";
import { LiveRecyclerDashboardPage } from "./pages/LiveRecyclerDashboardPage";
import { LiveBiddingTablePage } from "./pages/LiveBiddingTablePage";
import { DashboardListingDetailPage } from "./pages/DashboardListingDetailPage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { NewsPage } from "./pages/NewsPage";
import { OAuthCallbackPage } from "./pages/OAuthCallbackPage";
import { PlanDetailPage } from "./pages/PlanDetailPage";
import { RecyclerOnboardingPage } from "./pages/RecyclerOnboardingPage";
import { SourceMarketplacePage } from "./pages/SourceMarketplacePage";
import { SupplierOnboardingPage } from "./pages/SupplierOnboardingPage";

export default function App() {
  const location = useLocation();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/source/:sourceId" element={<SourceMarketplacePage />} />
          <Route path="/plans/:planSlug/:role" element={<PlanDetailPage />} />
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
          <Route
            path="/dashboard/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/live-bids"
            element={
              <ProtectedRoute>
                <LiveBiddingTablePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/live/:sourceId"
            element={
              <ProtectedRoute>
                <LiveRecyclerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/live/:sourceId/listing/:listingId"
            element={
              <ProtectedRoute>
                <DashboardListingDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/place-order/:listingId"
            element={
              <ProtectedRoute>
                <FinalizeOrderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}
