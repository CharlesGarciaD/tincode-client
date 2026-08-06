import { useState } from "react";
import { createMenuRequest, updateMenuRequest } from "../../../Services/MenusService";
import "./MenuFormModal.scss";

export function MenuFormModal({ menu, onClose, onSaved }) {
  const isEdit = !!menu;

 const [formValues, setFormValues] = useState({
  title: menu?.title || "",
  path: menu?.path || "",
  order: menu?.order ?? 0,
  active: menu?.active ?? true,
  roles: menu?.roles || ["user"],
});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const validate = () => {
  const newErrors = {};
  if (!formValues.title.trim()) newErrors.title = "Requerido";
  if (!formValues.path.trim()) newErrors.path = "Requerido";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const saved = isEdit
        ? await updateMenuRequest(menu._id, formValues)
        : await createMenuRequest(formValues);
      onSaved(saved);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-modal-overlay" onClick={onClose}>
      <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
        <div className="menu-modal__header">
          <h2>{isEdit ? "Editar ítem de menú" : "Nuevo ítem de menú"}</h2>
          <button className="menu-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="menu-modal__form">
          <div className="menu-modal__field">
          <label>Nombre</label>
            <input
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Ej. Inicio, Cursos, Contacto"
                className={errors.title ? "input-error" : ""}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

          <div className="menu-modal__field">
            <label>Enlace (URL)</label>
            <input
                name="path"
                value={formValues.path}
                onChange={handleChange}
                placeholder="/cursos"
                className={errors.path ? "input-error" : ""}
            />
            {errors.path && <span className="field-error">{errors.path}</span>}
            </div>

          <div className="menu-modal__row">
            <div className="menu-modal__field">
              <label>Orden</label>
              <input
                type="number"
                name="order"
                value={formValues.order}
                onChange={handleChange}
              />
            </div>

            <div className="menu-modal__field menu-modal__field--checkbox">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formValues.active}
                  onChange={handleChange}
                />
                Activo
              </label>
            </div>
          </div>

          {serverError && <p className="menu-modal__error">{serverError}</p>}

          <div className="menu-modal__footer">
            <button type="button" className="secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear ítem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}