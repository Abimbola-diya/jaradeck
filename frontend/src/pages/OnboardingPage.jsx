import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OnboardingFlow from '../components/OnboardingPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // When coming from SignupPage after OTP verification, we receive the verified
  // user object and access token so the flow can jump straight to role selection.
  const verifiedUser = location.state?.verifiedUser || null;
  const accessToken = location.state?.accessToken || null;
  const fromSignup = location.state?.fromSignup || false;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <OnboardingFlow
        onNavigateHome={() => navigate('/')}
        onNavigateDashboard={() => navigate('/dashboard')}
        initialVerifiedUser={verifiedUser}
        initialAccessToken={accessToken}
        startAtRoleSelection={fromSignup && !!verifiedUser}
      />
    </GoogleOAuthProvider>
  );
}
