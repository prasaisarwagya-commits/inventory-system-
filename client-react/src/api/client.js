import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
export const LOW_STOCK_THRESHOLD = 5;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ims_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralised handling: on 401/403, clear the session and bounce to login.
// Any other error is normalised to a plain message string on err.message
// so components can just show err.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('ims_token');
      localStorage.removeItem('ims_username');
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = '/login';
      }
    }

    const message = error.response?.data?.message
      || (error.request && !error.response ? 'Could not reach the server. Please check your connection and that the API is running.' : error.message);

    return Promise.reject(new Error(message));
  }
);

export function resolveImageUrl(imagePath) {
  if (!imagePath) return null;
  return `${API_ORIGIN}${imagePath}`;
}

export default api;
