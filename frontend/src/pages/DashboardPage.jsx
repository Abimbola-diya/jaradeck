import React, { useEffect } from 'react';
import { JaradeckSpinner } from '../components/ui/JaradeckLogo';
import { useDashboard } from '../context/DashboardContext';
import { WorkerDashboardScreen } from '../components/WorkerDashboardScreen';

export default function DashboardPage() {
  const { dashboardData, dashboardLoading, dashboardError, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (dashboardLoading && !dashboardData) {
    return (
      <main className="worker-dashboard flex items-center justify-center min-h-[500px]">
        <JaradeckSpinner size="hero" label="Loading your dashboard..." />
      </main>
    );
  }

  if (dashboardError && !dashboardData) {
    return (
      <main className="worker-dashboard flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 text-center">
        <p className="text-red-600 font-medium text-sm">{dashboardError}</p>
        <button
          className="px-4 py-2 bg-[#0048B3] text-white rounded-full font-medium text-xs hover:bg-blue-700 transition-colors cursor-pointer outline-none"
          onClick={() => fetchDashboard({ force: true })}
          type="button"
        >
          Retry
        </button>
      </main>
    );
  }

  const hasActiveProjects = Boolean(dashboardData?.active_projects?.length > 0);

  return (
    <WorkerDashboardScreen
      initialEmptyState={!hasActiveProjects}
    />
  );
}
