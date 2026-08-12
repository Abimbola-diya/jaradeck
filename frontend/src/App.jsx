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

export default function App() {
  const location = useLocation();
  // Product routes (onboarding / dashboard) drop the marketing chrome:
  // no blue background grid and no site header.
  const isProductRoute =
    location.pathname === '/onboarding' || location.pathname.startsWith('/dashboard');

  return (
    <div className={isProductRoute ? 'product-page' : 'hero-page'}>
      {/* Background Vector Hatch Grid & Glow Overlay */}
      {!isProductRoute && <BackgroundGrid />}

      {/* Floating Glassmorphic Navigation Bar */}
      {!isProductRoute && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin_view" element={<AdminViewPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/dashboard/wallet" element={<DashboardTabPage tab="wallet" />} />
        <Route path="/dashboard/wallet" element={<WalletPage />} />
        <Route path="/dashboard/wallet/withdraw" element={<WithdrawPage />} />
        <Route path="/dashboard/chat" element={<DashboardTabPage tab="chat" />} />
        <Route path="/dashboard/settings" element={<DashboardTabPage tab="settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
