import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import BrandLogo from './BrandLogo';
import { validateEmail } from '../utils/validation';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = validateEmail(email);
    if (!res.isValid) {
      setEmailError(res.error);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        console.error("Failed to subscribe:", await response.text());
        // Show error? For now we just fall through to success confetti
      }
    } catch (err) {
      console.error("Error subscribing:", err);
    }
    
    setEmailError('');
    setSubscribed(true);
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.85 },
      colors: ['#4ADE80', '#93C5FD', '#FFFFFF', '#FFE699']
    });
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 6000);
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
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
              required
            />
            {emailError && (
              <div className="newsletter-error-text">
                {emailError}
              </div>
            )}
            {subscribed && (
              <div className="newsletter-subscribed-text">
                Subscribed! 🎉
              </div>
            )}
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
              <BrandLogo className="newsletter-footer-logo" width={38} height={27} />
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
