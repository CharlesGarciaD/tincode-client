import { useRef, useMemo, useEffect } from "react";
import "./Postimageuploader.scss";

/**
 * props:
 * - value: File | string (nombre de archivo existente) | null
 * - onChange: (file: File | null) => void
 * - error: string
 * - existingImageUrl: string | null -> URL completa a mostrar si `value` es un string (modo edición)
 */
export function PostImageUploader({ value, onChange, error, existingImageUrl }) {
  const inputRef = useRef(null);

  // La URL de previsualización se DERIVA de las props, no se guarda en estado:
  // así evitamos llamar setState dentro de un efecto.
  const preview = useMemo(() => {
    if (value instanceof File) return URL.createObjectURL(value);
    if (existingImageUrl) return existingImageUrl;
    return null;
  }, [value, existingImageUrl]);

  // Este efecto NO llama setState: solo libera memoria del navegador
  // cuando la URL temporal (blob) deja de usarse.
  useEffect(() => {
    if (!(value instanceof File) || !preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [value, preview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="post-image-uploader">
      <label className="post-image-uploader__label">Imagen de portada</label>

      <div
        onClick={() => inputRef.current?.click()}
        className={`post-image-uploader__dropzone ${error ? "has-error" : ""}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Vista previa del post" />
            <button
              type="button"
              onClick={handleRemove}
              className="post-image-uploader__remove"
              title="Quitar imagen"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="post-image-uploader__placeholder">
            <span className="icon">🖼️</span>
            <span className="text">Haz clic para subir una imagen</span>
            <span className="hint">JPG, PNG o WEBP · máx. 3MB</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="post-image-uploader__input"
      />

      {error && <p className="post-image-uploader__error">{error}</p>}
    </div>
  );
}
