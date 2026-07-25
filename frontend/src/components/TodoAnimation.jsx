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

// Wobbly scribble SVG strikethrough
function ScribbleStrike({ width }) {
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
          strokeDashoffset: pathLen,
          animation: `scribbleDraw 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        }}
      />
    </svg>
  );
}

export default function TodoAnimation() {
  const [step, setStep] = useState(0);
  const containerRef = useRef(null);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [titleWidths, setTitleWidths] = useState([0, 0, 0]);
  const userScrolledRef = useRef(false);

  // Measure title widths
  useEffect(() => {
    const updateWidths = () => {
      const refs = [ref0, ref1, ref2];
      const newWidths = refs.map(r => r.current ? r.current.getBoundingClientRect().width : 0);
      setTitleWidths(newWidths);
    };
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, [step]);

  // Scroll handler: advances connecting timeline steps (0-7) as user scrolls down into section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      userScrolledRef.current = true;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Fallback: if user reaches bottom of document, show all 3 items fully connected
      const isBottom = (windowHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70);
      if (isBottom) {
        setStep(7);
        return;
      }

      // Distance scrolled into view from when top reaches 90% of screen height
      const startPoint = windowHeight * 0.90;
      const scrolledPx = startPoint - rect.top;
      const totalDistance = 180;
      const ratio = Math.min(Math.max(scrolledPx / totalDistance, 0), 1);

      if (ratio >= 0.88) setStep(7);
      else if (ratio >= 0.75) setStep(6);
      else if (ratio >= 0.62) setStep(5);
      else if (ratio >= 0.49) setStep(4);
      else if (ratio >= 0.36) setStep(3);
      else if (ratio >= 0.23) setStep(2);
      else if (ratio >= 0.10) setStep(1);
      else setStep(0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer loop fallback if user has not scrolled yet
  useEffect(() => {
    let timers = [];
    const scheduleStep = (targetStep, delay) => {
      timers.push(setTimeout(() => {
        if (!userScrolledRef.current) {
          setStep(targetStep);
        }
      }, delay));
    };

    if (!userScrolledRef.current) {
      scheduleStep(1, 1000);
      scheduleStep(2, 2200);
      scheduleStep(3, 2800);
      scheduleStep(4, 3800);
      scheduleStep(5, 5000);
      scheduleStep(6, 5600);
      scheduleStep(7, 6600);
    }

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  const titleRefs = [ref0, ref1, ref2];

  return (
    <div className="todo-vertical-container" ref={containerRef}>
      {TODO_ITEMS.map((item, index) => {
        // Item visibility
        const isItemVisible = (index === 0 && step >= 0) || (index === 1 && step >= 3) || (index === 2 && step >= 6);
        // Checked state
        const isChecked = (index === 0 && step >= 1) || (index === 1 && step >= 4) || (index === 2 && step >= 7);
        // Wiggle state
        const isWiggle = (index === 0 && step === 1) || (index === 1 && step === 4) || (index === 2 && step === 7);
        // Line connector active
        const isLineActive = (index === 0 && step >= 2) || (index === 1 && step >= 5);

        return (
          <div
            key={item.id}
            className={`todo-vertical-row ${isItemVisible ? 'todo-row--visible' : ''}`}
          >
            {/* Left column: Checkbox + Vertical Connector Line */}
            <div className="todo-left-col">
              <div className={`todo-checkbox ${isChecked ? 'todo-checkbox--checked' : ''} ${isWiggle ? 'todo-checkbox--wiggle' : ''}`}>
                {isChecked && (
                  <svg className="todo-cross" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="4" y1="4" x2="12" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="12" y2="4" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                )}
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
                {isChecked && titleWidths[index] > 0 && (
                  <span className="todo-scribble-overlay" style={{ width: titleWidths[index] }}>
                    <ScribbleStrike width={titleWidths[index]} />
                  </span>
                )}
              </div>
              <span className="todo-subtitle">{item.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
