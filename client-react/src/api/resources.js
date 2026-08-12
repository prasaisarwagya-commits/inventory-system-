import api from './client';

// ---------- Auth ----------
export function register(username, password) {
  return api.post('/auth/register', { username, password }).then((res) => res.data);
}

export function login(username, password) {
  return api.post('/auth/login', { username, password }).then((res) => res.data);
}

export function fetchMe() {
  return api.get('/auth/me').then((res) => res.data);
}

// ---------- Suppliers ----------
export function fetchSuppliers() {
  return api.get('/suppliers').then((res) => res.data);
}

export function fetchSupplier(id) {
  return api.get(`/suppliers/${id}`).then((res) => res.data);
}

export function createSupplier(payload) {
  return api.post('/suppliers', payload).then((res) => res.data);
}

export function updateSupplier(id, payload) {
  return api.put(`/suppliers/${id}`, payload).then((res) => res.data);
}

export function deleteSupplier(id) {
  return api.delete(`/suppliers/${id}`).then((res) => res.data);
}

// ---------- Products ----------
export function fetchProducts({ search, supplierId } = {}) {
  const params = {};
  if (search) params.search = search;
  if (supplierId) params.supplierId = supplierId;
  return api.get('/products', { params }).then((res) => res.data);
}

export function fetchProduct(id) {
  return api.get(`/products/${id}`).then((res) => res.data);
}

export function createProduct(formData) {
  return api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
}

export function updateProduct(id, formData) {
  return api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`).then((res) => res.data);
}
