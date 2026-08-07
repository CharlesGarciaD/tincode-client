// src/Services/UsersService.jsx
import { apiFetch } from "./ApiClient";

export const AVATAR_BASE_URL = "https://tincode-server.onrender.com";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error en la solicitud");
  return data;
}

export async function getUsersRequest(activeFilter) {
  const query = typeof activeFilter === "boolean" ? `?active=${activeFilter}` : "";
  const res = await apiFetch(`/users${query}`);
  const data = await handleResponse(res);
  return data.response;
}

export async function getMeRequest() {
  const res = await apiFetch("/users/me");
  const data = await handleResponse(res);
  return data.response;
}

export async function createUserRequest(formValues, avatarFile) {
  const formData = new FormData();
  formData.append("firstname", formValues.firstname);
  formData.append("lastname", formValues.lastname);
  formData.append("email", formValues.email);
  formData.append("password", formValues.password);
  formData.append("role", formValues.role);
  formData.append("active", String(formValues.active));
  if (avatarFile) formData.append("avatar", avatarFile);

  const res = await apiFetch("/users", { method: "POST", body: formData });
  const data = await handleResponse(res);
  return data.user;
}

export async function updateUserRequest(id, formValues, avatarFile) {
  const formData = new FormData();
  formData.append("firstname", formValues.firstname);
  formData.append("lastname", formValues.lastname);
  formData.append("email", formValues.email);
  formData.append("role", formValues.role);
  if (formValues.password) formData.append("password", formValues.password);
  if (avatarFile) formData.append("avatar", avatarFile);

  const res = await apiFetch(`/users/${id}`, { method: "PATCH", body: formData });
  const data = await handleResponse(res);
  return data.user;
}

export async function toggleUserStatusRequest(id, active) {
  const formData = new FormData();
  formData.append("active", String(active));

  const res = await apiFetch(`/users/${id}`, { method: "PATCH", body: formData });
  const data = await handleResponse(res);
  return data.user;
}

export async function deleteUserRequest(id) {
  const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
  return handleResponse(res);
}