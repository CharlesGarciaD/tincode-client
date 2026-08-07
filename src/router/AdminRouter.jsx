// src/router/AdminRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";
import { Auth } from "../Components/Admin/Auth";
import { Users, Blog, Courses, Menu, Newsletter } from "../pages/admin";
import { useAuth } from "../Hooks/UseAuth";
import { RequireRole } from "./RequireRole";

export function AdminRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Auth />} />

      <Route
        path="/"
        element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin" replace />}
      >
        {/* Solo admins pueden gestionar usuarios */}
        <Route
          path="users"
          element={
            <RequireRole role="admin">
              <Users />
            </RequireRole>
          }
        />

        {/* Editores y admins pueden gestionar blog/cursos/menú */}
        <Route
          path="blog"
          element={
            <RequireRole role="editor">
              <Blog />
            </RequireRole>
          }
        />
        <Route
          path="courses"
          element={
            <RequireRole role="editor">
              <Courses />
            </RequireRole>
          }
        />
        <Route
          path="menu"
          element={
            <RequireRole role="editor">
              <Menu />
            </RequireRole>
          }
        />

        {/* Cualquier usuario logueado puede ver newsletter */}
        <Route path="newsletter" element={<Newsletter />} />
      </Route>
    </Routes>
  );
}
