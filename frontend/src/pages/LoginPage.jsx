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
    const user = userData?.user || userData;
    if (user?.role) {
      // User has selected a role -> send straight to dashboard!
      navigate('/dashboard', { state: { user } });
    } else {
      // User has no role set yet -> send to onboarding role selection
      navigate('/onboarding', { state: { verifiedUser: user, accessToken: userData?.access_token } });
    }
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
