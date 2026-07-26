import React, { useState, useEffect, useRef } from 'react';

const TODO_ITEMS = [
  {
    id: 1,
    title: "I'm excited to share that...",
    subtitle: "3 LinkedIn posts to make this week, haven't done any",
  },
  {
    id: 2,
    title: "Just need to clear support messages...",
    subtitle: "50 customer complaints to reply to before 9pm",
  },
  {
    id: 3,
    title: "Two YouTube videos to edit...",
    subtitle: "but Premiere Pro keeps crashing",
  },
];

// Wobbly scribble SVG strikethrough — always rendered, stroke offset animated via CSS
function ScribbleStrike({ width, active }) {
  const h = 16;
  const mid = h / 2;
  const pathD = `M 0 ${mid + 1}
    C ${width * 0.08} ${mid - 3}, ${width * 0.16} ${mid + 4}, ${width * 0.24} ${mid - 2}
    C ${width * 0.32} ${mid - 6}, ${width * 0.40} ${mid + 5}, ${width * 0.48} ${mid + 1}
    C ${width * 0.56} ${mid - 4}, ${width * 0.64} ${mid + 6}, ${width * 0.72} ${mid - 1}
    C ${width * 0.80} ${mid - 5}, ${width * 0.88} ${mid + 4}, ${width * 0.96} ${mid + 1}
    C ${width * 0.98} ${mid - 2}, ${width * 0.99} ${mid + 2}, ${width} ${mid}`;

  const pathLen = width * 1.15;

  return (
    <svg
      className="scribble-strike-svg"
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke="#0048B3"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: pathLen,
          strokeDashoffset: active ? 0 : pathLen,
          transition: 'stroke-dashoffset 0.45s ease',
        }}
      />
    </svg>
  );
}

export default function TodoAnimation({ onCtaClick }) {
  const [step, setStep] = useState(0);
  const containerRef = useRef(null);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [titleWidths, setTitleWidths] = useState([180, 220, 190]);

  // Measure title widths on mount and window resize ONLY
  useEffect(() => {
    const updateWidths = () => {
      const refs = [ref0, ref1, ref2];
      const newWidths = refs.map(r => r.current ? r.current.getBoundingClientRect().width : 0);
      if (newWidths.some(w => w > 0)) {
        setTitleWidths(newWidths);
      }
    };
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, []);

  // Pure scroll handler: advances steps cleanly without mounting/unmounting DOM nodes
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when container top reaches 90% of screen height
      const start = windowHeight * 0.90;
      // All 3 items fully revealed when container reaches 65% of screen height
      const end = windowHeight * 0.65;

      const ratio = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

      if (ratio >= 0.85) setStep(7);
      else if (ratio >= 0.72) setStep(6);
      else if (ratio >= 0.58) setStep(5);
      else if (ratio >= 0.44) setStep(4);
      else if (ratio >= 0.30) setStep(3);
      else if (ratio >= 0.18) setStep(2);
      else if (ratio >= 0.08) setStep(1);
      else setStep(0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const titleRefs = [ref0, ref1, ref2];

  return (
    <div className="todo-vertical-container" ref={containerRef}>
      {TODO_ITEMS.map((item, index) => {
        const isItemVisible = (index === 0 && step >= 0) || (index === 1 && step >= 3) || (index === 2 && step >= 6);
        const isChecked = (index === 0 && step >= 1) || (index === 1 && step >= 4) || (index === 2 && step >= 7);
        const isWiggle = (index === 0 && step === 1) || (index === 1 && step === 4) || (index === 2 && step === 7);
        const isLineActive = (index === 0 && step >= 2) || (index === 1 && step >= 5);
        const w = titleWidths[index] || 180;

        return (
          <div
            key={item.id}
            className={`todo-vertical-row ${isItemVisible ? 'todo-row--visible' : ''}`}
          >
            {/* Left column: Checkbox + Vertical Connector Line */}
            <div className="todo-left-col">
              <div className={`todo-checkbox ${isChecked ? 'todo-checkbox--checked' : ''} ${isWiggle ? 'todo-checkbox--wiggle' : ''}`}>
                <svg className={`todo-cross ${isChecked ? 'todo-cross--visible' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="3.2" y1="3.2" x2="12.8" y2="12.8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                  <line x1="3.2" y1="12.8" x2="12.8" y2="3.2" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </div>

              {/* Connecting line to the next checkbox */}
              {index < TODO_ITEMS.length - 1 && (
                <div className={`todo-connector-line ${isLineActive ? 'todo-connector-line--active' : ''}`} />
              )}
            </div>

            {/* Right column: Text Title & Subtitle */}
            <div className="todo-text">
              <div className="todo-title-wrap">
                <span className="todo-title" ref={titleRefs[index]}>
                  {item.title}
                </span>
                <span className={`todo-scribble-overlay ${isChecked ? 'todo-scribble-overlay--active' : ''}`} style={{ width: w }}>
                  <ScribbleStrike width={w} active={isChecked} />
                </span>
              </div>
              <span className="todo-subtitle">{item.subtitle}</span>
            </div>
          </div>
        );
      })}

      {/* Dump tasks to Jaradeck CTA Button */}
      <div className={`todo-cta-wrapper ${step >= 7 ? 'todo-cta-wrapper--visible' : ''}`}>
        <button className="dump-tasks-btn" onClick={onCtaClick}>
          <span>Dump tasks to Jaradeck</span>
          <svg className="sparkle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 7.52285 16.4771 12 22 12C16.4771 12 12 16.4771 12 22C12 16.4771 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
