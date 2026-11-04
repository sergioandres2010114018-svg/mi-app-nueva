import { PROYECTO as P } from '../data/proyecto.js';
import { esc, credit } from '../ui.js';

const kv = (rows) => `<dl class="kv">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
const ul = (a) => `<ul class="bul">${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
const sec = (title, body, open = false) => `<details class="acc"${open ? ' open' : ''}><summary>${title}</summary><div class="acc-body">${body}</div></details>`;

export function render() {
  return `
  <section class="proj-hero">
    <img src="./assets/img/logo-proyecto-completo.jpg" alt="Soporte Técnico Virtual - ${esc(P.slogan)}" />
    <h2>${esc(P.nombre)}</h2>
    <p>${esc(P.slogan)}</p>
  </section>

  ${sec('📋 Información general', kv(P.general) + `<h4>Aprendices participantes</h4>${ul(P.aprendices)}`, true)}
  ${sec('❓ Justificación del problema', P.justificacion.map((t) => `<p>${esc(t)}</p>`).join(''))}
  ${sec('🎯 Objetivos', `<h4>Objetivo general</h4><p>${esc(P.objetivoGeneral)}</p><h4>Objetivos específicos</h4>${ul(P.objetivosEspecificos)}`)}
  ${sec('🏢 Identidad corporativa',
    `<h4>Misión</h4><p>${esc(P.mision)}</p><h4>Visión</h4><p>${esc(P.vision)}</p><h4>Valores corporativos</h4>${kv(P.valores)}
     <h4>Simbología del logo</h4>${kv(P.simbologia)}
     <h4>Colores</h4>${P.colores.map(([hex, n, d]) => `<div class="color"><i style="background:${hex}"></i><div><b>${esc(n)}</b><small>${esc(d)}</small></div></div>`).join('')}`)}
  ${sec('🧭 Análisis D.O.F.A.', Object.entries(P.dofa).map(([k, v]) => `<h4>${esc(k)}</h4>${ul(v)}`).join(''))}
  ${sec('🛠️ Descripción del proyecto', kv(P.descripcion))}
  ${sec('🗓️ Plan de trabajo', P.plan.map(([a, d, r, i, f]) => `<div class="plan"><b>${esc(a)}</b><p>${esc(d)}</p><small>👤 ${esc(r)} · ${esc(i)} → ${esc(f)}</small></div>`).join(''))}
  ${sec('🌐 Análisis del entorno',
    P.entorno.map((t) => `<p>${esc(t)}</p>`).join('') +
    `<h4>Mercado</h4><p>${esc(P.mercado)}</p><h4>Sector</h4><p>${esc(P.sector)}</p>
     <h4>Competencia principal</h4>${ul(P.competencia.principales)}
     <h4>Fortalezas de la competencia</h4>${ul(P.competencia.fortalezas)}
     <h4>Debilidades de la competencia</h4>${ul(P.competencia.debilidades)}`)}
  ${sec('📦 Recursos', Object.entries(P.recursos).map(([k, v]) => `<h4>${esc(k)}</h4>${ul(v)}`).join('') +
    `<h4>Costos fijos mensuales</h4>${kv(P.costos)}<p class="total">Total: <b>${esc(P.costoTotal)}</b></p>`)}
  ${sec('✅ Producto / servicio final', kv(P.producto))}
  ${sec('🌍 Impacto esperado', kv(P.impacto))}
  ${sec('📸 Evidencias', ul(P.evidencias))}
  ${sec('🚀 Observaciones y mejoras', `<p>${esc(P.mejoras)}</p>`)}
  ${sec('📚 Referencias', P.referencias.map(([t, u, d]) => `<div class="ref"><a target="_blank" rel="noopener" href="${esc(u)}">${esc(t)}</a><small>${esc(d)}</small></div>`).join(''))}
  ${sec('✍️ Equipo evaluador', kv(P.evaluadores))}

  <section class="card">
    <h3>Con el apoyo de</h3>
    <div class="logos">
      <img src="./assets/img/sena.png" alt="SENA" />
      <img src="./assets/img/senatic.png" alt="SenaTIC" />
      <img src="./assets/img/tic.png" alt="MinTIC" class="tall" />
      <img src="./assets/img/oit.png" alt="Organización Internacional del Trabajo" />
    </div>
  </section>
  ${credit()}`;
}
