import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OnboardingFlow from '../components/OnboardingPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();

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
  const verifiedUser = location.state?.verifiedUser || null;
  const accessToken  = location.state?.accessToken  || null;
  const initialStep  = location.state?.initialStep  || null;

  // Route to the correct dashboard based on role
  const handleNavigateDashboard = (role) => {
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
