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
            <svg
              width="68"
              height="72"
              viewBox="0 0 80 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="newsletter-bag-svg"
            >
              <path
                d="M15 25 L65 25 L75 80 C75 82 73 84 70 84 L10 84 C7 84 5 82 5 80 Z"
                fill="#D98A48"
                stroke="#1E140C"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M15 25 L25 15 C27 13 30 13 32 15 L40 22 L48 15 C50 13 53 13 55 15 L65 25"
                fill="#E69C5A"
                stroke="#1E140C"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="35" r="5" fill="#105C3E" stroke="#1E140C" strokeWidth="1.5" />
              <line x1="15" y1="58" x2="65" y2="58" stroke="#1E140C" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M65 25 L75 80 L80 75 L70 20 Z"
                fill="#B36E33"
                stroke="#1E140C"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
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
