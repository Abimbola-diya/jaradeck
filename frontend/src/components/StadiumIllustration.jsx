import React from 'react';

function Cloud({ className, style }) {
  return (
    <svg 
      className={`hero-cloud ${className || ''}`} 
      style={style} 
      viewBox="0 0 240 75" 
      fill="#F4F3ED" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M25 65C10 65 2 54 12 43C8 28 26 18 43 26C58 9 95 6 122 22C140 6 178 10 193 28C210 22 232 34 227 50C238 58 234 65 215 65Z" />
    </svg>
  );
}

export default function StadiumIllustration() {
  return (
    <div className="stadium-wrapper">
      {/* Background Clouds floating in sky above stadium */}
      <div className="clouds-container" aria-hidden="true">
        <Cloud className="cloud-1" />
        <Cloud className="cloud-2" />
        <Cloud className="cloud-3" />
      </div>

      {/* Main Stadium Illustration */}
      <img src="/hero_graphics.svg" alt="Jaradeck Hero Illustration" className="stadium-svg" />
    </div>
  );
}
