import React, { useState, useRef } from 'react';
import { signInSchema, signUpSchema, profileSchema } from '../utils/schemas';
import { useRole } from '../context/RoleContext';
import ArrowIcon from './ArrowIcon';
import BrandLogo from './BrandLogo';
import confettiImage from '../assets/coffette.svg';
import successTickImage from '../assets/success tick.svg';

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  );
}

// ─── Shared Layout Shell ──────────────────────────────────────────────────────
function OBShell({ children, isSignIn = false, onAuthSwitch, onBack, hideBack = true }) {
  return (
    <div className="ob2-page">
      {/* Top Left Back Button */}
      {!hideBack && onBack && (
        <button type="button" className="ob2-back-btn" onClick={onBack} aria-label="Go back">
          <ArrowIcon direction="left" size={20} strokeWidth={2} />
        </button>
      )}
      {/* Logo — centered at top */}
      <div className="ob2-logo-wrap">
        <BrandLogo width={34} height={25} tone="blue" />
      </div>

       {/* Main content area */}
      <div className="ob2-content">
        {children}

      {/* Bottom auth switch */}
      <div className="ob2-bottom-bar ob2-role-bottom-bar">
        {isSignIn ? (
          <>
            <span>New to Jaradeck?</span>
            <button type="button" className="ob2-link-btn" onClick={onAuthSwitch}>Sign up</button>
          </>
        ) : (
          <>
            <span>Already on Jaradeck?</span>
            <button type="button" className="ob2-link-btn" onClick={onAuthSwitch}>Sign in</button>
          </>
        )}
      </div>
      </div>
    </div>
  );
}

// ─── STEP 1: Role Selection ───────────────────────────────────────────────────
function RoleSelectionStep({ onSelect, onNavigateHome }) {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="ob2-page">
      {onNavigateHome && (
        <button type="button" className="ob2-back-btn" onClick={onNavigateHome} aria-label="Go back home">
          <ArrowIcon direction="left" size={20} strokeWidth={2} />
        </button>
      )}

      <div className="ob2-role-container">
        <div className="ob2-role-top-section">
          <div className="ob2-role-header-group">
            <div className="ob2-role-logo">
              <svg width="34" height="25" viewBox="0 0 34 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.23453 17.8236H34.0002V24.4431H3.23453V21.1334V17.8236Z" fill="#0048B3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 17.8236H3.23453L0 16.1194H30.674L34.0002 17.8236Z" fill="#487DCD"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 17.8236V21.1334V24.4431L0 22.4737V16.1194L3.23453 17.8236Z" fill="#2F6BC4"/>
                <path d="M3.23453 9.87086H34.0002V16.4904H3.23453V9.87086Z" fill="#0048B3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 9.87086H3.23453L0 8.16666H30.674L34.0002 9.87086Z" fill="#487DCD"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 9.87086V16.4904L0 14.5209V8.16666L3.23453 9.87086Z" fill="#2F6BC4"/>
                <path d="M3.23453 1.7042H34.0002V8.3237H3.23453V1.7042Z" fill="#0048B3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 1.7042H3.23453L0 0H30.674L34.0002 1.7042Z" fill="#487DCD"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 1.7042V8.3237L0 6.35427V0L3.23453 1.7042Z" fill="#2F6BC4"/>
              </svg>
            </div>
            <div className="ob2-role-title-group">
              <h1 className="ob2-role-title">How can we help you?</h1>
              <p className="ob2-role-subtitle">Choose how you would like to use Jaradeck</p>
            </div>
          </div>

          <div className="ob2-role-card-group">
            <button
              className={`ob2-role-custom-card ${selectedRole === 'customer' ? 'ob2-role-custom-card-selected' : ''}`}
              onClick={() => setSelectedRole('customer')}
            >
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I need work done.</div>
                <div className="ob2-role-card-desc">
                  Hand off your projects and get finished results without the hiring hassle.
                </div>
              </div>
            </button>

            <button
              className={`ob2-role-custom-card ${selectedRole === 'worker' ? 'ob2-role-custom-card-selected' : ''}`}
              onClick={() => setSelectedRole('worker')}
            >
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I want to do work</div>
                <div className="ob2-role-card-desc">
                  Get matched directly with active projects and earn on your terms.
                </div>
              </div>
            </button>
          </div>
        </div>

      <div className="ob2-bottom-bar ob2-role-bottom-bar">
        <button
          type="button"
          className="ob2-cta-btn ob2-role-continue-btn"
          disabled={!selectedRole}
          onClick={() => onSelect(selectedRole)}
        >
          Sign up <ArrowIcon />
        </button>
        <div className="ob2-role-auth-switch">
          <span>Already on Jaradeck?</span>
          <button className="ob2-link-btn" onClick={() => onSelect('signin-only')}>Sign in</button>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: Auth — Sign In ───────────────────────────────────────────────────
function SignInStep({ onNext, onSwitchToSignUp, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = Boolean(email.trim() && password.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors;
      setError(errs.email?.[0] || errs.password?.[0] || 'Please check your details.');
      return;
    }
    setError('');
    onNext({ email, password });
  };

  return (
    <OBShell isSignIn={true} onAuthSwitch={onSwitchToSignUp} onBack={onBack}>
      <h1 className="ob2-title">Sign in to Jaradeck</h1>
      <p className="ob2-subtitle">Please enter your email address and password</p>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        <div className="ob2-field">
          <label className="ob2-label">Email address</label>
          <input
            type="email"
            className="ob2-input"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
          />
        </div>

        <div className="ob2-field">
          <label className="ob2-label">Password</label>
          <div className="ob2-input-row">
            <input
              type={showPass ? 'text' : 'password'}
              className="ob2-input ob2-input-pw"
              placeholder="example@gmail.com"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
            />
            <button type="button" className="ob2-eye-btn" onClick={() => setShowPass(!showPass)}>
              <EyeIcon visible={showPass} />
            </button>
          </div>
        </div>

        {error && <p className="ob2-error">{error}</p>}

        <button type="submit" className="ob2-cta-btn" disabled={!isFormValid}>
          Sign in <ArrowIcon />
        </button>
      </form>
    </OBShell>
  );
}

// ─── STEP 2: Auth — Sign Up ───────────────────────────────────────────────────
function SignUpStep({ onNext, onSwitchToSignIn, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = Boolean(email.trim() && password.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signUpSchema.safeParse({ email, password });
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors;
      setError(errs.email?.[0] || errs.password?.[0] || 'Please check your details.');
      return;
    }
    setError('');
    onNext({ email, password });
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSwitchToSignIn} onBack={onBack}>
      <h1 className="ob2-title">Welcome back!</h1>
      <p className="ob2-subtitle">Your password must have at least 8 characters including letters and a number.</p>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        <div className="ob2-field">
          <label className="ob2-label">Email address</label>
          <input
            type="email"
            className="ob2-input"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
          />
        </div>

        <div className="ob2-field">
          <label className="ob2-label">Password</label>
          <div className="ob2-input-row">
            <input
              type={showPass ? 'text' : 'password'}
              className="ob2-input ob2-input-pw"
              placeholder="example@gmail.com"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="new-password"
            />
            <button type="button" className="ob2-eye-btn" onClick={() => setShowPass(!showPass)}>
              <EyeIcon visible={showPass} />
            </button>
          </div>
        </div>

        {error && <p className="ob2-error">{error}</p>}

        <button type="submit" className="ob2-cta-btn" disabled={!isFormValid}>
          Continue <ArrowIcon />
        </button>
      </form>
    </OBShell>
  );
}

