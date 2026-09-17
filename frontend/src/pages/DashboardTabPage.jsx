import { WorkerWalletScreen } from '../components/WorkerWalletScreen';
import { WithdrawOptionsScreen } from '../components/WithdrawOptionsScreen';
import { LocalBankWithdrawScreen } from '../components/LocalBankWithdrawScreen';
import { ConfirmWithdrawScreen } from '../components/ConfirmWithdrawScreen';
import { EnterPinScreen } from '../components/EnterPinScreen';
import { WithdrawSuccessScreen } from '../components/WithdrawSuccessScreen';

const tabCopy = {
  chat: ['Chat', 'Your project conversations will appear here.'],
  settings: ['Settings', 'Manage your worker profile and availability.'],
};

export default function DashboardTabPage({ tab }) {
  if (tab === 'wallet') {
    return <WorkerWalletScreen />;
  }

  if (tab === 'withdraw-options') {
    return <WithdrawOptionsScreen />;
  }

  if (tab === 'withdraw-bank') {
    return <LocalBankWithdrawScreen />;
  }

  if (tab === 'confirm-withdraw') {
    return <ConfirmWithdrawScreen />;
  }

  if (tab === 'enter-pin') {
    return <EnterPinScreen />;
  }

  if (tab === 'withdraw-success') {
    return <WithdrawSuccessScreen />;
  }

  const [title, description] = tabCopy[tab] || ['Unknown Tab', ''];

  return (
    <main className="worker-dashboard dashboard-tab-page">
      <section className="dashboard-tab-empty-state">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  );
}
