import { CREDITS } from './config.js';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let toastTimer;
export function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.className = 'toast'), 3500);
}

export const fmtDate = (ms) =>
  ms ? new Date(ms).toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

export const ESTADOS = {
  abierto: { label: 'Abierto', cls: 'b-open' },
  en_proceso: { label: 'En proceso', cls: 'b-proc' },
  resuelto: { label: 'Resuelto', cls: 'b-ok' },
  cerrado: { label: 'Cerrado', cls: 'b-closed' },
};
export const badge = (estado) => {
  const e = ESTADOS[estado] || ESTADOS.abierto;
  return `<span class="badge ${e.cls}">${e.label}</span>`;
};

export const CATEGORIAS = [
  'Computador lento',
  'Virus o seguridad',
  'Internet / WiFi',
  'Programas / Office',
  'Videollamadas (Meet / Zoom)',
  'Contraseñas / cuentas',
  'Otro',
];

export const credit = () => `<footer class="credit"><img src="./assets/img/logo.png" alt="" /><p>${esc(CREDITS)}</p></footer>`;
