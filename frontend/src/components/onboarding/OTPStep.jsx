import React, { useState, useRef } from 'react';
import OBShell from './OBShell';
import ArrowIcon from '../ArrowIcon';

export default function OTPStep({ role, onNext, onSignIn, onBack }) {
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
