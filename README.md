# 📱 Soporte Técnico Virtual — App móvil

**Centro de soporte tecnológico AMAV** · Proyecto SenaTIC · IE Pijiño
*APP móvil creada Por: Sergio Andres Caro, IE Pijiño y proyecto SenaTIC*

App Android (APK) hecha con **Capacitor 8 + Vite + Firebase**. Incluye:

| Sección | Qué hace |
|---|---|
| 🔐 Login y registro | Los usuarios se registran con correo y contraseña y se guardan en Firebase |
| 🏠 Inicio | Resumen de tickets, consejo del día, video de presentación |
| 🛠️ Guías | 8 guías paso a paso (lentitud, internet, virus, phishing, contraseñas, Meet/Zoom, Office, respaldos) |
| 🎬 Videos | 3 videos propios (funcionan sin internet) + tutoriales de YouTube |
| 🎫 Tickets | El usuario pide ayuda; el administrador responde y cambia el estado |
| 📘 Proyecto | Todo el documento del proyecto productivo (misión, visión, DOFA, plan, costos, etc.) |
| 🛡️ Administración | Ver todos los tickets, responderlos y ver los usuarios registrados |

El logo de la app es el del proyecto (portátil + engranaje + wifi).

---

## Estructura de carpetas (todo esto se sube a GitHub)

```
soporte-tecnico-virtual-app/
├── .github/workflows/build-apk.yml   ← genera el APK automáticamente
├── assets/                           ← ícono y splash (logo del proyecto)
├── public/assets/img/                ← imágenes (logo, SENA, SenaTIC, MinTIC, OIT)
├── public/assets/video/              ← 3 videos MP4 + miniaturas
├── scripts/patch-android.py          ← pone el logo como ícono de la app
├── src/
│   ├── config.js                     ← ⚙️ AQUÍ pones tu Firebase y contacto
│   ├── main.js · styles.css · ui.js
│   ├── data/                         ← guías, videos y datos del proyecto
│   ├── services/                     ← Firebase y modo local
│   └── views/                        ← pantallas
├── firestore.rules                   ← reglas de seguridad de la base de datos
├── capacitor.config.json · package.json · vite.config.js · index.html
└── README.md
```

> La carpeta `android/` **no** se sube: la crea GitHub Actions al compilar.

---

## PASO 1 — Crear el proyecto en Firebase (gratis)

Aquí se guardan los usuarios y tickets.

1. Entra a <https://console.firebase.google.com> → **Agregar proyecto** → nombre: `soporte-tecnico-virtual`.
2. **Compilación → Authentication → Comenzar → Correo electrónico/contraseña → Habilitar → Guardar.**
3. **Compilación → Firestore Database → Crear base de datos** → modo *producción* → elige una región.
4. En Firestore, pestaña **Reglas**: borra todo, pega el contenido de `firestore.rules` y pulsa **Publicar**.
5. **Configuración del proyecto (⚙️) → Tus apps → icono `</>` (Web)** → registra la app → copia el objeto `firebaseConfig`.
6. Abre `src/config.js` y reemplaza los valores `TU_...` por los que copiaste.

> La clave de Firebase Web no es secreta: la seguridad la dan las reglas del paso 4.

## PASO 2 — Subir a GitHub

Con Git instalado, dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "App Soporte Técnico Virtual"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/soporte-tecnico-virtual-app.git
git push -u origin main
```

(Antes crea el repositorio vacío en <https://github.com/new>.)
Si lo subes arrastrando archivos desde la web, asegúrate de que la carpeta oculta **`.github`** también se suba.

## PASO 3 — Generar el APK

1. En GitHub: pestaña **Actions** → **Generar APK** → **Run workflow** (también se ejecuta solo en cada `push`).
2. Espera ~8–12 minutos hasta ver el check verde ✅.
3. Entra a la ejecución → sección **Artifacts** → descarga **SoporteTecnicoVirtual-APK** (viene en un .zip con el `.apk`).

**Opcional:** si subes una etiqueta (`git tag v1.0.0 && git push origin v1.0.0`), el APK también aparece en **Releases** con un enlace de descarga directo.

## PASO 4 — Instalar en el celular

1. Pasa el `.apk` al teléfono (WhatsApp, Drive, cable).
2. Ábrelo y acepta **“Instalar apps de origen desconocido”** cuando Android lo pida.
3. Instala y abre **Soporte Técnico Virtual**.

## PASO 5 — Crear tu usuario administrador

1. Regístrate en la app con tu correo.
2. En Firebase: **Firestore Database → colección `users` →** tu documento → cambia el campo `rol` de `usuario` a **`admin`**.
3. Cierra sesión y vuelve a entrar: en **Perfil** aparecerá **🛡️ Panel de administración**.

---

## Personalización

* **WhatsApp / correo de contacto:** en `src/config.js` rellena `SUPPORT_WHATSAPP` (ej. `'573001234567'`) y `SUPPORT_EMAIL`. Si los dejas vacíos, los botones no se muestran.
* **Texto del pie de página:** `CREDITS` en `src/config.js`.
* **Guías y datos del proyecto:** `src/data/*.js`.
* **Cambiar el logo/ícono:** reemplaza `assets/icon-only.png` (1024×1024).

## Modo local (pruebas sin Firebase)

Mientras `src/config.js` conserve los valores `TU_...`, la app funciona en **modo local**: usuarios y tickets se guardan solo en ese celular, y el primer usuario registrado es administrador. Útil para probar; **no** sirve para recolectar usuarios en la nube.

## Compilar en tu computador (opcional)

Requisitos: Node 22+, JDK 21 y Android Studio (SDK 36).

```bash
npm install
npm run build
npx cap add android
python3 scripts/patch-android.py   # requiere: pip install pillow
npx cap sync android
cd android && ./gradlew assembleDebug
# APK en android/app/build/outputs/apk/debug/app-debug.apk
```

Probar solo la parte web: `npm run dev`.

## Notas

* El APK generado es de **depuración** (firmado con clave debug): se instala sin problema en cualquier Android. Para publicar en **Google Play** necesitas un APK/AAB de *release* firmado con tu propia clave.
* Versiones usadas: Capacitor 8 (Node 22, JDK 21, Android SDK 36, minSdk 24 → Android 7.0+), Firebase JS SDK 13, Vite 8.
* En Android, `getAuth()` de Firebase puede quedarse colgado dentro de Capacitor; por eso `src/services/firebase.js` usa `initializeAuth` con `indexedDBLocalPersistence`.
* Los videos de YouTube se abren en el navegador/app de YouTube (requieren internet).
* Datos personales: la app pide autorización de tratamiento de datos al registrarse; guarda solo nombre, correo, celular e institución.
