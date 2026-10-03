import { CheckSquare, Flame, Star, Trophy } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import StatCard from '../components/StatCard.jsx';
import TaskItem from '../components/TaskItem.jsx';
import { useApp } from '../context/AppContext.jsx';

function MiniBar({ label, value, color }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-slate-500">{value}%</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Dashboard({ go }) {
  const { stats, tasks, today, toggleTask } = useApp();
  const w = stats.current;
  const todayTasks = tasks.filter((t) => t.date === today).sort((a, b) => Number(a.done) - Number(b.done));
  const date = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <PageHeader title="Tu semana" subtitle={date.charAt(0).toUpperCase() + date.slice(1)} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex flex-col items-center gap-2">
          <ProgressRing value={w.global} label="semanal" />
          <p className="text-sm text-slate-500">Progreso global de la semana</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 md:col-span-2">
          <StatCard icon={Star} label="Puntos" value={stats.points} tone="accent" />
          <StatCard icon={Flame} label="Racha actual" value={`${stats.streak} d`} tone="secondary" />
          <StatCard icon={Trophy} label="Mejor racha" value={`${stats.bestStreak} d`} />
          <button onClick={() => go('tasks')} className="card text-left sm:col-span-3">
            <div className="mb-3 flex items-center gap-2 font-bold"><CheckSquare size={18} className="text-primary" /> Resumen de tareas</div>
            <p className="text-sm text-slate-600">
              {w.tDone} de {w.tTotal} completadas esta semana · {stats.pending} pendientes en total
            </p>
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <h2 className="font-bold">Resumen de hábitos</h2>
          <MiniBar label="Nutrición" value={w.nutritionPct} color="#37E0C8" />
          <MiniBar label="Salud" value={w.healthPct} color="#9E69FF" />
          <button className="btn-ghost" onClick={() => go('health')}>Marcar hábitos de hoy</button>
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold">Tareas de hoy</h2>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tienes tareas para hoy. Añádelas desde Semana o Tareas.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {todayTasks.slice(0, 5).map((t) => (
                <TaskItem key={t.id} task={t} onToggle={() => toggleTask(t.id)} onEdit={() => go('tasks')} onDelete={() => go('tasks')} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
