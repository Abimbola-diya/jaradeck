import { useNavigate } from 'react-router-dom';
import ArrowIcon from './ArrowIcon';

// Circular back button used on the wallet / withdraw screens.
// Pass `to` to go to a specific route, otherwise it goes back one step.
export default function BackButton({ to, ariaLabel = 'Go back' }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="dashboard-back-btn"
      aria-label={ariaLabel}
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      <ArrowIcon direction="left" size={18} strokeWidth={2.25} />
    </button>
  );
}
