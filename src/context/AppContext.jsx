import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { PRIORITY_POINTS, dayScore, healthScore, nutritionScore, toKey, uid, weekDays } from '../utils/helpers.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('nurseart:tasks', []);
  const [nutrition, setNutrition] = useLocalStorage('nurseart:nutrition', {});
  const [health, setHealth] = useLocalStorage('nurseart:health', {});
  const today = toKey();

  const addTask = useCallback(
    (data) => setTasks((p) => [{ id: uid(), done: false, doneAt: null, createdAt: Date.now(), ...data }, ...p]),
    [setTasks]
  );
  const updateTask = useCallback(
    (id, patch) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    [setTasks]
  );
  const deleteTask = useCallback((id) => setTasks((p) => p.filter((t) => t.id !== id)), [setTasks]);
  const toggleTask = useCallback(
    (id) =>
      setTasks((p) =>
        p.map((t) => (t.id === id ? { ...t, done: !t.done, doneAt: t.done ? null : Date.now() } : t))
      ),
    [setTasks]
  );

  const patchNutrition = useCallback(
    (patch, key = today) => setNutrition((p) => ({ ...p, [key]: { ...p[key], ...patch } })),
    [setNutrition, today]
  );
  const patchHealth = useCallback(
    (patch, key = today) => setHealth((p) => ({ ...p, [key]: { ...p[key], ...patch } })),
    [setHealth, today]
  );

  const stats = useMemo(() => {
    const week = weekDays().map((d) => {
      const n = nutritionScore(nutrition[d.key]);
      const h = healthScore(health[d.key]);
      const tasksDone = tasks.filter((t) => t.done && t.doneAt && toKey(new Date(t.doneAt)) === d.key).length;
      return {
        ...d,
        nutrition: Math.round(n * 100),
        health: Math.round(h * 100),
        total: Math.round(((n + h) / 2) * 100),
        tasksDone,
      };
    });

    const taskPoints = tasks.filter((t) => t.done).reduce((a, t) => a + PRIORITY_POINTS[t.priority], 0);
    let nutritionPoints = 0;
    let healthPoints = 0;
    new Set([...Object.keys(nutrition), ...Object.keys(health)]).forEach((k) => {
      nutritionPoints += Math.round(nutritionScore(nutrition[k]) * 50);
      healthPoints += Math.round(healthScore(health[k]) * 50);
    });

    const ok = (d) => dayScore(nutrition[toKey(d)], health[toKey(d)]) >= 0.5;

    // Racha actual: días seguidos con al menos 50 % de progreso (hoy no rompe la racha hasta acabar el día)
    let streak = 0;
    const cursor = new Date();
    if (!ok(cursor)) cursor.setDate(cursor.getDate() - 1);
    while (ok(cursor) && streak < 3650) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Mejor racha de los últimos 365 días
    let best = 0;
    let run = 0;
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      run = ok(d) ? run + 1 : 0;
      best = Math.max(best, run);
    }

    const avg = (key) => Math.round(week.reduce((a, d) => a + d[key], 0) / week.length);
    const doneCount = tasks.filter((t) => t.done).length;

    return {
      week,
      points: taskPoints + nutritionPoints + healthPoints,
      pointsBySource: [
        { name: 'Tareas', value: taskPoints },
        { name: 'Nutrición', value: nutritionPoints },
        { name: 'Salud', value: healthPoints },
      ],
      streak,
      bestStreak: Math.max(best, streak),
      weekNutrition: avg('nutrition'),
      weekHealth: avg('health'),
      weekTotal: avg('total'),
      tasksPct: tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0,
      pending: tasks.length - doneCount,
      doneCount,
      today: week.find((d) => d.key === today),
    };
  }, [tasks, nutrition, health, today]);

  const value = {
    today, tasks, addTask, updateTask, deleteTask, toggleTask,
    nutrition, patchNutrition, health, patchHealth, stats,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
