import { apiFetch } from "./ApiClient";

export const COURSE_IMAGE_BASE_URL = "https://tincode-server.onrender.com/courses";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error en la solicitud");
  return data;
}

export async function getCoursesRequest(page = 1, limit = 6, activeFilter) {
  const query = new URLSearchParams({ page, limit });
  if (typeof activeFilter === "boolean") {
    query.append("active", activeFilter);
  }
  const res = await apiFetch(`/course?${query.toString()}`);
  return handleResponse(res);
}

export async function createCourseRequest(formValues, imageFile) {
  const formData = new FormData();
  formData.append("title", formValues.title);
  formData.append("description", formValues.description);
  formData.append("url", formValues.url);
  formData.append("price", formValues.price);
  formData.append("active", String(formValues.active));
  if (formValues.score !== "" && formValues.score !== undefined) {
    formData.append("score", formValues.score);
  }
  if (imageFile) formData.append("miniature", imageFile);

  const res = await apiFetch("/course", { method: "POST", body: formData });
  return handleResponse(res);
}

export async function updateCourseRequest(id, formValues, imageFile) {
  const formData = new FormData();
  formData.append("title", formValues.title);
  formData.append("description", formValues.description);
  formData.append("url", formValues.url);
  formData.append("price", formValues.price);
  if (formValues.score !== "" && formValues.score !== undefined) {
    formData.append("score", formValues.score);
  }
  if (imageFile) formData.append("miniature", imageFile);

  const res = await apiFetch(`/course/${id}`, { method: "PATCH", body: formData });
  return handleResponse(res);
}

export async function toggleCourseStatusRequest(id, active) {
  const formData = new FormData();
  formData.append("active", String(active));

  const res = await apiFetch(`/course/${id}`, { method: "PATCH", body: formData });
  return handleResponse(res);
}

export async function deleteCourseRequest(id) {
  const res = await apiFetch(`/course/${id}`, { method: "DELETE" });
  return handleResponse(res);
}