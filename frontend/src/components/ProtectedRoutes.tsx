import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = "/onboarding",
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="loading-spinner">Loading session...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user.role && allowedRoles.includes(user.role);
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
