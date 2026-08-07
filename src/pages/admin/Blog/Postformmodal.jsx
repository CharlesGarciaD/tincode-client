import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { PostImageUploader } from "./Postimageuploader";
import { usePostValidation } from "./Usepostvalidation";
import { createPostRequest, updatePostRequest, POST_IMAGE_BASE_URL } from "../../../Services/PostsService";
import "./PostFormModal.scss";

const emptyForm = {
  title: "",
  content: "",
  path: "",
  imagen: null,
};

function buildInitialForm(post) {
  if (!post) return emptyForm;
  return {
    title: post.title || "",
    content: post.content || "",
    path: post.path || "",
    imagen: post.miniature || null, // string = imagen existente
  };
}

/**
 * props:
 * - post: objeto post | null -> si viene, el modal entra en modo edición
 * - onClose: () => void
 * - onSaved: () => void
 *
 * Nota: este modal se monta/desmonta por completo cada vez que se abre
 * (ver Blog.jsx: `{modalOpen && <PostFormModal ... />}`), así que es seguro
 * inicializar el estado directamente a partir de `post` sin usar un efecto.
 */
export function PostFormModal({ post, onClose, onSaved }) {
  const [form, setForm] = useState(() => buildInitialForm(post));
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { errors, validate, clearError } = usePostValidation();

  const isEdit = Boolean(post);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  // Genera automáticamente el slug a partir del título, solo si el usuario
  // no ha tocado el campo "path" manualmente todavía.
  const [pathTouched, setPathTouched] = useState(false);
  const handleTitleChange = (value) => {
    handleChange("title", value);
    if (!pathTouched) {
      const slug = value
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      handleChange("path", slug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const isValid = validate(form, { isEdit });
    if (!isValid) return;

    const imageFile = form.imagen instanceof File ? form.imagen : null;

    try {
      setLoading(true);
      if (isEdit) {
        await updatePostRequest(post._id, form, imageFile);
      } else {
        await createPostRequest(form, imageFile);
      }
      onSaved();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const existingImageUrl =
    isEdit && typeof form.imagen === "string"
      ? `${POST_IMAGE_BASE_URL}/${form.imagen}`
      : null;

  return (
    <div className="post-modal-overlay">
      <div className="post-modal">
        <div className="post-modal__header">
          <h2>{isEdit ? "Editar post" : "Nuevo post"}</h2>
          <button onClick={onClose} className="post-modal__close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-modal__body">
          {apiError && <div className="post-modal__api-error">{apiError}</div>}

          <PostImageUploader
            value={form.imagen}
            onChange={(file) => handleChange("imagen", file)}
            error={errors.imagen}
            existingImageUrl={existingImageUrl}
          />

          <div className="post-modal__field">
            <label>Título</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej: 5 nuevas funciones increíbles de Next.js"
              className={errors.title ? "has-error" : ""}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div className="post-modal__field">
            <label>
              Path (slug) <span className="muted">— usado en la URL del post</span>
            </label>
            <input
              type="text"
              value={form.path}
              onChange={(e) => {
                setPathTouched(true);
                handleChange("path", e.target.value);
              }}
              placeholder="ej-mi-nuevo-post"
              className={errors.path ? "has-error" : ""}
            />
            {errors.path && <p className="field-error">{errors.path}</p>}
          </div>

          <div className="post-modal__field">
            <label>Contenido</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={form.content}
              onEditorChange={(content) => handleChange("content", content)}
              init={{
                height: 350,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | " +
                  "alignleft aligncenter alignright | bullist numlist | " +
                  "link image | code fullscreen",
                content_style:
                  "body { font-family: Inter, sans-serif; font-size: 15px }",
              }}
            />
            {errors.content && <p className="field-error">{errors.content}</p>}
          </div>

          <div className="post-modal__actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
