import React, { useState, useEffect, useRef, useCallback } from 'react';

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
function ScribbleStrike({ width, animate }) {
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
          strokeDashoffset: animate ? 0 : pathLen,
          transition: animate ? 'stroke-dashoffset 0.55s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      />
    </svg>
  );
}

/*
 * Scroll progress mapping (0.0 → 1.0):
 *
 * 0.00 → 0.12  Item 1 fades in (empty)
 * 0.12 → 0.22  Item 1 checks + scribble strikes
 * 0.22 → 0.30  Connector line 1→2 grows
 * 0.30 → 0.38  Item 2 fades in (empty)
 * 0.38 → 0.48  Item 2 checks + scribble strikes
 * 0.48 → 0.54  Connector line 2→3 grows
 * 0.54 → 0.62  Item 3 fades in (empty)
 * 0.62 → 0.72  Item 3 checks + scribble strikes
 * 0.72 → 0.80  All items slide to the right
 * 0.80 → 1.00  "Dump tasks to Jaradeck" CTA appears
 */

export default function TodoAnimation({ onCtaClick }) {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [titleWidths, setTitleWidths] = useState([0, 0, 0]);

  // Measure title widths for scribble overlay
  useEffect(() => {
    const updateWidths = () => {
      const refs = [ref0, ref1, ref2];
      const newWidths = refs.map(r => r.current ? r.current.getBoundingClientRect().width : 0);
      setTitleWidths(newWidths);
    };
    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, []);

  // Scroll progress listener — reads position of .canopy-section
  const handleScroll = useCallback(() => {
    const section = sectionRef.current?.closest('.canopy-section');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;
    if (scrollableDistance <= 0) return;

    // progress: 0 when top of section hits top of viewport,
    //           1 when bottom of section hits bottom of viewport
    const raw = -rect.top / scrollableDistance;
    const clamped = Math.min(Math.max(raw, 0), 1);
    setProgress(clamped);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Derive animation states from progress
  const item0Visible = progress >= 0.02;
  const item0Checked = progress >= 0.12;
  const line0Active  = progress >= 0.22;
  const item1Visible = progress >= 0.30;
  const item1Checked = progress >= 0.38;
  const line1Active  = progress >= 0.48;
  const item2Visible = progress >= 0.54;
  const item2Checked = progress >= 0.62;
  const slideOut     = progress >= 0.74;
  const showCta      = progress >= 0.82;

  const isItemVisible = [item0Visible, item1Visible, item2Visible];
  const isChecked     = [item0Checked, item1Checked, item2Checked];
  const isLineActive  = [line0Active, line1Active, false];

  const titleRefs = [ref0, ref1, ref2];

  return (
    <div className="todo-animation-root" ref={sectionRef}>
      <div className={`todo-vertical-container ${slideOut ? 'todo-container--slide-out' : ''}`}>
        {TODO_ITEMS.map((item, index) => (
          <div
            key={item.id}
            className={`todo-vertical-row ${isItemVisible[index] ? 'todo-row--visible' : ''} ${slideOut ? 'todo-row--slide-out' : ''}`}
            style={slideOut ? { transitionDelay: `${index * 0.08}s` } : undefined}
          >
            {/* Left column: Checkbox + Vertical Connector Line */}
            <div className="todo-left-col">
              <div className={`todo-checkbox ${isChecked[index] ? 'todo-checkbox--checked' : ''} ${isChecked[index] && !slideOut ? 'todo-checkbox--wiggle' : ''}`}>
                {isChecked[index] && (
                  <svg className="todo-cross" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="4" y1="4" x2="12" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="12" y1="4" x2="4" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                )}
              </div>

              {/* Connecting line to the next checkbox */}
              {index < TODO_ITEMS.length - 1 && (
                <div className={`todo-connector-line ${isLineActive[index] ? 'todo-connector-line--active' : ''}`} />
              )}
            </div>

            {/* Right column: Text Title & Subtitle */}
            <div className="todo-text">
              <div className="todo-title-wrap">
                <span className="todo-title" ref={titleRefs[index]}>
                  {item.title}
                </span>
                {isChecked[index] && titleWidths[index] > 0 && (
                  <span className="todo-scribble-overlay" style={{ width: titleWidths[index] }}>
                    <ScribbleStrike width={titleWidths[index]} animate={isChecked[index]} />
                  </span>
                )}
              </div>
              <span className="todo-subtitle">{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button — appears after items slide out */}
      <div className={`dump-tasks-cta-container ${showCta ? 'dump-tasks-cta-container--visible' : ''}`}>
        <button className="dump-tasks-btn" onClick={onCtaClick}>
          Dump tasks to Jaradeck
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.66667M10.5 3.5V9.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
