import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkerBottomNav from '../components/WorkerBottomNav';
import BackButton from '../components/BackButton';
import jakeTaiwo from '../assets/Jake Taiwo.png';

/* ---------------- icons ---------------- */
function TicketIcon() {
  return (
    <svg width="48" height="30" viewBox="0 0 48 30" fill="none" aria-hidden="true">
      <path
        d="M4 8a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v2a5 5 0 0 0 0 10v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2a5 5 0 0 0 0-10V8z"
        fill="#d9d9de"
      />
    </svg>
  );
}

/* ---------- mock wallet data (no backend wallet API yet) ----------
   Swap this for a real fetch later. An empty balance + empty lists
   renders the "No transactions yet" state (screen 2). */
const WALLET = {
  balance: 200000,
  transactions: {
    completed: [
      { id: 'c1', title: 'Social Media Management', name: 'Jake Taiwo', avatar: jakeTaiwo },
      { id: 'c2', title: 'Social Media Manager', name: 'Jake Taiwo', avatar: jakeTaiwo },
      { id: 'c3', title: 'Social Media Manager', name: 'Jake Taiwo', avatar: jakeTaiwo },
    ],
    pending: [],
  },
};

const formatNaira = (n) => `₦${n.toLocaleString('en-NG')}`;

export default function WalletPage() {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState('completed');

  const { balance, transactions } = WALLET;
  const hasActivity =
    balance > 0 || transactions.completed.length > 0 || transactions.pending.length > 0;
  const list = transactions[filter];

  return (
    <main className="worker-dashboard wallet-page">
      <BackButton to="/dashboard" />

      <header className="wallet-heading">
        <h1>Your Wallet</h1>
        <p>Your money, in safe hands</p>
      </header>

      {!hasActivity ? (
        <div className="wallet-empty wallet-empty-full">
          <TicketIcon />
          <p className="wallet-empty-title">No transactions yet.</p>
          <p>Complete your first project on Jaradeck</p>
        </div>
      ) : (
        <>
          <section className="wallet-balance">
            <span className="wallet-balance-label">Total Balance</span>
            <div className="wallet-balance-amount">
              <span>{hidden ? '₦ ••••••' : formatNaira(balance)}</span>
              <button
                className="wallet-eye-btn"
                onClick={() => setHidden((h) => !h)}
                aria-label={hidden ? 'Show balance' : 'Hide balance'}
              >
                <img src="/eye-icon.png" alt="" />
              </button>
            </div>
            <button
              className="wallet-withdraw-btn"
              onClick={() => navigate('/dashboard/wallet/withdraw')}
            >
              Withdraw <img src="/sent-icon.png" alt="" />
            </button>
          </section>

          <section className="wallet-transactions">
            <div className="wallet-txn-header">
              <h2>Transaction history</h2>
              <div className="wallet-segmented" role="tablist">
                <button
                  role="tab"
                  aria-selected={filter === 'completed'}
                  className={`wallet-seg-btn ${filter === 'completed' ? 'wallet-seg-active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
                <button
                  role="tab"
                  aria-selected={filter === 'pending'}
                  className={`wallet-seg-btn ${filter === 'pending' ? 'wallet-seg-active' : ''}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
              </div>
            </div>

            {list.length > 0 ? (
              <div className="wallet-txn-list">
                {list.map((t) => (
                  <div key={t.id} className="dashboard-person">
                    <img src={t.avatar} alt={t.name} className="dashboard-person-avatar" />
                    <div>
                      <h3>{t.title}</h3>
                      <p>{t.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="wallet-empty">
                <TicketIcon />
                <p>
                  {filter === 'pending'
                    ? 'You have no pending transactions'
                    : 'No completed transactions yet'}
                </p>
              </div>
            )}
          </section>
        </>
      )}

      <WorkerBottomNav />
    </main>
  );
}
