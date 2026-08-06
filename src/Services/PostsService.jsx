import { apiFetch } from "./ApiClient";

// Ajusta este puerto/host si tu servidor de imágenes está en otro lugar.
// Las imágenes de posts se guardan en uploads/post/, servido como /post/<archivo>
export const POST_IMAGE_BASE_URL = "http://localhost:3977/post";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.message || "Error en la solicitud");
  return data;
}

/**
 * Obtiene los posts paginados.
 * Respuesta esperada (mongoose-paginate-v2):
 * { docs, totalDocs, totalPages, page, limit, hasNextPage, hasPrevPage, ... }
 */
export async function getPostsRequest(page = 1, limit = 6) {
  const query = new URLSearchParams({ page, limit });
  const res = await apiFetch(`/post?${query.toString()}`);
  return handleResponse(res);
}

/**
 * Obtiene un post por su path (slug), útil si necesitas precargar por URL amigable.
 */
export async function getPostByPathRequest(path) {
  const query = new URLSearchParams({ path });
  const res = await apiFetch(`/post/path?${query.toString()}`);
  return handleResponse(res);
}

/**
 * Crea un nuevo post. La imagen es obligatoria (el backend la exige con req.file).
 */
export async function createPostRequest(formValues, imageFile) {
  const formData = new FormData();
  formData.append("title", formValues.title);
  formData.append("content", formValues.content);
  formData.append("path", formValues.path);
  if (imageFile) formData.append("miniature", imageFile);

  const res = await apiFetch("/post", { method: "POST", body: formData });
  return handleResponse(res);
}

/**
 * Actualiza un post existente. La imagen es opcional: si no se manda,
 * el backend conserva la miniatura actual.
 */
export async function updatePostRequest(id, formValues, imageFile) {
  const formData = new FormData();
  formData.append("title", formValues.title);
  formData.append("content", formValues.content);
  formData.append("path", formValues.path);
  if (imageFile) formData.append("miniature", imageFile);

  const res = await apiFetch(`/post/${id}`, { method: "PUT", body: formData });
  return handleResponse(res);
}

/**
 * Elimina un post.
 */
export async function deletePostRequest(id) {
  const res = await apiFetch(`/post/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
