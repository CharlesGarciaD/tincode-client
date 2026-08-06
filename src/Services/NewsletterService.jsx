import { apiFetch } from "./ApiClient";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.message || "Error en la solicitud");
  return data;
}

/**
 * Obtiene la lista paginada de suscriptores del newsletter.
 * @param {number} page
 * @param {number} limit
 * @param {boolean|undefined} activeFilter - true=activos, false=inactivos, undefined=todos
 * @param {string} search - búsqueda por email
 */
export async function getNewsletterEmailsRequest(page = 1, limit = 6, activeFilter, search = "") {
  const query = new URLSearchParams({ page, limit });
  if (typeof activeFilter === "boolean") {
    query.append("active", activeFilter);
  }
  if (search) {
    query.append("search", search);
  }
  const res = await apiFetch(`/newsletter?${query.toString()}`);
  return handleResponse(res);
}

/**
 * Cambia el estado (activo/inactivo) de un suscriptor.
 */
export async function toggleNewsletterStatusRequest(id, active) {
  const res = await apiFetch(`/newsletter/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  return handleResponse(res);
}

/**
 * Elimina un registro de suscriptor.
 */
export async function deleteNewsletterEmailRequest(id) {
  const res = await apiFetch(`/newsletter/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
