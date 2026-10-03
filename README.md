# NurseArt

Aplicación personal de productividad, organización semanal, salud, nutrición y bienestar. Sin backend ni autenticación: todo se guarda en el `localStorage` del navegador.

**Stack:** React 18 · Vite · TailwindCSS 3 · Recharts · Lucide React · PWA instalable · tipografía Inter

## Instalación
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist
npm run preview    # versión de producción (activa el service worker)
```
Requiere Node.js 18 o superior.

## Módulos
- **Inicio:** progreso semanal, puntos, racha actual y mejor racha, resumen de tareas y hábitos, tareas de hoy.
- **Semana:** calendario propio de lunes a domingo. Crea tareas por día, muévelas con las flechas o arrastrándolas, complétalas y marca los hábitos de cada día. Incluye notas semanales.
- **Tareas:** crear, editar, eliminar y completar, con título, descripción, prioridad (alta, media, baja) y fecha.
- **Salud:** checklist semanal de nutrición (6 hábitos) y salud (5 hábitos).
- **Estadísticas:** gráfico circular (completado/pendiente), gráfico semanal (tareas, nutrición, salud), porcentajes, puntos, rachas y logros.

## Gamificación
- Tarea completada: +10. Hábito completado: +5. Semana por encima del 80 %: +100.
- **Racha:** días seguidos con al menos el 50 % de lo previsto (hábitos del día y tareas con esa fecha). Hoy no la rompe hasta que acabe el día.
- **Logros:** primera semana completa (más del 80 %), 7 días seguidos, 30 entrenamientos (ejercicio marcado) y 10 días saludables (al menos el 80 % de los hábitos).

## Reinicio semanal
Los hábitos se guardan por semana (clave = fecha del lunes), así que cada lunes empiezan en blanco sin borrar nada. Estadísticas históricas, puntos y rachas se mantienen porque se calculan a partir de ese historial.

## Estructura
```
nurseart/
├── index.html · package.json · vite.config.js · tailwind.config.js · postcss.config.js
├── public/        logo-nurseart.png, icon-192.png, icon-512.png, manifest.json, sw.js
└── src/
    ├── main.jsx · App.jsx · index.css
    ├── context/AppContext.jsx       estado, acciones y estadísticas derivadas
    ├── hooks/useLocalStorage.js
    ├── utils/                       dates.js, habits.js, stats.js
    ├── components/                  Logo, SplashScreen, Navigation, PageHeader, StatCard,
    │                                ProgressRing, TaskItem, TaskModal, HabitChecklist
    └── pages/                       Dashboard, Week, Tasks, Wellness, Stats
```

## Datos y personalización
- Claves de LocalStorage: `nurseart:tasks`, `nurseart:habits`, `nurseart:notes`.
- Colores: `tailwind.config.js`. Hábitos, puntos y prioridades: `src/utils/habits.js`.
- Logo: sustituye `public/logo-nurseart.png`; los iconos de la PWA son `icon-192.png` e `icon-512.png`.

## Despliegue en Vercel
Sube el proyecto a GitHub, impórtalo en vercel.com y pulsa Deploy (Vite se detecta solo: `npm run build`, carpeta `dist`).
