import React, { useEffect, useRef, useCallback } from 'react';

export default function ComparisonCards() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  const updateCard = useCallback(() => {
    if (!sectionRef.current || !cardRef.current) return;

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // The section locks/pins in view when sectionRect.top reaches 0.
    // While pinned, we translate scrolling into Card 2's slide-in stacking animation.
    // We cap the required scroll distance to 800px so it works correctly on exceptionally tall mobile-desktop screens.
    const start = 0;
    const scrollDistance = Math.min(windowHeight * 0.85, 800);
    const end = -scrollDistance;

    const progress = Math.min(Math.max((start - sectionRect.top) / (start - end), 0), 1);

    // Write directly to the DOM — zero React re-renders
    const isMobile = window.innerWidth <= 900;
    const maxSlide = isMobile ? 360 : 500;
    const slideOffset = (1 - progress) * maxSlide;
    const rotateDeg = 18 - progress * 14; // goes from 18deg down to 4deg
    const opacity = Math.min(progress * 1.8, 1);

    cardRef.current.style.transform = `translate3d(calc(-50% + ${slideOffset}px), -50%, 0) rotate(${rotateDeg}deg)`;
    cardRef.current.style.opacity = opacity;
  }, []);

  const updateSectionHeight = useCallback(() => {
    if (!sectionRef.current) return;
    const wrapper = sectionRef.current.querySelector('.comparison-content-wrapper');
    if (!wrapper) return;
    
    // The exact height of the section should be: wrapper height + required scroll distance.
    // This perfectly aligns the next section (the canopy) to appear exactly as the animation completes,
    // eliminating any dead white space beneath it!
    const wrapperHeight = wrapper.getBoundingClientRect().height;
    const windowHeight = window.innerHeight;
    const scrollDistance = Math.min(windowHeight * 0.85, 800);
    
    sectionRef.current.style.height = `${wrapperHeight + scrollDistance}px`;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateCard();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSectionHeight);
    
    updateSectionHeight(); // Set perfect height on mount
    updateCard(); // Initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSectionHeight);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCard, updateSectionHeight]);

  return (
    <section className="comparison-section" ref={sectionRef}>
      <div className="comparison-content-wrapper">
        {/* Section Header */}
        <div className="comparison-header">
          <h2 className="comparison-title">
            The work is hard enough already.
          </h2>
          <p className="comparison-subtitle">
            Don't let finding the right people become part of it.
          </p>
        </div>

        {/* Overlapping Card Stack Container */}
        <div className="comparison-cards-stage" ref={stageRef}>
          {/* Card 1: Traditional Freelance Platforms (White Card) */}
          <div className="comparison-card card-white">
            <h3 className="card-heading">
              The Old Way
            </h3>
            <ul className="card-bullet-list">
              <li>
                <span className="bullet-dot">•</span>
                <span>Scrolling through <strong>70+</strong> profiles and <strong>40+</strong> proposals, still no idea who's actually good.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span>Turning into an <strong>HR manager</strong>, interviewing strangers and hoping they deliver.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span>Starting from <strong>zero</strong> on every project, re-explaining your taste, style, and preferences each time.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: The Jaradeck Way (Blue Card) — Animated via direct DOM ref */}
          <div
            className="comparison-card card-blue"
            ref={cardRef}
            style={{ willChange: 'transform, opacity' }}
          >
            <h3 className="card-heading">
              The Jaradeck Way
            </h3>
            <ul className="card-bullet-list">
              <li>
                <span className="bullet-dot">•</span>
                <span>Tell us what you need done and what you want to spend. We cut through the noise and find <strong>3 best matches</strong>, tailored to your budget and needs, <strong>in seconds</strong>.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span><strong>No interviews</strong>, no guesswork. Just <strong>verified people</strong>, picked by budget, availability, and past output.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span>Jaradeck <strong>remembers your preferences</strong>, style, and taste. Every project starts <strong>where the last one ended</strong>.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
