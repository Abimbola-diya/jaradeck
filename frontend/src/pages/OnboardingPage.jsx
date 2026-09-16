import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import OnboardingFlow from '../components/OnboardingPage';


export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure html and body have solid white background during onboarding on mobile
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

  // When coming from SignupPage after OTP verification, we receive the verified
  // user object and access token so the flow can jump straight to role selection.
  const verifiedUser = location.state?.verifiedUser || location.state?.user || null;
  const accessToken = location.state?.accessToken || null;
  const fromSignup = location.state?.fromSignup || false;
  const initialStep = location.state?.initialStep || null;

  // Smart Guard: If user has already selected a role in the database / local storage,
  // bypass onboarding role selection and go directly to dashboard.
  useEffect(() => {
    let currentUser = verifiedUser;
    if (!currentUser) {
      try {
        const stored = localStorage.getItem('jaradeck_user');
        if (stored) currentUser = JSON.parse(stored);
      } catch {}
    }
    if (currentUser?.role) {
      navigate('/dashboard', { replace: true });
    }
  }, [verifiedUser, navigate]);

  const flowContent = (
    <OnboardingFlow
      onNavigateHome={() => navigate('/')}
      onNavigateDashboard={() => navigate('/dashboard')}
      initialVerifiedUser={verifiedUser}
      initialAccessToken={accessToken}
      startAtRoleSelection={fromSignup && !!verifiedUser}
      initialStep={initialStep}
    />
  );

  return (
    <div className="jd-onboarding-wrapper">
      {flowContent}
    </div>
  );
}
