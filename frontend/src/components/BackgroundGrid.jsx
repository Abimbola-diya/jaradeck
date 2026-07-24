import React from 'react';

export default function BackgroundGrid() {
  const lineCount = 260;
  const lines = Array.from({ length: lineCount }, (_, i) => i * 3.8 - 10);

  return (
    <div className="bg-grid-container" aria-hidden="true">
      <svg 
        className="bg-grid-svg" 
        width="100%" 
        height="100%" 
        viewBox="0 0 1440 1024" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgFade" x1="0" y1="0" x2="0" y2="1024" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0048CC" stopOpacity="1" />
            <stop offset="50%" stopColor="#003DB8" stopOpacity="1" />
            <stop offset="100%" stopColor="#002D8B" stopOpacity="1" />
          </linearGradient>
          
          <pattern id="fadedGridPattern" width="1440" height="1024" patternUnits="userSpaceOnUse">
            {lines.map((y, idx) => (
              <line 
                key={idx}
                x1="-50" 
                y1={y} 
                x2="1490" 
                y2={y} 
                stroke="#3D6FE0" 
                strokeWidth="1" 
                strokeOpacity="0.5" 
              />
            ))}
          </pattern>

          <radialGradient id="heroGlow" cx="50%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#1E6BFF" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#0048CC" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="1024" fill="url(#bgFade)" />
        <rect width="1440" height="1024" fill="url(#heroGlow)" />
        <rect width="1440" height="1024" fill="url(#fadedGridPattern)" />

        <path d="M -100 160 Q 720 310 1540 160" stroke="#3D6FE0" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
        <path d="M -100 360 Q 720 510 1540 360" stroke="#3D6FE0" strokeWidth="1.5" strokeOpacity="0.25" fill="none" />
        <path d="M -100 560 Q 720 710 1540 560" stroke="#3D6FE0" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
      </svg>
    </div>
  );
}
