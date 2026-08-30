import React from 'react';
import confettiImage from '../../assets/coffette.svg';
import successTickImage from '../../assets/success tick.svg';
import ArrowRight02Icon from '../ArrowRight02Icon';

export default function SuccessStep({ onNavigateDashboard }) {
  return (
    <div className="ob2-page ob2-page-success">
      <img src={confettiImage} className="ob2-confetti-img" alt="" aria-hidden="true" />
      <div className="ob2-success-content">
        <img src={successTickImage} className="ob2-success-badge-img" alt="Onboarding complete" />
        <h1 className="ob2-success-title">You&apos;re all set!</h1>
        <p className="ob2-success-copy">
          Keep an eye on your dashboard<br />
          we&apos;ll match you as soon as work comes in.
        </p>
        <button className="ob2-cta-btn ob2-dashboard-cta" onClick={onNavigateDashboard}>
          Continue to Dashboard <ArrowRight02Icon size={18} />
        </button>
      </div>
    </div>
  );
}
