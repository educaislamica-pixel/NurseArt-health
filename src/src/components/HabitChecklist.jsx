import { Check } from 'lucide-react';

/** Checklist semanal: una fila por hábito y un botón por día. */
export default function HabitChecklist({ title, icon: Icon, tone, habits, days, weekData = {}, percent, onToggle }) {
  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: tone }}><Icon size={20} /></span>
        <h2 className="flex-1 text-lg font-bold">{title}</h2>
        <span className="text-xl font-extrabold" style={{ color: tone }}>{percent}%</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: tone }} />
      </div>
      <ul className="flex flex-col gap-4">
        {habits.map((h) => {
          const done = days.filter((d) => weekData[d.key]?.[h.id]).length;
          return (
            <li key={h.id}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-semibold">{h.label}</span>
                <span className="text-slate-400">{done}/7</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {days.map((d) => {
                  const on = !!weekData[d.key]?.[h.id];
                  return (
                    <button key={d.key} onClick={() => onToggle(d.key, h.id)} aria-pressed={on}
                      aria-label={`${h.label}, ${d.name}`}
                      className={`flex h-10 flex-col items-center justify-center rounded-lg text-[11px] font-bold transition active:scale-95 ${on ? 'text-white' : 'bg-slate-100 text-slate-400'}`}
                      style={on ? { background: tone } : undefined}>
                      {on ? <Check size={16} /> : d.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
