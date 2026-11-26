import { sb } from './config.js';

export async function me() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { location.href = '/login.html'; return null; }
  return session.user;
}

export function logout() {
  sb.auth.signOut().then(() => location.href = '/');
}
