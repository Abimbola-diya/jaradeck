import React, { useState } from 'react';
import OBShell from './OBShell';
import EyeIcon from './EyeIcon';
import ArrowIcon from '../ArrowIcon';
import { validateEmail, validatePassword, validateFullName, validatePhone } from '../../utils/validation';

export default function ProfileStep({ role, onNext, onSignIn, onBack }) {
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
    
    const nameCheck = validateFullName(fullName);
    if (!nameCheck.isValid) { setError(nameCheck.error); return; }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { setError(emailCheck.error); return; }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) { setError(passwordCheck.error); return; }

    if (!country.trim()) { setError('Please select your country.'); return; }
    
    if (isWorker) {
      const phoneCheck = validatePhone(phone);
      if (!phoneCheck.isValid) { setError(phoneCheck.error); return; }
    }

    setError('');
    onNext({ fullName, email, password, country, ...(isWorker && { phone }) });
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSignIn} onBack={onBack} hideBack={true}>
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
