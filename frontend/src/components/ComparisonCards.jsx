import React, { useState, useEffect, useRef } from 'react';

export default function ComparisonCards() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start animation when section enters bottom 80% of screen
            const start = windowHeight * 0.80;
            // Complete animation when section reaches upper 35% of screen
            const end = windowHeight * 0.35;

            const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
            // Round to 2 decimals to prevent micro re-renders
            const roundedProgress = Math.round(progress * 100) / 100;

            setScrollProgress(prev => (prev !== roundedProgress ? roundedProgress : prev));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slide Card 2 (Blue card) in from right (280px -> 0px) landing ON TOP of Card 1 at 10deg rotation
  const slideX = (1 - scrollProgress) * 280; // px
  const rotateDeg = 24 - scrollProgress * 14; // 24deg down to 10deg
  const opacity = Math.min(scrollProgress * 2, 1);

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
        <div className="comparison-cards-stage">
          {/* Card 1: Traditional Freelance Platforms (White Card) */}
          <div className="comparison-card card-white">
            <h3 className="card-heading">
              Traditional Freelance<br />Platforms
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

          {/* Card 2: The Jaradeck Way (Blue Card #0048B3) — Animated Slide-In On Top */}
          <div
            className="comparison-card card-blue"
            style={{
              transform: `translate3d(${slideX}px, 0, 0) rotate(${rotateDeg}deg)`,
              opacity: opacity,
              willChange: 'transform, opacity',
            }}
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
