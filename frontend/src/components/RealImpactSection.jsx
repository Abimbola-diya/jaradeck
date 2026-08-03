import React, { useEffect, useRef, useCallback, useState } from 'react';

export default function RealImpactSection() {
  const sectionRef = useRef(null);
  const quoteCardRef = useRef(null);
  const rafRef = useRef(null);
  const [isMobileRevealed, setIsMobileRevealed] = useState(false);

  const updateMobileSlide = useCallback(() => {
    if (!sectionRef.current || !quoteCardRef.current) return;
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      quoteCardRef.current.style.transform = 'none';
      return;
    }

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Track scroll progress through the mobile section
    const start = windowHeight * 0.55;
    const end = -windowHeight * 0.25;

    const progress = Math.min(Math.max((start - sectionRect.top) / (start - end), 0), 1);
    const slideOffset = (1 - progress) * 105;

    quoteCardRef.current.style.transform = `translate3d(${slideOffset}%, 0, 0)`;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateMobileSlide();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateMobileSlide);
    updateMobileSlide();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMobileSlide);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateMobileSlide]);

  const handleToggleMobileCard = (e) => {
    e.stopPropagation();
    if (window.innerWidth > 768 || !quoteCardRef.current) return;
    setIsMobileRevealed((prev) => {
      const nextState = !prev;
      quoteCardRef.current.style.transform = nextState ? 'translate3d(0%, 0, 0)' : 'translate3d(105%, 0, 0)';
      return nextState;
    });
  };

  return (
    <section className="real-impact-section" ref={sectionRef}>
      {/* Repeating wavy lines background pattern on white */}
      <div className="real-impact-bg-waves" aria-hidden="true" />

      <div className="real-impact-wrapper">
        {/* Section Header */}
        <div className="real-impact-header">
          <h2 className="real-impact-title">
            Real Impact, Real Stories
          </h2>
          <p className="real-impact-subtitle">
            Real relief for people with ambition who just need the work done.
            <br />
            Zero fluff, zero guesswork
          </p>
        </div>

        {/* Impact Story 1 Container */}
        <div className="impact-story-container">
          {/* Left: Photo Card (Grace) */}
          <div className="impact-photo-card">
            <img
              src="/Impact_image_1.webp"
              alt="Grace - Operations Lead & Creator, Lagos"
              className="impact-photo-img"
            />
            <div className="impact-photo-overlay" />
            <div className="impact-photo-info">
              <div className="impact-photo-text">
                <h3 className="impact-name">Grace</h3>
                <p className="impact-role">Operations Lead &amp; Creator • Lagos</p>
              </div>
              <button
                className="impact-arrow-btn"
                onClick={handleToggleMobileCard}
                aria-label="Toggle story card"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Orange Quote Card (Slides in from side on mobile) */}
          <div
            className="impact-quote-card"
            ref={quoteCardRef}
            style={{ willChange: 'transform' }}
          >
            <h3 className="impact-quote-title">
              I wanted a personal brand, not a second job in HR.
            </h3>
            <p className="impact-quote-body">
              Between my 9-to-5 and Lagos traffic, I had zero energy to review <strong>50 proposals</strong> or interview strangers online. I described what I needed once on Jaradeck. Now I have an auto-assembled team editing my videos, writing scripts, and running my personal brand. I focus on my career; Jaradeck handles everything growing around it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
