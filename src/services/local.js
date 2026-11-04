// MODO LOCAL: guarda todo en el celular (localStorage). Solo para pruebas.
// El primer usuario que se registra queda como administrador.

const K_USERS = 'stv_users';
const K_SESSION = 'stv_session';
const K_TICKETS = 'stv_tickets';

let listener = null;

const read = (k, def) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? def;
  } catch {
    return def;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

async function hash(email, password) {
  const text = `${email.toLowerCase()}::${password}::stv`;
  if (globalThis.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(unescape(encodeURIComponent(text)));
}

const publicUser = (u) => ({ uid: u.uid, email: u.email, nombre: u.nombre, telefono: u.telefono, institucion: u.institucion, rol: u.rol, creado: u.creado });
const err = (code) => Object.assign(new Error(code), { code });

export function onAuth(cb) {
  listener = cb;
  const uid = localStorage.getItem(K_SESSION);
  const u = read(K_USERS, []).find((x) => x.uid === uid);
  setTimeout(() => cb(u ? publicUser(u) : null), 0);
}

export async function register({ nombre, email, password, telefono, institucion }) {
  const users = read(K_USERS, []);
  const mail = email.trim().toLowerCase();
  if (users.some((u) => u.email === mail)) throw err('local/email-exists');
  const user = {
    uid: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    email: mail,
    nombre,
    telefono: telefono || '',
    institucion: institucion || '',
    rol: users.length === 0 ? 'admin' : 'usuario',
    creado: Date.now(),
    pass: await hash(mail, password),
  };
  users.push(user);
  write(K_USERS, users);
  localStorage.setItem(K_SESSION, user.uid);
  const pub = publicUser(user);
  if (listener) listener(pub);
  return pub;
}

export async function login(email, password) {
  const mail = email.trim().toLowerCase();
  const u = read(K_USERS, []).find((x) => x.email === mail);
  if (!u || u.pass !== (await hash(mail, password))) throw err('local/bad-credentials');
  localStorage.setItem(K_SESSION, u.uid);
  const pub = publicUser(u);
  if (listener) listener(pub);
  return pub;
}

export async function logout() {
  localStorage.removeItem(K_SESSION);
  if (listener) listener(null);
}

export async function resetPassword() {
  throw err('local/no-reset');
}

export async function updateProfileData(uid, d) {
  const users = read(K_USERS, []);
  const u = users.find((x) => x.uid === uid);
  if (u) Object.assign(u, { nombre: d.nombre, telefono: d.telefono, institucion: d.institucion });
  write(K_USERS, users);
}

export async function createTicket(user, d) {
  const tickets = read(K_TICKETS, []);
  const now = Date.now();
  const t = {
    id: 't' + now.toString(36),
    uid: user.uid,
    usuarioNombre: user.nombre,
    usuarioEmail: user.email,
    titulo: d.titulo,
    categoria: d.categoria,
    prioridad: d.prioridad,
    descripcion: d.descripcion,
    estado: 'abierto',
    respuesta: '',
    creado: now,
    actualizado: now,
  };
  tickets.push(t);
  write(K_TICKETS, tickets);
  return t;
}

const byDateDesc = (a, b) => (b.creado || 0) - (a.creado || 0);
export const listMyTickets = async (uid) => read(K_TICKETS, []).filter((t) => t.uid === uid).sort(byDateDesc);
export const listAllTickets = async () => read(K_TICKETS, []).sort(byDateDesc);

export async function updateTicket(id, { estado, respuesta }) {
  const tickets = read(K_TICKETS, []);
  const t = tickets.find((x) => x.id === id);
  if (t) Object.assign(t, { estado, respuesta, actualizado: Date.now() });
  write(K_TICKETS, tickets);
}

export const listUsers = async () => read(K_USERS, []).map(publicUser).sort((a, b) => (b.creado || 0) - (a.creado || 0));
