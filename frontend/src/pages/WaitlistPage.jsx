import { useState } from 'react';
import StadiumIllustration from '../components/StadiumIllustration';
import FaqSection from '../components/FaqSection';
import NewsletterSection from '../components/NewsletterSection';
import WaitlistFlow from '../components/WaitlistFlow';

export default function WaitlistPage() {
  const [flowOpen, setFlowOpen] = useState(false);

  return (
    <>
      <main className="hero-main">
        <div className="hero-content">
          <div className="hero-headline-wrapper">
            <h1 className="hero-headline">
              Your competitors are using Jaradeck.
              <span className="hero-subheadline">why aren't you?</span>
            </h1>
          </div>

          <p className="hero-subtitle">
            Whatever's sitting on your to-do list, there's probably someone on Jaradeck who can do it better, faster and for less than you'd expect.
          </p>

          {/* Reserve Spot CTA */}
          <div className="waitlist-cta-wrapper">
            <button
              className="waitlist-reserve-btn"
              onClick={() => setFlowOpen(true)}
            >
              Reserve my spot on Jaradeck →
            </button>
            <p className="waitlist-time-caption">
              Takes less than a minute...
            </p>
          </div>
        </div>

        {/* Stadium Architecture Illustration */}
        <div className="stadium-section">
          <StadiumIllustration />
        </div>
      </main>

      <FaqSection />
      <NewsletterSection />

      {/* Waitlist Multi-Step Flow Overlay */}
      {flowOpen && <WaitlistFlow onClose={() => setFlowOpen(false)} />}
    </>
  );
}
