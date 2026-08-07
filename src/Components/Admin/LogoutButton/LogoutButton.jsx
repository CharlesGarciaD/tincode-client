// src/Components/Admin/LogoutButton/LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Hooks/UseAuth";
import "./LogoutButton.scss";

export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  return (
    <button type="button" onClick={handleLogout} className="logout-button">
      <span>🚪</span> Cerrar sesión
    </button>
  );
}