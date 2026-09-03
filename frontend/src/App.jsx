import { useState, useRef, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BackgroundGrid from './components/BackgroundGrid';
import BrandLogo from './components/BrandLogo';
import DashboardPage from './pages/DashboardPage';
import DashboardTabPage from './pages/DashboardTabPage';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import WaitlistPage from './pages/WaitlistPage';
import AdminViewPage from './pages/AdminViewPage';
import ApplyPage from './pages/ApplyPage';
import ApplySuccessPage from './pages/ApplySuccessPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const previousLocation = useRef(location);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname === '/waitlist' ? 'join' : 'why');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isProductRoute = ['/onboarding', '/admin_view', '/apply', '/apply/success'].includes(location.pathname) || location.pathname.startsWith('/dashboard');
  const isSignupRoute = location.pathname === '/signup';

  if (!isSignupRoute) {
    previousLocation.current = location;
  }
  const routesLocation = isSignupRoute ? previousLocation.current : location;

  useEffect(() => {
    if (location.pathname === '/waitlist') {
      setActiveTab((prev) => prev !== 'join' ? 'join' : prev);
    } else if (location.pathname === '/' || location.pathname === '/signup') {
      setActiveTab((prev) => prev === 'join' ? 'why' : prev);
    }
  }, [location.pathname]);


  const navigateTo = (path, e) => {
    if (e && (e.clientX || e.currentTarget)) {
      const rect = e.currentTarget?.getBoundingClientRect();
      const originX = rect ? rect.left + rect.width / 2 : e.clientX;
      const originY = rect ? rect.top + rect.height / 2 : e.clientY;
      navigate(path, { state: { origin: { x: originX, y: originY } } });
    } else {
      navigate(path);
    }
    if (path !== '/signup') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

      {/* Floating Glassmorphic Navigation Bar Container */}
      {!isProductRoute && (
        <header className="nav-header">
        <div className="nav-header-wrapper">

          {/* 1. Far Left Logo: Bare SVG Logo */}
          <div
            className="nav-logo"
            title="Jaradeck"
            onClick={() => navigateTo('/')}
            style={{ cursor: 'pointer' }}
          >
            <BrandLogo width={41} />
          </div>

          {/* 2. Center Standalone Main Navigation Glassmorphic Pill */}
          <nav className="nav-main-pill" ref={mainPillRef}>
            {/* Sliding active white pill background indicator */}
            <div className="nav-active-indicator" style={indicatorStyle}></div>

            <button
              ref={hireRef}
              className={`nav-link-btn ${activeTab === 'hire' && (location.pathname === '/' || location.pathname === '/signup') ? 'active' : ''}`}
              onClick={() => { setActiveTab('hire'); setIsMoreOpen(false); navigateTo('/'); }}
            >
              Hire Talent
            </button>

            <button
              ref={howRef}
              className={`nav-link-btn ${activeTab === 'how' && (location.pathname === '/' || location.pathname === '/signup') ? 'active' : ''}`}
              onClick={() => { setActiveTab('how'); setIsMoreOpen(false); navigateTo('/'); }}
            >
              How It Works
            </button>

            <button
              ref={whyRef}
              className={`nav-link-btn ${activeTab === 'why' && (location.pathname === '/' || location.pathname === '/signup') ? 'active' : ''}`}
              onClick={() => { setActiveTab('why'); setIsMoreOpen(false); navigateTo('/'); }}
            >
              Why Jaradeck
            </button>

            <button
              ref={joinRef}
              className={`nav-link-btn ${activeTab === 'join' || location.pathname === '/waitlist' ? 'active' : ''}`}
              onClick={() => { setActiveTab('join'); setIsMoreOpen(false); navigateTo('/waitlist'); }}
            >
              Use Jaradeck
            </button>
          </nav>

          {/* 3. Far Right Controls: White Sign up Pill + Log in text link (Desktop) / Triple Button (Mobile) */}
          <div className="nav-header-right">
            <button
              className="nav-signup-btn"
              onClick={(e) => navigateTo('/signup', e)}
            >
              Sign up
            </button>

            <button
              className="nav-login-btn"
              onClick={() => navigateTo('/onboarding')}
            >
              Log in
            </button>

            {/* Triple Button / Hamburger Menu Icon (Mobile) */}
            <button
              className="nav-hamburger"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          {/* Top Bar inside Overlay */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-header-actions">
              <button
                className="mobile-action-circle"
                aria-label="Jaradeck Logo Action"
                onClick={() => { setIsMobileMenuOpen(false); navigateTo('/'); }}
              >
                <BrandLogo width={22} tone="blue" />
              </button>

              <button
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Sectioned Menu Items List */}
          <div className="mobile-menu-list">
            <button
              className={`mobile-nav-row ${activeTab === 'hire' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('hire'); setIsMobileMenuOpen(false); navigateTo('/'); }}
            >
              <span className="mobile-row-text">Hire Talent</span>
            </button>

            <button
              className={`mobile-nav-row ${activeTab === 'how' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('how'); setIsMobileMenuOpen(false); navigateTo('/'); }}
            >
              <span className="mobile-row-text">How It Works</span>
            </button>

            <button
              className={`mobile-nav-row ${activeTab === 'why' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('why'); setIsMobileMenuOpen(false); navigateTo('/'); }}
            >
              <span className="mobile-row-text">Why Jaradeck</span>
            </button>

            <button
              className={`mobile-nav-row ${location.pathname === '/waitlist' ? 'active' : ''}`}
              onClick={() => { setActiveTab('join'); setIsMobileMenuOpen(false); navigateTo('/waitlist'); }}
            >
              <span className="mobile-row-text">Use Jaradeck</span>
            </button>

            <button
              className="mobile-nav-row"
              onClick={() => { setIsMobileMenuOpen(false); }}
            >
              <span className="mobile-row-text">Contact Us</span>
            </button>

            <button
              className="mobile-nav-row"
              onClick={() => { setIsMobileMenuOpen(false); }}
            >
              <span className="mobile-row-text">FAQs</span>
            </button>

            <button
              className="mobile-nav-row"
              onClick={() => { setIsMobileMenuOpen(false); }}
            >
              <span className="mobile-row-text">Blog</span>
            </button>
          </div>
        </div>
      )}

      <Routes location={routesLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin_view" element={<AdminViewPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/apply/success" element={<ApplySuccessPage />} />
        <Route path="/dashboard/wallet" element={<DashboardTabPage tab="wallet" />} />
        <Route path="/dashboard/chat" element={<DashboardTabPage tab="chat" />} />
        <Route path="/dashboard/settings" element={<DashboardTabPage tab="settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isSignupRoute && <SignupPage />}
    </div>
  );
}
