import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/svg/tincode-white.svg";
import { useAuth } from "../../../hooks/useAuth";
import "./Auth.scss";

export function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // "login" | "register"
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null); // { type: 'error' | 'success', text: string }

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const isRegister = mode === "register";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setErrors({});
    setServerMessage(null);
  };

  const validate = () => {
    const newErrors = {};

    if (isRegister && !formData.firstname.trim()) {
      newErrors.firstname = "El nombre es obligatorio";
    }

    if (isRegister && !formData.lastname.trim()) {
      newErrors.lastname = "El apellido es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (isRegister && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage(null);

    if (!validate()) return;

    setLoading(true);

    try {
      if (isRegister) {
        await register({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
        });

        setServerMessage({
          type: "success",
          text: "Cuenta creada correctamente. Un administrador debe activarla antes de que puedas iniciar sesión.",
        });
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => switchMode("login"), 2500);
      } else {
        await login(formData.email, formData.password);

        setServerMessage({ type: "success", text: "Inicio de sesión correcto." });
        navigate("/admin/users"); // ajusta a la ruta real de tu panel
      }
    } catch (err) {
      setServerMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Panel de marca */}
      <div className="auth-panel auth-panel--brand">
        <div className="auth-panel__content">
          <img src={logo} alt="Tincode" className="auth-panel__logo" />
          <h1>Panel administrativo</h1>
          <p>Gestiona tu contenido, usuarios y cursos desde un solo lugar.</p>
        </div>
      </div>

      {/* Panel de formulario */}
      <div className="auth-panel auth-panel--form">
        <div className="auth-box">
          <div className="auth-tabs">
            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Registrarse
            </button>
            <span
              className="auth-tabs__indicator"
              style={{ transform: isRegister ? "translateX(100%)" : "translateX(0)" }}
            />
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="firstname">Nombre</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={errors.firstname ? "input-error" : ""}
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                />
                {errors.firstname && (
                  <span className="field-error">{errors.firstname}</span>
                )}
              </div>
            )}

            {isRegister && (
              <div className="auth-field">
                <label htmlFor="lastname">Apellido</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={errors.lastname ? "input-error" : ""}
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                />
                {errors.lastname && (
                  <span className="field-error">{errors.lastname}</span>
                )}
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                placeholder="••••••••"
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            {isRegister && (
              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "input-error" : ""}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {!isRegister && (
              <div className="auth-form__options">
                <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
              </div>
            )}

            {serverMessage && (
              <p className={`auth-form__message ${serverMessage.type}`}>
                {serverMessage.text}
              </p>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? "Procesando..."
                : isRegister
                ? "Crear cuenta"
                : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
