import React, { useState, useRef, useEffect } from 'react';
import BackgroundGrid from './components/BackgroundGrid';
import StadiumIllustration from './components/StadiumIllustration';
import TodoAnimation from './components/TodoAnimation';
import NeedItDoneAnimation from './components/NeedItDoneAnimation';
import ComparisonCards from './components/ComparisonCards';
import FeatureCards from './components/FeatureCards';

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

const HEADLINES = [
  [
    { text: "Your to-do list isn't ", action: false },
    { text: "getting shorter.", action: true }
  ],
  [
    { text: "Outsource", action: true },
    { text: " the grind, let us do the ", action: false },
    { text: "sweating.", action: true }
  ],
  [
    { text: "You can't do ", action: false },
    { text: "everything yourself.", action: true }
  ],
  [
    { text: "Keep", action: true },
    { text: " your sanity, ", action: false },
    { text: "give", action: true },
    { text: " us the grunt work.", action: false }
  ]
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('join');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  // Rotate headline every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prevIndex) => (prevIndex + 1) % HEADLINES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      <header className="nav-header">
        <div className="nav-header-wrapper">

          {/* 1. Far Left Logo: Bare SVG Logo (No circle/pill background) */}
          <div className="nav-logo" title="Jaradeck" onClick={() => setActiveTab('join')}>
            <JaradeckLogo width={41} />
          </div>

          {/* 2. Center Standalone Main Navigation Glassmorphic Pill */}
          <nav className="nav-main-pill" ref={mainPillRef}>
            {/* Sliding active white pill background indicator */}
            <div className="nav-active-indicator" style={indicatorStyle}></div>

            <button
              ref={hireRef}
              className={`nav-link-btn ${activeTab === 'hire' ? 'active' : ''}`}
              onClick={() => { setActiveTab('hire'); setIsMoreOpen(false); }}
            >
              Hire Talent
            </button>

            <button
              ref={howRef}
              className={`nav-link-btn ${activeTab === 'how' ? 'active' : ''}`}
              onClick={() => { setActiveTab('how'); setIsMoreOpen(false); }}
            >
              How It Works
            </button>

            <button
              ref={whyRef}
              className={`nav-link-btn ${activeTab === 'why' ? 'active' : ''}`}
              onClick={() => { setActiveTab('why'); setIsMoreOpen(false); }}
            >
              Why Jaradeck
            </button>

            <button
              ref={joinRef}
              className={`nav-link-btn ${activeTab === 'join' ? 'active' : ''}`}
              onClick={() => { setActiveTab('join'); setIsMoreOpen(false); }}
            >
              Join Jaradeck
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
          <button
            className={`mobile-nav-link ${activeTab === 'hire' ? 'active' : ''}`}
            onClick={() => { setActiveTab('hire'); setIsMobileMenuOpen(false); }}
          >
            Hire Talent
          </button>
          <button
            className={`mobile-nav-link ${activeTab === 'how' ? 'active' : ''}`}
            onClick={() => { setActiveTab('how'); setIsMobileMenuOpen(false); }}
          >
            How It Works
          </button>
          <button
            className={`mobile-nav-link ${activeTab === 'why' ? 'active' : ''}`}
            onClick={() => { setActiveTab('why'); setIsMobileMenuOpen(false); }}
          >
            Why Jaradeck
          </button>
          <button
            className={`mobile-nav-link ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => { setActiveTab('join'); setIsMobileMenuOpen(false); }}
          >
            Join Jaradeck
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => { setIsMobileMenuOpen(false); }}
          >
            Contact Us
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => { setIsMobileMenuOpen(false); }}
          >
            FAQs
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => { setIsMobileMenuOpen(false); }}
          >
            Blog
          </button>
        </div>
      )}

      {/* Main Hero Content Area */}
      <main className="hero-main">
        <div className="hero-content">
          <div className="hero-headline-wrapper">
            <h1 key={headlineIndex} className="hero-headline hero-headline-animated">
              {HEADLINES[headlineIndex].map((part, index) =>
                part.action ? (
                  <span key={index} className="action-word">{part.text}</span>
                ) : (
                  <React.Fragment key={index}>{part.text}</React.Fragment>
                )
              )}
            </h1>
          </div>

          <p className="hero-subtitle">
            Jaradeck is the easiest way to get work done without sifting through endless profiles and fake reviews. Give us the grunt work.
          </p>

          <button className="hero-cta-btn" onClick={() => setActiveTab('join')}>
            <span>Join Jaradeck</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
              <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.66667M10.5 3.5V9.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Stadium Architecture & Hero Graphics */}
        <div className="stadium-section">
          <StadiumIllustration />
        </div>
      </main>

      {/* Blue Canopy Section */}
      <section className="canopy-section">
        <div className="canopy-content-wrapper">
          <NeedItDoneAnimation />
        </div>
      </section>

      {/* Comparison Cards Section */}
      <ComparisonCards />

      {/* Feature Cards Section (60 Seconds Office Card) */}
      <FeatureCards />
    </div>
  );
}
