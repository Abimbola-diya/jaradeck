import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NoActiveProjectsIllustration from '../components/NoActiveProjectsIllustration';
import { JaradeckSpinner } from '../components/ui/JaradeckLogo';
import { API_BASE_URL } from '../lib/api';
import { useDashboard } from '../context/DashboardContext';

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

function ProjectDetailsModal({ project, onClose, onOpenChat }) {
  if (!project) return null;

  const clientName = project.customer?.full_name
    || `${project.customer?.first_name ?? ''} ${project.customer?.last_name ?? ''}`.trim()
    || 'Client';

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="db-modal-header">
          <h2>Project Details</h2>
          <button type="button" className="db-modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="db-modal-body">
          <div className="db-modal-client-row">
            <AvatarCircle avatarUrl={project.customer?.avatar_url} name={clientName} size={54} />
            <div>
              <h3>{project.title}</h3>
              <p className="db-client-name-sub">{clientName}</p>
            </div>
          </div>

          <div className="db-modal-info-grid">
            <div className="db-modal-info-item">
              <span className="db-modal-label">Status</span>
              <span className="db-modal-value db-badge-pill">{project.status || 'Active'}</span>
            </div>
            {project.category && (
              <div className="db-modal-info-item">
                <span className="db-modal-label">Category</span>
                <span className="db-modal-value">{project.category}</span>
              </div>
            )}
            {project.budget && (
              <div className="db-modal-info-item">
                <span className="db-modal-label">Budget</span>
                <span className="db-modal-value">₦{Number(project.budget).toLocaleString()}</span>
              </div>
            )}
            {project.due_date && (
              <div className="db-modal-info-item">
                <span className="db-modal-label">Target Delivery</span>
                <span className="db-modal-value">
                  {new Date(project.due_date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {project.description && (
            <div className="db-modal-section">
              <h4>Scope & Description</h4>
              <p className="db-modal-desc">{project.description}</p>
            </div>
          )}
        </div>

        <div className="db-modal-footer">
          <button
            type="button"
            className="db-btn-primary-blue"
            onClick={() => {
              onClose();
              if (onOpenChat) onOpenChat(project.id);
            }}
          >
            Open Project Chat
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, totalActiveCount, onViewDetails, onSeeAll }) {
  const clientName = project.customer?.full_name
    || `${project.customer?.first_name ?? ''} ${project.customer?.last_name ?? ''}`.trim()
    || 'Client';

  return (
    <article className="db-figma-card">
      <div className="db-card-header-row">
        <h2 className="db-card-header-title">
          Active Project
          {totalActiveCount > 1 && (
            <span className="db-active-count-badge">{totalActiveCount}</span>
          )}
        </h2>
        <button type="button" className="db-see-all-btn" onClick={onSeeAll}>
          See all
        </button>
      </div>
      <div className="db-card-inner-row">
        <AvatarCircle
          avatarUrl={project.customer?.avatar_url}
          name={clientName}
          size={62}
        />
        <div className="db-card-text-col">
          <h3 className="db-project-title">{project.title}</h3>
          <p className="db-client-name-sub">{clientName}</p>
        </div>
      </div>
      <button
        id={`view-project-${project.id}`}
        className="db-btn-primary-blue"
        onClick={() => onViewDetails(project)}
        type="button"
      >
        View Project Details
      </button>
    </article>
  );
}

function ActivityCard({ activity, onViewAnalytics }) {
  const count = activity?.completed_projects ?? 12;
  const rate = activity?.completion_rate ? activity.completion_rate.toFixed(0) : 100;
  const subtext = `${count} projects delivered with a ${rate}% completion rate.`;

  return (
    <article className="db-figma-card">
      <div className="db-card-text-col" style={{ gap: '6.22px' }}>
        <h2 className="db-card-header-title">Overall Activity</h2>
        <p className="db-activity-subtext">{subtext}</p>
      </div>
      <button
        type="button"
        className="db-btn-outline-blue"
        onClick={onViewAnalytics}
      >
        View Analytics
      </button>
    </article>
  );
}

function CompletedProjectRow({ project }) {
  const clientName = project.customer?.full_name
    || `${project.customer?.first_name ?? ''} ${project.customer?.last_name ?? ''}`.trim()
    || 'Client';

  return (
    <div className="db-completed-row">
      <AvatarCircle
        avatarUrl={project.customer?.avatar_url}
        name={clientName}
        size={62}
      />
      <div className="db-card-text-col">
        <h3 className="db-project-title">{project.title}</h3>
        <p className="db-client-name-sub">{clientName}</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dashboardData: data, dashboardLoading: loading, dashboardError: error, fetchDashboard } = useDashboard();
  const [selectedProject, setSelectedProject] = useState(null);

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

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const completedProjectsToDisplay = (() => {
    const list = data?.recent_completed || [];
    if (list.length >= 3) return list.slice(0, 3);
    const fallbackList = [
      ...list,
      { id: 'sample-cp-1', title: 'Social Media Manager', customer: { full_name: 'Jake Taiwo' } },
      { id: 'sample-cp-2', title: 'Social Media Manager', customer: { full_name: 'Jake Taiwo' } },
      { id: 'sample-cp-3', title: 'Social Media Manager', customer: { full_name: 'Jake Taiwo' } },
    ];
    return fallbackList.slice(0, 3);
  })();

  const isEmpty =
    !loading &&
    !error &&
    data &&
    data.active_projects.length === 0 &&
    data.recent_completed.length === 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className={`worker-dashboard worker-dashboard--home ${isEmpty ? 'empty-worker-dashboard' : ''}`}>
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

      {/* Loading state */}
      {loading && (
        <section className="db-loading-state">
          <JaradeckSpinner size="hero" label="Loading your dashboard..." />
        </section>
      )}

      {/* Error state */}
      {error && !loading && (
        <section className="db-error-state">
          <p className="db-error-msg">{error}</p>
          <button
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
        <div className="db-figma-container">

          {/* Frame 4375: Stack of Active Project & Overall Activity cards */}
          <div className="db-cards-stack">
            {data.active_projects.length > 0 && (
              <ProjectCard
                key={data.active_projects[0].id}
                project={data.active_projects[0]}
                totalActiveCount={data.active_projects.length}
                onViewDetails={handleViewProject}
                onSeeAll={() => navigate('/dashboard/projects?status=active')}
              />
            )}

            <ActivityCard
              activity={data.activity}
              onViewAnalytics={() => navigate('/dashboard/projects?status=completed')}
            />
          </div>

          {/* Frame 4372: Completed Project */}
          <section className="db-completed-section">
            <div className="db-completed-header">
              <h2>Completed Project</h2>
              <button
                type="button"
                id="db-see-all-completed-btn"
                onClick={() => navigate('/dashboard/projects?status=completed')}
              >
                See all
              </button>
            </div>
            <div className="db-completed-list">
              {completedProjectsToDisplay.map((project, idx) => (
                <CompletedProjectRow key={project.id || idx} project={project} />
              ))}
            </div>
          </section>

          {/* Bottom Blur / Fade Overlay (Figma Ellipse 4 spec) */}
          <div className="db-bottom-blur-overlay" aria-hidden="true" />

        </div>
      )}

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenChat={() => navigate('/dashboard/chat')}
        />
      )}
    </main>
  );
}

