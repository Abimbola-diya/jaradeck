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
import ChatPage from './pages/ChatPage';
import ChatThreadPage from './pages/ChatThreadPage';
import ApplySuccessPage from './pages/ApplySuccessPage';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isProductRoute = ['/onboarding', '/admin_view', '/apply', '/apply/success'].includes(location.pathname) || location.pathname.startsWith('/dashboard');

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refs for navigation containers and buttons
  const mainPillRef = useRef(null);
  const hireRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const joinRef = useRef(null);
  const morePillRef = useRef(null);
  const dropdownRef = useRef(null);

  // Absolute indicator pill position state inside mainPillRef
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // Update position of sliding indicator relative to mainPillRef
  useEffect(() => {
    const updateIndicator = () => {
      const activeRef = {
        hire: hireRef.current,
        how: howRef.current,
        why: whyRef.current,
        join: joinRef.current,
      }[activeTab];

      if (activeRef && mainPillRef.current) {
        const pillRect = mainPillRef.current.getBoundingClientRect();
        const activeRect = activeRef.getBoundingClientRect();

        if (activeRect.width > 0) {
          setIndicatorStyle({
            left: activeRect.left - pillRect.left,
            width: activeRect.width,
            height: activeRect.height,
            opacity: 1,
          });
        } else {
          setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    document.fonts.ready.then(updateIndicator);
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        morePillRef.current &&
        !morePillRef.current.contains(e.target)
      ) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <Route path="/dashboard/wallet" element={<WalletPage />} />
        <Route path="/dashboard/wallet/withdraw" element={<WithdrawPage />} />
        <Route path="/dashboard/wallet/withdraw/amount" element={<WithdrawAmountPage />} />
        <Route path="/dashboard/wallet/withdraw/confirm" element={<WithdrawConfirmPage />} />
        <Route path="/dashboard/wallet/withdraw/pin" element={<WithdrawPinPage />} />
        <Route path="/dashboard/chat" element={<ChatPage />} />
        <Route path="/dashboard/chat/:id" element={<ChatThreadPage />} />
        <Route path="/dashboard/settings" element={<DashboardTabPage tab="settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
