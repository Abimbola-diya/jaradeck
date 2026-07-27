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
    // While pinned, we translate 0.85 viewport heights of vertical scrolling into Card 2's slide-in stacking animation.
    const start = 0;
    const end = -windowHeight * 0.85;

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

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateCard();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateCard(); // Initial position
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCard]);

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
                <span>Sifting through 50+ proposals and endless identical 4.9-star reviews.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span>Acting like an HR manager: interviewing strangers and hoping they deliver.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span>Starting from zero and re-explaining your brand guidelines on every new project.</span>
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
                <span>Describe your task once in plain English—no job descriptions or recruitment required.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span>Get your Top 3 verified matches, filtered strictly by budget, availability, and past output.</span>
              </li>
              <li>
                <span className="bullet-dot">•</span>
                <span>Memory moat automatically inherits your brand colors, fonts, and preferences.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
