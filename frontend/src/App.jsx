import React, { useState, useRef, useEffect } from 'react';
import BackgroundGrid from './components/BackgroundGrid';
import StadiumIllustration from './components/StadiumIllustration';

// JaraDeck 3D stacked-blocks logo SVG
function JaradeckLogo({ width = 42 }) {
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
  const [activeTab, setActiveTab] = useState('join'); // Default active tab is 'join'

  const navItems = [
    { id: 'hire', label: 'Hire Talent' },
    { id: 'how', label: 'How It Works' },
    { id: 'why', label: 'Why Jaradeck' },
    { id: 'join', label: 'Join Jaradeck' }
  ];

  const tabRefs = useRef({});
  const containerRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, height: 0, opacity: 0 });

  // Update sliding white pill dimensions & position on activeTab change or resize
  useEffect(() => {
    const updatePill = () => {
      const activeEl = tabRefs.current[activeTab];
      const containerEl = containerRef.current;
      if (activeEl && containerEl) {
        const activeRect = activeEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();

        setPillStyle({
          left: activeRect.left - containerRect.left,
          top: activeRect.top - containerRect.top,
          width: activeRect.width,
          height: activeRect.height,
          opacity: 1
        });
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeTab]);

  return (
    <div className="hero-page">
      {/* Background Vector Grid & Glow Overlay */}
      <BackgroundGrid />

      {/* Floating Glassmorphic Navigation Bar Container */}
      <header className="nav-header">
        <nav className="floating-nav">
          {/* Logo on Left */}
          <div className="nav-logo" title="Jaradeck">
            <JaradeckLogo width={40} />
          </div>

          {/* Desktop Nav Items Wrapper with Sliding White Pill Indicator */}
          <div className="nav-items-wrapper" ref={containerRef}>
            {/* Sliding White Active Pill Background */}
            <div 
              className="sliding-pill-indicator"
              style={{
                transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
                width: `${pillStyle.width}px`,
                height: `${pillStyle.height}px`,
                opacity: pillStyle.opacity
              }}
            />

            {/* Navigation Tab Buttons */}
            {navItems.map((item) => (
              <button
                key={item.id}
                ref={(el) => (tabRefs.current[item.id] = el)}
                className={`nav-tab-btn ${item.id === 'join' ? 'is-join-btn' : ''} ${activeTab === item.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Hamburger Menu Icon */}
          <button 
            className="nav-hamburger" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
          {navItems.map((item) => (
            <button 
              key={item.id}
              className={`mobile-nav-link ${activeTab === item.id ? 'is-active' : ''}`} 
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Hero Content Area */}
      <main className="hero-main">
        <div className="hero-content">
          <h1 className="hero-headline">
            Hiring shouldn't feel like another full-time job.
          </h1>

          <p className="hero-subtitle">
            Jaradeck is the work completion platform that handles the vetting, matching, and management so you can just get the work done
          </p>

          <button className="hero-cta-btn" onClick={() => setActiveTab('join')}>
            <span>Join Jaradeck</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
              <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.66667M10.5 3.5V9.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Floating Objection Badges */}
        <div className="badges-wrapper">
          <div className="objection-badge badge-yellow">
            <span>"0L..."</span>
          </div>
          <div className="objection-badge badge-pink">
            <span>"Palava"</span>
          </div>
          <div className="objection-badge badge-red">
            <span>"They always ghost"</span>
          </div>
          <div className="objection-badge badge-orange">
            <span>"No talents"</span>
          </div>
          <div className="objection-badge badge-green">
            <span>"Nigeria lacks talents*"</span>
          </div>
        </div>

        {/* Stadium Architecture Graphic */}
        <StadiumIllustration />
      </main>
    </div>
  );
}
