import * as backend from '../services/backend.js';
import { esc, toast, fmtDate, badge, CATEGORIAS, credit } from '../ui.js';

export function render({ params }) {
  if (params[0] === 'nuevo') return form();
  return `
  <div class="between"><h2 class="title">Mis tickets</h2><a class="btn primary sm" href="#/tickets/nuevo">+ Nuevo</a></div>
  <div id="lista" class="list"><p class="muted">Cargando…</p></div>
  ${credit()}`;
}

function form() {
  return `
  <a class="link" href="#/tickets">← Mis tickets</a>
  <h2 class="title">Pedir ayuda</h2>
  <p class="muted">Cuéntanos qué pasa. Mientras más detalle, más rápido podremos ayudarte.</p>
  <form id="f-ticket" class="card" novalidate>
    <label class="field"><span>Tema</span>
      <select id="t-cat">${CATEGORIAS.map((c) => `<option>${esc(c)}</option>`).join('')}</select></label>
    <label class="field"><span>Título corto</span><input id="t-tit" maxlength="80" placeholder="Ej.: Mi portátil tarda mucho en encender" required /></label>
    <label class="field"><span>Describe el problema</span>
      <textarea id="t-desc" rows="5" maxlength="1000" placeholder="¿Desde cuándo pasa? ¿Aparece algún mensaje de error? ¿Qué sistema usas (Windows 10, 11)?" required></textarea></label>
    <label class="field"><span>Urgencia</span>
      <select id="t-pri"><option value="baja">Baja</option><option value="media" selected>Media</option><option value="alta">Alta</option></select></label>
    <div class="notice">No escribas contraseñas ni datos bancarios en el ticket.</div>
    <p class="err" id="t-err" role="alert"></p>
    <button class="btn primary block" type="submit">Enviar ticket</button>
  </form>
  ${credit()}`;
}

const card = (t) => `
  <article class="card ticket">
    <div class="between"><b>${esc(t.titulo)}</b>${badge(t.estado)}</div>
    <small class="muted">${esc(t.categoria)} · Urgencia ${esc(t.prioridad)} · ${fmtDate(t.creado)}</small>
    <p>${esc(t.descripcion)}</p>
    ${t.respuesta ? `<div class="reply"><b>Respuesta del soporte</b><p>${esc(t.respuesta)}</p><small>${fmtDate(t.actualizado)}</small></div>` : ''}
  </article>`;

export async function mount(root, { user, params, nav }) {
  if (params[0] === 'nuevo') {
    const f = root.querySelector('#f-ticket');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = root.querySelector('#t-err');
      const titulo = root.querySelector('#t-tit').value.trim();
      const descripcion = root.querySelector('#t-desc').value.trim();
      err.textContent = '';
      if (titulo.length < 5) return (err.textContent = 'El título debe tener al menos 5 caracteres.');
      if (descripcion.length < 15) return (err.textContent = 'Describe un poco más el problema (mínimo 15 caracteres).');
      const btn = f.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      try {
        await backend.createTicket(user, {
          titulo,
          descripcion,
          categoria: root.querySelector('#t-cat').value,
          prioridad: root.querySelector('#t-pri').value,
        });
        toast('Ticket enviado. Te responderemos pronto.', 'ok');
        nav('/tickets');
      } catch (ex) {
        err.textContent = backend.friendlyError(ex);
        btn.disabled = false;
        btn.textContent = 'Enviar ticket';
      }
    });
    return;
  }
  const box = root.querySelector('#lista');
  try {
    const list = await backend.listMyTickets(user.uid);
    box.innerHTML = list.length
      ? list.map(card).join('')
      : `<div class="empty"><span>🎫</span><p>Aún no tienes tickets.</p><a class="btn primary" href="#/tickets/nuevo">Crear mi primer ticket</a></div>`;
  } catch (ex) {
    box.innerHTML = `<p class="err">${esc(backend.friendlyError(ex))}</p>`;
  }
}
