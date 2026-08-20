import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BackgroundGrid from './components/BackgroundGrid';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import DashboardTabPage from './pages/DashboardTabPage';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import WaitlistPage from './pages/WaitlistPage';
import AdminViewPage from './pages/AdminViewPage';
import ApplyPage from './pages/ApplyPage';
import WalletPage from './pages/WalletPage';
import WithdrawPage from './pages/WithdrawPage';
import WithdrawAmountPage from './pages/WithdrawAmountPage';
import WithdrawConfirmPage from './pages/WithdrawConfirmPage';
import WithdrawPinPage from './pages/WithdrawPinPage';
import WithdrawSuccessPage from './pages/WithdrawSuccessPage';
import ChatPage from './pages/ChatPage';
import ChatThreadPage from './pages/ChatThreadPage';

export default function App() {
  const location = useLocation();
  const isProductRoute =
    ['/onboarding', '/admin_view', '/apply', '/apply/success'].includes(location.pathname) ||
    location.pathname.startsWith('/dashboard');

  return (
    <div className={isProductRoute ? 'product-page' : 'hero-page'}>
      {!isProductRoute && <BackgroundGrid />}
      {!isProductRoute && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin_view" element={<AdminViewPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/dashboard/wallet" element={<WalletPage />} />
        <Route path="/dashboard/wallet/withdraw" element={<WithdrawPage />} />
        <Route path="/dashboard/wallet/withdraw/amount" element={<WithdrawAmountPage />} />
        <Route path="/dashboard/wallet/withdraw/confirm" element={<WithdrawConfirmPage />} />
        <Route path="/dashboard/wallet/withdraw/pin" element={<WithdrawPinPage />} />
        <Route path="/dashboard/wallet/withdraw/success" element={<WithdrawSuccessPage />} />
        <Route path="/dashboard/chat" element={<ChatPage />} />
        <Route path="/dashboard/chat/:id" element={<ChatThreadPage />} />
        <Route path="/dashboard/settings" element={<DashboardTabPage tab="settings" />} />
        {/* ── Customer routes ── */}
        <Route path="/dashboard/customer" element={<DashboardTabPage role="customer" tab="home" />} />
        <Route path="/dashboard/customer/orders" element={<DashboardTabPage role="customer" tab="orders" />} />
        <Route path="/dashboard/customer/chat" element={<ChatPage />} />
        <Route path="/dashboard/customer/chat/:id" element={<ChatThreadPage />} />
        <Route path="/dashboard/customer/settings" element={<DashboardTabPage role="customer" tab="settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
