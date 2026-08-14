import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkerBottomNav from '../components/WorkerBottomNav';
import BackButton from '../components/BackButton';

const AVAILABLE = 19000;
const ACCOUNT = { number: '12321245472', bank: 'Zenith Bank', logo: '/Logo I.png' };

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M8 3L8 21M8 3L4 7M8 3L12 7" />
      <path d="M16 21L16 3M16 21L12 17M16 21L20 17" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}

const formatAmount = (raw) => {
  if (!raw) return '';
  const num = parseInt(raw, 10);
  return `₦${num.toLocaleString('en-NG')}.00`;
};

export default function WithdrawAmountPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState('');

  const press = (d) => setDigits((p) => (p.length < 10 ? p + d : p));
  const del = () => setDigits((p) => p.slice(0, -1));

  const amount = digits ? parseInt(digits, 10) : 0;
  const overBalance = amount > AVAILABLE;
  const canConfirm = amount > 0 && !overBalance;

  const handleConfirm = () => {
    if (!canConfirm) return;
    navigate('/dashboard/wallet/withdraw/confirm', { state: { amount } });
  };

  return (
    <main className="worker-dashboard wd-amount-page">
      <BackButton to="/dashboard/wallet/withdraw" />

      <h1 className="wd-title">Withdraw to local bank</h1>

      <div className="wd-sort-icon"><SortIcon /></div>

      <div className="wd-account-chip">
        <img src={ACCOUNT.logo} alt={ACCOUNT.bank} className="wd-bank-logo" />
        <div>
          <span className="wd-account-number">{ACCOUNT.number}</span>
          <span className="wd-account-bank">{ACCOUNT.bank}</span>
        </div>
      </div>

      <div className="wd-balance-row">
        <span className="wd-balance-label">Available Balance</span>
        <span className="wd-balance-value">₦{AVAILABLE.toLocaleString('en-NG')}</span>
        <button className="wd-eye-btn" aria-label="Toggle balance"><EyeIcon /></button>
      </div>

      <div className="wd-amount-display">
        {digits ? (
          <>
            <span className="wd-amount-value">{formatAmount(digits)}</span>
            {overBalance && <span className="wd-amount-error">Amount exceeds current balance</span>}
          </>
        ) : (
          <span className="wd-amount-cursor" />
        )}
      </div>

      <button
        className={`wd-confirm-btn${canConfirm ? ' wd-confirm-active' : ''}`}
        onClick={handleConfirm}
        disabled={!canConfirm}
      >
        Confirm
      </button>

      <div className="wd-numpad">
        {['1','2','3','4','5','6','7','8','9'].map((d) => (
          <button key={d} className="wd-key" onClick={() => press(d)}>{d}</button>
        ))}
        <div className="wd-key wd-key-empty" />
        <button className="wd-key" onClick={() => press('0')}>0</button>
        <button className="wd-key wd-key-del" onClick={del} aria-label="Delete"><BackspaceIcon /></button>
      </div>

      <WorkerBottomNav />
    </main>
  );
}
