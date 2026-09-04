import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import BrandLogo from './BrandLogo';
import CrownIcon from './CrownIcon';
import { Cancel01Icon } from './ui/cancel-01';
import ArrowRight02Icon from './ArrowRight02Icon';

import { API_BASE_URL } from '../lib/api';

// Decode a Google JWT (ID token) without verifying signature — frontend-only display use
function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatErrorMessage(detail, fallback = 'An unexpected error occurred. Please try again.') {
  if (!detail) return fallback;
  if (typeof detail === 'string') {
    if (detail.startsWith('{') || detail.includes('Database error') || detail.includes('Failing row contains') || detail.includes('violates')) {
      return fallback;
    }
    return detail;
  }
  if (typeof detail === 'object') {
    if (typeof detail.message === 'string') return detail.message;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }
  return fallback;
}

export default function SignupModalCard({
  onClose,
  onSwitchToLogin,
  onGoogleSuccess,
  onOTPRequired,
  triggerOrigin,
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google account hint — populated either from localStorage (previous sign-in)
  // or from One Tap silent detection
  const [googleHint, setGoogleHint] = useState(() => {
    try {
      const raw = localStorage.getItem('jaradeck_user');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Only trust records with a real backend ID from Google auth
      if (!parsed?.id || parsed?.auth_provider !== 'google') {
        localStorage.removeItem('jaradeck_user');
        return null;
      }
      return {
        name: parsed.full_name || parsed.name || '',
        email: parsed.email || '',
        picture: parsed.picture || parsed.avatar_url || null,
        fromBackend: true,
        backendUser: parsed,
      };
    } catch {
      return null;
    }
  });

  // One Tap: silently detect signed-in Google account to pre-fill the pill
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      const payload = decodeJwt(credentialResponse.credential);
      if (payload && !googleHint?.fromBackend) {
        setGoogleHint({
          name: payload.name || '',
          email: payload.email || '',
          picture: payload.picture || null,
          fromBackend: false,
          credential: credentialResponse.credential,
        });
      }
    },
    onError: () => {
      // Silently ignore — One Tap failure just means no hint available
    },
    cancel_on_tap_outside: true,
    disabled: Boolean(googleHint?.fromBackend), // skip if we already have backend data
  });

  const hasSavedUser = Boolean(googleHint && (googleHint.name || googleHint.email));
  const displayName = googleHint?.name || '';
  const hintFirstName = displayName ? displayName.split(' ')[0] : '';
  const displayEmail = googleHint?.email || '';
  // Only allow https:// picture URLs to prevent javascript: or data: injection
  const rawPicture = googleHint?.picture || null;
  const displayPicture = rawPicture && rawPicture.startsWith('https://') ? rawPicture : null;

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 640);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // Authenticate with backend using either access_token (popup) or credential (One Tap JWT)
  const authenticateWithBackend = async ({ access_token, credential }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token, credential, role: 'customer' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Google Sign-In failed. Please try again.');
    return data;
  };

  // Shared helper — saves auth data and updates Google hint state after any Google auth path
  const finalizeGoogleAuth = (data) => {
    localStorage.setItem('jaradeck_token', data.access_token);
    localStorage.setItem('jaradeck_user', JSON.stringify(data.user));
    setGoogleHint({
      name: data.user.full_name || data.user.name || '',
      email: data.user.email || '',
      picture: data.user.picture || data.user.avatar_url || null,
      fromBackend: true,
      backendUser: data.user,
    });
    if (onGoogleSuccess) onGoogleSuccess(data);
  };

  const googleLogin = useGoogleLogin({
    prompt: 'select_account',
    hint: googleHint?.email || undefined,
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError('');
      try {
        const data = await authenticateWithBackend({ access_token: tokenResponse.access_token });
        finalizeGoogleAuth(data);
      } catch (err) {
        setError(err.message || 'Network error connecting to authentication server.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => setError('Google Sign-In was cancelled or failed.')
  });

  const handleGoogleButtonClick = async () => {
    // If the hint came from One Tap (we have the credential), use it directly
    if (googleHint && !googleHint.fromBackend && googleHint.credential) {
      setIsGoogleLoading(true);
      setError('');
      try {
        const data = await authenticateWithBackend({ credential: googleHint.credential });
        finalizeGoogleAuth(data);
      } catch (err) {
        setError(err.message || 'Network error connecting to authentication server.');
      } finally {
        setIsGoogleLoading(false);
      }
      return;
    }
    // Otherwise open the Google popup
    googleLogin();
  };

  // Compute CSS transform-origin relative to the modal card
  const transformOrigin = (() => {
    if (!triggerOrigin) return '85% 20px';
    const modalWidth = Math.min(530, window.innerWidth - 32);
    const modalHeight = 560; // approximate height of modal
    const modalLeft = (window.innerWidth - modalWidth) / 2;
    const modalTop = Math.max(20, (window.innerHeight - modalHeight) / 2);
    const originX = triggerOrigin.x - modalLeft;
    const originY = triggerOrigin.y - modalTop;
    return `${originX}px ${originY}px`;
  })();

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      setError('Please enter your last name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const combinedFullName = `${firstName.trim()} ${lastName.trim()}`;
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: combinedFullName,
          email: email.trim().toLowerCase(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(formatErrorMessage(data.detail, 'Registration failed. Please try again.'));
        return;
      }

      // Success — hand off to OTP step
      if (onOTPRequired) {
        onOTPRequired(email.trim().toLowerCase());
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(firstName.trim() && lastName.trim() && email.trim());

  return (
    <motion.div
      className="jd-signup-modal-overlay"
      onClick={handleClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onAnimationComplete={() => {
        if (isClosing) onClose();
      }}
      style={{ willChange: 'opacity' }}
    >
      <motion.div
        className="jd-signup-modal-card"
        style={{
          transformOrigin: isMobile ? '50% 50%' : transformOrigin,
          willChange: 'transform, opacity',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
        initial={isMobile ? { opacity: 0, scale: 0.97 } : { opacity: 0, scale: 0.15 }}
        animate={{
          opacity: isClosing ? 0 : 1,
          scale: isClosing ? (isMobile ? 0.97 : 0.15) : 1,
        }}
        transition={
          isMobile
            ? { duration: 0.18, ease: 'easeOut' }
            : (isClosing
                ? { duration: 0.16, ease: [0.4, 0, 1, 1] }
                : {
                    type: 'spring',
                    stiffness: 380,
                    damping: 26,
                    mass: 0.5,
                  })
        }
      >
        {/* Close Button */}
        <button
          type="button"
          className="jd-signup-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <Cancel01Icon size={20} />
        </button>

        {/* Top-Centered Logo & Title */}
        <div className="jd-signup-header-container">
          <div className="jd-signup-logo-wrapper">
            <BrandLogo width={36} tone="blue" />
          </div>
          <h2 id="signup-modal-title" className="jd-signup-title">
            <span className="jd-title-w-anchor">
              W
              <CrownIcon size={50} color="#0048B3" className="jd-signup-title-crown-inline" />
            </span>
            elcome to Jaradeck
          </h2>
          <p className="jd-signup-subtitle">
            Let's get the formalities out of the way
          </p>
        </div>

        {/* Google SSO Button */}
        {hasSavedUser ? (
          <button
            type="button"
            className="jd-google-dribbble-btn"
            onClick={handleGoogleButtonClick}
            disabled={isGoogleLoading}
          >
            <div className="jd-google-btn-avatar">
              {displayPicture ? (
                <img src={displayPicture} alt={displayName} className="jd-google-avatar-img" />
              ) : (
                <div className="jd-google-avatar-placeholder">
                  {hintFirstName ? hintFirstName.charAt(0).toUpperCase() : 'G'}
                </div>
              )}
            </div>

            <div className="jd-google-btn-info">
              <span className="jd-google-btn-title">
                {isGoogleLoading ? 'Signing in...' : `Continue as ${hintFirstName || 'User'}`}
              </span>
              {displayEmail && (
                <div className="jd-google-btn-email-row">
                  <span className="jd-google-btn-email">{displayEmail}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="jd-google-chevron">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              )}
            </div>

            <div className="jd-google-btn-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
            </div>
          </button>
        ) : (
          <button
            type="button"
            className="jd-google-blue-btn"
            onClick={handleGoogleButtonClick}
            disabled={isGoogleLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>{isGoogleLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>
        )}

        {/* Divider */}
        <div className="jd-signup-divider">
          <span className="jd-signup-divider-line"></span>
          <span className="jd-signup-divider-text">{isMobile ? "or" : "or sign up below"}</span>
          <span className="jd-signup-divider-line"></span>
        </div>

        {/* Form Fields */}
        <form className="jd-signup-form" onSubmit={handleSubmit} noValidate>
          <div className="jd-signup-name-row">
            <div className="jd-signup-field">
              {isMobile && <label className="jd-signup-label">First Name</label>}
              <input
                type="text"
                className="jd-signup-input"
                placeholder={isMobile ? "Lagbaja" : "First name e.g Lagbaja"}
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                required
              />
            </div>
            <div className="jd-signup-field">
              {isMobile && <label className="jd-signup-label">Last Name</label>}
              <input
                type="text"
                className="jd-signup-input"
                placeholder={isMobile ? "Tamedo" : "Last name e.g Tamedo"}
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setError(''); }}
                required
              />
            </div>
          </div>

          <div className="jd-signup-field">
            {isMobile && <label className="jd-signup-label">Email Address</label>}
            <input
              type="email"
              className="jd-signup-input"
              placeholder="mrlagbajatamedo@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              autoComplete="off"
              required
            />
          </div>

          {error && <div className="jd-signup-error-msg">{error}</div>}

          {/* Sign up CTA Button */}
          <button
            type="submit"
            className="jd-signup-continue-btn"
            disabled={!isFormValid || isSubmitting}
          >
            <span>{isSubmitting ? 'Sending code…' : 'Sign up'}</span>
            {!isSubmitting && <ArrowRight02Icon size={18} />}
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
