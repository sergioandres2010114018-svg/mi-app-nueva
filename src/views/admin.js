import * as backend from '../services/backend.js';
import { esc, toast, fmtDate, badge, ESTADOS, credit } from '../ui.js';

let filtro = 'todos';

export function render({ user }) {
  if (user.rol !== 'admin') return `<div class="empty"><span>🔒</span><p>Solo para administradores.</p></div>`;
  return `
  <a class="link" href="#/perfil">← Perfil</a>
  <h2 class="title">Panel de administración</h2>
  <div class="stats" id="stats"><div><b>–</b><small>Usuarios</small></div><div><b>–</b><small>Tickets</small></div><div><b>–</b><small>Pendientes</small></div></div>
  <div class="chips" id="chips">
    ${['todos', ...Object.keys(ESTADOS)].map((e) => `<button type="button" data-f="${e}" class="${filtro === e ? 'on' : ''}">${e === 'todos' ? 'Todos' : ESTADOS[e].label}</button>`).join('')}
  </div>
  <div id="lista" class="list"><p class="muted">Cargando…</p></div>
  <h3 class="sub">Usuarios registrados</h3>
  <div id="usuarios" class="list"></div>
  ${credit()}`;
}

export async function mount(root, ctx) {
  if (ctx.user.rol !== 'admin') return;
  let tickets = [];
  const lista = root.querySelector('#lista');

  const paint = () => {
    const f = filtro === 'todos' ? tickets : tickets.filter((t) => t.estado === filtro);
    lista.innerHTML = f.length ? f.map(card).join('') : `<p class="muted">No hay tickets en este filtro.</p>`;
    lista.querySelectorAll('[data-save]').forEach((b) =>
      b.addEventListener('click', async () => {
        const id = b.dataset.save;
        const wrap = b.closest('.ticket');
        const estado = wrap.querySelector('select').value;
        const respuesta = wrap.querySelector('textarea').value.trim();
        b.disabled = true;
        try {
          await backend.updateTicket(id, { estado, respuesta });
          const t = tickets.find((x) => x.id === id);
          Object.assign(t, { estado, respuesta, actualizado: Date.now() });
          toast('Ticket actualizado.', 'ok');
          paint();
        } catch (ex) {
          toast(backend.friendlyError(ex), 'err');
          b.disabled = false;
        }
      })
    );
  };

  root.querySelectorAll('#chips [data-f]').forEach((b) =>
    b.addEventListener('click', () => {
      filtro = b.dataset.f;
      root.querySelectorAll('#chips button').forEach((x) => x.classList.toggle('on', x === b));
      paint();
    })
  );

  try {
    const [t, u] = await Promise.all([backend.listAllTickets(), backend.listUsers()]);
    tickets = t;
    const pend = t.filter((x) => x.estado === 'abierto' || x.estado === 'en_proceso').length;
    root.querySelector('#stats').innerHTML = `<div><b>${u.length}</b><small>Usuarios</small></div><div><b>${t.length}</b><small>Tickets</small></div><div><b>${pend}</b><small>Pendientes</small></div>`;
    root.querySelector('#usuarios').innerHTML = u
      .map((x) => `<div class="row-card static"><span class="ico">👤</span><div><b>${esc(x.nombre)}</b><small>${esc(x.email)}${x.telefono ? ' · ' + esc(x.telefono) : ''}${x.institucion ? ' · ' + esc(x.institucion) : ''}</small></div></div>`)
      .join('');
    paint();
  } catch (ex) {
    lista.innerHTML = `<p class="err">${esc(backend.friendlyError(ex))}</p>`;
  }
}

const card = (t) => `
  <article class="card ticket">
    <div class="between"><b>${esc(t.titulo)}</b>${badge(t.estado)}</div>
    <small class="muted">${esc(t.usuarioNombre)} (${esc(t.usuarioEmail)}) · ${esc(t.categoria)} · Urgencia ${esc(t.prioridad)} · ${fmtDate(t.creado)}</small>
    <p>${esc(t.descripcion)}</p>
    <label class="field"><span>Estado</span>
      <select>${Object.entries(ESTADOS).map(([k, v]) => `<option value="${k}"${t.estado === k ? ' selected' : ''}>${v.label}</option>`).join('')}</select></label>
    <label class="field"><span>Respuesta para el usuario</span><textarea rows="3" maxlength="1000">${esc(t.respuesta || '')}</textarea></label>
    <button class="btn primary sm" data-save="${esc(t.id)}">Guardar</button>
  </article>`;
