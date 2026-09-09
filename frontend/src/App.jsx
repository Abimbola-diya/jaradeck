import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import BackgroundGrid from "./components/BackgroundGrid";
import DashboardPage from "./pages/DashboardPage";
import DashboardTabPage from "./pages/DashboardTabPage";
import HomePage from "./pages/HomePage";
import OnboardingPage from "./pages/OnboardingPage";
import WaitlistPage from "./pages/WaitlistPage";
import AdminViewPage from "./pages/AdminViewPage";
import ApplyPage from "./pages/ApplyPage";
import ApplySuccessPage from "./pages/ApplySuccessPage";
import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";

export default function App() {
  const location = useLocation();

  const isProductRoute =
    [
      "/onboarding",
      "/admin_view",
      "/apply",
      "/apply/success",
    ].includes(location.pathname) || location.pathname.startsWith("/dashboard");

  const isSignupRoute =
    location.pathname === "/signup" || location.pathname === "/login";

  const routesLocation = isSignupRoute
    ? { ...location, pathname: "/" }
    : location;

  return (
    <div className={isProductRoute ? "product-page" : "hero-page"}>
      {/* Background Vector Hatch Grid & Glow Overlay */}
      {!isProductRoute && <BackgroundGrid />}

      {/* Header component now self-contains all navigation & indicator state */}
      {!isProductRoute && <Header />}

      <Routes location={routesLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin_view" element={<AdminViewPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/apply/success" element={<ApplySuccessPage />} />
        <Route
          path="/dashboard/wallet"
          element={<DashboardTabPage tab="wallet" />}
        />
        <Route
          path="/dashboard/chat"
          element={<DashboardTabPage tab="chat" />}
        />
        <Route
          path="/dashboard/settings"
          element={<DashboardTabPage tab="settings" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isSignupRoute && <SignupPage />}
    </div>
  );
}
