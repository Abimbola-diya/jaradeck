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
import WorkerChatScreen, {  } from "../pages/WorkerChatScreen";
// import ChatThreadScreen from "../pages/ChatThreadScreen";
import ActiveChatThreadScreen, {
  ChatThreadScreen,
} from "../pages/ActiveChatThreadScreen";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/apply-success" element={<ApplySuccessPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />

      {/* Role Dashboard Routes */}
      <Route path="/dashboard" element={<WorkerDashboardPage />} />
      <Route
        path="/dashboard/customer"
        element={<WorkerDashboardPage role="customer" />}
      />
      <Route
        path="/dashboard/freelancer"
        element={<WorkerDashboardPage role="freelancer" />}
      />

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

      {/* Worker Chat Routes */}
      <Route path="/dashboard/chat" element={<WorkerChatScreen />} />
      <Route path="/dashboard/customer/chat" element={<WorkerChatScreen />} />
      <Route path="/dashboard/freelancer/chat" element={<WorkerChatScreen />} />

      {/* Standard Individual Thread Routes */}
      <Route path="/dashboard/chat-thread" element={<ChatThreadScreen />} />
      <Route path="/dashboard/chat-thread/:id" element={<ChatThreadScreen />} />
      <Route
        path="/dashboard/freelancer/chat-thread"
        element={<ChatThreadScreen />}
      />
      <Route
        path="/dashboard/freelancer/chat-thread/:id"
        element={<ChatThreadScreen />}
      />
      <Route
        path="/dashboard/customer/chat-thread"
        element={<ChatThreadScreen />}
      />
      <Route
        path="/dashboard/customer/chat-thread/:id"
        element={<ChatThreadScreen />}
      />

      {/* Active System / Fresh Match Thread Routes */}
      <Route
        path="/dashboard/fresh-chat"
        element={<ActiveChatThreadScreen />}
      />
      <Route
        path="/dashboard/freelancer/fresh-chat"
        element={<ActiveChatThreadScreen />}
      />
      <Route
        path="/dashboard/customer/fresh-chat"
        element={<ActiveChatThreadScreen />}
      />

      {/* Settings & Profile Routes */}
      <Route path="/dashboard/settings" element={<SettingsPage />} />
      <Route path="/dashboard/customer/settings" element={<SettingsPage />} />
      <Route path="/dashboard/freelancer/settings" element={<SettingsPage />} />
      <Route
        path="/dashboard/settings/profile-portfolio"
        element={<ProfilePortfolioPage />}
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

      {/* Local Bank Withdrawal Routes */}
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

      {/* Confirm Withdrawal Routes */}
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

      {/* Security PIN Authorization Routes */}
      <Route path="/dashboard/wallet/enter-pin" element={<EnterPinScreen />} />
      <Route
        path="/dashboard/customer/enter-pin"
        element={<EnterPinScreen />}
      />
      <Route
        path="/dashboard/freelancer/enter-pin"
        element={<EnterPinScreen />}
      />

      {/* Withdrawal Success Routes */}
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

      {/* Admin */}
      <Route path="/admin" element={<AdminViewPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
