// Selecciona Firebase (si está configurado) o el modo local (pruebas).
import { isFirebaseConfigured } from '../config.js';

export const mode = isFirebaseConfigured() ? 'firebase' : 'local';

let impl = null;
async function get() {
  if (!impl) impl = mode === 'firebase' ? await import('./firebase.js') : await import('./local.js');
  return impl;
}

export const onAuth = async (cb) => (await get()).onAuth(cb);
export const register = async (d) => (await get()).register(d);
export const login = async (email, pass) => (await get()).login(email, pass);
export const logout = async () => (await get()).logout();
export const resetPassword = async (email) => (await get()).resetPassword(email);
export const updateProfileData = async (uid, d) => (await get()).updateProfileData(uid, d);
export const createTicket = async (user, d) => (await get()).createTicket(user, d);
export const listMyTickets = async (uid) => (await get()).listMyTickets(uid);
export const listAllTickets = async () => (await get()).listAllTickets();
export const updateTicket = async (id, d) => (await get()).updateTicket(id, d);
export const listUsers = async () => (await get()).listUsers();

// Traduce códigos de error a mensajes claros en español
export function friendlyError(e) {
  const code = (e && (e.code || e.message)) || '';
  const map = {
    'auth/email-already-in-use': 'Ese correo ya está registrado. Intenta iniciar sesión.',
    'auth/invalid-email': 'El correo no tiene un formato válido.',
    'auth/weak-password': 'La contraseña es muy débil. Usa mínimo 8 caracteres.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
    'auth/network-request-failed': 'Sin conexión a internet. Revisa tu red e inténtalo de nuevo.',
    'auth/operation-not-allowed': 'El registro con correo no está activado en Firebase.',
    'permission-denied': 'No tienes permiso para esta acción (revisa las reglas de Firestore).',
    unavailable: 'No hay conexión con el servidor. Inténtalo más tarde.',
    'local/email-exists': 'Ese correo ya está registrado en este dispositivo.',
    'local/bad-credentials': 'Correo o contraseña incorrectos.',
    'local/no-reset': 'En modo local no se puede recuperar la contraseña.',
  };
  return map[code] || 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
