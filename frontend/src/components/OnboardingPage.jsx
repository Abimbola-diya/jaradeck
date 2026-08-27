import React, { useState, useEffect } from 'react';
import RoleSelectionStep from './onboarding/RoleSelectionStep';
import SignInStep from './onboarding/SignInStep';
import SignUpStep from './onboarding/SignUpStep';
import ProfileStep from './onboarding/ProfileStep';
import OTPStep from './onboarding/OTPStep';
import SuccessStep from './onboarding/SuccessStep';

// ─── Main Orchestrator ────────────────────────────────────────────────────────
//
// Customer Flow:
//   role → auth (signup) ↔ auth (signin) → profile → otp (email) → done
//
// Worker Flow:
//   role → auth (signup) ↔ auth (signin) → profile (+ phone) → otp (sms) → done
//
export default function OnboardingPage({ onNavigateHome, onNavigateDashboard }) {
  const [step, setStep] = useState('role');
  const [role, setRole] = useState(null);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'
  const [profileData, setProfileData] = useState({});

  // Sync with browser history popstate so using the browser back button steps backward inside onboarding instead of navigating to home page
  useEffect(() => {
    if (!window.history.state || !window.history.state.onboardingStep) {
      window.history.replaceState({ onboardingStep: 'role' }, '');
    }

    const handlePopState = (event) => {
      if (event.state && event.state.onboardingStep) {
        setStep(event.state.onboardingStep);
      } else {
        setStep('role');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToStep = (newStep) => {
    if (window.history.state?.onboardingStep !== newStep) {
      window.history.pushState({ onboardingStep: newStep }, '');
    }
    setStep(newStep);
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.state.onboardingStep && window.history.state.onboardingStep !== 'role') {
      window.history.back();
    } else {
      setStep('role');
    }
  };

  // ── Role selection ──────────────────────────────────────────────
  const handleRoleSelect = (selected) => {
    if (selected === 'signin-only') {
      setRole(null);
      setAuthMode('signin');
      goToStep('auth');
      return;
    }
    setRole(selected);
    goToStep('profile');   // Customer & worker go directly to "Let's set up your profile"
  };

  // ── Google Auth Success ─────────────────────────────────────────
  const handleGoogleAuthSuccess = (authData, selectedRole) => {
    const activeRole = authData?.user?.role || selectedRole || 'customer';
    setRole(activeRole);
    setProfileData(authData.user);

    if (activeRole === 'customer') {
      // Customer signing up with Google has email pre-verified -> Direct to Dashboard!
      goToStep('done');
    } else {
      // Worker signing up with Google -> Requires phone / SMS OTP verification
      goToStep('otp');
    }
  };

  // ── Auth → next ─────────────────────────────────────────────────
  const handleAuthNext = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
    goToStep('profile');
  };

  // ── Profile → next ──────────────────────────────────────────────
  const handleProfileNext = (data) => {
    setProfileData(data);
    if (role === 'customer') {
      // Customer profile setup complete -> Direct to Done/Dashboard!
      goToStep('done');
    } else {
      // Worker profile setup -> Go to SMS OTP for phone verification
      goToStep('otp');
    }
  };

  // ── OTP → done ──────────────────────────────────────────────────
  const handleOTPNext = () => goToStep('done');

  // ── Switch between sign-in / sign-up ────────────────────────────
  const switchToSignIn = () => { setAuthMode('signin'); goToStep('auth'); };
  const switchToSignUp = () => { setAuthMode('signup'); goToStep('profile'); };

  return (
    <>
      {step === 'role' && (
        <RoleSelectionStep
          key="role"
          onSelect={handleRoleSelect}
          onGoogleAuthSuccess={handleGoogleAuthSuccess}
          onNavigateHome={onNavigateHome}
        />
      )}

      {step === 'auth' && authMode === 'signin' && (
        <SignInStep key="signin" onNext={handleAuthNext} onSwitchToSignUp={switchToSignUp} onBack={handleGoBack} />
      )}

      {step === 'auth' && authMode === 'signup' && (
        <SignUpStep key="signup" onNext={handleAuthNext} onSwitchToSignIn={switchToSignIn} onBack={handleGoBack} />
      )}

      {step === 'profile' && (
        <ProfileStep key="profile" role={role} onNext={handleProfileNext} onSignIn={switchToSignIn} onBack={handleGoBack} />
      )}

      {step === 'otp' && (
        <OTPStep key="otp" role={role} onNext={handleOTPNext} onSignIn={switchToSignIn} onBack={handleGoBack} />
      )}

      {step === 'done' && (
        <SuccessStep key="done" onNavigateDashboard={onNavigateDashboard} />
      )}
    </>
  );
}
