// Videos propios de la app (archivos incluidos en la APK, funcionan sin internet)
export const VIDEOS_LOCALES = [
  {
    id: 'presentacion',
    titulo: 'Presentación del proyecto',
    desc: 'Misión, visión, valores y servicios del Centro de soporte tecnológico AMAV.',
    src: './assets/video/presentacion.mp4',
    poster: './assets/video/presentacion.jpg',
    dur: '0:26',
  },
  {
    id: 'como-funciona',
    titulo: '¿Cómo funciona el soporte virtual?',
    desc: 'El proceso en 5 pasos: solicitud, diagnóstico, solución, seguimiento y prevención.',
    src: './assets/video/como-funciona.mp4',
    poster: './assets/video/como-funciona.jpg',
    dur: '0:26',
  },
  {
    id: 'consejos',
    titulo: '5 consejos para cuidar tu computador',
    desc: 'Hábitos simples para evitar fallas y mantener tu equipo seguro.',
    src: './assets/video/consejos.mp4',
    poster: './assets/video/consejos.jpg',
    dur: '0:26',
  },
];

// Videos externos (requieren internet; se abren en YouTube)
export const VIDEOS_YOUTUBE = [
  { yt: 'UoDL-wcwDT4', titulo: 'Cómo limpiar, optimizar y acelerar tu PC sin programas (Windows 11)' },
  { yt: 'RdCPqjVyIxg', titulo: 'Cómo hacer que Windows 11 vaya más rápido sin programas' },
  { yt: 'dyV1aNLkhZk', titulo: 'Windows 11 más rápido: 10 trucos para acelerar tu PC' },
];

// Búsquedas por tema (abren YouTube con resultados actuales)
export const BUSQUEDAS_YOUTUBE = [
  { icono: '📶', texto: 'WiFi conectado pero sin internet (Windows)', q: 'wifi conectado sin internet windows solución' },
  { icono: '🎣', texto: 'Qué es el phishing y cómo evitarlo', q: 'qué es el phishing y cómo evitarlo' },
  { icono: '🔑', texto: 'Cómo crear contraseñas seguras', q: 'cómo crear contraseñas seguras' },
  { icono: '🎥', texto: 'Cómo usar Google Meet', q: 'cómo usar google meet tutorial' },
  { icono: '🛡️', texto: 'Cómo analizar tu PC con Seguridad de Windows', q: 'seguridad de windows examen completo virus' },
];
