import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import TaskItem from '../components/TaskItem.jsx';
import TaskModal from '../components/TaskModal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { addDays, formatDate, fromKey, toKey, weekDays } from '../utils/dates.js';
import { HEALTH, NUTRITION } from '../utils/habits.js';

const HABITS = [...NUTRITION, ...HEALTH];

export default function Week() {
  const { weekKey, today, tasks, habits, notes, setNote, addTask, updateTask, deleteTask, toggleTask, moveTask, toggleHabit } = useApp();
  const days = weekDays(weekKey);
  const [sel, setSel] = useState(Math.max(days.findIndex((d) => d.key === today), 0));
  const [modal, setModal] = useState(null); // { task?, date? }
  const week = habits[weekKey] || {};

  const shift = (task, n) => moveTask(task.id, toKey(addDays(fromKey(task.date), n)));

  return (
    <>
      <PageHeader title="Semana" subtitle={`${formatDate(days[0].key)} – ${formatDate(days[6].key)}`} />

      <div className="mb-4 grid grid-cols-7 gap-1.5 md:hidden">
        {days.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)}
            className={`rounded-xl py-2 text-center text-xs font-bold ${i === sel ? 'bg-primary text-white' : 'bg-white text-slate-500 ring-1 ring-slate-100'}`}>
            {d.label}<span className="block text-base">{d.num}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {days.map((d, i) => {
          const dayTasks = tasks.filter((t) => t.date === d.key);
          const dayHabits = week[d.key] || {};
          const doneCount = HABITS.filter((h) => dayHabits[h.id]).length;
          return (
            <section key={d.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { const id = e.dataTransfer.getData('text/plain'); if (id) moveTask(id, d.key); }}
              className={`${i === sel ? 'block' : 'hidden'} min-w-0 rounded-2xl p-2 md:block ${d.key === today ? 'bg-primary-soft' : 'bg-slate-100/60'}`}>
              <header className="mb-2 hidden items-baseline justify-between px-1 md:flex">
                <span className="text-sm font-bold">{d.name.slice(0, 3)}</span>
                <span className="text-lg font-extrabold text-primary">{d.num}</span>
              </header>
              <ul className="flex flex-col gap-2">
                {dayTasks.map((t) => (
                  <TaskItem key={t.id} task={t} onToggle={() => toggleTask(t.id)} onEdit={() => setModal({ task: t })}
                    onDelete={() => deleteTask(t.id)} onMove={(n) => shift(t, n)} />
                ))}
              </ul>
              <button onClick={() => setModal({ date: d.key })} className="btn-ghost mt-2 w-full !py-2 !text-xs"><Plus size={14} /> Tarea</button>
              <details className="mt-2 rounded-xl bg-white p-2 text-xs ring-1 ring-slate-100">
                <summary className="cursor-pointer font-semibold">Hábitos {doneCount}/{HABITS.length}</summary>
                <ul className="mt-2 flex flex-col gap-1">
                  {HABITS.map((h) => (
                    <li key={h.id}>
                      <button onClick={() => toggleHabit(d.key, h.id)} aria-pressed={!!dayHabits[h.id]}
                        className={`w-full rounded-lg px-2 py-1.5 text-left ${dayHabits[h.id] ? 'bg-secondary-soft font-semibold text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                        {dayHabits[h.id] ? '✓ ' : ''}{h.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </section>
          );
        })}
      </div>

      <div className="card mt-6">
        <h2 className="mb-2 font-bold">Notas de la semana</h2>
        <textarea className="input min-h-[96px]" placeholder="Ej.: mejorar la hidratación, dormir antes…"
          value={notes[weekKey] || ''} onChange={(e) => setNote(weekKey, e.target.value)} aria-label="Notas semanales" />
      </div>

      {modal && (
        <TaskModal task={modal.task} defaultDate={modal.date}
          onSave={(data) => (modal.task ? updateTask(modal.task.id, data) : addTask(data))}
          onClose={() => setModal(null)} />
      )}
    </>
  );
}
