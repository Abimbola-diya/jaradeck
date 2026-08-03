import React, { useEffect, useRef, useCallback, useState } from 'react';

export default function RealImpactSection() {
  const trackRef = useRef(null);
  const quoteCardRef = useRef(null);
  const rafRef = useRef(null);
  const [isMobileRevealed, setIsMobileRevealed] = useState(false);

  const updateMobileSlide = useCallback(() => {
    if (!trackRef.current || !quoteCardRef.current) return;
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      quoteCardRef.current.style.transform = 'none';
      return;
    }

    const trackRect = trackRef.current.getBoundingClientRect();
    
    // When pinned, container sits ~100px from top of viewport.
    // As user scrolls down through track, trackRect.top decreases.
    const pinnedTop = 100;
    const scrolledDistance = pinnedTop - trackRect.top;

    // 300px scroll pause while card is locked stationary in viewport
    const pauseDistance = 300;
    // 450px scroll distance to complete the horizontal side-swipe replacement
    const swipeDistance = 450;

    if (scrolledDistance <= pauseDistance) {
      // Pause phase: Photo card is 100% fully visible
      quoteCardRef.current.style.transform = 'translate3d(105%, 0, 0)';
      return;
    }

    if (scrolledDistance >= pauseDistance + swipeDistance) {
      // Swipe complete phase: Orange card fully covers photo
      quoteCardRef.current.style.transform = 'translate3d(0%, 0, 0)';
      return;
    }

    // Swiping phase: progress 0 to 1
    const progress = (scrolledDistance - pauseDistance) / swipeDistance;
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
    <section className="real-impact-section">
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

        {/* Dedicated Track for Mobile Sticky Scroll Animation */}
        <div className="impact-story-track" ref={trackRef}>
          {/* Impact Story 1 Container */}
          <div className="impact-story-container">
            {/* Left: Photo Card (Grace) */}
            <div className="impact-photo-card">
              <img
                src="/impact_image_1.png"
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
      </div>
    </section>
  );
}
