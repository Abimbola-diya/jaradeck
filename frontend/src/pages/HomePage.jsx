import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StadiumIllustration from '../components/StadiumIllustration';
import NeedItDoneAnimation from '../components/NeedItDoneAnimation';
import ComparisonCards from '../components/ComparisonCards';
import FeatureCards from '../components/FeatureCards';
import RealImpactSection from '../components/RealImpactSection';
import FaqSection from '../components/FaqSection';
import NewsletterSection from '../components/NewsletterSection';

const HEADLINES = [
  [
    { text: "Your to-do list isn't ", action: false },
    { text: 'getting shorter.', action: true },
  ],
  [
    { text: 'Outsource', action: true },
    { text: ' the grind, let us do the ', action: false },
    { text: 'sweating.', action: true },
  ],
  [
    { text: "You can't do ", action: false },
    { text: 'everything yourself.', action: true },
  ],
  [
    { text: 'Keep', action: true },
    { text: ' your sanity, ', action: false },
    { text: 'give', action: true },
    { text: ' us the grunt work.', action: false },
  ],
];

export default function HomePage() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((previousIndex) => (previousIndex + 1) % HEADLINES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToOnboarding = () => {
    navigate('/onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <main className="hero-main">
        <div className="hero-content">
          <div className="hero-headline-wrapper">
            <h1 key={headlineIndex} className="hero-headline hero-headline-animated">
              {HEADLINES[headlineIndex].map((part, index) =>
                part.action ? (
                  <span key={index} className="action-word">{part.text}</span>
                ) : (
                  <span key={index}>{part.text}</span>
                ),
              )}
            </h1>
          </div>

          <p className="hero-subtitle">
            Jaradeck is the easiest way to get work done without sifting through endless profiles and fake reviews. Give us the grunt work.
          </p>

          <button className="hero-cta-btn" onClick={goToOnboarding}>
            <span>Use Jaradeck</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
              <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.66667M10.5 3.5V9.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

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
