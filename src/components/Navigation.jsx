import { Apple, BarChart3, CheckSquare, HeartPulse, LayoutDashboard } from 'lucide-react';
import Logo from './Logo.jsx';

export const PAGES = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tareas', icon: CheckSquare },
  { id: 'nutrition', label: 'Nutrición', icon: Apple },
  { id: 'health', label: 'Salud', icon: HeartPulse },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
];

export function Sidebar({ page, onChange }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col gap-8 border-r border-slate-100 bg-white p-5 md:flex">
      <Logo height={52} />
      <nav className="flex flex-col gap-1">
        {PAGES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-current={page === id ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              page === id ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon size={20} /> {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function BottomNav({ page, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-slate-100 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {PAGES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          aria-current={page === id ? 'page' : undefined}
          className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
            page === id ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <Icon size={22} strokeWidth={page === id ? 2.6 : 2} />
          {label}
        </button>
      ))}
    </nav>
  );
}
