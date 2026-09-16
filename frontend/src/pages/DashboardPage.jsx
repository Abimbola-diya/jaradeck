import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NoActiveProjectsIllustration from '../components/NoActiveProjectsIllustration';
import { API_BASE_URL } from '../lib/api';

// ── Icons ─────────────────────────────────────────────────────────────────────

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.2311 18H4.76887C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 5.63401 8.13401 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.2558C19 13.0514 19.3161 13.8145 19.8787 14.3771L20.4819 14.9803C20.8136 15.3121 21 15.762 21 16.2311C21 17.208 20.208 18 19.2311 18Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="#929297" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="db-spinner" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="11" stroke="#e0e0e6" strokeWidth="2.5" />
      <path d="M14 3C8 3 3 8 3 14" stroke="#064db9" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLocalUser() {
  try {
    const raw = localStorage.getItem('jaradeck_user');
    if (raw) return JSON.parse(raw);
  } catch { }
  return null;
}

function getLocalToken() {
  return localStorage.getItem('jaradeck_token') || null;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return null; }
}

function statusLabel(status) {
  return { active: 'In Progress', completed: 'Completed', pending: 'Pending', cancelled: 'Cancelled' }[status] ?? status;
}

function statusClass(status) {
  return { active: 'db-badge--active', completed: 'db-badge--done', pending: 'db-badge--pending', cancelled: 'db-badge--cancelled' }[status] ?? '';
}

function avatarInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AvatarCircle({ avatarUrl, name, size = 56 }) {
  const [imgError, setImgError] = useState(false);
  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Client'}
        className="db-person-avatar"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className="db-person-avatar db-person-avatar--initials"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-label={name || 'Client'}
    >
      {avatarInitials(name)}
    </div>
  );
}

function ProjectCard({ project, onViewDetails }) {
  const clientName = project.customer?.full_name
    || `${project.customer?.first_name ?? ''} ${project.customer?.last_name ?? ''}`.trim()
    || 'Client';

  return (
    <article className="dashboard-card dashboard-active-project db-project-card">
      <div className="db-card-top-row">
        <h2 className="db-project-title">{project.title}</h2>
        <span className={`db-badge ${statusClass(project.status)}`}>
          {statusLabel(project.status)}
        </span>
      </div>

      {project.category && (
        <p className="db-project-category">{project.category}</p>
      )}

      <div className="dashboard-person">
        <AvatarCircle
          avatarUrl={project.customer?.avatar_url}
          name={clientName}
          size={46}
        />
        <div>
          <h3 className="db-client-name">{clientName}</h3>
          {project.deadline_at && (
            <p className="db-deadline">Due {formatDate(project.deadline_at)}</p>
          )}
        </div>
      </div>

      {project.description && (
        <p className="db-project-desc">{project.description}</p>
      )}

      <button
        id={`view-project-${project.id}`}
        className="dashboard-primary-btn db-cta-btn"
        onClick={() => onViewDetails(project.id)}
        type="button"
      >
        View Project Details
      </button>
    </article>
  );
}

