import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = "/login", // Redirect unauthenticated users to /login
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-slate-500">
        Loading session...
      </div>
    );
  }

  // If not authenticated, kick to /login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} replace />;
  }

  // If roles are specified and user role doesn't match, send back to home or root dashboard
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user.role && allowedRoles.includes(user.role);
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
