import { VIDEOS_LOCALES, VIDEOS_YOUTUBE, BUSQUEDAS_YOUTUBE } from '../data/videos.js';
import { esc, credit } from '../ui.js';

export function render() {
  return `
  <h2 class="title">Videos</h2>
  <h3 class="sub">Videos de la app <small>(sin internet)</small></h3>
  ${VIDEOS_LOCALES.map(
    (v) => `
    <article class="card video">
      <video controls preload="metadata" playsinline poster="${v.poster}" src="${v.src}"></video>
      <h4>${esc(v.titulo)} <small>${v.dur}</small></h4>
      <p class="muted">${esc(v.desc)}</p>
    </article>`
  ).join('')}

  <h3 class="sub">Tutoriales en YouTube <small>(requieren internet)</small></h3>
  ${VIDEOS_YOUTUBE.map(
    (v) => `
    <a class="yt" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${v.yt}">
      <img loading="lazy" src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt="" onerror="this.style.display='none'" />
      <span>▶ ${esc(v.titulo)}</span>
    </a>`
  ).join('')}

  <h3 class="sub">Buscar más videos por tema</h3>
  <div class="list">
    ${BUSQUEDAS_YOUTUBE.map(
      (b) => `
      <a class="row-card" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(b.q)}">
        <span class="ico">${b.icono}</span><div><b>${esc(b.texto)}</b><small>Abrir en YouTube</small></div><i>›</i>
      </a>`
    ).join('')}
  </div>
  ${credit()}`;
}
