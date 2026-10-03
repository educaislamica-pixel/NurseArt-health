import { useState } from 'react';
import { X } from 'lucide-react';
import { PRIORITIES } from '../utils/habits.js';

/** Crear o editar una tarea. Si recibe `task`, edita; si no, crea con `defaultDate`. */
export default function TaskModal({ task, defaultDate = '', onSave, onClose }) {
  const [f, setF] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: task?.priority ?? 'media',
    date: task ? task.date : defaultDate,
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    onSave({ ...f, title: f.title.trim(), description: f.description.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-black/40 p-0 sm:place-items-center sm:p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">{task ? 'Editar tarea' : 'Nueva tarea'}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="flex flex-col gap-3">
          <input className="input" placeholder="Título" value={f.title} onChange={set('title')} maxLength={120} autoFocus aria-label="Título" />
          <textarea className="input min-h-[72px]" placeholder="Descripción (opcional)" value={f.description} onChange={set('description')} maxLength={300} aria-label="Descripción" />
          <div className="grid grid-cols-2 gap-3">
            <select className="input" value={f.priority} onChange={set('priority')} aria-label="Prioridad">
              {PRIORITIES.map((p) => <option key={p} value={p}>Prioridad {p}</option>)}
            </select>
            <input type="date" className="input" value={f.date} onChange={set('date')} aria-label="Fecha" />
          </div>
          <button className="btn-primary" type="submit">{task ? 'Guardar cambios' : 'Crear tarea'}</button>
        </div>
      </form>
    </div>
  );
}
