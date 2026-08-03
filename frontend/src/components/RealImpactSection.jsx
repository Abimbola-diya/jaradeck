import React, { useEffect, useRef, useState } from 'react';

export default function RealImpactSection() {
  const sectionRef = useRef(null);
  const orangeCardRef = useRef(null);
  const pinkCardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 768) return;
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const rect = sectionEl.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      let progress = 0;
      if (sectionTop > 0) {
        progress = 0;
      } else if (sectionTop < -(sectionHeight - windowHeight)) {
        progress = 1;
      } else {
        progress = -sectionTop / (sectionHeight - windowHeight);
      }

      // 0.00 -> 0.15: Photo card (Grace) visible
      // 0.15 -> 0.35: Orange card slides in fully
      // 0.35 -> 0.55: Orange card visible
      // 0.55 -> 0.75: Pink card slides in fully
      // 0.75 -> 1.00: Pink card visible
      
      let orangeProgress = 0;
      if (progress > 0.15) {
        orangeProgress = Math.min(Math.max((progress - 0.15) / 0.20, 0), 1);
      }
      
      let pinkProgress = 0;
      if (progress > 0.55) {
        pinkProgress = Math.min(Math.max((progress - 0.55) / 0.20, 0), 1);
      }

      if (orangeCardRef.current) {
        const slideOffset = (1 - orangeProgress) * 105;
        orangeCardRef.current.style.transform = `translate3d(${slideOffset}%, 0, 0)`;
      }

      if (pinkCardRef.current) {
        const slideOffset = (1 - pinkProgress) * 105;
        pinkCardRef.current.style.transform = `translate3d(${slideOffset}%, 0, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNextMobileCard = (e) => {
    e.stopPropagation();
    if (window.innerWidth > 768 || !sectionRef.current) return;
    const sectionEl = sectionRef.current;
    const rect = sectionEl.getBoundingClientRect();
    const sectionTopInPage = rect.top + window.scrollY;
    const scrollableH = rect.height - window.innerHeight;
    
    const currentProgress = -rect.top / scrollableH;
    let targetProgress = 0.45; // Go to Orange card
    if (currentProgress >= 0.35) {
      targetProgress = 0.85; // Go to Pink card
    }

    window.scrollTo({
      top: sectionTopInPage + targetProgress * scrollableH,
      behavior: 'smooth'
    });
  };

  const handlePrevMobileCard = (e) => {
    e.stopPropagation();
    if (window.innerWidth > 768 || !sectionRef.current) return;
    const sectionEl = sectionRef.current;
    const rect = sectionEl.getBoundingClientRect();
    const sectionTopInPage = rect.top + window.scrollY;
    const scrollableH = rect.height - window.innerHeight;
    
    const currentProgress = -rect.top / scrollableH;
    let targetProgress = 0.05; // Go to Photo card
    if (currentProgress >= 0.65) {
      targetProgress = 0.45; // Go to Orange card
    }

    window.scrollTo({
      top: sectionTopInPage + targetProgress * scrollableH,
      behavior: 'smooth'
    });
  };

  return (
    <section className="real-impact-section" ref={sectionRef}>
      <div className="real-impact-sticky-wrapper">
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
              alt="Grace - Supply Chain Professional, Amo Group of Companies, Lagos"
              className="impact-photo-img"
            />
            <div className="impact-photo-overlay" />
            <div className="impact-photo-info">
              <div className="impact-photo-text">
                <h3 className="impact-name">Grace</h3>
                <p className="impact-role">
                  Supply Chain Professional
                  <br />
                  Amo Group of Companies • Lagos
                </p>
              </div>
              <button
                className="impact-arrow-btn"
                onClick={handleNextMobileCard}
                aria-label="Next card"
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
            ref={orangeCardRef}
            style={{ willChange: 'transform' }}
          >
            <h3 className="impact-quote-title">
              I wanted a personal brand. I just didn't have another 20 hours a week.
            </h3>
            <p className="impact-quote-body">
              It's been my goal this year to <strong>build my personal brand</strong> and become more active in my career space. Between my 9–5 and Lagos traffic, I simply didn't have the time or energy to <strong>write posts</strong>, <strong>edit videos</strong>, design graphics or <strong>stay consistent</strong>.
            </p>

            {/* Back button to Photo Card */}
            <button
              className="impact-arrow-btn impact-quote-arrow-left"
              onClick={handlePrevMobileCard}
              aria-label="Previous card"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            {/* Next button to Pink Card */}
            <button
              className="impact-arrow-btn impact-quote-arrow-right"
              onClick={handleNextMobileCard}
              aria-label="Next card"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* Third: Pink Quote Card (Slides in from side on mobile) */}
          <div
            className="impact-pink-card"
            ref={pinkCardRef}
            style={{ willChange: 'transform' }}
          >
            <h3 className="impact-quote-title">
              I finally found a better way.
            </h3>
            <p className="impact-quote-body">
              A friend introduced me to Jaradeck. I described what I wanted once, and they <strong>built a team</strong> around me. Now I have an auto-assembled team <strong>writing my scripts</strong>, <strong>editing my videos</strong> and <strong>running my personal brand</strong>, while I focus on my career. Jaradeck handles everything growing around it.
            </p>

            {/* Back button to Orange Card */}
            <button
              className="impact-arrow-btn impact-quote-arrow-left"
              onClick={handlePrevMobileCard}
              aria-label="Previous card"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
