import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '../components/ArrowIcon';
import HugeAnimatedEye from '../components/HugeAnimatedEye';
import StadiumIllustration from '../components/StadiumIllustration';
import NeedItDoneAnimation from '../components/NeedItDoneAnimation';
import ComparisonCards from '../components/ComparisonCards';
import FeatureCards from '../components/FeatureCards';
import RealImpactSection from '../components/RealImpactSection';
import FaqSection from '../components/FaqSection';
import NewsletterSection from '../components/NewsletterSection';
import MarqueeTicker from '../components/MarqueeTicker';

export default function HomePage() {
  const navigate = useNavigate();

  const goToOnboarding = (e) => {
    e?.preventDefault();
    navigate('/waitlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <main className="hero-main">
        <div className="hero-content">
          <div className="hero-headline-wrapper">
            <h1 className="hero-headline">
              Stop, pass it on.
            </h1>
            <p className="hero-subtitle">
              You can't keep doing everything yourself.
            </p>
          </div>

          <form className="hero-chatbox-wrapper" onSubmit={goToOnboarding}>
            <textarea 
              className="hero-chatbox-input" 
              placeholder="How can I help you?"
              rows={3}
            />
            <div className="hero-chatbox-footer">
              <button type="submit" className="hero-chatbox-btn">
                <HugeAnimatedEye size={17} color="#0048b3" />
                <span>Let's go</span>
              </button>
            </div>
          </form>
        </div>

        {/* Chowdeck-Style Glassmorphic Marquee Ticker */}
        <MarqueeTicker onSelectPhrase={() => { navigate('/waitlist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

        <div className="stadium-section">
          <StadiumIllustration />
        </div>
      </main>

      <section className="canopy-section">
        <div className="canopy-content-wrapper">
          <NeedItDoneAnimation />
        </div>
      </section>

      <ComparisonCards />
      <FeatureCards />
      <RealImpactSection />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
