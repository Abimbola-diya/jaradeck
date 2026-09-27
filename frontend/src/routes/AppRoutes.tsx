import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "../pages/HomePage";
import HomeScreen from "../pages/HomeScreen";
import SettingsPage from "../pages/SettingsPage";
import OnboardingPage from "../pages/OnboardingPage";
import SignupPage from "../pages/SignupPage";
import ApplyPage from "../pages/ApplyPage";
import ApplySuccessPage from "../pages/ApplySuccessPage";
import WaitlistPage from "../pages/WaitlistPage";
import AdminViewPage from "../pages/AdminViewPage";
import ProfilePortfolioPage from "../pages/ProfilePortfolio";
import WorkerWalletScreen from "../pages/WorkerWalletPage";
import WithdrawOptionsScreen from "../pages/WithdrawOptionPage";
import LocalBankWithdrawScreen from "../pages/LocalBankWithdrawScreen";
import ConfirmWithdrawScreen from "../pages/ConfirmWithdrawScreen";
import EnterPinScreen from "../pages/EnterPinScreen";
import WithdrawSuccessScreen from "../pages/WithdrawSuccessScreen";

// Chat Pages
import WorkerChatScreen from "../pages/WorkerChatScreen";
import ActiveChatThreadScreen from "../pages/ActiveChatThreadScreen";
import FreshChatScreen from "../pages/FreshChatScreen";

import { ProtectedRoute } from "../components/ProtectedRoutes";
import { AvailabilityScreen } from "../pages/AvailabilityScreen";
import { PayoutsScreen } from "../pages/PayoutsScreen";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<SignupPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/apply-success" element={<ApplySuccessPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />

      {/* ================= ALL PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Core Dashboard View */}
        <Route path="/dashboard" element={<HomeScreen />} />

        {/* Wallet Routes */}
        <Route path="/dashboard/wallet" element={<WorkerWalletScreen />} />
        <Route
          path="/dashboard/wallet/withdraw"
          element={<WithdrawOptionsScreen />}
        />
        <Route
          path="/dashboard/wallet/withdraw-bank"
          element={<LocalBankWithdrawScreen />}
        />
        <Route
          path="/dashboard/wallet/confirm-withdraw"
          element={<ConfirmWithdrawScreen />}
        />
        <Route
          path="/dashboard/wallet/enter-pin"
          element={<EnterPinScreen />}
        />
        <Route
          path="/dashboard/wallet/withdraw-success"
          element={<WithdrawSuccessScreen />}
        />

        {/* Chat Routes */}
        <Route path="/dashboard/chat" element={<WorkerChatScreen />} />
        <Route
          path="/dashboard/chat-thread"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/chat-thread/:id"
          element={<ActiveChatThreadScreen />}
        />
        <Route path="/dashboard/fresh-chat" element={<FreshChatScreen />} />
        <Route
          path="/dashboard/active-chat"
          element={<ActiveChatThreadScreen />}
        />

        {/* Settings & Profile Routes */}
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route
          path="/dashboard/settings/profile-portfolio"
          element={<ProfilePortfolioPage />}
        />
        <Route
          path="/dashboard/settings/availability"
          element={<AvailabilityScreen />}
        />
        <Route path="/dashboard/settings/payout" element={<PayoutsScreen />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminViewPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
