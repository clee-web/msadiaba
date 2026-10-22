const HASH_KEY = 'madiaba-admin-hash';
const SESSION_KEY = 'madiaba-admin-session';
export const DEFAULT_PASSWORD = 'madiaba2024';

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function ensureAdminAccount() {
  if (!localStorage.getItem(HASH_KEY)) {
    localStorage.setItem(HASH_KEY, await sha256(DEFAULT_PASSWORD));
  }
}

export async function verifyPassword(password) {
  await ensureAdminAccount();
  return (await sha256(password)) === localStorage.getItem(HASH_KEY);
}

export async function changePassword(current, next) {
  if (!(await verifyPassword(current))) return false;
  localStorage.setItem(HASH_KEY, await sha256(next));
  return true;
}

export function isAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function setAuthed(value) {
  if (value) sessionStorage.setItem(SESSION_KEY, '1');
  else sessionStorage.removeItem(SESSION_KEY);
}
