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

// Phase durations (ms)
const PHASE_EMPTY  = 1600;  // empty checkbox shown
const PHASE_FILL   = 600;   // checkbox fills + cross pops + scribble draws
const PHASE_WIGGLE = 1200;  // checkbox wiggles
const PHASE_EXIT   = 700;   // item fades out/up
const CYCLE = PHASE_EMPTY + PHASE_FILL + PHASE_WIGGLE + PHASE_EXIT;

// Wobbly scribble SVG strikethrough — drawn over exact text width
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
  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState('empty');
  const titleRef = useRef(null);
  const [titleWidth, setTitleWidth] = useState(0);

  // Measure title element width
  useEffect(() => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      setTitleWidth(rect.width);
    }
  }, [itemIndex]);

  useEffect(() => {
    let t1, t2, t3, t4;

    const runCycle = () => {
      setPhase('empty');
      t1 = setTimeout(() => setPhase('filled'), PHASE_EMPTY);
      t2 = setTimeout(() => setPhase('wiggle'), PHASE_EMPTY + PHASE_FILL);
      t3 = setTimeout(() => setPhase('exit'),   PHASE_EMPTY + PHASE_FILL + PHASE_WIGGLE);
      t4 = setTimeout(() => {
        setItemIndex(prev => (prev + 1) % TODO_ITEMS.length);
      }, CYCLE);
    };

    runCycle();
    const interval = setInterval(runCycle, CYCLE + 100);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearInterval(interval);
    };
  }, []);

  const item = TODO_ITEMS[itemIndex];
  const isChecked = phase !== 'empty';

  return (
    <div className={`todo-animation-wrapper todo-phase-${phase}`}>

      {/* Small circular checkbox */}
      <div className={`todo-checkbox ${isChecked ? 'todo-checkbox--checked' : ''}`}>
        {isChecked && (
          <svg className="todo-cross" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="4" x2="12" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="12" y1="4" x2="4" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Text content starting to the right of the checkbox */}
      <div className="todo-text">

        {/* Bigger title with wobbly scribble overlay */}
        <div className="todo-title-wrap">
          <span className="todo-title" ref={titleRef}>
            {item.title}
          </span>
          {isChecked && titleWidth > 0 && (
            <span className="todo-scribble-overlay" style={{ width: titleWidth }}>
              <ScribbleStrike width={titleWidth} />
            </span>
          )}
        </div>

        {/* Subtitle in italics below title */}
        <span className="todo-subtitle">{item.subtitle}</span>

      </div>
    </div>
  );
}
