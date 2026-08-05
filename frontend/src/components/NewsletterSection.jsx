import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        {/* Top Header Row */}
        <div className="newsletter-header-row">
          <div className="newsletter-title-group">
            {/* Sparkle Icon (Curved 4-point Sparkle) */}
            <svg
              className="newsletter-sparkle-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C12 7.52285 16.4771 12 22 12C16.4771 12 12 16.4771 12 22C12 16.4771 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" />
            </svg>

            <h2 className="newsletter-title">Cool stuff only</h2>
            <span className="newsletter-subtitle">Subscribe to our newsletter</span>
          </div>

          {/* Top-Right Illustration Graphic */}
          <div className="newsletter-graphic-wrapper">
            <img
              src="/lekki.svg"
              alt="Lekki illustration"
              className="newsletter-lekki-img"
            />
          </div>
        </div>

        {/* Form Grid Row */}
        <form className="newsletter-form-grid" onSubmit={handleSubmit}>
          <div className="newsletter-input-cell">
            <input
              type="email"
              className="newsletter-email-input"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe to newsletter">
            {subscribed ? (
              <span className="newsletter-success-check">✓</span>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="newsletter-arrow-icon"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </form>

        {/* Bottom Grid Line Subdivisions */}
        <div className="newsletter-bottom-grid-lines">
          <div className="newsletter-grid-cell" />
          <div className="newsletter-grid-cell" />
          <div className="newsletter-grid-cell" />
        </div>
      </div>
    </section>
  );
}
