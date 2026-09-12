import WorkerBottomNav from '../components/WorkerBottomNav';

export type DashboardTabKey = 'wallet' | 'chat' | 'settings';

interface DashboardTabPageProps {
  tab: DashboardTabKey;
}

const tabCopy: Record<DashboardTabKey, [string, string]> = {
  wallet: ['Wallet', 'Your balance and payouts will appear here.'],
  chat: ['Chat', 'Your project conversations will appear here.'],
  settings: ['Settings', 'Manage your worker profile and availability.'],
};

export default function DashboardTabPage({ tab }: DashboardTabPageProps) {
  const [title, description] = tabCopy[tab] || ['Dashboard', ''];

  return (
    <main className="worker-dashboard dashboard-tab-page">
      <section className="dashboard-tab-empty-state">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <WorkerBottomNav />
    </main>
  );
}