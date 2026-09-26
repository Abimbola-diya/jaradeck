import { WorkerWalletScreen } from '../components/WorkerWalletScreen';
import { WithdrawOptionsScreen } from '../components/WithdrawOptionsScreen';
import { LocalBankWithdrawScreen } from '../components/LocalBankWithdrawScreen';
import { ConfirmWithdrawScreen } from '../components/ConfirmWithdrawScreen';
import { EnterPinScreen } from '../components/EnterPinScreen';
import { WithdrawSuccessScreen } from '../components/WithdrawSuccessScreen';
import { WorkerChatScreen } from '../components/WorkerChatScreen';
import { FreshChatScreen } from '../components/FreshChatScreen';
import { WorkerSettingsScreen } from '../components/WorkerSettingsScreen';
import { WorkerAvailabilityScreen } from '../components/WorkerAvailabilityScreen';
import { PayoutsScreen } from '../components/PayoutsScreen';
import { ProfilePortfolioScreen } from '../components/ProfilePortfolioScreen';
import { AddPortfolioWorkScreen } from '../components/AddPortfolioWorkScreen';

const tabCopy = {
  settings: ['Settings', 'Manage your worker profile and availability.'],
};

export default function DashboardTabPage({ tab }) {
  if (tab === 'settings') {
    return <WorkerSettingsScreen />;
  }

  if (tab === 'profile-portfolio' || tab === 'profile') {
    return <ProfilePortfolioScreen />;
  }

  if (tab === 'add-portfolio-work' || tab === 'add-work') {
    return <AddPortfolioWorkScreen />;
  }

  if (tab === 'availability') {
    return <WorkerAvailabilityScreen />;
  }

  if (tab === 'payouts') {
    return <PayoutsScreen />;
  }
  if (tab === 'chat') {
    return <WorkerChatScreen />;
  }

  if (tab === 'fresh-chat' || tab === 'chat-thread') {
    return <FreshChatScreen />;
  }

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
