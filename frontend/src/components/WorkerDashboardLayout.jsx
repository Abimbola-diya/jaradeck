import React from 'react';
import { Outlet } from 'react-router-dom';
import WorkerBottomNav from './WorkerBottomNav';

export default function WorkerDashboardLayout() {
  return (
    <div className="worker-dashboard-container">
      <Outlet />
      <WorkerBottomNav />
    </div>
  );
}
