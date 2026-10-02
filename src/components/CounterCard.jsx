import { Minus, Plus } from 'lucide-react';

export default function CounterCard({ icon: Icon, label, value = 0, unit, goal, step = 1, max = 100000, onChange, tone = '#0D4FB5' }) {
  const set = (v) => onChange(Math.max(0, Math.min(max, Math.round(v * 10) / 10)));
  const progress = goal ? Math.min((value / goal) * 100, 100) : 0;
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: tone }}>
          <Icon size={20} />
        </span>
        <div className="flex-1">
          <p className="font-bold">{label}</p>
          {goal && <p className="text-xs text-slate-500">Meta: {goal.toLocaleString('es-ES')} {unit}</p>}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button type="button" aria-label={`Restar ${label}`} className="btn-ghost h-10 w-10 !p-0" onClick={() => set(value - step)}>
          <Minus size={18} />
        </button>
        <p className="text-2xl font-extrabold">
          {value.toLocaleString('es-ES')} <span className="text-sm font-medium text-slate-500">{unit}</span>
        </p>
        <button type="button" aria-label={`Sumar ${label}`} className="btn-primary h-10 w-10 !p-0" onClick={() => set(value + step)}>
          <Plus size={18} />
        </button>
      </div>
      {goal && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: tone }} />
        </div>
      )}
    </div>
  );
}
