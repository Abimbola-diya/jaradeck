import React from 'react';

export default function BackgroundGrid() {
  return (
    <div className="bg-grid-container" aria-hidden="true">
      {/* Blue gradient base */}
      <div className="bg-grid-base" />
      {/* Neatly stacked repeating wavy pattern */}
      <div className="bg-grid-waves" />
      {/* Radial glow overlay */}
      <div className="bg-grid-glow" />
    </div>
  );
}