// ─── STEP 3: Profile Setup ────────────────────────────────────────────────────
// Customer: Full Name, Email, Password
// Worker:   Full Name, Email, Password + Portfolio Link
function ProfileStep({ role, onNext, onSignIn, onBack }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const isWorker = role === 'worker';

  const isFormValid = isWorker
    ? Boolean(fullName.trim() && email.trim() && password.trim() && phone.trim())
    : Boolean(fullName.trim() && email.trim() && password.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = profileSchema.safeParse({ fullName, email, password, ...(isWorker ? { portfolioLink } : {}) });
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors;
      setError(
        errs.fullName?.[0] || errs.email?.[0] || errs.password?.[0] || errs.portfolioLink?.[0] || 'Please check your details.'
      );
      return;
    }
    if (isWorker && !portfolioLink.trim()) { setError('Please add a link to your work samples.'); return; }
    setError('');
    onNext({ fullName, email, password, ...(isWorker && { portfolioLink }) });
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSignIn} onBack={onBack}>
      <h1 className="ob2-title">Let's set up your profile</h1>
      <p className="ob2-subtitle">
        Enter a few details so we can manage your projects and send updates.
      </p>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="ob2-field">
          <label className="ob2-label">Full Name</label>
          <input
            type="text"
            className="ob2-input"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setError(''); }}
            autoComplete="name"
          />
        </div>

        {/* Email Address */}
        <div className="ob2-field">
          <label className="ob2-label">Email Address</label>
          <div className="ob2-input-row">
            <input
              type="email"
              className="ob2-input ob2-input-pw"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              autoComplete="email"
            />
            {/* decorative eye icon placeholder to match design */}
            <span className="ob2-eye-btn" style={{ pointerEvents: 'none', opacity: 0.4 }}>
              <EyeIcon visible={false} />
            </span>
          </div>
        </div>

        {/* Password */}
        <div className="ob2-field">
          <label className="ob2-label">Password</label>
          <div className="ob2-input-row">
            <input
              type={showPass ? 'text' : 'password'}
              className="ob2-input ob2-input-pw"
              placeholder="example@gmail.com"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="new-password"
            />
            <button type="button" className="ob2-eye-btn" onClick={() => setShowPass(!showPass)}>
              <EyeIcon visible={showPass} />
            </button>
          </div>
        </div>

        {/* Portfolio link — Worker only */}
        {isWorker && (
          <div className="ob2-field">
            <label className="ob2-label">Portfolio Link</label>
            <input
              type="url"
              className="ob2-input"
              placeholder="link to your primary work samples"
              value={portfolioLink}
              onChange={(e) => { setPortfolioLink(e.target.value); setError(''); }}
              autoComplete="url"
            />
          </div>
        )}

        {error && <p className="ob2-error">{error}</p>}

        <button type="submit" className="ob2-cta-btn" disabled={!isFormValid}>
          Continue to Jaradeck <ArrowIcon />
        </button>
      </form>
    </OBShell>
  );
}

