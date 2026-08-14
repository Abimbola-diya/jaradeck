import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkerBottomNav from '../components/WorkerBottomNav';
import BackButton from '../components/BackButton';

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}

const PIN_LENGTH = 4;

export default function WithdrawPinPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');

  const press = (d) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      // TODO: verify PIN against backend; for now navigate to success
      setTimeout(() => navigate('/dashboard/wallet/withdraw/success', { replace: true }), 300);
    }
  };

  const del = () => setPin((p) => p.slice(0, -1));

  return (
    <main className="worker-dashboard wd-pin-page">
      <BackButton to="/dashboard/wallet/withdraw/confirm" />

      <h1 className="wd-pin-title">Enter your PIN</h1>
      <p className="wd-pin-sub">Please enter yout 4 - digit security PIN to authorize this withdrawal</p>

      <div className="wd-pin-dots">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span key={i} className={`wd-pin-dot${i < pin.length ? ' wd-pin-dot-filled' : ''}`} />
        ))}
      </div>

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
