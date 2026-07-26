import React from 'react';

export default function BackgroundGrid() {
  return (
    <div className="bg-grid-container" aria-hidden="true">
      {/* Blue gradient base */}
      <div className="bg-grid-base" />
      {/* Wavy lines SVG covering full area */}
      <img
        src="/wavy-lines.svg"
        alt=""
        className="bg-grid-waves"
        loading="eager"
        decoding="async"
      />
      {/* Radial glow overlay */}
      <div className="bg-grid-glow" />
    </div>
  );
}
