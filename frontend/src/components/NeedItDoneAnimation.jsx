import React, { useState, useEffect, useRef, useCallback } from 'react';

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

// Typing animation that only types forward, never resets once completed
function TypedText({ text, active }) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const completedRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Once fully typed, never reset
    if (completedRef.current) return;

    if (!active) return;

    // Start typing from wherever we left off
    let current = displayedLength;
    intervalRef.current = setInterval(() => {
      current++;
      setDisplayedLength(current);
      if (current >= text.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        completedRef.current = true;
      }
    }, 22);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, text.length]); // intentionally omit displayedLength to avoid re-triggering

  if (!active && displayedLength === 0) return null;

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
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const updateStep = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const start = windowHeight * 0.88;
    const end = windowHeight * 0.20;

    const ratio = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

    let newStep;
    if (ratio >= 0.88) newStep = 7;
    else if (ratio >= 0.74) newStep = 6;
    else if (ratio >= 0.60) newStep = 5;
    else if (ratio >= 0.46) newStep = 4;
    else if (ratio >= 0.32) newStep = 3;
    else if (ratio >= 0.18) newStep = 2;
    else if (ratio >= 0.08) newStep = 1;
    else newStep = 0;

    // Only trigger a React re-render when step actually changes
    if (newStep !== stepRef.current) {
      stepRef.current = newStep;
      setStep(newStep);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return; // Already scheduled, skip
      rafRef.current = requestAnimationFrame(() => {
        updateStep();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateStep(); // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateStep]);

  return (
    <div className="need-it-done-container" ref={containerRef}>
      <h2 className="need-it-done-heading">Need it done?</h2>

      <div className="need-it-done-checklist">
        {BULLETS.map((bullet, index) => {
          const isItemActive = step >= index * 2 + 1;
          const isLineActive = step >= index * 2 + 2;

          return (
            <div
              key={bullet.id}
              className={`need-row ${isItemActive ? 'need-row--active' : ''}`}
            >
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
