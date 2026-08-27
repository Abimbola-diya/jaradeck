import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignupModalCard from '../components/SignupModalCard';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1006224396906-d5ppio1t9hkkpj586idvc9uqrm3b503e.apps.googleusercontent.com";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const triggerOrigin = location.state?.origin;

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/onboarding');
  };

  const handleGoogleSuccess = () => {
    navigate('/onboarding');
  };

  const handleFormSubmit = (data) => {
    console.log('Signup form submitted:', data);
    navigate('/onboarding');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SignupModalCard
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
        onGoogleSuccess={handleGoogleSuccess}
        onFormSubmit={handleFormSubmit}
        triggerOrigin={triggerOrigin}
      />
    </GoogleOAuthProvider>
  );
}
