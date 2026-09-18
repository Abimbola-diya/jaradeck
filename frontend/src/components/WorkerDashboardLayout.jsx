import React from 'react';
import { Outlet } from 'react-router-dom';
import WorkerBottomNav from './WorkerBottomNav';
import { DashboardProvider } from '../context/DashboardContext';

export default function WorkerDashboardLayout() {
  return (
    <DashboardProvider>
      <div className="worker-dashboard-container w-full min-h-screen bg-white flex flex-col items-center">
        <Outlet />
        <WorkerBottomNav />
      </div>
    </DashboardProvider>
  );
}
