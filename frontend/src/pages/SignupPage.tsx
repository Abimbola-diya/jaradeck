import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignupModalCard from '../components/SignupModalCard';
import LoginModalCard from '../components/LoginModalCard';
import OTPStep from '../components/onboarding/OTPStep';
import { useAuthStore } from '../context/AuthContext'; // Or your AuthContext hook path

const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
  "1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com";

type Step = 'form' | 'otp';

interface LocationState {
  origin?: { x: number; y: number } | null;
}

interface AuthData {
  user: any;
  access_token: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const triggerOrigin = state.origin;
  const isLogin = location.pathname === '/login';

  const [step, setStep] = useState<Step>('form');
  const [pendingEmail, setPendingEmail] = useState<string>('');

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  const handleSwitchToSignUp = () => {
    navigate('/signup');
  };

const handleGoogleSuccess = (data?: { user?: any; access_token?: string }) => {
  if (data?.user && data?.access_token) {
    login(data.user, data.access_token);
  }

  if (data?.user?.is_onboarded) {
    navigate("/", { replace: true });
  } else {
    navigate("/onboarding", {
      replace: true,
      state: { googleAuth: true, user: data?.user },
    });
  }
};

  const handleOTPRequired = (email: string) => {
    setPendingEmail(email);
    setStep('otp');
  };

 const handleOTPVerified = (authData: AuthData) => {
   // 1. Sync session into AuthContext
   login(authData.user, authData.access_token);

   // 2. Check onboarding status
   if (authData.user?.is_onboarded) {
     // User is already onboarded -> Send to main application / dashboard
     navigate("/", { replace: true });
   } else {
     // User needs onboarding -> Send to onboarding flow
     navigate("/onboarding", {
       replace: true,
       state: {
         verifiedUser: authData.user,
         accessToken: authData.access_token,
         fromSignup: !isLogin,
       },
     });
   }
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