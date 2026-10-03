import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { fromKey, toKey, uid, weekKeyOf } from '../utils/dates.js';
import { computeAll } from '../utils/stats.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('nurseart:tasks', []);
  const [habits, setHabits] = useLocalStorage('nurseart:habits', {}); // { semana: { día: { hábito: true } } }
  const [notes, setNotes] = useLocalStorage('nurseart:notes', {}); // { semana: texto }
  const [today, setToday] = useState(toKey());
  const weekKey = weekKeyOf(fromKey(today));

  // Si la app queda abierta al cambiar de día o de semana, se actualiza al volver a ella
  useEffect(() => {
    const refresh = () => setToday(toKey());
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, []);

  const addTask = useCallback((data) => setTasks((p) => [{ id: uid(), done: false, doneAt: null, ...data }, ...p]), [setTasks]);
  const updateTask = useCallback((id, patch) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t))), [setTasks]);
  const deleteTask = useCallback((id) => setTasks((p) => p.filter((t) => t.id !== id)), [setTasks]);
  const toggleTask = useCallback(
    (id) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done, doneAt: t.done ? null : Date.now() } : t))),
    [setTasks]
  );
  const moveTask = useCallback((id, date) => updateTask(id, { date }), [updateTask]);

  const toggleHabit = useCallback(
    (dayKey, habitId) =>
      setHabits((p) => {
        const wk = weekKeyOf(fromKey(dayKey));
        const day = { ...(p[wk]?.[dayKey] || {}) };
        if (day[habitId]) delete day[habitId];
        else day[habitId] = true;
        return { ...p, [wk]: { ...p[wk], [dayKey]: day } };
      }),
    [setHabits]
  );
  const setNote = useCallback((wk, text) => setNotes((p) => ({ ...p, [wk]: text })), [setNotes]);

  const stats = useMemo(() => computeAll(tasks, habits, weekKey), [tasks, habits, weekKey]);

  const value = {
    today, weekKey, tasks, habits, notes, stats,
    addTask, updateTask, deleteTask, toggleTask, moveTask, toggleHabit, setNote,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
