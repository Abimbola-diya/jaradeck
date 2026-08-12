import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import Nav from './Nav';
import MobileMenu from './MobileMenu';

// Marketing site header: logo + center nav pill + "More" pill + hamburger,
// plus the mobile drawer. Owns all navigation-only UI state.
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('why');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const morePillRef = useRef(null);
  const dropdownRef = useRef(null);

  // Navigate + set the active tab + scroll to top, closing any open menus.
  const selectTab = (key, path) => {
    setActiveTab(key);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close the "More" dropdown when clicking outside it.
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
    <>
      {/* Floating Glassmorphic Navigation Bar Container */}
      <header className="nav-header">
        <div className="nav-header-wrapper">
          {/* 1. Far Left Logo: Bare SVG Logo */}
          <div
            className="nav-logo"
            title="Jaradeck"
            onClick={() => selectTab('why', '/')}
            style={{ cursor: 'pointer' }}
          >
            <BrandLogo width={41} />
          </div>

          {/* 2. Center Standalone Main Navigation Glassmorphic Pill */}
          <Nav activeTab={activeTab} pathname={location.pathname} onSelect={selectTab} />

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
                <button className="dropdown-item-btn" onClick={() => setIsMoreOpen(false)}>
                  Contact Us
                </button>
                <button className="dropdown-item-btn" onClick={() => setIsMoreOpen(false)}>
                  FAQs
                </button>
                <button className="dropdown-item-btn" onClick={() => setIsMoreOpen(false)}>
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <MobileMenu
          activeTab={activeTab}
          pathname={location.pathname}
          onSelect={selectTab}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
