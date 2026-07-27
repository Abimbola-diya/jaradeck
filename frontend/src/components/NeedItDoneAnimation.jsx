import React, { useState, useEffect, useRef } from 'react';

const BULLETS = [
  {
    id: 1,
    text: "Tell JaraDeck what you need, when you need it, and what you want to spend.",
  },
  {
    id: 2,
    text: "We find the right people for your budget and your project.",
  },
  {
    id: 3,
    text: "Your money stays protected until you're happy with the outcome.",
  },
  {
    id: 4,
    text: "The work gets done while you focus on other things that matters",
  },
];

function TypedText({ text, active }) {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplayedLength(0);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplayedLength(current);
      if (current >= text.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [active, text]);

  return (
    <span className="typed-text-content">
      {text.slice(0, displayedLength)}
      {active && displayedLength < text.length && (
        <span className="typing-cursor">|</span>
      )}
    </span>
  );
}

export default function NeedItDoneAnimation() {
  const [step, setStep] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate ratio as container scrolls into view
      const start = windowHeight * 0.88;
      const end = windowHeight * 0.35;

      const ratio = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

      if (ratio >= 0.88) setStep(7);
      else if (ratio >= 0.74) setStep(6);
      else if (ratio >= 0.60) setStep(5);
      else if (ratio >= 0.46) setStep(4);
      else if (ratio >= 0.32) setStep(3);
      else if (ratio >= 0.18) setStep(2);
      else if (ratio >= 0.08) setStep(1);
      else setStep(0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="need-it-done-container" ref={containerRef}>
      <h2 className="need-it-done-heading">Need it done?</h2>

      <div className="need-it-done-checklist">
        {BULLETS.map((bullet, index) => {
          // Calculate step states for 4 bullets:
          // Item 0: active at step >= 1, line active at step >= 2
          // Item 1: active at step >= 3, line active at step >= 4
          // Item 2: active at step >= 5, line active at step >= 6
          // Item 3: active at step >= 7
          const isItemActive = step >= index * 2 + 1;
          const isLineActive = step >= index * 2 + 2;

          return (
            <div
              key={bullet.id}
              className={`need-row ${isItemActive ? 'need-row--active' : ''}`}
            >
              {/* Left column: Circular Checkbox + Vertical Connector Line */}
              <div className="need-left-col">
                <div className={`need-circle ${isItemActive ? 'need-circle--active' : ''}`}>
                  <svg className={`need-check ${isItemActive ? 'need-check--visible' : ''}`} viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 5L4.5 8L10.5 1.5" stroke="#0048B3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {index < BULLETS.length - 1 && (
                  <div className={`need-line ${isLineActive ? 'need-line--active' : ''}`} />
                )}
              </div>

              {/* Right column: Bullet text with Typing Animation */}
              <div className="need-text-col">
                <p className="need-text-para">
                  <TypedText text={bullet.text} active={isItemActive} />
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
