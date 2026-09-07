import { useState, useRef, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BackgroundGrid from './components/BackgroundGrid';
import DashboardPage from './pages/DashboardPage';
import DashboardTabPage from './pages/DashboardTabPage';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import WaitlistPage from './pages/WaitlistPage';
import AdminViewPage from './pages/AdminViewPage';
import ApplyPage from './pages/ApplyPage';
import ApplySuccessPage from './pages/ApplySuccessPage';
import Header from './components/Header';
import SignupPage from './pages/SignupPage';

export default function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname === '/waitlist' ? 'join' : 'why');
  // const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isProductRoute = ['/onboarding', '/admin_view', "/login", '/apply', '/apply/success'].includes(location.pathname) || location.pathname.startsWith('/dashboard');
 const isSignupRoute = location.pathname === "/signup";
 const routesLocation = isSignupRoute
   ? { ...location, pathname: "/" }
   : location;

  useEffect(() => {
    if (location.pathname === '/waitlist') {
      setActiveTab((prev) => prev !== 'join' ? 'join' : prev);
    } else if (location.pathname === '/') {
      setActiveTab((prev) => prev === 'join' ? 'why' : prev);
    }
  }, [location.pathname]);


  // Refs for navigation containers and buttons
  const mainPillRef = useRef(null);
  const hireRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const joinRef = useRef(null);
  // const morePillRef = useRef(null);
  // const dropdownRef = useRef(null);

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
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(e.target) &&
  //       morePillRef.current &&
  //       !morePillRef.current.contains(e.target)
  //     ) {
  //       setIsMoreOpen(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <div className={isProductRoute ? "product-page" : "hero-page"}>
      {/* Background Vector Hatch Grid & Glow Overlay */}
      {!isProductRoute && <BackgroundGrid />}

      {/* Floating Glassmorphic Navigation Bar Container */}
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
