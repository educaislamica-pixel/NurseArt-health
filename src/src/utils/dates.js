export const pad = (n) => String(n).padStart(2, '0');
export const toKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7));
export const weekKeyOf = (d) => toKey(mondayOf(d));
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** Los 7 días (lunes a domingo) de la semana que empieza en `weekKey`. */
export const weekDays = (weekKey) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = addDays(fromKey(weekKey), i);
    return { key: toKey(date), label: LABELS[i], name: NAMES[i], num: date.getDate() };
  });

export const formatDate = (key) =>
  key ? fromKey(key).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha';
