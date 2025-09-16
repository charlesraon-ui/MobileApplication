// src/apiClient.js
const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("pos-token");
export const setToken = (t) => localStorage.setItem("pos-token", t);
export const clearToken = () => localStorage.removeItem("pos-token");
export const isAuthed = () => !!getToken();

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Unified JSON parse + 401 handling
const parse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) clearToken(); // auto-logout on invalid token
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

/* ---------- PUBLIC (optional convenience) ---------- */
export const login = async ({ email, password }) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parse(res);
  if (data.token) setToken(data.token);
  return data;
};

export const register = async ({ name, email, password }) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await parse(res);
  if (data.token) setToken(data.token);
  return data;
};

/* ---------- AUTHENTICATED CALLS ---------- */
export const getMe = async () => {
  const res = await fetch(`${API}/me`, { headers: { ...authHeaders() } });
  return parse(res); // -> { user: { id, name, email, role } }
};

export const getMyCart = async () => {
  const res = await fetch(`${API}/me/cart`, { headers: { ...authHeaders() } });
  return parse(res);
};

export const setMyCart = async (items) => {
  const res = await fetch(`${API}/me/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ items }),
  });
  return parse(res);
};

export const getMyOrders = async () => {
  const res = await fetch(`${API}/me/orders`, { headers: { ...authHeaders() } });
  return parse(res);
};

export const createMyOrder = async (order) => {
  const res = await fetch(`${API}/me/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(order),
  });
  return parse(res);
};
