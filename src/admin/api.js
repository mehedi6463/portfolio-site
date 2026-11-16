/** Client for the dev-server admin API (admin-server/vite-plugin-admin.js). */
const BASE = '/__admin/api';
const HEADERS = { 'X-Admin-Request': '1' };

/** Fired when the server says the session is gone, so the UI can show the login page. */
export const SESSION_EXPIRED = 'admin:session-expired';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !res.url.includes('/auth/')) window.dispatchEvent(new Event(SESSION_EXPIRED));
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status });
  return data;
}

const opts = (extra = {}) => ({ credentials: 'same-origin', cache: 'no-store', ...extra, headers: { ...HEADERS, ...extra.headers } });

/* ---- auth ---- */
export const getSession = () => fetch(`${BASE}/auth/session`, opts()).then(handle);

export const login = (username, password) =>
  fetch(
    `${BASE}/auth/login`,
    opts({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }),
  ).then(handle);

export const logout = () => fetch(`${BASE}/auth/logout`, opts({ method: 'POST' })).then(handle);

/* ---- content ---- */
export const loadContent = () => fetch(`${BASE}/content`, opts()).then(handle);

export const saveContent = (content) =>
  fetch(
    `${BASE}/content`,
    opts({ method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }),
  ).then(handle);

export const uploadFile = (file, { maxWidth } = {}) => {
  const params = new URLSearchParams({ name: file.name });
  if (maxWidth) params.set('maxWidth', String(maxWidth));
  return fetch(
    `${BASE}/upload?${params}`,
    opts({ method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file }),
  ).then(handle);
};
