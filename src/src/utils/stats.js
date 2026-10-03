import { HEALTH, NUTRITION, POINTS } from './habits.js';
import { addDays, fromKey, toKey, weekDays, weekKeyOf } from './dates.js';

const pct = (v) => Math.round(v * 100);
const ratio = (a, b) => (b ? a / b : 0);
const count = (day = {}, list) => list.filter((h) => day[h.id]).length;
const HABITS_PER_DAY = NUTRITION.length + HEALTH.length;

/** Estadísticas de una semana concreta (lunes = weekKey). */
export function weekStats(weekKey, tasks, habits) {
  const wk = habits[weekKey] || {};
  const days = weekDays(weekKey).map((d) => {
    const day = wk[d.key] || {};
    const dayTasks = tasks.filter((t) => t.date === d.key);
    const tDone = dayTasks.filter((t) => t.done).length;
    const n = count(day, NUTRITION);
    const h = count(day, HEALTH);
    return {
      ...d, n, h, tDone, tTotal: dayTasks.length,
      tasks: pct(ratio(tDone, dayTasks.length)),
      nutrition: pct(n / NUTRITION.length),
      health: pct(h / HEALTH.length),
      ratio: (tDone + n + h) / (dayTasks.length + HABITS_PER_DAY),
      healthyRatio: (n + h) / HABITS_PER_DAY,
    };
  });
  const sum = (k) => days.reduce((a, d) => a + d[k], 0);
  const tTotal = sum('tTotal'), tDone = sum('tDone'), nDone = sum('n'), hDone = sum('h');
  const nTotal = NUTRITION.length * 7, hTotal = HEALTH.length * 7;
  const parts = [ratio(nDone, nTotal), ratio(hDone, hTotal)];
  if (tTotal) parts.push(tDone / tTotal);
  return {
    weekKey, days, tTotal, tDone, nDone, hDone, nTotal, hTotal,
    tasksPct: pct(ratio(tDone, tTotal)),
    nutritionPct: pct(ratio(nDone, nTotal)),
    healthPct: pct(ratio(hDone, hTotal)),
    global: pct(parts.reduce((a, b) => a + b, 0) / parts.length),
    done: tDone + nDone + hDone,
    total: tTotal + nTotal + hTotal,
  };
}

/** Todo lo derivado: semanas, puntos, rachas y logros. */
export function computeAll(tasks, habits, currentWeekKey) {
  const keys = new Set([
    currentWeekKey,
    ...Object.keys(habits),
    ...tasks.filter((t) => t.date).map((t) => weekKeyOf(fromKey(t.date))),
  ]);
  const weeks = {};
  keys.forEach((k) => { weeks[k] = weekStats(k, tasks, habits); });
  const current = weeks[currentWeekKey];

  const dayMap = Object.fromEntries(Object.values(weeks).flatMap((w) => w.days).map((d) => [d.key, d]));
  const ok = (date) => (dayMap[toKey(date)]?.ratio || 0) >= 0.5;

  // Racha: días seguidos con al menos el 50 % de lo previsto (hoy no la rompe hasta que acabe el día)
  let streak = 0;
  const cursor = new Date();
  if (!ok(cursor)) cursor.setDate(cursor.getDate() - 1);
  while (ok(cursor) && streak < 3650) { streak++; cursor.setDate(cursor.getDate() - 1); }

  let best = 0, run = 0, prev = null;
  Object.keys(dayMap).sort().forEach((k) => {
    if (!ok(fromKey(k))) return;
    run = prev && toKey(addDays(fromKey(prev), 1)) === k ? run + 1 : 1;
    prev = k;
    best = Math.max(best, run);
  });
  best = Math.max(best, streak);

  const allChecks = Object.values(habits).flatMap((w) => Object.values(w));
  const habitChecks = allChecks.reduce((a, d) => a + Object.keys(d).length, 0);
  const workouts = allChecks.filter((d) => d.exercise).length;
  const bonusWeeks = Object.values(weeks).filter((w) => w.global > 80).length;
  const healthyDays = Object.values(dayMap).filter((d) => d.healthyRatio >= 0.8).length;
  const taskDone = tasks.filter((t) => t.done).length;

  const pointsBreakdown = {
    tasks: taskDone * POINTS.task,
    habits: habitChecks * POINTS.habit,
    weeks: bonusWeeks * POINTS.week,
  };

  const achievements = [
    { id: 'week', title: 'Primera semana completa', desc: 'Supera el 80 % en una semana', progress: Math.min(bonusWeeks, 1), goal: 1 },
    { id: 'streak', title: '7 días seguidos', desc: 'Mantén la racha una semana entera', progress: Math.min(best, 7), goal: 7 },
    { id: 'workouts', title: '30 entrenamientos', desc: 'Marca ejercicio 30 veces', progress: Math.min(workouts, 30), goal: 30 },
    { id: 'healthy', title: '10 días saludables', desc: 'Cumple al menos el 80 % de hábitos en 10 días', progress: Math.min(healthyDays, 10), goal: 10 },
  ].map((a) => ({ ...a, unlocked: a.progress >= a.goal }));

  return {
    weeks, current, streak, bestStreak: best, achievements, pointsBreakdown,
    points: pointsBreakdown.tasks + pointsBreakdown.habits + pointsBreakdown.weeks,
    pending: tasks.length - taskDone,
  };
}
