import React from 'react';
import ArrowLeft02Icon from '../ArrowLeft02Icon';
import BrandLogo from '../BrandLogo';
import DoubleLoveIcon from '../DoubleLoveIcon';

export default function OBShell({ children, isSignIn = false, onAuthSwitch, onBack, hideBack = false, hideAuthSwitch = false, align = 'left', isCropActive = false }) {
  return (
    <div className={`ob2-page${align === 'left' ? ' ob2-page--left' : ''}${isCropActive ? ' ob2-crop-active' : ''}`}>
      {/* Top Left Back Button */}
      {!hideBack && onBack && (
        <button type="button" className="ob2-back-btn ob2-anim-back" onClick={onBack} aria-label="Go back">
          <ArrowLeft02Icon size={20} />
        </button>
      )}
      {/* Logo — centered at top */}
      <div className="ob2-logo-wrap ob2-anim-logo">
        <BrandLogo width={34} height={25} tone="blue" />
      </div>

      {/* Top Right Graphic */}
      <div className="ob2-top-right-graphic">
        <DoubleLoveIcon size={46} color="#0048B3" />
      </div>

      {/* Main content area */}
      <div className="ob2-content ob2-anim-form">
        {children}

        {/* Bottom auth switch */}
        {!hideAuthSwitch && (
          <div className="ob2-bottom-bar ob2-role-bottom-bar">
            {isSignIn ? (
              <>
                <span>New to Jaradeck?</span>
                <button type="button" className="ob2-link-btn" onClick={onAuthSwitch}>Sign up</button>
              </>
            ) : (
              <>
                <span>Already on Jaradeck?</span>
                <button type="button" className="ob2-link-btn" onClick={onAuthSwitch}>Sign in</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
