function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

import WorkerBottomNav from '../components/WorkerBottomNav';
import emmanuelProfile from '../assets/emmanuel.png';
import jakeTaiwo from '../assets/Jake Taiwo.png';

function ProjectPerson() {
  return (
    <div className="dashboard-person">
      <img src={jakeTaiwo} alt="Jake Taiwo" className="dashboard-person-avatar" />
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
          <img src={emmanuelProfile} alt="Emmanuel" className="dashboard-profile-avatar" />
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
        <ProjectPerson />
        <ProjectPerson />
        <ProjectPerson />
        <ProjectPerson />
      </section>

      <WorkerBottomNav />
    </main>
  );
}
