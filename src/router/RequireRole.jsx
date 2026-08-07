// src/router/RequireRole.jsx
import { Navigate } from "react-router-dom";
import { usePermissions } from "../Hooks/usePermissions";

export function RequireRole({ role, children }) {
  const { hasRole } = usePermissions();

  if (!hasRole(role)) {
    return <Navigate to="/admin/users" replace />;
  }

  return children;
}