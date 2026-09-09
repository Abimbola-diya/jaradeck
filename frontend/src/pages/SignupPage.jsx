import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignupModalCard from '../components/SignupModalCard';
import LoginModalCard from '../components/LoginModalCard';
import OTPStep from '../components/onboarding/OTPStep';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const triggerOrigin = location.state?.origin;
  const isLogin = location.pathname === '/login';

  const [step, setStep] = useState('form');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  const handleSwitchToSignUp = () => {
    navigate('/signup');
  };

  const handleGoogleSuccess = (data) => {
    navigate('/onboarding', { state: { googleAuth: true, user: data?.user } });
  };

  const handleOTPRequired = (email) => {
    setPendingEmail(email);
    setStep('otp');
  };

  const handleOTPVerified = (authData) => {
    navigate('/onboarding', {
      state: {
        verifiedUser: authData.user,
        accessToken: authData.access_token,
        fromSignup: !isLogin,
      },
    });
  };

  const handleOTPBack = () => {
    setStep('form');
    setPendingEmail('');
  };

  const modalContent = isLogin ? (
    <LoginModalCard
      onClose={handleClose}
      onSwitchToSignUp={handleSwitchToSignUp}
      onGoogleSuccess={handleGoogleSuccess}
      onOTPRequired={handleOTPRequired}
      triggerOrigin={triggerOrigin}
    />
  ) : (
    <SignupModalCard
      onClose={handleClose}
      onSwitchToLogin={handleSwitchToLogin}
      onGoogleSuccess={handleGoogleSuccess}
      onOTPRequired={handleOTPRequired}
      triggerOrigin={triggerOrigin}
    />
  );

  const mainContent = (
    <>
      {step === 'form' && modalContent}

      {step === 'otp' && (
        <div className="jd-otp-fullscreen-wrapper">
          <OTPStep
            email={pendingEmail}
            role="customer"
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
