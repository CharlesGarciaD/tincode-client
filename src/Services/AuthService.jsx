// src/services/authService.js
const API_URL = 'https://tincode-server.onrender.com/api/v1';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || 'Error en la solicitud');
  }
  return data;
}

export async function loginRequest(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res); // { msg, access, refresh }
}

export async function registerRequest({ firstname, lastname, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname, lastname, email, password }),
  });
  return handleResponse(res); // { msg, user }
}

export async function refreshAccessTokenRequest(refreshToken) {
  const res = await fetch(`${API_URL}/auth/refresh_access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
  return handleResponse(res); // { accessToken }
}