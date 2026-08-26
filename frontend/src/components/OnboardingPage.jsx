import React, { useState, useRef, useEffect } from 'react';
import { Briefcase01Icon, UserAccountIcon } from 'hugeicons-react';
import { GoogleLogin } from '@react-oauth/google';
import ArrowLeft02Icon from './ArrowLeft02Icon';
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

// ─── Shared Layout Shell ──────────────────────────────────────────────────────
function OBShell({ children, isSignIn = false, onAuthSwitch, onBack, hideBack = false }) {
  return (
    <div className="ob2-page">
      {/* Top Left Back Button */}
      {!hideBack && onBack && (
        <button type="button" className="ob2-back-btn ob2-anim-back" onClick={onBack} aria-label="Go back">
          <ArrowLeft02Icon size={20} />
        </button>
      )}
      {/* Logo — centered at top */}
      <div className="ob2-logo-wrap ob2-anim-logo">
        <BrandLogo width={34} height={25} tone="blue" />
      </div>

      {/* Main content area */}
      <div className="ob2-content ob2-anim-form">
        {children}

        {/* Bottom auth switch placed inline directly below CTA button */}
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
              <div className="ob2-role-card-icon">
                <Briefcase01Icon size={26} />
              </div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I need work done.</div>
                <div className="ob2-role-card-desc">
                  Hand off your projects and get finished results without the hiring hassle.
                </div>
              </div>
            </button>

            <button
              type="button"
              className={`ob2-role-custom-card ob2-anim-card-2 ${selectedRole === 'worker' ? 'ob2-role-custom-card-selected' : ''}`}
              onClick={() => setSelectedRole('worker')}
            >
              <div className="ob2-role-card-icon">
                <UserAccountIcon size={26} />
              </div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I want to do work</div>
                <div className="ob2-role-card-desc">
                  Get matched directly with active projects and earn on your terms.
                </div>
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
          <div className="ob2-role-signup-text">
            Already on Jaradeck? <button className="ob2-role-link" onClick={() => onSelect('signin-only')}>Sign in</button>
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
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setError('');
    onNext({ email, password });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role: 'customer'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Google Sign-In failed');
        return;
      }
      localStorage.setItem('jaradeck_token', data.access_token);
      localStorage.setItem('jaradeck_user', JSON.stringify(data.user));
      onNext(data.user);
    } catch (err) {
      setError('Could not connect to backend authentication server.');
    }
  };

  return (
    <OBShell isSignIn={true} onAuthSwitch={onSwitchToSignUp} onBack={onBack}>
      <h1 className="ob2-title">Sign in to Jaradeck</h1>
      <p className="ob2-subtitle">Please enter your email address and password</p>

      <div style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Sign-In was cancelled or failed.')}
          theme="outline"
          shape="pill"
          size="large"
          width="100%"
        />
      </div>

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
              placeholder="Password"
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
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
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
              placeholder="Password"
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
function ProfileStep({ role, onNext, onSignIn, onBack }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const isWorker = role === 'worker';

  const isFormValid = isWorker
    ? Boolean(fullName.trim() && email.trim() && password.trim() && country.trim() && phone.trim())
    : Boolean(fullName.trim() && email.trim() && password.trim() && country.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!country.trim()) { setError('Please select your country.'); return; }
    if (isWorker && !phone.trim()) { setError('Please enter your phone number.'); return; }
    setError('');
    onNext({ fullName, email, password, country, ...(isWorker && { phone }) });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role: role || 'customer'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Google Sign-In failed');
        return;
      }
      localStorage.setItem('jaradeck_token', data.access_token);
      localStorage.setItem('jaradeck_user', JSON.stringify(data.user));
      onNext(data.user);
    } catch (err) {
      setError('Could not connect to backend authentication server.');
    }
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSignIn} onBack={onBack}>
      <h1 className="ob2-title">Let's set up your profile</h1>
      <p className="ob2-subtitle">
        Enter a few details so we can manage your projects and send updates.
      </p>

      <div style={{ width: '100%', marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Sign-In was cancelled or failed.')}
          theme="outline"
          shape="pill"
          size="large"
          width="100%"
        />
      </div>

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
          <input
            type="email"
            className="ob2-input"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="ob2-field">
          <label className="ob2-label">Password</label>
          <div className="ob2-input-row">
            <input
              type={showPass ? 'text' : 'password'}
              className="ob2-input ob2-input-pw"
              placeholder="Password (8 or more characters)"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="new-password"
            />
            <button type="button" className="ob2-eye-btn" onClick={() => setShowPass(!showPass)}>
              <EyeIcon visible={showPass} />
            </button>
          </div>
        </div>

        {/* Country */}
        <div className="ob2-field">
          <label className="ob2-label">Country</label>
          <div className="ob2-select-wrapper">
            <select
              className="ob2-select"
              value={country}
              onChange={(e) => { setCountry(e.target.value); setError(''); }}
            >
              <option value="Nigeria">Nigeria</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
              <option value="South Africa">South Africa</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Egypt">Egypt</option>
            </select>
            <svg className="ob2-select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {/* Phone Number — Worker only */}
        {isWorker && (
          <div className="ob2-field">
            <label className="ob2-label">Phone Number</label>
            <input
              type="tel"
              className="ob2-input"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              autoComplete="tel"
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

  // ── Auth → next ─────────────────────────────────────────────────
  const handleAuthNext = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
    goToStep('profile');
  };

  // ── Profile → next ──────────────────────────────────────────────
  const handleProfileNext = (data) => {
    setProfileData(data);
    goToStep('otp');
  };

  // ── OTP → done ──────────────────────────────────────────────────
  const handleOTPNext = () => goToStep('done');

  // ── Switch between sign-in / sign-up ────────────────────────────
  const switchToSignIn = () => { setAuthMode('signin'); goToStep('auth'); };
  const switchToSignUp = () => { setAuthMode('signup'); goToStep('profile'); };

  return (
    <>
      {step === 'role' && (
        <RoleSelectionStep key="role" onSelect={handleRoleSelect} onNavigateHome={onNavigateHome} />
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
