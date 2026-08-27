import React, { useState } from 'react';
import { motion } from 'motion/react';
import EyeIcon from './onboarding/EyeIcon';
import BrandLogo from './BrandLogo';

export default function SignupModalCard({
  onClose,
  onSwitchToLogin,
  onGoogleSuccess,
  onFormSubmit,
  triggerOrigin,
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  // Compute CSS transform-origin relative to the modal card
  const transformOrigin = (() => {
    if (!triggerOrigin) return '85% 0px';
    const modalWidth = Math.min(530, window.innerWidth - 32);
    const modalHeight = 560; // approximate height of modal
    const modalLeft = (window.innerWidth - modalWidth) / 2;
    const modalTop = Math.max(20, (window.innerHeight - modalHeight) / 2);
    const relX = triggerOrigin.x - modalLeft;
    const relY = triggerOrigin.y - modalTop;
    return `${relX}px ${relY}px`;
  })();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 180);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    if (onFormSubmit) {
      onFormSubmit({ fullName, email, password });
    }
  };

  const handleGoogleClick = () => {
    if (onGoogleSuccess) {
      onGoogleSuccess();
    }
  };

  const isFormValid = Boolean(fullName.trim() && email.trim() && password.trim());

  return (
    <motion.div
      className="jd-signup-modal-overlay"
      onClick={handleClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <motion.div
        className="jd-signup-modal-card"
        style={{ transformOrigin }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
        initial={{ opacity: 0, scale: 0.05 }}
        animate={
          isClosing
            ? { opacity: 0, scale: 0.05 }
            : { opacity: 1, scale: 1 }
        }
        transition={
          isClosing
            ? { duration: 0.16, ease: [0.4, 0, 1, 1] }
            : {
                type: 'spring',
                stiffness: 420,
                damping: 30,
                mass: 0.5,
              }
        }
      >
        {/* Close Button */}
        <button
          type="button"
          className="jd-signup-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Title with BrandLogo */}
        <div className="jd-signup-title-container">
          <BrandLogo width={28} tone="blue" />
          <h2 id="signup-modal-title" className="jd-signup-title">
            Sign up to Jaradeck
          </h2>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          className="jd-google-blue-btn"
          onClick={handleGoogleClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="jd-signup-divider">
          <span className="jd-signup-divider-line"></span>
          <span className="jd-signup-divider-text">or sign up below</span>
          <span className="jd-signup-divider-line"></span>
        </div>

        {/* Form Fields */}
        <form className="jd-signup-form" onSubmit={handleSubmit} noValidate>
          <div className="jd-signup-field">
            <input
              type="text"
              className="jd-signup-input"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="jd-signup-field">
            <input
              type="email"
              className="jd-signup-input"
              placeholder="name@work-email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="jd-signup-field jd-signup-field-password">
            <input
              type={showPassword ? 'text' : 'password'}
              className="jd-signup-input"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
            />
            <button
              type="button"
              className="jd-signup-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={showPassword} stroke="#64748B" />
            </button>
          </div>

          {error && <div className="jd-signup-error-msg">{error}</div>}

          {/* Continue CTA Button */}
          <button
            type="submit"
            className="jd-signup-continue-btn"
            disabled={!isFormValid}
          >
            Continue
          </button>
        </form>

        {/* Footer Login Link */}
        <div className="jd-signup-footer">
          Already using Jaradeck?{' '}
          <button
            type="button"
            className="jd-signup-login-link"
            onClick={onSwitchToLogin}
          >
            Log in
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
