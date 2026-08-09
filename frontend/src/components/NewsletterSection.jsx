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
            {/* 4-point White Star Icon */}
            <svg
              className="newsletter-star-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              aria-hidden="true"
            >
              <path d="M12 2C12 7.52285 16.4771 12 22 12C16.4771 12 12 16.4771 12 22C12 16.4771 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" />
            </svg>

            <div className="newsletter-text-stack">
              <h2 className="newsletter-title">Jara Dey</h2>
              <span className="newsletter-subtitle">Subscribe to our newsletter</span>
            </div>
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
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="newsletter-arrow-icon"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="13 5 20 12 13 19" />
              </svg>
            )}
          </button>
        </form>

        {/* Footer Grid Row */}
        <div className="newsletter-footer-grid">
          {/* Left Brand Cell */}
          <div className="newsletter-brand-cell">
            <div className="newsletter-brand-logo-group">
              <svg
                className="newsletter-footer-logo"
                width="38"
                height="27"
                viewBox="0 0 42 30"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3.90593 21.5234H41.0577V29.5169H3.90593V21.5234Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M41.0577 21.5234H3.90593L0 19.4655H37.0411L41.0577 21.5234Z" fill="#E2E2E2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M3.90593 21.5234V29.5169L0 27.1387V19.4655L3.90593 21.5234Z" fill="#EFEFEF" />
                <path d="M3.90593 11.9195H41.0577V19.913H3.90593V11.9195Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M41.0577 11.9195H3.90593L0 9.86157H37.0411L41.0577 11.9195Z" fill="#E2E2E2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M3.90593 11.9195V19.913L0 17.5348V9.86157L3.90593 11.9195Z" fill="#EFEFEF" />
                <path d="M3.90593 2.05795H41.0577V10.0515H3.90593V2.05795Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M41.0577 2.05795H3.90593L0 0H37.0411L41.0577 2.05795Z" fill="#E2E2E2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M3.90593 2.05795V10.0515L0 7.67324V0L3.90593 2.05795Z" fill="#EFEFEF" />
              </svg>
              <span className="newsletter-brand-name">Jaradeck</span>
            </div>
          </div>

          {/* Right Social Links 2x2 Grid */}
          <div className="newsletter-social-grid">
            {/* Twitter */}
            <a href="#twitter" className="newsletter-social-cell" onClick={(e) => e.preventDefault()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#93C5FD" aria-hidden="true">
                <path d="M12 2C12 7.52285 16.4771 12 22 12C16.4771 12 12 16.4771 12 22C12 16.4771 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" />
              </svg>
              <span>Twitter</span>
            </a>

            {/* Instagram */}
            <a href="#instagram" className="newsletter-social-cell" onClick={(e) => e.preventDefault()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#F472B6" aria-hidden="true">
                <path d="M12 2L14.2 8.3L21 9L15.8 13.8L17.5 20.5L12 17L6.5 20.5L8.2 13.8L3 9L9.8 8.3L12 2Z" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* Facebook */}
            <a href="#facebook" className="newsletter-social-cell" onClick={(e) => e.preventDefault()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#A78BFA" aria-hidden="true">
                <path d="M12 3A9 9 0 0 0 3 12A9 9 0 0 0 12 21V3Z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* LinkedIn */}
            <a href="#linkedin" className="newsletter-social-cell" onClick={(e) => e.preventDefault()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FB923C" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="#FB923C" strokeWidth="3" />
                <circle cx="12" cy="12" r="3.5" fill="#FB923C" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright Text */}
        <div className="newsletter-copyright">
          © 2022–2026 Jaradeck Ltd. All rights reserved.
        </div>
      </div>
    </section>
  );
}
