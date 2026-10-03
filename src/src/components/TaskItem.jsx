import { Check, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dates.js';

const BADGE = { alta: 'bg-red-100 text-red-700', media: 'bg-amber-100 text-amber-700', baja: 'bg-secondary-soft text-teal-700' };

/** Tarea reutilizable en listas y en el calendario. `onMove(-1|1)` activa las flechas de mover de día. */
export default function TaskItem({ task, onToggle, onEdit, onDelete, onMove, showDate = false }) {
  return (
    <li
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
      className="flex items-start gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
    >
      <button onClick={onToggle} aria-label={task.done ? 'Marcar como pendiente' : 'Completar tarea'}
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${task.done ? 'border-secondary bg-secondary text-white' : 'border-slate-300 text-transparent'}`}>
        <Check size={14} />
      </button>
      <div className="min-w-0 flex-1">
        <p className={`break-words text-sm ${task.done ? 'text-slate-400 line-through' : 'font-semibold'}`}>{task.title}</p>
        {task.description && <p className="break-words text-xs text-slate-500">{task.description}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${BADGE[task.priority]}`}>{task.priority}</span>
          {showDate && <span className="text-[11px] text-slate-400">{formatDate(task.date)}</span>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-0.5 sm:flex-row">
        {onMove && (
          <>
            <button onClick={() => onMove(-1)} aria-label="Mover al día anterior" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><ChevronLeft size={16} /></button>
            <button onClick={() => onMove(1)} aria-label="Mover al día siguiente" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><ChevronRight size={16} /></button>
          </>
        )}
        <button onClick={onEdit} aria-label="Editar tarea" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-primary"><Pencil size={16} /></button>
        <button onClick={onDelete} aria-label="Eliminar tarea" className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
      </div>
    </li>
  );
}
