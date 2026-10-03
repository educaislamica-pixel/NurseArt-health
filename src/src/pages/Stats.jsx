import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, Flame, Star, Trophy } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useApp } from '../context/AppContext.jsx';

function Meter({ label, value, color }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-slate-500">{value}%</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Stats() {
  const { stats } = useApp();
  const w = stats.current;
  const pie = [
    { name: 'Completado', value: w.done },
    { name: 'Pendiente', value: w.total - w.done },
  ];
  const b = stats.pointsBreakdown;

  return (
    <>
      <PageHeader title="Estadísticas" subtitle="Semana actual, de lunes a domingo" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Star} label="Puntos" value={stats.points} tone="accent" />
        <StatCard icon={Flame} label="🔥 Racha actual" value={`${stats.streak} días`} tone="secondary" />
        <StatCard icon={Trophy} label="🏆 Mejor racha" value={`${stats.bestStreak} días`} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 font-bold">Completado y pendiente</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  <Cell fill="#37E0C8" /><Cell fill="#E2E8F0" />
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-2 font-bold">Progreso semanal</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={w.days} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} unit="%" />
                <Tooltip cursor={{ fill: '#F1F5F9' }} labelFormatter={(_, p) => p?.[0]?.payload.name} formatter={(v, n) => [`${v}%`, n]} />
                <Legend />
                <Bar dataKey="tasks" name="Tareas" fill="#0D4FB5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="nutrition" name="Nutrición" fill="#37E0C8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="health" name="Salud" fill="#9E69FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <h2 className="font-bold">Porcentajes</h2>
          <Meter label="Global" value={w.global} color="#0D4FB5" />
          <Meter label="Tareas" value={w.tasksPct} color="#0D4FB5" />
          <Meter label="Nutrición" value={w.nutritionPct} color="#37E0C8" />
          <Meter label="Salud" value={w.healthPct} color="#9E69FF" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold">Puntos</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><dt>Tareas (+10)</dt><dd className="font-bold">{b.tasks}</dd></div>
            <div className="flex justify-between"><dt>Hábitos (+5)</dt><dd className="font-bold">{b.habits}</dd></div>
            <div className="flex justify-between"><dt>Semanas &gt; 80 % (+100)</dt><dd className="font-bold">{b.weeks}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-primary">{stats.points}</dd></div>
          </dl>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="mb-3 font-bold">Logros</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {stats.achievements.map((a) => (
            <li key={a.id} className={`rounded-xl p-3 ring-1 ${a.unlocked ? 'bg-accent-soft ring-accent/30' : 'bg-slate-50 ring-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Award size={20} className={a.unlocked ? 'text-accent' : 'text-slate-300'} />
                <span className="font-bold">{a.title}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{a.desc}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">{a.unlocked ? 'Conseguido' : `${a.progress}/${a.goal}`}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
