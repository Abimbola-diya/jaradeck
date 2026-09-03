import React, { useState } from 'react';
import GooglePillButton from './GooglePillButton';
import OBShell from './OBShell';
import ArrowRight02Icon from '../ArrowRight02Icon';
import { validateEmail } from '../../utils/validation';

import { API_BASE_URL } from '../../lib/api';

export default function SignInStep({ onNext, onSwitchToSignUp, onBack }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isFormValid = Boolean(email.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { setError(emailCheck.error); return; }

    setError('');
    onNext({ email });
  };

  return (
    <OBShell isSignIn={true} onAuthSwitch={onSwitchToSignUp} onBack={onBack}>
      <h1 className="ob2-title">Welcome back!</h1>

      <div style={{ width: '100%' }}>
        <GooglePillButton
          role="customer"
          text="Continue with Google"
          onGoogleSuccess={(userData) => onNext(userData)}
          onError={(err) => setError(err)}
        />
      </div>

      <div className="ob2-or-divider">
        <span className="ob2-or-text">OR</span>
        <div className="ob2-or-line" />
      </div>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        <div className="ob2-field">
          <input
            type="email"
            className="ob2-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
          />
        </div>

        {error && <p className="ob2-error">{error}</p>}

        <button type="submit" className="ob2-cta-btn" disabled={!isFormValid}>
          Log In <ArrowRight02Icon size={18} />
        </button>
      </form>
    </OBShell>
  );
}
