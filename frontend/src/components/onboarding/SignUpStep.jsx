import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import OBShell from './OBShell';
import ArrowRight02Icon from '../ArrowRight02Icon';
import { validateEmail } from '../../utils/validation';
import { API_BASE_URL } from '../../lib/api';

const RESEND_COOLDOWN = 60;

function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function formatError(detail, fallback = 'Something went wrong. Please try again.') {
  if (!detail) return fallback;
  if (typeof detail === 'string') {
    if (detail.includes('Database error') || detail.includes('violates') || detail.startsWith('{')) return fallback;
    return detail;
  }
  if (typeof detail === 'object') {
    if (typeof detail.message === 'string') return detail.message;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }
  return fallback;
}

// ── Step 1: Registration form ─────────────────────────────────────────────────
function RegisterForm({ onOTPSent, onSwitchToSignIn, onBack }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [error, setError]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = Boolean(firstName.trim() && lastName.trim() && email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) { setError('Please enter your first name.'); return; }
    if (!lastName.trim())  { setError('Please enter your last name.'); return; }
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { setError(emailCheck.error); return; }

    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          full_name:  `${firstName.trim()} ${lastName.trim()}`,
          email:      email.trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(formatError(data.detail, 'Registration failed. Please try again.')); return; }
      onOTPSent(email.trim().toLowerCase(), firstName.trim());
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSwitchToSignIn} onBack={onBack}>
      <h1 className="ob2-title">Create your account</h1>
      <p className="ob2-subtitle">We&apos;ll send a 6-digit code to verify your email.</p>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        <div className="ob2-field-row">
          <div className="ob2-field">
            <label className="ob2-label">First name</label>
            <input
              type="text"
              className="ob2-input"
              placeholder="Lagbaja"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setError(''); }}
              autoComplete="given-name"
            />
          </div>
          <div className="ob2-field">
            <label className="ob2-label">Last name</label>
            <input
              type="text"
              className="ob2-input"
              placeholder="Tamedo"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setError(''); }}
              autoComplete="family-name"
            />
          </div>
        </div>

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

        {error && <p className="ob2-error">{error}</p>}

        <button type="submit" className="ob2-cta-btn" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Sending code…' : <> Continue <ArrowRight02Icon size={18} /> </>}
        </button>
      </form>
    </OBShell>
  );
}

RegisterForm.propTypes = {
  onOTPSent: PropTypes.func.isRequired,
  onSwitchToSignIn: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

// ── Step 2: OTP verification ──────────────────────────────────────────────────
function OTPVerifyForm({ email, firstName, onVerified, onSwitchToSignIn, onBack }) {
  const [digits, setDigits]           = useState(Array(6).fill(''));
  const [error, setError]             = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [cooldown, setCooldown]       = useState(RESEND_COOLDOWN);
  const [resendStatus, setResendStatus] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[idx] = val; setDigits(next); setError('');
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (digits.some(d => !d)) { setError('Please enter the full 6-digit code.'); return; }
    setIsLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: digits.join('') }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(formatError(data.detail, 'Verification failed. Please check your code.'));
        if (res.status === 400) { setDigits(Array(6).fill('')); inputRefs.current[0]?.focus(); }
        return;
      }
      localStorage.setItem('jaradeck_token', data.access_token);
      localStorage.setItem('jaradeck_user', JSON.stringify(data.user));
      onVerified(data);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendStatus === 'sending') return;
    setResendStatus('sending'); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setResendStatus('error'); setError(formatError(data.detail, 'Failed to resend. Please try again.')); return; }
      setResendStatus('sent');
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      setTimeout(() => setResendStatus(''), 3000);
    } catch {
      setResendStatus('error');
      setError('Network error. Please try again.');
    }
  };

  const isComplete = digits.every(d => d !== '');

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSwitchToSignIn} onBack={onBack} hideBack={true} align="left">
      <h1 className="ob2-title ob2-otp-title">
        Check your email{firstName ? `, ${firstName}` : ''}
      </h1>
      <p className="ob2-subtitle ob2-otp-subtitle">
        We sent a 6-digit code to <strong>{maskEmail(email)}</strong>. Enter it below to verify your account.
      </p>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        <div className="ob2-otp-row" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              className={`ob2-otp-box${d ? ' ob2-otp-box--filled' : ''}${error ? ' ob2-otp-box--error' : ''}`}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1} of 6`}
              disabled={isLoading}
            />
          ))}
        </div>

        {error && <p className="ob2-error" role="alert">{error}</p>}

        <p className="ob2-resend-text">
          {resendStatus === 'sent' ? (
            <span style={{ color: '#16a34a', fontWeight: 500 }}>✓ New code sent!</span>
          ) : (
            <>
              Didn&apos;t receive a code?{' '}
              {cooldown > 0
                ? <span className="ob2-resend-countdown">Resend in {cooldown}s</span>
                : <button type="button" className="ob2-link-btn" onClick={handleResend} disabled={resendStatus === 'sending'}>{resendStatus === 'sending' ? 'Sending…' : 'Resend code'}</button>
              }
            </>
          )}
        </p>

        <button type="submit" className="ob2-cta-btn ob2-otp-cta-btn" style={{ marginTop: '52px' }} disabled={!isComplete || isLoading}>
          {isLoading ? 'Verifying…' : <> Continue to Jaradeck <ArrowRight02Icon size={18} /> </>}
        </button>
      </form>
    </OBShell>
  );
}

OTPVerifyForm.propTypes = {
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  onVerified: PropTypes.func.isRequired,
  onSwitchToSignIn: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

// ── Orchestrator ──────────────────────────────────────────────────────────────
export default function SignUpStep({ onVerified, onSwitchToSignIn, onBack }) {
  const [step, setStep]                         = useState('form');
  const [pendingEmail, setPendingEmail]         = useState('');
  const [pendingFirstName, setPendingFirstName] = useState('');

  const handleOTPSent = (email, firstName) => {
    setPendingEmail(email);
    setPendingFirstName(firstName);
    setStep('otp');
  };

  if (step === 'otp') {
    return (
      <OTPVerifyForm
        email={pendingEmail}
        firstName={pendingFirstName}
        onVerified={onVerified}
        onSwitchToSignIn={onSwitchToSignIn}
        onBack={() => setStep('form')}
      />
    );
  }

  return (
    <RegisterForm
      onOTPSent={handleOTPSent}
      onSwitchToSignIn={onSwitchToSignIn}
      onBack={onBack}
    />
  );
}

SignUpStep.propTypes = {
  onVerified: PropTypes.func.isRequired,
  onSwitchToSignIn: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};
