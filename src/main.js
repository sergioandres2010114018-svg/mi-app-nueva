import './styles.css';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import * as backend from './services/backend.js';
import { esc, toast } from './ui.js';
import { APP_NAME } from './config.js';
import * as login from './views/login.js';
import * as home from './views/home.js';
import * as guias from './views/guias.js';
import * as videos from './views/videos.js';
import * as tickets from './views/tickets.js';
import * as proyecto from './views/proyecto.js';
import * as perfil from './views/perfil.js';
import * as admin from './views/admin.js';

const ROUTES = {
  login: { view: login, public: true },
  inicio: { view: home, tab: 'inicio' },
  guias: { view: guias, tab: 'guias' },
  videos: { view: videos, tab: 'videos' },
  tickets: { view: tickets, tab: 'tickets' },
  proyecto: { view: proyecto, tab: 'perfil' },
  perfil: { view: perfil, tab: 'perfil' },
  admin: { view: admin, tab: 'perfil' },
};

const TABS = [
  ['inicio', '🏠', 'Inicio'],
  ['guias', '🛠️', 'Guías'],
  ['videos', '🎬', 'Videos'],
  ['tickets', '🎫', 'Tickets'],
  ['perfil', '👤', 'Perfil'],
];

const state = { user: null, ready: false };
const app = document.getElementById('app');

const ctx = {
  get user() {
    return state.user;
  },
  params: [],
  nav: (path) => {
    const target = '#' + path;
    if (location.hash === target) route();
    else location.hash = target;
  },
  setUser: (u) => {
    state.user = u;
  },
  refresh: () => route(),
};

function parse() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { name: parts[0] || '', params: parts.slice(1) };
}

function shell(inner, tab) {
  return `
  <header class="top">
    <img src="./assets/img/logo.png" alt="" />
    <span>${esc(APP_NAME)}</span>
  </header>
  <main class="page" id="page">${inner}</main>
  <nav class="tabbar" aria-label="Navegación principal">
    ${TABS.map(([id, ico, label]) => `<a href="#/${id}" class="${tab === id ? 'on' : ''}"><span>${ico}</span><small>${label}</small></a>`).join('')}
  </nav>`;
}

function route() {
  if (!state.ready) return;
  let { name, params } = parse();
  const r = ROUTES[name];

  if (!state.user) {
    if (name !== 'login') return (location.hash = '#/login');
  } else if (!r || name === 'login') {
    return (location.hash = '#/inicio');
  }

  const cur = ROUTES[name] || ROUTES.login;
  ctx.params = params;
  const html = cur.view.render({ ...ctx, user: state.user, params });

  if (cur.public) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    cur.view.mount?.(app, ctx);
  } else {
    app.innerHTML = shell(html, cur.tab);
    const page = document.getElementById('page');
    page.scrollTop = 0;
    cur.view.mount?.(page, { ...ctx, user: state.user, params });
  }
}

window.addEventListener('hashchange', route);

// Botón "atrás" de Android
if (Capacitor.isNativePlatform()) {
  CapApp.addListener('backButton', () => {
    const h = location.hash;
    const root = !h || h === '#/inicio' || h === '#/login' || h === '#/';
    if (root) CapApp.exitApp();
    else if (history.length > 1) history.back();
    else location.hash = '#/inicio';
  });
}

backend
  .onAuth((u) => {
    state.user = u;
    state.ready = true;
    route();
  })
  .catch((e) => {
    console.error(e);
    app.innerHTML = `<div class="boot"><p>No se pudo iniciar la app. Revisa tu configuración de Firebase.</p></div>`;
    toast('Error al iniciar', 'err');
  });
