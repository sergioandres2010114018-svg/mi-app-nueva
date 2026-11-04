import { GUIAS } from '../data/guias.js';
import { esc, credit } from '../ui.js';

export function render({ params }) {
  if (params[0]) return detail(params[0]);
  return `
  <h2 class="title">Guías de solución</h2>
  <p class="muted">Intenta resolverlo tú mismo con estos pasos. Si no funciona, crea un ticket.</p>
  <input id="q" class="search" type="search" placeholder="Buscar: lento, wifi, virus…" aria-label="Buscar guías" />
  <div id="lista" class="list">${GUIAS.map(item).join('')}</div>
  ${credit()}`;
}

const item = (g) => `
  <a class="row-card" href="#/guias/${g.id}" data-text="${esc((g.titulo + ' ' + g.resumen).toLowerCase())}">
    <span class="ico">${g.icono}</span>
    <div><b>${esc(g.titulo)}</b><small>${esc(g.resumen)}</small></div><i>›</i>
  </a>`;

function detail(id) {
  const g = GUIAS.find((x) => x.id === id);
  if (!g) return `<p>Guía no encontrada.</p><a class="link" href="#/guias">← Volver</a>`;
  return `
  <a class="link" href="#/guias">← Todas las guías</a>
  <h2 class="title">${g.icono} ${esc(g.titulo)}</h2>
  <ol class="steps">${g.pasos.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
  ${g.aviso ? `<div class="notice warn">${esc(g.aviso)}</div>` : ''}
  <div class="notice">${esc(g.ayuda)}</div>
  <a class="btn primary block" href="#/tickets/nuevo">🎫 Aún necesito ayuda</a>
  ${credit()}`;
}

export function mount(root) {
  const q = root.querySelector('#q');
  if (!q) return;
  q.addEventListener('input', () => {
    const t = q.value.trim().toLowerCase();
    root.querySelectorAll('#lista .row-card').forEach((el) => {
      el.style.display = !t || el.dataset.text.includes(t) ? '' : 'none';
    });
  });
}
