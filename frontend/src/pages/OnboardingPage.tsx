import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OnboardingFlow from '../components/Onboarding';

const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
  '1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com';

interface LocationState {
  verifiedUser?: any;
  accessToken?: string;
  initialStep?: string | number;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  // White background on mobile during onboarding
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

  // Passed from SignupPage after OTP verification
  const verifiedUser = state.verifiedUser || null;
  const accessToken = state.accessToken || null;
  const initialStep = state.initialStep || null;

  // Route to the correct dashboard based on role
  const handleNavigateDashboard = (role: string) => {
    if (role === 'customer') {
      navigate('/dashboard/customer');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <OnboardingFlow
        onNavigateHome={() => navigate('/')}
        onNavigateDashboard={handleNavigateDashboard}
        initialVerifiedUser={verifiedUser}
        initialAccessToken={accessToken}
        initialStep={initialStep}
      />
    </GoogleOAuthProvider>
  );
}