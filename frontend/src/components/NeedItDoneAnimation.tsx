import React, { useEffect, useRef, useCallback } from 'react';

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
    text: "The work gets done while you focus on other things that matters.",
  },
];

export default function NeedItDoneAnimation() {
  const containerRef = useRef(null);
  const rowRefs = useRef([]);
  const circleRefs = useRef([]);
  const checkRefs = useRef([]);
  const lineRefs = useRef([]);
  const rafRef = useRef(null);

  const updateAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const windowHeight = window.innerHeight;

    BULLETS.forEach((_, index) => {
      const rowEl = rowRefs.current[index];
      if (!rowEl) return;

      const rect = rowEl.getBoundingClientRect();

      // Row reveals smoothly as its top edge glides from 88% down to 58% of viewport height
      const start = windowHeight * 0.88;
      const end = windowHeight * 0.58;

      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

      // Direct DOM style updates for 0 lag and maximum scroll fluidity
      rowEl.style.opacity = 0.18 + progress * 0.82;
      rowEl.style.transform = `translate3d(0, ${(1 - progress) * 20}px, 0)`;

      const circleEl = circleRefs.current[index];
      const checkEl = checkRefs.current[index];
      if (circleEl && checkEl) {
        if (progress >= 0.5) {
          circleEl.style.backgroundColor = '#FFFFFF';
          circleEl.style.borderColor = '#FFFFFF';
          circleEl.style.transform = 'scale(1.08)';
          checkEl.style.opacity = '1';
          checkEl.style.transform = 'scale(1)';
        } else {
          circleEl.style.backgroundColor = 'transparent';
          circleEl.style.borderColor = 'rgba(255, 255, 255, 0.45)';
          circleEl.style.transform = 'scale(0.8)';
          checkEl.style.opacity = '0';
          checkEl.style.transform = 'scale(0.6)';
        }
      }

      // Connecting line draws downward smoothly once this row reaches 60% progress
      const lineEl = lineRefs.current[index];
      if (lineEl) {
        const lineProgress = Math.min(Math.max((progress - 0.6) / 0.4, 0), 1);
        lineEl.style.transform = `scaleY(${lineProgress})`;
        lineEl.style.backgroundColor = lineProgress > 0.8 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)';
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateAnimation();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateAnimation(); // Initial position check
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateAnimation]);

  return (
    <div className="need-it-done-container" ref={containerRef}>
      <h2 className="need-it-done-heading">Need it done?</h2>

      <div className="need-it-done-checklist">
        {BULLETS.map((bullet, index) => (
          <div
            key={bullet.id}
            className="need-row"
            ref={(el) => (rowRefs.current[index] = el)}
          >
            <div className="need-left-col">
              <div
                className="need-circle"
                ref={(el) => (circleRefs.current[index] = el)}
              >
                <svg
                  className="need-check"
                  ref={(el) => (checkRefs.current[index] = el)}
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 5L4.5 8L10.5 1.5"
                    stroke="#0048B3"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {index < BULLETS.length - 1 && (
                <div
                  className="need-line"
                  ref={(el) => (lineRefs.current[index] = el)}
                />
              )}
            </div>

            <div className="need-text-col">
              <p className="need-text-para">
                {bullet.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
