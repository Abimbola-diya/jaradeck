import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { JaradeckSpinner } from '../components/ui/JaradeckLogo';
import { useDashboard } from '../context/DashboardContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getLocalToken() {
  return localStorage.getItem('jaradeck_token') || null;
}

function avatarInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

function AvatarCircle({ avatarUrl, name, size = 62 }) {
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
              <span className="db-modal-value db-badge-pill">{project.status}</span>
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
                <span className="db-modal-label">Due Date</span>
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

export default function ActiveProjectsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'active';

  const { projectsCache, projectsLoading: loading, projectsError: error, fetchProjects, dashboardData } = useDashboard();
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects(statusFilter);
  }, [fetchProjects, statusFilter]);

  // Use cached data if available; fallback to dashboardData active_projects if status is 'active'
  const cachedItem = projectsCache[statusFilter];
  const projects = cachedItem?.data
    || (statusFilter === 'active' ? dashboardData?.active_projects : null)
    || (statusFilter === 'completed' ? dashboardData?.recent_completed : null)
    || [];

  const titleText = statusFilter === 'active' ? 'Active Projects' : 'Completed Projects';

  return (
    <main className="worker-dashboard db-subpage-container">
      <header className="db-subpage-header">
        <button type="button" className="db-back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1>{titleText}</h1>
      </header>

      {loading && (
        <div className="db-loading-state">
          <JaradeckSpinner size="lg" label="Loading projects..." />
        </div>
      )}

      {error && (
        <div className="db-error-state">
          <p className="db-error-msg">{error}</p>
          <button type="button" className="db-primary-blue-btn db-retry-btn" onClick={fetchProjects}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="dashboard-tab-empty-state">
          <h2>No {statusFilter} projects</h2>
          <p>You currently have no {statusFilter} projects.</p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="db-projects-list-stack">
          {projects.map((project) => {
            const clientName = project.customer?.full_name
              || `${project.customer?.first_name ?? ''} ${project.customer?.last_name ?? ''}`.trim()
              || 'Client';

            return (
              <article key={project.id} className="db-figma-card">
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
                  type="button"
                  className="db-btn-primary-blue"
                  onClick={() => setSelectedProject(project)}
                >
                  View Project Details
                </button>
              </article>
            );
          })}
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
