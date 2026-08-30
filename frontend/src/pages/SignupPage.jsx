import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignupModalCard from '../components/SignupModalCard';
import OTPStep from '../components/onboarding/OTPStep';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const triggerOrigin = location.state?.origin;

  // Lock html & body scroll & set white background ONLY on mobile screens
  React.useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlHeight = document.documentElement.style.height;
    const origBodyHeight = document.body.style.height;
    const origHtmlBg = document.documentElement.style.backgroundColor;
    const origBodyBg = document.body.style.backgroundColor;

    if (isMobile) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.height = '100vh';
      document.body.style.height = '100vh';
      document.documentElement.style.backgroundColor = '#FFFFFF';
      document.body.style.backgroundColor = '#FFFFFF';
    }

    return () => {
      if (isMobile) {
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.height = origHtmlHeight;
        document.body.style.height = origBodyHeight;
        document.documentElement.style.backgroundColor = origHtmlBg;
        document.body.style.backgroundColor = origBodyBg;
      }
    };
  }, []);

  // 'form' | 'otp'
  const [step, setStep] = useState('form');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/onboarding', { state: { initialStep: 'signin' } });
  };

  const handleGoogleSuccess = (data) => {
    // Google users are already verified — go straight to onboarding (role selection)
    navigate('/onboarding', { state: { googleAuth: true, user: data?.user } });
  };

  // Called by SignupModalCard when /register returns 202
  const handleOTPRequired = (email) => {
    setPendingEmail(email);
    setStep('otp');
  };

  // Called by OTPStep when /verify-otp returns 200 + JWT
  const handleOTPVerified = (authData) => {
    // User is verified but has no role yet → send to role selection
    navigate('/onboarding', {
      state: {
        verifiedUser: authData.user,
        accessToken: authData.access_token,
        fromSignup: true,
      },
    });
  };

  const handleOTPBack = () => {
    // Go back to the signup form
    setStep('form');
    setPendingEmail('');
  };

  return (
    <div className="jd-signup-standalone-page">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {step === 'form' && (
          <SignupModalCard
            onClose={handleClose}
            onSwitchToLogin={handleSwitchToLogin}
            onGoogleSuccess={handleGoogleSuccess}
            onOTPRequired={handleOTPRequired}
            triggerOrigin={triggerOrigin}
          />
        )}

        {step === 'otp' && (
          <div className="jd-otp-fullscreen-wrapper">
            <OTPStep
              email={pendingEmail}
              onVerified={handleOTPVerified}
              onSignIn={handleSwitchToLogin}
              onBack={handleOTPBack}
            />
          </div>
        )}
      </GoogleOAuthProvider>
    </div>
  );
}
