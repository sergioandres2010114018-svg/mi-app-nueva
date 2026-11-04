// =====================================================================
//  CONFIGURACIÓN DE LA APP  (edita este archivo)
// =====================================================================

// 1) FIREBASE  -> aquí se guardan los usuarios registrados y los tickets.
//    Pasos en el README (sección "Conectar Firebase").
//    Mientras los valores digan "TU_...", la app funciona en MODO LOCAL
//    (los datos quedan solo en el celular, útil para probar).
export const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_PROYECTO.firebasestorage.app',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID',
};

export function isFirebaseConfigured() {
  return !!firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith('TU_')
    && !String(firebaseConfig.projectId).startsWith('TU_');
}

// 2) CONTACTO DE SOPORTE (opcional). Déjalos vacíos para ocultar los botones.
//    WhatsApp: solo números con indicativo de país, ej. '573001234567'
export const SUPPORT_WHATSAPP = '';
export const SUPPORT_EMAIL = '';

// 3) TEXTO DE CRÉDITOS (aparece al final de cada pantalla)
export const CREDITS = 'APP móvil creada Por: Sergio Andres Caro, IE Pijiño y proyecto SenaTIC';

export const APP_NAME = 'Soporte Técnico Virtual';
export const APP_VERSION = '1.0.0';
