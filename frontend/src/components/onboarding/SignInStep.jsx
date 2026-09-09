import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import OBShell from './OBShell';
import ArrowRight02Icon from '../ArrowRight02Icon';
import CrownIcon from '../CrownIcon';
import { API_BASE_URL } from '../../lib/api';

const RESEND_COOLDOWN = 60;

function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function fmtError(detail, fallback = 'Something went wrong. Please try again.') {
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

// ── Step A: email input ───────────────────────────────────────────────────────
function EmailForm({ onOTPSent, onSwitchToSignUp, onBack }) {
  const [email, setEmail]           = useState('');
  const [error, setError]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(fmtError(data.detail, 'Could not send code. Please try again.')); return; }
      onOTPSent(email.trim().toLowerCase());
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OBShell isSignIn={true} onAuthSwitch={onSwitchToSignUp} onBack={onBack}>
      <h1 className="ob2-title">
        <span className="jd-title-w-anchor">
          W<CrownIcon size={50} color="#0048B3" className="jd-signup-title-crown-inline" />
        </span>
        elcome back!
      </h1>
      <p className="ob2-subtitle">Good to see you again. We&apos;ll send a code to your email.</p>

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

        {error && <p className="ob2-error">{error}</p>}

        <button type="submit" className="ob2-cta-btn" disabled={!email.trim() || isSubmitting}>
          {isSubmitting ? 'Sending code…' : <>Log In <ArrowRight02Icon size={18} /></>}
        </button>
      </form>
    </OBShell>
  );
}

// ── Step B: OTP verification ──────────────────────────────────────────────────
function OTPForm({ email, onVerified, onSwitchToSignUp, onBack }) {
  const [digits, setDigits]             = useState(Array(6).fill(''));
  const [error, setError]               = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const [cooldown, setCooldown]         = useState(RESEND_COOLDOWN);
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
        setError(fmtError(data.detail, 'Verification failed. Please check your code.'));
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
      const res = await fetch(`${API_BASE_URL}/api/auth/login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setResendStatus('error'); setError(fmtError(data.detail, 'Failed to resend. Please try again.')); return; }
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

  return (
    <OBShell isSignIn={true} onAuthSwitch={onSwitchToSignUp} onBack={onBack} hideBack={true} align="left">
      <h1 className="ob2-title ob2-otp-title">We just sent you an OTP</h1>
      <p className="ob2-subtitle ob2-otp-subtitle">
        We sent a 6-digit code to <strong>{maskEmail(email)}</strong>. Enter it below to sign in.
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

        <button type="submit" className="ob2-cta-btn ob2-otp-cta-btn" style={{ marginTop: '52px' }} disabled={!digits.every(d => d) || isLoading}>
          {isLoading ? 'Verifying…' : <>Continue to Jaradeck <ArrowRight02Icon size={18} /></>}
        </button>
      </form>
    </OBShell>
  );
}

// ── Orchestrator ──────────────────────────────────────────────────────────────
export default function SignInStep({ onVerified, onSwitchToSignUp, onBack }) {
  const [step, setStep]               = useState('email');
  const [pendingEmail, setPendingEmail] = useState('');

  if (step === 'otp') {
    return (
      <OTPForm
        email={pendingEmail}
        onVerified={onVerified}
        onSwitchToSignUp={onSwitchToSignUp}
        onBack={() => setStep('email')}
      />
    );
  }

  return (
    <EmailForm
      onOTPSent={(email) => { setPendingEmail(email); setStep('otp'); }}
      onSwitchToSignUp={onSwitchToSignUp}
      onBack={onBack}
    />
  );
}

SignInStep.propTypes = {
  onVerified: PropTypes.func.isRequired,
  onSwitchToSignUp: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

EmailForm.propTypes = {
  onOTPSent: PropTypes.func.isRequired,
  onSwitchToSignUp: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

OTPForm.propTypes = {
  email: PropTypes.string.isRequired,
  onVerified: PropTypes.func.isRequired,
  onSwitchToSignUp: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};
