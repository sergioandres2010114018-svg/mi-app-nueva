import * as backend from '../services/backend.js';
import { esc, toast, credit } from '../ui.js';
import { APP_NAME, APP_VERSION } from '../config.js';

export function render({ user }) {
  const admin = user.rol === 'admin';
  return `
  <h2 class="title">Mi perfil</h2>
  <section class="card profile">
    <div class="avatar">${esc((user.nombre || '?').trim().charAt(0).toUpperCase())}</div>
    <div><b>${esc(user.nombre)}</b><small>${esc(user.email)}</small>${admin ? '<span class="badge b-ok">Administrador</span>' : ''}</div>
  </section>

  <form id="f-perfil" class="card" novalidate>
    <h3>Mis datos</h3>
    <label class="field"><span>Nombre completo</span><input id="p-nombre" value="${esc(user.nombre)}" required /></label>
    <label class="field"><span>Celular</span><input id="p-tel" type="tel" inputmode="tel" value="${esc(user.telefono || '')}" /></label>
    <label class="field"><span>Institución o empresa</span><input id="p-inst" value="${esc(user.institucion || '')}" /></label>
    <p class="err" id="p-err" role="alert"></p>
    <button class="btn primary block" type="submit">Guardar cambios</button>
  </form>

  ${admin ? `<a class="btn ghost block" href="#/admin">🛡️ Panel de administración</a>` : ''}
  <a class="btn ghost block" href="#/proyecto">📘 Ver el proyecto</a>
  <button class="btn danger block" id="logout">Cerrar sesión</button>
  <p class="muted center">${esc(APP_NAME)} · v${APP_VERSION}</p>
  ${credit()}`;
}

export function mount(root, { user, nav, refresh }) {
  root.querySelector('#f-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = root.querySelector('#p-err');
    const nombre = root.querySelector('#p-nombre').value.trim();
    const telefono = root.querySelector('#p-tel').value.trim();
    const institucion = root.querySelector('#p-inst').value.trim();
    err.textContent = '';
    if (nombre.length < 3) return (err.textContent = 'Escribe tu nombre completo.');
    if (telefono && !/^[0-9+\s-]{7,15}$/.test(telefono)) return (err.textContent = 'Celular no válido.');
    try {
      await backend.updateProfileData(user.uid, { nombre, telefono, institucion });
      Object.assign(user, { nombre, telefono, institucion });
      toast('Datos actualizados.', 'ok');
      refresh();
    } catch (ex) {
      err.textContent = backend.friendlyError(ex);
    }
  });
  root.querySelector('#logout').addEventListener('click', async () => {
    await backend.logout();
    nav('/login');
  });
}
