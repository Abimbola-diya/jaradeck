import { useState, useEffect } from 'react';
import { Briefcase01Icon, UserAccountIcon } from 'hugeicons-react';
import ArrowLeft02Icon from './ArrowLeft02Icon';
import ArrowIcon from './ArrowIcon';
import BrandLogo from './BrandLogo';
import confettiImage from '../assets/coffette.svg';
import successTickImage from '../assets/success tick.svg';
import SignInStep from './onboarding/SignInStep';
import SignUpStep from './onboarding/SignUpStep';
import ProfileStep from './onboarding/ProfileStep';
import { API_BASE_URL } from '../lib/api';

// ─── Role Selection ───────────────────────────────────────────────────────────
function RoleSelectionStep({ onSelect, onNavigateHome }) {
  const [selectedRole, setSelectedRole] = useState('customer');

  return (
    <div className="ob2-page">
      {onNavigateHome && (
        <button type="button" className="ob2-back-btn ob2-anim-back" onClick={onNavigateHome} aria-label="Go back home">
          <ArrowLeft02Icon size={20} />
        </button>
      )}

      <div className="ob2-role-container">
        <div className="ob2-role-top-section">
          <div className="ob2-role-header-group">
            <div className="ob2-role-logo ob2-anim-logo">
              <BrandLogo width={34} height={25} tone="blue" />
            </div>
            <div className="ob2-role-title-group ob2-anim-header">
              <h1 className="ob2-role-title">How can we help you?</h1>
              <p className="ob2-role-subtitle">Choose how you would like to use Jaradeck</p>
            </div>
          </div>

          <div className="ob2-role-card-group">
            <button
              type="button"
              className={`ob2-role-custom-card ob2-anim-card-1 ${selectedRole === 'customer' ? 'ob2-role-custom-card-selected' : ''}`}
              onClick={() => setSelectedRole('customer')}
            >
              <div className="ob2-role-card-icon"><Briefcase01Icon size={26} /></div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I need work done.</div>
                <div className="ob2-role-card-desc">Hand off your projects and get finished results without the hiring hassle.</div>
              </div>
            </button>

            <button
              type="button"
              className={`ob2-role-custom-card ob2-anim-card-2 ${selectedRole === 'worker' ? 'ob2-role-custom-card-selected' : ''}`}
              onClick={() => setSelectedRole('worker')}
            >
              <div className="ob2-role-card-icon"><UserAccountIcon size={26} /></div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I want to do work</div>
                <div className="ob2-role-card-desc">Get matched directly with active projects and earn on your terms.</div>
              </div>
            </button>
          </div>
        </div>

        <div className="ob2-role-footer ob2-anim-footer">
          <button
            type="button"
            className="ob2-role-submit-btn"
            disabled={!selectedRole}
            onClick={() => onSelect(selectedRole)}
          >
            Continue <ArrowIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────
function SuccessStep({ onNavigateDashboard }) {
  return (
    <div className="ob2-page ob2-page-success">
      <img src={confettiImage} className="ob2-confetti-img" alt="" aria-hidden="true" />
      <div className="ob2-success-content">
        <img src={successTickImage} className="ob2-success-badge-img" alt="Onboarding complete" />
        <h1 className="ob2-success-title">You&apos;re all set!</h1>
        <p className="ob2-success-copy">
          Keep an eye on your dashboard<br />
          we&apos;ll match you as soon as work comes in.
        </p>
        <button className="ob2-cta-btn ob2-dashboard-cta" onClick={onNavigateDashboard}>
          Continue to Dashboard <ArrowIcon size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────
//
// Flow A — Registration (new user via /signup):
//   signup (name+email → OTP → verify) → role → profile → done
//
// Flow B — Sign-In (complete profile):
//   signin (email → OTP → verify) → onboarding_completed: true → dashboard
//
// Flow C — Sign-In (incomplete profile):
//   signin (email → OTP → verify) → onboarding_completed: false → role → profile → done
//
export default function OnboardingPage({
  onNavigateHome,
  onNavigateDashboard,
  initialVerifiedUser = null,
  initialAccessToken  = null,
  initialStep         = null,
}) {
  const [step, setStep] = useState(() => {
    if (initialVerifiedUser) return 'role';
    if (initialStep === 'signin') return 'signin';
    return 'signup';
  });

  const [role, setRole]                   = useState(null);
  const [verifiedUser, setVerifiedUser]   = useState(initialVerifiedUser);
  const [accessToken, setAccessToken]     = useState(initialAccessToken);

  useEffect(() => {
    const defaultStep = initialVerifiedUser ? 'role' : (initialStep === 'signin' ? 'signin' : 'signup');
    if (!window.history.state?.onboardingStep) {
      window.history.replaceState({ ...window.history.state, onboardingStep: defaultStep }, '');
    }
    const handlePop = (e) => {
      if (e.state?.onboardingStep) setStep(e.state.onboardingStep);
      else setStep(defaultStep);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [initialVerifiedUser, initialStep]);

  const goToStep = (newStep) => {
    if (window.history.state?.onboardingStep !== newStep) {
      window.history.pushState({ onboardingStep: newStep }, '');
    }
    setStep(newStep);
  };

  // Shared handler for both SignUpStep and SignInStep after OTP verified
  const handleVerified = (authData) => {
    const user  = authData.user;
    const token = authData.access_token;
    setVerifiedUser(user);
    setAccessToken(token);

    if (user.onboarding_completed) {
      onNavigateDashboard(user.role);
      return;
    }

    if (user.role) {
      setRole(user.role);
      goToStep('profile');
    } else {
      goToStep('role');
    }
  };

  const handleRoleSelect = async (selected) => {
    setRole(selected);
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/set-role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify({ role: selected }),
        });
      } catch (e) {
        console.warn('[OB] set-role failed:', e);
      }
    }
    goToStep('profile');
  };

  const handleGoBack = () => {
    if (window.history.state?.onboardingStep && !['signup', 'signin'].includes(window.history.state.onboardingStep)) {
      window.history.back();
    } else {
      goToStep('signup');
    }
  };

  return (
    <>
      {step === 'signup' && (
        <SignUpStep
          key="signup"
          onVerified={handleVerified}
          onSwitchToSignIn={() => goToStep('signin')}
          onBack={onNavigateHome}
        />
      )}

      {step === 'signin' && (
        <SignInStep
          key="signin"
          onVerified={handleVerified}
          onSwitchToSignUp={() => goToStep('signup')}
          onBack={onNavigateHome}
        />
      )}

      {step === 'role' && (
        <RoleSelectionStep
          key="role"
          onSelect={handleRoleSelect}
          onNavigateHome={onNavigateHome}
        />
      )}

      {step === 'profile' && (
        <ProfileStep
          key="profile"
          role={role}
          accessToken={accessToken}
          onNext={() => goToStep('done')}
          onSignIn={() => goToStep('signin')}
          onBack={handleGoBack}
        />
      )}

      {step === 'done' && (
        <SuccessStep
          key="done"
          onNavigateDashboard={() => onNavigateDashboard(role)}
        />
      )}
    </>
  );
}
