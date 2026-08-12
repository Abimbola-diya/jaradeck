import WorkerBottomNav from '../components/WorkerBottomNav';
import BackButton from '../components/BackButton';

/* ---------------- icons ---------------- */
function BankNoteIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="4" y="13" width="40" height="22" rx="5" fill="#0f9d58" />
      <rect x="4" y="13" width="40" height="22" rx="5" stroke="#0b7c45" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="6" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="11" cy="24" r="2" fill="#ffffff" fillOpacity="0.8" />
      <circle cx="37" cy="24" r="2" fill="#ffffff" fillOpacity="0.8" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <ellipse cx="24" cy="33" rx="13" ry="5.5" fill="#0048b3" />
      <ellipse cx="24" cy="26" rx="13" ry="5.5" fill="#3d6fe0" />
      <ellipse cx="24" cy="19" rx="13" ry="5.5" fill="#8fb0f0" />
    </svg>
  );
}

export default function WithdrawPage() {
  return (
    <main className="worker-dashboard withdraw-page">
      <BackButton to="/dashboard/wallet" />

      <div className="withdraw-method-list">
        <button
          type="button"
          className="withdraw-method-card"
          onClick={() => {
            // TODO: launch the local-bank withdrawal flow (no design yet)
          }}
        >
          <span className="withdraw-method-icon">
            <BankNoteIcon />
          </span>
          <span className="withdraw-method-text">
            <span className="withdraw-method-title">Withdraw to your local bank</span>
            <span className="withdraw-method-desc">
              Send money directly into your local bank account
            </span>
          </span>
        </button>

        <div className="withdraw-method-card withdraw-method-disabled" aria-disabled="true">
          <span className="withdraw-method-icon">
            <CoinsIcon />
          </span>
          <span className="withdraw-method-text">
            <span className="withdraw-method-title">Stablecoins</span>
            <span className="withdraw-method-desc">Coming soon</span>
          </span>
        </div>
      </div>

      <WorkerBottomNav />
    </main>
  );
}
