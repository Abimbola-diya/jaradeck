import { useLocation, useNavigate } from 'react-router-dom';
import WorkerBottomNav from '../components/WorkerBottomNav';
import BackButton from '../components/BackButton';

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#9a9aa5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M4 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" />
      <path d="M16 13h.01" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#9a9aa5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M3 22h18M3 10h18M5 10V6l7-4 7 4v4M9 22v-6h6v6" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#9a9aa5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="15" y2="13" />
    </svg>
  );
}

const FEE = 350;

export default function WithdrawConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const amount = state?.amount ?? 0;

  const handleConfirm = () => {
    navigate('/dashboard/wallet/withdraw/pin', { state: { amount } });
  };

  return (
    <main className="worker-dashboard wd-confirm-page">
      <BackButton to="/dashboard/wallet/withdraw/amount" />

      <h1 className="wd-title">Confirm withdrawal</h1>

      <div className="wd-review-amount-label">Amount</div>
      <div className="wd-review-amount">₦{amount.toLocaleString('en-NG')}.00</div>

      <div className="wd-review-rows">
        <div className="wd-review-row">
          <span className="wd-review-icon"><WalletIcon /></span>
          <span className="wd-review-key">From</span>
          <span className="wd-review-val">Jaradeck Wallet</span>
        </div>
        <div className="wd-review-row">
          <span className="wd-review-icon"><BankIcon /></span>
          <span className="wd-review-key">To</span>
          <span className="wd-review-val">Ali Mayo........1234</span>
        </div>
        <div className="wd-review-row">
          <span className="wd-review-icon"><ReceiptIcon /></span>
          <span className="wd-review-key">Fee</span>
          <span className="wd-review-val">₦{FEE.toLocaleString('en-NG')}.00</span>
        </div>
      </div>

      <button className="wd-confirm-btn wd-confirm-active wd-confirm-standalone" onClick={handleConfirm}>
        Confirm
      </button>

      <WorkerBottomNav />
    </main>
  );
}
