/* ===========================================
   API helper - wraps fetch(), attaches JWT,
   and redirects to login on 401/403.
   =========================================== */

// Change this if the API is deployed somewhere else
const API_BASE_URL = 'http://localhost:5000/api';

const LOW_STOCK_THRESHOLD = 5;

function getToken() {
  return localStorage.getItem('ims_token');
}

function setSession(token, username) {
  localStorage.setItem('ims_token', token);
  localStorage.setItem('ims_username', username);
}

function clearSession() {
  localStorage.removeItem('ims_token');
  localStorage.removeItem('ims_username');
}

function getUsername() {
  return localStorage.getItem('ims_username') || 'Admin';
}

// Redirect to login.html if there's no token. Call at the top of every protected page.
function guardPage() {
  if (!getToken()) {
    window.location.href = pathToLogin();
  }
}

// Works whether the current page is in /pages/ or at the root
function pathToLogin() {
  return window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
}

function pathToPages(file) {
  return window.location.pathname.includes('/pages/') ? file : `pages/${file}`;
}

/**
 * apiFetch - thin wrapper around fetch()
 * @param {string} path - e.g. '/products'
 * @param {object} options - fetch options; body can be a plain object (sent as JSON)
 *                            or a FormData instance (sent as multipart, e.g. with an image)
 */
async function apiFetch(path, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, body });
  } catch (networkErr) {
    throw new Error('Could not reach the server. Please check your connection and that the API is running.');
  }

  if (response.status === 401 || response.status === 403) {
    clearSession();
    window.location.href = pathToLogin();
    throw new Error('Session expired. Please log in again.');
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function resolveImageUrl(imagePath) {
  if (!imagePath) return null;
  const origin = API_BASE_URL.replace(/\/api$/, '');
  return `${origin}${imagePath}`;
}
