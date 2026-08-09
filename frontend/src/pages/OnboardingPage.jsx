import { useNavigate } from 'react-router-dom';
import OnboardingFlow from '../components/OnboardingPage';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return <OnboardingFlow onNavigateHome={() => navigate('/')} />;
}
