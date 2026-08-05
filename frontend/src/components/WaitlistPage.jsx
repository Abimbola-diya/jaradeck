import React, { useState, useEffect } from 'react';
import StadiumIllustration from './StadiumIllustration';

const WAITLIST_HEADLINES = [
  "Be first to delegate your grunt work.",
  "Skip the line, let Jaradeck handle it.",
  "Get early access to Jaradeck."
];

export default function WaitlistPage({ onNavigateHome }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1420);

  // Rotate headline every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % WAITLIST_HEADLINES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setWaitlistCount((prev) => prev + 1);
    }
  };

  return (
    <div className="waitlist-page">
      {/* Top Banner / Breadcrumb Nav */}
      <div className="waitlist-top-bar">
        <button className="waitlist-back-btn" onClick={onNavigateHome}>
          ← Back to Jaradeck Home
        </button>
      </div>

      <main className="waitlist-hero-main">
        <div className="waitlist-hero-content">
          {/* Live Waitlist Counter Pill */}
          <div className="waitlist-counter-pill">
            <span className="sparkle-icon">✦</span>
            <span>{waitlistCount.toLocaleString()}+ people on the waitlist</span>
          </div>

          {/* Animated Headline */}
          <div className="waitlist-headline-wrapper">
            <h1 key={headlineIndex} className="waitlist-headline waitlist-headline-animated">
              {WAITLIST_HEADLINES[headlineIndex]}
            </h1>
          </div>

          <p className="waitlist-subtitle">
            Jaradeck is the easiest way to get work done without sifting through profiles. Join the waitlist for priority onboarding and 50% off your first month.
          </p>

          {/* Interactive Form or Success State */}
          {!isSubmitted ? (
            <form className="waitlist-form-card" onSubmit={handleSubmit}>
              <div className="waitlist-form-inputs">
                <input
                  type="text"
                  className="waitlist-input"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="waitlist-input"
                  placeholder="yourname@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="waitlist-submit-btn">
                <span>Join Waitlist</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>
          ) : (
            <div className="waitlist-success-card">
              <div className="success-badge">✓</div>
              <h3>You're on the list, {name || 'friend'}!</h3>
              <p>You are <strong>#{waitlistCount.toLocaleString()}</strong> in line. We'll send your invite to <span>{email}</span> soon.</p>
            </div>
          )}

          {/* Early Access Perks Grid */}
          <div className="waitlist-perks-grid">
            <div className="waitlist-perk-card">
              <span className="perk-icon">⚡</span>
              <h4>Priority Onboarding</h4>
              <p>Get first dibs when Jaradeck launches in your location.</p>
            </div>
            <div className="waitlist-perk-card">
              <span className="perk-icon">🎁</span>
              <h4>50% Off First Month</h4>
              <p>Exclusive discount reserved for early waitlist members.</p>
            </div>
            <div className="waitlist-perk-card">
              <span className="perk-icon">💬</span>
              <h4>Direct Support</h4>
              <p>Direct line to our team for custom requests and feedback.</p>
            </div>
          </div>
        </div>

        {/* Stadium Architecture Graphics */}
        <div className="stadium-section">
          <StadiumIllustration />
        </div>
      </main>
    </div>
  );
}
