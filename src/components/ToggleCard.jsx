import { Check } from 'lucide-react';

export default function ToggleCard({ icon: Icon, label, hint, checked, onChange, tone = '#37E0C8' }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`card flex w-full items-center gap-4 text-left transition active:scale-[.98] ${checked ? 'ring-2' : ''}`}
      style={checked ? { '--tw-ring-color': tone } : undefined}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white" style={{ background: tone }}>
        <Icon size={22} />
      </span>
      <span className="flex-1">
        <span className="block font-bold">{label}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border-2 ${
          checked ? 'border-transparent text-white' : 'border-slate-200 text-transparent'
        }`}
        style={checked ? { background: tone } : undefined}
      >
        <Check size={16} />
      </span>
    </button>
  );
}
