import WorkerBottomNav from '../components/WorkerBottomNav';

const tabCopy = {
  wallet:   ['Wallet',   'Your balance and payouts will appear here.'],
  chat:     ['Chat',     'Your project conversations will appear here.'],
  settings: ['Settings', 'Manage your profile and availability.'],
  home:     ['Home',     'Your active projects will appear here.'],
  orders:   ['Orders',   'Your project orders will appear here.'],
};

export default function DashboardTabPage({ tab, role }) {
  const [title, description] = tabCopy[tab] ?? [tab, ''];

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
