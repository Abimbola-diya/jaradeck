import React, { useState, useRef } from 'react';

// ─── Shared SVG Icons ────────────────────────────────────────────────────────

function JaradeckLogoBlue({ size = 40 }) {
  const h = Math.round(size * (310 / 434));
  return (
    <svg width={size} height={h} viewBox="0 0 434 310" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M41.2752 225.44H433.87V309.91H41.2752V225.44Z" fill="#0048B3" />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 225.44H41.2752L0 203.693H391.426L433.87 225.44Z" fill="#00388D" />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 225.44V309.91L0 284.779V203.693L41.2752 225.44Z" fill="#0048B3" />
      <path d="M41.2752 123.953H433.87V208.423H41.2752V123.953Z" fill="#0048B3" />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 123.953H41.2752L0 102.206H391.426L433.87 123.953Z" fill="#00388D" />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 123.953V208.423L0 183.291V102.206L41.2752 123.953Z" fill="#0048B3" />
      <path d="M41.2752 21.7469H433.87V106.217H41.2752V21.7469Z" fill="#0048B3" />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 21.7469H41.2752L0 0H391.426L433.87 21.7469Z" fill="#00388D" />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 21.7469V106.217L0 81.0853V0L41.2752 21.7469Z" fill="#0048B3" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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
// isSignIn=true  → "New to Jaradeck? Sign up"
// isSignIn=false → "Already on Jaradeck? Sign in"
function OBShell({ children, isSignIn = false, onAuthSwitch, onBack, hideBack = false }) {
  return (
    <div className="ob2-page">
      {/* Top Left Back Button */}
      {!hideBack && onBack && (
        <button type="button" className="ob2-back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft />
        </button>
      )}
      {/* Logo — centered at top */}
      <div className="ob2-logo-wrap">
        <JaradeckLogoBlue size={42} />
      </div>

      {/* Main content area */}
      <div className="ob2-content">
        {children}
      </div>

      {/* Bottom auth switch */}
      <div className="ob2-bottom-bar">
        {isSignIn ? (
          <>
            <span>New to Jaradeck?</span>
            <button className="ob2-link-btn" onClick={onAuthSwitch}>Sign up</button>
          </>
        ) : (
          <>
            <span>Already on Jaradeck?</span>
            <button className="ob2-link-btn" onClick={onAuthSwitch}>Sign in</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── STEP 1: Role Selection ───────────────────────────────────────────────────
function RoleSelectionStep({ onSelect, onNavigateHome }) {
  return (
    <div className="ob2-page">
      {onNavigateHome && (
        <button type="button" className="ob2-back-btn" onClick={onNavigateHome} aria-label="Go back home">
          <ArrowLeft />
        </button>
      )}
      <div className="ob2-logo-wrap">
        <JaradeckLogoBlue size={42} />
      </div>

      <div className="ob2-content">
        <h1 className="ob2-title">How can we help you?</h1>
        <p className="ob2-subtitle">Choose how you would like to use Jaradeck</p>

        <div className="ob2-role-list">
          <button
            className="ob2-role-card"
            onClick={() => onSelect('customer')}
          >
            <span className="ob2-role-icon"><BriefcaseIcon /></span>
            <div className="ob2-role-text">
              <div className="ob2-role-label">I need work done.</div>
              <div className="ob2-role-desc">
                Hand off your projects and get finished results without the hiring hassle.
              </div>
            </div>
          </button>

          {/* Worker card */}
          <button
            className="ob2-role-card"
            onClick={() => onSelect('worker')}
          >
            <span className="ob2-role-icon"><ToolsIcon /></span>
            <div className="ob2-role-text">
              <div className="ob2-role-label">I want to do work</div>
              <div className="ob2-role-desc">
                Get matched directly with active projects and earn on your terms.
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="ob2-bottom-bar">
        <span>Already on Jaradeck?</span>
        <button className="ob2-link-btn" onClick={() => onSelect('signin-only')}>Sign up</button>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
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

        <button type="submit" className="ob2-cta-btn">
          Sign in <ArrowRight />
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

        <button type="submit" className="ob2-cta-btn">
          Continue <ArrowRight />
        </button>
      </form>
    </OBShell>
  );
}

// ─── STEP 3: Profile Setup ────────────────────────────────────────────────────
// Customer: Full Name, Email, Password
// Worker:   Full Name, Email, Password + Phone Number (for SMS OTP)
function ProfileStep({ role, onNext, onSignIn, onBack }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const isWorker = role === 'worker';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (isWorker && !phone.trim()) { setError('Please enter your phone number.'); return; }
    setError('');
    onNext({ fullName, email, password, ...(isWorker && { phone }) });
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

        {/* Phone Number — Worker only (required for SMS OTP) */}
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

        <button type="submit" className="ob2-cta-btn">
          Continue to Jaradeck <ArrowRight />
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
          Continue to Jaradeck <ArrowRight />
        </button>
      </form>
    </OBShell>
  );
}

// ─── STEP 5: Success ──────────────────────────────────────────────────────────
function SuccessStep({ role, profileData, onNavigateHome }) {
  return (
    <div className="ob2-page ob2-page-success">
      <div className="ob2-logo-wrap">
        <JaradeckLogoBlue size={42} />
      </div>
      <div className="ob2-content ob2-content-centered">
        <div className="ob2-success-check">✓</div>
        <h1 className="ob2-title" style={{ textAlign: 'center' }}>
          You're all set{profileData?.fullName ? `, ${profileData.fullName.split(' ')[0]}` : ''}!
        </h1>
        <p className="ob2-subtitle" style={{ textAlign: 'center' }}>
          {role === 'customer'
            ? 'Your account is ready. Start your first project and get matched in seconds.'
            : "Your worker profile is live. We'll start matching you with projects right away."}
        </p>
        <button className="ob2-cta-btn" style={{ marginTop: '1.5rem' }} onClick={onNavigateHome}>
          Back to Home <ArrowRight />
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
export default function OnboardingPage({ onNavigateHome }) {
  const [step, setStep] = useState('role');
  const [role, setRole] = useState(null);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'
  const [profileData, setProfileData] = useState({});

  // ── Role selection ──────────────────────────────────────────────
  const handleRoleSelect = (selected) => {
    if (selected === 'signin-only') {
      setRole(null);
      setAuthMode('signin');
      setStep('auth');
      return;
    }
    setRole(selected);
    setAuthMode('signup');
    setStep('auth');   // both customer & worker go to auth first
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
        <ProfileStep role={role} onNext={handleProfileNext} onSignIn={switchToSignIn} onBack={goBackToAuth} />
      )}

      {step === 'otp' && (
        <OTPStep role={role} onNext={handleOTPNext} onSignIn={switchToSignIn} onBack={goBackToProfile} />
      )}

      {step === 'done' && (
        <SuccessStep role={role} profileData={profileData} onNavigateHome={onNavigateHome} />
      )}
    </>
  );
}
