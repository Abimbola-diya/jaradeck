import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../lib/api';

const DashboardContext = createContext(null);

const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

function getLocalToken() {
  return localStorage.getItem('jaradeck_token') || null;
}

export function DashboardProvider({ children }) {
  // Dashboard data cache
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [isDashboardRevalidating, setIsDashboardRevalidating] = useState(false);
  const dashboardLastFetchedRef = useRef(0);

  // Projects cache map: { [statusFilter]: { data: [...], timestamp: number } }
  const [projectsCache, setProjectsCache] = useState({});
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  /**
   * Fetch worker dashboard data with SWR (Stale-While-Revalidate) caching.
   * If cache exists, returns cached data immediately (0ms delay) and revalidates silently.
   */
  const fetchDashboard = useCallback(async (options = {}) => {
    const { force = false, silent = false } = options;
    const token = getLocalToken();
    if (!token) return null;

    const now = Date.now();
    const isStale = now - dashboardLastFetchedRef.current > CACHE_TTL_MS;

    // If we have cached data and not forced/stale, don't show loader, return cache
    if (dashboardData && !force && !isStale) {
      setDashboardLoading(false);
      return dashboardData;
    }

    // If we already have data, revalidate silently without setting loading=true
    const isInitialFetch = !dashboardData;
    if (isInitialFetch && !silent) {
      setDashboardLoading(true);
    } else {
      setIsDashboardRevalidating(true);
    }

    setDashboardError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/worker/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('jaradeck_token');
        localStorage.removeItem('jaradeck_user');
        window.location.href = '/login';
        return null;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Error ${res.status}`);
      }

      const json = await res.json();
      setDashboardData(json);
      dashboardLastFetchedRef.current = Date.now();
      return json;
    } catch (err) {
      if (isInitialFetch) {
        setDashboardError(err.message || 'Failed to load dashboard data.');
      }
      return null;
    } finally {
      setDashboardLoading(false);
      setIsDashboardRevalidating(false);
    }
  }, [dashboardData]);

  /**
   * Fetch worker projects with status filter & SWR caching.
   */
  const fetchProjects = useCallback(async (statusFilter = 'active', options = {}) => {
    const { force = false } = options;
    const token = getLocalToken();
    if (!token) return [];

    const cached = projectsCache[statusFilter];
    const now = Date.now();
    const isStale = !cached || (now - cached.timestamp > CACHE_TTL_MS);

    if (cached && !force && !isStale) {
      setProjectsLoading(false);
      return cached.data;
    }

    const isInitial = !cached;
    if (isInitial) {
      setProjectsLoading(true);
    }

    setProjectsError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/worker/projects?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('jaradeck_token');
        localStorage.removeItem('jaradeck_user');
        window.location.href = '/login';
        return [];
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Error ${res.status}`);
      }

      const json = await res.json();
      setProjectsCache((prev) => ({
        ...prev,
        [statusFilter]: { data: json, timestamp: Date.now() },
      }));
      return json;
    } catch (err) {
      if (isInitial) {
        setProjectsError(err.message || 'Failed to load projects.');
      }
      return cached?.data || [];
    } finally {
      setProjectsLoading(false);
    }
  }, [projectsCache]);

  /**
   * Optimistically update project in state
   */
  const updateProjectInCache = useCallback((updatedProject) => {
    if (!updatedProject?.id) return;

    setDashboardData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        active_projects: prev.active_projects.map((p) =>
          p.id === updatedProject.id ? { ...p, ...updatedProject } : p
        ),
        recent_completed: prev.recent_completed.map((p) =>
          p.id === updatedProject.id ? { ...p, ...updatedProject } : p
        ),
      };
    });

    setProjectsCache((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (next[key]?.data) {
          next[key] = {
            ...next[key],
            data: next[key].data.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p)),
          };
        }
      });
      return next;
    });
  }, []);

  const clearCache = useCallback(() => {
    setDashboardData(null);
    setDashboardLoading(true);
    setProjectsCache({});
    dashboardLastFetchedRef.current = 0;
  }, []);

  const value = {
    dashboardData,
    dashboardLoading,
    dashboardError,
    isDashboardRevalidating,
    fetchDashboard,
    projectsCache,
    projectsLoading,
    projectsError,
    fetchProjects,
    updateProjectInCache,
    clearCache,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return ctx;
}
