import React, { useState } from 'react';
import OBShell from './OBShell';
import EyeIcon from './EyeIcon';
import ArrowRight02Icon from '../ArrowRight02Icon';
import { validateEmail, validatePassword } from '../../utils/validation';

export default function SignUpStep({ onNext, onSwitchToSignIn, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = Boolean(email.trim() && password.trim());

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { setError(emailCheck.error); return; }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) { setError(passwordCheck.error); return; }

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
          Continue <ArrowRight02Icon size={18} />
        </button>
      </form>
    </OBShell>
  );
}
