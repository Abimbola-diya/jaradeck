import { useNavigate } from 'react-router-dom';
import BackgroundGrid from '../components/BackgroundGrid';
import BrandLogo from '../components/BrandLogo';
import { useState, useEffect } from 'react';

export default function ApplyPage() {
  const navigate = useNavigate();

  // Split text into lines for rendering
  const fullText = "Well, well... 👋\nRumour has it you're good at what you do. We'd like to see for ourselves.";
  const lines = fullText.split('\n');

  return (
    <div className="hero-page" style={{ minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden' }}>
      <BackgroundGrid />

      {/* Top Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        zIndex: 10,
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: "var(--font-family)",
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '0.4rem 0',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
        >
          ← Back
        </button>

        {/* Brand Logo */}
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <BrandLogo width={36} />
        </div>
      </div>

      {/* Main Content — Desktop: side-by-side, Mobile: stacked */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '6rem 2.5rem 3rem',
        gap: '3rem',
      }}
        className="apply-hero-layout"
      >
        {/* Left — Typing text */}
        <div style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 5,
        }}
          className="apply-text-col"
        >
          {lines.map((line, i) => (
            <h1
              key={i}
              style={{
                fontFamily: "var(--font-family)",
                fontWeight: i === 0 ? 800 : 800,
                fontSize: i === 0 ? 'clamp(3rem, 6vw, 4.5rem)' : 'clamp(1.5rem, 3.5vw, 2.2rem)',
                lineHeight: i === 0 ? 1.15 : 1.35,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                margin: 0,
                marginBottom: i === 0 ? '1.5rem' : 0,
                textAlign: 'left',
              }}
            >
              {line}
            </h1>
          ))}
          
          <div style={{ 
            marginTop: '2.5rem',
          }}>
            <button 
              className="waitlist-reserve-btn"
              onClick={() => console.log('Lets find out clicked')}
              style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', width: 'auto' }}
            >
              Let's find out →
            </button>
          </div>
        </div>

        {/* Right — Hirer SVG */}
        <div
          style={{
            flex: '1 1 45%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 3,
          }}
          className="apply-svg-col"
        >
          <img
            src="/hirer.svg"
            alt="Student illustration"
            style={{
              width: '100%',
              maxWidth: '520px',
              height: 'auto',
              objectFit: 'contain',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
