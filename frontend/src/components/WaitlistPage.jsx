import React, { useState } from 'react';
import StadiumIllustration from './StadiumIllustration';

export default function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <main className="hero-main" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="hero-content">
        <div className="hero-headline-wrapper">
          <h1 className="hero-headline">
            You can't keep doing <span className="action-word">everything yourself.</span>
          </h1>
        </div>

        <p className="hero-subtitle">
          Let Jaradeck take it from here...
        </p>

        {/* Waitlist Form Card */}
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
            <p>We'll notify <span>{email}</span> as soon as access opens up.</p>
          </div>
        )}
      </div>

      {/* Stadium Architecture Graphics */}
      <div className="stadium-section">
        <StadiumIllustration />
      </div>
    </main>
  );
}
