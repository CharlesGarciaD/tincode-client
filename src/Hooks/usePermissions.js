// src/Hooks/usePermissions.js
import { useAuth } from "./useAuth";

// Define aquí qué rutas/acciones requiere cada rol
const ROLE_HIERARCHY = {
  admin: 3,
  editor: 2,
  user: 1,
};

export function usePermissions() {
  const { user } = useAuth();

  const role = user?.role || "user";

  // ¿Tiene AL MENOS el nivel del rol requerido?
  const hasRole = (requiredRole) => {
    return (ROLE_HIERARCHY[role] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
  };

  // ¿Es exactamente ese rol?
  const isRole = (roleToCheck) => role === roleToCheck;

  return { role, hasRole, isRole };
}