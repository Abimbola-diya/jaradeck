import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OnboardingFlow from '../components/OnboardingPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure html and body have solid white background during onboarding
  useEffect(() => {
    const origHtmlBg = document.documentElement.style.backgroundColor;
    const origBodyBg = document.body.style.backgroundColor;

    document.documentElement.style.backgroundColor = '#FFFFFF';
    document.body.style.backgroundColor = '#FFFFFF';

    return () => {
      document.documentElement.style.backgroundColor = origHtmlBg;
      document.body.style.backgroundColor = origBodyBg;
    };
  }, []);

  // When coming from SignupPage after OTP verification, we receive the verified
  // user object and access token so the flow can jump straight to role selection.
  const verifiedUser = location.state?.verifiedUser || null;
  const accessToken = location.state?.accessToken || null;
  const fromSignup = location.state?.fromSignup || false;
  const initialStep = location.state?.initialStep || null;

  return (
    <div className="jd-onboarding-wrapper">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <OnboardingFlow
          onNavigateHome={() => navigate('/')}
          onNavigateDashboard={() => navigate('/dashboard')}
          initialVerifiedUser={verifiedUser}
          initialAccessToken={accessToken}
          startAtRoleSelection={fromSignup && !!verifiedUser}
          initialStep={initialStep}
        />
      </GoogleOAuthProvider>
    </div>
  );
}
