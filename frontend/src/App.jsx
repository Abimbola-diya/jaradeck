import { useState, useRef, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BackgroundGrid from './components/BackgroundGrid';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';

// Jaradeck 3D stacked-blocks logo SVG
function JaradeckLogo({ width = 41 }) {
  return (
    <svg width={width} height={width * (310 / 434)} viewBox="0 0 434 310" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M41.2752 225.44H433.87V309.91H41.2752V225.44Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 225.44H41.2752L0 203.693H391.426L433.87 225.44Z" fill="#E2E2E2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 225.44V309.91L0 284.779V203.693L41.2752 225.44Z" fill="#EFEFEF" />
      <path d="M41.2752 123.953H433.87V208.423H41.2752V123.953Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 123.953H41.2752L0 102.206H391.426L433.87 123.953Z" fill="#E2E2E2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 123.953V208.423L0 183.291V102.206L41.2752 123.953Z" fill="#EFEFEF" />
      <path d="M41.2752 21.7469H433.87V106.217H41.2752V21.7469Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 21.7469H41.2752L0 0H391.426L433.87 21.7469Z" fill="#E2E2E2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 21.7469V106.217L0 81.0853V0L41.2752 21.7469Z" fill="#EFEFEF" />
    </svg>
  );
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('join');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="hero-page">
      {/* Background Vector Hatch Grid & Glow Overlay */}
      <BackgroundGrid />

      {/* Floating Glassmorphic Navigation Bar Container */}
      {location.pathname !== '/onboarding' && (
        <header className="nav-header">
        <div className="nav-header-wrapper">

          {/* 1. Far Left Logo: Bare SVG Logo */}
          <div
            className="nav-logo"
            title="Jaradeck"
            onClick={() => navigateTo('/')}
            style={{ cursor: 'pointer' }}
          >
            <JaradeckLogo width={41} />
          </div>

          {/* 2. Center Standalone Main Navigation Glassmorphic Pill */}
          <nav className="nav-main-pill" ref={mainPillRef}>
            {/* Sliding active white pill background indicator */}
            <div className="nav-active-indicator" style={indicatorStyle}></div>

            <button
              ref={hireRef}
              className={`nav-link-btn ${activeTab === 'hire' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('hire'); setIsMoreOpen(false); navigateTo('/'); }}
            >
              Hire Talent
            </button>

            <button
              ref={howRef}
              className={`nav-link-btn ${activeTab === 'how' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('how'); setIsMoreOpen(false); navigateTo('/'); }}
            >
              How It Works
            </button>

            <button
              ref={whyRef}
              className={`nav-link-btn ${activeTab === 'why' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('why'); setIsMoreOpen(false); navigateTo('/'); }}
            >
              Why Jaradeck
            </button>

            <button
              ref={joinRef}
              className={`nav-link-btn ${location.pathname === '/onboarding' ? 'active' : ''}`}
              onClick={() => { setActiveTab('join'); setIsMoreOpen(false); navigateTo('/onboarding'); }}
            >
              Use Jaradeck
            </button>
          </nav>

          {/* 3. Far Right Standalone "More ⌃" Glassmorphic Pill */}
          <div className="nav-more-wrapper">
            <button
              ref={morePillRef}
              className={`nav-more-pill ${isMoreOpen ? 'open' : ''}`}
              onClick={() => setIsMoreOpen(!isMoreOpen)}
            >
              <span>More</span>
              <svg
                className={`chevron-icon ${isMoreOpen ? 'open' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Glassmorphic Dropdown Menu popping under More Pill */}
            {isMoreOpen && (
              <div className="nav-dropdown-menu" ref={dropdownRef}>
                <button
                  className="dropdown-item-btn"
                  onClick={() => { setIsMoreOpen(false); }}
                >
                  Contact Us
                </button>
                <button
                  className="dropdown-item-btn"
                  onClick={() => { setIsMoreOpen(false); }}
                >
                  FAQs
                </button>
                <button
                  className="dropdown-item-btn"
                  onClick={() => { setIsMoreOpen(false); }}
                >
                  Blog
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
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
                <svg width="22" height="16" viewBox="0 0 42 30" fill="none">
                  <path d="M3.90593 21.5234H41.0577V29.5169H3.90593V21.5234Z" fill="#0048B3" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M41.0577 21.5234H3.90593L0 19.4655H37.0411L41.0577 21.5234Z" fill="#00388D" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.90593 21.5234V29.5169L0 27.1387V19.4655L3.90593 21.5234Z" fill="#0048B3" />
                  <path d="M3.90593 11.9195H41.0577V19.913H3.90593V11.9195Z" fill="#0048B3" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M41.0577 11.9195H3.90593L0 9.86157H37.0411L41.0577 11.9195Z" fill="#00388D" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.90593 11.9195V19.913L0 17.5348V9.86157L3.90593 11.9195Z" fill="#0048B3" />
                  <path d="M3.90593 2.05795H41.0577V10.0515H3.90593V2.05795Z" fill="#0048B3" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M41.0577 2.05795H3.90593L0 0H37.0411L41.0577 2.05795Z" fill="#00388D" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.90593 2.05795V10.0515L0 7.67324V0L3.90593 2.05795Z" fill="#0048B3" />
                </svg>
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
              className={`mobile-nav-row ${location.pathname === '/onboarding' ? 'active' : ''}`}
              onClick={() => { setActiveTab('join'); setIsMobileMenuOpen(false); navigateTo('/onboarding'); }}
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

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
