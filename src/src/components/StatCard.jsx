const TONES = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-teal-700',
  accent: 'bg-accent-soft text-accent',
};

export default function StatCard({ icon: Icon, label, value, hint, tone = 'primary' }) {
  return (
    <div className="card flex items-center gap-4">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-extrabold leading-tight">{value}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}