function ActivityCard({ activity }) {
  const stats = [
    { label: 'Total Projects', value: activity.total_projects },
    { label: 'Active', value: activity.active_projects },
    { label: 'Completed', value: activity.completed_projects },
    { label: 'Completion Rate', value: `${activity.completion_rate.toFixed(0)}%` },
    ...(activity.average_rating != null
      ? [{ label: 'Avg Rating', value: `${activity.average_rating.toFixed(1)} ★` }]
      : []),
  ];

  return (
    <article className="dashboard-card dashboard-activity-card">
      <h2>Overall Activity</h2>
      <div className="db-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="db-stat-item">
            <span className="db-stat-value">{s.value}</span>
            <span className="db-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function CompletedProjectRow({ project }) {
  const clientName = project.customer?.full_name
    || `${project.customer?.first_name ?? ''} ${project.customer?.last_name ?? ''}`.trim()
    || 'Client';

  return (
    <div className="dashboard-person db-completed-row">
      <AvatarCircle
        avatarUrl={project.customer?.avatar_url}
        name={clientName}
        size={44}
      />
      <div className="db-completed-info">
        <h3 className="db-client-name">{project.title}</h3>
        <p className="db-deadline">{clientName} · {formatDate(project.completed_at) ?? 'Completed'}</p>
      </div>
      <ChevronRightIcon />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);      // WorkerDashboardResponse
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derive display name from localStorage user
  const localUser = getLocalUser();
  const firstName = (() => {
    if (!localUser) return 'there';
    if (localUser.first_name) return localUser.first_name;
    if (localUser.full_name) return localUser.full_name.trim().split(' ')[0];
    if (localUser.name) return localUser.name.trim().split(' ')[0];
    return 'there';
  })();
  const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const avatarSrc = localUser?.avatar_url || localUser?.picture || null;

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getLocalToken();

    if (!token) {
      // Not logged in — redirect to login
      navigate('/login', { replace: true });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/worker/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('jaradeck_token');
        localStorage.removeItem('jaradeck_user');
        navigate('/login', { replace: true });
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Error ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleViewProject = (id) => {
    // Navigate to project detail page when it exists
    navigate(`/dashboard/project/${id}`);
  };

  const isEmpty =
    !loading &&
    !error &&
    data &&
    data.active_projects.length === 0 &&
    data.recent_completed.length === 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className={`worker-dashboard ${isEmpty ? 'empty-worker-dashboard' : ''}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-text">
          <h1>{getGreeting()} {formattedName}</h1>
          <p>How are you doing today</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-icon-btn" aria-label="Notifications" id="dashboard-notifications-btn">
            <BellIcon />
          </button>
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={formattedName}
              className="dashboard-profile-avatar"
            />
          ) : (
            <div className="dashboard-profile-avatar db-header-initials-avatar" aria-label={formattedName}>
              {avatarInitials(localUser?.full_name || firstName)}
            </div>
          )}
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <section className="db-loading-state" aria-live="polite" aria-label="Loading dashboard">
          <SpinnerIcon />
          <p>Loading your dashboard…</p>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="db-error-state" aria-live="assertive">
          <p className="db-error-msg">{error}</p>
          <button
            id="dashboard-retry-btn"
            className="dashboard-primary-btn db-retry-btn"
            onClick={fetchDashboard}
            type="button"
          >
            Retry
          </button>
        </section>
      )}

      {/* Empty state */}
      {isEmpty && (
        <section className="worker-empty-state-container">
          <div className="worker-empty-illustration-slot">
            <NoActiveProjectsIllustration width={204} height={192} />
          </div>
          <p className="worker-empty-state-text">No active projects yet</p>
        </section>
      )}

      {/* Filled state */}
      {!loading && !error && data && !isEmpty && (
        <div className="db-content">

          {/* ── Active Projects ─────────────────────────────── */}
          {data.active_projects.length > 0 && (
            <section className="db-section" aria-labelledby="db-active-heading">
              <div className="dashboard-section-title">
                <h2 id="db-active-heading">
                  Active Projects
                  <span className="db-count-badge">{data.active_projects.length}</span>
                </h2>
              </div>
              {data.active_projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={handleViewProject}
                />
              ))}
            </section>
          )}

          {/* ── Overall Activity ─────────────────────────────── */}
          <section className="db-section" aria-labelledby="db-activity-heading">
            <div className="dashboard-section-title">
              <h2 id="db-activity-heading">Overall Activity</h2>
            </div>
            <ActivityCard activity={data.activity} />
          </section>

          {/* ── Completed Projects ───────────────────────────── */}
          {data.recent_completed.length > 0 && (
            <section className="dashboard-completed-section db-section" aria-labelledby="db-completed-heading">
              <div className="dashboard-section-title">
                <h2 id="db-completed-heading">Completed Projects</h2>
                <button type="button" id="db-see-all-completed-btn">See all</button>
              </div>
              <div className="dashboard-card db-completed-card">
                {data.recent_completed.map((project) => (
                  <CompletedProjectRow key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
