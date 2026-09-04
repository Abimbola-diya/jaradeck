import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInStep from '../components/onboarding/SignInStep';

export default function LoginPage() {
  const navigate = useNavigate();

  // Ensure html and body have solid white background on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const origHtmlBg = document.documentElement.style.backgroundColor;
    const origBodyBg = document.body.style.backgroundColor;

    if (isMobile) {
      document.documentElement.style.backgroundColor = '#FFFFFF';
      document.body.style.backgroundColor = '#FFFFFF';
    }

    return () => {
      if (isMobile) {
        document.documentElement.style.backgroundColor = origHtmlBg;
        document.body.style.backgroundColor = origBodyBg;
      }
    };
  }, []);

  const handleNext = (userData) => {
    navigate('/dashboard', { state: { user: userData } });
  };

  const handleSwitchToSignUp = () => {
    navigate('/signup');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="jd-onboarding-wrapper">
      <SignInStep
        onNext={handleNext}
        onSwitchToSignUp={handleSwitchToSignUp}
        onBack={handleBack}
      />
    </div>
  );
}
