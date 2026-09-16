import React from 'react';
import WorkerBottomNav from '../components/WorkerBottomNav';
import NoActiveProjectsIllustration from '../components/NoActiveProjectsIllustration';
import emmanuelProfile from '../assets/emmanuel.png';

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.2311 18H4.76887C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 5.63401 8.13401 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.2558C19 13.0514 19.3161 13.8145 19.8787 14.3771L20.4819 14.9803C20.8136 15.3121 21 15.762 21 16.2311C21 17.208 20.208 18 19.2311 18Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function DashboardPage() {
  const firstName = (() => {
    try {
      const raw = localStorage.getItem('jaradeck_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.first_name) return parsed.first_name;
        if (parsed.full_name) return parsed.full_name.trim().split(' ')[0];
        if (parsed.name) return parsed.name.trim().split(' ')[0];
      }
    } catch {}
    return 'Emmanuel';
  })();

  const formattedName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'Emmanuel';

  return (
    <main className="worker-dashboard empty-worker-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-text">
          <h1>Good morning {formattedName}</h1>
          <p>How are you doing today</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-icon-btn" aria-label="Notifications">
            <BellIcon />
          </button>
          <img src={emmanuelProfile} alt={formattedName} className="dashboard-profile-avatar" />
        </div>
      </header>

      <section className="worker-empty-state-container">
        <div className="worker-empty-illustration-slot">
          <NoActiveProjectsIllustration width={204} height={192} />
        </div>
        <p className="worker-empty-state-text">No active projects yet</p>
      </section>

      <WorkerBottomNav />
    </main>
  );
}
