import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { CheckSquare, Flame, ListTodo, Star } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import StatCard from '../components/StatCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Dashboard({ go }) {
  const { stats, today } = useApp();
  const todayData = stats.today;
  const date = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <PageHeader title="Hola, buen día" subtitle={date.charAt(0).toUpperCase() + date.slice(1)} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex flex-col items-center gap-3 md:row-span-1">
          <ProgressRing value={todayData.total} label="de hoy" />
          <p className="text-sm text-slate-500">Progreso global del día</p>
          <div className="flex w-full gap-2">
            <button className="btn-ghost flex-1" onClick={() => go('nutrition')}>Nutrición {todayData.nutrition}%</button>
            <button className="btn-ghost flex-1" onClick={() => go('health')}>Salud {todayData.health}%</button>
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-bold">Resumen semanal</h2>
            <span className="text-sm text-slate-500">Media {stats.weekTotal}%</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.week} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} formatter={(v) => [`${v}%`, 'Progreso']} labelFormatter={(_, p) => p?.[0]?.payload.long} />
                <Bar dataKey="total" radius={[8, 8, 8, 8]}>
                  {stats.week.map((d) => (
                    <Cell key={d.key} fill={d.key === today ? '#9E69FF' : '#0D4FB5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Star} label="Puntos" value={stats.points} hint="Acumulados" tone="accent" />
        <StatCard icon={Flame} label="Racha" value={`${stats.streak} días`} hint={`Mejor: ${stats.bestStreak}`} tone="secondary" />
        <StatCard icon={ListTodo} label="Pendientes" value={stats.pending} hint="Tareas por hacer" />
        <StatCard icon={CheckSquare} label="Completadas" value={stats.doneCount} hint={`${stats.tasksPct}% del total`} tone="secondary" />
      </div>
    </>
  );
}
