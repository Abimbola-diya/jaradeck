import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupModalCard from '../components/SignupModalCard';
import OTPStep from '../components/onboarding/OTPStep';


export default function SignupPage() {
  const navigate = useNavigate();

  // Lock body scroll when signup page is open
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // 'form' | 'otp'
  const [step, setStep] = useState('form');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  const handleGoogleSuccess = (data) => {
    const user = data?.user;
    if (user?.role) {
      // Returning user with a role set in DB -> Go straight to dashboard!
      navigate('/dashboard', { state: { user } });
    } else {
      // New user without a role -> send to role selection
      navigate('/onboarding', {
        state: {
          googleAuth: true,
          verifiedUser: user,
          accessToken: data?.access_token,
          fromSignup: true,
        },
      });
    }
  };

  // Called by SignupModalCard when /register returns 202
  const handleOTPRequired = (email) => {
    setPendingEmail(email);
    setStep('otp');
  };

  // Called by OTPStep when /verify-otp returns 200 + JWT
  const handleOTPVerified = (authData) => {
    const user = authData?.user;
    if (user?.role) {
      // User already has a role -> send straight to dashboard
      navigate('/dashboard', { state: { user } });
    } else {
      // User has no role yet → send to role selection
      navigate('/onboarding', {
        state: {
          verifiedUser: user,
          accessToken: authData?.access_token,
          fromSignup: true,
        },
      });
    }
  };

  const handleOTPBack = () => {
    // Go back to the signup form
    setStep('form');
    setPendingEmail('');
  };

  return (
    <div className="jd-signup-standalone-page">
      {step === 'form' && (
        <SignupModalCard
          onClose={handleClose}
          onSwitchToLogin={handleSwitchToLogin}
          onGoogleSuccess={handleGoogleSuccess}
          onOTPRequired={handleOTPRequired}
          triggerOrigin={null}
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
    </div>
  );
}
