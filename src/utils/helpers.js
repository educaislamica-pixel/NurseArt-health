export const pad = (n) => String(n).padStart(2, '0');
export const toKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const LONG = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** Los 7 días de la semana actual (lunes a domingo). */
export function weekDays() {
  const t = new Date();
  const offset = (t.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - offset + i);
    return { key: toKey(d), label: LABELS[i], long: LONG[i] };
  });
}

export const GOALS = { water: 8, exercise: 30, steps: 8000, sleep: 7, meditation: 10 };
export const PRIORITY_POINTS = { alta: 20, media: 10, baja: 5 };
export const PRIORITIES = ['alta', 'media', 'baja'];

const cap = (v, goal) => Math.min((Number(v) || 0) / goal, 1);

/** Progreso de nutrición del día (0 a 1). */
export function nutritionScore(n = {}) {
  const parts = [n.breakfast ? 1 : 0, n.lunch ? 1 : 0, n.dinner ? 1 : 0, n.fruit ? 1 : 0, cap(n.water, GOALS.water)];
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

/** Progreso de salud del día (0 a 1). */
export function healthScore(h = {}) {
  const parts = [
    cap(h.exercise, GOALS.exercise),
    cap(h.steps, GOALS.steps),
    cap(h.sleep, GOALS.sleep),
    h.stretching ? 1 : 0,
    cap(h.meditation, GOALS.meditation),
  ];
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

export const dayScore = (n, h) => (nutritionScore(n) + healthScore(h)) / 2;
