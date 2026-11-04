import * as backend from '../services/backend.js';
import { esc, credit } from '../ui.js';
import { SUPPORT_WHATSAPP, SUPPORT_EMAIL } from '../config.js';

const TIPS = [
  'Reinicia tu computador al menos una vez por semana: libera memoria y cierra procesos pegados.',
  'Mantén Windows actualizado: las actualizaciones traen correcciones de seguridad y rendimiento.',
  'Nunca compartas tu contraseña, ni siquiera con alguien que diga ser de soporte técnico.',
  'Desconfía de los mensajes con urgencia: "tu cuenta será bloqueada" suele ser phishing.',
  'Haz copia de tus tareas importantes en una USB o en la nube cada semana.',
  'Si queda poco espacio en el disco, el computador se vuelve lento: elimina archivos temporales.',
  'Activa la verificación en dos pasos en tus cuentas de correo y redes sociales.',
];

export function render({ user }) {
  const tip = TIPS[new Date().getDate() % TIPS.length];
  const first = esc((user.nombre || '').split(' ')[0]);
  const wa = SUPPORT_WHATSAPP
    ? `<a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/${encodeURIComponent(SUPPORT_WHATSAPP)}?text=${encodeURIComponent('Hola, necesito ayuda con mi computador.')}">💬 WhatsApp</a>`
    : '';
  const mail = SUPPORT_EMAIL
    ? `<a class="btn ghost" href="mailto:${esc(SUPPORT_EMAIL)}?subject=${encodeURIComponent('Soporte técnico')}">✉️ Correo</a>`
    : '';
  return `
  <section class="hero">
    <img src="./assets/img/logo.png" alt="" />
    <div><h2>¡Hola, ${first}!</h2><p>¿Qué problema tecnológico tienes hoy? Estamos para ayudarte.</p></div>
  </section>

  <div class="grid4">
    <a class="tile" href="#/tickets/nuevo"><span>🎫</span><b>Pedir ayuda</b><small>Crea un ticket</small></a>
    <a class="tile" href="#/guias"><span>🛠️</span><b>Guías</b><small>Resuelve tú mismo</small></a>
    <a class="tile" href="#/videos"><span>🎬</span><b>Videos</b><small>Aprende viendo</small></a>
    <a class="tile" href="#/proyecto"><span>📘</span><b>El proyecto</b><small>Misión y visión</small></a>
  </div>

  <section class="card" id="resumen"><h3>Mis tickets</h3><p class="muted">Cargando…</p></section>

  <section class="card tip"><h3>💡 Consejo del día</h3><p>${esc(tip)}</p></section>

  <section class="card">
    <h3>Video de presentación</h3>
    <video controls preload="metadata" playsinline poster="./assets/video/presentacion.jpg" src="./assets/video/presentacion.mp4"></video>
  </section>

  ${wa || mail ? `<section class="card"><h3>Contáctanos</h3><div class="row">${wa}${mail}</div></section>` : ''}

  <section class="card">
    <h3>Aliados y marco del proyecto</h3>
    <div class="logos">
      <img src="./assets/img/sena.png" alt="SENA" />
      <img src="./assets/img/senatic.png" alt="SenaTIC" />
    </div>
  </section>
  ${credit()}`;
}

export async function mount(root, { user }) {
  const box = root.querySelector('#resumen');
  try {
    const list = await backend.listMyTickets(user.uid);
    const open = list.filter((t) => t.estado === 'abierto' || t.estado === 'en_proceso').length;
    box.innerHTML = `<h3>Mis tickets</h3>
      <div class="stats"><div><b>${list.length}</b><small>Total</small></div><div><b>${open}</b><small>Pendientes</small></div><div><b>${list.length - open}</b><small>Resueltos</small></div></div>
      <a class="link" href="#/tickets">Ver mis tickets →</a>`;
  } catch {
    box.innerHTML = `<h3>Mis tickets</h3><p class="muted">No se pudo cargar (¿sin conexión?).</p>`;
  }
}
