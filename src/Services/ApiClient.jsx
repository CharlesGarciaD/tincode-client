// src/Services/ApiClient.jsx
/*const API_URL = 'https://tincode-server.onrender.com/api/v1';*/
// src/Services/ApiClient.jsx
const API_URL = "https://tincode-server.onrender.com/api/v1";
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No hay refresh token');

  const res = await fetch(`${API_URL}/auth/refresh_access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!res.ok) throw new Error('No se pudo renovar la sesión');

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
}

export async function apiFetch(endpoint, options = {}) {
  const accessToken = localStorage.getItem('accessToken');

  const doFetch = (token) => {
    const isFormData = options.body instanceof FormData;
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  let response = await doFetch(accessToken);

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newToken);
        response = await doFetch(newToken);
      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin';
        throw err;
      }
    } else {
      response = await new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          resolve(doFetch(newToken));
        });
      });
    }
  }

  return response;
}