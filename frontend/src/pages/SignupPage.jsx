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

  // 'form' | 'otp'
  const [step, setStep] = useState('form');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/onboarding');
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
        <div className="ob2-page">
          <OTPStep
            email={pendingEmail}
            onVerified={handleOTPVerified}
            onSignIn={handleSwitchToLogin}
            onBack={handleOTPBack}
          />
        </div>
      )}
    </GoogleOAuthProvider>
  );
}
