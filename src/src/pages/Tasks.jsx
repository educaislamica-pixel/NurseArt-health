import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import TaskItem from '../components/TaskItem.jsx';
import TaskModal from '../components/TaskModal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { toKey } from '../utils/dates.js';

const ORDER = { alta: 0, media: 1, baja: 2 };

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useApp();
  const [filter, setFilter] = useState('pendientes');
  const [modal, setModal] = useState(null);

  const visible = tasks
    .filter((t) => filter === 'todas' || (filter === 'hechas' ? t.done : !t.done))
    .sort((a, b) => Number(a.done) - Number(b.done) || (a.date || '9').localeCompare(b.date || '9') || ORDER[a.priority] - ORDER[b.priority]);

  return (
    <>
      <PageHeader title="Tareas" subtitle="Cada tarea completada suma 10 puntos.">
        <button className="btn-primary" onClick={() => setModal({ date: toKey() })}><Plus size={18} /> Nueva</button>
      </PageHeader>

      <div className="mb-3 flex gap-2">
        {['pendientes', 'hechas', 'todas'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn !py-1.5 capitalize ${filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>{f}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card text-center text-slate-500">{tasks.length === 0 ? 'Aún no tienes tareas. Crea la primera.' : 'No hay tareas en este filtro.'}</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((t) => (
            <TaskItem key={t.id} task={t} showDate onToggle={() => toggleTask(t.id)} onEdit={() => setModal({ task: t })} onDelete={() => deleteTask(t.id)} />
          ))}
        </ul>
      )}

      {modal && (
        <TaskModal task={modal.task} defaultDate={modal.date}
          onSave={(data) => (modal.task ? updateTask(modal.task.id, data) : addTask(data))}
          onClose={() => setModal(null)} />
      )}
    </>
  );
}
