import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { PRIORITIES } from '../utils/helpers.js';

const BADGE = { alta: 'bg-red-100 text-red-700', media: 'bg-amber-100 text-amber-700', baja: 'bg-secondary-soft text-teal-700' };
const ORDER = { alta: 0, media: 1, baja: 2 };
const EMPTY = { title: '', priority: 'media' };

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('todas');

  const submit = (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    editingId ? updateTask(editingId, { title, priority: form.priority }) : addTask({ title, priority: form.priority });
    cancel();
  };
  const edit = (t) => { setEditingId(t.id); setForm({ title: t.title, priority: t.priority }); };
  const cancel = () => { setEditingId(null); setForm(EMPTY); };

  const visible = tasks
    .filter((t) => filter === 'todas' || (filter === 'hechas' ? t.done : !t.done))
    .sort((a, b) => Number(a.done) - Number(b.done) || ORDER[a.priority] - ORDER[b.priority]);

  return (
    <>
      <PageHeader title="Tareas" subtitle="Alta suma 20 puntos, media 10 y baja 5." />

      <form onSubmit={submit} className="card mb-4 flex flex-col gap-3 sm:flex-row">
        <input className="input flex-1" placeholder="¿Qué tienes que hacer?" value={form.title} maxLength={120}
          onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Título de la tarea" />
        <select className="input sm:w-36" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} aria-label="Prioridad">
          {PRIORITIES.map((p) => <option key={p} value={p}>Prioridad {p}</option>)}
        </select>
        <button className="btn-primary" type="submit">
          {editingId ? <><Check size={18} /> Guardar cambios</> : <><Plus size={18} /> Añadir tarea</>}
        </button>
        {editingId && <button type="button" className="btn-ghost" onClick={cancel}><X size={18} /> Cancelar</button>}
      </form>

      <div className="mb-3 flex gap-2">
        {['todas', 'pendientes', 'hechas'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn !py-1.5 capitalize ${filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card text-center text-slate-500">
          {tasks.length === 0 ? 'Aún no tienes tareas. Añade la primera arriba.' : 'No hay tareas en este filtro.'}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((t) => (
            <li key={t.id} className="card flex items-center gap-3 !p-4">
              <button onClick={() => toggleTask(t.id)} aria-label={t.done ? 'Marcar como pendiente' : 'Completar tarea'}
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${t.done ? 'border-secondary bg-secondary text-white' : 'border-slate-300 text-transparent'}`}>
                <Check size={16} />
              </button>
              <span className={`flex-1 break-words ${t.done ? 'text-slate-400 line-through' : 'font-medium'}`}>{t.title}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[t.priority]}`}>{t.priority}</span>
              <button onClick={() => edit(t)} aria-label="Editar tarea" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary"><Pencil size={18} /></button>
              <button onClick={() => deleteTask(t.id)} aria-label="Eliminar tarea" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
