const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getAdminToken  = ()        => localStorage.getItem('vw_admin_token');
export const setAdminToken  = (token)   => localStorage.setItem('vw_admin_token', token);
export const clearAdminToken = ()       => localStorage.removeItem('vw_admin_token');

function adminHeaders(extra = {}) {
  const token = getAdminToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// ── Admin auth ────────────────────────────────────────────────────────────────
export async function adminLogin(username, password) {
  const res = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function verifyAdminToken(token) {
  const res = await fetch(`${BASE}/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

// ── Products ──────────────────────────────────────────────────────────────────
export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/products${qs ? '?' + qs : ''}`);
  return res.json();
}

export async function createProduct(formData) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: adminHeaders(), // JWT — no Content-Type, let browser set multipart boundary
    body: formData,
  });
  return res.json();
}

export async function updateProduct(id, formData) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: formData,
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  return res.json();
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export async function fetchAnalytics() {
  const res = await fetch(`${BASE}/analytics/summary`, {
    headers: adminHeaders(),
  });
  return res.json();
}

export async function trackActivity(user) {
  if (!user) return;
  await fetch(`${BASE}/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: user.uid, email: user.email, name: user.displayName }),
  }).catch(() => {}); // silent fail — analytics should never break the app
}

// ── Cart persistence ──────────────────────────────────────────────────────────
export async function getSavedCart(uid) {
  const res = await fetch(`${BASE}/cart/${uid}`);
  return res.json();
}

export async function saveCart(uid, items) {
  const res = await fetch(`${BASE}/cart/${uid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  return res.json();
}

export async function clearSavedCart(uid) {
  await fetch(`${BASE}/cart/${uid}`, { method: 'DELETE' });
}

// ── Orders ────────────────────────────────────────────────────────────────────
export async function createOrder(orderData) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
}

export async function getUserOrders(uid) {
  const res = await fetch(`${BASE}/orders/${uid}`);
  return res.json();
}
