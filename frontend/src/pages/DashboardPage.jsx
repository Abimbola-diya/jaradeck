function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function NavIcon({ type }) {
  const icons = {
    projects: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 5V3h8v2M7 11h10" /></>,
    wallet: <><path d="M4 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" /><path d="M16 13h.01" /></>,
    chat: <><path d="M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" /><path d="M8 10h8M8 13h5" /></>,
    settings: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 8h10M7 12h10M7 16h10" /><circle cx="9" cy="8" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="11" cy="16" r="1" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}

function ProjectPerson({ faded = false }) {
  return (
    <div className={`dashboard-person ${faded ? 'dashboard-person-faded' : ''}`}>
      <img src="/team_avatar.png" alt="Jake Taiwo" className="dashboard-person-avatar" />
      <div>
        <h3>Social Media Manager</h3>
        <p>Jake Taiwo</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="worker-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Good morning Emmanuel</h1>
          <p>How are you doing today</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-icon-btn" aria-label="Notifications"><BellIcon /></button>
          <img src="/team_avatar.png" alt="Emmanuel" className="dashboard-profile-avatar" />
        </div>
      </header>

      <section className="dashboard-card dashboard-active-project">
        <h2>Active Project</h2>
        <ProjectPerson />
        <button className="dashboard-primary-btn">View Project Details</button>
      </section>

      <section className="dashboard-card dashboard-activity-card">
        <h2>Overall Activity</h2>
        <p>12 projects delivered with a 100% completion rate.</p>
        <button className="dashboard-outline-btn">View Analytics</button>
      </section>

      <section className="dashboard-completed-section">
        <div className="dashboard-section-title">
          <h2>Completed Project</h2>
          <button>See all</button>
        </div>
        <ProjectPerson />
        <ProjectPerson />
        <ProjectPerson faded />
      </section>

      <nav className="dashboard-bottom-nav" aria-label="Worker dashboard navigation">
        <button className="dashboard-nav-item dashboard-nav-active"><NavIcon type="projects" /><span>Projects</span></button>
        <button className="dashboard-nav-item"><NavIcon type="wallet" /><span>Wallet</span></button>
        <button className="dashboard-nav-item"><NavIcon type="chat" /><span>Chat</span></button>
        <button className="dashboard-nav-item"><NavIcon type="settings" /><span>Settings</span></button>
      </nav>
    </main>
  );
}
