import { NavLink } from 'react-router-dom';

function NavIcon({ type }) {
  const icons = {
    projects: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 5V3h8v2M7 11h10" /></>,
    wallet: <><path d="M4 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" /><path d="M16 13h.01" /></>,
    chat: <><path d="M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" /><path d="M8 10h8M8 13h5" /></>,
    settings: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 8h10M7 12h10M7 16h10" /><circle cx="9" cy="8" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="11" cy="16" r="1" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}

const tabs = [
  { label: 'Projects', to: '/dashboard', icon: 'projects', end: true },
  { label: 'Wallet', to: '/dashboard/wallet', icon: 'wallet' },
  { label: 'Chat', to: '/dashboard/chat', icon: 'chat' },
  { label: 'Settings', to: '/dashboard/settings', icon: 'settings' },
];

export default function WorkerBottomNav() {
  return (
    <nav className="dashboard-bottom-nav" aria-label="Worker dashboard navigation">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-nav-active' : ''}`}>
          <NavIcon type={tab.icon} />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
