import { apiFetch } from "./ApiClient";

async function handleResponse(res) {
  if (res.status === 404) {
    return [];
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error en la solicitud");
  return data;
}

export async function getMenusRequest(activeFilter) {
  const query = typeof activeFilter === "boolean" ? `?active=${activeFilter}` : "";
  const res = await apiFetch(`/menu${query}`); // 👈 singular
  return handleResponse(res);
}

export async function createMenuRequest(formValues) {
  const res = await apiFetch("/menu", {
    method: "POST",
    body: JSON.stringify(formValues),
  });
  return handleResponse(res);
}

export async function updateMenuRequest(id, formValues) {
  const res = await apiFetch(`/menu/${id}`, {
    method: "PUT", // 👈 PUT, no PATCH
    body: JSON.stringify(formValues),
  });
  return handleResponse(res);
}

export async function toggleMenuStatusRequest(id, active) {
  const res = await apiFetch(`/menu/${id}`, {
    method: "PUT", // 👈 PUT también aquí
    body: JSON.stringify({ active }),
  });
  return handleResponse(res);
}

export async function deleteMenuRequest(id) {
  const res = await apiFetch(`/menu/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error al eliminar");
  return data;
}