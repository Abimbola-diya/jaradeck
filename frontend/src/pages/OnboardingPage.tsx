import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OnboardingFlow from '../components/Onboarding';

const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
  '1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com';

export default function OnboardingPage() {
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

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <OnboardingFlow />
    </GoogleOAuthProvider>
  );
}