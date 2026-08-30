import React, { useState } from 'react';
import { Briefcase01Icon, UserAccountIcon } from 'hugeicons-react';
import GooglePillButton from './GooglePillButton';
import ArrowRight02Icon from '../ArrowRight02Icon';

export default function RoleSelectionStep({ onSelect, onGoogleAuthSuccess }) {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [error, setError] = useState('');

  return (
    <div className="ob2-page ob2-role-page">
      <div className="ob2-role-container">
        <div className="ob2-role-top-section">
          <div className="ob2-role-header-group">
            <div className="ob2-role-logo ob2-anim-logo">
              <svg width="34" height="25" viewBox="0 0 34 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.23453 17.8236H34.0002V24.4431H3.23453V21.1334V17.8236Z" fill="#0048B3" />
                <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 17.8236H3.23453L0 16.1194H30.674L34.0002 17.8236Z" fill="#487DCD" />
                <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 17.8236V21.1334V24.4431L0 22.4737V16.1194L3.23453 17.8236Z" fill="#2F6BC4" />
                <path d="M3.23453 9.87086H34.0002V16.4904H3.23453V9.87086Z" fill="#0048B3" />
                <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 9.87086H3.23453L0 8.16666H30.674L34.0002 9.87086Z" fill="#487DCD" />
                <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 9.87086V16.4904L0 14.5209V8.16666L3.23453 9.87086Z" fill="#2F6BC4" />
                <path d="M3.23453 1.7042H34.0002V8.3237H3.23453V1.7042Z" fill="#0048B3" />
                <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 1.7042H3.23453L0 0H30.674L34.0002 1.7042Z" fill="#487DCD" />
                <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 1.7042V8.3237L0 6.35427V0L3.23453 1.7042Z" fill="#2F6BC4" />
              </svg>
            </div>
            <div className="ob2-role-title-group ob2-anim-header">
              <h1 className="ob2-role-title">How can we help you?</h1>
              <p className="ob2-role-subtitle">Choose how you would like to use Jaradeck</p>
            </div>
          </div>

          <div className="ob2-role-card-group">
            <button
              type="button"
              className={`ob2-role-custom-card ob2-anim-card-1 ${selectedRole === 'customer' ? 'ob2-role-custom-card-selected' : ''}`}
              onClick={() => setSelectedRole('customer')}
            >
              <div className="ob2-role-card-icon">
                <Briefcase01Icon size={26} />
              </div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I need work done.</div>
                <div className="ob2-role-card-desc">
                  Hand off your projects and get finished results without the hiring hassle.
                </div>
              </div>
            </button>

            <button
              type="button"
              className={`ob2-role-custom-card ob2-anim-card-2 ${selectedRole === 'worker' ? 'ob2-role-custom-card-selected' : ''}`}
              onClick={() => setSelectedRole('worker')}
            >
              <div className="ob2-role-card-icon">
                <UserAccountIcon size={26} />
              </div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I want to do work</div>
                <div className="ob2-role-card-desc">
                  Get matched directly with active projects and earn on your terms.
                </div>
              </div>
            </button>
          </div>
        </div>

        {error && <p className="ob2-error">{error}</p>}

        <div className="ob2-role-footer ob2-anim-footer">
          <button
            type="button"
            className="ob2-role-submit-btn"
            disabled={!selectedRole}
            onClick={() => onSelect(selectedRole)}
          >
            Sign up <ArrowRight02Icon size={16} />
          </button>

          <GooglePillButton
            role={selectedRole}
            onGoogleSuccess={(data) => onGoogleAuthSuccess(data, selectedRole)}
            onError={(msg) => setError(msg)}
          />
        </div>
      </div>
    </div>
  );
}
