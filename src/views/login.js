import * as backend from '../services/backend.js';
import { esc, toast, credit } from '../ui.js';
import { APP_NAME } from '../config.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let tab = 'login';

export function render() {
  const local = backend.mode === 'local';
  return `
  <div class="auth">
    <div class="auth-hero">
      <img class="auth-logo" src="./assets/img/logo.png" alt="Logo ${esc(APP_NAME)}" />
      <h1>${esc(APP_NAME)}</h1>
      <p>Soluciones tecnológicas al alcance de un clic</p>
    </div>
    <div class="auth-card">
      ${local ? `<div class="notice warn">Modo local de pruebas: los usuarios se guardan solo en este dispositivo. Configura Firebase para guardarlos en la nube.</div>` : ''}
      <div class="seg">
        <button type="button" data-tab="login" class="${tab === 'login' ? 'on' : ''}">Ingresar</button>
        <button type="button" data-tab="register" class="${tab === 'register' ? 'on' : ''}">Registrarme</button>
      </div>
      ${tab === 'login' ? loginForm() : registerForm()}
    </div>
    ${credit()}
  </div>`;
}

const pwField = (id, label, auto) => `
  <label class="field"><span>${label}</span>
    <div class="pw"><input id="${id}" type="password" autocomplete="${auto}" required />
    <button type="button" class="eye" data-eye="${id}" aria-label="Mostrar u ocultar contraseña">👁</button></div>
  </label>`;

function loginForm() {
  return `
  <form id="f-login" novalidate>
    <label class="field"><span>Correo electrónico</span><input id="l-email" type="email" autocomplete="email" inputmode="email" required /></label>
    ${pwField('l-pass', 'Contraseña', 'current-password')}
    <p class="err" id="l-err" role="alert"></p>
    <button class="btn primary block" type="submit">Ingresar</button>
    <button class="link" type="button" id="forgot">¿Olvidaste tu contraseña?</button>
  </form>`;
}

function registerForm() {
  return `
  <form id="f-reg" novalidate>
    <label class="field"><span>Nombre completo</span><input id="r-nombre" type="text" autocomplete="name" required /></label>
    <label class="field"><span>Correo electrónico</span><input id="r-email" type="email" autocomplete="email" inputmode="email" required /></label>
    <label class="field"><span>Celular (opcional)</span><input id="r-tel" type="tel" autocomplete="tel" inputmode="tel" /></label>
    <label class="field"><span>Institución o empresa (opcional)</span><input id="r-inst" type="text" /></label>
    ${pwField('r-pass', 'Contraseña (mínimo 8 caracteres)', 'new-password')}
    ${pwField('r-pass2', 'Repite la contraseña', 'new-password')}
    <label class="check"><input id="r-ok" type="checkbox" /> <span>Autorizo el tratamiento de mis datos personales (nombre, correo, celular) únicamente para prestarme el servicio de soporte técnico.</span></label>
    <p class="err" id="r-err" role="alert"></p>
    <button class="btn primary block" type="submit">Crear mi cuenta</button>
  </form>`;
}

export function mount(root, ctx) {
  const rerender = () => {
    root.innerHTML = render();
    mount(root, ctx);
  };
  root.querySelectorAll('[data-tab]').forEach((b) =>
    b.addEventListener('click', () => {
      tab = b.dataset.tab;
      rerender();
    })
  );
  root.querySelectorAll('[data-eye]').forEach((b) =>
    b.addEventListener('click', () => {
      const i = root.querySelector('#' + b.dataset.eye);
      i.type = i.type === 'password' ? 'text' : 'password';
    })
  );

  const lf = root.querySelector('#f-login');
  if (lf) {
    lf.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = root.querySelector('#l-err');
      const email = root.querySelector('#l-email').value.trim();
      const pass = root.querySelector('#l-pass').value;
      err.textContent = '';
      if (!EMAIL_RE.test(email)) return (err.textContent = 'Escribe un correo válido.');
      if (!pass) return (err.textContent = 'Escribe tu contraseña.');
      const btn = lf.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Ingresando…';
      try {
        ctx.setUser(await backend.login(email, pass));
        ctx.nav('/inicio');
      } catch (ex) {
        err.textContent = backend.friendlyError(ex);
        btn.disabled = false;
        btn.textContent = 'Ingresar';
      }
    });
    root.querySelector('#forgot').addEventListener('click', async () => {
      const email = root.querySelector('#l-email').value.trim();
      const err = root.querySelector('#l-err');
      if (!EMAIL_RE.test(email)) return (err.textContent = 'Escribe tu correo arriba y vuelve a tocar "¿Olvidaste tu contraseña?".');
      try {
        await backend.resetPassword(email);
        err.textContent = '';
        toast('Si el correo existe, te enviamos un enlace para restablecer la contraseña.', 'ok');
      } catch (ex) {
        err.textContent = backend.friendlyError(ex);
      }
    });
  }

  const rf = root.querySelector('#f-reg');
  if (rf) {
    rf.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = root.querySelector('#r-err');
      const v = (id) => root.querySelector(id).value.trim();
      const nombre = v('#r-nombre'), email = v('#r-email'), tel = v('#r-tel'), inst = v('#r-inst');
      const pass = root.querySelector('#r-pass').value, pass2 = root.querySelector('#r-pass2').value;
      err.textContent = '';
      if (nombre.length < 3) return (err.textContent = 'Escribe tu nombre completo.');
      if (!EMAIL_RE.test(email)) return (err.textContent = 'Escribe un correo válido.');
      if (tel && !/^[0-9+\s-]{7,15}$/.test(tel)) return (err.textContent = 'El celular solo puede tener números (7 a 15 dígitos).');
      if (pass.length < 8) return (err.textContent = 'La contraseña debe tener mínimo 8 caracteres.');
      if (pass !== pass2) return (err.textContent = 'Las contraseñas no coinciden.');
      if (!root.querySelector('#r-ok').checked) return (err.textContent = 'Debes autorizar el tratamiento de datos para registrarte.');
      const btn = rf.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Creando cuenta…';
      try {
        ctx.setUser(await backend.register({ nombre, email, password: pass, telefono: tel, institucion: inst }));
        toast('¡Cuenta creada! Bienvenido/a.', 'ok');
        ctx.nav('/inicio');
      } catch (ex) {
        err.textContent = backend.friendlyError(ex);
        btn.disabled = false;
        btn.textContent = 'Crear mi cuenta';
      }
    });
  }
}