// ─── STEP 4: OTP Verification ─────────────────────────────────────────────────
// Customer → sent via Email
// Worker   → sent via SMS
function OTPStep({ role, onNext, onSignIn, onBack }) {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const isWorker = role === 'worker';

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError('');
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (digits.some(d => !d)) { setError('Please enter the full 6-digit code.'); return; }
    setError('');
    onNext();
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSignIn} onBack={onBack}>
      <h1 className="ob2-title">We just sent you a code</h1>
      <p className="ob2-subtitle">
        {isWorker
          ? "We've sent a 6-digit code to your phone number via SMS. Enter it below to verify if it's you"
          : "We've sent a 6-digit code to your email address. Enter it below to verify if it's you"}
      </p>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        {/* 6 individual digit boxes */}
        <div className="ob2-otp-row" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="ob2-otp-box"
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {error && <p className="ob2-error" style={{ textAlign: 'center' }}>{error}</p>}

        <p className="ob2-resend-text">
          Didn't receive a code?{' '}
          <button type="button" className="ob2-link-btn">Resend code</button>
        </p>

        <button type="submit" className="ob2-cta-btn" style={{ marginTop: '2rem' }}>
          Continue to Jaradeck <ArrowIcon />
        </button>
      </form>
    </OBShell>
  );
}

// ─── STEP 5: Success ──────────────────────────────────────────────────────────
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
// Customer Flow:
//   role → auth (signup) ↔ auth (signin) → profile → otp (email) → done
//
// Worker Flow:
//   role → auth (signup) ↔ auth (signin) → profile (+ phone) → otp (sms) → done
//
export default function OnboardingPage({ onNavigateHome, onNavigateDashboard }) {
  const [step, setStep] = useState('role');
  const [role, setLocalRole] = useState(null);
  const [authMode, setAuthMode] = useState('signup');
  const [profileData, setProfileData] = useState({});
  const { setRole } = useRole();

  const handleRoleSelect = (selected) => {
    if (selected === 'signin-only') {
      setLocalRole(null);
      setAuthMode('signin');
      setStep('auth');
      return;
    }
    setLocalRole(selected);
    setRole(selected);          // persist to context + sessionStorage
    setAuthMode('signup');
    setStep('auth');
  };

  // ── Auth → next ─────────────────────────────────────────────────
  const handleAuthNext = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
    setStep('profile');
  };

  // ── Profile → next ──────────────────────────────────────────────
  const handleProfileNext = (data) => {
    setProfileData(data);
    setStep('otp');
  };

  // ── OTP → done ──────────────────────────────────────────────────
  const handleOTPNext = () => setStep('done');

  const dashboardPath = localRole === 'customer' ? '/dashboard/customer' : '/dashboard';

  // ── Switch between sign-in / sign-up ────────────────────────────
  const switchToSignIn = () => { setAuthMode('signin'); setStep('auth'); };
  const switchToSignUp = () => { setAuthMode('signup'); setStep('auth'); };

  // ── Back Handlers ───────────────────────────────────────────────
  const goBackToRole = () => setStep('role');
  const goBackToAuth = () => setStep('auth');
  const goBackToProfile = () => setStep('profile');

  return (
    <>
      {step === 'role' && (
        <RoleSelectionStep onSelect={handleRoleSelect} onNavigateHome={onNavigateHome} />
      )}

      {step === 'auth' && authMode === 'signin' && (
        <SignInStep onNext={handleAuthNext} onSwitchToSignUp={switchToSignUp} onBack={goBackToRole} />
      )}

      {step === 'auth' && authMode === 'signup' && (
        <SignUpStep onNext={handleAuthNext} onSwitchToSignIn={switchToSignIn} onBack={goBackToRole} />
      )}

      {step === 'profile' && (
        <ProfileStep role={localRole} onNext={handleProfileNext} onSignIn={switchToSignIn} onBack={goBackToAuth} />
      )}

      {step === 'otp' && (
        <OTPStep role={localRole} onNext={handleOTPNext} onSignIn={switchToSignIn} onBack={goBackToProfile} />
      )}

      {step === 'done' && (
        <SuccessStep onNavigateDashboard={() => onNavigateDashboard(dashboardPath)} />
      )}
    </>
  );
}
