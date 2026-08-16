import { useNavigate } from 'react-router-dom';
import WorkerBottomNav from '../components/WorkerBottomNav';
import BackButton from '../components/BackButton';
import coffette from '../assets/coffette.svg';
import successTick from '../assets/success tick.svg';

export default function WithdrawSuccessPage() {
  const navigate = useNavigate();

  return (
    <main className="worker-dashboard wd-success-page">
      <BackButton to="/dashboard/wallet" />

      <div className="wd-success-visual">
        <img src={coffette} alt="" aria-hidden="true" className="wd-success-coffette" />
        <img src={successTick} alt="" aria-hidden="true" className="wd-success-tick" />
      </div>

      <h1 className="wd-success-title">Succesful!</h1>
      <p className="wd-success-sub">
        The funds should arrive in the receiving bank within 5 minutes.
      </p>

      <button
        className="wd-confirm-btn wd-confirm-active wd-success-cta"
        onClick={() => navigate('/dashboard', { replace: true })}
      >
        Continue to Dashboard →
      </button>

      <WorkerBottomNav />
    </main>
  );
}
