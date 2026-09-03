import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignupModalCard from '../components/SignupModalCard';
import OTPStep from '../components/onboarding/OTPStep';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const triggerOrigin = location.state?.origin;

  // Lock html & body scroll on mount
  React.useEffect(() => {
    const isMobile = window.innerWidth <= 640;

    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;

    if (isMobile) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isMobile) {
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.backgroundColor = ''; // Clean up any white background set by the modal
        document.body.style.backgroundColor = '';
      } else {
        document.body.style.overflow = origBodyOverflow;
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

  const mainContent = (
    <>
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
    </>
  );

  return (
    <div className="jd-signup-standalone-page">
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {mainContent}
        </GoogleOAuthProvider>
      ) : (
        mainContent
      )}
    </div>
  );
}
