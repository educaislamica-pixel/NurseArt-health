import { Cherry, Coffee, Droplets, Soup, Utensils } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CounterCard from '../components/CounterCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ToggleCard from '../components/ToggleCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { GOALS } from '../utils/helpers.js';

const MEALS = [
  { id: 'breakfast', label: 'Desayuno saludable', hint: 'Fruta, cereales integrales o proteína', icon: Coffee },
  { id: 'lunch', label: 'Comida equilibrada', hint: 'Verdura, proteína e hidratos', icon: Utensils },
  { id: 'dinner', label: 'Cena saludable', hint: 'Ligera y sin ultraprocesados', icon: Soup },
  { id: 'fruit', label: 'Fruta', hint: 'Al menos una pieza', icon: Cherry },
];
const ITEMS = [...MEALS.map((m) => m.id), 'water'];

export default function Nutrition() {
  const { nutrition, patchNutrition, stats, today } = useApp();
  const day = nutrition[today] || {};
  const completed = MEALS.filter((m) => day[m.id]).length + (day.water >= GOALS.water ? 1 : 0);

  return (
    <>
      <PageHeader title="Nutrición" subtitle={`${completed} de ${ITEMS.length} objetivos de hoy`} />

      <div className="grid gap-3 md:grid-cols-2">
        {MEALS.map((m) => (
          <ToggleCard key={m.id} {...m} checked={!!day[m.id]} onChange={(v) => patchNutrition({ [m.id]: v })} />
        ))}
        <div className="md:col-span-2">
          <CounterCard icon={Droplets} label="Agua" unit="vasos" goal={GOALS.water} max={30}
            value={day.water || 0} tone="#37E0C8" onChange={(v) => patchNutrition({ water: v })} />
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="mb-3 font-bold">Seguimiento semanal</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.week} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} unit="%" />
              <Tooltip cursor={{ fill: '#F1F5F9' }} formatter={(v) => [`${v}%`, 'Nutrición']} labelFormatter={(_, p) => p?.[0]?.payload.long} />
              <Bar dataKey="nutrition" fill="#37E0C8" radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
          {stats.week.map((d) => {
            const n = nutrition[d.key] || {};
            return (
              <div key={d.key} className="rounded-xl bg-slate-50 py-2">
                <p className="font-bold">{d.label}</p>
                <p className="text-slate-500">{MEALS.filter((m) => n[m.id]).length}/4</p>
                <p className="text-slate-500">{n.water || 0}💧</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
