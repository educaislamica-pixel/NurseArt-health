import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Flame, Star, Trophy } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useApp } from '../context/AppContext.jsx';

const COLORS = ['#0D4FB5', '#37E0C8', '#9E69FF'];

function Bar100({ label, value, color }) {
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
  const pie = stats.pointsBySource.filter((s) => s.value > 0);

  return (
    <>
      <PageHeader title="Estadísticas" subtitle="Tu semana de lunes a domingo" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Star} label="Puntos" value={stats.points} tone="accent" />
        <StatCard icon={Flame} label="Racha actual" value={`${stats.streak} días`} tone="secondary" />
        <StatCard icon={Trophy} label="Mejor racha" value={`${stats.bestStreak} días`} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 font-bold">Puntos por área</h2>
          {pie.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">Completa tareas o hábitos para ver el reparto.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {pie.map((s) => <Cell key={s.name} fill={COLORS[stats.pointsBySource.findIndex((x) => x.name === s.name)]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} pts`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="mb-2 font-bold">Progreso semanal</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.week} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} unit="%" />
                <Tooltip cursor={{ fill: '#F1F5F9' }} labelFormatter={(_, p) => p?.[0]?.payload.long} formatter={(v, n) => [`${v}%`, n]} />
                <Legend />
                <Bar dataKey="nutrition" name="Nutrición" fill="#37E0C8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="health" name="Salud" fill="#9E69FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-4 flex flex-col gap-4">
        <h2 className="font-bold">Porcentajes</h2>
        <Bar100 label="Nutrición (media semanal)" value={stats.weekNutrition} color="#37E0C8" />
        <Bar100 label="Salud (media semanal)" value={stats.weekHealth} color="#9E69FF" />
        <Bar100 label="Tareas completadas" value={stats.tasksPct} color="#0D4FB5" />
      </div>
    </>
  );
}
