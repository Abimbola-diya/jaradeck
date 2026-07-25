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
  // Step in timeline animation sequence (0 through 8)
  const [step, setStep] = useState(0);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [titleWidths, setTitleWidths] = useState([0, 0, 0]);

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

  // Timeline loop sequence
  useEffect(() => {
    let timers = [];
    const scheduleStep = (targetStep, delay) => {
      timers.push(setTimeout(() => setStep(targetStep), delay));
    };

    const runTimeline = () => {
      setStep(0);            // Step 0: Item 0 appears empty
      scheduleStep(1, 1000); // Step 1: Item 0 checks + strikes
      scheduleStep(2, 2200); // Step 2: Line 0->1 grows down
      scheduleStep(3, 2800); // Step 3: Item 1 appears empty
      scheduleStep(4, 3800); // Step 4: Item 1 checks + strikes
      scheduleStep(5, 5000); // Step 5: Line 1->2 grows down
      scheduleStep(6, 5600); // Step 6: Item 2 appears empty
      scheduleStep(7, 6600); // Step 7: Item 2 checks + strikes
      scheduleStep(8, 7800); // Step 8: Hold full vertical checklist view
    };

    runTimeline();
    const interval = setInterval(runTimeline, 12000);

    return () => {
      timers.forEach(t => clearTimeout(t));
      clearInterval(interval);
    };
  }, []);

  const titleRefs = [ref0, ref1, ref2];

  return (
    <div className="todo-vertical-container">
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
                    <line x1="4" y1="4" x2="12" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                    <line x1="12" y1="4" x2="4" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
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
