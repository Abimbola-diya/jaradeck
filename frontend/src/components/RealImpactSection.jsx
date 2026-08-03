import React, { useEffect, useRef, useState } from 'react';

export default function RealImpactSection() {
  const sectionRef = useRef(null);
  const quoteCardRef = useRef(null);
  const progressRef = useRef(0);
  const touchStartYRef = useRef(null);
  const [isMobileRevealed, setIsMobileRevealed] = useState(false);

  const updateCardTransform = (progress) => {
    if (!quoteCardRef.current) return;
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    progressRef.current = clampedProgress;
    const slideOffset = (1 - clampedProgress) * 105;
    quoteCardRef.current.style.transform = `translate3d(${slideOffset}%, 0, 0)`;
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleWheel = (e) => {
      if (window.innerWidth > 768) return;
      const rect = sectionEl.getBoundingClientRect();
      const inView = rect.top <= 80 && rect.bottom >= window.innerHeight - 80;
      if (!inView) return;

      const delta = e.deltaY;
      const current = progressRef.current;

      if ((delta > 0 && current < 1) || (delta < 0 && current > 0)) {
        if (e.cancelable) e.preventDefault();
        const nextProgress = current + delta / 350;
        updateCardTransform(nextProgress);
      }
    };

    const handleTouchStart = (e) => {
      if (window.innerWidth > 768) return;
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (window.innerWidth > 768 || touchStartYRef.current === null) return;
      const rect = sectionEl.getBoundingClientRect();
      const inView = rect.top <= 120 && rect.bottom >= window.innerHeight - 120;
      if (!inView) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY; // Positive = scrolling down
      const current = progressRef.current;

      if ((deltaY > 0 && current < 1) || (deltaY < 0 && current > 0)) {
        if (e.cancelable) e.preventDefault();
        const nextProgress = current + deltaY / 250;
        updateCardTransform(nextProgress);
        touchStartYRef.current = currentY;
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    sectionEl.addEventListener('wheel', handleWheel, { passive: false });
    sectionEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    sectionEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    sectionEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      sectionEl.removeEventListener('wheel', handleWheel);
      sectionEl.removeEventListener('touchstart', handleTouchStart);
      sectionEl.removeEventListener('touchmove', handleTouchMove);
      sectionEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleToggleMobileCard = (e) => {
    e.stopPropagation();
    if (window.innerWidth > 768) return;
    const nextState = !isMobileRevealed;
    setIsMobileRevealed(nextState);
    updateCardTransform(nextState ? 1 : 0);
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
    </section>
  );
}
