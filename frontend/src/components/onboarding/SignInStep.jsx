import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import OBShell from './OBShell';
import EyeIcon from './EyeIcon';
import ArrowRight02Icon from '../ArrowRight02Icon';
import { validateEmail } from '../../utils/validation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function SignInStep({ onNext, onSwitchToSignUp, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = Boolean(email.trim() && password.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { setError(emailCheck.error); return; }

    if (!password) { setError('Please enter your password.'); return; }
    
    setError('');
    onNext({ email, password });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
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
          Sign in <ArrowRight02Icon size={18} />
        </button>
      </form>
    </OBShell>
  );
}
