import React from 'react';
import { Outlet } from 'react-router-dom';
import WorkerBottomNav from './WorkerBottomNav';
import { DashboardProvider } from '../context/DashboardContext';

export default function WorkerDashboardLayout() {
  return (
    <DashboardProvider>
      <div className="worker-dashboard-container">
        <Outlet />
        <WorkerBottomNav />
      </div>
    </DashboardProvider>
  );
}
