# NurseArt

Aplicación de productividad, salud y bienestar. Funciona sin servidor: todos los datos se guardan en el `localStorage` de tu navegador.

## Tecnologías
React 18 · Vite · TailwindCSS 3 · Recharts · Lucide React · LocalStorage · PWA

## Instalación y uso
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist
npm run preview    # prueba la versión de producción (aquí se activa la PWA)
```
Requiere Node.js 18 o superior.

## Pantallas
| Pantalla | Qué hace |
|---|---|
| Inicio | Progreso global del día, resumen semanal, puntos, rachas y tarjetas resumen |
| Tareas | Crear, editar, eliminar y completar tareas con prioridad alta, media o baja |
| Nutrición | Desayuno, comida, cena, fruta y agua, con seguimiento semanal |
| Salud | Ejercicio, pasos, sueño, estiramientos y meditación |
| Estadísticas | Gráfico circular de puntos, gráfico semanal, porcentajes, puntos y rachas |

En móvil la navegación va abajo; en escritorio aparece una barra lateral.

## Cómo se calculan los datos
- **Metas diarias:** 8 vasos de agua, 30 min de ejercicio, 8.000 pasos, 7 h de sueño, 10 min de meditación.
- **Progreso del día:** media entre nutrición (5 objetivos) y salud (5 objetivos). Cada objetivo cuenta de forma proporcional.
- **Puntos:** tarea completada (alta 20, media 10, baja 5) + hasta 50 puntos al día por nutrición + hasta 50 por salud.
- **Racha:** días seguidos con al menos un 50 % de progreso. Hoy no rompe la racha hasta que acaba el día.

## Estructura
```
nurseart/
├── index.html
├── package.json
├── vite.config.js · tailwind.config.js · postcss.config.js
├── public/            logo-nurseart.png, iconos PWA, manifest.webmanifest, sw.js
└── src/
    ├── main.jsx · App.jsx · index.css
    ├── context/AppContext.jsx      estado global y cálculo de estadísticas
    ├── hooks/useLocalStorage.js
    ├── utils/helpers.js            fechas, metas y puntuaciones
    ├── components/                 Logo, Navigation, StatCard, ProgressRing, ToggleCard, CounterCard, PageHeader
    └── pages/                      Dashboard, Tasks, Nutrition, Health, Stats
```

## PWA
`public/manifest.webmanifest` y `public/sw.js` hacen la app instalable y utilizable sin conexión. El service worker se registra solo en producción (`npm run build` + `npm run preview`, o al desplegar con HTTPS).

## Personalización
- Colores de marca: `tailwind.config.js` (`primary`, `secondary`, `accent`).
- Logo: sustituye `public/logo-nurseart.png`. Los iconos de la PWA son `public/icon-192.png` y `public/icon-512.png`.
- Metas y puntos: `src/utils/helpers.js`.

## Datos
Se guardan en las claves `nurseart:tasks`, `nurseart:nutrition` y `nurseart:health`. Borrar los datos del sitio en el navegador reinicia la app.
