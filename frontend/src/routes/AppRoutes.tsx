import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "../pages/HomePage";
import WorkerDashboardPage from "../pages/WorkerDashboardPage";
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

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<WorkerDashboardPage />} />
        <Route path="/dashboard/customer" element={<WorkerDashboardPage />} />
        <Route path="/dashboard/freelancer" element={<WorkerDashboardPage />} />

        {/* Wallet Routes */}
        <Route path="/dashboard/wallet" element={<WorkerWalletScreen />} />
        <Route
          path="/dashboard/customer/wallet"
          element={<WorkerWalletScreen />}
        />
        <Route
          path="/dashboard/freelancer/wallet"
          element={<WorkerWalletScreen />}
        />

        {/* Withdraw Routes */}
        <Route
          path="/dashboard/wallet/withdraw"
          element={<WithdrawOptionsScreen />}
        />
        <Route
          path="/dashboard/customer/withdraw"
          element={<WithdrawOptionsScreen />}
        />
        <Route
          path="/dashboard/freelancer/withdraw"
          element={<WithdrawOptionsScreen />}
        />

        <Route
          path="/dashboard/wallet/withdraw-bank"
          element={<LocalBankWithdrawScreen />}
        />
        <Route
          path="/dashboard/customer/withdraw-bank"
          element={<LocalBankWithdrawScreen />}
        />
        <Route
          path="/dashboard/freelancer/withdraw-bank"
          element={<LocalBankWithdrawScreen />}
        />

        <Route
          path="/dashboard/wallet/confirm-withdraw"
          element={<ConfirmWithdrawScreen />}
        />
        <Route
          path="/dashboard/customer/confirm-withdraw"
          element={<ConfirmWithdrawScreen />}
        />
        <Route
          path="/dashboard/freelancer/confirm-withdraw"
          element={<ConfirmWithdrawScreen />}
        />

        <Route
          path="/dashboard/wallet/enter-pin"
          element={<EnterPinScreen />}
        />
        <Route
          path="/dashboard/customer/enter-pin"
          element={<EnterPinScreen />}
        />
        <Route
          path="/dashboard/freelancer/enter-pin"
          element={<EnterPinScreen />}
        />

        <Route
          path="/dashboard/wallet/withdraw-success"
          element={<WithdrawSuccessScreen />}
        />
        <Route
          path="/dashboard/customer/withdraw-success"
          element={<WithdrawSuccessScreen />}
        />
        <Route
          path="/dashboard/freelancer/withdraw-success"
          element={<WithdrawSuccessScreen />}
        />

        {/* Chat Routes */}
        <Route path="/dashboard/chat" element={<WorkerChatScreen />} />
        <Route path="/dashboard/customer/chat" element={<WorkerChatScreen />} />
        <Route
          path="/dashboard/freelancer/chat"
          element={<WorkerChatScreen />}
        />

        <Route
          path="/dashboard/chat-thread"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/chat-thread/:id"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/freelancer/chat-thread"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/freelancer/chat-thread/:id"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/customer/chat-thread"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/customer/chat-thread/:id"
          element={<ActiveChatThreadScreen />}
        />

        <Route path="/dashboard/fresh-chat" element={<FreshChatScreen />} />
        <Route
          path="/dashboard/freelancer/fresh-chat"
          element={<FreshChatScreen />}
        />
        <Route
          path="/dashboard/customer/fresh-chat"
          element={<FreshChatScreen />}
        />

        <Route
          path="/dashboard/active-chat"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/freelancer/active-chat"
          element={<ActiveChatThreadScreen />}
        />
        <Route
          path="/dashboard/customer/active-chat"
          element={<ActiveChatThreadScreen />}
        />

        {/* Settings & Profile Routes */}
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/customer/settings" element={<SettingsPage />} />
        <Route
          path="/dashboard/freelancer/settings"
          element={<SettingsPage />}
        />
        <Route
          path="/dashboard/settings/profile-portfolio"
          element={<ProfilePortfolioPage />}
        />
        <Route
          path="/dashboard/settings/availability"
          element={<AvailabilityScreen />}
        />
        <Route
          path="/dashboard/freelancer/settings/availability"
          element={<AvailabilityScreen />}
        />

        {/* Worker-Specific Nested Sub-routes (Role Guarded) */}
        <Route
          element={<ProtectedRoute allowedRoles={["worker", "freelancer"]} />}
        >
          <Route path="/dashboard/worker" element={<WorkerDashboardPage />} />
          <Route path="/dashboard/worker/chat" element={<WorkerChatScreen />} />
          <Route
            path="/dashboard/worker/fresh-chat"
            element={<FreshChatScreen />}
          />
          <Route
            path="/dashboard/worker/chat-thread/:id"
            element={<ActiveChatThreadScreen />}
          />
        </Route>
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminViewPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
